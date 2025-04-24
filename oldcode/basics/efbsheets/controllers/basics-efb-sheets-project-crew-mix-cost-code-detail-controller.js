/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsProjectCrewMixCostCodeDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsCrewMixCostCodeUIStandardService', 'basicsEfbsheetsProjectCrewMixCostCodeService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsCrewMixCostCodeUIStandardService, basicsEfbsheetsProjectCrewMixCostCodeService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsProjectCrewMixCostCodeService,
					basicsEfbsheetsValidationService, basicsEfbsheetsCrewMixCostCodeUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
