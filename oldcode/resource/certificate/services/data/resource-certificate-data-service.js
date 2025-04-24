/**
 * Created by baf on 28.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.certificate');

	/**
	 * @ngdoc service
	 * @name resourceCertificateDataService
	 * @description provides methods to access, create and update resource certificate  entities
	 */
	myModule.service('resourceCertificateDataService', ResourceCertificateDataService);

	ResourceCertificateDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceCertificateConstantValues','platformObjectHelper','cloudDesktopSidebarService'];

	function ResourceCertificateDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceCertificateConstantValues,platformObjectHelper,cloudDesktopSidebarService) {

		var self = this;
		var resourceCertificateServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceCertificateDataService',
				entityNameTranslationID: 'resource.certificate.resourceCertificateEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/certificate/',
					endRead: 'filtered',
					endDelete: 'multidelete',
					usePostForRead: true
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourceCertificateConstantValues.schemes.certificate)],
				entityRole: {
					root: {
						itemName: 'Certificates',
						moduleName: 'cloud.desktop.moduleDisplayNamePlantCertificate',
						useIdentification: true
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'resource.certificate',
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
					uid: 'resourceCertificateDataService',
					title: 'resource.certificate.resourceCertificateEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: resourceCertificateConstantValues.schemes.certificate
				}
			}
		};


		var serviceContainer = platformDataServiceFactory.createService(resourceCertificateServiceOption, self);

		serviceContainer.service.navigateTo = function navigateTo(item, triggerfield) {
			var certificateId = null;
			if (item && (platformObjectHelper.getValue(item, triggerfield) || item.CertificateFk)) {
				certificateId = platformObjectHelper.getValue(item, triggerfield) || item.CertificateFk;
			}

			cloudDesktopSidebarService.filterSearchFromPKeys([certificateId]);
		};


		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceCertificateValidationService'
		}, resourceCertificateConstantValues.schemes.certificate));

	}
})(angular);
