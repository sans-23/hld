Created November 4, 2025
Topic Concurrency Control in Distributed Systems
Level System Design - Advanced

---

# TITLE Two-Phase Locking 2PL - Complete Guide

## 1. The Fundamental Problem

### Scenario Flight Booking System

**Components**
- Booking Service
- Payment Service  
- Inventory Service

**Time** | **Alices Transaction** | **Bobs Transaction**
--- | --- | ---
T1 | Read 1 seat available |
T2 | | Read 1 seat available
T3 | Check payment 500 OK |
T4 | | Check payment 500 OK
T5 | Book seat 1 - 0 |
T6 | | Book seat 0 - -1 DISASTER!
T7 | Commit |
T8 | | Commit

**Result** OVERBOOKED FLIGHT!

**TABLE Problem** Flight XYZ has only 1 seat left. Alice and Bob try to book simultaneously.

### Why This Happens Lost Update Problem

Both transactions
1. Read the same data 1 seat available
2. Made decisions based on stale data
3. Overwrote each others changes
4. No coordination between them

### Other Concurrency Problems

**Problem** | **Description** | **Example**
--- | --- | ---
**Dirty Read** | Reading uncommitted data | T1 writes qty0, crashes before commit T2 reads qty0 invalid!
**Non-Repeatable Read** | Same query returns different results | T1 reads qty5 twice, but T2 updated it to 3 in between
**Phantom Read** | New rows appear in range queries | T1 counts 10 orders, T2 inserts 1, T1 counts again - 11
**Lost Update** | Concurrent writes overwrite each other | Both Alice and Bob update balance, one update is lost

---

## What is 2PL?

**Two-Phase Locking** A concurrency control protocol that ensures transactions dont interfere with each other by acquiring and releasing locks in two distinct phases

### The Two Phases

#### Phase 1 Growing Phase Lock Acquisition

**Can**
- Acquire locks shared or exclusive

**Cannot**
- Release any locks

**Rule** Once you release even ONE lock, this phase ends forever

#### Phase 2 Shrinking Phase Lock Release

**Can**
- Release locks

**Cannot**
- Acquire new locks

**Rule** Once you start releasing, no going back!

### Analogy Library Books

**Growing Phase** I need these 5 books for my research
- Check out Book 1
- Check out Book 2
- Check out Book 3
- Check out Book 4  
- Check out Book 5
- Cannot return any book yet!

**Shrinking Phase** Im done with my research, returning books
- Return Book 1
- Return Book 2
- Return Book 3
- Return Book 4
- Return Book 5
- Cannot check out any new books now!

### Lock Types

#### 1. Shared Lock S-Lock Read Lock

- Multiple transactions can hold S-Lock on same data
- **Purpose** Reading data
- **Symbol** SX Shared lock on X

**Example**
```
T1 S-Lockbalance - Read balance - Others can also read
T2 S-Lockbalance - Read balance - Allowed!
T3 X-Lockbalance - Write balance - BLOCKED! Must wait
```

#### 2. Exclusive Lock X-Lock Write Lock

- Only ONE transaction can hold X-Lock on data
- **Purpose** Writing data  
- **Symbol** XX Exclusive lock on X

**Example**
```
T1 X-Lockbalance - Update balance - Nobody else allowed
T2 S-Lockbalance - Read balance - BLOCKED! Must wait
T3 X-Lockbalance - Write balance - BLOCKED! Must wait
```

### Lock Compatibility Matrix

**Requested Lock** | **Existing S-Lock** | **Existing X-Lock**
--- | --- | ---
**S-Lock** | ✓ | ✗
**X-Lock** | ✗ | ✗

**Key Insights**
- Multiple readers can coexist S S
- Reader Writer conflict S X
- Writer Writer conflict X X

## How 2PL Works

### Example Flight Booking Fixed with 2PL

