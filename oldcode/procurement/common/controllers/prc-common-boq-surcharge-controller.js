/**
 * Created by bh on 15.02.2017.
 */
(function () {


	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name prcCommonBoqSurchargeController
	 * @function
	 *
	 * @description
	 * Controller for the flat grid view of boq surcharge position items.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('prcCommonBoqSurchargeController',
		['$scope', 'prcBoqMainService', 'boqMainSurchargeControllerFactory', 'procurementContextService',
			function ( $scope, prcBoqMainService, boqMainSurchargeControllerFactory, procurementContextService) {

				var boqMainService = prcBoqMainService.getService(procurementContextService.getMainService());
				var contextModuleName = procurementContextService.getModuleName();

				boqMainSurchargeControllerFactory.initController($scope, boqMainService, contextModuleName);
			}
		]);
})();
