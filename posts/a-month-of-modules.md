<div id="header"><h1 class="title">A Month of Modules</h1></div>

Modules mafintosh and I wrote this month

I work on a distributed team with two other developers. The three of us are in three different cities. This month [mafintosh](http://github.com/mafintosh/) came out and stayed in my guest room for the month. I wanted to take the time to document what we wrote during his trip to give a little insight into what is it like to work in an "open source first" way.

Most of these were written for use cases involving our day job, [dat](http://dat-data.com/). Some, such as the Playback video player, were written for fun.

### [airpaste](https://npmjs.org/airpaste)

Run `airpaste` on two computers that are on the same network and airpaste opens a two way binary pipe. Uses mdns (aka Bonjour) to connect peers.

### [axis-camera](https://npmjs.org/axis-camera)

A module to control a webcam in my backyard from node. The webcam points at [some catnip in my yard](https://twitter.com/maxogden/status/587743809947086849) and motion detects cats.

### [ble-stream](https://npmjs.org/ble-stream)

Implements a duplex stream interface on top of Bluetooth Low Energy

### [ble-swarm](https://npmjs.org/ble-swarm)

Implements a swarm API (mesh networking) using ble-stream

### [blecat](https://npmjs.org/blecat)

Works like `airpaste` except uses bluetooth

### [electron-packager](https://npmjs.org/electron-packager)

Creates a mac `.app` from your Electron source code

### [electron-prebuilt](https://npmjs.org/electron-prebuilt)

Lets you do `npm install electron-prebuilt -g` to get `electron` in your PATH.

### [electron-spawn](https://npmjs.org/electron-spawn)

Run `electron-spawn foo.js` to run `foo.js` inside a headless Electron window

### [idlecast](https://npmjs.org/idlecast)

Play videos on your chromecast when nothing else is playing. I use it to play the captured cat videos from the catnip cam.

### [mon-prebuilt](https://npmjs.org/mon-prebuilt)

Lets you `npm install mon-prebuilt -g` to get the `mon` C process monitor in your PATH

### [multicast-dns-service-types](https://npmjs.org/multicast-dns-service-types)

A low level module for parsing MDNS data. Factored out, like many of these, because Unix philosophy!

### [multileveldown](https://npmjs.org/multileveldown)

Lets us access a single LevelDB from multiple processes in a failsafe way

### [pbs](https://npmjs.org/pbs)

Protocol Buffer Streaming. A standard way to serialize protobuf data. We use protobufs for almost all data interchange now. We are getting friends to implement pbs in Golang and C++.

### [pick-random-stream](https://npmjs.org/pick-random-stream)

Tiny utility stream that lets you pick a random item from a stream.

### [playback](https://npmjs.org/playback)

Desktop video player written in JS that supports torrent streaming, chromecast and youtube.

### [playback-chrome](https://npmjs.org/playback-chrome)

Chrome extension to that adds a 'open in Playback' button to YouTube videos.

### [random-iterate](https://npmjs.org/random-iterate)

Tiny array module that can iterate an array in random order

### [require-times](https://npmjs.org/require-times)

Tells you how long `require()` calls take in your program

### [signalhub](https://npmjs.org/signalhub)

A stateless pub/sub server with 'channels' that we use to introduce peers in p2p apps like [Friends](https://moose-team.github.io/friends).

### [sorted-diff-stream](https://npmjs.org/sorted-diff-stream)

Used by dat to compute diffs between two branches, used when merging forked data

### [sorted-union-stream](https://npmjs.org/sorted-union-stream)

Join two sorted streams based on a key

### [stream-iterate](https://npmjs.org/stream-iterate)

A simple stream module to go through items in stream one at a time. We factored this out of our `sorted-*-stream` modules above.

### [subcommand](https://npmjs.org/subcommand)

CLI routing tool that we use in dat to route subcommands like `dat cat` or `dat add`.

### [taco](https://npmjs.org/taco)

We rewrote our deploy tools, and produced a series of small modules that can compose together into deploy pipelines. We're calling the system `taco`

### [taco-build](https://npmjs.org/taco-build)

Runs a command inside a taco tarball (e.g. `npm install --production`)

### [taco-git-push-deploy](https://npmjs.org/taco-git-push-deploy)

Lets you `git push` deploy with taco

### [taco-mon](https://npmjs.org/taco-mon)

Deploys apps using the `mon` C process monitor

### [taco-nginx](https://npmjs.org/taco-nginx)

Auto configures Nginx to route traffic to your process

### [taco-pack](https://npmjs.org/taco-pack)

Creates a tarball from your app source code

### [tape-spawn](https://npmjs.org/tape-spawn)

Testing module to make testing spawned processes easier

### [transport-stream](https://npmjs.org/transport-stream)

Abstract module to support different transports (used in dat), e.g. `tcp://`, `ssh://`, `https://`

### [utp-native](https://npmjs.org/utp-native)

An experimental C implementation of the utp (micro-tp) protocol from Bittorrent.

### [webcat](https://npmjs.org/webcat)

Like airpaste or blecat but over webrtc. Uses github usernames for auth/discovery. Opens a duplex stream to someone over webrtc.

### [webrtc-swarm](https://npmjs.org/webrtc-swarm)

A connection swarm API for webrtc. Manages a pool of webrtc connections. Used in Friends.
