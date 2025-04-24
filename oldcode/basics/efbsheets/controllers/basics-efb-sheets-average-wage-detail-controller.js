/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsAverageWageDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsAverageWageUIStandardService', 'basicsEfbsheetsAverageWageService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsAverageWageService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsAverageWageService,
					basicsEfbsheetsValidationService, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
