/*
 * $Id: platform-rich-text-editor-toolbaritem-service.js $
 * Copyright (c) RIB Software GmbH
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name editor:platformEditorToolbaritemsService
	 * @function
	 * @requires
	 * @description
	 * platformGridFilterService provides filter service for Grid
	 */
	angular.module('platform').factory('platformEditorToolbaritemsService', platformEditorToolbaritemsService);

	function platformEditorToolbaritemsService() { // jshint ignore:line

		var service = {};

		service.attach = function (quill, toolbaritem, index) {
			toolbaritem.quill = quill;
			toolbaritem.toolbar = quill.getModule('toolbar');
			toolbaritem.toolbarEl = toolbaritem.toolbar.container;
			if (index) {
				if (toolbaritem.toolbarEl.childElementCount > index) {
					toolbaritem.toolbarEl.insertBefore(toolbaritem.qlFormatsEl, toolbaritem.toolbarEl.children[index]);
				} else {
					toolbaritem.toolbarEl.appendChild(toolbaritem.qlFormatsEl);
				}
			} else {
				toolbaritem.toolbarEl.appendChild(toolbaritem.qlFormatsEl);
			}
		};

		service.detach = function (toolbaritem) {
			toolbaritem.toolbarEl.removeChild(toolbaritem.qlFormatsEl);
		};

		/**
		 * Add a global css rule to the document.
		 *
		 * @param {string} cssRule - CSS rules
		 */
		function addCssRule(cssRule) {
			const style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule(cssRule, 0);
		}

		/**
		 * Generate a random ID.
		 *
		 * @returns {string} random 10 digit ID
		 */
		function generateId() {
			return Math.random().toString().substr(2, 10);
		}

		service.createButton = function (options) {
			var button = {};

			button.options = options;

			button.qlFormatsEl = document.createElement('span');
			button.qlFormatsEl.className = 'ql-formats';

			/**
			 * Set the icon for this button tool.
			 *
			 * @param {string} newLabel - The <svg> or <img> html tag to use as an icon. (Make sure it's 18x18 in size.)
			 */
			function setIcon(imageHtml) {
				button.qlButton.innerHTML = imageHtml;
			}

			/**
			 * Set the hidden value of this button tool.
			 *
			 * @param {string} newLabel - The <svg> or <img> html tag to use as an icon. (Make sure it's 18x18 in size.)
			 */
			function setValue(value) {
				button.qlButton.value = value;
			}

			/**
			 * Set the hidden value of this button tool.
			 *
			 * @param {string} newLabel - The <svg> or <img> html tag to use as an icon. (Make sure it's 18x18 in size.)
			 */
			function getValue() {
				return button.qlButton.value;
			}

			button.id = button.options.id || `button-${generateId()}`;

			button.qlButton = document.createElement('button');
			button.qlButton.className = `ql-${button.id}`;
			setValue(button.options.value);
			setIcon(button.options.icon);
			button.qlButton.onclick = function () {
				if (button.options.toggle) {
					if (button.qlButton.classList.contains('active')) {
						button.qlButton.classList.remove('active');
					} else {
						button.qlButton.classList.add('active');
					}
				}
				button.onClick(button, button.quill);
			};
			button.qlFormatsEl.appendChild(button.qlButton);

			return button;
		};

		service.createDropDownItem = function (options) {
			var dropDownItem = {};

			/**
			 * Calculate the width of text.
			 *
			 * @param {string} text - The text of which the length should be calculated.
			 * @param {string} [font="500 14px 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"] - The font css that shuold be applied to the text before calculating the width.
			 */
			function getTextWidth(text, font = '500 14px "Helvetica Neue", "Helvetica", "Arial", sans-serif') {
				const canvas = document.createElement('canvas');
				const context = canvas.getContext('2d');
				context.font = font;
				const metrics = context.measureText(text);
				return metrics.width;
			}

			/**
			 * Set the label for this dropdown tool and automatically adjust the width to fit the label.
			 *
			 * @param {String} newLabel - The new label that should be set.
			 */
			function setLabel(newLabel) {
				const requiredWidth = `${getTextWidth(newLabel) + 30}px`;
				dropDownItem.dropDownPickerLabelEl.style.width = requiredWidth;
				dropDownItem.dropDownPickerLabelEl.setAttribute('data-label', newLabel);
			}

			function setItems(items) {
				for (const [label, value] of Object.entries(items)) {
					const newItemEl = document.createElement('span');
					newItemEl.className = 'ql-picker-item';
					newItemEl.innerText = label;
					newItemEl.setAttribute('data-value', value);
					newItemEl.setAttribute('title', label);
					newItemEl.onclick = function (e) {
						dropDownItem.dropDownEl.classList.remove('ql-expanded');
						if (dropDownItem.options.rememberSelection) {
							dropDownItem.setLabel(label);
						}

						if (dropDownItem.onSelect) {
							dropDownItem.onSelect(label, value, dropDownItem.quill);
						}

					};
					dropDownItem.dropDownPickerEl.appendChild(newItemEl);
				}
			}

			dropDownItem.options = options;

			dropDownItem.qlFormatsEl = document.createElement('span');
			dropDownItem.qlFormatsEl.className = 'ql-formats';

			dropDownItem.id = dropDownItem.options.id || `dropdown-${generateId()}`;

			const qlPicker = document.createElement('span');
			qlPicker.className = `ql-${dropDownItem.id} ql-picker`;
			dropDownItem.qlFormatsEl.appendChild(qlPicker);

			const qlPickerLabel = document.createElement('span');
			qlPickerLabel.className = 'ql-picker-label';
			qlPicker.appendChild(qlPickerLabel);
			qlPickerLabel.addEventListener('click', function (e) {
				qlPicker.classList.toggle('ql-expanded');
			});
			window.addEventListener('click', function (e) {
				if (!qlPicker.contains(e.target)) {
					qlPicker.classList.remove('ql-expanded');
				}
			});

			const qlPickerOptions = document.createElement('span');
			qlPickerOptions.className = 'ql-picker-options';
			qlPicker.appendChild(qlPickerOptions);

			dropDownItem.dropDownEl = qlPicker;
			dropDownItem.dropDownPickerEl = dropDownItem.dropDownEl.querySelector('.ql-picker-options');
			dropDownItem.dropDownPickerLabelEl = dropDownItem.dropDownEl.querySelector('.ql-picker-label');
			dropDownItem.dropDownPickerLabelEl.innerHTML = '<svg viewBox="0 0 18 18"> <polygon class="ql-stroke" points="7 11 9 13 11 11 7 11"></polygon> <polygon class="ql-stroke" points="7 7 9 5 11 7 7 7"></polygon> </svg>';

			setLabel(dropDownItem.options.label || '');
			setItems(dropDownItem.options.items || {});

			addCssRule(`
                    .ql-snow .ql-picker.ql-${dropDownItem.id} .ql-picker-label::before, .ql-${dropDownItem.id} .ql-picker.ql-size .ql-picker-item::before {
                    content: attr(data-label);}`);

			return dropDownItem;
		};

		service.resetItems = function (items, dropdown) {
			dropdown.dropDownPickerEl.innerHTML = '';
			for (const [label, value] of Object.entries(items)) {
				const newItemEl = document.createElement('span');
				newItemEl.className = 'ql-picker-item';
				newItemEl.innerText = label;
				newItemEl.setAttribute('data-value', value);
				newItemEl.onclick = function (e) {
					dropdown.dropDownEl.classList.remove('ql-expanded');
					if (dropdown.options.rememberSelection) {
						dropdown.setLabel(label);
					}

					if (dropdown.onSelect) {
						dropdown.onSelect(label, value, dropdown.quill);
					}

				};
				dropdown.dropDownPickerEl.appendChild(newItemEl);
			}
		};

		return service;

	}
})
();
