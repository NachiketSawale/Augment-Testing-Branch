/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRuleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model evaluation rule entities.
	 **/
	angular.module(moduleName).controller('modelEvaluationRuleDetailController', ModelEvaluationRuleDetailController);

	ModelEvaluationRuleDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelEvaluationRuleDataService', '$timeout'];

	function ModelEvaluationRuleDetailController($scope, platformContainerControllerService,
		modelEvaluationRuleDataService, $timeout) {

		const isMasterContainer = !!$scope.getContentValue('isMasterContainer');

		platformContainerControllerService.initController($scope, moduleName, isMasterContainer ? 'ac2d8e9322e941278dc95068d8a9c5eb' : '5a4d078143764838ac5d8e7dcfa5ca9b');

		function updateTools() {
			$scope.tools.update();
		}

		$timeout(function () {
			modelEvaluationRuleDataService.registerUpdateTools(updateTools);
		});

		$scope.$on('$destroy', function () {
			modelEvaluationRuleDataService.unregisterUpdateTools(updateTools);
		});
	}
})(angular);
