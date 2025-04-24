(function (angular) {
	'use strict';
	/* global globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialMaterialGroupsService',
		['platformDataServiceFactory', 'basicsMaterialMaterialCatalogService',
			'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessArraysExtension', '$q', '$http', '_', 'PlatformMessenger','basicsCommonHeaderColumnCheckboxControllerService',
			function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService,
				ServiceDataProcessArraysExtension, $q, $http, _, PlatformMessenger,basicsCommonHeaderColumnCheckboxControllerService) {
				var allGroupIds,
					checkedGroupIds = [],
					allParentItems = [],
					allChildItems = [],
					baseRoute = globals.webApiBaseUrl + 'basics/materialcatalog/group/',
					self = this;
				var serviceContainer = null;
				var service = null;
				let initingController = false;

				self.cacheItemTree = [];
				self.cacheItemList = [];

				var serviceOption = {
					hierarchicalLeafItem: {
						module: angular.module(moduleName),
						httpRead: {route: baseRoute},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems'])],
						presenter: {
							tree: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData);
									var dataRead = serviceContainer.data.handleReadSucceeded(service.fixIsChecked(readData), data);
									service.goToFirst();
									return dataRead;
								},
								parentProp: 'MaterialGroupFk', childProp: 'ChildItems'
							}
						},
						modification: {multi: false},
						actions: {delete: false, create: false},
						entityRole: {
							leaf: {
								itemName: 'MaterialMaterialGroup',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				// fix defect #75670,
				// if child group has been used in material,the parent should be mark to all select or half select
				service.fixIsChecked = function(items) {
					items.forEach(doItemCheck);
					return items;
				};

				var getCheckedGroupIds = function (isAdd, index, groupItem) {
					if (isAdd === true && index === -1) {
						checkedGroupIds.push(groupItem.Id);
					}
					else if (isAdd === false) {
						if (index !== -1) {
							checkedGroupIds.splice(index, 1);
						}
					}
				};

				// get Checked last state
				var getLastCheckedState = function (groupDataSource) {
					var storeStateList = {}, len = groupDataSource.length;

					if (len === 0) {
						return false;
					}
					for (var i = len - 1; i >= 0; i--) {
						var checked = groupDataSource[i].IsChecked;
						storeStateList[checked] = storeStateList[checked] ? storeStateList[checked] + 1 : 1;
					}

					if (storeStateList['true'] && storeStateList['true'] === len) {
						return true;
					}
					else if (storeStateList['false'] && storeStateList['false'] === len) {
						return false;
					}
					return true;
				};

				var getAllChildItems = function (groupItem) {
					if (groupItem) {
						allChildItems = allChildItems.concat(groupItem);
						_.forEach(groupItem, function (item) {
							if (item.ChildItems !== null) {
								getAllChildItems(item.ChildItems);
							}
						});
					}
				};

				function doItemCheck(item) {
					if (item.ChildItems && item.ChildItems.length) {
						var checkedItems = [], unCheckedItems = [];

						item.ChildItems.forEach(function (item) {
							var isChecked = doItemCheck(item);

							if (isChecked === true) {
								checkedItems.push(item);
							}
							else if (isChecked !== 'unknown') {
								unCheckedItems.push(item);
							}
						});

						if (checkedItems.length === item.ChildItems.length) {
							item.IsChecked = true;
						}
						else if (unCheckedItems.length === item.ChildItems.length) {
							if (item.IsChecked === true) {
								item.IsChecked = 'unknown';
							}
							else {
								item.IsChecked = false;
							}
						}
						else {
							item.IsChecked = 'unknown';
						}
					}
					return item.IsChecked;
				}

				/*service.cacheTreeData = function (treeData, groupIds) {
				 self.cacheItemTree = treeData;
				 service.tempGroupIds = angular.copy(groupIds);
				 checkedGroupIds = groupIds;
				 allGroupIds = angular.copy(groupIds);
				 unCheckGroupIds = [];
				 };*/

				serviceContainer.data.doReadData = function doReadData(data) {
					var asynCallGetDataFn  = null;
					var result;
					let defer = $q.defer();
					if (data.currentParentItem.Id && (!self.cacheItemTree || self.cacheItemTree.length <= 0)) {
						return service.loadByMainItemId();
					}
					if (data.currentParentItem.Id && self.cacheItemTree.length > 0) {
						var treeData = _.filter(self.cacheItemTree, function (item) {
							return item.MaterialCatalogFk === data.currentParentItem.Id;
						});
						if (treeData) {
							asynCallGetDataFn = function () {
								return data.onReadSucceeded(treeData, data);
							};
						}
					}
					if (initingController) {
						setTimeout(function () {
							result = _.isFunction(asynCallGetDataFn) ? asynCallGetDataFn() : [];
							defer.resolve(result);
						}, 100);
					}
					else {
						result = _.isFunction(asynCallGetDataFn) ? asynCallGetDataFn() : [];
						defer.resolve(result);
					}
					return defer.promise;
				};

				self.init = function init() {
					checkedGroupIds = [];
					allParentItems = [];
					allChildItems = [];
					service.tempGroupIds = [];
				};

				// do not call parent service clear method to avoid two times update
				service.clearData = function clearData(){
					self.init();
					self.cacheItemTree.length = 0;
					self.cacheItemList.length = 0;
				};

				service.clear = function clear() {
					parentService.clear();
					service.clearData();
				};



				service.tempGroupIds = [];
				var serviceData = serviceContainer.data;

				var noticeMaterialRecordChange = function () {
					var tempGroupIds = service.tempGroupIds;
					if (!_.isEqual(checkedGroupIds, tempGroupIds)) {
						service.cacheItemList = self.cacheItemList;
						service.materialGroupIdsCheckChanged.fire(checkedGroupIds);
					}
				};

				service.setItemsChecked = function (catalogIds, groupIds) {
					service.tempGroupIds = angular.copy(groupIds);
					checkedGroupIds = groupIds;

					angular.forEach(self.cacheItemList, function (item) {
						item.IsChecked = false;
					});

					angular.forEach(groupIds, function (groupId) {
						var item = _.find(self.cacheItemList, {Id: groupId});
						if (item) {
							item.IsChecked = true;
						}
					});

					parentService.setItemsChecked(catalogIds);
				};

				//depend on group id change the group container checked state
				service.changeCheckedByCatalog = function (options) {
					var itemList =   _.filter(self.cacheItemList, function (item) {
						return item.MaterialCatalogFk === options.Id;
					});
					if (options !== null) {
						angular.forEach(itemList, function (item) {
							if (item.MaterialCatalogFk === options.Id) {
								var index = checkedGroupIds.indexOf(item.Id);
								if (options.value === true && index === -1) {
									checkedGroupIds.push(item.Id);
									item.IsChecked = true;
								}
								else if (options.value === false) {
									if (index !== -1) {
										checkedGroupIds.splice(index, 1);
									}
									item.IsChecked = false;
								}
							}
						});
					} else {
						checkedGroupIds = [];
						angular.forEach(itemList, function (item) {
							item.IsChecked = false;
						});
					}

					noticeMaterialRecordChange();
				};


				service.onItemCheckedChange = function (selectItem, newValue) {
					allChildItems = [];
					selectItem.IsChecked = newValue;
					getAllChildItems(selectItem.ChildItems);

					//if the parent checked,the all child should be changed
					_.forEach(allChildItems, function (item) {
						item.IsChecked = newValue;
					});

					// todo-wui: delete later, replace following logic with service.fixIsChecked(serviceData.itemTree);
					//if the child be cancel,the parent should be change
					//allParentItems = [];

					//if (selectItem.MaterialGroupFk !== null) {
					//	var firstParent = _.find(serviceData.itemList, {Id: selectItem.MaterialGroupFk});
					//	allParentItems = allParentItems.concat(firstParent);
					//	getAllParentItems(firstParent);
					//}
					//_.forEach(allParentItems, function (item) {
					//	allChildItems = [];
					//	getAllChildItems(item.ChildItems);
					//	item.IsChecked = getLastCheckedState(allChildItems);
					//});

					// fix defect #75670,
					// if child group has been used in material,the parent should be mark to all select or half select
					service.fixIsChecked(serviceData.itemTree);

					var nowDataSource = serviceData.itemList;
					if (nowDataSource !== null && nowDataSource.length > 0) {
						if (nowDataSource[0].MaterialCatalogFk === selectItem.MaterialCatalogFk) {
							var groupDataSource = _.filter(nowDataSource, {MaterialCatalogFk: selectItem.MaterialCatalogFk});
							var catalogState = getLastCheckedState(groupDataSource);
							var options = {
								catalogId: selectItem.MaterialCatalogFk,
								isAllGroupChecked: catalogState
							};
							parentService.onMaterialGroupCheckChanged(options);
						}
					}

					_.forEach(nowDataSource, function (groupItem) {
						var index = checkedGroupIds.indexOf(groupItem.Id),
							isAdd = groupItem.IsChecked;
						getCheckedGroupIds(isAdd, index, groupItem);
					});

					noticeMaterialRecordChange();

					service.gridRefresh();
				};

				// if the material group checked  has changed,then the material catalog checked state should be changed
				service.isCheckedValueChange = function (selectItem, newValue) {
					service.onItemCheckedChange(selectItem, newValue, true);
					return {apply: false, valid: true, error: ''};
				};



				var getAllParentItems = function (childItem) {
					if (childItem.MaterialGroupFk) {
						var parentItem = _.find(serviceData.itemList, {Id: childItem.MaterialGroupFk});
						if (parentItem) {
							allParentItems = allParentItems.concat(parentItem);
							getAllParentItems(parentItem);
						}
					}
				};

				service.materialGroupIdsCheckChanged = new PlatformMessenger();

				var onMaterialCatalogCheckChanged = function (options) {
					service.changeCheckedByCatalog(options);
					var gridGuid = '29bcf2f0bd994b0d9cdb941c2f4fbfcd';// todo: scope gridid
					var checkboxFields = 'IsChecked';
					basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox(gridGuid, checkboxFields);
					service.gridRefresh();
				};

				self.setMaterialGroupsCheckStatus = function (checked) {
					service.cacheItemList = self.cacheItemList;
					service.materialGroupIdsCheckChanged.fire(checkedGroupIds);
					angular.forEach(self.cacheItemList, function (item) {
						item.IsChecked = checked;
					});
					service.gridRefresh();
				};

				var onMaterialCatalogCheckAllChanged = function (checked) {
					if (checked) {
						checkedGroupIds = angular.copy(allGroupIds);
					} else {
						self.init();
					}
					self.setMaterialGroupsCheckStatus(checked);
					var gridGuid = '29bcf2f0bd994b0d9cdb941c2f4fbfcd';// todo: scope gridid
					var checkboxFields = 'IsChecked';
					basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox(gridGuid, checkboxFields);
					service.gridRefresh();
				};

				parentService.materialCatalogCheckChanged.register(onMaterialCatalogCheckChanged);
				parentService.materialCatalogCheckAllChanged.register(onMaterialCatalogCheckAllChanged);

				// return an promise for 'goto' button in material catalog module use
				service.load = function loadTree() {
					return $http.get(globals.webApiBaseUrl + 'basics/materialcatalog/group/wholetree').then(function (response) {
						self.cacheItemTree = response.data;
						self.cacheItemList.length = 0;
						serviceData.flatten(self.cacheItemTree, self.cacheItemList, serviceData.treePresOpt.childProp);
						allGroupIds = _.map(self.cacheItemList, 'Id');
					});
				};

				service.loadByMainItemId = function () {
					return $http.get(globals.webApiBaseUrl + 'basics/materialcatalog/group/tree?mainItemId=' + serviceData.currentParentItem.Id).then(function (response) {
						var selectedItems = _.filter(self.cacheItemList, {IsChecked: true});
						self.cacheItemTree = _.filter(self.cacheItemTree, function (item) {
							return item.MaterialCatalogFk !== serviceData.currentParentItem.Id;
						});
						_.forEach(response.data.Main, function(value){
							self.cacheItemTree.push(value);
						});
						self.cacheItemList.length = 0;
						serviceData.flatten(self.cacheItemTree, self.cacheItemList, serviceData.treePresOpt.childProp);
						_.forEach(selectedItems, function(value){
							var found = _.find(self.cacheItemList, {Id: value.Id, MaterialCatalogFk: serviceData.currentParentItem.Id});
							if (found) {
								var index = checkedGroupIds.indexOf(found.Id);
								if (index !== -1) {
									service.tempGroupIds.splice(index, 1);
								}
								_.extend(found, value);
								service.onItemCheckedChange(found, true, true);
							}
						});
						allGroupIds = _.map(self.cacheItemList, 'Id');
						serviceData.loadSubItemList.apply(this, arguments);
					});
				};

				service.checkAllItem = function checkAllItem(checked) {
				    var options = {
				        catalogId: service.getSelected().MaterialCatalogFk,
				        isAllGroupChecked: checked
				    };
				    parentService.onMaterialGroupCheckChanged(options);

					onMaterialCatalogCheckChanged({
						Id: options.catalogId,
						value: checked
					});
				    service.gridRefresh();
				};

				service.updateMaterialGroup=function(){
					service.load().then(function(){
						serviceData.loadSubItemList.apply(this, arguments);
						service.gridRefresh();
					});
				};


				service.updateMaterialGroupByImport=function(groups){
                	var catalogSelected=parentService.getSelected();
                	var currentGroupIds=[];
					serviceData.flatten(groups, currentGroupIds, serviceData.treePresOpt.childProp);
					var groupMap = _.keyBy(currentGroupIds, 'Id');
					_.forEach(groups, function(group){
						var existGroup=_.find(self.cacheItemTree,function(item){return item.Id===group.Id;});
						if(!existGroup){
                        	self.cacheItemTree.push(group);
						}
						else{
							existGroup=_.mergeWith(existGroup, group, function (objValue, srcValue) {
								if (_.isArray(objValue) && (_.some(objValue, 'ChildItems') || _.some(srcValue, 'ChildItems'))) {
									var org = _.keyBy(objValue, 'Id');
									var src = _.keyBy(srcValue, 'Id');
									return _.values(_.merge(org, src));
								}
							});
						}
					});
					serviceData.flatten(self.cacheItemTree, self.cacheItemList, serviceData.treePresOpt.childProp);
					allGroupIds = _.map(self.cacheItemList, 'Id');
					if(catalogSelected.Id===groups[0].MaterialCatalogFk){
						_.forEach(self.cacheItemList,function(item){
							if(groupMap[item.Id]){
								item.IsChecked=catalogSelected.IsChecked;
							}
						});
					}
					serviceData.loadSubItemList.apply(this, arguments);
				};

				service.setInitControllerStatus = function (status) {
					initingController = !!status;
				};

				return service;
			}]);
})(angular);