/* eslint-disable no-mixed-spaces-and-tabs */
/**
 * Created by zov on 7/26/2019.
 */
(function () {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.product';
	const module = angular.module(moduleName);
	module.factory('productionplanningProductMainService', PPSProductMainService);
	PPSProductMainService.$inject = ['productionplanningCommonStatusLookupService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService',
		'productionplanningCommonProductProcessor',
		'platformDataServiceFactory',
		'productionplanningCommonProductValidationFactory',
		'$http',
		'$q',
		'$injector',
		'cloudDesktopSidebarService',
		'platformGenericStructureService',
		'platformGridAPI',
		'ppsCommonTransportInfoHelperService',
		'cloudDesktopPinningContextService',
		'projectMainPinnableEntityService',
		'basicsCommonCharacteristicService',
		'ppsUIUtilService',
		'productionplanningPhaseDataServiceFactory',
		'ppsVirtualDateshiftDataServiceFactory',
		'productionplanningCommonStructureFilterService',
		'productionplanningProductDocumentDataProviderFactory'];

	function PPSProductMainService(statusService,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataLookupFilterService,
		platformRuntimeDataService,
		productionplanningCommonProductProcessor,
		platformDataServiceFactory,
		productionplanningCommonProductValidationFactory,
		$http,
		$q,
		$injector,
		cloudDesktopSidebarService,
		platformGenericStructureService,
		platformGridAPI,
		ppsCommonTransportInfoHelperService,
		cloudDesktopPinningContextService,
		projectPinnableEntityService,
		basicsCommonCharacteristicService,
		ppsUIUtilService,
		phaseDataServiceFactory,
		ppsVirtualDateshiftDataServiceFactory,
		ppsCommonStructureFilterService,
		productDocumentDataProviderFactory) {

		const gridContainerGuid = '434794d7bfbb4c9c8aeb4df85eb602d0';
		const characteristic1SectionId = 63;
		const characteristic2SectionId = 64;
		let characteristicColumn = '';

		let serviceContainer;
		const serviceInfo = {
			flatRootItem: {
				module: module,
				serviceName: 'productionplanningProductMainService',
				entityNameTranslationID: 'productionplanning.common.product.productTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'customfiltered',
					endDelete: 'multidelete',
					usePostForRead: true,
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningProductMainService', filterRequest);
						ppsCommonStructureFilterService.setFilterRequest('productionplanningProductMainService', filterRequest);
						serviceContainer.service.setLeadingFilter(filterRequest.furtherFilters);
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							let result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};
							basicsLookupdataLookupDescriptorService.attachData(readData);
							serviceContainer.service.processTransportInfo(result.dtos);
							const dataRead = serviceContainer.data.handleReadSucceeded(result, data);

							handleCharacteristic(result.dtos);

							return dataRead;
						}
					}
				},
				entityRole: {
					root: {
						itemName: 'Products', // remark: since entitySelection.supportsMultiSelection is true, we use 'Products' as itemName. 'Products' maps collection-property Products of ProductCompelteDto
						moduleName: 'cloud.desktop.moduleDisplayNamePPSProduct',
						responseDataEntitiesPropertyName: 'Main',
						useIdentification: true,
						handleUpdateDone: function handleUpdateDone(updateData, response, data) {
							// when we "override" method handleUpdateDone(), here we should also call method handleOnUpdateSucceeded() to refresh data in the UI according to response data.
							data.handleOnUpdateSucceeded(updateData, response, data, true);
							data.updateDone.fire(updateData);
							// refresh phase container
							if (isProdPlaceFkFieldDirty === true) {
								isProdPlaceFkFieldDirty = false;
								let productPhaseDataService = phaseDataServiceFactory.getService(moduleName, serviceContainer.service);
								ppsUIUtilService.reloadService(productPhaseDataService, 'productionplanning.product.phase.list');
							}
						}
					}
				},
				dataProcessor: [productionplanningCommonProductProcessor],
				sidebarWatchList: {active: true}, // enable watchlist for this module
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: false,
						pinningOptions: {
							isActive: true,
							showPinningContext: [
								{token: cloudDesktopPinningContextService.tokens.projectToken, show: true}
							],
							setContextCallback: function (dataService) {
								const selected = dataService.getSelected();
								if (selected) {
									const projectId = _.get(selected, 'ProjectId');
									if ((projectPinnableEntityService.getPinned() !== projectId)) {
										const ids = {};
										projectPinnableEntityService.appendId(ids, projectId);
										projectPinnableEntityService.pin(ids, dataService);
									}
								}
							}
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				actions: {
					delete: false,
					create: {}
				},
				translation: {
					uid: 'productionplanningProductMainService',
					title: 'productionplanning.common.product.productTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceInfo);

		let virtualDateshiftService = ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService(moduleName, serviceContainer.service);

		serviceContainer.data.newEntityValidator = productionplanningCommonProductValidationFactory.getNewEntityValidator(serviceContainer.service, 'productionplanning.common.product.event');
		serviceContainer.service.createDispatchingNote = function (wizParams, products) {
			if (products && (products instanceof Array) && products.length > 0) {
				const ids = products.map(function (pdt) {
					return pdt.Id;
				});
				const parm = {
					productIds: ids,
					wizParams: wizParams
				};
				return $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/dispatchingProducts', parm);
			}
		};

		// hackcode: Here "override" method doReadData() for setting furtherFilters parameter (by zwz 2019/07/10)
		let furtherFilters;
		let leadingFilter;
		const basReadData = serviceContainer.data.doReadData;
		serviceContainer.data.doReadData = function doReadData(data) {
			if ((furtherFilters === null || furtherFilters.length === 0) && (leadingFilter === null || leadingFilter.length === 0)) {
				return basReadData(data);
			}

			data.listLoadStarted.fire();

			if (_.isFunction(serviceContainer.service.disableFilteringByModelObjects)) {
				serviceContainer.service.disableFilteringByModelObjects();
			}

			const mayRequireModelObjectFilter = (function checkModelObjectFilterRequired() {
				return !(!serviceContainer.data.enhanceFilterByModelObjectSelection || !serviceContainer.data.filterByViewerManager || !serviceContainer.data.filterByViewerManager.isActive());
			})();

			if (data.usesCache && data.currentParentItem && data.currentParentItem.Id && !mayRequireModelObjectFilter) {
				const cache = data.provideCacheFor(data.currentParentItem.Id, data);

				if (cache) {
					data.onReadSucceeded(cache.loadedItems, data);

					return $q.when(cache.loadedItems);
				}
			}

			const readData = {};
			readData.filter = '';

			if (data.initReadData) {
				data.initReadData(readData, data);

				if (data.enhanceReadDataByModelObjectSelection) {
					if (data.usePostForRead) {
						data.enhanceReadDataByModelObjectSelection(readData, data);
					} else {
						data.enhanceFilterByModelObjectSelection(readData, data);
					}
				}
			} else if (data.filter) {
				readData.filter = '?' + data.filter;

				if (data.enhanceFilterByModelObjectSelection) {
					data.enhanceFilterByModelObjectSelection(readData, data);
				}
			} else if (data.sidebarSearch) {

				if (cloudDesktopSidebarService.checkStartupFilter()) {
					return null;
				}
				const options = serviceInfo.flatRootItem;
				const params = _.cloneDeep(cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter));
				if (options.entityRole && options.entityRole.root) {
					if (options.entityRole.root.useIdentification) {
						_.forEach(params.PinningContext, function (pItem) {
							const pId = pItem.id;
							if (_.isNumber(pId)) {
								pItem.id = {Id: pId};
							}
						});
						if (params.PKeys && params.PKeys.length > 0) {
							const tmp = [];
							_.forEach(params.PKeys, function (pItem) {
								if (_.isNumber(pItem)) {
									tmp.push({Id: pItem});
								}
							});
							params.PKeys = tmp;
						}
					} else {
						_.forEach(params.PinningContext, function (pItem) {
							const pId = pItem.id;
							if (!_.isNumber(pId) && _.isObject(pId)) {
								pItem.id = pId.Id;
							}
						});
						if (params.ProjectContextId && !_.isNumber(params.ProjectContextId) && _.isObject(params.ProjectContextId)) {
							params.ProjectContextId = params.ProjectContextId.Id;
						}
					}
				}
				angular.extend(readData, params);

				// TODO: remove initReadData above, if no usages in modules anymore
				// used for smooth migration to replace initReadData option
				// problem: at the moment if initReadData is used filter/sidebarSearch are ignored!
				if (_.isFunction(data.extendSearchFilter)) {
					data.extendSearchFilter(readData, data);
				}

				if (data.isRoot && platformGenericStructureService.isFilterEnabled()) {
					const groupingFilter = platformGenericStructureService.getGroupingFilterRequest();

					if (groupingFilter) {
						readData.groupingFilter = groupingFilter;
						//readData.furtherFilters = serviceContainer.service.getLastFilter().furtherFilters;// set furtherFilters for grouping filter (by zwz 2019/07/10)
						readData.furtherFilters = !_.isNil(furtherFilters) && furtherFilters.length > 0?  serviceContainer.service.getLastFilter().furtherFilters.concat(leadingFilter) : serviceContainer.service.getLastFilter().furtherFilters;
					}
				}
			}

			return serviceContainer.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
		};

		furtherFilters = [];
		serviceContainer.service.setFurtherFilters = function (filters) {
			furtherFilters = filters;
		};
		serviceContainer.service.getLastFilter = function () {
			return {furtherFilters: furtherFilters};
		};

		leadingFilter = [];
		serviceContainer.service.setLeadingFilter = function (filter){
			leadingFilter = filter;
		};
		// remark: Here we implement method getLastFilter() for privding furtherFilters when invoking function executeRequest() in platformGenericStructureService
		ppsCommonTransportInfoHelperService.registerItemModified(serviceContainer, productionplanningCommonProductValidationFactory.getValidationService(serviceContainer.service, 'productionplanning.common.product.event'));

		let isProdPlaceFkFieldDirty = false;
		serviceContainer.service.onEntityPropertyChanged = function (entity, field) {
			if (field === 'PpsProcessFk') {
				serviceContainer.service.getChildServices().forEach(function (service) {
					service.load();
				});
			}
			else if (field === 'ProdPlaceFk') {
				isProdPlaceFkFieldDirty  = true;
			}
		};

		serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		const basicsCharacteristicDataServiceFactory = $injector.get('basicsCharacteristicDataServiceFactory');
		basicsCharacteristicDataServiceFactory.getService(serviceContainer.service, characteristic1SectionId);
		basicsCharacteristicDataServiceFactory.getService(serviceContainer.service, characteristic2SectionId);

		const filters = [{
			key: 'pps-common-product-sub-product-set-filter',
			serverSide: true,
			fn: function (dataItem) {
				let productionSetFk = dataItem.ProductionSetFk || -1;
				if (productionSetFk === -1) {
					// when do filter in bulk editor dialog, the dateItem is empty object.
					const selected = serviceContainer.service.getSelected();
					productionSetFk = selected && selected.ProductionSetFk || -1;
				}
				return 'ProductionSetParentFk=' + productionSetFk;
			}
		}];

		serviceContainer.service.registerLookupFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		serviceContainer.service.unregisterLookupFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		//for navigator function
		serviceContainer.service.searchByCalId = function (id) {
			var item = serviceContainer.service.getItemById(id);
			//if item is null(maybe because the service hasn't load data), then we search by it immediately.
			if (!item) {
				cloudDesktopSidebarService.filterSearchFromPKeys([id]);
			}
			else {
				serviceContainer.service.setSelected(item);
			}
		};

		const documentDataProvider = productDocumentDataProviderFactory.create(serviceContainer.service, true);
		_.extend(serviceContainer.service, documentDataProvider);

		serviceContainer.service.handleBookProductsToStockLocationWizardDone = function (modifyProducts){
			var products = serviceContainer.service.getList();
			_.forEach(modifyProducts, function (modifyProduct){
				var oldProduct = _.find(products, {Id: modifyProduct.Id});
				if(oldProduct){
					oldProduct.PrjStockFk = modifyProduct.NextStockId;
					oldProduct.PrjStockLocationFk = modifyProduct.NextStockLocationId;
				}
			})
			serviceContainer.service.gridRefresh();
		};

		return serviceContainer.service;

		function handleCharacteristic(item, isAfterCreated = false) {
			const exist = $injector.get('platformGridAPI').grids.exist(gridContainerGuid);
			if (exist) {
				const containerInfoService = $injector.get('productionplanningProductContainerInformationService');
				const characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
					.getService(serviceContainer.service, characteristic2SectionId, gridContainerGuid, containerInfoService);

				if (isAfterCreated) {
					characterColumnService.appendDefaultCharacteristicCols(item);
				} else {
					characterColumnService.appendCharacteristicCols(item);
				}
			}
		}
	}

})();