/*
 * jQuery Behaviour v1.0
 *
 * Allows for defining behaviour for DOM elements in a structured way, based on
 * 'behaviour sheets'.
 *
 * Additionally, parameters can be supplied in <key>:<value> form in the classname
 * and they will automatically be passed to the function in object form.
 *
 * Example:
 *
 * Behaviour.register({
 *     'input.focusOnLoad': function() {
 *         $(this).focus();
 *     },
 *     'table tbody tr': function() {
 *         $(this).hover(function() {
 *             $(this).addClass('hover');
 *         }).mouseout(function() {
 *             $(this).removeClass('hover');
 *         });
 *     },
 *     'a.hide': function(params) {
 *         if (!params.target) return;
 *         $(this).click(function() {
 *             $(params.target).toggle();
 *         });
 *     }
 * });
 *
 * Copyright 2011, Aron Rotteveel
 */
var Behaviour = {
    sheets: [],

    /**
     * Register a new sheet
     */
    register: function(rules) {
        Behaviour.sheets.push(rules);
    },

    /**
     * Init method.
     *
     * Will parse every registered sheet and apply the behaviour
     */
    init: function() {
        for (var i = 0; sheet = Behaviour.sheets[i]; i++) {
            for (selector in sheet) {
                elements = $(selector);
                if (!elements) {
                    continue;
                }
                for (var y = 0; element = elements[y]; y++) {
                    if (typeof(element._behaviours) != 'undefined') {
                        if (element._behaviours.indexOf(selector) != -1) {
                            continue;
                        }
                    } else {
                        element._behaviours = [];
                    }
                    var params = [Behaviour.getParameters(element)];
                    sheet[selector].apply(element, params);
                    element._behaviours.push(selector);
                }
            }
        }
    },

    /**
     * Extract parameters from the classname and serialize
     * them into a JSON string
     */
    getParameters: function(element) {
        element = $(element);
        var params = {};
        var search = new RegExp('([a-z0-9_-]+):([^\\s]*)', 'gi');
        while (match = search.exec(element.attr('class'))) {
            params[match[1]] = match[2];
        }
        return params;
    }
};

