
(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'qto.main';
	
	angular.module(moduleName).factory('qtoAddressRangeDetailServiceFactory',
		['$q', '$http', 'PlatformMessenger', 'platformDataServiceFactory', 'platformRuntimeDataService','$injector',
			function ($q, $http, PlatformMessenger, platformDataServiceFactory, platformRuntimeDataService,$injector) {
				let factory = {};
				
				factory.CreateQtoAddressRangeDetailService = function (options, serviceName) {
					let service = {},
						data = [],
						itemsToSave = [],
						itemsToDelete = [];
					
					angular.extend(service, {
						getList: getList,
						clear: clear,
						setDataList: setDataList,
						refreshGrid: refreshGrid,
						gridRefresh: gridRefresh,
						createItem: createItem,
						deleteItem: deleteItem,
						setItemToSave: setItemToSave,
						getItemsToSave: getItemsToSave,
						getItemsToDelete: getItemsToDelete,
						registerListLoaded: registerListLoaded,
						unregisterListLoaded: unregisterListLoaded,
						registerSelectionChanged: registerSelectionChanged,
						unregisterSelectionChanged: unregisterSelectionChanged,
						listLoaded: new PlatformMessenger(),
						selectionChanged: new PlatformMessenger(),
						setListReadOnly: new PlatformMessenger(),
						setListReadOnlyByActive: setListReadOnlyByActive,
						updateReadOnly: updateReadOnly
					});
					
					let serviceOption = {
						module: angular.module(moduleName),
						entitySelection: {},
						serviceName: serviceName,
						modification: {multi: {}},
						translation: {
							uid: 'estimateMainStructureConfigDetailDataService',
							title: 'Title',
							columns: [
								{
									header: 'cloud.common.entityDescription',
									field: 'DescriptionInfo'
								}]
						}
					};
					
					let container = platformDataServiceFactory.createNewComplete(serviceOption);
					container.data.itemList = [];
					angular.extend(service, container.service);
					return service;
					
					function setListReadOnlyByActive(isReadOnly) {
						let itemList = getList();
						_.forEach(itemList, function (item) {
							service.updateReadOnly(item, ['IndexArea', 'LineArea', 'SheetArea', 'BasClerkFk', 'BasClerkRoleFk'], isReadOnly);
						});
					}
					
					function updateReadOnly(item, modelArray, value) {
						_.forEach(modelArray, function (model) {
							platformRuntimeDataService.readonly(item, [
								{field: model, readonly: value}
							]);
						});
					}
					
					function getList() {
						return data;
					}
					
					function setDataList(items) {
						if (Array.isArray(items)) {
							// setCodeColReadOnly(items);
							data = items;
						} else {
							data = [];
						}
						return items;
					}
					
					function addItem(item) {
						data = data ? data : [];
						data.push(item);
						setItemToSave(item);
						service.refreshGrid();
					}
					
					function refreshGrid() {
						service.listLoaded.fire();
					}
					
					function updateSelection() {
						service.selectionChanged.fire();
					}
					
					function registerListLoaded(callBackFn) {
						service.listLoaded.register(callBackFn);
					}
					
					function unregisterListLoaded(callBackFn) {
						service.listLoaded.unregister(callBackFn);
					}
					
					function registerSelectionChanged(callBackFn) {
						service.selectionChanged.register(callBackFn);
					}
					
					function unregisterSelectionChanged(callBackFn) {
						service.selectionChanged.unregister(callBackFn);
					}
					
					function setItemToSave(item) {
						let modified = _.find(itemsToSave, {Id: item.Id});
						if (!modified) {
							itemsToSave.push(item);
						}
					}
					
					function gridRefresh() {
						refreshGrid();
					}
					
					function createItem(item) {
						// server create
						let httpRoute = globals.webApiBaseUrl + 'qto/main/header/createQtoAddressDetail';
						let param = {
							QtoAddressRangeDetailDto: item
						};
						return $http.post(httpRoute, param).then(function (response) {
							let item = response.data;
							if (item && item.Id) {
								addItem(item);
								service.setSelected(item);
								$injector.get('qtoMainPropertiesDialogService').validationOkBtn.fire();
							}
							return item;
						});
					}
					
					function deleteItem(selectedItem) {
						if (selectedItem === null) {
							return;
						}
						
						if (selectedItem && selectedItem.Version > 0) {
							itemsToDelete.push(selectedItem);
						}
						
						data = _.filter(data, function (d) {
							return d.Id !== selectedItem.Id;
						});
						
						itemsToSave = _.filter(itemsToSave, function (d) {
							return d.Id !== selectedItem.Id;
						});
						
						service.setSelected(null);
						refreshGrid();
						updateSelection();
						$injector.get('qtoMainPropertiesDialogService').validationOkBtn.fire();
					}
					
					function getItemsToSave() {
						return itemsToSave.length ? itemsToSave : [];
					}
					
					function getItemsToDelete() {
						return itemsToDelete.length ? itemsToDelete : [];
					}
					
					function clear() {
						itemsToSave = [];
						itemsToDelete = [];
					}
				};
				return factory;
				
			}]);
})(angular);