**Time** | **Alices Transaction** | **Bobs Transaction**
--- | --- | ---
T1 | BEGIN TRANSACTION |
T2 | X-LOCKseatcount - Growing |
T3 | Read 1 seat available |
T4 | | BEGIN TRANSACTION
T5 | | X-LOCKseatcount WAITING!
T6 | Validate payment 500 OK | Still waiting...
T7 | Update seatcount 0 | Still waiting...
T8 | UNLOCKseatcount - Shrinking | Still waiting...
T9 | COMMIT | Still waiting...
T10 | | X-LOCK acquired!
T11 | | Read 0 seats available
T12 | | Cannot book! Show error
T13 | | UNLOCKseatcount
T14 | | COMMIT

**Result** Alice got the seat, Bob got proper error.

### Code Example PostgreSQL

```sql
-- Alices Transaction
BEGIN

-- Growing Phase Acquire exclusive lock
SELECT availableseats FROM flights 
WHERE flightid XYZ123 FOR UPDATE -- X-Lock acquired!

-- Still in Growing Phase can acquire more locks
SELECT balance FROM userwallet 
WHERE userid alice FOR UPDATE -- Another X-Lock!

-- Perform business logic
UPDATE flights SET availableseats availableseats - 1 
WHERE flightid XYZ123

UPDATE userwallet SET balance balance - 500 
WHERE userid alice

-- Shrinking Phase begins here
COMMIT -- All locks released
-- Cannot acquire new locks after COMMIT!
```

```sql
-- Bobs Transaction runs simultaneously with Alices
START TRANSACTION

-- Tries to acquire lock
SELECT availableseats FROM flights 
WHERE flightid XYZ123 FOR UPDATE
-- WAITING... blocked by Alices X-Lock
-- InnoDB waits for innodblockwaittimeout default 50 seconds

-- Once Alice commits, lock is released
-- Bobs query returns availableseats 0

-- Bob sees no seats available
IF availableseats 0 THEN
    ROLLBACK -- No booking possible
    RETURN Flight full
END IF

COMMIT
```

## 2PL in Distributed Systems

### The Challenge

In microservices, each service has its own database
- Payment Service
- Inventory Service
- Order Service
- Database 1
- Database 2
- Database 3

**Problem** How do you coordinate locks across separate databases?

### Solution 1 Distributed 2PL with 2PC Two-Phase Commit

#### Architecture

**COORDINATOR** Order Service
- Payment DB
- Inventory DB
- Order DB

#### Two-Phase Commit Protocol

**Phase 1 PREPARE Voting Phase**

**Time** | **Coordinator** | **Participants**
--- | --- | ---
T1 | Write to log BEGIN 2PC |
T2 | Send PREPARE to all |
T3 | | Payment LOCKuserbalance
T4 | | Payment Validate OK
T5 | | Payment Write to log READY
T6 | | Payment Reply VOTECOMMIT
T7 | | Inventory LOCKproductstock
T8 | | Inventory Validate OK
T9 | | Inventory Write to log READY
T10 | | Inventory Reply VOTECOMMIT
T11 | | Order LOCKorderid
T12 | | Order Write to log READY
T13 | | Order Reply VOTECOMMIT
T14 | Collect all votes |
T15 | All voted COMMIT? |
T16 | Write to log COMMIT |

**Phase 2 COMMIT Decision Phase**

**Time** | **Coordinator** | **Participants**
--- | --- | ---
T17 | Send COMMIT to all |
T18 | | Payment Deduct 900
T19 | | Payment UNLOCKuserbalance
T20 | | Payment COMMIT
T21 | | Payment Reply ACK
T22 | | Inventory Reduce stock
T23 | | Inventory UNLOCKproductstock
T24 | | Inventory COMMIT
T25 | | Inventory Reply ACK
T26 | | Order Create order
T27 | | Order UNLOCKorderid
T28 | | Order COMMIT
T29 | | Order Reply ACK
T30 | Write to log COMPLETE |
T31 | Transaction SUCCESS! |

