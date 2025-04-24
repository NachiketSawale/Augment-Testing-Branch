/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var logisticSundrygroupModule = 'logistic.sundrygroup';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupTranslationService
	 * @description provides translation methods for logistic sundrygroup module
	 */
	angular.module(logisticSundrygroupModule).service('logisticSundryServiceGroupTranslationService', LogisticSundryServiceGroupTranslationService);

	LogisticSundryServiceGroupTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function LogisticSundryServiceGroupTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticSundrygroupModule, cloudCommonModule, basicsCustomizeModule, 'cloud.desktop']
		};

		data.words = {
			Icon: { location: basicsCustomizeModule, identifier: 'icon'},
			ProcurementStructureTypeFk: { location: basicsCustomizeModule, identifier: 'structuretype'},
			Specification: { location: cloudCommonModule, identifier: 'EntitySpec'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive'},
			accounts: { location: logisticSundrygroupModule, identifier: 'entityAccounts'},
			LedgerContextFk: { location: logisticSundrygroupModule, identifier: 'ledgercontext'},
			ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom'},
			ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo'},
			AccountTypeFk: { location: basicsCustomizeModule, identifier: 'accountingtype'},
			Account01Fk: { location: logisticSundrygroupModule, identifier: 'entityAccount', param: { index: 1 }},
			Account02Fk: { location: logisticSundrygroupModule, identifier: 'entityAccount', param: { index: 2 }},
			Account03Fk: { location: logisticSundrygroupModule, identifier: 'entityAccount', param: { index: 3 }},
			Account04Fk: { location: logisticSundrygroupModule, identifier: 'entityAccount', param: { index: 4 }},
			Account05Fk: { location: logisticSundrygroupModule, identifier: 'entityAccount', param: { index: 5 }},
			Account06Fk: { location: logisticSundrygroupModule, identifier: 'entityAccount', param: { index: 6 }},
			NominalDimension0101: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0101'},
			NominalDimension0102: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0102'},
			NominalDimension0103: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0103'},
			NominalDimension0201: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0201'},
			NominalDimension0202: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0202'},
			NominalDimension0203: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0203'},
			NominalDimension0301: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0301'},
			NominalDimension0302: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0302'},
			NominalDimension0303: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0303'},
			NominalDimension0401: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0401'},
			NominalDimension0402: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0402'},
			NominalDimension0403: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0403'},
			NominalDimension0501: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0501'},
			NominalDimension0502: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0502'},
			NominalDimension0503: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0503'},
			NominalDimension0601: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0601'},
			NominalDimension0602: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0602'},
			NominalDimension0603: { location: logisticSundrygroupModule, identifier: 'entityNominalDimension0603'},
			TaxCodeFk:{location: logisticSundrygroupModule, identifier: 'entityTaxCode'},
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);