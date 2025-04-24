/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRulesetListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model evaluation ruleset entities.
	 **/
	angular.module(moduleName).controller('modelEvaluationRulesetListController', ModelEvaluationRulesetListController);

	ModelEvaluationRulesetListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelEvaluationRulesetDataService'];

	function ModelEvaluationRulesetListController($scope, platformContainerControllerService,
		modelEvaluationRulesetDataService) {

		const isMasterContainer = !!$scope.getContentValue('isMasterContainer');
		const listGuid = isMasterContainer ? '0fe1504979b947e68234ecd04c799af8' : '63e957df0af245a19f9608ac9beced3b';

		modelEvaluationRulesetDataService.becomeAwareOfModule(isMasterContainer);

		platformContainerControllerService.initController($scope, moduleName, listGuid);

		function updateTools() {
			$scope.tools.update();
		}

		modelEvaluationRulesetDataService.registerUpdateTools(updateTools);

		$scope.$on('$destroy', function () {
			modelEvaluationRulesetDataService.unregisterUpdateTools(updateTools);
		});
	}
})(angular);
