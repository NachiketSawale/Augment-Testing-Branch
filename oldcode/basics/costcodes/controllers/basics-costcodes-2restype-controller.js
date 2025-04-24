/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesResTypeController
	 * @function
	 * @description
	 * Controller for the  detail view of Resource type.
	 **/
	angular.module(moduleName).controller('basicsCostCodesResTypeController',
		['$scope', 'platformGridAPI', 'basicsCostCodes2ResTypeService', 'platformGridControllerService', 'basicsCostCodes2ResTypeUIConfigurationService',
			function ($scope, platformGridAPI, dataService, platformGridControllerService, basicsCostCodes2ResTypeUIConfigurationService) {

				let myGridConfig = {
					initCalled: false,
					columns: []
				};
				platformGridControllerService.initListController($scope, basicsCostCodes2ResTypeUIConfigurationService, dataService, null, myGridConfig);
			}
		]);
})(angular);