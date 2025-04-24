/*
 * $Id: resource-certificate-translation-service.js 560234 2019-09-24 09:02:41Z postic $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var certificateModule = 'resource.certificate';
	var plantModule = 'resource.equipment';
	var basicsClerkModule = 'basics.clerk';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var customizeModule = 'basics.customize';
	var resourceCommonModule = 'resource.common';

	/**
	 * @ngdoc service
	 * @name resourceCertificateTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(certificateModule).service('resourceCertificateTranslationService', ResourceCertificateTranslationService);

	ResourceCertificateTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ResourceCertificateTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [certificateModule, plantModule, basicsClerkModule, basicsCommonModule, cloudCommonModule,
				customizeModule, resourceCommonModule]
		};

		data.words = {
			CertificateStatusFk: { location: cloudCommonModule, identifier: 'entityStatus'},
			CertificateTypeFk: { location: cloudCommonModule, identifier: 'entityType'},
			DocumentTypeFk: {location: customizeModule, identifier: 'documenttype'},
			CertificateDocumentTypeFk: { location: cloudCommonModule, identifier: 'entityType'},
			Date: {location: cloudCommonModule, identifier: 'entityDate'},
			BarCode:{ location: certificateModule, identifier: 'entityBarcode'},
			PlantFk: { location: resourceCommonModule, identifier: 'entityPlant'},
			ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom'},
			ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo'},
			contactInfo: { location: certificateModule, identifier: 'contactInfo'},
			ClerkFk: { location: basicsClerkModule, identifier: 'entityClerk'},
			BusinessPartnerFk: { location: cloudCommonModule, identifier: 'entityBusinessPartner'},
			ContactFk: { location: plantModule, identifier: 'entityContactFk'},
			SupplierFk: { location: cloudCommonModule, identifier: 'entitySupplier'},
			OriginFileName: {location: certificateModule, identifier: 'entityFileArchiveDoc'},
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');

		platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);

		// Convert word list into a format used by platform translation service
		let modules = ['logistic','resource','basics','project','documents' ];
		data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
