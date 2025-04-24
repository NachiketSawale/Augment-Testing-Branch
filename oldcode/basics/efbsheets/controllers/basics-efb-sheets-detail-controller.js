/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsUIStandardService', 'basicsEfbsheetsMainService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsUIStandardService, basicsEfbsheetsMainService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {

				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsMainService,
					basicsEfbsheetsValidationService, basicsEfbsheetsUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
