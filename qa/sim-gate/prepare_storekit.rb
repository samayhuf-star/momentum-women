#!/usr/bin/env ruby
# Post-prebuild only. Wires qa/MomentumWomen.storekit into the shared scheme
# and adds a hosted unit-test target that calls SKTestSession. Does not edit
# application source.
require 'fileutils'
require 'xcodeproj'

REPO = File.expand_path('../..', __dir__)
IOS = File.join(REPO, 'ios')
STOREKIT_SRC = File.join(REPO, 'qa', 'MomentumWomen.storekit')
TEST_SRC = File.join(REPO, 'qa', 'sim-gate', 'StoreKitBootstrap.swift')
TEST_NAME = 'StoreKitBootstrap'
TEST_BUNDLE = 'com.samayvashsht.momentumwomen.storekitbootstrap'

abort('ios/ is missing — run expo prebuild first') unless Dir.exist?(IOS)
abort("missing #{STOREKIT_SRC}") unless File.exist?(STOREKIT_SRC)
abort("missing #{TEST_SRC}") unless File.exist?(TEST_SRC)

proj_path = Dir[File.join(IOS, '*.xcodeproj')].reject { |p| p.include?('.xcodeproj/') }.first
abort('no .xcodeproj under ios/') unless proj_path

project = Xcodeproj::Project.open(proj_path)
app_target = project.targets.find { |t| t.product_type == 'com.apple.product-type.application' }
abort("no application target in #{proj_path}") unless app_target

dest = File.join(IOS, TEST_NAME)
FileUtils.mkdir_p(dest)
FileUtils.cp(TEST_SRC, File.join(dest, 'StoreKitBootstrap.swift'))
FileUtils.cp(STOREKIT_SRC, File.join(dest, 'MomentumWomen.storekit'))
# Scheme identifiers are resolved from the .xcodeproj container. Cover both
# the in-repo convention (../../qa/...) and a container of ios/.
FileUtils.mkdir_p(File.join(IOS, 'qa'))
FileUtils.cp(STOREKIT_SRC, File.join(IOS, 'qa', 'MomentumWomen.storekit'))

product = app_target.product_name.to_s
product = app_target.name if product.empty? || product.include?('$')
deployment = app_target.build_configurations.first.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] || '16.4'

unless project.targets.any? { |t| t.name == TEST_NAME }
  test_target = project.new_target(:unit_test_bundle, TEST_NAME, :ios, deployment)
  test_target.product_name = TEST_NAME
  test_target.add_dependency(app_target)

  group = project.main_group.find_subpath(TEST_NAME, true)
  group.set_source_tree('SOURCE_ROOT')
  group.set_path(TEST_NAME)
  swift_ref = group.new_file('StoreKitBootstrap.swift')
  storekit_ref = group.new_file('MomentumWomen.storekit')
  test_target.add_file_references([swift_ref])
  test_target.add_resources([storekit_ref])
  already_in_app = app_target.resources_build_phase.files.any? do |file|
    file.file_ref && File.basename(file.file_ref.path.to_s) == 'MomentumWomen.storekit'
  end
  app_target.add_resources([storekit_ref]) unless already_in_app

  begin
    test_target.add_system_framework('StoreKit')
    test_target.add_system_framework('StoreKitTest')
  rescue StandardError => e
    puts "framework link note: #{e}"
  end

  host = "$(BUILT_PRODUCTS_DIR)/#{product}.app/#{product}"
  test_target.build_configurations.each do |cfg|
    cfg.build_settings['PRODUCT_NAME'] = TEST_NAME
    cfg.build_settings['PRODUCT_MODULE_NAME'] = TEST_NAME
    cfg.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = TEST_BUNDLE
    cfg.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
    cfg.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = deployment
    cfg.build_settings['SWIFT_VERSION'] = '5.0'
    cfg.build_settings['TARGETED_DEVICE_FAMILY'] = '1'
    cfg.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
    cfg.build_settings['ENABLE_TESTING_SEARCH_PATHS'] = 'YES'
    cfg.build_settings['TEST_HOST'] = host
    cfg.build_settings['BUNDLE_LOADER'] = '$(TEST_HOST)'
    cfg.build_settings['LD_RUNPATH_SEARCH_PATHS'] = '$(inherited) @executable_path/Frameworks @loader_path/Frameworks'
  end
  puts "added hosted test target #{TEST_NAME} host=#{host}"
else
  puts "target #{TEST_NAME} already exists"
end

app_target.build_configurations.each do |cfg|
  cfg.build_settings['ENABLE_TESTABILITY'] = 'YES'
end
project.save

scheme_dir = File.join(proj_path, 'xcshareddata', 'xcschemes')
scheme_path = Dir[File.join(scheme_dir, '*.xcscheme')].find { |p| File.basename(p, '.xcscheme') == app_target.name }
scheme_path ||= Dir[File.join(scheme_dir, '*.xcscheme')].first
abort("no shared scheme under #{scheme_dir}") unless scheme_path

scheme = Xcodeproj::XCScheme.new(scheme_path)
test_target = project.targets.find { |t| t.name == TEST_NAME }
unless scheme.test_action.testables.any? { |t| t.buildable_references.any? { |r| r.target_name == TEST_NAME } }
  scheme.add_test_target(test_target)
end
already = scheme.build_action.entries.any? do |entry|
  entry.buildable_references.any? { |r| r.target_name == TEST_NAME }
end
unless already
  entry = Xcodeproj::XCScheme::BuildAction::Entry.new(test_target)
  entry.build_for_testing = true
  entry.build_for_running = false
  entry.build_for_profiling = false
  entry.build_for_archiving = false
  entry.build_for_analyzing = false
  scheme.build_action.add_entry(entry)
end
scheme.save!

# Same identifier the repo's qa/scripts/prepare-xcode-qa.rb uses. A copy also
# sits at ios/qa/ so either resolution base finds the file.
xml = File.read(scheme_path)
ref = %(      <StoreKitConfigurationFileReference\n         identifier = "../../qa/MomentumWomen.storekit">\n      </StoreKitConfigurationFileReference>\n)
unless xml.include?('StoreKitConfigurationFileReference')
  %w[TestAction LaunchAction].each do |tag|
    xml.sub!(%r{[ \t]*</#{tag}>}) { "#{ref}      </#{tag}>" }
  end
  File.write(scheme_path, xml)
end
puts "scheme #{scheme_path}"
puts "app target #{app_target.name} product #{product}"
puts "wired StoreKit config ../../qa/MomentumWomen.storekit"
