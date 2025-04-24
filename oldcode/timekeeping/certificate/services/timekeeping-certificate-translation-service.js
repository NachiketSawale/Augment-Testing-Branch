/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let timekeepingCertificateModule = 'timekeeping.certificate';
	let certificateModule = 'resource.certificate';
	/**
	 * @ngdoc service
	 * @name timekeepingCertificateTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(timekeepingCertificateModule).service('timekeepingCertificateTranslationService', TimekeepingCertificateTranslationService);

	TimekeepingCertificateTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TimekeepingCertificateTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [timekeepingCertificateModule,certificateModule]
		};

		data.words = {
			EmpCertificateTypeFk: { location: timekeepingCertificateModule, identifier: 'entityType'},
			EmpCertficateStatusFk: { location: timekeepingCertificateModule, identifier: 'entityStatus'},
			ValidFrom:{location: timekeepingCertificateModule, identifier: 'entityValidFrom',},
			ValidTo:{location: timekeepingCertificateModule, identifier: 'entityValidTo'},
			Comment:{location: timekeepingCertificateModule, identifier: 'entityComment'},
			CommentText:{location: timekeepingCertificateModule, identifier: 'entityComment'},
			Remark:{location: timekeepingCertificateModule, identifier: 'entityRemark'},
			ClerkFk:{location: timekeepingCertificateModule, identifier: 'entityClerkFk'},
			Description:{location: timekeepingCertificateModule, identifier: 'entityDescription'},
			BusinessPartnerFk:{location: timekeepingCertificateModule, identifier: 'entityBusinessPartnerFk'},
			ContactFk:{location: timekeepingCertificateModule, identifier: 'entityContactFk'},
			SupplierFk:{location: timekeepingCertificateModule, identifier: 'entitySupplierFk'},
			contactInfo: { location: certificateModule, identifier: 'contactInfo'},
			EmployeeFk:{ location: timekeepingCertificateModule, identifier: 'entityEmployeeFk'},
			CertificateFk:{ location: timekeepingCertificateModule, identifier: 'entityCertificateFk'},
			DocumentTypeFk:{ location: timekeepingCertificateModule, identifier: 'entityDocumentTypeFk'},
			CertificateDoctypeFk:{ location: timekeepingCertificateModule, identifier: 'entityCertificateDoctypeFk'},
			Date:{ location: timekeepingCertificateModule, identifier: 'entityDate'},
			Barcode:{ location: timekeepingCertificateModule, identifier: 'entityBarcode'},
			EmployeeStatusfk:{location: timekeepingCertificateModule, identifier: 'entityEmployeeStatusFk'},
			OriginFileName: {location: timekeepingCertificateModule, identifier: 'entityOriginFileName'}
		};

		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words,'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
		platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
		platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');

		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);


		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
