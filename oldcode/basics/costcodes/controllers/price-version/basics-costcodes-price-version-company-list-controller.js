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

	angular.module(moduleName).controller('basicsCostCodesPriceVersionCompanyListController',
		['_','$scope', 'platformGridControllerService',
			'basicsCostCodesPriceVersionCompanyUIStandardService', 'basicsCostCodesPriceVersionCompanyDataService',
			'basicsCostCodesPriceVersionCompanyValidationService',
			function (_,$scope, platformGridControllerService,
				uiStandardService, dataService, validationService) {


				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'CompanyFk',
					childProp: 'Companies',
					addValidationAutomatically: false,
					cellChangeCallBack: function cellChangeCallBack(arg) {
						dataService.fieldChangeCallBack(arg);
					}
				};

				platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, myGridConfig);

				let removeItems = ['create', 'delete', 'createChild'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});


			}
		]);
})(angular);

