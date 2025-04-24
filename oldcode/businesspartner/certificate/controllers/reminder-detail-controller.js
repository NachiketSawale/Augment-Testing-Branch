/**
 * Created by zos on 5/14/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	/* jshint -W072 */ // This function too many parameters
	angular.module(moduleName).controller('businesspartnerCertificateReminderDetailController', ['$scope', 'platformDetailControllerService',
		'businesspartnerCertificateReminderDataService', 'businesspartnerCertificateReminderUIStandardService', 'platformTranslateService',
		'businesspartnerCertificateReminderValidationService',
		function ($scope, detailControllerService, reminderDataService, uiStandardService, platformTranslateService, validationService) {

			var translateService = {
				translateFormConfig: function translateFormConfig(formConfig) {
					platformTranslateService.translateFormConfig(formConfig);
				}
			};

			Object.create(detailControllerService).initDetailController($scope, reminderDataService, validationService, uiStandardService, translateService);

		}
	]);

})(angular);