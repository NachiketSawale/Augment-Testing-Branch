/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';
	/**
	 * @ngdoc controller
	 * @name controllingActualsCostHeaderDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of cost header information (ACTUALS).
	 **/
	angular.module(moduleName).controller('controllingActualsCostHeaderDetailController',
		['$scope', 'platformDetailControllerService', 'controllingActualsCostHeaderListService', 'controllingActualsValidationService', 'controllingActualsCostHeaderConfigurationService', 'controllingActualsTranslationService', 'controllingActualsCommonService',
			function ($scope, platformDetailControllerService, controllingActualsCostHeaderListService, controllingActualsValidationService, controllingActualsCostHeaderConfigurationService, controllingActualsTranslationService, controllingActualsCommonService) {
				platformDetailControllerService.initDetailController($scope, controllingActualsCostHeaderListService, controllingActualsValidationService, controllingActualsCostHeaderConfigurationService, controllingActualsTranslationService);
				$scope.change = function change(item, model) {
					controllingActualsCommonService.checkItemToggle(item, model);
					controllingActualsCostHeaderListService.gridRefresh();
				};
			}
		]);
})(angular);
