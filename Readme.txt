In this article, we will create a series of contracts which will allow two people to exchange tokens (ERC20 compliant) across chains in a trustless atomic manner. 
An atomic transaction is an indivisible and irreducible series of transactions such that either all occur, or nothing occurs. 
The contract used is complimentary to BIP-199 so it can be used to transact from ethereum based systems to ethereum based systems or Bitcoin based system(assuming HTLC is allowed).

The difficult problem with cross chain swaps is the off chain coordination required to have the two parties meet and agree on conditions. 
Counter platform handles the coordination required to facilitate the swaps.

The background work that makes all of this possible is from BIP-199:

“A Hashed Time-Locked Contract (HTLC) is a script that permits a designated party (the “seller”) to spend funds by disclosing the preimage of a hash. 
It also permits a second party (the “buyer”) to spend the funds after a timeout is reached, in a refund situation.”

The timeout is 1 hr(default) on the counter platform.

Victor (the "acceptor") and Peggy (the “initiator”) enter into a transaction.

The entire transaction explained:

Peggy will:

be creating a transaction on etc chain (contract A)
that will be sent to Victor.

Parameters of the transaction:
1. public address of Victor
2. A hashed digest (hash of the secret message)
3. Token ERC20 compliant that she wishes to trade away
4. Amount of ERC20 compliant token that she wishes to trade away

When this transaction is created on Counter Smart Contract on the ETC Chain,
a notification will be sent to Victor on the Counter platform informing of the following details:

1. public address of Peggy
2. The hashed digest used by Peggy (hash of the secret message)

Victor will now be creating a transaction on his chain (ETH) using the following details against the 
Counter Smart contract on the ETH Chain.

1. public address of Peggy
2. The hashed digest used by Peggy (hash of the secret message)
3. Token ERC20 compliant that he wishes to trade away
4. Amount of ERC20 compliant token that he wishes to trade away

When this transaction is created on Counter Smart Contract on the ETH Chain,
a notification will be sent to Peggy on the Counter platform informing this:

Peggy can now claim the tokens she wishes to receive on the ETH chain at the Counter Smart Contract.

For Peggy to claim the tokens, she needs to send the Counter Smart Contract, the following details:
1. The original message (unhased secret message)
2. Public address of Victor
3. Amount expected of the token she wishes to receive.

Once peggy claims the tokens, it will reveal the secret on the blockchain which will be informed to Victor on the Counter platform.

Now, Victor has 1 hour to claim his tokens on ETC chain.


For Victor to claim the tokens, he needs to send the Counter Smart Contract, the following details:
1. The original message (unhased secret message) found from the claim transaction created by Peggy.
2. Public address of Peggy
3. Amount expected of the token he wishes to receive.

If Peggy never claims her tokens, Victor can never claim his. 
If Peggy does claim her’s, she reveals the secret and Victor is free to claim his. 
The timeout exists so Peggy and Victor can claim their funds if something goes wrong.