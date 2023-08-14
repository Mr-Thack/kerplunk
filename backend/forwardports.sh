#!/bin/bash

function forward {
        # Give it EXTERNAL:INTERNAL
        local splits=(${1//:/ })
        local external=${splits[0]}
        local internal=${splits[1]}
        iptables -t nat -A PREROUTING -p tcp --dport $external -j REDIRECT --to-port $internal
        iptables -t nat -I OUTPUT -p tcp -d 127.0.0.1 --dport $external -j REDIRECT --to-ports $internal
}

# To give Docker some time to start up
sleep 15

forward 80:8080
forward 81:8000
forward 443:8080
forward 444:8000

# Output current forwarding rules, which should now include the 80 to 8080 redirection
# iptables -t nat --line-numbers -n -L

