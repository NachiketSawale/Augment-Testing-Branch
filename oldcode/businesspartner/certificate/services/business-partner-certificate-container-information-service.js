/**
 * Created by xsi on 2016-07-13.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.certificate';
	angular.module(moduleName).factory('businesspartnerCertificateContainerInformationService', [
		'basicsCommonContainerInformationServiceUtil', 'documentProjectHeaderUIStandardService',
		function (containerInformationServiceUtil, documentProjectHeaderUIStandardService) {
			var service = {};
			/* jshint -W074 */
			service.getContainerInfoByGuid = function (guid) {
				var config = {};
				switch (guid) {
					case '2c39331cf48c4016af9d17a573388100':// Certificates
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businesspartnerCertificateCertificateUIStandardService',
							dataSvc: 'businesspartnerCertificateCertificateDataService',
							validationSvc: 'businesspartnerCertificateCertificateValidationService'
						}, null);
						break;
					case 'FB49AD44D3C3497A8EF693026933FBFF':// Certificate Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businesspartnerCertificateCertificateUIStandardService',
							dataSvc: 'businesspartnerCertificateCertificateDataService',
							validationSvc: 'businesspartnerCertificateCertificateValidationService'
						});
						break;
					// case 'D9567760EAA24C3391AE7E135E3BF85A'://Documents Project ---the guid is not the same as the Module-containers.json
					case '4EAA47C530984B87853C6F2E4E4FC67E':// Documents Project
						config = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '8BB802CB31B84625A8848D370142B95C':// Documents Project Detail
						config = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					// case '7510580A416145A8ACA7E2D0D6BC7D4C'://Documents Revision  ---the guid is not the same as the Module-containers.json
					case '684F4CDC782B495E9E4BE8E4A303D693':// Documents Revision
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'documentsProjectDocumentRevisionUIStandardService',
							dataSvc: 'documentsProjectDocumentRevisionDataService'
						}, null);
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// Documents Revision Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'documentsProjectDocumentRevisionUIStandardService',
							dataSvc: 'documentsProjectDocumentRevisionDataService'
						});
						break;
					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'centralQueryClerkConfigurationService',
							dataSvc: 'centralQueryClerkService',
							validationSvc: 'centralQueryClerkValidationService'
						}, null);
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'centralQueryClerkConfigurationService',
							dataSvc: 'centralQueryClerkService',
							validationSvc: 'centralQueryClerkValidationService'
						});
						break;
					case '1B11C041C2E54C87B7BE08EBF066089C':// Reminders
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businesspartnerCertificateReminderUIStandardService',
							dataSvc: 'businesspartnerCertificateReminderDataService',
							validationSvc: 'businesspartnerCertificateReminderValidationService'
						}, null);
						break;
					case '78373ADC2A214AB2B3C9564317DCD36B':// Reminders Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businesspartnerCertificateReminderUIStandardService',
							dataSvc: 'businesspartnerCertificateReminderDataService',
							validationSvc: 'businesspartnerCertificateReminderValidationService'
						});
						break;

				}
				return config;
			};
			return service;
		}

	]);

})(angular);
