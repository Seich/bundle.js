/* Bundle.js v0.1.1 | (c) Copyright (C) 2013 by Sergio Díaz | https://github.com/Seich/bundle.js/blob/master/LICENSE */
;(function(namespace, $, Handlebars) {
    'use strict';
    
    namespace.Bundle = function(bundle) {
        var templates = {};

        var defaults = {
            render_method: 'append'
        };

        var _parseDataURL = function(url, values) {
            var _newUrl = url;
            var matcher = /{{(\w*)}}/gi;

            var match;
            while((match = matcher.exec(url))) {
                _newUrl = _newUrl.replace(match[0], values[match[1]]);
            }

            return _newUrl;
        };

        var _bundle = function(element, data, config) {
            element = $(element);
            data = $.extend({}, bundle.data, data);
            config = $.extend({ data: data }, defaults, bundle, config);

            var templateFetching = new $.Deferred();
            if (('template' in config) && typeof templates[config.template] === 'undefined') {
                $.get(config.template).done(function(template) {
                    templates[config.template] = Handlebars.compile(template);
                    templateFetching.resolve(templates[config.template]);
                }).fail(function(def, status, error) {
                    throw new Error('The following error occured while fetching the template: ' + error);
                });
            } else {
                templateFetching.resolve(templates[config.template]);
            }

            var dataFetching = new $.Deferred();
            if ('data_src' in config) {
                config.data_src = _parseDataURL(config.data_src, data);
                
                $.getJSON(config.data_src).done(function(remote_data) {
                    data = $.extend({}, data, remote_data);
                    dataFetching.resolve(data);
                }).fail(function(def, status, error) {
                    throw new Error('The following error occured while fetching the data: ' + error);
                });
            } else {
                dataFetching.resolve(data);
            }

            $.when(templateFetching, dataFetching).done(function(template, data) {
                var $template;
                if (typeof template === 'function') {
                    $template = $(template(data));
                }

                if ('events' in config) {
                    $.each(config.events, function(event, callback) {
                        var index = event.lastIndexOf(' ');
                        var element = $template.find(event.substring(0, index));
                        var action = event.substring(index, event.length);

                        element.on(action, function(event) {
                            callback.call(config, event, element);
                        });
                    });
                }

                if ('render' in config) {
                    config.render.call(config, element, data, template);
                } else {
                    element[config.render_method]($template);
                }

                if ('init' in config) {
                    config.init.call(config, element, data);
                }
            });

            if ('external' in config) {
                $.each(config.external, function (name, func) {
                    _bundle.prototype[name] = function() {
                        func.apply(config, Array.prototype.slice.call(arguments));
                    };
                });
            }

        };

        return _bundle;
    };
}(this, jQuery, Handlebars));