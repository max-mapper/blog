<div id="header"><h1 class="title">Tessel Powered Plant Watering System</h1></div>

Make a water pump that can be turned on and off over HTTP using only JavaScript.

**Warning** Do not try this at home without the help of an electronics expert. Solid state relays switch high voltage and can cause bodily harm if used improperly.

I have been looking for a way to do hobby electronics projects using JavaScript running on microcontrollers. You can control an Arduino remotely from a laptop over USB with libraries like <a href="https://www.npmjs.com/package/johnny-five">johnny-five</a>, but you can't keep your code running after you close your laptop since the Arduino can't run JavaScript.

The <a href="https://tessel.io/">Tessel</a> is a microcontroller that runs Node code **on the board**. The team at Tessel wrote a <a href="https://github.com/tessel/colony-compiler">JS to Lua compiler</a> and then they run Lua directly on the Tessel hardware. It's not the fastest thing in the world, but it opens up most of npm to run on a wi-fi enabled, USB powered microcontroller the size of an Arduino.

For this project I used four components:

- <a href="https://shop.tessel.io/">Tessel Microcontroller</a>
- <a href="http://www.amazon.com/DC-AC-Solid-State-Relay-Heatsink/dp/B005K2IXHU/ref=sr_1_4?ie=UTF8&qid=1424888528&sr=8-4&keywords=Lightobject">Fotek SSR-25DA Solid State Relay</a>
- <a href="http://www.amazon.com/AquaTop-NP-80-Aquatop-Aquarium-Submersible/dp/B00798FYR0">AquaTop NP-80 Submersible Pump</a>
- <a href="http://www.amazon.com/Lutron-TT-300NLH-WH-Credenza-Dimmer-White/dp/B0000DI241/ref=sr_1_1?ie=UTF8&qid=1424888624&sr=8-1&keywords=dimmer+light">Lutron TT-300NLH-WH Lamp Dimmer</a>

I would also recommend using a junction box/electronics enclosure for housing the SSR along the lines of [this one](http://www.amazon.com/Estone%C2%AE-85x58x33mm-Waterproof-Electronic-Enclosure/dp/B00M1HL2UM/ref=sr_1_2?s=hi&ie=UTF8&qid=1424891818&sr=1-2&keywords=estone+box#productDetails).

The key is the solid state relay. For background on how these works check out <a href="http://www.scienceprog.com/considering-solid-state-relays-ssr-for-your-projects/">this excellent article</a>, but the short version is that they let you use a small voltage (3.3V or 5V such as those available in "digital out" pins in microcontrollers) to turn on and off high voltage circuits such as 110V or 220V (wall outlets).

[![components](media/tessel-components.png)](media/tessel-components-large.png)

To build the 'circuit', I simply cut the dimmer slider portion off of the Lamp Dimmer, stripped the ends off of the wires, and connected them to the SSR instead. Where there used to be a dimmer slider the circuit there is now the SSR.

The flow of electricity is roughly: Wall -> Dimmer -> SSR -> Pump. The tessel is connected to the SSR and can turn it on and off at will.

**Again, I can't stress enough that you should really not try this on your own unless you have someone who is experienced with Solid State Relays and 110V/220V electricity.**

Here's a [video of the system in action](http://youtu.be/sgU3McOF-l8):

<iframe width="640" height="360" src="https://www.youtube.com/embed/sgU3McOF-l8?rel=0" frameborder="0" allowfullscreen></iframe>

The tessel is running a small HTTP server written in Node that turns the G3 GPIO pin on or off. When it is on it outputs 3.3V to the SSR, which tells the SSR to turn on voltage, which turns on the pump.

```js
var tessel = require('tessel')
var http = require('http')
 
var pin = tessel.port['GPIO'].pin['G3']
 
var server = http.createServer(function (req, res) {
  console.log(req.url)
  if (req.url === '/on') return on(req, res)
  if (req.url === '/off') return off(req, res)
  return res.end('<a href="/on">/on</a> or <a href="/off">/off</a>\n')
})
 
server.listen(80, function(err) {
  if (err) console.log('error!' + err)
  console.log('http listening')
})
 
function on (req, res) {
  console.log('turning on')
  pin.write(1)
  res.end('turned on\n')
}
 
function off (req, res) {
  console.log('turning off')
  pin.write(0)
  res.end('turned off\n')
}
```

Once you have the Tessel configured to join your home Wi-Fi it will then always automatically connect a few seconds after powering up. You can put it anywhere in your house, power it over USB, and it will start up it's HTTP server and be accessible over your local network.

Happy hacking! Questions? Open an issue [in this repository](https://github.com/maxogden/blog/issues)