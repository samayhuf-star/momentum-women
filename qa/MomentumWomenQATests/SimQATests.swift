import XCTest

final class SimQATests: XCTestCase {
  func testMomentumFlow() throws {
    let out = ProcessInfo.processInfo.environment["TEST_RUNNER_SIM_QA_OUT"] ?? "/tmp/sim-qa"
    try FileManager.default.createDirectory(atPath: out, withIntermediateDirectories: true)
    var steps: [[String: Any]] = []
    func step(_ name: String, _ ok: Bool, _ detail: String) {
      steps.append(["step": steps.count + 1, "name": name, "pass": ok, "detail": detail])
      let line = "[momentum-qa] \(ok ? "PASS" : "FAIL") \(name): \(detail)\n"
      if let data = line.data(using: .utf8) {
        let url = URL(fileURLWithPath: out).appendingPathComponent("qa.log")
        if FileManager.default.fileExists(atPath: url.path), let handle = try? FileHandle(forWritingTo: url) {
          handle.seekToEndOfFile(); handle.write(data); try? handle.close()
        } else {
          try? data.write(to: url)
        }
      }
    }
    func shot(_ name: String) {
      let shot = XCUIScreen.main.screenshot()
      let url = URL(fileURLWithPath: out).appendingPathComponent("\(name).png")
      try? shot.pngRepresentation.write(to: url)
    }
    func save() {
      let url = URL(fileURLWithPath: out).appendingPathComponent("results.json")
      let data = try? JSONSerialization.data(withJSONObject: ["steps": steps], options: [.prettyPrinted])
      try? data?.write(to: url)
    }

    let app = XCUIApplication()
    app.launch()

    // Match by accessibility identifier (RN testID) on any element type, so a
    // touchable reported as Other instead of Button is still found.
    func el(_ id: String) -> XCUIElement {
      app.descendants(matching: .any).matching(identifier: id).firstMatch
    }

    let guest = el("continue-as-guest")
    let home = el("home")
    if guest.waitForExistence(timeout: 15) {
      guest.tap()
      step("guest", true, "tapped Continue as Guest")
    } else {
      let inApp = home.exists
      step("guest", inApp, inApp ? "already in the app" : "neither guest screen nor home found")
    }

    let homeOk = home.waitForExistence(timeout: 10)
    step("home", homeOk, homeOk ? "home visible" : "missing testID home")
    shot("01-home")
    XCTAssertTrue(homeOk)

    let start = el("start-workout")
    let startOk = start.waitForExistence(timeout: 6)
    step("start", startOk, startOk ? "tapped start" : "missing start-workout")
    if startOk { start.tap() }

    let workout = el("workout")
    let workoutOk = workout.waitForExistence(timeout: 8)
    let detail = el("exercise-detail")
    let detailOk = detail.waitForExistence(timeout: 4)
    step("workout", workoutOk, workoutOk ? "workout visible" : "missing testID workout")
    step("exercise-detail", detailOk, detailOk ? "exercise media visible" : "missing testID exercise-detail")
    shot("02-workout")
    XCTAssertTrue(workoutOk)
    XCTAssertTrue(detailOk)

    let closeWorkout = el("close-workout")
    if closeWorkout.waitForExistence(timeout: 2) {
      closeWorkout.tap()
    }
    _ = home.waitForExistence(timeout: 6)

    let paywallBtn = el("open-paywall")
    let payBtnOk = paywallBtn.waitForExistence(timeout: 6)
    step("open-paywall", payBtnOk, payBtnOk ? "tapped paywall" : "missing open-paywall")
    if payBtnOk { paywallBtn.tap() }

    let paywall = el("paywall")
    let payOk = paywall.waitForExistence(timeout: 8)
    step("paywall", payOk, payOk ? "paywall visible" : "missing testID paywall")
    shot("03-paywall")
    XCTAssertTrue(payOk)

    let restore = el("restore")
    step("restore", restore.waitForExistence(timeout: 4), "Restore control")
    let yearly = el("buy-yearly")
    step("yearly-cta", yearly.waitForExistence(timeout: 4), "yearly plan loaded from StoreKit")

    save()
  }
}
