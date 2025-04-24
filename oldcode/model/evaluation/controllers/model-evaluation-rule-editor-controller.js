/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRuleEditorController
	 * @function
	 *
	 * @description
	 * Controller for the model evaluation rule editor.
	 **/
	angular.module(moduleName).controller('modelEvaluationRuleEditorController',
		ModelEvaluationRuleEditorController);

	ModelEvaluationRuleEditorController.$inject = ['$scope', '$translate',
		'modelEvaluationRuleEditorModeService', 'modelEvaluationRuleDataService',
		'platformPermissionService'];

	function ModelEvaluationRuleEditorController($scope, $translate,
		modelEvaluationRuleEditorModeService, modelEvaluationRuleDataService,
		platformPermissionService) {

		const modeController = modelEvaluationRuleEditorModeService.generateToolItem(null, {
			scope: $scope,
			entityPath: 'ruleEntity',
			editable: !$scope.isRuleEditorReadOnly
		});
		$scope.registerModeChanged = modeController.registerValueChanged;
		$scope.getSelectedMode = modeController.getSelection;

		function updateTools() {
			$scope.tools.update();
		}

		modeController.registerValueChanged(updateTools);
		$scope.$on('$destroy', function () {
			modeController.unregisterValueChanged(updateTools);
		});

		const toolItems = modeController.menuItems;
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools'
		});
		$scope.tools.items = toolItems;
		$scope.tools.update();

		$scope.isRuleEditorReadOnly = true;

		function updateRuleSelection() {
			$scope.$evalAsync(function () {
				const newRule = modelEvaluationRuleDataService.getSelected();
				$scope.ruleEntity = null;
				modeController.setEnabled(false);
				$scope.tools.update();

				if ($scope.currentEditor) {
					$scope.currentEditor.updateSelection(false);
				}

				$scope.ruleEntity = newRule;
				if ($scope.ruleEntity) {
					$scope.isRuleEditorReadOnly = modelEvaluationRuleDataService.isRuleReadOnly(newRule) || !platformPermissionService.hasWrite('3e58fcde812847c89942f3d365dc2d9b');

					$scope.hideOverlay();
					modeController.setSelection($scope.ruleEntity.ModeId);
					modeController.setEnabled(!$scope.isRuleEditorReadOnly);
					$scope.tools.update();

					if ($scope.currentEditor) {
						$scope.currentEditor.updateSelection(!$scope.isRuleEditorReadOnly);
					}
				} else {
					$scope.showOverlay(false, $translate.instant('model.evaluation.noRuleSelected'));
				}
			});
		}

		updateRuleSelection();

		$scope.showOverlay = function (loading, message) {
			if (loading) {
				$scope.isLoading = true;
				$scope.showInfoOverlay = false;
			} else {
				$scope.isLoading = false;
				$scope.showInfoOverlay = true;
			}
			$scope.overlayInfo = message;
		};

		$scope.hideOverlay = function () {
			$scope.isLoading = false;
			$scope.showInfoOverlay = false;
		};

		modelEvaluationRuleDataService.registerSelectionChanged(updateRuleSelection);

		$scope.$on('$destroy', function () {
			modelEvaluationRuleDataService.unregisterSelectionChanged(updateRuleSelection);
		});
	}
})(angular);
