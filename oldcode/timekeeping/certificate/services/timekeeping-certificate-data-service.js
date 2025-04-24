/**
 * Created by Sudarshan on 16.03.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.certificate');

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateDataService
	 * @description provides methods to access, create and update timekeeping certificate  entities
	 */
	myModule.service('timekeepingCertificateDataService', TimekeepingCertificateDataService);

	TimekeepingCertificateDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingCertificateConstantValues','platformObjectHelper','cloudDesktopSidebarService'];

	function TimekeepingCertificateDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, timekeepingCertificateConstantValues,platformObjectHelper,cloudDesktopSidebarService) {

		let self = this;
		let employeeCertificateServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'timekeepingCertificateDataService',
				entityNameTranslationID: 'timekeeping.employee.employeeCertificateEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/certificate/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(timekeepingCertificateConstantValues.schemes.certificate)],
				entityRole: {
					root: {
						itemName: 'Certificates',
						moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingCertificate',
						useIdentification: true
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'timekeeping.certificate',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: null,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'timekeepingCertificateDataService',
					title: 'timekeeping.certificate.certificateEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: timekeepingCertificateConstantValues.schemes.certificate
				}
			}
		};


		let serviceContainer = platformDataServiceFactory.createService(employeeCertificateServiceOption, self);

		serviceContainer.service.navigateTo = function navigateTo(item, triggerfield) {
			let certificateId = null;
			if (item && (platformObjectHelper.getValue(item, triggerfield) || item.CertificateFk)) {
				certificateId = platformObjectHelper.getValue(item, triggerfield) || item.CertificateFk;
			}

			cloudDesktopSidebarService.filterSearchFromPKeys([certificateId]);
		};


		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingCertificateValidationService'
		}, timekeepingCertificateConstantValues.schemes.certificate));

	}
})(angular);
