/***
 * Contains basic SlickGrid equations.
 * 
 * NOTE:  These are merely examples.  You will most likely need to implement something more
 *        robust/extensible/localizable/etc. for your use!
 * 
 * @module Equations
 * @namespace Slick
 */

(function ($) {
	// register namespace
	$.extend(true, window, {
		"Slick": {
			"Math": {
				"Sum": Summarize,
				"Mul": Multiply,
				"Dif": Subtract,
				"Div": Divide
			},
			"Equation": Equation
		}
	});

	function Equation(expression) {
		if (typeof expression === 'string') {
			var parts = expression.split(' ');
		}
		var result = 0;
		var _item;
		var params = [];
		var initialized = false;
		var exp;

		function replaceVariables() {
			exp = expression
			for (var i = 0; i < parts.length; i++) {
				if (typeof _item[parts[i]] !== 'undefined' ) {
					exp = exp.replace(parts[i], _item[parts[i]]);
				}
			}
		}

		this.init = function (item) {
			_item = item;
			if (typeof expression === 'function') {
				exp = expression;
			} else {
				replaceVariables();
			}
			initialized = true;
		}

		this.execute = function () {
			if (initialized) {
				if (typeof expression !== 'function') {
					result = eval(exp);
				} else {
					result = exp(_item);
				}
			}
		}

		this.getLastResult = function () {
			return result;
		}
		this.getParams = function () {
			return parts;
		}
	}

	function Summarize(args) {		
		var result = 0;
		var _item;
		var params = [];

		this.init = function (item) {
			_item = item;
			params = args;
		}

		this.execute = function () {
			result = 0;
			for (var i = 0; i < args.length; i++) {
				result += parseFloat(_item[args[i]]);
			}
		}

		this.getLastResult = function () {
			return result;
		}

		this.getParams = function () {
			return args;
		}
	}

	function Multiply(args) {
		var result = 1;
		var _item;

		this.init = function (item) {
			_item = item;
		}

		this.execute = function () {
			result = _item[args[0]];
			for (var i = 1; i < args.length; i++) {
				result *= parseFloat(_item[args[i]]);
			}
		}

		this.getLastResult = function () {
			return result;
		}

		this.getParams = function () {
			return args;
		}
	}

	function Subtract(args) {
		var result = 0;
		var _item;

		this.init = function (item) {
			_item = item;
		}

		this.execute = function () {
			result = _item[args[0]];
			for (var i = 1; i < args.length; i++) {
				result -= parseFloat(_item[args[i]]);
			}
		}

		this.getLastResult = function () {
			return result;
		}

		this.getParams = function () {
			return args;
		}
	}

	function Divide(args) {
		var result = 0;
		var _item;

		this.init = function (item) {
			_item = item;
		}

		this.execute = function () {
			result = _item[args[0]];
			for (var i = 0; i < args.length; i++) {
				result /= parseFloat(_item[args[i]]);
			}
		}

		this.getLastResult = function () {
			return result;
		}

		this.getParams = function () {
			return args;
		}
	}

})(jQuery);