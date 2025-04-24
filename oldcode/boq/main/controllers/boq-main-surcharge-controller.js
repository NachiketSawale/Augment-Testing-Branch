/**
 * Created by joshi on 27.10.2015.
 */
(function () {

	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainSurchargeController
	 * @function
	 *
	 * @description
	 * Controller for the flat grid view of boq surcharge position items.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainSurchargeController',
		['$scope', 'boqMainService', 'boqMainSurchargeControllerFactory',
			function ($scope, boqMainService, boqMainSurchargeControllerFactory) {

				boqMainSurchargeControllerFactory.initController($scope, boqMainService, moduleName);
			}
		]);
})();
