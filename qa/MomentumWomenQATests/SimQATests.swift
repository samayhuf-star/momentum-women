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

    let guest = app.buttons["continue-as-guest"]
    if guest.waitForExistence(timeout: 8) {
      guest.tap()
      step("guest", true, "tapped Continue as Guest")
    } else {
      step("guest", true, "already in the app")
    }

    let home = app.otherElements["home"]
    let homeOk = home.waitForExistence(timeout: 10)
    step("home", homeOk, homeOk ? "home visible" : "missing testID home")
    shot("01-home")
    XCTAssertTrue(homeOk)

    let start = app.buttons["start-workout"]
    let startOk = start.waitForExistence(timeout: 6)
    step("start", startOk, startOk ? "tapped start" : "missing start-workout")
    if startOk { start.tap() }

    let workout = app.otherElements["workout"]
    let workoutOk = workout.waitForExistence(timeout: 8)
    let detail = app.otherElements["exercise-detail"]
    let detailOk = detail.waitForExistence(timeout: 4)
    step("workout", workoutOk, workoutOk ? "workout visible" : "missing testID workout")
    step("exercise-detail", detailOk, detailOk ? "placeholder media visible" : "missing testID exercise-detail")
    shot("02-workout")
    XCTAssertTrue(workoutOk)
    XCTAssertTrue(detailOk)

    if app.buttons["Close"].waitForExistence(timeout: 2) {
      app.buttons["Close"].tap()
    } else {
      app.swipeDown()
    }
    _ = home.waitForExistence(timeout: 6)

    let paywallBtn = app.buttons["open-paywall"]
    let payBtnOk = paywallBtn.waitForExistence(timeout: 6)
    step("open-paywall", payBtnOk, payBtnOk ? "tapped paywall" : "missing open-paywall")
    if payBtnOk { paywallBtn.tap() }

    let paywall = app.otherElements["paywall"]
    let payOk = paywall.waitForExistence(timeout: 8)
    step("paywall", payOk, payOk ? "paywall visible" : "missing testID paywall")
    shot("03-paywall")
    XCTAssertTrue(payOk)

    let restore = app.buttons["restore"]
    step("restore", restore.waitForExistence(timeout: 4), "Restore control")
    let yearly = app.buttons["buy-yearly"]
    step("yearly-cta", yearly.waitForExistence(timeout: 4), "yearly plan loaded from StoreKit")

    save()
  }
}
