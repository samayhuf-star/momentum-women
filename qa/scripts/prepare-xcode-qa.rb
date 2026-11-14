#!/usr/bin/env ruby
# Post-prebuild only. Adds a UI-test target and wires the StoreKit config into the shared scheme.
require 'fileutils'
require 'xcodeproj'

REPO = File.expand_path('../..', __dir__)
IOS  = File.join(REPO, 'ios')
STOREKIT_SRC = File.join(REPO, 'qa', 'MomentumWomen.storekit')
TEST_SRC_DIR = File.join(REPO, 'qa', 'MomentumWomenQATests')
TEST_NAME = 'MomentumWomenQATests'
TEST_BUNDLE = 'com.samayvashsht.momentumwomen.qatests'

abort("ios/ is missing - run expo prebuild first") unless Dir.exist?(IOS)
abort("missing #{STOREKIT_SRC}") unless File.exist?(STOREKIT_SRC)

proj_path = Dir[File.join(IOS, '*.xcodeproj')].reject { |p| p.include?('.xcodeproj/') }.first
abort("no .xcodeproj under ios/") unless proj_path

project = Xcodeproj::Project.open(proj_path)
app_target = project.targets.find { |t| t.product_type == 'com.apple.product-type.application' }
abort("no application target in #{proj_path}") unless app_target

if project.targets.any? { |t| t.name == TEST_NAME }
  puts "target #{TEST_NAME} already exists - leaving it in place"
else
  dest = File.join(IOS, TEST_NAME)
  FileUtils.rm_rf(dest)
  FileUtils.mkdir_p(dest)
  FileUtils.cp(File.join(TEST_SRC_DIR, 'SimQATests.swift'), File.join(dest, 'SimQATests.swift'))
  FileUtils.cp(STOREKIT_SRC, File.join(dest, 'MomentumWomen.storekit'))

  test_target = project.new_target(:ui_test_bundle, TEST_NAME, :ios, '16.0')
  test_target.product_name = TEST_NAME
  test_target.add_dependency(app_target)

  group = project.main_group.find_subpath(TEST_NAME, true)
  group.set_source_tree('SOURCE_ROOT')
  group.set_path(TEST_NAME)
  swift_ref = group.new_file('SimQATests.swift')
  storekit_ref = group.new_file('MomentumWomen.storekit')
  test_target.add_file_references([swift_ref])
  test_target.add_resources([storekit_ref])

  test_target.build_configurations.each do |cfg|
    cfg.build_settings['PRODUCT_NAME'] = TEST_NAME
    cfg.build_settings['PRODUCT_MODULE_NAME'] = TEST_NAME
    cfg.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = TEST_BUNDLE
    cfg.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
    cfg.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
    cfg.build_settings['SWIFT_VERSION'] = '5.0'
    cfg.build_settings['TARGETED_DEVICE_FAMILY'] = '1'
    cfg.build_settings['TEST_TARGET_NAME'] = app_target.name
    cfg.build_settings.delete('BUNDLE_LOADER')
    cfg.build_settings.delete('TEST_HOST')
    cfg.build_settings['LD_RUNPATH_SEARCH_PATHS'] = '$(inherited) @executable_path/Frameworks @loader_path/Frameworks'
  end

  project.save
  puts "added UI test target #{TEST_NAME} to #{proj_path}"
end

scheme_dir = File.join(proj_path, 'xcshareddata', 'xcschemes')
scheme_path = Dir[File.join(scheme_dir, '*.xcscheme')].find { |p| File.basename(p, '.xcscheme') == app_target.name }
scheme_path ||= Dir[File.join(scheme_dir, '*.xcscheme')].first
abort("no shared scheme under #{scheme_dir}") unless scheme_path

scheme = Xcodeproj::XCScheme.new(scheme_path)
test_target = project.targets.find { |t| t.name == TEST_NAME }
unless scheme.test_action.testables.any? { |t| t.buildable_references.any? { |r| r.target_name == TEST_NAME } }
  scheme.add_test_target(test_target)
end
already = scheme.build_action.entries.any? do |e|
  e.buildable_references.any? { |r| r.target_name == TEST_NAME }
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

xml = File.read(scheme_path)
ref = %(<StoreKitConfigurationFileReference\n         identifier = "../../qa/MomentumWomen.storekit">\n      </StoreKitConfigurationFileReference>\n)
unless xml.include?('StoreKitConfigurationFileReference')
  %w[TestAction LaunchAction].each do |tag|
    xml.sub!(%r{</#{tag}>}) { "   #{ref}   </#{tag}>" }
  end
end
File.write(scheme_path, xml)
puts "wired StoreKit config #{STOREKIT_SRC}"
