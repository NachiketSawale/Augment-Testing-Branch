/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsCrewMixCostCodeDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsCrewMixCostCodeUIStandardService', 'basicsEfbsheetsCrewMixCostCodeService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsCrewMixCostCodeUIStandardService, basicsEfbsheetsCrewMixCostCodeService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsCrewMixCostCodeService,
					basicsEfbsheetsValidationService, basicsEfbsheetsCrewMixCostCodeUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
