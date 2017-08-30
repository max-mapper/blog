# DNS VPN

$ netstat -rn

should show default route of your normal internet gateway

to change routes to iodine tunnel:
route delete default
route add default -net 10.0.0.1

to change back:
route delete default
route delete 192.168.43.1
route add default -net 192.168.43.1


on the ubuntu side:

 1209  sysctl -e net.ipv4.ip_forward=1
 1210  vim /etc/sysctl.conf
 1211  ifconfig
 1212  vim /etc/sysctl.conf
 1213  iptables -t nat -A POSTROUTING -s 10.0.0.0/255.255.255.0 -o eth0 -j MASQUERADE