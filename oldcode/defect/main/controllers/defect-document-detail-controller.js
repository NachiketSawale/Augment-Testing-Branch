/**
 * Created by alm on 5/11/2017.
 */
/* global */
(function (angular) {
	'use strict';
	var moduleName='defect.main';
	angular.module(moduleName).controller('defectDocumentDetailController',
		['$scope', 'platformDetailControllerService','defectDocumentDataService','defectDocumentValidationService','defectDocumentUIStandardService','platformTranslateService',
			function ($scope, platformDetailControllerService,dataService,validationService,formConfiguration,translateService) {
				platformDetailControllerService.initDetailController($scope, dataService,validationService,formConfiguration,translateService);
			}
		]
	);
})(angular);