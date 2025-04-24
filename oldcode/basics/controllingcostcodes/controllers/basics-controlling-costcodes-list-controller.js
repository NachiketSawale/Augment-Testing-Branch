/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).controller('basicsControllingCostCodesListController',
		['$scope', '$injector', 'platformGridControllerService', 'basicsControllingCostCodesUIStandardService',
			'basicsControllingCostCodesMainService', 'basicsControllingCostCodesValidationService',

			function ($scope, $injector, platformGridControllerService, basicsControllingCostCodesUIStandardService,
				basicsControllingCostCodesMainService, basicsControllingCostCodesValidationService
			) {
				let gridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'ContrCostCodeParentFk',
					childProp: 'ContrCostCodeChildrens',
					type: 'contrCostCodesList',
					dragDropService : $injector.get('basicsCommonClipboardService')
				};

				platformGridControllerService.initListController($scope, basicsControllingCostCodesUIStandardService,
					basicsControllingCostCodesMainService, basicsControllingCostCodesValidationService, gridConfig);
			}
		]);
})(angular);