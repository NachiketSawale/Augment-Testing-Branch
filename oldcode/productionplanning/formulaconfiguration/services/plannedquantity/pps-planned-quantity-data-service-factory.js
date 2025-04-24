(function (angular) {
	'use strict';
	/* global globals, _, angular */
	var moduleName = 'productionplanning.formulaconfiguration';
	var masterModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name ppsPlannedQuantityDataService
	 * @function
	 *
	 * @description
	 * ppsPlannedQuantityDataService is the data service for Planned Quantity.
	 */

	masterModule.factory('ppsPlannedQuantityDataServiceFactory', PpsPlannedQuantityDataServiceFactory);
	PpsPlannedQuantityDataServiceFactory.$inject = [
		'$injector', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'ppsPlannedQuantityValidationServiceFactory',
		'ppsPlannedQuantityResourceQuantityTypeProvider',
		'ppsPlannedQuantityQuantityPropertiesProvider',
		'platformRuntimeDataService',
		'platformGridAPI','ppsPlannedQuantityQuantityTypes',
		'ppsPlannedQuantityProcessor','platformModuleStateService',
		'basicsLookupdataLookupFilterService',
		'ServiceDataProcessDatesExtension'
	];

	function PpsPlannedQuantityDataServiceFactory($injector, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		validationServiceFactory,
		ResourceQuantityTypeProvider,
		PropertiesProvider,
		platformRuntimeDataService,
		platformGridAPI, ppsPlannedQuantityQuantityTypes,
		ppsPlannedQuantityProcessor, platformModuleStateService,
		basicsLookupdataLookupFilterService,
		ServiceDataProcessDatesExtension) {
		function createNewComplete(serviceOptions) {
			let endReadOption = (serviceOptions.isParentPlannedQty === 'true') ? 'customfiltered' : 'tree';
			var parentService = $injector.get(serviceOptions.parentService);
			var serviceInfo = {
				hierarchicalLeafItem: {
					module: moduleName,
					serviceName: serviceOptions.serviceName,
					entityNameTranslationID: 'productionplanning.formulaconfiguration.plannedQuantity.entityPlannedQuantity',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'PpsPlannedQuantityDto',
						moduleSubModule: 'ProductionPlanning.FormulaConfiguration'
					}), ppsPlannedQuantityProcessor, new ServiceDataProcessDatesExtension(['DueDate'])],
					httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/'},
					httpRead: {route: globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/', endRead: endReadOption},
					entityRole: {
						leaf: {
							itemName: 'PpsPlannedQuantity',
							parentService: parentService,
							parentFilter: serviceOptions.parentFilter
						}
					},

					presenter: {
						tree: {
							parentProp: 'PlannedQuantityFk',
							childProp: 'ChildItems',
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData.lookups);
								let selected = parentService.getSelected();
								if(selected && selected.ProjectFk){
									setProjectFk(readData.dtos, selected.ProjectFk);
								}
								let result = {
									FilterResult: readData.FilterResult,
									dtos: readData.dtos || []
								};
								return container.data.handleReadSucceeded(result, data);
							},
							handleCreateSucceeded: function handleCreateSucceeded(newItem) {
								var selected = parentService.getSelected();
								if(selected && selected.ProjectFk) {
									newItem.ProjectFk = selected.ProjectFk;
								}
								return newItem;
							},
							initCreationData: function (creationData) {
								creationData.Id = parentService.getSelected().Id;
								creationData.PKey1 = creationData.parentId;
							}
						}
					},
					actions: {
						create: 'hierarchical',
						// canCreateChildCallBackFunc: canCreateChildCallBackFunc,
						delete: {}
					},
					useItemFilter: true
				}
			};

			function setProjectFk(items, projectFk){
				if(_.isArray(items) && items.length > 0){
					_.forEach(items, (item) => {
						item.ProjectFk = projectFk;
						setProjectFk(item.ChildItems, projectFk);
					});
				}
			}

			// function canCreateChildCallBackFunc(selectedItem) {
			// 	return !!selectedItem && !selectedItem.PlannedQuantityFk;
			// }

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			container.data.usesCache = false;
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsPlannedQuantityDto',
				moduleSubModule: 'ProductionPlanning.FormulaConfiguration',
				validationService: validationServiceFactory.getService(container.service),
				mustValidateFields: ['PpsPlannedQuantityTypeFk', 'BasUomFk']
			});

			if(serviceOptions.isParentPlannedQty === 'true'){
				container.service.getFilteredList = function (){
					return _.filter(container.data.itemList, function (item){
						return item.PlannedQuantityFk === null;
					});
				};
			}

			function validateUomAndTarget(entity) {
				let resultUom = true;
				let resultTarget = true;
				if(entity.PpsPlannedQuantityTypeFk !== ppsPlannedQuantityQuantityTypes.Userdefined){
					resultTarget = validationServiceFactory.getService(container.service).validatePropertyMaterialCostcodeFk(entity, entity.PropertyMaterialCostcodeFk, 'PropertyMaterialCostcodeFk');
				}
				if(entity.PpsPlannedQuantityTypeFk !== ppsPlannedQuantityQuantityTypes.Property && entity.PpsPlannedQuantityTypeFk !== ppsPlannedQuantityQuantityTypes.Userdefined){
					resultUom = validationServiceFactory.getService(container.service).validateBasUomFk(entity, entity.BasUomFk, 'BasUomFk');
				}
				//workaround to stop the errors dialog showing up.
				if (resultTarget === true && entity.__rt$data.errors) {
					delete entity.__rt$data.errors['PropertyMaterialCostcodeFk'];
					let modState = platformModuleStateService.state(container.service.getModule ? container.service.getModule() : container.service.getService().getModule());
					if (modState.validation && modState.validation.issues) {
						_.remove(modState.validation.issues, function (error) {
							if (_.has(error, 'model') && error.model === 'PropertyMaterialCostcodeFk') {
								return true;
							}
						});
					}
				}

				if (resultUom === true && entity.__rt$data.errors) {
					delete entity.__rt$data.errors['BasUomFk'];
					let modState = platformModuleStateService.state(container.service.getModule ? container.service.getModule() : container.service.getService().getModule());
					if (modState.validation && modState.validation.issues) {
						_.remove(modState.validation.issues, function (error) {
							if (_.has(error, 'model') && error.model === 'BasUomFk') {
								return true;
							}
						});
					}
				}
				platformRuntimeDataService.applyValidationResult(resultTarget, entity, 'PropertyMaterialCostcodeFk');
				platformRuntimeDataService.applyValidationResult(resultUom, entity, 'BasUomFk');
			}

			container.service.onPropertyChanged = function onPropertyChanged(entity, field) {
				switch (field) {
					case 'ResourceTypeFk':
						entity.BoQEstItemResFk = null;
						entity.BoqHeaderFk = null;
						entity.BoqItemFk = null;
						entity.EstHeaderFk = null;
						entity.EstLineItemFk = null;
						entity.EstResourceFk = null;
						// var ret = validationServiceFactory.getService(container.service).validateBoQEstItemResFk(entity, entity.BoQEstItemResFk, 'BoQEstItemResFk');
						// platformRuntimeDataService.applyValidationResult(ret, entity, 'BoQEstItemResFk');
						break;
					case 'BoQEstItemResFk':
						if(entity.ResourceTypeFk === 1){
							entity.BoqItemFk = entity.selectedResource.Id;
							entity.BoqHeaderFk = entity.selectedResource.BoqHeaderFk;
						} else if(entity.ResourceTypeFk === 2){
							entity.EstLineItemFk = entity.selectedResource.Id;
							entity.EstHeaderFk = entity.selectedResource.EstHeaderFk;
						} else if(entity.ResourceTypeFk === 3){
							entity.EstResourceFk = entity.selectedResource.Id;
							entity.EstLineItemFk = entity.selectedResource.EstLineItemFk;
							entity.EstHeaderFk = entity.selectedResource.EstHeaderFk;
						}
						break;
					case 'PpsPlannedQuantityTypeFk':
						entity.PropertyMaterialCostcodeFk = null;
						entity.MdcMaterialFk = null;
						entity.MdcCostCodeFk = null;
						entity.Property = null;
						entity.BasUomFk = null;
						entity.CharacteristicFk = null;
						entity.FormulaParameter = null;
						entity.MdcProductDescriptionFk = null;
						ppsPlannedQuantityProcessor.processItem(entity);
						validateUomAndTarget(entity);
						break;
					case 'PropertyMaterialCostcodeFk':
						switch (entity.PpsPlannedQuantityTypeFk) {
							case ppsPlannedQuantityQuantityTypes.Userdefined:
								break;
							case ppsPlannedQuantityQuantityTypes.Material:
								entity.MdcMaterialFk = entity.PropertyMaterialCostcodeFk;
								entity.BasUomFk = entity.selectedQuantity.BasUomFk;
								entity.MdcProductDescriptionFk = null;
								break;
							case ppsPlannedQuantityQuantityTypes.CostCode:
								entity.MdcCostCodeFk = entity.PropertyMaterialCostcodeFk;
								entity.BasUomFk = entity.selectedQuantity.UomFk;
								break;
							case ppsPlannedQuantityQuantityTypes.Property:
								entity.Property = entity.PropertyMaterialCostcodeFk;
								break;
							case ppsPlannedQuantityQuantityTypes.Characteristic:
								entity.CharacteristicFk = entity.PropertyMaterialCostcodeFk;
								break;
							case ppsPlannedQuantityQuantityTypes.FormulaParameter:
								entity.FormulaParameter = entity.PropertyMaterialCostcodeFk;
								break;
						}
						validateUomAndTarget(entity);
						break;
					case 'Reference':
						container.service.fieldReferenceChanged.fire(entity);
						break;
				}
				container.service.markItemAsModified(entity);
			};

			container.service.fieldReferenceChanged =  new Platform.Messenger();
			container.service.registerFieldReferenceChanged = (callbackFn) => container.service.fieldReferenceChanged.register(callbackFn);
			container.service.unregisterFieldReferenceChanged = (callbackFn) => container.service.fieldReferenceChanged.unregister(callbackFn);

			let filters = [
				{
					key: 'mdc-product-template-material-filter',
					fn: function (lookupItem, selected) {
						return lookupItem.MaterialFk === selected.MdcMaterialFk && lookupItem.IsLive;
					}
				}];

			service.registerFilters = function () {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			service.unregisterFilters = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};
			service.registerFilters();
			return container.service;
		}
		var serviceCache = {};
		var service = {};
		service.getService = function getService(serviceOptions) {
			serviceOptions = serviceOptions || {};
			var serviceKey = serviceOptions.serviceName;
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(serviceOptions);
			}
			return serviceCache[serviceKey];
		};

		ResourceQuantityTypeProvider.getResourceQuantityTypes();
		PropertiesProvider.getQuantityProperties();
		return service;
	}
})(angular);
