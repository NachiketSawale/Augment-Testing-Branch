/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.evaluation.directive:modelEvaluationRuleEditor
	 * @element div
	 * @restrict A
	 * @description The outermost container for displaying a UI for editing evaluation rules.
	 */
	angular.module('model.evaluation').directive('modelEvaluationRuleEditor', ['modelEvaluationRuleEditorModeService',
		'modelEvaluationRuleDataService',
		function (modelEvaluationRuleEditorModeService, modelEvaluationRuleDataService) {
			return {
				restrict: 'A',
				scope: false,
				link: function (scope, elem) {
					scope.currentEditor = null;

					function updateMode(newModeId) {
						if (scope.ruleEditorMode === newModeId) {
							return;
						}

						scope.ruleEditorMode = newModeId;
						if (scope.ruleEntity) {
							if (scope.ruleEntity.ModeId !== newModeId) {
								scope.ruleEntity.ModeId = newModeId;
								modelEvaluationRuleDataService.markItemAsModified(scope.ruleEntity);
							}
						}

						scope.showOverlay(true, '');
						elem.empty();
						if (scope.currentEditor) {
							scope.currentEditor.destroy();
							scope.currentEditor = null;
						}
						var mode = modelEvaluationRuleEditorModeService.getModeById(newModeId);
						if (mode) {
							mode.createEditor({
								scope: scope,
								entityPath: 'ruleEntity',
								editable: !scope.isRuleEditorReadOnly
							}).then(function (editor) {
								scope.currentEditor = editor;
								editor.registerValueChanged(function () {
									if (scope.ruleEntity) {
										modelEvaluationRuleDataService.markItemAsModified(scope.ruleEntity);
									}
								});
								scope.$evalAsync(function () {
									elem.append(editor.element);
								});
								if (scope.ruleEntity) {
									scope.hideOverlay();
								}
							});
						}
					}

					scope.registerModeChanged(function (modeId) {
						updateMode(modeId);
					});

					updateMode(scope.getSelectedMode());
				}
			};
		}]);
})();