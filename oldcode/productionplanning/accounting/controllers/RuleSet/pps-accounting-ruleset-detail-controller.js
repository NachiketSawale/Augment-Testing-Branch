/**
 * Created by anl on 4/3/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleSetDetailController', RuleSetDetailController);

	RuleSetDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningAccountingTranslationService'];

	function RuleSetDetailController($scope, platformContainerControllerService, translationService) {
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid, translationService);
	}

})(angular);