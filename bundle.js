;(function (root, factory) {
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'handlebars'], factory);
    } else {
        root.Bundle = factory(jQuery, Handlebars);
    }
}(this, function ($, handlebars) {
    'use strict';

    var bundles = {};
    var templates = {};

    var default_config = {
        render_method: 'html'
    };

    var Bundle = function(bundle_name, bundle) {
        bundles[bundle_name] = bundle;
    };

    Bundle.open = function(bundle_name, element, data, config) {
        var bundle = bundles[bundle_name];
        var $element = $(element);
        config = config || {};
        bundle.defaults = bundle.defaults || {};

        var defaults = $.extend({}, bundle.defaults, data);
        config = $.extend({}, default_config, bundle.config, config);

        var templateDefer = new $.Deferred();
        var dataDefer = new $.Deferred();

        if ('template' in bundle) {
            var getting_template = $.get(bundle.template);

            getting_template.done(function(data) {
                var compile = handlebars.compile || handlebars.default.compile;
                var template = compile(data);
                templates[bundle.template] = template;

                templateDefer.resolve();
            });
        } else {
            templateDefer.resolve();
        }

        if ('data_src' in bundle) {
            var getting_data = $.getJSON(_parseBundleDataUrl(bundle, defaults));

            getting_data.done(function(data) {
                defaults = $.extend({}, defaults, data);
                dataDefer.resolve();
            });
        } else {
            dataDefer.resolve();
        }

        $.when(templateDefer, dataDefer).done(function() {
            _render(bundle, $element, defaults, config);
        });
    };

    var _render = function(bundle, element, defaults, config) {
        var template = templates[bundle.template];

        var render = function() {
            if (typeof template !== 'function') {
                throw new Error('Trying to call the render method without a template.');
            }

            var $template = $(template(defaults));

            if ('events' in bundle) {
                $.each(bundle.events, function(event, callback) {
                    var query = event.split(' ');
                    event = query.pop();
                    query = query.join(' ');

                    $template.find(query).on(event, function(event) {
                        var $element = $(this);
                        
                        callback.call(bundle, event, $element);

                    });
                });
            }

            element[config.render_method]($template);
        };

        if ('render' in bundle) {
            bundle._render = render;
            bundle.render.call(bundle, element, defaults, template);
        } else {
            render();
        }

        if ('init' in bundle) {
            bundle.init.call(bundle, element, defaults);
        }
    };

    var _parseBundleDataUrl = function(bundle, defaults) {
        var url = bundle.data_src;
        var matcher = /{{(\w*)}}/gi;

        var match;
        while((match = matcher.exec(bundle.data_src))) {
            url = url.replace(match[0], defaults[match[1]]);
        }

        return url;
    };

    return Bundle;
}));