/**
 * Created by wui on 5/12/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */ // This function too many parameters
	angular.module(moduleName).controller('businesspartnerCertificateCertificateDetailController', ['$scope', 'platformDetailControllerService',
		'businesspartnerCertificateCertificateDataService', 'businesspartnerCertificateCertificateUIStandardService', 'platformTranslateService',
		'businesspartnerCertificateCertificateValidationService',
		function ($scope, detailControllerService, certificateDataService, certificateUIStandardService, platformTranslateService, certificateValidationService) {

			var translateService = {
				translateFormConfig: function translateFormConfig(formConfig) {
					platformTranslateService.translateFormConfig(formConfig);
				}
			};

			Object.create(detailControllerService).initDetailController($scope, certificateDataService, certificateValidationService, certificateUIStandardService, translateService);

		}
	]);

})(angular);