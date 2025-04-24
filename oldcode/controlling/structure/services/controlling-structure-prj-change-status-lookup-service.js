(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'controlling.structure';

	/**
	 * @ngdoc service
	 * @name ControllingStructurePrjChangeStatusLookupService
	 * @function
	 *
	 * @description
	 * controllingStructurePrjChangeStatusLookupService provides lookup data for controlling structure project change status
	 */

	angular.module(moduleName).factory('controllingStructurePrjChangeStatusLookupService', ['controllingCommonPrjChangeStatusLookupServiceFactory', 'projectMainForCOStructureService',
		function (factory, mainService) {
			return factory.createPrjChangeStatusLookupService(mainService);
		}]);
})();
