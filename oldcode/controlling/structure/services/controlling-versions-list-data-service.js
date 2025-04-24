(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module('controlling.structure');

	controllingStructureModule.factory('controllingVersionsListDataService',
		['controllingVersionsListDataServiceFactory', 'projectMainForCOStructureService',
			function (controllingVersionsListDataServiceFactory, projectMainForCOStructureService) {

				return  controllingVersionsListDataServiceFactory.createControllingVersionsListDataService(moduleName, projectMainForCOStructureService);
			}]);
})();
