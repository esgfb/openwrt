#!/bin/sh
# Copyright (C) 2023-202x byz <byz@openwrt.org>

action=$1
num=$2
configPath=/etc/tor/torrc$num
logPath=/tmp/tor$num
case $action in
start)
	# 使用指定配置文件开启tor链路
	# return 进程PID
	(tor -f "$configPath" > "$logPath" &)
	pid=$(pgrep -f tor.*"$num"$)
	echo "$pid"
	exit 0
	;;
close)
	# 根据PID关闭tor进程
	pid=$(pgrep -f tor/torrc.*"$num"$)
	kill 9 "$pid"
	rm -r /tmp/tor"$num"
	;;
status)
	# 获取节点状态
	status="$(top -n 1 | grep tor | grep -v "grep" | awk '{printf("%s\t%s#!#!", $10, $1)}')"
	if [ -z "$status" ];then
		printf null
	else
		status=$(echo "$status" | sed "s/#!#!/\n/g" | sed "/^$/d" | sort)
		echo "$status"
	fi
	;;
get_listen_port)
	# 获取链路的监听端口
	port=$(uci show tor | grep "node\[$num\].SocksPort" | cut -d "'" -f 2)
	echo "$port"
	;;
esac
