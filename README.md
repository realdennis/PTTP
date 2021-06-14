# PTTP
Peer Talks To Peer, based on IPFS, CLI tool.
It's a PoC of the p2p-secure chat, what we do is the following stuffs:
1. Deffie-Hellman exchange the session key
2. Using session key do the AES-192-CBC encrypt for the message text
3. Enjoy the non-censored & secure chat room.

![demo](https://user-images.githubusercontent.com/26633162/121899103-ad1a5e00-cd56-11eb-87a0-8a0df6b2cbe6.gif)


## Note
Currently it's un-stable, and only test in MDNS mode, and the relay mode is under developing `--relayCircuit`, so you guys can try to use it when you have a public IP.

## Install

```sh
$ npm install pttp -g
```

## Usage

Create room
```sh
$ pttp create 
# Run the above command in other machine:
# $ pttp join hDQzUKiovU/K4Weixl0EeLupJpN2U5tb
```

Join room
```sh
$ pttp join hDQzUKiovU/K4Weixl0EeLupJpN2U5tb
```
