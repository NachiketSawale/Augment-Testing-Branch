(function () {
	'use strict';
	/*global angular*/

	const moduleName = 'productionplanning.strandpattern';

	angular.module(moduleName).controller('productionplanningStrandpatternPhotoController', [
		'$scope',  'productionplanningStrandpatternPhotoService', 'productionplanningStrandpatternDataService','platformFileUtilControllerFactory',
		function ($scope, strandpatternPhotoService, strandpatternMainService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, strandpatternMainService, strandpatternPhotoService);
		}
	]);
})();