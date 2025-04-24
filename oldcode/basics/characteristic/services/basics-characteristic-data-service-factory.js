/**
 * Created by reimer on 02.03.2015.
 */
(function () {

	'use strict';
	var moduleName = 'basics.characteristic';
	var characteristicModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicDataServiceFactory
	 * @function
	 *
	 * @description
	 * service factory for all module specific characteristic data services
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	characteristicModule.factory('basicsCharacteristicDataServiceFactory', [
		'$http','$q','_','$injector', '$log', 'PlatformMessenger',
		'platformDataServiceFactory',
		'platformRuntimeDataService',
		'basicsCharacteristicTypeHelperService',
		'basicsLookupdataLookupFilterService', 'platformDataServiceModificationTrackingExtension',
		'cloudCommonGridService', 'basicsCharacteristicPopupGroupService',
		'basicsCharacteristicCodeLookupService',
		'platformPermissionService',
		'platformDataServiceDataProcessorExtension',
		'basicsCharacteristicDataGroupServiceFactory',
		function ($http, $q,_, $injector, $log, PlatformMessenger,
				  platformDataServiceFactory,
				  platformRuntimeDataService,
				  basicsCharacteristicTypeHelperService,
				  basicsLookupdataLookupFilterService, platformDataServiceModificationTrackingExtension,
				  cloudCommonGridService, basicsCharacteristicPopupGroupService,
				  basicsCharacteristicCodeLookupService,
				  platformPermissionService,
				  platformDataServiceDataProcessorExtension,
				  basicsCharacteristicDataGroupServiceFactory
				  )
		{

			var serviceCache = [];

			function createNewComplete(parentService, sectionId, parentField, pKey1Field, pKey2Field, pKey3Field) {

				var serviceContainer = {};
				// get assigned default values for the new main entity
				var _defaultList = null;
				var serviceFactoryOptions = {
					flatLeafItem: {
						module: characteristicModule,
						// dataProcessor: [{ processItem: processItem }],  --> see httpRead
						// httpCRUD: {route: globals.webApiBaseUrl + 'basics/characteristic/data/', initReadData: initReadData},
						httpCreate: {route: globals.webApiBaseUrl + 'basics/characteristic/data/', endRead: 'create'},
						// httpUpdate: {route: globals.webApiBaseUrl + 'basics/characteristic/data/', endRead: 'update'},
						// httpDelete: {route: globals.webApiBaseUrl + 'basics/characteristic/data/', endRead: 'delete'},
						httpRead: {    // set different endPoint for new parent items!
							useLocalResource: true,
							resourceFunction: function (p1, p2, onReadSucceeded) {

								var parentEntity = parentService.getSelected() || {};
								var endPoint;
								if ((parentEntity.Version && parentEntity.Version > 0)) {
									endPoint = 'list';
								} else{
									// will now be handled "onEntityCreated" event!
									// endPoint = 'defaultlist';
									return _defaultList || []; // --> need to load default list again!
								}

								var parentId = serviceContainer.service.getMainItemIdOfItem(parentEntity);
								parentId = _.isNil(parentId) ? -1 : parentId;
								const pKeysQuery = serviceContainer.service.combinePKeysToQueryString(parentEntity);

								return $http.get(globals.webApiBaseUrl + 'basics/characteristic/data/' + endPoint + '?sectionId=' + sectionId + '&mainItemId=' + parentId + pKeysQuery).then(function (response) {
									angular.forEach(response.data, function (item) {
										processItem(item);
									});
									if (endPoint === 'list') {
										onReadSucceeded(response.data, serviceContainer.data);
										// serviceContainer.data.doClearModifications(null, serviceContainer.data);
									}
									else {
										serviceContainer.service.setList(response.data);    // sets modified flag!
									}
								});

							}

						},

						actions: {delete: true, create: 'flat', canDeleteCallBackFunc: setCanDelete, canCreateCallBackFunc: setCanCreateOrDelete},
						entityRole: {
							leaf:
								{
									itemName: 'CharacteristicData',
									parentService: parentService,
									filterParent: function(data) {
										let parentFieldFk;
										data.currentParentItem = data.parentService.getSelected();
										if (data.currentParentItem) {
											parentFieldFk = serviceContainer.service.getMainItemIdOfItem(data.currentParentItem);
										}
										return parentFieldFk;
									}
								}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var selected = parentService.getSelectedEntities();
									if(selected.length > 0){
										selected = selected[selected.length -1];
									}else{
										throw new Error('Please first select a parent entity!');
									}
									creationData.mainItemId = serviceContainer.service.getMainItemIdOfItem(selected);
									creationData = serviceContainer.service.combinePKeysToObject(selected, creationData);

									if (creationData.mainItemId === null || creationData.mainItemId === undefined) {
										throw new Error('Please first select a parent entity!');
									}
									creationData.sectionId = sectionId;
								},
								incorporateDataRead: function (itemList, data) {
									if (isUpdateCharOnListLoaded()){
										serviceContainer.service.registerListLoaded(serviceContainer.service.syncUpdateCharacteristic);
									}

									if(setReadonlyor() === false){
										var sn = parentService.getServiceName();
										if(parentService.setDataReadOnly){
											parentService.setDataReadOnly(itemList);
										}
									}

									return serviceContainer.data.handleReadSucceeded(itemList, data);
								}
							}
						},
						useItemFilter: true
						// translation:{uid: 'basicsUserformMainService', title: 'Translation', colHeader: ['Description'], descriptors: ['DescriptionInfo']}
					}
				};
				function setCanCreateOrDelete() {
					// Data Service must have the canCreateOrDelete function or parent selected IsReadonlyStatus flag
					var canCreateOrDelete = true;
					var parentSelectItem = parentService.getSelected();
					var parentServiceHasCanCreateOrDeleteFn = getParentServiceHasTheFn(parentService, 'canCreateOrDelete');
					var caseSwitch = 0;

					if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
						caseSwitch = 1;
					}
					if (parentServiceHasCanCreateOrDeleteFn !== null) {
						caseSwitch = 2;
					}
					if (parentField !== undefined) {
						caseSwitch = 3;
					}

					switch (caseSwitch) {
						case 1:
							canCreateOrDelete = false;
							break;
						case 2:
							canCreateOrDelete = parentServiceHasCanCreateOrDeleteFn.canCreateOrDelete();
							break;
						case 3:
							canCreateOrDelete = parentSelectItem && parentSelectItem[parentField] !== null;
							break;
					}

					return canCreateOrDelete;
				}

				function setCanDelete() {
					var canDelete = setCanCreateOrDelete();
					if(!canDelete){
						return canDelete;
					}
					// only can delete when group has no companies assignment or assign to current company.
					var groupSelected = basicsCharacteristicDataGroupServiceFactory.getService(sectionId, parentService).getSelected();
					var groups = [];
					cloudCommonGridService.flatten([groupSelected], groups, 'Groups');
					var char = serviceContainer.service.getSelected();
					if(char){
						var group = _.find(groups, function (item) { return item.Id === char.CharacteristicGroupFk; });
						if(group && group.CharacteristicGroup2Companys && group.CharacteristicGroup2Companys.length > 0){
							var group2Company = _.find(group.CharacteristicGroup2Companys, function (item) {
								return item.CompanyFk === $injector.get('platformContextService').clientId; });
							if(!group2Company){
								canDelete = false;
							}
						}
					}else if(!char){
						canDelete = false;
					}

					return canDelete;
				}

				function setEntityToReadonlyIfRootEntityIs(entity) {
					var parentSelectItem = parentService.getSelected();
					var parentServiceHasSetEntityToReadonlyIfRootEntityIsFn = getParentServiceHasTheFn(parentService, 'setEntityToReadonlyIfRootEntityIs');

					var caseSwitch = 0;

					if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
						caseSwitch = 1;
					}
					if (parentServiceHasSetEntityToReadonlyIfRootEntityIsFn !== null) {
						caseSwitch = 2;
					}

					switch (caseSwitch){
						case 1:
							platformRuntimeDataService.readonly(entity, true);
							break;
						case 2:
							parentServiceHasSetEntityToReadonlyIfRootEntityIsFn.setEntityToReadonlyIfRootEntityIs(entity);
							break;
					}
				}

				function getParentServiceHasTheFn(dataService, fnName) {
					let parentSrvHasTheFn = null;
					let currentDataSrv = dataService;

					if (hasTheFn((currentDataSrv))) {
						parentSrvHasTheFn = currentDataSrv;
					}

					while (hasParentService(currentDataSrv)) {
						currentDataSrv = currentDataSrv.parentService();
						if (hasTheFn((currentDataSrv))) {
							parentSrvHasTheFn = currentDataSrv;
						}
					}

					return parentSrvHasTheFn;

					function hasParentService(dataService) {
						return typeof dataService.parentService === 'function' && dataService.parentService() !== null;
					}

					function hasTheFn(dataService) {
						return typeof dataService[fnName] === 'function';
					}
				}

				function processItem(item){

					var fields = [
						{ field: 'ValueText', readonly: item.IsReadonly },       // prevent changing data after valid to date
						{ field: 'CharacteristicFk', readonly: item.Version > 0} // prevent changing of characteristic
					];
					platformRuntimeDataService.readonly(item, fields);

					// todo: remove when lookup supports string comparing
					if (basicsCharacteristicTypeHelperService.isLookupType(item.CharacteristicTypeFk)) {
						item.ValueText = Number(item.ValueText);
					}
					setEntityToReadonlyIfRootEntityIs(item);
				}

				// function initReadData(readData) {
				//	var select = parentService.getSelected() || {};
				//	readData.filter = '?sectionId=' + sectionId + '&mainItemId=' + (serviceContainer.service.getMainItemIdOfItem(select) || -1);
				//	return readData;
				// }

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

				// fixed issue #DEV-1067
				serviceContainer.data.doNotLoadOnSelectionChange = true;

				serviceContainer.service.setContainerUUID = setContainerUUID;

				serviceContainer.service.updateDone = new Platform.Messenger();

				serviceContainer.service.getFilter = function getFilter(){
					return serviceContainer.data.filter;
				};

				serviceContainer.service.setFilter = function setFilter(filter){
					// return serviceContainer.data.filter = filter;
				};

				serviceContainer.service.setUpdateCharOnListLoaded = function setUpdateCharOnListLoaded(updateColumn, item){
					serviceContainer.data.charColumnToUdpate = updateColumn;
					serviceContainer.data.charItem = item;
				};

				function getUpdateCharOnListLoaded(){
					return {
						charColumnToUdpate: serviceContainer.data.charColumnToUdpate,
						charItem: serviceContainer.data.charItem
					};
				}

				function isUpdateCharOnListLoaded(){
					var charDataToSync = getUpdateCharOnListLoaded();
					return charDataToSync && !_.isEmpty(charDataToSync.charItem);
				}

				serviceContainer.service.syncUpdateCharacteristic = function syncUpdateCharacteristic(updateColumn, item){
					if (isUpdateCharOnListLoaded()){
						var charDataToSync = getUpdateCharOnListLoaded();

						updateColumn = charDataToSync.charColumnToUdpate;
						item = charDataToSync.charItem;

						serviceContainer.service.setUpdateCharOnListLoaded(null, null);
						serviceContainer.service.unregisterListLoaded(serviceContainer.service.syncUpdateCharacteristic);
					}

					var items = serviceContainer.service.getUnfilteredList();
					var isHave = false;
					for (var i = 0; i < items.length; i++) {
						if(items[i].CharacteristicEntity !== null) {
							// var characteristicCode = _.findLast(items[i].CharacteristicEntity.Code) === '.' ? _.trimEnd(items[i].CharacteristicEntity.Code, '.') : items[i].CharacteristicEntity.Code;
							// var columnIdorField = characteristicCode.replace(/ /g,'');
							var characteristicCol = 'charactercolumn' + '_' /* + columnIdorField + '_' */ + items[i].CharacteristicGroupFk.toString() + '_' + items[i].CharacteristicTypeFk.toString() + '_' + items[i].CharacteristicFk.toString();
							if (characteristicCol === updateColumn && items[i].ObjectFk === item.Id) {
								items[i].ValueText = item[updateColumn];
								serviceContainer.service.markItemAsModified(items[i]);
								serviceContainer.service.SetColumnReadonly(updateColumn,false);
								isHave = true;
								break;
							}
						}
					}

					if (!isHave) {
						var colArray = _.split(updateColumn, '_');
						if (colArray !== null && colArray.length > 0) {
							var lastCol = colArray[_.lastIndexOf(colArray) - 1];
							serviceContainer.service.getItemByCharacteristicFk(lastCol).then(function (chaItem) {
								serviceContainer.service.createItem().then(function (newItem) {
									// DEV-1906 when user switch the row before save, the objectFk will change,
									// so need to reset it.
									newItem.ObjectFk = serviceContainer.service.getMainItemIdOfItem(item);
									newItem.pKey1 = serviceContainer.service.getPKey1OfItem(item);
									newItem.pKey2 = serviceContainer.service.getPKey2OfItem(item);
									newItem.pKey3 = serviceContainer.service.getPKey3OfItem(item);
									newItem.CharacteristicFk = chaItem.Id;
									newItem.CharacteristicTypeFk = chaItem.CharacteristicTypeFk;
									newItem.CharacteristicGroupFk = chaItem.CharacteristicGroupFk;
									newItem.CharacteristicEntity = chaItem;
									newItem.Description = chaItem.DescriptionInfo.Description;
									newItem.ValueText = item[updateColumn];
									serviceContainer.service.markItemAsModified(newItem);
									serviceContainer.service.SetColumnReadonly(updateColumn,false);
								});
							});
						}
					}
				};

				var onItemChanged = new PlatformMessenger(); // characteristic item is changed
				var onItemDelete = new PlatformMessenger(); // characteristic item is delete

				serviceContainer.service.registerItemValueUpdate = function registerItemValueUpdate(func) {
					onItemChanged.register(func);
				};

				serviceContainer.service.unregisterItemValueUpdate = function unregisterItemValueUpdate(func) {
					onItemChanged.unregister(func);
				};

				serviceContainer.service.fireItemValueUpdate = function(item){
					onItemChanged.fire(null, item);
				};

				serviceContainer.service.registerItemDelete = function registerItemDelete(func){
					onItemDelete.register(func);
				};

				serviceContainer.service.unregisterItemDelete = function unregisterItemDelete(func){
					onItemDelete.unregister(func);
				};

				serviceContainer.service.SetColumnReadonly = function SetColumnReadonly(field, readonly){
					var list = parentService.getList();
					var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					angular.forEach(list, function(entity){
						platformRuntimeDataService.readonly(entity, [{field: field, readonly: readonly}]);
					});
					parentService.gridRefresh();
				};

				var oldDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = onDeleteDoneItem;
				function onDeleteDoneItem(deleteParams, data, response){
					onItemDelete.fire(null, angular.copy(deleteParams.entities));
					oldDeleteDone(deleteParams, data, response);
				}

				// update characteristics
				var onUpdateRequested = function onUpdateRequested(updateData) {

					var containerId = serviceContainer.service.getSectionId();

					var deffered = $q.defer();
					if (updateData.EntitiesCount > 0){ // one module can have multiple characteristic containers!

						updateData.saveCharacteristicsOngoing = true;
						var completeDto = { EntitiesCount: updateData.EntitiesCount, CharacteristicDataToSave: [], CharacteristicDataToDelete: [], MainItemId: 0 };
						fillCompleteDto(updateData, completeDto);

						angular.forEach(completeDto.CharacteristicDataToSave, function (entity) {
							basicsCharacteristicTypeHelperService.dispatchValue(entity, entity.CharacteristicTypeFk);
						});

						completeDto.CharacteristicDataToSave = _.filter(completeDto.CharacteristicDataToSave, { CharacteristicSectionFk: containerId});
						completeDto.CharacteristicDataToDelete = _.filter(completeDto.CharacteristicDataToDelete, { CharacteristicSectionFk: containerId});

						if (!_.isEmpty(completeDto.CharacteristicDataToSave) || !_.isEmpty(completeDto.CharacteristicDataToDelete)){
							// Check permissions for auto-assignments
							var characteristicContainerId = getContainerUUID();
							var urlToUpdate = platformPermissionService.hasWrite(characteristicContainerId) ?
								'basics/characteristic/data/update':
								'basics/characteristic/data/saveForDefaults';

							$http.post(globals.webApiBaseUrl + urlToUpdate, completeDto)
								.then(function (response) {
									var data = response.data;

									var updatedItems = data.CharacteristicDataToSave;
									var oldItems = serviceContainer.data.itemList;
									angular.forEach(oldItems, function (item) {
										var updatedItem = _.find(updatedItems, {Id: item.Id});
										if (updatedItem) {
											var oldItem = _.find(oldItems, {Id: item.Id});
											serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldItem, updatedItem, true, serviceContainer.data);
										}
									});
									deffered.resolve(data);
									serviceContainer.service.updateDone.fire(data);
								})
								.finally(function(){
									delete updateData.saveCharacteristicsOngoing;
								});
						}else{
							deffered.resolve(null);
						}
					}
					else
					{
						deffered.resolve(null);
					}
					return deffered.promise;
				};

				var rootService = parentService;
				while(rootService.parentService() !== null) {
					rootService = rootService.parentService();
				}
				rootService.registerUpdateDataExtensionEvent(onUpdateRequested);

				// iterate thru complete dto and collect CharacteristicData values
				function fillCompleteDto(obj, dto)
				{
					for (var k in obj) // jshint ignore:line
					{
						if (k === 'CharacteristicDataToSave' || k === 'CharacteristicDataToDelete') {
							/* jshint -W083 */
							obj[k].map(function (item) {
								// noinspection JSReferencingMutableVariableFromClosure
								dto[k].push(item);
							}); // jshint ignore:line
							if (obj.hasOwnProperty('MainItemId')) {
								dto.MainItemId = obj.MainItemId;
							}
						}

						if (typeof obj[k] === 'object' && obj[k] !== null) {
							fillCompleteDto(obj[k], dto);
						}
						else	{
							// do noting...
							angular.noop();
						}
					}
				}

				var defaultListNotModified=null;


				var onEntityCreated = function onEntityCreated(dummy, newEntity) {

					var sectionId = serviceContainer.service.getSectionId();
					var mainItemId = newEntity.Id;

					basicsCharacteristicPopupGroupService.setSelected(null);

					if(angular.isFunction(parentService.getDefaultListForCreated))
					{
						parentService.getDefaultListForCreated(newEntity).then(function (_defaultList) {
							serviceContainer.service.markEntitiesAsModified(_defaultList);
						},function (error) {
							$log.warn('Error ' + error + ' while reading default characteristic list from the server!');
						});
					}
					// TODO: added new handler with section information to avoid side effects
					else if (angular.isFunction(parentService.getDefaultListForCreatedPerSection)) {
						parentService.getDefaultListForCreatedPerSection(newEntity, sectionId).then(function (newItems) {
							_.each(newItems, (newItem) => {
								$injector.get('platformDataServiceActionExtension').fireEntityCreated(serviceContainer.data, newItem);
							});
							serviceContainer.service.markEntitiesAsModified(newItems);
							if(_.isEmpty(_defaultList)){
								_defaultList = newItems;
							}
						}, function (error) {
							$log.warn('Error ' + error + ' while reading default characteristic list from the server!');
						});
					} else {
						basicsCharacteristicPopupGroupService.loadData(sectionId).then(function () {
							const pKeysQueryString = serviceContainer.service.combinePKeysToQueryString(newEntity);
							$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlist?sectionId=' + sectionId + '&mainItemId=' + mainItemId + pKeysQueryString).then(function (response) {
								_defaultList = response.data;
								// defaultListNotModified=response.data;

								var groups = [];
								var groupsIds = [];
								cloudCommonGridService.flatten(basicsCharacteristicPopupGroupService.getList(), groups, 'Groups');
								groupsIds  = _.map(groups, 'Id');

								_defaultList = _.filter(_defaultList, function(item){
									return groupsIds.indexOf(item.CharacteristicGroupFk) >= 0;
								});

								// assign list to container.
								serviceContainer.service.setList(_defaultList);
								serviceContainer.service.markEntitiesAsModified(_defaultList);
								// update dynamic columns
								_defaultList.forEach(function (item) {
									serviceContainer.service.fireItemValueUpdate(item);
								});

							}, function(error) {
								$log.warn('Error ' + error + ' while reading default characteristic list from the server!');
							});
						});
					}

				};
				serviceContainer.service.clear=function (entities) {
					serviceContainer.data.doClearModifications(entities, serviceContainer.data);
				};

				if (parentService.registerEntityCreated) {
					parentService.registerEntityCreated(onEntityCreated);
				}

				serviceContainer.service.registerParentsEntityCreated=function () {
					if (parentService.unregisterEntityCreated) {
						parentService.unregisterEntityCreated(onEntityCreated);
					}
				};
				serviceContainer.service.getDefaultList=function () {
					return defaultListNotModified;
				};
				serviceContainer.service.getSectionId = function() {
					return sectionId;
				};

				// serviceContainer.service.onEntityCreatedForPrcModule=onEntityCreatedForPrcModule;

				serviceContainer.service.getMainItemId = function() {
					var mainEntity = parentService.getSelected() || {};
					var mainItemId = serviceContainer.service.getMainItemIdOfItem(mainEntity);

					return _.isNil(mainItemId) ? -1 : mainItemId;
				};

				serviceContainer.service.getMainItemIdOfItem = function(item) {
					return _.isNil(parentField) ? item.Id : _.get(item, parentField) || -1;
				};

				serviceContainer.service.getPKey1OfItem = function (item) {
					return (_.isNil(pKey1Field) || _.isUndefined(_.get(item, pKey1Field))) ? null : _.get(item, pKey1Field);
				};

				serviceContainer.service.getPKey2OfItem = function (item) {
					return (_.isNil(pKey2Field) || _.isUndefined(_.get(item, pKey2Field))) ? null : _.get(item, pKey2Field);
				};

				serviceContainer.service.getPKey3OfItem = function (item) {
					return (_.isNil(pKey3Field) || _.isUndefined(_.get(item, pKey3Field))) ? null : _.get(item, pKey3Field);
				};

				serviceContainer.service.combinePKeysToQueryString = function (item) {
					const pKey1 = serviceContainer.service.getPKey1OfItem(item);
					const pKey2 = serviceContainer.service.getPKey2OfItem(item);
					const pKey3 = serviceContainer.service.getPKey3OfItem(item);
					var queryStr = '';
					if (!_.isNil(pKey1)) {
						queryStr = '&pKey1=' + pKey1;
						if (!_.isNil(pKey2)) {
							queryStr = queryStr + '&pKey2=' + pKey2;
							if (!_.isNil(pKey3)) {
								queryStr = queryStr + '&pKey3=' + pKey3;
							}
						}
					}
					return queryStr;
				};

				serviceContainer.service.combinePKeysToObject = function (item, object) {
					const pKey1 = serviceContainer.service.getPKey1OfItem(item);
					const pKey2 = serviceContainer.service.getPKey2OfItem(item);
					const pKey3 = serviceContainer.service.getPKey3OfItem(item);
					if (!_.isNil(pKey1)) {
						object.pKey1 = pKey1;
						if (!_.isNil(pKey2)) {
							object.pKey2 = pKey2;
							if (!_.isNil(pKey3)) {
								object.pKey3 = pKey3;
							}
						}
					}
					return object;
				};

				serviceContainer.service.getAllItemBySectionId = function (isDynamicCols) {
					// var mainItemIds = [];
					var itemList = parentService.getList();
					var objectIds = [];
					angular.forEach(itemList, function (item) {
						const mainItemId = serviceContainer.service.getMainItemIdOfItem(item);
						// mainItemIds.push(serviceContainer.service.getMainItemIdOfItem(item));
						let obj = {Id: mainItemId};
						obj = serviceContainer.service.combinePKeysToObject(item,obj);
						objectIds.push(obj);
					});

					var CharacteristReadItem = {
						sectionId: sectionId,
						// mainItemIds: mainItemIds
						objectIds: objectIds
					};

					if(isDynamicCols) {
						CharacteristReadItem.isDynamicCols = true;
					}

					if (objectIds.length > 0) {
						return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/allitembyobjectid', CharacteristReadItem).then(function (response) {
							return response.data;
						});
					} else {
						return $q.when([]);
					}
				};

				serviceContainer.service.getItemByCharacteristicFk = function(characteristicFk){
					return $http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/getcharacteristicbyid?id=' + characteristicFk).then(function(response) {
						return response.data;
					});
				};

				serviceContainer.service.createMany = function (charFks, entityId) {
					var postCreateData = {
						sectionId: serviceContainer.service.getSectionId(),
						mainItemId: entityId || serviceContainer.service.getMainItemId(),
						characFks: charFks
					};

					postCreateData = serviceContainer.service.combinePKeysToObject(parentService.getSelected(),postCreateData);

					// Create characteristics based on auto-assignment chars set on characteristic module
					return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/createMany', postCreateData).then(function (response) {
						return response.data || [];
					});
				};

				serviceContainer.service.createItemsAndAssignData = function(entityId, charsFk, callBackFn){
					serviceContainer.service.createMany(charsFk, entityId).then(function (chars) {
						if (!_.isEmpty(chars)){
							if (angular.isFunction(callBackFn)){
								callBackFn(chars);
							}

							// if (serviceContainer.service.hasOwnProperty('onCreatedItemsAndAssignData')){
							// 	serviceContainer.service.onCreatedItemsAndAssignData(chars);
							// }

							_.forEach(chars, function(charCreated){
								platformDataServiceDataProcessorExtension.doProcessItem(charCreated, serviceContainer.data);

								if (charCreated.isCharCreatedOnUpdate === true){
									delete charCreated.isCharCreatedOnUpdate;
								}else{
									charCreated.ValueText = basicsCharacteristicTypeHelperService.getDefaultValue(charCreated.CharacteristicEntity);
								}

								serviceContainer.data.itemList.push(charCreated);
								serviceContainer.data.markItemAsModified(charCreated, serviceContainer.data);
							});

							// Refresh characteristic grid
							serviceContainer.data.listLoaded.fire();
						}
					});
				};


				serviceContainer.service.getData = function getData() {
					return serviceContainer.data;
				};

				serviceContainer.service.createChained = function (characteristicFk) {

					let obj = {
						mainItemId: serviceContainer.service.getMainItemId(),
						sectionId: serviceContainer.service.getSectionId(),
						characFks: [characteristicFk]
					};
					obj = serviceContainer.service.combinePKeysToObject(parentService.getSelected(),obj);
					return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/createChained', obj)
						.then(function (result) {
							var newItemsCounter = 0;
							angular.forEach(result.data, function (item) {
								if (serviceContainer.data.itemList.find(function (el) {
									return el.CharacteristicFk === item.CharacteristicFk;
								}) === undefined) {   // check for already existing chrs

									var characteristic = basicsCharacteristicCodeLookupService.getItemById(item.CharacteristicFk);
									if (characteristic) {
										item.ValueText = basicsCharacteristicTypeHelperService.getDefaultValue(characteristic);
									}

									serviceContainer.data.itemList.push(item);
									serviceContainer.service.markItemAsModified(item);
									newItemsCounter++;
								}
							});
							return newItemsCounter;
						});
				};

				serviceContainer.service.CopyCharacteristicAndSynchronisize = function CopyCharacteristicAndSynchronisize(copyData) {
					$http.post(globals.webApiBaseUrl + 'basics/characteristic/data/copy', copyData
					).then(function (response) {
						if (response && response.data.length > 0) {
							var newItems = response.data;
							var characters = [];
							var characterData = [];
							var oldItems = serviceContainer.service.getList();
							if (oldItems && oldItems.length > 0) {
								characters = _.filter(newItems, function (character) {
									var item = _.find(oldItems, {'Id': character.Id});
									return !item;
								});
								characterData = oldItems.concat(characters);
							} else {
								characterData = newItems;
							}
							serviceContainer.service.setList(characterData);
							angular.forEach(characters, function (item) {
								serviceContainer.service.fireItemModified(item);
							});
						}
					});
				};

				serviceContainer.service.getParentField = function() {
					return parentField || 'Id';
				};

				// serviceContainer.service.getUsageContext = function getUsageContext(){
				// 	'todo: get independent container service to handle more options like dynamic column';
				// };

				// var onMainEntityChanged = function() {
				//	// update group selection tree
				//	basicsCharacteristicDataGroupService.setSectionId(serviceContainer.service.getSectionId());
				//	basicsCharacteristicDataGroupService.setContextId(serviceContainer.service.getMainItemId());
				//	basicsCharacteristicDataGroupService.refresh();
				// };
				// mainService.registerSelectionChanged(onMainEntityChanged);

				// function onItemListChanged() {
				//
				//	var usedCharacteriticsArray = null;
				//	if (serviceContainer.data.itemList) {
				//		// gets the value of key from all elements in collection.
				//		usedCharacteriticsArray = _.map(serviceContainer.data.itemList, 'CharacteristicFk');
				//	}
				//	basicsCharacteristicCodeLookupService.usedCharacteristicCodes = usedCharacteriticsArray;
				//	return usedCharacteriticsArray;
				// }
				// serviceContainer.service.registerListLoaded(onItemListChanged);

				var filters = [
					// moved to lookup service!
					// {
					//	key: 'basicsCharacteristicCodeLookupFilter' + sectionId,
					//	serverSide: false,
					//	fn: function (item) {
					//
					//		var display = false;
					//		if (item.sectionId === sectionId && item.IsReadonly === false) {
					//
					//			var usedCharacteriticsArray = null;
					//			if (serviceContainer.data.itemList) {
					//				// gets the value of key from all elements in collection.
					//				usedCharacteriticsArray = _.map(serviceContainer.data.itemList, 'CharacteristicFk');
					//			}
					//			var used = usedCharacteriticsArray ? usedCharacteriticsArray.indexOf(item.Id) : -1;
					//			display = used === -1;
					//		}
					//		return display;
					//	}
					// },
					{
						key: 'basicsCharacteristicDataDiscreteValueLookupFilter' + sectionId,
						serverSide: false,
						fn: function (item) {
							// remove all discrete values not belonging to the selected characteristic
							var selectedItem = serviceContainer.service.getSelected();
							if (selectedItem && selectedItem.CharacteristicFk === item.CharacteristicFk) {
								return true;
							}
							else {
								return false;
							}
						}
					}
				];
				basicsLookupdataLookupFilterService.registerFilter(filters);

				var setReadonlyor = function () {
					var name = parentService.getModule().name;
					if (_.startsWith(name, 'procurement') || name === 'businesspartner.main'||name === 'controlling.revrecognition') {
						var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
						if (getModuleStatusFn) {
							var status = getModuleStatusFn();
							return !(status.IsReadOnly || status.IsReadonly);
						}
						return false;
					}
					return true;
				};
				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && setReadonlyor();
				};
				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && setReadonlyor();
				};
				return serviceContainer.service;

				function getContainerUUID(){
					return serviceContainer.data.gridId;
				}

				function setContainerUUID(gridId){
					serviceContainer.data.gridId = gridId;
				}

			}

			function getService(parentService, sectionId, parentField, pKey1Field, pKey2Field, pKey3Field) {
				var cacheKey = sectionId;
				var serviceName = parentService.getServiceName();
				if (serviceName) {
					cacheKey = serviceName + sectionId;
				}
				if (!serviceCache[cacheKey]) {
					serviceCache[cacheKey] = createNewComplete(parentService, sectionId, parentField, pKey1Field, pKey2Field, pKey3Field);
				}
				return serviceCache[cacheKey];
			}

			function copyCharacteristicAndSynchronisize(parentService, copyData){
				getService(parentService, copyData.destSectionId).CopyCharacteristicAndSynchronisize(copyData);
			}

			return {

				getService: getService,
				copyCharacteristicAndSynchronisize: copyCharacteristicAndSynchronisize
			};

		}]);
})();
