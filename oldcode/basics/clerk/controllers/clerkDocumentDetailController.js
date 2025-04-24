/**
 * Created by pel on 3/21/2019.
 */
(function (angular) {
	'use strict';
	var moduleName='basics.clerk';
	angular.module(moduleName).controller('clerkDocumentDetailController',
		['$scope', 'platformDetailControllerService','clerkDocumentDataService','clerkDocumentValidationService','clerkDocumentUIStandardService','platformTranslateService',
			'basicsCommonUploadDownloadControllerService',
			function ($scope, platformDetailControllerService,dataService,validationService,formConfiguration,translateService,basicsCommonUploadDownloadControllerService) {
				platformDetailControllerService.initDetailController($scope, dataService,validationService,formConfiguration,translateService);
				basicsCommonUploadDownloadControllerService.initDetail($scope, dataService);
			}
		]
	);
})(angular);