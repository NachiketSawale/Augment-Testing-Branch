/*
 * $Id: platform-editor-service.js 2021-03-23 12:52:34Z ong $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformEditorService
	 * @description
	 * # platformRichTextEditorService
	 */
	angular.module('platform').service('platformEditorService', platformEditorService);

	platformEditorService.$inject = [];

	// noinspection OverlyComplexFunctionJS
	function platformEditorService() {

		var service = {};
		var _editors = {};

		service.register = function (editorName, editor) {
			_editors[editorName] = editor;
		};

		service.unregister = function (editorName) {
			_editors[editorName] = null;
		};

		service.getEditor = function (editorName) {
			return _editors[editorName];
		};

		service.insertTextAtCurrentCursorPos = function (editorName, val) {
			var editor = _editors[editorName];
			if (editor) {
				var selection = editor.getSelection(true);
				editor.insertText(selection.index, val);
			}

		};

		service.insertHtmlAtCurrentCursorPos = function (editorName, htmlVal) {
			var editor = _editors[editorName];
			if (editor) {
				var selection = editor.getSelection(true);
				editor.clipboard.dangerouslyPasteHTML(selection.index, htmlVal);

			}
		};

		return service;

	}
})(angular);
