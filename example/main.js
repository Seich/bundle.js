requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        handlebars: 'handlebars/handlebars.amd',
        jquery: 'jquery/jquery',
        box: '../bundle'
    }
});

requirejs(['box'],
    function (Bundle) {
        'use strict';
        
        Bundle('service', {
            defaults: {
                body: 'Lorem ipsum dolor sit amet.'
            },

            data_src: 'test.json?id={{id}}',
            template: 'templates/test.hbs',

            init: function(element, options) {
                console.log(element, options, this);
            },

             render: function(element, options, template) {
                console.log(element, options, template(options), this);
                this._render();
            },

            events: {
                'h1 click': function(ev, el) {
                    console.log('h1', ev, el);
                },
                'div.body span:first-child click': function() {
                    console.log('span');
                }
            }
        });

        Bundle.open('service', 'body', { render_method: 'append', data: {
                'id': 12
            }
        });
    }
);