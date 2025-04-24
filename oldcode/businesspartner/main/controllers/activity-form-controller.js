(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainActivityFormController',
		['$scope', '$injector', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainActivityUIStandardService', 'businesspartnerMainActivityDataService', 'businesspartnerMainActivityValidationService', 'basicsCommonUploadDownloadControllerService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $injector, platformDetailControllerService, platformTranslateService, businessPartnerMainActivityUIStandardService, businesspartnerMainActivityDataService, businesspartnerMainActivityValidationService, basicsCommonUploadDownloadControllerService) {

				let dataService = $scope.getContentValue('dataService');
				if (angular.isString(dataService)) {
					dataService = $injector.get(dataService);
				}

				let validator = businesspartnerMainActivityValidationService(dataService);

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				// init the tools
				if (!$scope.tools) {
					$scope.tools = {
						items: []
					};
				} else if (!$scope.tools.items) {
					$scope.tools.items = [];
				}

				platformDetailControllerService.initDetailController(
					$scope,
					dataService,
					validator,
					businessPartnerMainActivityUIStandardService,
					translateService
				);

				basicsCommonUploadDownloadControllerService.initDetail($scope, dataService);

				dataService.fillReadonlyModels($scope.formOptions.configure);
			}]);

})(angular);