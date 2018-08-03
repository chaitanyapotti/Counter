In this article, we will create a series of contracts which will allow two people to exchange coins across chains in a trustless atomic manner. An atomic transaction is an indivisible and irreducible series of transactions such that either all occur, or nothing occurs. The contract used is complimentary to BIP-199 so it can be used to transact from ethereum based systems to ethereum based systems or Bitcoin based system(assuming HTLC is allowed).

The difficult problem with cross chain swaps is the off chain coordination required to have the two parties meet and agree on conditions. It is outside the scope of this article, but any communication channel can be used really; email, slack, twitter, reddit, etc….

The background work that makes all of this possible is from BIP-199:

“A Hashed Time-Locked Contract (HTLC) is a script that permits a designated party (the “seller”) to spend funds by disclosing the preimage of a hash. It also permits a second party (the “buyer”) to spend the funds after a timeout is reached, in a refund situation.”
Victor (the “buyer”) and Peggy (the “seller”) exchange public keys and mutually agree upon a timeout threshold.
Peggy provides a hash digest. Both parties can now
 — construct the script and P2SH address for the HTLC.
 — Victor sends funds to the P2SH address or contract.
Either:
 Peggy spends the funds, and in doing so, reveals the preimage to Victor in the transaction; OR Victor recovers the funds after the timeout threshold.
On the Ether chains:

Peggy will be played by account: 0x9552ae966A8cA4E0e2a182a2D9378506eB057580

Victor will be played by account: 0x00D29a21429ad90230aCe2B9a1b25fa35bb288B8

The entire transaction explained:

Peggy will:

be locking up funds on etc chain (contract A)
that will be sent to Victor
when the message that hashes to digest is received
Victor will:

be locking up funds on eth chain (contract B)
that will be sent to Peggy
when the message that hashes to digest is received
Things that need to happen off chain:

both parties agree to an exchange rate
decide on a reasonable time limit
decide on who will lead (generate the preimage)
share public addresses
For our test conditions:

Peggy is the lead and will generate a sha256 digest off chain
Our preimage(“this is a test”) hashes to 2e99758548972a8e8822ad47fa1017ff72f06f3ff6a016851f45c398732bc50c
1 hour timeout
1:50 (1 eth = 50 etc) exchange rate
Everything for the test was deployed to the mainnets of both chains and is there available for review. I have included links where practical. All contracts were deployed with MyEtherWallet using byte code generated from the contract located here. To use this contract as is with out spinning up a node: copy and paste it into remix, fill in the variables for your transaction (hash, time, destination) and copy the byte code to MyEtherWallet to sign and deploy. You will need to create new contracts for your swap .To interact with the contract you can use this abi with the contract address in MyEtherWallet.

Step 1: Contracts are deployed
 Peggy deploys ContractA = 0xa1562aa5ad1e178c56f690c6e776c3c3a2c50193 (etc chain)
 Victor deploys ContractB = 0x7cfc4442dd96d6f85dd41d458a13957ba381e05a (eth chain)

Step 2: Both parties lock funds in their contracts
 Peggy sends .5 etc to 0xa1562aa5ad1e178c56f690c6e776c3c3a2c50193 
 Victor sends .01 eth to 0x7cfc4442dd96d6f85dd41d458a13957ba381e05a

Step 3: claim cross chain funds
 Peggy claims her funds from contract B, reveling the secret 
 Victor read data from contract B , get the key, and claims funds on contract A

That’s it! A little anti-climatic that it only takes 3 steps I guess, but everything on a block chain doesn't need to be hard. If Peggy never claims her ether, Victor can never claim his. If Peggy does claim her’s she reveals the secret and Victor is free to claim his. The timeout exists so Peggy and Victor can claim their funds if something goes wrong.