/**
 * Created by wuj on 1/20/2015.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.material';

	//basicsMaterialDocumentsFormConfiguration
	angular.module(moduleName).controller('basicsMaterialDocumentsDetailController',
		['$scope', '$translate', '$window', 'basicsMaterialDocumentStandardConfigurationService', 'basicsMaterialDocumentsService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsMaterialDocumentsValidationService',
			'basicsCommonUploadDownloadControllerService',
			function ($scope, $translate, $window, formConfiguration, dataService, detailControllerService, translateService, validationService,
			          basicsCommonUploadDownloadControllerService) {

				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
				basicsCommonUploadDownloadControllerService.initDetail($scope, dataService);
			}]);
})(angular);