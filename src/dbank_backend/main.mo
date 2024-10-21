import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Time "mo:base/Time";

actor DBank {
  stable var balance : Float = 300.0;
  balance :=300.0;
  stable var lastInterestTime : Time.Time = Time.now();
  lastInterestTime:=Time.now();

  public func applyInterest(): async () {
    let currentTime = Time.now();
    let minutesElapsed = Float.fromInt((currentTime-lastInterestTime) / (1000000000*60));
    let interestRatePerMinute = 1.01;
    balance *= Float.pow(interestRatePerMinute, minutesElapsed);
    lastInterestTime := currentTime;
    Debug.print("Balance after applying interest: " # debug_show(balance));
  };

  public query func currentBalance(): async Float {
    Debug.print(debug_show(balance));
    return balance;
  };

  public func deposit(amount: Nat): async () {
    balance += Float.fromInt(amount);
    Debug.print("New Balance after deposit: " # debug_show(balance));
  };

  public func withdraw(amount: Nat): async () {
    let floatAmount = Float.fromInt(amount);
    if (floatAmount <= balance) {
      balance -= floatAmount;
      Debug.print("New Balance after withdrawal: " # debug_show(balance));
    } else {
      Debug.print("Insufficient balance for withdrawal.");
    }
  };
}
