var Todo = new Bundle({
    template: 'templates/todo.hbs',
    render_method: 'append',
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

var List = new Bundle({
    template: 'templates/list.hbs',
    data_src: 'test.json',
    init: function() {
        console.log(arguments, this)
    },
    events: {
        'input[type=text] keypress': function(ev, el) {
            if (ev.which === 13) {
                this.new_todo(el.val());
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