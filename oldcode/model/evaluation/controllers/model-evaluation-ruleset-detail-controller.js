/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRulesetDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model evaluation ruleset entities.
	 **/
	angular.module(moduleName).controller('modelEvaluationRulesetDetailController', ModelEvaluationRulesetDetailController);

	ModelEvaluationRulesetDetailController.$inject = ['$scope', 'platformContainerControllerService', '$timeout',
		'modelEvaluationRulesetDataService', '_'];

	function ModelEvaluationRulesetDetailController($scope, platformContainerControllerService, $timeout,
		modelEvaluationRulesetDataService, _) {

		const isMasterContainer = !!$scope.getContentValue('isMasterContainer');

		modelEvaluationRulesetDataService.becomeAwareOfModule(isMasterContainer);

		const formGuid = isMasterContainer ? '2189edcf60884fceb7a062c5774c3698' : '5488706fc0b047cc94029e502ecd2bfe';
		platformContainerControllerService.initController($scope, moduleName, formGuid);

		function updateTools() {
			$scope.tools.update();
		}

		$timeout(function () {
			const createItem = _.find($scope.tools.items, {id: 'create'});
			if (createItem) {
				modelEvaluationRulesetDataService.addProjectWarningToCreation(createItem);
			}

			const parentTools = $scope.tools;
			const pjOverridesMenu = modelEvaluationRulesetDataService.createProjectOverridesMenu();
			if (pjOverridesMenu.menuItem) {
				let collapseAllItemIndex = _.findIndex(parentTools.items, {id: 'collapseall'});
				if (_.isNumber(collapseAllItemIndex)) {
					if ((collapseAllItemIndex - 1 >= 0) && (parentTools.items[collapseAllItemIndex - 1].type === 'divider')) {
						collapseAllItemIndex--;
						parentTools.items.splice(collapseAllItemIndex, 1);
					}
					parentTools.items.splice(collapseAllItemIndex, 0, pjOverridesMenu.menuItem);
				}
			}
			$scope.$on('$destroy', function () {
				pjOverridesMenu.destroy();
			});

			modelEvaluationRulesetDataService.registerUpdateTools(updateTools);
		});

		$scope.$on('$destroy', function () {
			modelEvaluationRulesetDataService.unregisterUpdateTools(updateTools);
		});
	}

})(angular);
