"use strict";
"require form";
"require view";
"require fs";
'require dom';
'require ui';

return view.extend({
	render: async function() {
		function getRandom() {
			let arr = [21, 22, 80, 443];
			let random = Math.floor(Math.random() * 100000 % 65536);
			while (true) {
				for (i in arr) {
					if (i == random) {
						break;
					}
				}
				return random;
			}
		}
		var m, s, o;
		m = new form.Map("tor", _("Tor - Link Manage"));
		s = m.section(form.GridSection, "node", _("Link Overview"))
		s.addremove = true;
		s.anonymous = true;
		s.addbtntitle = _("Add Links");
		o = s.option(form.Value, "SocksPort", _("Tor Listen Port"), _("Type: SOCKS5"));
		o.default = "9150";
		o.datatype = "port";
		o = s.option(form.Value, "Controlport", _("Control Port"), _("Tor control port"));
		o.default = getRandom();
		o.datatype = "port";
		o = s.option(form.Value, "proxyIP", _("Up Proxy"), _("Ip address for proxy"));
		o.default = "127.0.0.1";
		o.datatype = "ip4addr";
		o.multiple = false;
		o.rmempty = false;
		o = s.option(form.ListValue, "proxyType", _("Up ProxyType"), _("Proxy protocol type"));
		o.value("https", _("HTTPS"));
		o.value("socks5", _("SOCKS5"));
		o.default = "https";
		o.multiple = false;
		o.rmempty = false;
		o = s.option(form.Value, "proxyPort", _("Proxy Port"), _("Up proxy port"));
		o.default = "8118";
		o.multiple = false;
		o.datatype = "port";
		o.rmempty = false;
		o = s.option(form.DynamicList, "ExitNodes", _("Exit Node"), _("Exit country node for tor"));
		o.value("{us},", _("United States"));
		o.value("{de},", _("Germany"));
		o.value("{gb},", _("Great Britain"));
		o.value("{jp},", _("Japan"));
		o.value("{ca},", _("Canada"));
		o.value("{au},", _("Australia"));
		o.value("{it},", _("Italy"));
		o.value("{fr},", _("France"));
		o.default = "{de},";
		o.placeholder = _("Please select exit node country");
		o.multiple = true;
		o.rmempty = false;
		return m.render()
	}
});
