(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	/**
	 * @ngdoc service
	 * @name ControllingProjectcontrolsPrjChangeStatusLookupService
	 * @function
	 *
	 * @description
	 * controllingProjectcontrolsPrjChangeStatusLookupService provides lookup data for controlling projectcontrols project change status
	 */

	angular.module(moduleName).factory('controllingProjectcontrolsPrjChangeStatusLookupService', ['controllingCommonPrjChangeStatusLookupServiceFactory', 'controllingProjectcontrolsDashboardService',
		function (factory, mainService) {
			return factory.createPrjChangeStatusLookupService(mainService);
		}]);
})();
