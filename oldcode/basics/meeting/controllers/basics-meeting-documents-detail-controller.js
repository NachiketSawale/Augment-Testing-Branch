/**
 * Created by chd on 12/22/2021.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.meeting';

	angular.module(moduleName).controller('basicsMeetingDocumentsDetailController',
		['$scope', '$translate', '$window', 'basicsMeetingDocumentUIStandardService', 'basicsMeetingDocumentsService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsMeetingDocumentsValidationService',
			'basicsCommonUploadDownloadControllerService',
			function ($scope, $translate, $window, formConfiguration, dataService, detailControllerService, translateService, validationService,
				basicsCommonUploadDownloadControllerService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
				basicsCommonUploadDownloadControllerService.initDetail($scope, dataService);
			}]);
})(angular);