(function () {
	'use strict';
	/*global angular, globals, _*/

	var moduleName = 'productionplanning.fabricationunit';
	var serviceName = 'ppsFabricationunitDataService';
	var module = angular.module(moduleName);
	module.factory(serviceName, [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningCommonStructureFilterService', 'basicsCommonMandatoryProcessor',
		'platformRuntimeDataService', '$injector', 'basicsCompanyNumberGenerationInfoService',
		'ppsCommonCodGeneratorConstantValue',
		function (
			platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			ppsCommonStructureFilterService, basicsCommonMandatoryProcessor,
			platformRuntimeDataService, $injector, basicsCompanyNumberGenerationInfoService,
			ppsCommonCodGeneratorConstantValue) {
			var lastFilter = null;
			var serviceInfo = {
				flatRootItem: {
					module: module,
					serviceName: serviceName,
					entityNameTranslationID: 'productionplanning.fabricationunit.fabricationUnit',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/fabricationunit/',
						endRead: 'filtered',
						endDelete: 'multidelete',
						usePostForRead: true,
						extendSearchFilter: function extendSearchFilter(readData) {
							ppsCommonStructureFilterService.extendSearchFilterAssign(serviceName, readData);
							ppsCommonStructureFilterService.setFilterRequest(serviceName, readData);
							lastFilter = readData;
						}
					},
					useItemFilter: true,
					entityRole: {
						root: {
							itemName: 'FabricationUnits',
							moduleName: 'cloud.desktop.moduleDisplayNameProductionplanningFabricationunit',
							handleUpdateDone: handleUpdateDone
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						{
							typeName: 'ProductionsetDto',
							moduleSubModule: 'ProductionPlanning.ProductionSet'
						}), {
						processItem: function (item) {
							var fields = [
								{field: 'DateshiftMode', readonly: item.Version > 0}
							];
							platformRuntimeDataService.readonly(item, fields);
							if(item.Version === 0){
								var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(item.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.FabricationUnit);
								if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFfabricationUnitNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
								{
									item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFfabricationUnitNumberInfoService').provideNumberDefaultText(categoryId);
									platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
								}
							}
							else{
								platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: false}]);
							}
						}
					}],
					sidebarWatchList: {active: true},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false
						}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsFabricationUnitDto',
				moduleSubModule: 'Productionplanning.Fabricationunit',
				validationService: 'ppsFabricationunitValidationService'
			});

			//Filter Structure
			ppsCommonStructureFilterService.setFilterFunction(serviceName, ppsCommonStructureFilterService.getCombinedFilterFunction); // default filter
			container.service.getLastFilter = function () {
				if (_.isNil(lastFilter)) {
					lastFilter = {};
					ppsCommonStructureFilterService.extendSearchFilterAssign(serviceName, lastFilter);
				}
				return lastFilter;
			};

			container.service.onEntityPropertyChanged = function onEntityPropertyChanged (entity, field) {
				$injector.get('productionplanningEngineeringMainServiceEntityPropertychangedExtension').onPropertyChanged(entity,field,container.service);
			};

			function handleUpdateDone(updateData, response, data) {
				data.handleOnUpdateSucceeded(updateData, response, data, true);
				container.service.showModuleHeaderInformation();
			}
			return container.service;
		}]);
})();