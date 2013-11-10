requirejs.config({
    baseUrl: '../bower_components',
    paths: {
        handlebars: 'handlebars/handlebars.amd',
        jquery: 'jquery/jquery',
        box: '../box'
    }
});

requirejs(['box'], 
    function (Box) {
        Box('service', {
            defaults: {
                id: 12,
                body: 'Lorem ipsum dolor sit amet.'
            },

            template: 'templates/test.hbs',
            data_src: 'test.json?id={{id}}',

            init: function(element, options) {
                
            },

            // render: function(element, options, template) {
            //     console.log(element, options, template(options))
            // }

            events: {
                'h1 click': function() {
                    console.log(arguments, this);
                }
            }
        });

        Box.unBox('service', 'body', { render_method: 'html' });
    }
);