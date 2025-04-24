(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* global globals, _ */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialMaterialCatalogService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', '$q', 'PlatformMessenger','ServiceDataProcessDatesExtension', 'basicsLookupdataSimpleLookupService',
			function (dataServiceFactory, basicsLookupdataLookupDescriptorService, runtimeDataService, $q, PlatformMessenger,DatesProcessor, basicsLookupdataSimpleLookupService) {

				var serviceContainer = null;
				var service = null;
				var serviceOption = {
					flatRootItem: {
						module: angular.module(moduleName),
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/materialcatalog/catalog/',
							initReadData: function initReadData(filterRequest) {
								filterRequest.filter = '?isFilterCompany=true';
								return filterRequest;
							}
						},
						dataProcessor: [
							new DatesProcessor(['ValidFrom', 'ValidTo', 'DataDate'])
						],
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									let itemList = data.itemList;
									angular.forEach(readData.Main, function (item) {
										item.IsChecked = false;
										let mapItem = _.filter(itemList, {Id: item.Id});
										if (mapItem && mapItem.length > 0){
											item.IsChecked = mapItem[0].IsChecked;
										}
									});
									var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
									service.goToFirst();
									return dataRead;
								}
							}
						},
						modification: {simple: false},
						actions: {delete: false, create: false},
						entityRole: {
							root: {
								itemName: 'MaterialCatalog',
								moduleName: 'cloud.desktop.moduleDisplayNameMaterialCatalog'
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				serviceContainer.data.showHeaderAfterSelectionChanged = null;
				service = serviceContainer.service;

				/* service.updateReadOnly = function updateReadOnly(entity) {
					var fields = [];
					for (var prop in entity) {
						if (!entity.hasOwnProperty(prop)) {
							continue;
						}

						if (prop !== 'IsChecked') {
							fields.push({field: prop, readonly: true});
						}
					}
					runtimeDataService.readonly(entity, fields);
				}; */

				/* service.cacheData = function (itemList) {
				 angular.forEach(itemList, function (item) {
				 item.IsChecked = true;
				 });
				 serviceContainer.data.sortByColumn(itemList);
				 service.setList(itemList);
				 service.goToFirst();
				 }; */

				serviceContainer.data.doUpdate = function () {
					return $q.when();
				};

				var fireCheckedChanged = function fireCheckedChanged(entity, newValue) {
					var options = {
						Id: entity.Id,
						value: newValue
					};
					service.materialCatalogCheckChanged.fire(options);
				};

				/* serviceContainer.data.doSelect = function doSelect(entity, data) {
				 if (data.selectedItem && entity.Id === data.selectedItem.Id) {
				 return;//Early out, nothing really changes..
				 }
				 data.selectedItem = entity;
				 data.selectionChanged.fire(null, entity);
				 }; */

				service.isCheckedValueChange = function (entity, newValue) {
					var currentItem = service.getSelected();
					if (currentItem && currentItem.Id !== entity.Id) {
						service.setSelected(entity).then(function () {
							fireCheckedChanged(entity, newValue);
						});
					} else {
						fireCheckedChanged(entity, newValue);
					}

					return true;
				};


				service.materialCatalogCheckChanged = new PlatformMessenger();
				service.materialCatalogCheckAllChanged = new PlatformMessenger();
				service.materialCatalogChecksChanged = new PlatformMessenger();

				service.refreshCatalogs = function(items) {
					var data = serviceContainer.data;

					// clear current data
					data.doClearModifications(null, data);
					data.selectedItem = null;
					data.itemList.length = 0;
					_.forEach(items, function (item) {
						data.itemList.push(item);
					});

					serviceContainer.data.listLoaded.fire();
				};

				service.getAllCheckedId=function(){
					var catalogIds=[];
					var itemList = service.getList();
					_.forEach(itemList, function (item) {
						if(item.IsChecked){
							catalogIds.push(item.Id);
						}
					});
					return catalogIds;
				};

				service.setItemsChecked = function (catalogIds) {
					var itemList = service.getList();
					angular.forEach(itemList, function (item) {
						item.IsChecked = false;
					});

					angular.forEach(catalogIds, function (catalogId) {
						var item = service.getItemById(catalogId);
						if (item) {
							item.IsChecked = true;
						}
					});

					itemList = _.sortBy(itemList, function (item) {
						return !item.IsChecked;
					});

					let selected = service.getSelected();
					service.refreshCatalogs(itemList);

					if (selected) {
						service.setSelected(selected);
					} else {
						service.goToFirst();
					}

					service.materialCatalogChecksChanged.fire();
				};

				service.onMaterialGroupCheckChanged = function (options) {
					var item = service.getItemById(options.catalogId);
					item.IsChecked = options.isAllGroupChecked;
					service.gridRefresh();
				};

				service.checkAllItems = function checkAllItems(checked) {
					angular.forEach(service.getList(), function (item) {
						item.IsChecked = checked;
					});

					service.materialCatalogCheckAllChanged.fire(checked);

					service.gridRefresh();
				};

				service.isReadonlyCatalog = function isReadonlyCatalog(catalog, id) {
					var isReadonly = true;
					var usedCatalog;
					if (catalog && catalog.Id) {
						usedCatalog = catalog;
					}
					else if (id) {
						var list = service.getList();
						usedCatalog = list ? _.find(list, {Id: id}) : undefined;
					}
					else {
						usedCatalog = service.getSelected();
					}
					if (usedCatalog && usedCatalog.Id) {
						var type = _.find(service.catalogTypes, {Id: usedCatalog.MaterialCatalogTypeFk});
						isReadonly = (usedCatalog.ConHeaderFk && type&& type.Isframework);
					}
					return isReadonly;
				};

				service.catalogTypes = [];
				service.getCatalogTypes = function getCatalogTypes() {
					var catalogTypeOptions = {
						displayMember: 'Description',
						valueMember: 'Id',
						lookupModuleQualifier: 'basics.materialcatalog.type',
						lookupType: 'basics.materialcatalog.type',
						filter: { customBoolProperty: 'ISFRAMEWORK' }
					};
					return basicsLookupdataSimpleLookupService.refreshCachedData(catalogTypeOptions).then(function (res) {
						var promise;
						if (res && res.length) {
							service.catalogTypes = res;
						}
						else if (res === false) {
							promise = basicsLookupdataSimpleLookupService.getList(catalogTypeOptions);
						}
						if (promise) {
							promise.then(function (res2) {
								service.catalogTypes = res2;
							});
						}
					});
				};

				return service;
			}]);
})(angular);