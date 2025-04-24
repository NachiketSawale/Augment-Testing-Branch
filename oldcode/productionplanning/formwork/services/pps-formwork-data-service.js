(function (angular) {
	'use strict';
	/* global globals, angular */
	var moduleName = 'productionplanning.formwork';
	var module = angular.module(moduleName);
	module.factory('ppsFormworkDataService', PpsFormworkDataService);

	PpsFormworkDataService.$inject = [
		'platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'platformDataServiceProcessDatesBySchemeExtension',
		'ppsFormworkProcessor',
		'basicsLookupdataLookupFilterService',
		'ppsVirtualDateshiftDataServiceFactory',
		'basicsLookupdataLookupDescriptorService'
	];

	function PpsFormworkDataService (platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		platformDataServiceProcessDatesBySchemeExtension,
		ppsFormworkProcessor,
		basicsLookupdataLookupFilterService,
		ppsVirtualDateshiftDataServiceFactory,
		basicsLookupdataLookupDescriptorService) {

		var serviceOptions = {
			flatRootItem: {
				module: module,
				serviceName: 'ppsFormworkDataService',
				entityNameTranslationID: 'productionplanning.formwork.entityFormwork',
				addValidationAutomatically: true,
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/formwork/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'FormworkDto',
					moduleSubModule: 'Productionplanning.Formwork'
				}), ppsFormworkProcessor],
				entityRole: {
					root: {
						itemName: 'Formwork',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsFormwork',
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

		var container = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = container.service;

		let virtualDateshiftService = ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService(moduleName, service);


		service.onEntityPropertyChanged = function(entity, field) {
			if (field === 'ProcessFk') {
				service.getChildServices().forEach(function(service) {
					service.load();
				});
			}
		};

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'FormworkDto',
			moduleSubModule: 'Productionplanning.Formwork',
			validationService: 'ppsFormworkValidationService',
			mustValidateFields:['Code', 'FormworkTypeFk']
		});

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'pps-production-place-filter-bysite',
				fn: function (item, entity) {
					if(entity.BasSiteFk < 1 || (item !== null && entity.BasSiteFk === item.BasSiteFk)){
						return true;
					}
					return  false;
				}
			}
		]);

		 if (_.isNil(basicsLookupdataLookupDescriptorService.getData('FormworkType'))) {
			basicsLookupdataLookupDescriptorService.loadData('FormworkType');}

		return service;
	}
})(angular);