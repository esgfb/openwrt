"use strict";
"require form";
"require view";
"require fs";
"require dom";
"require ui";
"require rpc";
"require uci";
"require poll";

async function controlTor(num, env) {
	if (env.target.getAttribute("status") == "close") {
		setTimeout(() => {
			location.reload();
		}, 500);
		await L.resolveDefault(fs.exec("/bin/busybox", ["sh", "/etc/tor/controlTor.sh", "start", `${num}`]))
	} else if (env.target.getAttribute("status") == "open") {
		await L.resolveDefault(fs.exec("/bin/busybox", ["sh", "/etc/tor/controlTor.sh", "close", `${num}`])).then(() => {
			location.reload();
		});
	}
}
//获取各节点日志信息
async function getLog (nodeNum, obj) {
	obj.nodeStatus = [];
	for (let i = 1; i <= nodeNum; i++) {
		let cue = [_('Instance %s is not running').format(i)]
		await L.resolveDefault(fs.exec("/bin/busybox", ["cat", `/tmp/tor${i}`]), null).then((value) => {
			if (value.code == "0") {
				let torMsg = value.stdout.trim().split(/\n/);
				obj.nodeStatus = [...obj.nodeStatus, torMsg];
			} else {
				obj.nodeStatus = [...obj.nodeStatus, cue];
			}
			return obj.nodeStatus;
		});
	}
}
// 获取监听端口
async function getListenPort(num) {
    num--
    var port
    await L.resolveDefault(fs.exec("/bin/busybox", ["sh", "/etc/tor/controlTor.sh", "get_listen_port", `${num}`])).then(value => {
        port = value["stdout"]
    })
    return port
}
//定时更新日志内容
function refresh() {
	setTimeout(async () => {
		await L.resolveDefault(fs.exec("/bin/busybox", ["sed", "-n", "/config node/p", "/etc/config/tor"])).then(async value => {
			let msg = {};
			msg.nodeNum = 0;
			let arr = value.stdout.split("\n");
			for (let i of arr) {
				if (i == "config node") {
					msg.nodeNum++;
				}
			}
			await getLog(msg.nodeNum, msg);
			let textarea = document.querySelectorAll("textarea");
			let j = 0;
			for (let i of msg.nodeStatus) {
				if (i.length > 1) {
					textarea[j].innerHTML = i.join("&#10;");
					textarea[j].setAttribute("rows", i.length + 1)
				}
				j++
			}
		});
	}, 3000)
}

return view.extend({
	load: async function () {
		return Promise.all([
			L.resolveDefault(fs.exec("/bin/busybox", ["sed", "-n", "/config node/p", "/etc/config/tor"])),
			await L.resolveDefault(fs.exec("/bin/busybox", ["sh", "/etc/tor/controlTor.sh", "status"])),
			L.resolveDefault(fs.exec("/sbin/uci"))
		]).then(async tormsg => {
			if (tormsg[1].stdout && tormsg[0].stdout) {
				let arr = tormsg[0].stdout.split("\n");
				var msg = {};
				//获取tor节点总数
				msg.nodeNum = 0;
				for (let i of arr) {
					if (i == "config node") {
						msg.nodeNum++;
					}
				}
				//获各节点日志信息
				await getLog(msg.nodeNum, msg);
				//获取已经开启节点的pid
				arr = tormsg[1].stdout.split(/\n/);
				arr.pop();
				arr = arr.map((value) => {
					return value.replace("/etc/tor/torrc", "")
				});
				msg.pid = {};
				let num, pid;
				for (let i of arr) {
					num = i.charAt(0);
					pid = i.substr(2, 10);
					msg.pid[num] = pid;
				}
				return msg;
			}
		});
	},
	render: async function (msg) {
		let m
		m = new form.Map("tor", _("Tor - Program Status"));
		if (msg) {
			let nodeDoc = [];
			let j = 1;
			for (let i of msg.nodeStatus) {
				if (i.join) {
					var log = i.join("\n");
					var logLength = i.length;
				} else {
					var log = i;
					var logLength = 1;
				}
				if (!msg.pid[j]) {
					var buttonStatus = "close";
					var buttonClass = "cbi-button cbi-button-action";
					var buttonText = _('Start instance %s').format(j);
				} else {
					var buttonStatus = "open";
					var buttonClass = "cbi-button cbi-button-reset";
					var buttonText = "PID: " + msg.pid[j];
				}
				var listenPort = await getListenPort(j);
				nodeDoc = [...nodeDoc,
				E("h3", {}, [_('Link %s - ListenPort: %s' ).format(j,listenPort)]),
				E("div", { "style": "display:flex;margin-bottom:18px;" }, [
					E("lable", {
						"class": "cbi-value-title",
						"style": "width:180px;text-align: right;padding-top:6px"
					}, [_("Start Tor")]),
					E("button", {
						"class": buttonClass, "style": "margin-left:20px",
						"id": `button-tor${j}`,
						"status": buttonStatus,
						"click": await ui.createHandlerFn(this, env => {
							var id = env.target.id.substr(10, 3);
							return controlTor(id, env);
						})
					}, [_(buttonText)]),
				]),
				E("h4", {}, [_("Logs")]),
				E("div", {}, [
					E("textarea", {
						"id": "syslog",
						"tag": `tor${j}`,
						"style": "font-size:12px",
						"readonly": "readonly",
						"wrap": "off",
						"rows": logLength + 1
					}, [log])
				])
				];
				j++;
			}
			m.render().then(node => {
				document.querySelector("#view").insertBefore(node, document.querySelector("#view").firstChild);
			});
			refresh();
			return E([], [...nodeDoc]);
		}
	}
});
