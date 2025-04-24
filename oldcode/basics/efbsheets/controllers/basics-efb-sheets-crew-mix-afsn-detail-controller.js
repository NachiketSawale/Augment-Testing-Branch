/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';

	angular.module(moduleName).controller('basicsEfbsheetsCrewMixAfsnDetailController',
		['$scope', 'platformDetailControllerService', 'basicsEfbsheetsCrewMixAfsnUIStandardService', 'basicsEfbsheetsCrewMixAfsnService',
			'basicsEfbsheetsValidationService', 'basicsEfbsheetsTranslationService',
			function ($scope, platformDetailControllerService, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetsCrewMixAfsnService,
				basicsEfbsheetsValidationService, basicsEfbsheetsTranslationService) {


				platformDetailControllerService.initDetailController($scope, basicsEfbsheetsCrewMixAfsnService,
					basicsEfbsheetsValidationService, basicsEfbsheetsCrewMixAfsnUIStandardService, basicsEfbsheetsTranslationService);
			}
		]);
})(angular);
