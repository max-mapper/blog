<div id="header"><h1 class="title">Tessel Powered Plant Watering System</h1></div>

Make a water pump that can be turned on and off over HTTP using only JavaScript.

**Warning** Do not try this at home without the help of an electronics expert. Solid state relays switch high voltage and can cause bodily harm if used improperly.

I have been looking for a way to do hobby electronics projects using JavaScript running on microcontrollers. You can control an Arduino remotely from a laptop over USB with libraries like <a href="https://www.npmjs.com/package/johnny-five">johnny-five</a>, but you can't keep your code running after you close your laptop since the Arduino can't run JavaScript.

The <a href="https://tessel.io/">Tessel</a> is a microcontroller that runs Node code **on the board**. The team at Tessel wrote a <a href="https://github.com/tessel/colony-compiler">JS to Lua compiler</a> and then they run Lua directly on the Tessel hardware. It's not the fastest thing in the world, but it opens up most of npm to run on a wi-fi enabled, USB powered microcontroller the size of an Arduino.

[![components](media/tessel-components.png)](media/tessel-components-large.png)

For this project I used four parts:

- <a href="https://shop.tessel.io/">Tessel Microcontroller</a>
- <a href="http://www.amazon.com/DC-AC-Solid-State-Relay-Heatsink/dp/B005K2IXHU/ref=sr_1_4?ie=UTF8&qid=1424888528&sr=8-4&keywords=Lightobject">Fotek SSR-25DA Solid State Relay</a>
- <a href="http://www.amazon.com/AquaTop-NP-80-Aquatop-Aquarium-Submersible/dp/B00798FYR0">AquaTop NP-80 Submersible Pump</a>
- <a href="http://www.amazon.com/Lutron-TT-300NLH-WH-Credenza-Dimmer-White/dp/B0000DI241/ref=sr_1_1?ie=UTF8&qid=1424888624&sr=8-1&keywords=dimmer+light">Lutron TT-300NLH-WH Lamp Dimmer</a>

The key is the solid state relay. For background on how these works check out <a href="http://www.scienceprog.com/considering-solid-state-relays-ssr-for-your-projects/">this excellent article</a>, but the short version is that they let you use a small voltage (3.3V or 5V such as those available in "digital out" pins in microcontrollers) to turn on and off high voltage circuits such as 110V or 220V (wall outlets).

<iframe width="560" height="315" src="https://www.youtube.com/embed/sgU3McOF-l8" frameborder="0" allowfullscreen></iframe>
