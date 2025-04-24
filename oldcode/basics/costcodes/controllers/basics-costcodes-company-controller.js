/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicUsedInCompanyController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Used In Company.
	 **/
	angular.module(moduleName).controller('basicsCostCodesCompanyController',
		['_','$scope', 'platformGridAPI', 'basicsCostCodesCompanyMainService', 'platformGridControllerService', 'basicsCostCodesCompanyUIConfigurationService',
			function (_,$scope, platformGridAPI, dataService, platformGridControllerService, basicsCostCodesCompanyUIConfigurationService) {

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

				platformGridControllerService.initListController($scope, basicsCostCodesCompanyUIConfigurationService, dataService, null, myGridConfig);

				let removeItems = ['create', 'delete', 'createChild'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});
			}
		]);
})(angular);