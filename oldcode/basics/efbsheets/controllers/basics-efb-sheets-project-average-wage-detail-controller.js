/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsProjectAverageWageDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsAverageWageUIStandardService', 'basicsEfbsheetsProjectAverageWageService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsProjectAverageWageService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsProjectAverageWageService,
					basicsEfbsheetsValidationService, basicsEfbsheetsAverageWageUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
