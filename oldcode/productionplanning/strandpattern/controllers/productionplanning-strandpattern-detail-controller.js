(function() {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.strandpattern';

	angular.module(moduleName).controller('productionplanningStrandpatternDetailController', [
		'$scope', 'platformContainerControllerService',
		function ProcessTemplateListController($scope, platformContainerControllerService) {
			let containerUUid = $scope.getContentValue('uuid');
			platformContainerControllerService.initController($scope, moduleName, containerUUid);
		}]);

})();