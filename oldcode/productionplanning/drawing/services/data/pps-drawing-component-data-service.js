/**
 * Created by lav on 4/28/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingComponentDataService', RuleDataService);

	RuleDataService.$inject = ['platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformRuntimeDataService',
		'$injector',
		'productionplanningDrawingComponentProcessor',
		'productionplanningDrawingComponentValidationService',
		'productionplanningDrawingComponentStatusLookupService',
		'drawingComponentTypes',
		'$q'];

	function RuleDataService(platformDataServiceFactory,
							 lookupDescriptorService,
							 basicsCommonMandatoryProcessor,
							 platformRuntimeDataService,
							 $injector,
							 drawingComponentProcessor,
							 drawingComponentValidationService,
							 drawingComponentStatusLookupService,
							 drawingComponentTypes,
							 $q) {
		var serviceCache = {};

		function getService1(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getService1(serviceOptions.parentService);
			var route = globals.webApiBaseUrl + 'productionplanning/drawing/component/';
			var defaultServiceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: parentService.getServiceName() + 'DrawingComponentDataService',
					entityNameTranslationID: 'productionplanning.drawing.drawingComponent.entity',
					httpCreate: {
						route: route,
						endCreate: serviceOptions.endCreate || 'create'
					},
					entityRole: {
						leaf: {
							itemName: 'DrawingComponents',
							parentService: parentService,
							parentFilter: serviceOptions.parentFilter || 'EngDrawingFk'
						}
					},
					useItemFilter: true,
					entitySelection: {supportsMultiSelection: true},
					dataProcessor: [drawingComponentProcessor],
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var parentSelected = parentService.getSelected();
								// parent is drawing
								if (parentService.getServiceName() === 'productionplanningDrawingMainService') {
									creationData.PKey1 = parentSelected.Id;
								} else if (parentService.getServiceName() === 'productionplanningItemDataService') {
									creationData.PKey2 = parentSelected.ProductDescriptionFk;
								}
								// or parent is productDescription
								else {
									creationData.PKey1 = parentSelected.EngDrawingFk;
									creationData.PKey2 = parentSelected.Id;
								}

							},
							handleCreateSucceeded: function (newItem) {
								if (newItem.EngDrwCompStatusFk < 1) {
									newItem.EngDrwCompStatusFk = null;
								}
								if (newItem.EngDrwCompTypeFk < 1) {
									newItem.EngDrwCompTypeFk = null;
								}
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canDeleteCallBackFunc: function (selectedItem) {
							if (selectedItem.Version <= 0) {
								return true;
							}
							if (!selectedItem.EngDrwCompStatusFk) {
								return false;
							}
							var statusList = drawingComponentStatusLookupService.getList();
							var status = _.find(statusList, {Id: selectedItem.EngDrwCompStatusFk});
							return status && status.Isdeletable;
						}
					}
				}
			};

			// remark: if parent container is productDescription (not drawing), for creation, we need to confirm that the selected parent item has a valid value of EngDrawingFk field.
			if (parentService.getServiceName() !== 'productionplanningDrawingMainService') {
				defaultServiceOptions.flatLeafItem.actions = {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						var parentSelected = parentService.getSelected();
						return parentSelected && parentSelected.EngDrawingFk !== null;
					}
				};
			}
			if (parentService.getServiceName() === 'productionplanningItemDataService') {
				defaultServiceOptions.flatLeafItem.actions = {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						var parentSelected = parentService.getSelected();
						return parentSelected && parentSelected.ProductDescriptionFk !== null;
					}
				};
			}
			if (serviceOptions.useLocalResource) {
				defaultServiceOptions.flatLeafItem.httpRead = {
					useLocalResource: true,
					resourceFunction: function () {
						var rootSelected = null;
						if (serviceOptions.useLocalResource.key === 'cadImportDrawing') {
							rootSelected = parentService.getSelected();
							return _.filter(rootSelected.PersistObject.DrawingComponents, {'PpsProductdescriptionFk': null});
						} else if (serviceOptions.useLocalResource.key === 'cadImportProductTemplate') {
							rootSelected = parentService.parentService().getSelected();
							return _.filter(rootSelected.PersistObject.DrawingComponents, {'PpsProductdescriptionFk': parentService.getSelected().Id});
						}
					}
				};
			} else {
				defaultServiceOptions.flatLeafItem.httpRead = {
					route: route,
					endRead: serviceOptions.endRead || 'getbydrawing',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = parentService.getSelected();
						// parent is PU
						if (parentService.getServiceName() === 'productionplanningItemDataService') {
							readData.PKey1 = selected.ProductDescriptionFk;
						} else if (parentService.getServiceName() === 'productionplanningDrawingProductDescriptionDataService') {
							const selectedDrawing = parentService.parentService().getSelected();
							readData.PKey1 = selected.Id;
							readData.PKey2 = selectedDrawing.Id;
						} else {
							readData.PKey1 = selected.Id;
						}
					}
				};
			}

			if (serviceOptions.isReadonly === true) {
				defaultServiceOptions.flatLeafItem.actions = {};
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'EngDrawingComponentDto',
				moduleSubModule: 'ProductionPlanning.Drawing',
				validationService: drawingComponentValidationService.getService(serviceContainer.service)
			});
			var service = serviceContainer.service;

			function updateField(entity, field, value) {
				entity[field] = value;
				service.markItemAsModified(entity);
			}

			service.handleFieldChanged = function (entity, field) {
				switch (field) {
					case 'EngDrwCompTypeFk':
						var componentTypeId = entity[field];
						entity.MdcMaterialCostCodeFk = (componentTypeId === drawingComponentTypes.Material) ? entity.MdcMaterialFk :
							(componentTypeId === drawingComponentTypes.CostCode ? entity.MdcCostCodeFk : null);
						var validateService = drawingComponentValidationService.getService(serviceContainer.service);
						var result = validateService.validateMdcMaterialCostCodeFk(entity, entity.MdcMaterialCostCodeFk, 'MdcMaterialCostCodeFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'MdcMaterialCostCodeFk');
						// set UoM
						if (entity.MdcMaterialCostCodeFk) {
							var promise;
							if (componentTypeId === drawingComponentTypes.Material) {
								var materail = lookupDescriptorService.getLookupItem('MaterialCommodity', entity.MdcMaterialCostCodeFk);
								promise = materail ? $q.when(materail) : lookupDescriptorService.getItemByKey('MaterialCommodity', entity.MdcMaterialCostCodeFk);
								promise.then(function (materail) {
									updateField(entity, 'BasUomFk', materail.BasUomFk);
								});
							}
							if (componentTypeId === drawingComponentTypes.CostCode) {
								var costCode = lookupDescriptorService.getLookupItem('costcode', entity.MdcMaterialCostCodeFk);
								promise = costCode ? $q.when(costCode) : lookupDescriptorService.getItemByKey('costcode', entity.MdcMaterialCostCodeFk);
								promise.then(function (costCode) {
									updateField(entity, 'BasUomFk', costCode.UomFk);
								});
							}
						}
						break;
					case 'MdcMaterialCostCodeFk':
						if (entity.EngDrwCompTypeFk === drawingComponentTypes.Material) {
							entity.MdcMaterialFk = entity[field];
						} else if (entity.EngDrwCompTypeFk === drawingComponentTypes.CostCode) {
							entity.MdcCostCodeFk = entity[field];
						}
						break;
				}
			};

			service.addDataProcessor = function (dataProcessor) {
				if (Array.isArray(dataProcessor)) {
					dataProcessor.forEach(i => serviceContainer.data.processor.push(i));
				} else if (typeof dataProcessor === 'object') {
					serviceContainer.data.processor.push(dataProcessor);
				}
			};

			return serviceContainer.service;
		}

		function getService(serviceOptions) {
			var serviceKey = serviceOptions.serviceKey;
			if (!serviceCache[serviceKey]) {
				serviceCache[serviceKey] = createNewComplete(serviceOptions);
			}
			return serviceCache[serviceKey];
		}

		return {
			getService: getService
		};
	}

})(angular);
