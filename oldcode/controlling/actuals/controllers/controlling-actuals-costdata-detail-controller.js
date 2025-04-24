/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	angular.module(moduleName).value('controllingActualsDetailConfig', {groups: [], rows: []});

	/**
	 * @ngdoc controller
	 * @name controllingActualsCostDataDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of cost data information (ACTUALS).
	 **/
	angular.module(moduleName).controller('controllingActualsCostDataDetailController',
		['$scope', 'platformDetailControllerService', 'controllingActualsCostDataListService', 'controllingActualsCostDataConfigurationService', 'controllingActualsTranslationService', 'controllingActualsCommonService', 'controllingActualsCostDataValidationService',
			function ($scope, platformDetailControllerService, controllingActualsCostDataListService, controllingActualsCostDataConfigurationService, controllingActualsTranslationService, controllingActualsCommonService, controllingActualsCostDataValidationService) {
				platformDetailControllerService.initDetailController($scope, controllingActualsCostDataListService, controllingActualsCostDataValidationService, controllingActualsCostDataConfigurationService, controllingActualsCommonService, controllingActualsTranslationService);

				$scope.change = function change(item, model) {
					controllingActualsCommonService.setReadOnly(item, model);
					controllingActualsCostDataListService.gridRefresh();
				};
			}
		]);
})(angular);
