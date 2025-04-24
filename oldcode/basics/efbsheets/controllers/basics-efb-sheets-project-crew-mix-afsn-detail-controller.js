/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsProjectCrewMixAfsnDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsCrewMixAfsnUIStandardService', 'basicsEfbsheetsProjectCrewMixAfsnService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetsProjectCrewMixAfsnService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsProjectCrewMixAfsnService,
					basicsEfbsheetsValidationService, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
