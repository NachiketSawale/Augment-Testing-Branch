/**
 * Created by lcn on 5/22/2019.
 */
(function () {
	'use strict';
	/* global _ */
	var moduleName = 'controlling.structure';
	var getControllingGrpSetFk = function getControllingGrpSetFk(entity) {
		var controllinggrpSetFk = _.isUndefined(entity.ControllinggrpsetFk) ? entity.ControllingGroupSetFk : entity.ControllinggrpsetFk;
		return (controllinggrpSetFk !== null ? controllinggrpSetFk : -1);
	};

	angular.module(moduleName).factory('controllingStructureGrpSetDTLDataService',['_', 'globals', 'platformDataServiceFactory','platformRuntimeDataService', 'platformDataServiceEntityReadonlyProcessor','PlatformMessenger',
		function (_, globals, platformDataServiceFactory,platformRuntimeDataService, platformDataServiceEntityReadonlyProcessor,PlatformMessenger) {
		// create a new data service object
			function constructor(parentService, isReadOnly) {
				var serviceContainer,serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'controllingStructureGrpSetDTLDataService',
						entityNameTranslationID: 'controlling.structure.grpsetdltGridTitle',
						actions: isReadOnly?{delete: false, create: false}:undefined,
						dataProcessor: isReadOnly?[{processItem: processItem},platformDataServiceEntityReadonlyProcessor]:[{processItem: processItem}],
						httpRead: {
							route: globals.webApiBaseUrl + 'controlling/structure/grpsetdtl/',
							endRead: 'list',
							initReadData: function (readData) {
								var selectedParent = parentService.getSelected();
								readData.filter = '?mainItemId=' + getControllingGrpSetFk(selectedParent);
							}
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'controlling/structure/grpsetdtl/',endCreate: 'create'
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var parent = parentService.getSelected();
									creationData.mainItemId = getControllingGrpSetFk(parent);
									creationData.headerFk = parent.Id;
								},
								incorporateDataRead: function (itemList,data) {
									var parent = parentService.getSelected();
									if (parent) {
										angular.forEach(itemList,function (item) {
											item.headerFk = parent.Id;
											let columns = Object.keys(item);
											_.forEach(columns, (column) => {
												if(parent.BasItemTypeFk=== 7){
													platformRuntimeDataService.readonly(item, [{field: column, readonly: true}]);
												}else{
													platformRuntimeDataService.readonly(item, [{field: column, readonly: false}]);
												}
											});

										});
									}
									return serviceContainer.data.handleReadSucceeded(itemList,data);
								},
							}
						},
						entityRole: {
							leaf: {
								itemName: 'controllingStructureGrpSetDTL',parentService: parentService
							}
						}
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;
				
				service.roadData = function roadData(parentItem, items) {
					if (!items || !parentItem || !angular.isFunction(data.storeCacheFor)) {
						return;
					}

					_.forEach(items, function (newItem) {
						newItem.headerFk = parentItem.Id;

						// Check if item already exists by unique keys
						const exists = _.some(data.itemList, function (oldItem) {
							return oldItem.ControllinggroupFk === newItem.ControllinggroupFk &&
								oldItem.ControllinggrpsetFk === newItem.ControllinggrpsetFk
						});

						// Only add and mark if it doesn't exist
						if (!exists) {
							data.itemList.push(newItem);
							data.markItemAsModified(newItem, data);
						}
					});

					// Cache the updated data for the parent item
					data.storeCacheFor(parentItem, data);
				};

				service.canItemTypeEdit = function () {
					var parentItem =  parentService.getSelected();
					if (parentItem) {
						let itemTypeFk = parentItem.BasItemTypeFk;
						if (itemTypeFk === 7) {
							return false;
						} else {
							return true;
						}
					}
					return false;
				};

				service.IsReadOnly = function IsReadOnly() {
					return isReadOnly;
				};

				var canCreate = service.canCreate;
				service.canCreate = function () {
					var _canCreate = canCreate();
					var _canItemTypeEdit = service.canItemTypeEdit();
					if (_.isFunction(parentService.PisReadonly)) {
						var _isReadonly = parentService.PisReadonly();
						return !_isReadonly && _canCreate && _canItemTypeEdit;
					} else if (_.isFunction(parentService.canCreate)) {
						var _pcanCreate = parentService.canCreate();
						return _pcanCreate && _canCreate && _canItemTypeEdit;
					}
					return _canCreate && _canItemTypeEdit;
				};

				var canDelete = service.canDelete;
				service.canDelete = function () {
					var _canDelete = canDelete();
					var _canItemTypeEdit = service.canItemTypeEdit();
					if (_.isFunction(parentService.PisReadonly)) {
						var _isReadonly = parentService.PisReadonly();
						return !_isReadonly && _canDelete && _canItemTypeEdit;
					} else if (_.isFunction(parentService.canDelete)) {
						var _pcanDelete = parentService.canDelete();
						return _pcanDelete && _canDelete && _canItemTypeEdit;
					}
					return _canDelete && _canItemTypeEdit;
				};

				function processItem(item) {
					if (item) {
						let flag = false;
						if (_.isFunction(parentService.PisReadonly)) {
							flag = parentService.PisReadonly();
						} else if (_.isFunction(parentService.canCreate)) {
							flag = !parentService.canCreate();
						}
						 let columns = Object.keys(item);
						_.forEach(columns, (column) => {
							if(parentService.getSelected().BasItemTypeFk=== 7||flag){
								platformRuntimeDataService.readonly(item, [{field: column, readonly: true}]);
							}else{
								platformRuntimeDataService.readonly(item, [{field: column, readonly: false}]);
							}
						});
					}
				}

				service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
					let columns = Object.keys(entity);
					_.forEach(columns, (item) => {
						if(itemTypeFk=== 7){
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);}
						else{
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
						}
					});
				};

				function setColumnReadOnly(item,column,flag) {
					var fields = [{field: column,readonly: flag}];
					platformRuntimeDataService.readonly(item,fields);
				}

				service.updateToolsEvent = new PlatformMessenger();
				return service;
			}

			var serviceCache = {};
			var getService = function getService(parentService,modName) {
				if (!_.has(serviceCache, modName)) {
					serviceCache[modName] = constructor.apply(this,[arguments[0],arguments[2]]);
				}
				return serviceCache[modName];
			};

			return {
				createService: getService
			};
		}]);

	angular.module(moduleName).factory('controllingStructureGrpSetDTLActionProcessor',[
		function () {
			var service = {};
			service.processItem = function processItem(entity) {
				if (entity) {
					entity.image = getControllingGrpSetFk(entity) === -1 ? 'status-icons ico-status03' : 'status-icons ico-status02';
				}
			};

			service.select = function (entity) {
				if (entity) {
					return getControllingGrpSetFk(entity) === -1 ? 'status-icons ico-status03' : 'status-icons ico-status02';
				}
			};

			service.isCss = function () {
				return true;
			};

			return service;
		}]);

})();
