# bc-hw1

## Part 1
```diff
index 6a777f2..712a2c0 100644
--- a/contracts/MultiSigWallet.sol
+++ b/contracts/MultiSigWallet.sol
@@ -22,6 +22,7 @@ contract MultiSigWallet {
      *  Constants
      */
     uint constant public MAX_OWNER_COUNT = 50;
+    uint constant public MAX_ETH_AMOUNT = 66 ether;

     /*
      *  Storage
@@ -83,6 +84,11 @@ contract MultiSigWallet {
         _;
     }

+    modifier validETHAmount(uint value) {
+        require(value <= MAX_ETH_AMOUNT);
+        _;
+    }
+
     modifier validRequirement(uint ownerCount, uint _required) {
         require(ownerCount <= MAX_OWNER_COUNT
             && _required <= ownerCount
@@ -289,6 +295,7 @@ contract MultiSigWallet {
     function addTransaction(address destination, uint value, bytes data)
         internal
         notNull(destination)
+        validETHAmount(value)
         returns (uint transactionId)
     {
         transactionId = transactionCount;
```

## Part 2
```diff
index 9d0c2825..b12fb3b1 100644
--- a/contracts/token/ERC20/ERC20.sol
+++ b/contracts/token/ERC20/ERC20.sol
@@ -39,6 +39,8 @@ contract ERC20 is Context, IERC20 {
     string private _name;
     string private _symbol;

+    uint constant DAY_IN_SECONDS = 86400;
+
     /**
      * @dev Sets the values for {name} and {symbol}.
      *
@@ -208,6 +210,8 @@ contract ERC20 is Context, IERC20 {
     function _transfer(address sender, address recipient, uint256 amount) internal virtual {
         require(sender != address(0), "ERC20: transfer from the zero address");
         require(recipient != address(0), "ERC20: transfer to the zero address");
+        uint8 weekDay = (uint8)((block.timestamp / DAY_IN_SECONDS + 4) % 7);
+        require(weekDay != 5, "ERC20: the token cannot be transferred on Saturdays");

         _beforeTokenTransfer(sender, recipient, amount);
```

## Part 3
```diff
index 651290f..81e9373 100644
--- a/contracts/token/DividendToken.sol
+++ b/contracts/token/DividendToken.sol
@@ -18,7 +18,7 @@ contract DividendToken is StandardToken, Ownable {
     event PayDividend(address indexed to, uint256 amount);
     event HangingDividend(address indexed to, uint256 amount) ;
     event PayHangingDividend(uint256 amount) ;
-    event Deposit(address indexed sender, uint256 value);
+    event Deposit(address indexed sender, uint256 value, bytes32 comment);

     /// @dev parameters of an extra token emission
     struct EmissionInfo {
@@ -37,9 +37,9 @@ contract DividendToken is StandardToken, Ownable {
         }));
     }

-    function() external payable {
+    function deposit(bytes32 comment) external payable {
         if (msg.value > 0) {
-            emit Deposit(msg.sender, msg.value);
+            emit Deposit(msg.sender, msg.value, comment);
             m_totalDividends = m_totalDividends.add(msg.value);
         }
     }
```