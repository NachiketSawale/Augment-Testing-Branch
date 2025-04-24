/**
 * Created by lav on 12/9/2019.
 */

(function (angular) {
	/* global _,globals, angular */
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsUpstreamItemDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'$injector',
		'ppsUpstreamItemValidationService',
		'ppsItemUpstreamItemProcessor', 'platformRuntimeDataService',
		'upstreamGoodsTypes', 'PlatformMessenger', '$http', 'platformGridAPI', 'upstreamTypes',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService','ppsItemUpstreamItemSvgProcessor'];

	function DataService(platformDataServiceFactory,
		basicsCommonMandatoryProcessor,
		$injector,
		validationService,
		upstreamItemProcessor, platformRuntimeDataService,
		upstreamGoodsTypes, PlatformMessenger, $http, platformGridAPI, upstreamTypes,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataLookupFilterService,ppsItemUpstreamItemSvgProcessor) {

		function enSureInvalidValue(newItem) {
			if (newItem) {
				Object.keys(newItem).forEach(function (prop) {
					if (prop.endsWith('Fk') && prop !== 'UomFk') {
						if (newItem[prop] <= 0) {
							newItem[prop] = null;
						}
					}
				});
			}
		}

		function getServiceObject(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function createNewComplete(serviceOptions) {
			var parentService = getServiceObject(serviceOptions.parentService || 'productionplanningItemDataService');
			var route = globals.webApiBaseUrl + 'productionplanning/item/upstreamitem/';
			var mainItemColumn = serviceOptions.mainItemColumn || serviceOptions.ppsItemColumn || 'Id';
			var ppsHeaderColumn = serviceOptions.ppsHeaderColumn || 'PPSHeaderFk';
			var ppsItemColumn = serviceOptions.ppsItemColumn || 'Id';
			var defaultServiceOptions = {
				flatNodeItem: {
					module: moduleName,
					serviceName: parentService.getServiceName() + 'PpsUpstreamItemDataService',
					entityNameTranslationID: 'productionplanning.item.upstreamItem.entity',
					httpRead: {
						route: route,
						endRead: serviceOptions.endRead || 'list',
						initReadData: function initReadData(readData) {
							var parentSelected = parentService.getSelected();
							if(parentSelected) {
								readData.filter = '?mainItemId=' + (parentSelected[mainItemColumn] || -1) + '&ppsHeaderFk=' + (parentSelected[ppsHeaderColumn] || -1);
							}
						}
					},
					httpCreate: {
						route: route,
						endCreate: serviceOptions.endCreate || 'create'
					},
					entityRole: {
						node: {
							itemName: 'PpsUpstreamItem',
							parentService: parentService,
							// parentFilter: serviceOptions.parentFilter || 'itemFk',
							// filterParent: function (data) {
							// 	//keep the same function as platformDataServiceEntityRoleExtension
							// 	data.currentParentItem = data.parentService.getSelected();
							// 	data.selectedItem = null;
							// 	if (data.currentParentItem) {
							// 		return data.currentParentItem[mainItemColumn];
							// 	}
							// }
						}
					},
					useItemFilter: true,
					entitySelection: {supportsMultiSelection: true},
					dataProcessor: [upstreamItemProcessor, ppsItemUpstreamItemSvgProcessor, { processItem: (item) => {
						if(serviceOptions.serviceKey === 'transportplanning.requisition.upstreamitembyjob'){
							platformRuntimeDataService.readonly(item, true);
						}
					}}],
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var parentSelected = parentService.getSelected();
								creationData.PKey1 = parentSelected[ppsHeaderColumn];
								creationData.PKey2 = parentSelected[ppsItemColumn];
							},
							handleCreateSucceeded: function (newItem) {
								enSureInvalidValue(newItem);
								toggleFilterOfMaterialIsProduct(newItem);
							},
							incorporateDataRead: function (readData, data) {
								if(service.onlyShowCurrentUpstreams){
									service.showListByFilter();
								}

								let prcPackageLookupData = _.get(readData, 'Lookups.PrcPackage');
								if(prcPackageLookupData){
									basicsLookupdataLookupDescriptorService.updateData('PrcPackage', prcPackageLookupData);
								}
								let result = readData.Main || readData;
								return data.handleReadSucceeded(result, data);
							}
						}
					},
					actions: serviceOptions.actions ||
						{
							delete: {},
							create: 'flat',
							canCreateCallBackFunc: canCreate,
							canDeleteCallBackFunc: canDelete
						}
				}
			};

			function canCreate(){
				var res = true;
				if(serviceOptions.canCreate !== undefined) {
					res = serviceOptions.canCreate;
				} else {
					var selectedParentItem = parentService.getSelected();
					res  = !!selectedParentItem[mainItemColumn];
				}
				return res;
			}

			function canDelete() {
				var res = true;
				if(serviceOptions.canDelete !== undefined) {
					res = serviceOptions.canDelete;
				}
				return res;
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);
			serviceContainer.data.usesCache = false;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				mustValidateFields: ['UpstreamResult', 'UomFk', 'UpstreamGoods'],
				typeName: 'PpsUpstreamItemDto',
				moduleSubModule: 'ProductionPlanning.Item',
				validationService: validationService.getService(serviceContainer.service)
			});

			var service = serviceContainer.service;
			service.additionalColumns = serviceOptions.additionalColumns;
			service.onPropertyChangeEvent = new PlatformMessenger();
			service.onPropertyChanged = function onPropertyChanged(entity, field) {
				function cleanUpstreamGoods(entity) {
					entity.UpstreamGoods = null;
					let result = validationService.getService(serviceContainer.service).validateUpstreamGoods(entity, entity.UpstreamGoods, 'UpstreamGoods');
					platformRuntimeDataService.applyValidationResult(result, entity, 'UpstreamGoods');
				}
				switch (field) {
					case 'PpsUpstreamTypeFk':
						{
							entity.UpstreamResult = null;
							entity.UpstreamResultStatus = null;
							cleanUpstreamGoods(entity); // upstream goods should be clean up when upstream type changed.(#138556)
							toggleFilterOfMaterialIsProduct(entity);
						}
						break;
					case 'UpstreamResult':
						{
							if (entity.selectedUpstreamResult) {
								entity.UpstreamResultStatus = entity.selectedUpstreamResult.PPSItemStatusFk
									|| entity.selectedUpstreamResult.PackageStatusFk
									|| entity.selectedUpstreamResult.RequisitionStatusFk
									|| entity.selectedUpstreamResult.PesStatusFk;
								if(entity.PpsUpstreamTypeFk === 1){
									entity.PpsItemUpstreamFk = entity.selectedUpstreamResult.Id;
								}
							} else if(entity.PpsUpstreamTypeFk === 1){
								entity.PpsItemUpstreamFk = null;
							}
							platformRuntimeDataService.readonly(entity, [
								{field: 'PpsUpstreamTypeFk', readonly: (entity.UpstreamResult > 0 && entity.Version > 0)},
								{field: 'PpsUpstreamGoodsTypeFk', readonly: (entity.UpstreamResult > 0 && entity.UpstreamGoods > 0 && entity.Version > 0)}
							]);
						}
						break;
					case 'PpsUpstreamGoodsTypeFk':
						{
							cleanUpstreamGoods(entity);
							toggleFilterOfMaterialIsProduct(entity);
						}
						break;
					case 'UpstreamGoods':
						{
							let option = upstreamGoodsTypes.lookupInfo[entity.PpsUpstreamGoodsTypeFk];
							if (option && option.uomFkPropertyName && entity.selectedUpstreamGoods) {
								entity.UomFk = entity.selectedUpstreamGoods[option.uomFkPropertyName];
								let result = validationService.getService(serviceContainer.service).validateUomFk(entity, entity.UomFk, 'UomFk');
								platformRuntimeDataService.applyValidationResult(result, entity, 'UomFk');
							}
							platformRuntimeDataService.readonly(entity, [
								{field: 'PpsUpstreamGoodsTypeFk', readonly: (entity.UpstreamResult > 0 && entity.UpstreamGoods > 0 && entity.Version > 0)}
							]);
						}
						break;
				}
				service.markItemAsModified(entity);
				service.onPropertyChangeEvent.fire(null, {entity: entity, field: field});
			};

			function toggleFilterOfMaterialIsProduct(entity) {
				const filter = {
					key: 'pps-upstream-item-material-is-product-filter',
					serverSide: true,
					fn: function (dataItem, searchOptions) {
						searchOptions.MaterialFilter = {
							IsProduct: true
						};
					}
				};
				// if upstream type is Production and upstream good type is Material,
				// the upstream good lookup should show materials which IsProduct is true.
				if (isUpstreamTypeProduct(entity) && isUpstreamGoodTypeMaterial(entity)) {
					if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.registerFilter(filter);
					}
				} else {
					if (basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.unregisterFilter(filter);
					}
				}
			}

			function isUpstreamTypeProduct(entity) {
				return entity.PpsUpstreamTypeFk === upstreamTypes.Production;
			}

			function isUpstreamGoodTypeMaterial(entity) {
				return entity.PpsUpstreamGoodsTypeFk === upstreamGoodsTypes.Material;
			}

			service.canDocCreateCallBackFunc = function (entity, data) {
				var selected = service.getSelected();
				return selected && selected.PpsUpstreamTypeFk === 1;
			};

			service.copy = function () {
				var source = service.getSelected();
				var parentSelected = parentService.getSelected();
				if (source && parentSelected) {
					$http.post(globals.webApiBaseUrl + 'productionplanning/item/upstreamitem/create').then(function (response) {
						var newItem = response.data;
						//	newItem.PpsHeaderFk = source.PpsHeaderFk;
						//	newItem.PpsItemFk = source.PpsItemFk;
						newItem.PpsHeaderFk = parentSelected[ppsHeaderColumn]? parentSelected[ppsHeaderColumn] : source.PpsHeaderFk;
						newItem.PpsItemFk = parentSelected[ppsItemColumn]? parentSelected[ppsItemColumn] : null;
						newItem.PpsUpstreamGoodsTypeFk = source.PpsUpstreamGoodsTypeFk;
						newItem.PpsUpstreamTypeFk = source.PpsUpstreamTypeFk;
						newItem.UpstreamGoods = source.UpstreamGoods;
						newItem.UomFk = source.UomFk;
						//	newItem.Quantity = source.Quantity;
						serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data);
					});
				}
			};

			service.getDefaultFilter = function (entity) {
				var selected = service.getSelected();
				var sOptions = this;
				var parentSelected = parentService.getSelected();
				switch (sOptions.lookupType) {
					case 'PPSItem':
						var parentServiceName = parentService.getServiceName();
						if (parentServiceName === 'productionplanningItemDataService') {
							entity.ProjectId = parentSelected.ProjectFk;
							entity.JobId = parentSelected.LgmJobFk;

						} else if (parentServiceName === 'productionplanningEngineeringMainService') {
							entity.ProjectId = parentSelected.PPSItem_ProjectFk;
							entity.JobId = parentSelected.PPSItem_LgmJobFk;
						} else if (parentServiceName === 'productionplanningHeaderDataService') {
							entity.ProjectId = parentSelected.PrjProjectFk;
							entity.JobId = parentSelected.LgmJobFk;
						}
						if (selected.PpsUpstreamGoodsTypeFk === 1) {
							entity.MaterialId = selected.UpstreamGoods;
						}
						break;
				}
			};

			service.onlyShowCurrentUpstreams = false;
			service.listGuid = undefined;
			service.getPpsItem = function (){
				var parentSelected = parentService.getSelected();
				if(_.isNil(parentSelected)){
					return undefined;
				}
				return  parentSelected[ppsItemColumn];
			};

			service.showListByFilter = function (){
				if(_.isNil(service.listGuid)){  // if need to filter, pass the guid
					return;
				}
				var parentSelected = parentService.getSelected();
				if(_.isNil(parentSelected)){
					return;
				}
				var ppsItemId = parentSelected[ppsItemColumn];  // in pps Header container, not need to filter
				if(!_.isNil(ppsItemId)){
					if(service.onlyShowCurrentUpstreams === true){
						platformGridAPI.filters.extendFilterFunction(service.listGuid, function (item) {
							return item.PpsItemFk === ppsItemId;
						});
					} else {
						platformGridAPI.filters.extendFilterFunction(service.listGuid, function (item) {
							return true;
						});
					}
				}
			};
			return service;
		}

		basicsLookupdataLookupFilterService.registerFilter([
			{
				key: 'ppsitem-upstream-goodtype-filter',
				fn: function (item) {
					return !(item.Id === upstreamGoodsTypes.CostCode ||
						item.Id === upstreamGoodsTypes.CostCodeTT ||
						item.Id === upstreamGoodsTypes.Process ||
						item.Id === upstreamGoodsTypes.Formwork);
				}
			}
		]);

		var serviceCache = {};

		function getService(serviceOptions) {
			serviceOptions = serviceOptions || {};
			var serviceKey = serviceOptions.serviceKey || 'productionplanning.item.upstreamitem';
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
