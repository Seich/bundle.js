define(['jquery', 'handlebars'], function($, handlebars) {
	var boxes = {};
	var templates = {};

	var default_config = {
		render_method: 'html'
	};


	var Box = function(box_name, box) {
		boxes[box_name] = box;
	};

	Box.unBox = function(box_name, element, config) {
		var box = boxes[box_name];
		var box_config = $.extend({}, default_config, config);

		var $element = $(element);

		if ('template' in box) {
			var getting_template = $.get(box.template);

			getting_template.done(function(data) {
				var template = handlebars.default.compile(data);
				templates[box.template] = template;
			});

			if ('data_src' in box) {
				getting_template.done(function() {
					var getting_data = $.getJSON(_parseBoxDataUrl(box));

					getting_data.done(function(data) {
						box.defaults = $.extend({}, box.defaults, data);
						_render(box, $element, box_config);
					});
				});
			} else {
				getting_template.done(function() {
					_render(box, $element, box_config);
				});
			}
		} else {
			_render(box, $element, box_config);
		}
	};

	var _render = function(box, element, box_config) {
		var template = templates[box.template];

		if ('render' in box) {
			box.render.call(null, element, box.defaults, template);
		} else {
			element[box_config.render_method](template(box.defaults));
		}
		
		box.init.call(null, element, box.defaults);
	};

	var _parseBoxDataUrl = function(box) {
		var url = box.data_src;
		var matcher = /{{(\w*)}}/gi;

		var match;
		while(match = matcher.exec(box.data_src)) {
			url = url.replace(match[0], box.defaults[match[1]]);
		}

		return url;
	};

	return Box;
});