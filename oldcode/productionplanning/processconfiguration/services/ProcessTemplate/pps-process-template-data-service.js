(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('productionplanningProcessConfigurationProcessTemplateDataService', processTemplateDataService);

	processTemplateDataService.$inject = [
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension'
	];

	function processTemplateDataService (platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension) {
		let container;
		let serviceOptions = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'productionplanningProcessConfigurationProcessTemplateDataService',
				entityNameTranslationID: 'productionplanning.processconfiguration.entityProcessTemplate',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/processconfiguration/processtemplate/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ProcessTemplateDto',
					moduleSubModule: 'Productionplanning.ProcessConfiguration'
				})],
				entityRole: {
					root: {
						itemName: 'ProcessTemplate',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsProcessConfig',
						descField: 'Description'
					}
				},
				entitySelection: { supportsMultiSelection: true },
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: null,
						pinningOptions: null,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'productionplanningProcessConfigurationProcessTemplateDataService',
					title: 'productionplanning.processconfiguration.entityProcessTemplate',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'ProcessTemplateDto',
						moduleSubModule: 'Productionplanning.ProcessConfiguration',
					},
				}
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ProcessTemplateDto',
			moduleSubModule: 'Productionplanning.ProcessConfiguration',
			validationService: 'productionplanningProcessConfigurationProcessTemplateValidationService'
		});

		return container.service;
	}
})(angular);