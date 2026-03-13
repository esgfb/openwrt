"use strict";
"require form";
"require view";
"require fs";
'require ui';

return view.extend({
	render: function() {
		var m, s, o;
		m = new form.Map("tor", _("Template Edit"));
		s = m.section(form.TypedSection, "tor")
		s.addremove = false;
		s.anonymous = true;
		o = s.option(form.TextValue, '_tmpl',
			null,
			_("This is the content of the file '/etc/tor/tor.conf.template' from which your tor configuration will be generated."));
		o.rows = 20;
		o.cfgvalue = function(section_id) {
			return fs.trimmed('/etc/tor/tor.conf.template');
		};
		o.write = function(section_id, formvalue) {
			return fs.write('/etc/tor/tor.conf.template', formvalue.trim().replace(/\r\n/g, '\n') + '\n').then(function(rc) {
				ui.addNotification(null, E('p', _('Contents have been saved.')), 'info');
				return fs.exec('/etc/init.d/tor', ['reload']);
			}).catch(function(e) {
				ui.addNotification(null, E('p', _('Unable to save contents: %s').format(e.message)));
			});
		};
		return m.render()
	}
});
