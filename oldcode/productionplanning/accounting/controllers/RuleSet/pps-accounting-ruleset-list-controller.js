/**
 * Created by anl on 4/3/2019.
 */

(function(angular){
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleSetListController', RuleSetListController);

	RuleSetListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningAccountingRuleSetUIStandardService'];

	function RuleSetListController($scope, platformContainerControllerService,
								platformTranslateService, uiStandardService){

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}

})(angular);