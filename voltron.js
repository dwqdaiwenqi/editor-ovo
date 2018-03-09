(function (root, $) {

    'use strict';

    // https://github.com/jashkenas/backbone/blob/master/backbone.js#L1027
    // Cached regex to split keys for `delegate`.
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    // constructor; creates instance
    function Voltron(options) {
        this.init(options);
        return this;
    }

    // default options
    Voltron.prototype.defaults = {};

    // events hash
    Voltron.prototype.events = {};

    // initialization code
    Voltron.prototype.init = function (options) {
        this.options = $.extend({}, this.defaults, options);
        this.$el = $(options.$el);
        this.bind();
        return this;
    };

    // heavily based on Backbone.View.delegateEvents
    // https://github.com/jashkenas/backbone/blob/master/backbone.js#L1088
    // bind using event delegation
    Voltron.prototype.bind = function () {
        var events = this.options.events ? Voltron.result(this.options.events) : null;

        if (!events) {
            return this;
        }

        // prevent double binding of events
        this.unbind(); // prevent double binding of events

        // iterate over events hash
        for (var key in events) {
            var method = events[key];
            // if value is not a funciton then
            // find corresponding instance method
            if (!$.isFunction(method)) {
                method = this[events[key]];
            }
            // if a method does not exist move
            // to next item in the events hash
            if (!method) {
                continue;
            }

            // extract event name and selector from
            // property
            var match = key.match(delegateEventSplitter);
            var eventName = match[1];
            var selector = match[2];

            // bind event callback to Voltron instance
            method = $.proxy(method, this);

            if (selector.length) {
                this.$el.on(eventName, selector, method);
            } else {
                this.$el.on(eventName, method);
            }
        }
    };

    // used to unbind event handlers
    Voltron.prototype.unbind = function () {
        this.$el.off();
        return this;
    };

    // destroy instance
    Voltron.prototype.destroy = function () {
        this.unbind();
        this.$el.remove();
    };

    // static util method for determining for returning a value
    // of an uknown type. if value is a function then execute
    // and return value of function
    Voltron.result = function (val) {
        return $.isFunction(val) ? val() : val;
    };

    window.Voltron = window.Voltron || Voltron;

})(window, jQuery);