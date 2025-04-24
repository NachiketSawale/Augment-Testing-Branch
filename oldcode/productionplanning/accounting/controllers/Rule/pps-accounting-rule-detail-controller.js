/**
 * Created by anl on 4/3/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleDetailController', RuleDetailController);

	RuleDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningAccountingTranslationService'];

	function RuleDetailController($scope, platformContainerControllerService, translationService) {
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid, translationService);
	}

})(angular);
