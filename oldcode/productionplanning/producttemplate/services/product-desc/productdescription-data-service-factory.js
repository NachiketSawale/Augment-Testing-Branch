/**
 * Created by zwz on 5/16/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	var serviceFactoryName = 'productionplanningProducttemplateProductDescriptionDataServiceFactory';
	angular.module(moduleName).factory(serviceFactoryName, DataService);

	DataService.$inject = [
		'$injector',
		'basicsCommonContainerDialogService',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor',
		'productionplanningProducttemplateProductDescriptionProcessor',
		'productionplanningProducttemplateProductDescriptionValidationServiceFactory',
		'platformRuntimeDataService',
		'platformGridAPI',
		'basicsCommonCharacteristicService',
		'platformModuleStateService'];
	function DataService($injector,
						 dialogDataService,
						 basicsLookupdataLookupDescriptorService,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 basicsCommonMandatoryProcessor,
						 productDescProcessor,
						 validationServiceBase,
						 platformRuntimeDataService,
						 platformGridAPI,
						 basicsCommonCharacteristicService,
						 platformModuleStateService) {

		var serviceFactory = {};
		var serviceCache = {};
		const defaultGridContainerGuid = 'ff4c323cfd0e4a5692f923110b8ffb00';
		const characteristic1SectionId = 61;
		const characteristic2SectionId = 62;
		let characteristicColumn = '';

		function getService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		function getDataProcessors(serviceOptions) {
			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
				{
					typeName: 'ProductDescriptionDto',
					moduleSubModule: 'ProductionPlanning.ProductTemplate'
				}
			);
			var processors = [dateProcessor, productDescProcessor];
			if (serviceOptions.readOnly === true) {
				processors.push({
					processItem: function (item) {
						var fileds = Object.getOwnPropertyNames(item).map(function (prop) {
							return {field: prop, readonly: true};
						});
						platformRuntimeDataService.readonly(item, fileds);
					}
				});
			}
			return processors;
		}

		serviceFactory.createNewComplete = function (options) {
			var service;
			var parentService = getService(options.parentService);
			var gridContainerGuid = options.gridContainerGuid || defaultGridContainerGuid;

			var serviceContainer;

			var serviceOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: options.serviceName,
					entityNameTranslationID: 'productionplanning.producttemplate.entityProductDescription',
					dataProcessor: getDataProcessors(options),
					entityRole: {
						node: {
							itemName: 'ProductDescription',
							parentService: parentService,
							parentFilter: options.parentFilter
						}
					},
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var parentSelected = parentService.getSelected();
								if (options.parentFilter === 'engDrawingId') {
									creationData.PKey1 = parentSelected.Id;
								} else if (options.parentFilter === 'engTaskId') {
									creationData.PKey2 = parentSelected.Id;
								} else if (options.parentFilter === 'engStackId') {
									creationData.PKey1 = parentSelected.EngDrawingFk;
									creationData.PKey3 = parentSelected.Id;
								}
							}
						}
					},
					translation: {
						uid: options.serviceName,
						title: options.translationIdentifier || 'productionplanning.producttemplate.productDescriptionListTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ProductDescriptionDto',
							moduleSubModule: 'ProductionPlanning.ProductTemplate'
						},
					},
					actions: options.readOnly === true ? {
						delete: false,
						create: {}
					} : undefined
				}
			};

			if (options.useLocalResource) {
				if (options.useLocalResource.key === 'cadImportDrawing') {
					serviceOption.flatNodeItem.httpRead = {
						useLocalResource: true,
						resourceFunction: function () {
							return parentService.getSelected().PersistObject.ProductDescriptions;
						}
					};
				} else if (options.useLocalResource.key === 'cadImportStack') {
					serviceOption.flatNodeItem.httpRead = {
						useLocalResource: true,
						resourceFunction: function () {
							return _.filter(parentService.parentService().getSelected().PersistObject.ProductDescriptionsForStack, {StackId: parentService.getSelected().Id});
						}
					};
				}
			} else {
				serviceOption.flatNodeItem.httpCRUD = {
					route: globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/',
					endRead: options.endRead,
					usePostForRead: options.usePostForRead,
					initReadData: options.usePostForRead ? function initReadData(readData) {
						var selected = parentService.getSelected();
						readData.Id = selected.ProductDescriptionFk;
						// for supporting case of reading productDescriptions by Drawing ID in POST way(br zwz 2019/10/24)
						if (selected.EngDrawingFk && options.parentFilter === 'engDrawingId') {
							readData.PKey1 = selected.EngDrawingFk;
						}
					} : undefined
				};
			}

			if (options.onlyShowDetails) {
				let baseIncorporateDataRead = serviceOption.flatNodeItem.presenter.list.incorporateDataRead;
				serviceOption.flatNodeItem.presenter.list.incorporateDataRead = function (readData, data) {
					let dataRead = baseIncorporateDataRead ? baseIncorporateDataRead(readData, data)
						: serviceContainer.data.handleReadSucceeded([readData], data); // because in this case, result is only one dto
					service.setSelected(readData);
					return dataRead;
				};
			}

			if (options.hasCharacteristic) {
				serviceOption.flatNodeItem.presenter.list.handleCreateSucceeded = function(item) {
					basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, item, characteristic1SectionId, characteristic2SectionId);
					let exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						let containerInfoService = $injector.get('productionplanningProductTemplateContainerInformationService');
						let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
							.getService(service, characteristic2SectionId, gridContainerGuid,containerInfoService);
						characterColumnService.appendDefaultCharacteristicCols(item);
					}
				};

				let baseIncorporateDataRead = serviceOption.flatNodeItem.presenter.list.incorporateDataRead;
				serviceOption.flatNodeItem.presenter.list.incorporateDataRead = function(readData, data) {
					let dataRead = baseIncorporateDataRead ? baseIncorporateDataRead(readData, data)
						: serviceContainer.data.handleReadSucceeded(readData, data);

					// handle characteristic
					let containerInfoService = $injector.get('productionplanningProductTemplateContainerInformationService');
					let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
						.getService(service, characteristic2SectionId, gridContainerGuid,containerInfoService);

					let exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						characterColumnService.appendCharacteristicCols(readData.dtos);
					} else {
						// some modules (e.g., Product) only have a detail container, we also want to show characteristic data in there.
						characterColumnService.appendCharacteristicCols([readData]);
					}

					return dataRead;
				};
			}

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ProductDescriptionDto',
				moduleSubModule: 'ProductionPlanning.ProductTemplate',
				validationService: validationServiceBase.getService(service)
			});

			if (options.idProperty) {
				//override to support idProperty
				serviceContainer.data.storeCacheFor = function storeCacheFor(item, data) {
					var itemCache = data.cache[item.Id];

					if (!itemCache) {
						itemCache = {
							loadedItems: [],
							selectedItems: [],
							modifiedItems: [],
							deletedItems: []
						};
					}

					data.cache[item.Id] = itemCache;

					if (data.itemTree) {
						angular.forEach(data.itemTree, function (item) {
							if (!_.find(itemCache.loadedItems, function (loadedItem) {
									return loadedItem[options.idProperty] === item[options.idProperty];
								})) {
								itemCache.loadedItems.push(item);
							}
						});
					}
					else {
						angular.forEach(data.itemList, function (item) {
							if (!_.find(itemCache.loadedItems, function (loadedItem) {
									return loadedItem[options.idProperty] === item[options.idProperty];
								})) {
								itemCache.loadedItems.push(item);
							}
						});
					}

					if (data.selectedItems) {
						angular.forEach(data.selectedItems, function (item) {
							if (!_.find(itemCache.selectedItems, function (loadedItem) {
									return loadedItem[options.idProperty] === item[options.idProperty];
								})) {
								itemCache.selectedItems.push(item);
							}
						});
						data.selectedItems.length = 0;
					}

					angular.forEach(data.modifiedItems, function (item) {
						if (!_.find(itemCache.modifiedItems, function (loadedItem) {
								return loadedItem[options.idProperty] === item[options.idProperty];
							})) {
							itemCache.modifiedItems.push(item);
						}
					});
					data.isChanged = false;

					angular.forEach(data.deletedItems, function (item) {
						if (!_.find(itemCache.deletedItems, function (loadedItem) {
								return loadedItem[options.idProperty] === item[options.idProperty];
							})) {
							itemCache.deletedItems.push(item);
						}
					});
				};
			}

			service.handleFieldChanged = function (entity, field) {
				$injector.get('productionplanningProducttemplateDataServiceEntityPropertychangedExtension').onPropertyChanged(entity, field, service);
			};

			if (options.hasCharacteristic) {
				service.isCharacteristicCellReadonly = function isCharacteristicCellReadonly() {
					return options.readOnly || false;
				};

				service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				const basicsCharacteristicDataServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
				basicsCharacteristicDataServiceFactory.getService(service, characteristic1SectionId);
				basicsCharacteristicDataServiceFactory.getService(service, characteristic2SectionId);
			}

			if (options.banSelectionChangedUpdate) {
				serviceContainer.data.ignoreNextSelectionChangeForUpdate = true;
				serviceContainer.data.supportUpdateOnSelectionChanging = false;
				serviceContainer.data.checkTranslationForChanges = null;
			}

			return service;
		};

		serviceFactory.getService = function (options) {
			if (!serviceCache[options.serviceName]) {
				serviceCache[options.serviceName] = serviceFactory.createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		};

		serviceFactory.getServiceByName = function (serviceName) {
			if (serviceCache[serviceName]) {
				return serviceCache[serviceName];
			}
			return null;
		};
		return serviceFactory;
	}
})(angular);
