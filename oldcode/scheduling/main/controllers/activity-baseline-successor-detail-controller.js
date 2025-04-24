/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	let moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainBaselineSuccessorDetailController', schedulingMainBaselineSuccessorDetailController);

	schedulingMainBaselineSuccessorDetailController.$inject = ['$scope', 'platformContainerControllerService', 'schedulingMainConstantValues'];

	function schedulingMainBaselineSuccessorDetailController($scope, platformContainerControllerService, schedulingMainConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, schedulingMainConstantValues.uuid.container.baselineSuccessorDetail, 'schedulingMainTranslationService');
	}

})(angular);