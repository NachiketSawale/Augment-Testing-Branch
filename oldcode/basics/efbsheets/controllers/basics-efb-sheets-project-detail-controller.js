/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsProjectDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsUIStandardService', 'basicsEfbsheetsProjectMainService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsUIStandardService, basicsEfbsheetsProjectMainService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {

				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsProjectMainService,
					basicsEfbsheetsValidationService, basicsEfbsheetsUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
