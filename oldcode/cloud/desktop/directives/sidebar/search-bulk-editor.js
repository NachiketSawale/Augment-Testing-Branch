/*
 * $Id: search-bulk-editor.js 553244 2019-08-02 11:23:44Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name cloud.desktop.directive:modelEvaluationRuleEditor
	 * @element div
	 * @restrict A
	 * @description The outermost container for displaying a UI for editing bulk expression filters.
	 */
	angular.module('cloud.desktop').directive('cloudDesktopBulkEditor', ['$compile', 'cloudDesktopBulkSearchDataService',
		function ($compile, bulkSearchDataService) {
			return {
				restrict: 'A',
				scope: false,
				link: function (scope, elem) {

					function appendEditor(editor) {
						if (editor) {
							editor = bulkSearchDataService.currentEditor;
							// var editor = bulkSearchDataService.currentEditor;
							scope.ruleEditorManager = editor.mgr;
							scope.ruleEditorManager.registerRuleChanged(function () {
								if (scope.searchOptions.selectedItem) {
									scope.searchOptions.selectedItem.setModified(true);
								}
							});
							scope.$evalAsync(function () {
								elem.empty();
								elem.append($compile(editor.htmlCode)(scope));
							});
						}
					}

					scope.$watch('currentEditor', appendEditor);

				}
			};
		}]);
})();