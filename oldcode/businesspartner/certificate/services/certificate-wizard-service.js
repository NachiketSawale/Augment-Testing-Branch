(function (angular) {
	'use strict';

	const moduleName = 'businesspartner.certificate';

	/* jshint -W072 */
	angular.module(moduleName).factory('businesspartnerCertificateWizardService',
		['platformTranslateService',
			'platformSidebarWizardConfigService',
			'$translate',
			'$injector',
			'platformSidebarWizardCommonTasksService',
			'platformModalService', 'platformContextService', 'cloudDesktopSidebarService',
			'businessPartnerCertificateRequiredCreateService',
			'businesspartnerCertificateCertificateDataService', 'basicsCommonChangeStatusService',
			'businesspartnerCertificateReminderCreateDataService', 'businesspartnerCertificateReminderDataService', 'globals',
			'businesspartnerCertificateCertificateContainerServiceFactory', 'businesspartnerCertificateTranslationService', '_',
			'businessPartnerCertificateEmailSettingDataService', 'businessPartnerCertificateEmailWizardService',
			'documentProjectDocumentsStatusChangeService',
			function (platformTranslateService,
				platformSidebarWizardConfigService,
				$translate,
				$injector,
				platformSidebarWizardCommonTasksService,
				platformModalService, platformContextService, cloudDesktopSidebarService,
				requriedCertificatesCreateService,
				businesspartnerCertificateCertificateDataService, basicsCommonChangeStatusService,
				businesspartnerCertificateReminderCreateDataService, businesspartnerCertificateReminderDataService, globals,
				businesspartnerCertificateCertificateContainerServiceFactory, businesspartnerCertificateTranslationService, _,
				businessPartnerCertificateEmailSettingDataService, businessPartnerCertificateEmailWizardService,
				documentProjectDocumentsStatusChangeService) {

				const service = {};

				let certificateContainerServiceFactory = null;

				function sendEmailOrFax(type) {
					businesspartnerCertificateCertificateDataService.updateAndExecute(function () {
						const select = businesspartnerCertificateReminderDataService?.getSelected() || {};

						const batchId = select.Id && select.BatchId ? select.BatchId : '';

						const entity = {
							BatchId: batchId,
							CompanyId: platformContextService.getContext().clientId,
							CommunicationType: type
						};
						businessPartnerCertificateEmailSettingDataService.setData(entity);
						businessPartnerCertificateEmailWizardService.showDialog(type);
					});
				}

				function changeStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'certificate',
							mainService: businesspartnerCertificateCertificateDataService,
							guid: '1D02A3E89F264539884BABA7F9AAC74A',
							descField: 'Reference',
							statusField: 'CertificateStatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'businesspartner.certificate.wizard.item.changeStatus',
							updateUrl: 'businesspartner/certificate/certificate/status',
							id: 11,
							// If status change, run the validateCertificateStatusFk function, as it cannot run by common function
							// if the common function has changed to be supported, this function should be removed
							handleSuccess: function (result) {
								if (result.changed) {
									const item = result.entity;
									const oldEntity = businesspartnerCertificateCertificateDataService.getItemById(item.Id);
									if (oldEntity) {
										_.forEach(businesspartnerCertificateCertificateDataService.getDataProcessor(), function (processor) {
											processor.processItem(item);
										});
										angular.extend(oldEntity, item);
										businesspartnerCertificateCertificateDataService.gridRefresh();
									}
								}
							},
							doValidationAndSaveBeforeChangeStatus: true
						}
					);
				}

				function changeStatusForProjectDocument() {
					return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(businesspartnerCertificateCertificateDataService, 'businesspartner.certificate');
				}

				service.changeStatus = changeStatus().fn;

				service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

				service.sendEmail = function sendEmail() {
					sendEmailOrFax('email');
				};

				service.sendFax = function sendFax() {
					sendEmailOrFax('fax');
				};

				service.createRequests = function createRequests() {
					const clientId = platformContextService.clientId;
					businesspartnerCertificateCertificateDataService.updateAndExecute(function () {
						platformModalService.showDialog({
							currentItem: {Id: clientId},
							templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/required-certificates-create-wizard.html',
							backdrop: false,
							showCancelButton: true,
							showOkButton: true,
							dataProcessor: requriedCertificatesCreateService.updateCertificatesByCompany,
							formRows: [
								{
									'label$tr$': 'cloud.common.entityCompany',
									'model': 'dataItem.Id',
									'readonly': true,
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-company-company-lookup',
										'descriptionMember': 'CompanyName',
										'lookupOptions': {'showClearButton': true}
									}
								}]
						}).then(function () {
							if (!certificateContainerServiceFactory) { // mike 2015-11-12: delay the service creation to make sure it's creation later than the module resolver
								certificateContainerServiceFactory = businesspartnerCertificateCertificateContainerServiceFactory.getContainerService('businesspartner.certificate', {}, businesspartnerCertificateTranslationService);
							}
							certificateContainerServiceFactory.data.callRefresh();
						});
					});
				};

				service.createReminders = function createReminders() {
					const clientId = platformContextService.clientId;
					platformModalService.showDialog({
						currentItem: {Id: clientId},
						templateUrl: globals.appBaseUrl + 'businesspartner.certificate/partials/reminder-create-wizard.html',
						backdrop: false,
						showCancelButton: true,
						showOkButton: true
					}).then(function (result) {
						if (result) {
							businesspartnerCertificateReminderCreateDataService.updateCertificatesByReminder(result.BatchId, result.BatchDate, result.Email, result.Telefax);
						}
					});
				};

				return service;
			}]);
})(angular);