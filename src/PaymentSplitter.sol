// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentSplitter
 * @author RealFlow Studio
 * @notice Splits incoming payments among multiple recipients based on allocated shares
 * @dev Supports up to 100 payees with proportional share distribution
 */
contract PaymentSplitter is Ownable {
    struct Payee {
        address account;
        uint256 shares;
    }

    /// @notice Array of payees
    Payee[] private _payees;

    /// @notice Total shares across all payees
    uint256 private _totalShares;

    /// @notice Total payments received
    uint256 private _totalReleased;

    /// @notice Mapping of payee to released amount
    mapping(address => uint256) private _released;

    /// @notice Event emitted when payment is released to a payee
    event PaymentReleased(address indexed payee, uint256 amount);
    
    /// @notice Event emitted when new payee is added
    event PayeeAdded(address indexed account, uint256 shares);
    
    /// @notice Event emitted when shares are updated
    event SharesUpdated(address indexed account, uint256 oldShares, uint256 newShares);

    /// @notice Error for invalid payee address
    error InvalidPayee();
    
    /// @notice Error for zero shares
    error ZeroShares();
    
    /// @notice Error for no shares
    error NoShares();

    /**
     * @notice Constructor sets the owner
     * @param owner_ Initial owner address
     */
    constructor(address owner_) Ownable(owner_) {}

    /**
     * @notice Add a new payee with shares
     * @param account Payee address
     * @param shares Number of shares (must be > 0)
     */
    function addPayee(address account, uint256 shares) external onlyOwner {
        if (account == address(0)) revert InvalidPayee();
        if (shares == 0) revert ZeroShares();

        _payees.push(Payee({account: account, shares: shares}));
        _totalShares += shares;
        _released[account] = 0;

        emit PayeeAdded(account, shares);
    }

    /**
     * @notice Add multiple payees at once
     * @param accounts Array of payee addresses
     * @param sharesArray Array of share amounts
     */
    function addPayees(address[] calldata accounts, uint256[] calldata sharesArray) external onlyOwner {
        require(accounts.length == sharesArray.length, "Length mismatch");
        require(accounts.length > 0, "Empty arrays");

        for (uint256 i = 0; i < accounts.length; i++) {
            if (accounts[i] == address(0)) revert InvalidPayee();
            if (sharesArray[i] == 0) revert ZeroShares();

            _payees.push(Payee({account: accounts[i], shares: sharesArray[i]}));
            _totalShares += sharesArray[i];
            _released[accounts[i]] = 0;

            emit PayeeAdded(accounts[i], sharesArray[i]);
        }
    }

    /**
     * @notice Update shares for an existing payee
     * @param account Payee address
     * @param newShares New share amount
     */
    function updateShares(address account, uint256 newShares) external onlyOwner {
        if (newShares == 0) revert ZeroShares();

        for (uint256 i = 0; i < _payees.length; i++) {
            if (_payees[i].account == account) {
                uint256 oldShares = _payees[i].shares;
                _totalShares = _totalShares - oldShares + newShares;
                _payees[i].shares = newShares;
                
                emit SharesUpdated(account, oldShares, newShares);
                return;
            }
        }
        revert NoShares();
    }

    /**
     * @notice Release all pending payment to a payee
     * @param account Payee address
     */
    function release(address account) external {
        uint256 payment = pendingPayment(account);
        require(payment > 0, "No payment to release");

        _released[account] += payment;
        _totalReleased += payment;

        (bool success, ) = account.call{value: payment}("");
        require(success, "Transfer failed");

        emit PaymentReleased(account, payment);
    }

    /**
     * @notice Calculate pending payment for a payee
     * @param account Payee address
     * @return Amount pending for release
     */
    function pendingPayment(address account) public view returns (uint256) {
        uint256 totalAmount = address(this).balance + _totalReleased;
        uint256 releasable = 0;

        for (uint256 i = 0; i < _payees.length; i++) {
            if (_payees[i].account == account) {
                releasable = (totalAmount * _payees[i].shares) / _totalShares;
                break;
            }
        }

        return releasable - _released[account];
    }

    /**
     * @notice Get number of payees
     * @return Number of payees
     */
    function payeeCount() external view returns (uint256) {
        return _payees.length;
    }

    /**
     * @notice Get payee details at index
     * @param index Index in payees array
     * @return account Payee address
     * @return shares Payee shares
     */
    function payee(uint256 index) external view returns (address account, uint256 shares) {
        require(index < _payees.length, "Index out of bounds");
        account = _payees[index].account;
        shares = _payees[index].shares;
    }

    /**
     * @notice Get all payees
     * @return accounts Array of payee addresses
     * @return sharesArray Array of share amounts
     */
    function getAllPayees() external view returns (address[] memory accounts, uint256[] memory sharesArray) {
        accounts = new address[](_payees.length);
        sharesArray = new uint256[](_payees.length);

        for (uint256 i = 0; i < _payees.length; i++) {
            accounts[i] = _payees[i].account;
            sharesArray[i] = _payees[i].shares;
        }
    }

    /**
     * @notice Get total shares
     * @return Total shares
     */
    function totalShares() external view returns (uint256) {
        return _totalShares;
    }

    /**
     * @notice Get total released amount
     * @return Total released
     */
    function totalReleased() external view returns (uint256) {
        return _totalReleased;
    }

    /**
     * @notice Get released amount for a payee
     * @param account Payee address
     * @return Released amount
     */
    function released(address account) external view returns (uint256) {
        return _released[account];
    }

    /**
     * @notice Receive ether
     */
    receive() external payable {}
}
