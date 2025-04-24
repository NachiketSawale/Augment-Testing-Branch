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

	angular.module(moduleName).controller('basicsCostCodesPriceVersionDetailController',
		['$scope', 'platformDetailControllerService',
			'basicsCostCodesPriceVersionUIStandardService', 'basicsCostCodesPriceVersionDataService',
			'basicsCostCodesPriceVersionValidationService', 'basicsCostCodesPriceVersionTranslationService',
			function ($scope, platformDetailControllerService,
				uiStandardService, dataService, validationService, translationService) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translationService);


			}
		]);
})(angular);

