/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRuleListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model evaluation rule entities.
	 **/
	angular.module(moduleName).controller('modelEvaluationRuleListController', ModelEvaluationRuleListController);

	ModelEvaluationRuleListController.$inject = ['$scope', '_', 'platformContainerControllerService',
		'platformGridControllerService', 'modelEvaluationRuleset2HlSchemeMappingMenuService',
		'modelAdministrationDynHlItemByMappingLookupDataService', 'modelEvaluationRuleDataService'];

	function ModelEvaluationRuleListController($scope, _, platformContainerControllerService,
		platformGridControllerService, modelEvaluationRuleset2HlSchemeMappingMenuService,
		modelAdministrationDynHlItemByMappingLookupDataService, modelEvaluationRuleDataService) {

		const isMasterContainer = !!$scope.getContentValue('isMasterContainer');

		platformContainerControllerService.initController($scope, moduleName, isMasterContainer ? '3e58fcde812847c89942f3d365dc2d9b' : '3a0e7703abd140febba420db01e72c88');

		modelAdministrationDynHlItemByMappingLookupDataService.attachToMappingService();

		const hlSchemeItemInfo = modelEvaluationRuleset2HlSchemeMappingMenuService.createToolItem($scope);

		platformGridControllerService.addTools([hlSchemeItemInfo.toolItem]);

		function updateTools() {
			$scope.tools.update();
		}

		modelEvaluationRuleDataService.registerUpdateTools(updateTools);

		const pjOverridesMenu = modelEvaluationRuleDataService.createProjectOverridesMenu();
		if (pjOverridesMenu.menuItem) {
			const parentTools = $scope.tools;
			let groupingItemIndex = _.findIndex(parentTools.items, {id: 't12'});
			if (_.isNumber(groupingItemIndex)) {
				if ((groupingItemIndex - 1 >= 0) && (parentTools.items[groupingItemIndex - 1].type === 'divider')) {
					groupingItemIndex--;
					parentTools.items.splice(groupingItemIndex, 1);
				}
				parentTools.items.splice(groupingItemIndex, 0, pjOverridesMenu.menuItem);
			}
		}

		$scope.$on('$destroy', function () {
			modelAdministrationDynHlItemByMappingLookupDataService.detachFromMappingService();
			hlSchemeItemInfo.destroy();
			modelEvaluationRuleDataService.unregisterUpdateTools(updateTools);
			pjOverridesMenu.destroy();
		});
	}
})(angular);
