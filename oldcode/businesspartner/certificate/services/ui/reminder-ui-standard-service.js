/**
 * Created by zos on 5/15/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).factory('businesspartnerCertificateReminderUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'businesspartnerCertificateReminderLayout',
			'businesspartnerCertificateTranslationService', 'platformUIStandardExtentService',
			function (UIStandardConfigService, platformSchemaService, reminderLayout, certificateTranslationService, platformUIStandardExtentService) {

				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CertificateReminderDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;

				var service = new UIStandardConfigService(reminderLayout, domains, certificateTranslationService);

				platformUIStandardExtentService.extend(service, reminderLayout.addition, domains);

				return service;
			}

		]);

})(angular);