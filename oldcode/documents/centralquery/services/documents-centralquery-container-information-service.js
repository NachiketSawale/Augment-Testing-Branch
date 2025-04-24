/*
 * $Id: documents-centralquery-container-information-service.js 633880 2021-04-26 03:07:00Z pel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	/* global */
	var documentsCentralQueryModule = angular.module('documents.centralquery');

	/**
	 * @ngdoc service
	 * @name documentsCentralQueryContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	documentsCentralQueryModule.factory('documentsCentralQueryContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};
			var layServ = null;
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '4EAA47C530984B87853C6F2E4E4FC67E': // documentCentralQueryController
						config.layout = $injector.get('documentProjectHeaderUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'documentCentralQueryDataService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '8BB802CB31B84625A8848D370142B95C': // documentCentralQueryDetailController
						config.layout = $injector.get('documentProjectHeaderUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'documentCentralQueryDataService';
						config.validationServiceName = null;
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693':// documentsProjectDocumentRevisionController
						config.layout = $injector.get('documentsProjectDocumentRevisionUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentRevisionDataService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// Documents Revision Detail
						config.layout = $injector.get('documentsProjectDocumentRevisionUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentRevisionDataService';
						config.validationServiceName = null;
						break;
					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;
				}


				return config;
			};

			return service;
		}
	]);
})(angular);
