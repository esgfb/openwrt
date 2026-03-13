module("luci.controller.nfs", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/nfs") then
		return
	end
	entry({"admin", "nas"}, firstchild(), _("NAS"), 44).dependent = false
	local page = entry({"admin", "nas", "nfs"}, cbi("nfs"), _("NFS Manage"), 5)
	page.dependent = true
	page.acl_depends = { "luci-app-nfs" }
end