#### Abort Scenario

**Time** | **Coordinator** | **Participants**
--- | --- | ---
T1 | Send PREPARE to all |
T2 | | Payment LOCKuserbalance
T3 | | Payment Check balance 100
T4 | | Payment Insufficient funds!
T5 | | Payment Reply VOTEABORT
T6 | Received ABORT vote |
T7 | Write to log ABORT |
T8 | Send ROLLBACK to all |
T9 | | Payment UNLOCKuserbalance
T10 | | Payment ROLLBACK
T11 | | Inventory UNLOCKproductstock
T12 | | Inventory ROLLBACK
T13 | | Order UNLOCKorderid
T14 | | Order ROLLBACK
T15 | Transaction FAILED |

### Solution 2 Saga Pattern

**Philosophy** Instead of distributed locks, use compensating transactions.

#### Key Concepts
- No distributed locks
- Each service commits immediately
- If failure occurs, run compensation transactions to undo
- Eventual consistency

**Pros**
- Better performance
- No blocking
- Services loosely coupled
- Scales well

**Cons**
- Eventual consistency not immediate
- Complex compensation logic
- No rollback guarantee

## Common Pitfalls & Solutions

### Pitfall 1 Deadlocks

**Problem** Two transactions waiting for each other

**Solutions**
- Lock resources in consistent order
- Set lock timeouts
- Implement retry logic
- Use deadlock detection

### Pitfall 2 Long-Lived Locks

**Problem** Holding locks during slow operations

**Solution** Minimize lock duration
- Do expensive operations before acquiring locks
- Release locks as soon as possible

### Pitfall 3 Lock Escalation

**Problem** Locking too many rows

**Solution** Lock only what you need

## Transaction Isolation Levels

**Level** | **Dirty Read** | **Non-Repeatable Read** | **Phantom Read** | **Implementation**
--- | --- | --- | --- | ---
**READ UNCOMMITTED** | Possible | Possible | Possible | No locks
**READ COMMITTED** | Prevented | Possible | Possible | S-Locks released after read
**REPEATABLE READ** | Prevented | Prevented | Possible | S-Locks held until commit
**SERIALIZABLE** | Prevented | Prevented | Prevented | Full 2PL range locks

## Key Takeaways

### The Golden Rules
1. 2PL guarantees serializability - transactions appear to run one-at-a-time
2. Growing phase → Shrinking phase - no going back!
3. Deadlocks are possible - need detection or prevention
4. Context matters - choose based on contention and consistency needs
5. Trade-offs are everywhere - consistency vs performance vs availability

### When to Use What

**High Contention Critical Data** (money, inventory, bookings)
- Use 2PL with SERIALIZABLE isolation

**Read-Heavy Workload**
- Use MVCC (default in modern databases)

**Low Contention Non-Critical**
- Use Optimistic Locking

**Distributed Services Strong Consistency**
- Use 2PC (rare) or Hybrid (2PL for critical, Saga for non-critical)

**Distributed Services Availability Preferred**
- Use Saga with compensations

## Further Reading

### Academic Papers
- Concurrency Control and Recovery in Database Systems - Philip A. Bernstein, Nathan Goodman
- Granularity of Locks and Degrees of Consistency - Jim Gray et al.
- A Theory of Concurrency Control for Databases - H.T. Kung, John T. Robinson

### Real-World Systems
- PostgreSQL MVCC 2PL implementation
- Google Spanner TrueTime 2PL for global consistency
- MySQL InnoDB Deadlock detection algorithms
- MongoDB WiredTiger storage engine with MVCC

### Best Practices
- Designing Data-Intensive Applications - Martin Kleppmann
- Database reliability engineering patterns
- Microservices transaction patterns (Saga, 2PC)

---

**Created** November 4, 2025  
**Topic** Concurrency Control in Distributed Systems  
**Level** System Design - Advanced
