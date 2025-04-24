/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).controller('basicsControllingCostCodesAccountListController',
		['$scope', 'platformGridControllerService', 'basicsControllingCostCodesAccountUIStandardService',
			'basicsControllingCostCodesAccountService', 'basicsControllingCostCodesAccountValidationService',

			function ($scope, platformGridControllerService, basicsControllingCostCodesAccountUIStandardService,
				basicsControllingCostCodesAccountService, basicsControllingCostCodesAccountValidationService
			) {
				let gridConfig = {
					initCalled: false, columns: [],
					type: 'account2MdcContrCostList'
				};

				platformGridControllerService.initListController($scope, basicsControllingCostCodesAccountUIStandardService,
					basicsControllingCostCodesAccountService, basicsControllingCostCodesAccountValidationService, gridConfig);
			}
		]);
})(angular);