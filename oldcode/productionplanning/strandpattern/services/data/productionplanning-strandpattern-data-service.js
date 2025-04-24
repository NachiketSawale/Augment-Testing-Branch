(function () {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.strandpattern';

	angular.module(moduleName).factory('productionplanningStrandpatternDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor) {
			let container;
			let serviceOptions = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'productionplanningStrandpatternDataService',
					entityNameTranslationID: 'productionplanning.strandpattern.entityStrandPattern',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/strandpattern/',
						usePostForRead: true,
						endRead: 'filtered',
						endDelete: 'multidelete'
					},
					entityRole: {
						root: {
							itemName: 'StrandPattern',
							moduleName: 'cloud.desktop.moduleDisplayNamePpsStrandPattern',
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
					}
				}
			};
			container = platformDataServiceFactory.createNewComplete(serviceOptions);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsStrandPatternDto',
				moduleSubModule: 'Productionplanning.StrandPattern',
				validationService: 'productionplanningStrandpatternValidationService'
			});

			return container.service;
		}
	]);
})();