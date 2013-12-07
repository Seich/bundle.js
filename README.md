Bundle.js
=========

What is this?
-------------
Bundle.js is what I call a View-Controller. It is not a full MVC framework, although it might become one eventually. It was built to display data and handle events in the quickest way possible. You can fetch data but that's as far as it's data manipulation skills go at the moment.
        
Dependencies
------------
Since jQuery is pretty much available everywhere, we depend on it to make bundle.js smaller. We use <a href="http://handlebarsjs.com">handlebars</a> to handle templates out of the box (you can change this to something else you might already be using).

Usage
-----
Using Bundle.js is pretty straightforward. You can define a bundle like this:

<pre><code>var Hello = new Bundle({
    // This template will be automatically fetched and compiled.
    template: 'template.hbs',
    
    // This is fetched and the data is merged into the 
    // data object that the template will receive.
    data_src: 'test.json',
    
    // This can be any jQuery method that can be used 
    // to attach html to the DOM such as 'append', 'prepend', 'html'
    render_method: 'html',
    
    // This method is called whenever a new object 
    // is initialized right after it is rendered.
    init: function(el, data) {
        var self = this;
        
        console.log('Hello, the bundle has been drawn.');
    },
    
    // This object contains a set of event bindings.
    events: {
        // All events should be in the form of : '[selector] [event name]'
        'h1 click': function(ev, el) {
            this.say_hi()
        }
    },
    
    // Although you generally shouldn't have to, you can override the render method, 
    // and do whatever you want, in order to render to screen.
    // You receive the element, the data object and the compiled template.
    render: function(el, data, template) {
        el.html(template(data)); // This is pretty much the default render method.
    },
    
    // You can also define your own methods and call them 
    // from any other method in the bundle.
    say_hi: function(todo) {
        console.log('The h1 said "hi"');
    }
});
</code></pre>
   
The bundle constructor generates a new function you can call to initialize the bundle. It takes three parameters:

<pre><code>Hello(element, data, config);</code></pre>
        
<p>The element, is the element on the document where we want to initialize the bundle. The data and config are both object which can override the data and configuration of the bundle. These are basically merged internally before the render happens.</p>
        
License
-------
Bundle.js is released under the MIT license.
