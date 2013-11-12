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

        Bundle('todo', {
            config: {
                render_method: 'append'
            },
            template: 'templates/todo.hbs',
            events: {
                'button click': function(ev, el) {
                    el.parents('li').remove();
                },
                'input change': function(ev, el) {
                    if (el.is(":checked")) {
                        el.siblings('span').css('text-decoration', 'line-through');
                    } else {
                        el.siblings('span').css('text-decoration', 'none');
                    }
                }
            }
        });
        
        Bundle('list', {
            template: 'templates/list.hbs',
            data_src: 'test.json',
            init: function(el, options) {
                $.each(options.todos, function(i, todo) {
                    Bundle.open('todo', 'ul', {
                        todo: todo
                    });
                });
            },
            events: {
                'input keypress': function(ev, el) {
                    if (ev.which === 13) {
                        Bundle.open('todo', 'ul', { 
                            todo: el.val()
                        });

                        el.val('');
                    }
                }
            }
        });

        Bundle.open('list', 'body');
    }
);