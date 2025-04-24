(function() {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.strandpattern';

	angular.module(moduleName).controller('productionplanningStrandpattern2materialListController', [
		'$scope', 'platformContainerControllerService', 'platformTranslateService', 'productionplanningStrandpatternUIService',
		function ProcessTemplateListController($scope, platformContainerControllerService, platformTranslateService, uiStandardService) {
			platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
			let containerUUid = $scope.getContentValue('uuid');
			platformContainerControllerService.initController($scope, moduleName, containerUUid);
		}]);

})();