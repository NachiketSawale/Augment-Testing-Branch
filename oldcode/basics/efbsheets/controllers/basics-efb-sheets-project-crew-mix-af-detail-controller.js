/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsProjectCrewMixAfDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsCrewMixAfUIStandardService', 'basicsEfbsheetsProjectCrewMixAfService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetsProjectCrewMixAfService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsProjectCrewMixAfService,
					basicsEfbsheetsValidationService, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
