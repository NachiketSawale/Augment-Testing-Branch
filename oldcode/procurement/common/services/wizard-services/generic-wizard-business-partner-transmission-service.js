(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	var moduleName = 'procurement.common';
	/**
	 * @ngdoc service
	 * @name genericWizardBusinessPartnerTransmissionService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  to be filled
	 */
	angular.module(moduleName).factory('genericWizardBusinessPartnerTransmissionService', ['platformDataServiceFactory', '$injector', 'platformCreateUuid', '$translate',
		function (platformDataServiceFactory, $injector, platformCreateUuid, $translate) {

			var serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'genericWizardBusinessPartnerTransmissionService',
					dataProcessor: [{
						processItem: function (businessPartner) {
							console.log(businessPartner);
						}
					}],
					modification: {multi: true},
					entityRole: {
						root: {
							itemName: platformCreateUuid()
						}
					},
					presenter: {
						list: {}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			container.data.load = function () {
				console.log('load called');
			};

			container.data.getList = function () {
				var genericWizardService = $injector.get('genericWizardService');
				var businessPartnerServiceName = genericWizardService.config.serviceInfos.businessPartnerServiceName;
				var businessPartnerService = genericWizardService.getDataServiceByName(businessPartnerServiceName);
				return businessPartnerService.getList();
			};

			container.service.getErrorList = function getErrorList() {
				return container.data.errorList || [];
			};

			container.service.setErrorList = function setErrorList(errorList) {
				_.forEach(errorList, function (error) {
					switch (error.type) {
						case 'reportError':
							error.message = $translate.instant('basics.workflow.sendRfQTransmission.reportErrorMessage', {reportId: error.id, templateName: error.displayValue});
							break;
						case 'gaebError':
							error.message = $translate.instant('basics.workflow.sendRfQTransmission.gaebErrorMessage', {boqId: error.id, boqRefNo: error.displayValue});
							break;
						case 'zipError':
							error.message = $translate.instant('basics.workflow.sendRfQTransmission.zipErrorMessage');
							break;
						case 'materialError':
							error.message = $translate.instant('basics.workflow.sendRfQTransmission.materialErrorMessage', {materialId: error.id, materialCode: error.displayValue});
							break;
						case 'sendMailError':
							error.message = $translate.instant('basics.workflow.sendRfQTransmission.sendMailErrorMessage', {errorMessage: error.displayValue});
							break;
						case 'contactMailError':
							error.message = $translate.instant('basics.workflow.sendRfQTransmission.contactMailErrorMessage', {bidderName: error.displayValue});
							break;
						default:
							error.message = error.message || $translate.instant('basics.workflow.sendRfQTransmission.undefinedErrorMessage');
					}
				});
				container.data.errorList = errorList;
			};

			container.service.resetErrorList = function resetErrorList() {
				container.data.errorList = [];
			};

			return container.service;

		}
	]);
})(angular);
