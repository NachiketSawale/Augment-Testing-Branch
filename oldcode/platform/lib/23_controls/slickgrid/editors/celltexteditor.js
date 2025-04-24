/***
 * Contains basic RIB specific SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function ($) {
	"use strict";

	// register namespace
	$.extend(true, window, {
		"Slick": {
			"Editors": {
				"InputCell": cellStringEditor,	// deprecated - use "InputString" instead
				"InputString": cellStringEditor,
				"InputInteger": cellIntegerEditor,
				"InputDecimal": cellNumberEditor,	// deprecated - use "InputNumber" instead
				"InputNumber": cellNumberEditor
			}
		}
	});

	function cellStringEditor(args) {

		cellStringEditor.prototype = cellTextEditor;

		var editor = new cellTextEditor(args, "string");
		return editor;
	}

	/*
	 * Input editor allows only 0 to 9 and +-
	 * @returns user input as parsInt
	 */
	function cellIntegerEditor(args) {

		var editor = new cellTextEditor(args, "integer");
		return editor;
	}

	/*
	* Input editor allows only 0 to 9, +- and .
	* @returns user input as parseFloat
	*/
	function cellNumberEditor(args) {

		var editor = new cellTextEditor(args, "decimal");
		return editor;
	}


	/**
	 * Base input editor
	 */
	function cellTextEditor(args, inputType) {

		var $input;
		var defaultValue;
		var scope;

		var isIntegerInputType = function () { return inputType === "integer"; };
		var isDecimalInputType = function () { return inputType === "decimal"; };

		this.init = function () {

         var width = args.container.clientWidth - 2 * args.container.clientLeft;
			$input = $('<INPUT type=text class="editor-text" style="width:' + width + 'px;" />')

				.appendTo(args.container)

				.bind("keydown.nav", function (e) {
					if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
						e.stopImmediatePropagation();
					}
				})

				.bind("keypress.nav", function (e) {

					// console.log(e.keyCode);
					var validKeys = null;

					if (isIntegerInputType()) {
						validKeys = [43, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];	// +-0-9
					}

					if (isDecimalInputType()) {
						validKeys = [43, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 44, 39];	// +-.0-9,'
					}

					if (validKeys && validKeys.indexOf(e.keyCode) === -1)	// not in array
					{
						e.preventDefault();
					}
				})

				.focus()
				.select();
		};

		this.destroy = function () {
			$input.remove();
		};

		this.focus = function () {
			$input.focus();
		};

		this.getValue = function () {
			return $input.val();
		};

		this.setValue = function (val) {
			$input.val(val);
		};

		// load the value(s) from the data item and update the UI
		// this method will be called immediately after the editor is initialized
		// it may also be called by the grid if if the row/cell being edited is updated via grid.updateRow/updateCell
		this.loadValue = function (item) {

			defaultValue = item[args.column.field] === undefined ? "" : item[args.column.field];

			// console.log("loadValue: " + defaultValue);

			$input.val(defaultValue);
			$input[0].defaultValue = defaultValue;
			$input.select();
		};

		// return the value(s) being edited by the user in a serialized form
		// can be an arbitrary object
		// the only restriction is that it must be a simple object that can be passed around even
		// when the editor itself has been destroyed
		this.serializeValue = function () {

			// console.log("serializeValue: " + $input.val());

			// return Integer or Number type
			if (isIntegerInputType() || isDecimalInputType()) {

				// parse user input (consider user specific number settings)
				var temp = $input.val().parseUserLocaleNumber();
				if (!isNaN(temp)) {
					if (isIntegerInputType()) {
						return parseInt(temp, 10) || 0;
					}
					else {
						return parseFloat(temp || 0);
					}
				} else{
					return '';
				}
			}

			return $input.val();

		};

		// deserialize the value(s) saved to "state" and apply them to the data item
		// this method may get called after the editor itself has been destroyed
		// treat it as an equivalent of a Java/C# "static" method - no instance variables should be accessed
		this.applyValue = function (item, state) {

			// console.log("applyValue: " + state);

			if (args.column.validator) {

				if (args.column.validator.length !== 3) {
					throw new Error("validator function must support 3 parameters !");
				}

				var validationResults = args.column.validator(args.item, args.column.field, state);
			}

			item[args.column.field] = state;
		};

		this.isValueChanged = function () {
			return (!($input.val() === "" && defaultValue === "")) && ($input.val() !== defaultValue);
		};

		// validate user input and return the result along with the validation message, if any
		// if the input is valid, return {valid:true,msg:null}
		this.validate = function () {

			// returns always true to omit slickgrid's "lock" behaviour
			return {
				valid: true,
				msg: null
			};
		};

		/*********** OPTIONAL METHODS***********/

		// if implemented, this will be called if the cell being edited is scrolled out of the view
		// implement this is your UI is not appended to the cell itself or if you open any secondary
		// selector controls (like a calendar for a datepicker input)
		this.hide = function () {
		};

		// pretty much the opposite of hide
		this.show = function () {
		};

		// if implemented, this will be called by the grid if any of the cell containers are scrolled
		// and the absolute position of the edited cell is changed
		// if your UI is constructed as a child of document BODY, implement this to update the
		// position of the elements as the position of the cell changes
		// 
		// the cellBox: { top, left, bottom, right, width, height, visible }
		this.position = function (cellBox) {
		};

		this.init();

	}

})(jQuery);
