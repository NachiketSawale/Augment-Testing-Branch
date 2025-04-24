/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsCrewMixAfDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsCrewMixAfUIStandardService', 'basicsEfbsheetsCrewMixAfService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetsCrewMixAfService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsCrewMixAfService,
					basicsEfbsheetsValidationService, basicsEfbsheetsCrewMixAfUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
