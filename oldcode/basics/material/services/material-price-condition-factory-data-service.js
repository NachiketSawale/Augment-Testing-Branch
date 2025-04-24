(function (angular, globals) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialPriceConditionFactoryDataService',
		['$http', '$q', '$translate','$timeout', '$injector', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			'platformModalService', 'platformModuleStateService', 'platformDataValidationService', 'platformDataServiceDataProcessorExtension', '_', 'prcCommonItemCalculationHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($http, $q, $translate,$timeout, $injector, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, runtimeDataService,
				platformModalService, platformModuleStateService, platformDataValidationService, platformDataServiceDataProcessorExtension, _, prcCommonItemCalculationHelper) {

				var constructor = function constructor(parentService, options) {
					var reloadPromise, recalculatePromise, lockParentSelectionDeferred;
					let lastLoadedParentItem = null;
					let roundingType = prcCommonItemCalculationHelper.roundingType;
					var ReadOnlyDataProcessor = function ReadOnlyDataProcessor() {
						this.processItem = function (item) {
							service.updateReadOnly(item);
						};
					};

					function incorporateDataRead(readData, data) {
						lastLoadedParentItem = data.currentParentItem;
						const items = data.usesCache && angular.isArray(readData) ? readData : (readData.Main || []);
						basicsLookupdataLookupDescriptorService.attachData(readData || {});
						if(angular.isFunction(parentService.getReadOnly))
						{
							if (parentService.getReadOnly()) {
								service.setFieldReadonly(items);
							}
						}
						const dataRead = data.handleReadSucceeded(items, data);
						return dataRead;
					}

					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCRUD: {
								route: globals.webApiBaseUrl + options.route,
								initReadData: options.initReadData, endCreate: options.endCreate || 'create'
							},
							presenter: {
								list: {
									incorporateDataRead: options.incorporateDataRead || incorporateDataRead,
									initCreationData: options.initCreationData || function (creationData) {
										creationData.MainItemId = parentService.getSelected().Id;
										creationData.existedTypes = service.getList().map(function (item) {
											return item.PrcPriceConditionTypeFk;
										});
									},
									handleCreateSucceeded: function (item) {
										if (!!item.PriceConditionType && !!item.PriceConditionType.DescriptionInfo) {
											item.Description = item.Description || item.PriceConditionType.DescriptionInfo.Translated;
										}
									}
								}
							},
							dataProcessor: [new ReadOnlyDataProcessor()],
							entityRole: {
								leaf: {
									itemName: options.itemName || 'PriceCondition',
									parentService: parentService,
									doesRequireLoadAlways: true
								}
							}
						}
					};


					var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

					/* jshint -W003 */
					var service = serviceContainer.service;

					if(options.serviceName){
						service.serviceName = options.serviceName;
					}

					var readonlyFields = [{field: 'Description', readonly: true}, {field: 'IsActivated', readonly: true},
						{field: 'IsPriceComponent', readonly: true}, {field: 'Total', readonly: true}, {field: 'TotalOc', readonly: true},
						{field: 'PrcPriceConditionTypeFk', readonly: true}, {field: 'Value', readonly: true}];

					service.setFieldReadonly = function(items){
						if(_.isArray(items)){
							_.forEach(items, function(item){
								runtimeDataService.readonly(item, readonlyFields);
							});
						}
					};

					service.total = 0;

					service.totalOc = 0;

					service.data = serviceContainer.data;

					service.getLastLoadedParentItem = function(){
						return lastLoadedParentItem;
					};

					service.setLastLoadedParentItem = function(value){
						return lastLoadedParentItem = value;
					};

					// clear cache, in order to refresh data from server after clicking refresh button or change main data item.
					serviceContainer.data.clearEntireCache = function clearEntireCache(data) {
						if (data && data.usesCache) {
							for (var prop in data.cache) {
								if (data.cache.hasOwnProperty(prop)) {

									var changes = data.cache[prop];

									changes.loadedItems.length = 0;
									changes.selectedItems.length = 0;
									changes.modifiedItems.length = 0;
									changes.deletedItems.length = 0;

									delete data.cache[prop];
								}
							}

							delete data.cache;
							data.cache = {};
						}
					};

					serviceContainer.service.clearCache = function clearCache() {
						serviceContainer.data.clearEntireCache(serviceContainer.data);
					};

					service.provideUpdateData = function () {
						// store data item list to cache in order to update data version after update successfully.
						if (serviceContainer.data.currentParentItem && angular.isFunction(serviceContainer.data.storeCacheFor)) {
							serviceContainer.data.storeCacheFor(serviceContainer.data.currentParentItem, serviceContainer.data);
						}
					};

					service.cleanUpLocalData = function () {
						// not implement, no need now
					};

					var readonlyItems = ['Value'];
					var readonlyAllItems = ['PrcPriceConditionTypeFk', 'Description', 'Total', 'TotalOc', 'IsPriceComponent', 'IsActivated', 'Value'];
					service.updateReadOnly = function (item, model) {
						var index;
						if (!model) {
							var readonlyAll = false;
							var tempReadonlyItems = [];
							if (angular.isFunction(options.readonlyAll)) {
								readonlyAll = options.readonlyAll();
							}

							if (readonlyAll) {
								tempReadonlyItems = readonlyAllItems;
							}
							else {
								tempReadonlyItems = readonlyItems;
							}

							for (index = 0; index < tempReadonlyItems.length; index++) {
								updateFieldReadonly(item, tempReadonlyItems[index]);
							}
						} else {
							updateFieldReadonly(item, model);
						}

					};

					function updateFieldReadonly(item, model) {
						var editable = (!service.getCellEditable || service.getCellEditable(item, model));
						runtimeDataService.readonly(item, [{field: model, readonly: !editable}]);
					}

					service.getCellEditable = function getCellEditable(item, model) {
						if (angular.isFunction(parentService.getReadOnly)&&parentService.getReadOnly()){
							return false;
						}
						if (angular.isFunction(options.readonly)) {
							options.readonly = options.readonly();
						}

						if (options.readonly) {
							return false;
						}

						if (model === 'Value') {
							if (_.isEmpty(item.PriceConditionType)) {
								return false;
							}
							return item.PriceConditionType.HasValue;
						}
						if (model === 'Total') {
							if (_.isEmpty(item.PriceConditionType)) {
								return false;
							}
							return item.PriceConditionType.HasTotal;
						}
						return true;
					};

					service.hasEmptyType = function hasEmptyType() {
						var list = serviceContainer.data.itemList;
						if (list) {
							var items = _.filter(list, function (item) {
								return _.isEmpty(item.PriceConditionType);
							});
							return !!items.length;
						}

					};

					service.markAllItemsAsModified = function markAllItemsAsModified(updateData) {
						service.markAllAsModified(updateData);
					};

					serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
						var index = 0;
						var itemList = serviceContainer.data.itemList;
						if (itemList && itemList.length) {
							if(deleteParams.entity){
								index = itemList.indexOf(deleteParams.entity);
							}
							else if(deleteParams && deleteParams.entities){
								index = itemList.indexOf(deleteParams.entities[0]);
							}
						}
						deleteParams.index = index;
					};

					var onDeleteDoneBase = serviceContainer.data.onDeleteDone;

					serviceContainer.data.onDeleteDone = function onDeleteDone(deleteParams) {
						deleteParams.index = serviceContainer.data.itemList.length - 1;
						onDeleteDoneBase.apply(this, arguments);

					};

					// get data item list according to parent item in case parent item is not selected.
					function getListOfParent(parentItem) {
						const lastLoadedParentItem = service.getLastLoadedParentItem();
						if (parentItem === null || parentItem === lastLoadedParentItem) {
							return $q.when(service.getList());
						}
						else if (serviceContainer.data.cache && serviceContainer.data.cache[parentItem.Id]) {
							return $q.when(serviceContainer.data.cache[parentItem.Id].loadedItems);
						}
						else {
							let filter = 'mainItemId=';
							if (serviceContainer.data.parentFilter) {
								filter = serviceContainer.data.parentFilter + '=';
							}

							serviceContainer.data.setFilter(filter + parentItem.Id);
							let originalOnReadSucceeded = serviceContainer.data.onReadSucceeded;
							serviceContainer.data.onReadSucceeded = function temp(readData, data) {
								let items = angular.copy(incorporateDataRead(readData, data));
								if(data.cache){
									data.cache[parentItem.Id] = {
										loadedItems: items,
										selectedItems: [],
										modifiedItems: [],
										deletedItems: []
									};
								}else{
									console.log('price condition onReadSucceeded error');
								}
								return items;
							};

							let defer = $q.defer();
							let haveInitReadData = !!(serviceContainer.data.initReadData);
							let originalInitReadData = serviceContainer.data.initReadData;
							if(haveInitReadData){
								serviceContainer.data.initReadData = function(readData, data){
									readData.filter = '?boqHeaderFk=' + parentItem.BoqHeaderFk + '&boqItemFk=' + parentItem.Id;
								};
							}

							serviceContainer.data.doNotLoadOnSelectionChange = true;
							serviceContainer.data.doReadData(serviceContainer.data)
								.then(function (result) {
									serviceContainer.data.doNotLoadOnSelectionChange = false;
									defer.resolve(result);
								})
								.catch(function () {
									serviceContainer.data.doNotLoadOnSelectionChange = false;
									defer.resolve();
								});

							if(haveInitReadData){
								serviceContainer.data.initReadData = originalInitReadData;
							}

							serviceContainer.data.onReadSucceeded = originalOnReadSucceeded;
							return defer.promise;
						}
					}

					function clearModifications(modState, parentState, entity) {
						var data = serviceContainer.data;

						if (parentState && entity && parentState[data.itemName + 'ToSave']) {
							if (_.find(parentState[data.itemName + 'ToSave'], {Id: entity.Id})) {
								parentState[data.itemName + 'ToSave'] = _.filter(parentState[data.itemName + 'ToSave'], function (item) {
									return item.Id !== entity.Id;
								});
								modState.modifications.EntitiesCount -= 1;
							}
						}

						if (entity && entity.Version === 0 && modState.modifications[data.itemName + 'ToSave']) {
							if (_.find(modState.modifications[data.itemName + 'ToSave'], {Id: entity.Id})) {
								modState.modifications[data.itemName + 'ToSave'] = _.filter(modState.modifications[data.itemName + 'ToSave'], function (item) {
									return item.Id !== entity.Id;
								});
								modState.modifications.EntitiesCount -= 1;
							}
						}
					}

					// attach lookup data after re-load
					service.handleReloadSucceeded = function handleReloadSucceeded(parentItem, loadedData, options, isCopyFromPrcItem) {
						var defer = $q.defer();
						var selectedParent = parentService.getSelected();

						// sync description of priceCondition Type to priceCondition
						_.forEach(loadedData, function (item) {
							if (!!item.PriceConditionType && !!item.PriceConditionType.DescriptionInfo) {
								item.Description = item.Description || item.PriceConditionType.DescriptionInfo.Translated;
							}
						});

						var parentId = parentItem.Id;
						var itemCache = null;
						if(serviceContainer.data.cache){
							itemCache = serviceContainer.data.cache[parentId];
						}
						if(!itemCache){
							itemCache = {
								loadedItems: [],
								selectedItems: [],
								modifiedItems: [],
								deletedItems: []
							};
							if(serviceContainer.data.cache){
								serviceContainer.data.cache[parentId] = itemCache;
							}
						}else if(itemCache.loadedItems.length) {
							// clear data.cache[item.id] loadedItems
							itemCache.loadedItems.length = 0;
						}
						if (isCopyFromPrcItem && options.moduleName === 'procurement.pes' && _.isFunction(serviceContainer.service.setPriceConditionCache)) {
							serviceContainer.service.setPriceConditionCache(parentId, loadedData);
						}
						if (selectedParent && parentId === selectedParent.Id) {
							// closed the price condition container 'supportUpdateOnSelectionChanging' flag before creating new items.
							serviceContainer.data.supportUpdateOnSelectionChanging = false;
							if(Object.prototype.hasOwnProperty.call(service,'unwatchEntityAction')&&_.isFunction(service.unwatchEntityAction)) {
								service.unwatchEntityAction();
							}
							service.clearItems();
							// The onCreateSucceeded is an asynchronous function,
							// So we need to wait for all items to be created before we can open
							//   the price condition container 'supportUpdateOnSelectionChanging' flag.
							Promise.all(loadedData.map(item => serviceContainer.data.onCreateSucceeded(item, serviceContainer.data, {})))
								.then(() => {
									// open the price condition container 'supportUpdateOnSelectionChanging' flag after created all new items.
									serviceContainer.data.supportUpdateOnSelectionChanging = true;
									defer.resolve(true);
								}, (err) => {
									defer.reject(err);
								});
						}
						else { // selected parent item has been changed.
							var modState = platformModuleStateService.state(service.getModule());
							var elemState;
							var parentElemState = parentService.assertPath(modState.modifications, false, parentItem);
							var isParentItemDeleted = false;
							if (options.moduleName === 'boq.main') {
								elemState = parentElemState;
							}
							else {
								var parentItemName = parentService.getItemName();
								var parentItem2Save = parentElemState[parentItemName + 'ToSave'];
								if (parentItem2Save) {
									elemState = _.find(parentItem2Save, function (dataItem) {
										return dataItem.MainItemId === parentId;
									});
								}
								var parentItem2Delete = parentElemState[parentItemName + 'ToDelete'];
								if (!elemState && parentItem2Delete) {
									isParentItemDeleted = true;
									elemState = _.find(parentItem2Delete, function (dataItem) {
										return dataItem.MainItemId === parentId;
									});
								}
							}

							if (!elemState) {
								defer.resolve(true);
								return defer.promise;
							}

							angular.forEach(itemCache.loadedItems, function (dataItem) {
								if (dataItem.Version && dataItem.Version > 0) {
									// remove error list about validation issue
									platformDataValidationService.removeDeletedEntityFromErrorList(dataItem, service);
									service.addEntityToDeleted(elemState, dataItem, serviceContainer.data, modState.modifications);
								}
								clearModifications(modState, elemState, dataItem);
							});

							itemCache.loadedItems.length = 0;

							if (!isParentItemDeleted) {
								angular.forEach(loadedData, function (item) {
									if (!_.find(itemCache.loadedItems, {Id: item.Id})) {
										platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);
										itemCache.loadedItems.push(item);
										service.addEntityToModified(elemState, item, modState.modifications);
									}
								});
							}

							itemCache.selectedItems.length = 0;

							defer.resolve(true);
						}

						return defer.promise;
					};

					service.handleRecalcuateDone = function handleRecalcuateDone(parentItem, loadedData, priceConditionFk,field,module) {
						var priceConditions = loadedData.PriceConditions;
						var varPercent = loadedData.VatPercent;
						// if (!service.updateOnCommit) {
						updateParentTotal(parentItem, priceConditions, priceConditionFk, varPercent,field,module);
						// }

						if (!loadedData.IsSuccess) {
							var errorstr = loadedData.ErrorMessages.map(function (error) {
								if (error.Error) {
									return $translate.instant('basics.material.record.priceConditionTypeFormulaError', {'errorCode': error.PriceConditionType.Code}) + '\t(' + error.Error + ').';
								}
								return $translate.instant('basics.material.record.priceConditionTypeFormulaError', {'errorCode': error.PriceConditionType.Code});
							}).join('<hr>');

							platformModalService.showErrorBox(errorstr, 'Price Calculation Error');
						}
						service.resetTotal(priceConditions);
					};

					service.resetTotal = function (gridData) {
						// clear total.
						service.total = 0;
						service.totalOc = 0;
						if (gridData && gridData.length) {
							const filteredData = _.filter(gridData, {IsPriceComponent: true});
							service.total = prcCommonItemCalculationHelper.round(roundingType.MdcPriceCondition_Total, _.sumBy(filteredData, function (item) {
								return item.Total;
							}));
							service.totalOc = prcCommonItemCalculationHelper.round(roundingType.MdcPriceCondition_TotalOc, _.sumBy(filteredData, function (item) {
								return item.TotalOc;
							}));
						}
					};

					/* jshint -W003 */
					var updateParentTotal = function updateParentTotal(parentItem, priceConditions, priceConditionFk, vatPercent,field,module) {
						// var parentItem = serviceContainer.data.currentParentItem;
						let totalOc = prcCommonItemCalculationHelper.round(roundingType.MdcPriceCondition_TotalOc, _.sumBy(priceConditions, function (item) {
							return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.TotalOc : 0;
						}));
						let total = prcCommonItemCalculationHelper.round(roundingType.MdcPriceCondition_Total, _.sumBy(priceConditions, function (item) {
							return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.Total : 0;
						}));
						options.onCalculateDone(parentItem, priceConditionFk, total, totalOc, vatPercent,field,module);
					};

					// used to prepare reloading to delay parent service changing selection to the end of price condition logic.
					service.lockParentSelection = function () {
						if (!lockParentSelectionDeferred) {
							lockParentSelectionDeferred = $q.defer();
						}
						return lockParentSelectionDeferred.promise;
					};

					service.releaseParentSelection = function () {
						if (!lockParentSelectionDeferred) {
							return;
						}
						lockParentSelectionDeferred.resolve(true);
						lockParentSelectionDeferred = null;
					};

					/**
					 * @ngdoc function
					 * @name reload
					 * @function
					 * @methodOf basicsMaterialPriceConditionFactoryDataService
					 * @description Reload the price condition details from according to the price condition type.
					 * @returns promise of the reload http call
					 */
					service.reload = function reload(parentItem, priceConditionId, isFromMaterial, isCopyFromPrcItem, materialPriceListId,isCopyPriceConditionFromBoqDivision, basicPrcItemId ) {
						var defer = $q.defer();
						resetLoading(true);
						priceConditionId = priceConditionId !== null ? priceConditionId : -1;
						parentItem = parentItem || parentService.getSelected();
						if(_.isNil(priceConditionId)){
							priceConditionId=-1;
						}
						const context = service.getContext();
						const url = globals.webApiBaseUrl + options.route + 'reload';
						$http.post(url, {
							PrcPriceConditionId: priceConditionId,
							MainItem: service.getMainItem(parentItem),
							ExchangeRate: options.getExchangeRate(),
							IsFromMaterial: isFromMaterial,
							IsCopyFromPrcItem: isCopyFromPrcItem,
							MaterialPriceListId: materialPriceListId,
							HeaderId: context.headerId,
							HeaderName: options.moduleName,
							ProjectFk: context.projectFk,
							IsCopyFromBoqDivision:isCopyPriceConditionFromBoqDivision,
							BasicPrcItemId : basicPrcItemId
						}).then(function (result) {
							var resData = result.data;
							basicsLookupdataLookupDescriptorService.attachData(resData.Lookups);
							//
							service.handleReloadSucceeded(parentItem, resData.PriceConditions, options, isCopyFromPrcItem).then(()=>{
								service.handleRecalcuateDone(parentItem, resData, priceConditionId);
								defer.resolve(true);
							});
						}, function (err) {
							defer.reject(err);
						}).finally(function () {
							resetLoading(false);
							reloadPromise = null;
						});
						reloadPromise = defer.promise;
						return reloadPromise;
					};

					function resetLoading(isLoading) {
						if (!Object.prototype.hasOwnProperty.call(parentService, 'isLoading')) {
							service.isLoading = isLoading;
							if (Object.prototype.hasOwnProperty.call(parentService, 'setItemLoading')) {
								parentService.setItemLoading(isLoading);
							}
						}
					}

					/**
					 * @ngdoc function
					 * @name recalculate
					 * @function
					 * @methodOf basicsMaterialPriceConditionFactoryDataService
					 * @description Call server side recalculate to get the price condition total
					 * @returns promise of the reload http call
					 */
					service.recalculate = function recalculate(parentItem, priceConditionFk, pcList) {
						if (priceConditionFk === undefined && parentItem) {
							priceConditionFk = parentItem.PrcPriceConditionFk;
						}
						service.isLoading = true;
						const priceConditionSearchRes = service.getPriceConditionsOfParent(parentItem, pcList);
						//if priceCondition is loaded, calculate priceConditions
						if(priceConditionSearchRes.isLoaded){
							return service.calcPriceConditionsInternal(parentItem, priceConditionFk, priceConditionSearchRes.priceConditions);
						}
						//else, fetch and calculate priceConditions
						if(options.isBoq){
							return service.calcAndMergePriceConditions(parentItem, priceConditionFk, null, true, options.priceConditionType === 'boq.main.boq');
						}else{
							const defer = $q.defer();
							getListOfParent(parentItem).then(function(priceConditionRes){
								service.calcPriceConditionsInternal(parentItem, priceConditionFk, priceConditionRes).then(function(){
									defer.resolve(true);
								});
							});
							return defer.promise;
						}
					};

					service.getPriceConditionsOfParent = function(parentItem, pcList){
						let priceConditionIsLoaded = false;
						let priceConditions = [];
						const lastLoadedParentItem = service.getLastLoadedParentItem();
						if (pcList) {
							priceConditionIsLoaded = true;
							priceConditions = pcList;
						} else if (parentItem === null || parentItem === lastLoadedParentItem) {
							priceConditionIsLoaded = true;
							priceConditions = service.getList();
						}
						else if (serviceContainer.data.cache && serviceContainer.data.cache[parentItem.Id]) {
							priceConditionIsLoaded = true;
							priceConditions = serviceContainer.data.cache[parentItem.Id].loadedItems;
						}
						return {
							isLoaded: priceConditionIsLoaded,
							priceConditions: priceConditions
						}
					}

					service.getMainItem = function(parentItem){
						let tempParentItem = null;
						if ((_.isNil(parentItem.Code) || parentItem.Code === '') && parentItem.Version === 0) {
							tempParentItem = angular.copy(parentItem);
							tempParentItem.Code = -1;
						}
						return tempParentItem ? tempParentItem : parentItem;
					};

					service.getContext = function(){
						const context = {
							projectFk : null,
							headerId : null
						}
						let headerSer = angular.isFunction(options.headerService) ? options.headerService() : options.headerService;
						if (headerSer) {
							if (options.moduleName === 'boq.main') {
								context.projectFk = context.headerId = headerSer.getSelectedProjectId();
							} else if (!options.isBoq && options.moduleName === 'procurement.package') {
								context.headerId = headerSer.getSelected().PackageFk;
								context.projectFk = headerSer.getSelected().ProjectFk;
							} else if (!options.isBoq && options.moduleName === 'procurement.quote.requisition') {
								context.headerId = headerSer.getSelected().QtnHeaderFk;
								context.projectFk = headerSer.getSelected().ProjectFk;
							} else if (!options.isBoq && options.moduleName === 'procurement.pes') {
								context.headerId = $injector.get('procurementPesHeaderService').getSelected().Id;
								context.projectFk = $injector.get('procurementPesHeaderService').getSelected().ProjectFk;
							} else {
								context.headerId = headerSer.getSelected().Id;
								context.projectFk = headerSer.getSelected().ProjectFk;
							}
						}
						return context;
					};

					service.calcPriceConditionsInternal = function(parentItem, priceConditionFk, priceConditions){
						if (priceConditionFk === null && !(priceConditions && priceConditions.length)) {
							options.onCalculateDone(parentItem, priceConditionFk, 0, 0, 0);
							service.isLoading = false;
							return $q.when();
						}
						else {
							parentItem = parentItem || parentService.getSelected();
							if (!_.isNil(priceConditions)) {
								return service.calcAndMergePriceConditions(parentItem, priceConditionFk, priceConditions, false, false);
							} else {
								service.isLoading = false;
								return $q.when();
							}
						}
					};

					service.calcAndMergePriceConditions = function(parentItem, priceConditionFk, priceConditions, reload, autoSave){
						const defer = $q.defer();
						service.calcPriceConditionsCore(parentItem, priceConditions || [], reload, autoSave).then(function(result) {
							//if priceConditions not exist, it means priceConditions of current is not loaded, assign the priceConditions calculated to container.
							if(!priceConditions){
								serviceContainer.data.onReadSucceeded(result.data.PriceConditions, serviceContainer.data);
							}
							service.handleRecalcuateDone(parentItem, result.data, priceConditionFk);
							return service.mergeChanges(result.data.PriceConditions, parentItem, reload ? result.data.PriceConditions : priceConditions);
						}).finally(function() {
							service.isLoading = false;
							recalculatePromise = null;
							defer.resolve();
						});
						recalculatePromise = defer.promise;
						return defer.promise;
					};

					service.calcPriceConditionsCore = function(parentItem, priceConditions, reload, autoSave){
						const context = service.getContext();
						const url = globals.webApiBaseUrl + options.route + 'recalculate';
						return $http.post(url, {
							PriceConditions: angular.copy(priceConditions),
							MainItem: service.getMainItem(parentItem),
							ExchangeRate: options.getExchangeRate(),
							HeaderId: context.headerId,
							HeaderName: options.moduleName,
							ProjectFk: context.projectFk,
							Reload: reload,
							AutoSave: autoSave
						});
					}

					service.copyDataState = function copyModifications() {
						var modState = platformModuleStateService.state(service.getModule());
						return {
							modifications: angular.copy(modState.modifications),
							itemList: angular.copy(service.getList())
						};
					};

					service.restoreDataState = function restoreDataState(dataState) {
						var modState = platformModuleStateService.state(service.getModule());
						service.setList(dataState.itemList);
						modState.modifications = dataState.modifications;
					};

					service.mergeChanges = function mergeChanges(priceConditionsCalculated, parentItem, oldItems) {
						if(oldItems){
							return service.mergeChangeCore(oldItems, priceConditionsCalculated);
						}
						return getListOfParent(parentItem).then(function (oldItems) {
							return service.mergeChangeCore(oldItems, priceConditionsCalculated);
						});
					};

					service.mergeChangeCore = function(oldItems, itemsCalculated){
						oldItems = oldItems || [];
						const data = serviceContainer.data;
						_.forEach(itemsCalculated, function (updateItem) {
							let oldItem = _.find(oldItems, {Id: updateItem.Id});
							if (oldItem) {
								if (oldItem.Version > 0 && oldItem.Total !== updateItem.Total && oldItem.TotalOc !== updateItem.TotalOc) {
									service.markItemAsModified(oldItem);
								}
								data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
							}
						});
						service.gridRefresh();
						return null;
					}

					service.clearItems = function clearItems() {
						angular.forEach(service.getList(), function (item) {
							service.deleteItem(item);
						});
					};

					service.showEditDialog = function showEditDialog() {
						var defer = $q.defer();

						if (reloadPromise) {
							reloadPromise.finally(showPriceConditionDialog);
						}
						else {
							showPriceConditionDialog();
						}

						function showPriceConditionDialog() {
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + 'basics.material/partials/price-condition-edit-dialog.html',
								backdrop: false,
								dataService: service,
								width: '650px',
								selectedParentItem: parentService.getSelected(),
								windowClass: 'form-modal-dialog'
							}).then(function () {
								parentService.markItemAsModified(parentService.getSelected());
								defer.resolve(true);
							});
						}

						return defer.promise;
					};

					service.getParentItem = function () {
						return parentService.getSelected() || {};
					};

					service.getParentService = function () {
						return parentService;
					};

					service.moduleName = options.moduleName;

					var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
						if (completeData.Material) {
							$timeout(function () {
								var materialEntity=completeData.Material;
								service.reload(materialEntity, completeData.Material.PrcPriceconditionFk);
							}, 300);
						}
					};

					if (parentService.completeEntityCreateed) {
						parentService.completeEntityCreateed.register(onCompleteEntityCreated);
					}

					if (options.getParentDataContainer) {
						var parentDataContainer = options.getParentDataContainer();
						var updateOnSelectionChanging = parentDataContainer.data.updateOnSelectionChanging;

						if (angular.isFunction(updateOnSelectionChanging)) { // parent service is root service.
							// workaround, delay parent service changing selection to the end of price condition logic.
							parentDataContainer.data.updateOnSelectionChanging = function (data, entity) {
								// if not support, don't do anything
								if (!data.supportUpdateOnSelectionChanging) {
									return $q.when(true);
								}
								var deferred = $q.defer();
								var lockParentSelectionPromise = lockParentSelectionDeferred && lockParentSelectionDeferred.promise;
								var promises = [reloadPromise, recalculatePromise, lockParentSelectionPromise].filter(function (item) {
									return item !==null;
								});

								if (promises.length) {
									$q.all(promises).finally(function () {
										updateOnSelectionChanging(data, entity).then(function () {
											deferred.resolve(true);
										});
									});
								}
								else {
									updateOnSelectionChanging(data, entity).then(function () {
										deferred.resolve(true);
									});
								}

								return deferred.promise;
							};
						}else if (options.selectionChangeWaitForAsyncValidation){
							parentDataContainer.data.updateOnSelectionChanging = function (data, entity){
								const deferred = $q.defer();
								const lockParentSelectionPromise = lockParentSelectionDeferred && lockParentSelectionDeferred.promise;
								$q.all([lockParentSelectionPromise]).then(function(){
									deferred.resolve(true);
								});
								return deferred.promise;
							}
						}
					}

					/**
					 * get parent data container
					 * @returns {null}
					 */
					service.getParentDataContainer = function getParentDataContainer() {
						var parentDataContainer = null;
						if (options.getParentDataContainer) {
							parentDataContainer = options.getParentDataContainer();
						} else if (parentService.getContainerData) {
							parentDataContainer = {
								data: parentService.getContainerData(),
								service: service
							};
						}
						return parentDataContainer;
					}

					service.registerListLoaded(function () {
						service.resetTotal(service.getList());
					});

					if(_.isFunction(service.gridRefresh)) {
						let defaultGridRefresh = service.gridRefresh;
						service.gridRefresh = function gridRefresh() {
							defaultGridRefresh();
							service.resetTotal(service.getList());
						};
					}

					if(parentService.deleteDone){
						parentService.deleteDone.register(function(deleteEntity){
							var cache = serviceContainer.data.cache;
							if(cache && deleteEntity){
								delete cache[deleteEntity.Id];
							}
						});
					}
					return service;
				};

				var serviceCache = {};
				var getService = function getService(parentService, options) {
					var moduleName = options.priceConditionType || options.moduleName;
					if (!serviceCache.hasOwnProperty(moduleName)) {
						serviceCache[moduleName] = constructor.apply(this, arguments);
					}
					return serviceCache[moduleName];
				};

				return {
					createService: getService,
					getCaches: function (moduleName) {
						if (serviceCache[moduleName]) {
							var service = serviceCache[moduleName];
							return service.getList();
						}
					}
				};
			}]
	);

})(angular, globals);
