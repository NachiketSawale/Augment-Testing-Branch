/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var basicsConfigModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardInstanceParameterDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardContainerPropertyDataService is a data service for managing instance parameter of generic wizards
	 */
	basicsConfigModule.factory('basicsConfigGenWizardInstanceParameterDataService', ['basicsConfigGenWizardInstanceDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (basicsConfigGenWizardInstanceDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var genWizardInstanceParameterServiceOption = {
				flatLeafItem: {
					module: basicsConfigModule,
					serviceName: 'basicsConfigGenWizardInstanceParameterDataService',
					entityNameTranslationID: 'basics.config.entityParameter',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/config/genwizard/instanceparameter/' },
					httpRead: { usePostForRead: true, route: globals.webApiBaseUrl + 'basics/config/genwizard/instanceparameter/' },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({ typeName: 'GenericWizardInstanceParameterDto', moduleSubModule: 'Basics.Config' })],
					actions: { delete: true, create: 'flat' },
					modification: {multi: true},
					entityRole: { leaf: { itemName: 'InstanceParameter', parentService: basicsConfigGenWizardInstanceDataService  } },
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
								creationData.EntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardInstanceParameterServiceOption);

			serviceContainer.data.initReadData = function initGenWizardInstanceParameterReadData(readData) {
				readData.SuperEntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
			};

			return serviceContainer.service;
		}
	]);
})();