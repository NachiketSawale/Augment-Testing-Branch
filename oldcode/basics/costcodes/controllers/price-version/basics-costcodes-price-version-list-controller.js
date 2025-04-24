/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesPriceVersionListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of cost codes price version entities.
	 **/

	angular.module(moduleName).controller('basicsCostCodesPriceVersionListController',
		['$scope', 'platformGridControllerService',
			'basicsCostCodesPriceVersionUIStandardService', 'basicsCostCodesPriceVersionDataService',
			'basicsCostCodesPriceVersionValidationService',
			function ($scope, platformGridControllerService,
				uiStandardService, dataService, validationService) {

				platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, {});
			}
		]);
})(angular);

