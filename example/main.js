var Todo = new Bundle({
    template: 'templates/todo.hbs',
    render_method: 'append',
    events: {
        'button click': function(ev, el) {
            el.parents('li').remove();
        },
        'input change': function(ev, el) {
            var style = 'none';

            if (el.is(":checked")) {
                style = 'line-through'
            }
            
            el.siblings('span').css('text-decoration', style);
        }
    }
});

var List = new Bundle({
    template: 'templates/list.hbs',
    data_src: 'test.json',
    init: function(el, data) {
        var self = this;
        $.each(data.todos, function(i, todo) {
            self.new_todo(todo);
        });
    },
    events: {
        'input[type=text] keypress': function(ev, el) {
            if (ev.which === 13) {
                this.new_todo(el.val());
                el.val('');
            }
        }
    },
    new_todo: function(todo) {
        Todo('ul', {
            todo: todo
        });
    }
});

List('body');