/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).controller('basicsControllingCostCodesDetailController',
		['$scope', 'platformDetailControllerService',
			'basicsControllingCostCodesUIStandardService', 'basicsControllingCostCodesMainService',
			'basicsControllingCostCodesValidationService', 'basicsControllingCostCodesTranslationService',
			function ($scope, platformDetailControllerService,
				basicsControllingCostCodesUIStandardService, basicsControllingCostCodesMainService,
				basicsControllingCostCodesValidationService, basicsControllingCostCodesTranslationService) {
				platformDetailControllerService.initDetailController($scope, basicsControllingCostCodesMainService,
					basicsControllingCostCodesValidationService, basicsControllingCostCodesUIStandardService, basicsControllingCostCodesTranslationService);
			}
		]);
})(angular);