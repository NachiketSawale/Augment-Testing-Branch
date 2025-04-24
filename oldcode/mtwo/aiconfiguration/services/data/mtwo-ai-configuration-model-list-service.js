/**
 * @author: chd
 * @date: 3/16/2021 11:54 AM
 * @description:
 */
(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';
	let AIConfigurationModule = angular.module(moduleName);
	let onReadSucceeded;

	AIConfigurationModule.factory('mtwoAIConfigurationModelListDataService', mtwoAIConfigurationModelListDataService);

	mtwoAIConfigurationModelListDataService.$inject = ['platformDataServiceFactory', '$injector', 'basicsLookupdataLookupDescriptorService', 'PlatformMessenger',
		'basicsCommonMandatoryProcessor', 'mtwoAIConfigurationModelListProcessor'];

	function mtwoAIConfigurationModelListDataService(platformDataServiceFactory, $injector, basicsLookupdataLookupDescriptorService, PlatformMessenger,
		basicsCommonMandatoryProcessor, modelListProcessor) {

		let serviceOptions = {
			flatRootItem: {
				module: AIConfigurationModule,
				serviceName: 'mtwoAIConfigurationModelListDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/aiconfiguration/model/',
					usePostForRead: true
				},
				actions: {
					create: 'flat',
					group: false,
					delete: true,
					canDeleteCallBackFunc: function (item) {
						return item.Id >= 100000;
					}
				},
				entityRole: {
					root: {
						itemName: 'Model',
						rootForModule: moduleName,
						lastObjectModuleName: moduleName
					}
				},
				dataProcessor: [modelListProcessor],
				entitySelection: {},
				presenter: {
					list: {
						incorporateDataRead: onReadSucceeded
					}
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		let service = serviceContainer.service;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ModelDto',
			moduleSubModule: 'mtwo.aiconfiguration',
			validationService: 'mtwoAIConfigurationHeaderValidationService',
			mustValidateFields: ['Code']
		});

		onReadSucceeded = serviceContainer.data.onReadSucceeded;
		serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
			basicsLookupdataLookupDescriptorService.attachData(readData || {});
			let dataRead = onReadSucceeded({
				dtos: readData.dtos,
				FilterResult: readData.FilterResult
			},
			data);

			service.onRowChange = new PlatformMessenger();
			return dataRead;
		};

		return service;
	}
})(angular);
