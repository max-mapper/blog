<div id="header"><h1 class="title">Getting Started With Node For Distributed Systems</h1></div>

Where to get started with streams and peer to peer, May 2016

The great thing about node (and it's streams) is that its easy to plug different modules together into powerful pipelines.

For example in [Dat](http://dat-data.com) we use [rabin](https://github.com/maxogden/rabin) to chunk a file stream and then pipe into a merkle tree generator ([merkle-tree-stream](https://www.npmjs.com/package/merkle-tree-stream)):

```js
var merkle = require('merkle-tree-stream')
var rabin = require('rabin')
var fs = require('fs')

fs.createReadStream('big.file')
  .pipe(rabin())
  .pipe(merkle())
  .on('data', function (data) {
    console.log('tree node', data)
  })
```

It's basically unix pipes all over again. To work with streams in various ways, try out the [mississippi](http://github.com/maxogden/mississippi) module. For node and streams skill building, [NodeSchool](http://nodeschool.io) is great for an intro to most of the skills you will need.

After getting through NodeSchool, [this P2P workshop](https://p2p-workshop.mafintosh.com) by [mafintosh](https://github.com/mafintosh) is a good challenge. It's doable once you have a basic knowledge of Node.

In the workshop you build a peer to peer chat system piece by piece using network streams, DNS, LevelDB and append-only log based message replication. It's best to try with friends, so you can chat with each other as you go through the lessons.

For some authors who write distributed systems modules, start with these (not an exhaustive list by any means):

- https://github.com/substack?tab=repositories
- https://github.com/mafintosh?tab=repositories
- https://github.com/maxogden?tab=repositories
- https://github.com/feross?tab=repositories
- https://github.com/dominictarr?tab=repositories
