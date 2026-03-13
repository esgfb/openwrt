module("luci.controller.poweroff",package.seeall)

function index()
	entry({"admin","system","poweroff"}, template("admin_system/poweroff"), _("PowerOFF"), 9999)
	entry({"admin", "system", "poweroff", "call"}, post("action_poweroff"))
end

function action_poweroff()
	local e={}
	e.running=luci.sys.call("poweroff")==0
	luci.http.prepare_content("application/json")
	luci.http.write_json(e)
end

