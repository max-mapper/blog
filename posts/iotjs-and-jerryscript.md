<div id="header"><h1 class="title">iot.js and JerryScript</h1></div>

Node.js will soon be running on tiny low power chips.

[iot.js](http://samsung.github.io/iotjs/) is a Node.js compatible runtime being written by Samsung. The project is still in active development, is open source and Apache Licensed. It hasn't yet had a stable release but has been in development for over a year. It is built on a new JavaScript VM called [JerryScript](http://samsung.github.io/jerryscript/) that they are also working on. Node.js is built on V8, and iot.js is built on JerryScript. The major goal of iot.js is to run Node code on low power devices.

The current hardware requirements for iot.js are around 350KB ROM and 100KB RAM. This is a huge difference compared with V8, the VM that Node.js is built on, which is notoriously memory hungry and doesn't run on devices with less than 64MB of RAM (the lowest power device I've seen running it is the [Arduino Yun](https://www.arduino.cc/en/Main/ArduinoBoardYun?from=Products.ArduinoYUN)).

As you can [see on their wiki](https://github.com/Samsung/iotjs/wiki/IoT.js%20API%20Reference) and the [current implementation](https://github.com/Samsung/iotjs/tree/master/src), iot.js is a Node.js compatible JS + C runtime that binds to JerryScript. 

The first two officially supported devices are the STM32F4-Discovery and the Raspberry Pi 2:

[![STM32F4](media/STM32F4.png)](https://www.youtube.com/watch?v=hZXPa6szk3Q)

[![raspi2](media/raspberry-pi-2.png)](https://www.flickr.com/photos/travelinlibrarian/16012874634/in/photolist-qp1aKq-cDBDks-gVeh8G-cteaUY-r4La4W-rp7cPE-g2nwfp-q3AdFU-rfmy16-uB73KM-c5JmRd-caokMG-dcFPis-eseAkY-rBAA2v-rinQFa-rkfjxi-dorXrE-c7JHuo-diztsQ-qeGZid-pZzc1H-pk154Y-pk14Ry-pZzbHP-pZrjR1-cDBYvJ-qDvwFe-daTWwG-omP1sP-rrJCaF-h4gEiw-qXTK4K-qKX8dV-qKVmAH-qKPr6N-r3nYtT-r3nYpV-r3dWga-q6zWGv-r3dVU8-q6nmh3-qKPrY9-qKPpoE-r15RSU-r3iasd-q6zXiF-q6zZmP-qKVjAF-r3dV1e)

The exciting thing about this stuff is that it makes low power hardware more accessible to coders like me who know JS and can install modules from NPM but don't want to deal with C and compiled language tooling and debugging headaches.

I've done a number of projects with the Arduino which can't run Node but has great battery life, and the Raspberry Pi which can run Node but has poor battery life and requires Linux sysadmin skills to operate effectively. The Raspberry Pi (or any Linux machine) is totally overkill for a lot of the projects I'm interested in doing (e.g. a computer that lives on my bicycle, or on that sits in my garden measuring soil moisture levels). Low power node.js seems like the sweet spot for me - I can leverage the Node + NPM ecosystem to deploy stuff to hardware that can potentially run for weeks on a single charge.

In the future they will work on support for other devices (according to [their wiki](https://github.com/Samsung/iotjs/wiki/Getting-Started)), including the Intel Edison and Samsungs recently announced Artik 1.

[![edison](media/intel-edison-size.png)](https://www.youtube.com/watch?v=CPXQ65QRV3k)

[![artik-1](media/artik-1.png)](https://www.artik.io/)

Perhaps the closest thing to iot.js is Espruino, who both develop a custom JavaScript runtime as well as manufacture development boards like the [Espruino Pico](http://www.espruino.com/Pico). The major difference between iot.js and Espruino is that Espruino is not Node.js compatible. The Espruino boards use a family of chips (STM32F4) that iot.js supports, so it should be possible to run iot.js on Espruino hardware in the future.

Another similar device is the [ESP8266](http://www.esp8266.com/wiki/doku.php), which is a low power microcontroller with an integrated WiFi networking stack. They are really cheap - you can get ESP8266 development boards for around $8 from Amazon or the raw chips in bulk for around $2 a piece. However, with only 64KB of RAM and ROM it is not quite beefy enough to run iot.js. The closest thing you can get is Lua through a project called [NodeMCU](https://github.com/nodemcu/nodemcu-firmware).

I think a low power JS VM is long overdue and am looking forward to the first stable iot.js release.
