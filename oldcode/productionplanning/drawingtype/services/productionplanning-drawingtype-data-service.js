(function () {
	'use strict';
	/* global angular, globals, _ */
	const moduleName = 'productionplanning.drawingtype';

	angular.module(moduleName).factory('productionPlanningDrawingTypeDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionPlanningDrawingTypeConstantValues', 'productionplanningCommonSortingProcessor',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, constantValues, sortingProcessor) {
			let container;
			let serviceOptions = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'productionPlanningDrawingTypeDataService',
					dataProcessor: [sortingProcessor.create({'dataServiceName': 'productionPlanningDrawingTypeDataService'})],
					entityNameTranslationID: 'productionplanning.drawingtype.entityDrawingType',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/drawingtype/',
						usePostForRead: true,
						endRead: 'filtered',
						endDelete: 'delete'
						// endDelete: 'multidelete' // if we need multidelete feature in the future, enable current line code
					},
					// entitySelection: { supportsMultiSelection: true }, // if we need multidelete feature in the future, enable current line code
					entityRole: {
						root: {
							itemName: 'EngDrawingType', // remark: if entitySelection.supportsMultiSelection is true, we use 'EngDrawingTypes' as itemName, or we use 'EngDrawingType' as itemName
							moduleName: 'cloud.desktop.moduleDisplayNameEngineeringDrawingType',
							descField: 'Description'
						}
					},
					presenter:{
						list:{
							handleCreateSucceeded:function (newItem) {
								if(newItem.Version === 0 && newItem.RubricCategoryFk === 0){
									newItem.RubricCategoryFk = null;
								}
							}
						}
					},
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
						uid: 'productionPlanningDrawingTypeDataService',
						title: 'productionplanning.drawingtype.entityDrawingType',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: constantValues.schemes.drawingType
					}
				}
			};
			container = platformDataServiceFactory.createNewComplete(serviceOptions);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'productionPlanningDrawingTypeValidationService'
			}, constantValues.schemes.drawingType));

			return container.service;
		}
	]);
})();