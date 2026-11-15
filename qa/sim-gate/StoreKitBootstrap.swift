import StoreKitTest
import XCTest

/// Runs inside the app process (TEST_HOST) so SKTestSession attaches the
/// repo's qa/MomentumWomen.storekit file to this simulator. Later Maestro
/// launches reuse that StoreKit test environment.
final class StoreKitBootstrapTests: XCTestCase {
  func testEnableLocalStoreKit() throws {
    let out = ProcessInfo.processInfo.environment["SIM_QA_OUT"] ?? "/tmp/sim-qa"
    try FileManager.default.createDirectory(atPath: out, withIntermediateDirectories: true)
    let note = URL(fileURLWithPath: out).appendingPathComponent("storekit-bootstrap.txt")

    let bundle = Bundle(for: StoreKitBootstrapTests.self)
    let inTest = bundle.url(forResource: "MomentumWomen", withExtension: "storekit")
    let inHost = Bundle.main.url(forResource: "MomentumWomen", withExtension: "storekit")
    guard inTest != nil || inHost != nil else {
      let message = "MomentumWomen.storekit missing from test bundle and host app"
      try message.write(to: note, atomically: true, encoding: .utf8)
      XCTFail(message)
      return
    }

    let session = try SKTestSession(configurationFileNamed: "MomentumWomen")
    session.disableDialogs = false
    session.clearTransactions()
    let message = "enabled storekit config dialogs=on transactions-cleared"
    try message.write(to: note, atomically: true, encoding: .utf8)
  }
}
