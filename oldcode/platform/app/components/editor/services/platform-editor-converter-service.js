/*
 * $Id: platform-editor-converter-service.js $
 * Copyright (c) RIB Software GmbH
/* globals define, angular */
(function (root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['quill'], factory);
	} else if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = factory(require('quill'));
	} else {
		root.Requester = factory(root.Quill);
	}
})(this, function (Quill) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformEditorConverterService
	 * @function
	 * @requires
	 * @description
	 * platformGridFilterService provides filter service for Grid
	 */
	angular.module('platform').factory('platformEditorConverterService', platformEditorConverterService);

	platformEditorConverterService.$inject = ['platformDomainService', 'platformContextService', 'platformLanguageService'];

	function platformEditorConverterService(platformDomainService, platformContextService, platformLanguageService) { // jshint ignore:line

		var service = {};
		var culture = platformContextService.culture();
		var cultureInfo = platformLanguageService.getLanguageInfo(culture);

		platformContextService.contextChanged.register(function (type) {
			if (type === 'culture') {
				culture = platformContextService.culture();
				cultureInfo = platformLanguageService.getLanguageInfo(culture);
			}
		});

		service.convertOldFormat = function convertOldFormat(htmlString, settings) {
			var converted = '';
			var domNodes = $.parseHTML(htmlString);

			$.each(domNodes, function (i, el) {
				loopThroughElements(el, settings);
				if (el.outerHTML) {
					converted += el.outerHTML;
				}
				else if (el.data) {
					converted += el.data;
				}
			});
			var stringsToRemove = ['<tbody>', '</tbody>'];
			$.each(stringsToRemove, function (i, str) {
				converted = converted.replace(str, '');
			});
			return converted;
		};

		function loopThroughElements(el, settings) {
			if (el.nodeName === 'TABLE') {
				let tableId = el.getAttribute('table_id');
				if(!tableId) {
					tableId = createId();
				}
				el.setAttribute('table_id', tableId);
				// Loop through children to set rows and cell ids
				if (el.children.length > 0) {
					setTableIds(el, tableId);
				}
			} else if (el.nodeName === 'SPAN') {
				if (el.style.textDecorationLine === 'underline') {
					el.innerHTML = '<u>' + el.innerHTML + '</u>';
				} else if (el.style.textDecorationLine === 'line-through') {
					el.innerHTML = '<s>' + el.innerHTML + '</s>';
				}
			}
			if (el.children && el.children.length > 0) {
				$.each(el.children, function (i, childEl) {
					loopThroughElements(childEl,settings);
				});
			}
		}

		function setTableIds(node, tableId, parentRowId) {
			$.each(node.children, function (i, el) {
				if (el.nodeName === 'TBODY' && el.children.length > 0) {
					setTableIds(el, tableId);
				} else if (el.nodeName === 'TR') {
					let rowId = el.getAttribute('row_id');
					if(!rowId) {
						rowId = createId();
					}
					el.setAttribute('table_id', tableId);
					el.setAttribute('row_id', rowId);
					// Loop through children to set rows and cell ids
					if (el.children.length > 0) {
						setTableIds(el, tableId, rowId);
					}
				} else if (el.nodeName === 'TD') {
					let cellId = el.getAttribute('cell_id');
					if(!cellId) {
						cellId = createId();
					}
					el.setAttribute('table_id', tableId);
					el.setAttribute('row_id', parentRowId);
					el.setAttribute('cell_id', cellId);
					if (el.innerHTML === '') {
						el.innerHTML = '<p><br></p>';
					} else {
						// Handle format of cell
						if (el.children.length > 0) {
							$(el).find('span').each(function (i, spanEl) {
								if (spanEl.style.textDecorationLine === 'underline') {
									spanEl.innerHTML = '<u>' + spanEl.innerHTML + '</u>';
								}
								if (spanEl.style.fontStyle === 'italic') {
									spanEl.innerHTML = '<i>' + spanEl.innerHTML + '</i>';
								}
								if (spanEl.style.fontWeight === 'bold') {
									spanEl.innerHTML = '<b>' + spanEl.innerHTML + '</b>';
								}
							});
						}
						el.innerHTML = '<p>' + el.innerHTML + '</p>';
					}
				}
			});
		}

		function createId() {
			return Math.random().toString(26).slice(2);
		}

		return service;
	}
});
