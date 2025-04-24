/**
 * Created by wui on 5/20/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */ // This function too many parameters
	angular.module(moduleName).controller('businesspartnerCertificateActualCertificateDetailController', ['$scope', '$injector',
		'platformDetailControllerService', 'platformTranslateService', 'businesspartnerCertificateCertificateContainerServiceFactory',
		function ($scope, $injector, detailControllerService, platformTranslateService, certificateContainerServiceFactory) {

			// get environment variable from the module-container.json file
			var currentModuleName = $scope.getContentValue('currentModule');
			var parentServiceName = $scope.getContentValue('parentService');
			var translationServiceName = $scope.getContentValue('translationService');
			var parentService = parentServiceName ? $injector.get(parentServiceName) : {};
			var translationService = translationServiceName ? $injector.get(translationServiceName) : {};
			var containerService = certificateContainerServiceFactory.getContainerService(currentModuleName, parentService, translationService);
			var translateService = {
				translateFormConfig: function translateFormConfig(formConfig) {
					platformTranslateService.translateFormConfig(formConfig);
				}
			};

			Object.create(detailControllerService).initDetailController($scope, containerService.data, containerService.validation, containerService.ui, translateService);

		}
	]);

})(angular);