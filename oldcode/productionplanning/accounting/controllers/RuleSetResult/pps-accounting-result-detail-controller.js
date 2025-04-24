/**
 * Created by anl on 4/25/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingResultDetailController', ResultDetailController);

	ResultDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningAccountingTranslationService'];

	function ResultDetailController($scope, platformContainerControllerService, translationService) {
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid, translationService);
	}

})(angular);