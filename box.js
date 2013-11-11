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
		
		box.defaults = $.extend({}, box.defaults, config.data);
		
		delete config.data;

		config = $.extend({}, default_config, config);


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
						console.log(box.defaults)
						_render(box, $element, config);
					});
				});
			} else {
				getting_template.done(function() {
					_render(box, $element, config);
				});
			}
		} else {
			_render(box, $element, config);
		}
	};

	var _render = function(box, element, config) {
		var template = templates[box.template];

		var render = function() {
			var $template = $(template(box.defaults));

			if ('events' in box) {
				$.each(box.events, function(event, callback) {
					var query = event.split(' ');
					var event = query.pop();
					query = query.join(' ');

					$template.find(query).on(event, function(event) {
						var element = this;
						
						callback.call(box, event, element);

					});
				});
			}

			element[config.render_method]($template);
		};

		if ('render' in box) {
			box._render = render;
			box.render.call(box, element, box.defaults, template);
		} else {
			render();
		}

		box.init.call(box, element, box.defaults);
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