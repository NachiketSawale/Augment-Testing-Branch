/**
 * Created by chk on 3/10/2016.
 */
/* jshint -W083 */
/* global _,globals */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).constant('dragTypeOption', [
		{'cosMasterHeader': ['cosMainInstance', 'cosModelObjects', 'modelViewer', 'cosObjectSet', 'cosModelObjectsHierarchical']},
		{'cosModelObjects': ['cosMainInstance2Object', 'cosMainInstance']},
		{'cosMainInstance': ['modelViewer', 'cosModelObjects', 'cosModelObjectsHierarchical']},
		{'cosObjectSet': ['cosMainInstance', 'cosMasterHeader', 'cosMainInstance2Object']},

		{'cosModelObjectsHierarchical': ['cosMainInstance2Object', 'cosMainInstance']}
	]);

	angular.module(moduleName).service('dragDropPermissionDefine', ['permissions', function (permissions) {
		return {
			cosMasterHeader: {
				cosMainInstance: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.create + permissions.write
				}],
				cosModelObjects: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.create + permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				modelViewer: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.create + permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosObjectSet: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.create + permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosModelObjectsHierarchical: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.create + permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}]
			},
			cosModelObjects: {
				cosMainInstance2Object: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosMainInstance: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}]
			},
			cosMainInstance: {
				modelViewer: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosModelObjects: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosModelObjectsHierarchical: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}]
			},
			cosObjectSet: {
				cosMainInstance: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosMasterHeader: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.create + permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosMainInstance2Object: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}]
			},
			cosModelObjectsHierarchical: {
				cosMainInstance2Object: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}],
				cosMainInstance: [{
					guid: 'c17ce6c31f454e18a2bc84de91f72f48',
					permission: permissions.write
				}, {
					guid: '64a9c61d23064f13bb51fcad27932e2b',
					permission: permissions.create + permissions.write
				}]
			}
		};
	}]);

	angular.module(moduleName).factory('dragLeadingToInstanceOption', ['$injector', function ($injector) {
		var service = {};

		var canDragToInstance = [];

		service.canDrag = function canDrag(serviceName) {
			return service.getLeadingService(serviceName);
		};

		service.canPaste = function canPaste(serviceName) {
			if (service.getLeadingService(serviceName)) {
				var leadingService = $injector.get(serviceName);
				if (leadingService.multipleSelectedItems && leadingService.multipleSelectedItems.length) {
					if (serviceName === 'constructionSystemMainBoqService') {
						return _.filter(leadingService.multipleSelectedItems, function (item) {
							return item.BoqLineTypeFk === 0;
						}).length > 0;
					} else {
						return true;
					}
				}
			}
		};

		service.addLeadingService = function addLeadingService(serviceName) {
			if (serviceName) {
				if (!service.getLeadingService(serviceName)) {
					canDragToInstance.push(serviceName);
				}
			}
		};

		service.getLeadingService = function getLeadingService(serviceName) {
			return _.find(canDragToInstance, function (item) {
				return _.includes(serviceName, item);
			});
		};

		service.getAllLeadingService = function getAllLeadingService() {
			return canDragToInstance;
		};

		return service;
	}]);

	/**
	 * @ngdoc service
	 * @name constructionSystemMainClipboardService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * service for consturctionsystem main (instance) module to drag /drop, copy/paste data from one contaienr to another container.
	 */
	angular.module(moduleName).factory('constructionSystemMainClipboardService', [
		'$q', '$http', '$injector', '$translate', '_', 'PlatformMessenger', 'platformModalService', 'platformGridAPI',
		'constructionSystemMainInstanceService', 'constructionSystemMainInstance2ObjectService',
		'constructionSystemMainObjectService', 'constructionSystemMainObjectSetService', 'dragTypeOption',
		'constructionSystemMasterParameterDataService', 'constructionSystemMasterParameterValueDataService',
		'constructionSystemMainLocationService', 'constructionSystemMainControllingService',
		'constructionSystemMainInstanceParameterDefaultInputDialogService', 'constructionSystemMainInstanceParameterService',
		'basicsLookupdataLookupDescriptorService', 'constructionSystemMainBoqService', 'modelViewerDragdropService',
		'dragLeadingToInstanceOption', 'constructionSystemMainHeaderService', 'constructionsystemMainObjectHierarchicalDataService',
		'platformPermissionService', 'dragDropPermissionDefine',
		function ($q, $http, $injector, $translate, _, PlatformMessenger, platformModalService, platformGridAPI,
			cosMainInstance, instance2ObjectService, modelObjectsService, objectSetDataService, dragTypeOption,
			masterParameterDataService, masterParameterValueDataService, locationService, controllingService,
			constructionSystemMainInstanceParameterDefaultInputDialogService, constructionSystemMainInstanceParameterService,
			basicsLookupdataLookupDescriptorService, constructionSystemMainBoqService, modelViewerDragdropService,
			dragLeadingToInstanceOption, cosMainMasterService, constructionsystemMainObjectHierarchicalDataService,
			platformPermissionService, dragDropPermissionDefine) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};
			var filter = {};
			service.clipboardStateChanged = new PlatformMessenger();
			service.onDragStart = new PlatformMessenger();
			service.onDragEnd = new PlatformMessenger();
			service.onDrag = new PlatformMessenger();
			service.onPostClipboardError = new PlatformMessenger();
			service.objectSelectedList = new PlatformMessenger();

			service.basLanguageQtoFk = null;
			var debounceSetBasLanguageQtoFk = _.debounce(setBasLanguageQtoFk, 200);
			cosMainInstance.registerSelectionChanged(debounceSetBasLanguageQtoFk);

			service.setClipboardMode = function (clipboardMode) {
				clipboard.cut = clipboardMode;
			};

			service.getClipboard = function () {
				return clipboard;
			};

			function setBasLanguageQtoFk() {
				var defer = $q.defer();
				var instanceHeaderFk = cosMainInstance.getCurrentInstanceHeaderId();
				$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/getInstanceHeaderById?cosInsHeaderId=' + instanceHeaderFk).then(function (response) {
					service.instanceHeaderDto = response.data;
					service.basLanguageQtoFk = response.data.BasLanguageQtoFk;
					defer.resolve();
				}, function () {
					defer.reject();
				});
				return defer.promise;
			}

			function findTypeFromDragType(type) {
				var targetIndex = dragTypeOption.findIndex(function (item) {
					return Object.prototype.hasOwnProperty.call(item,type);
				});
				if (targetIndex > -1) {
					var res = dragTypeOption[targetIndex][type];
					if (angular.isDefined(res) && (res instanceof Array)) {
						return res;
					}
				}
				return undefined;
			}

			function findPermissionDefine(dragType, dropType) {
				var persmissionDefine, dragObj = dragDropPermissionDefine[dragType];
				if (dragObj) {
					persmissionDefine = dragObj[dropType];
				}
				return persmissionDefine;
			}

			function hasDropPermission(dragType, dropType) {
				var permissionDefine = findPermissionDefine(dragType, dropType);
				if (!permissionDefine) {
					return false;
				}
				var hasPermission = true;

				angular.forEach(permissionDefine, function (tempPermission) {
					hasPermission = hasPermission && platformPermissionService.has(tempPermission.guid, tempPermission.permission);
				});

				return hasPermission;
			}


			service.canDrag = function (type) {
				var result = false;

				if (angular.isDefined(findTypeFromDragType(type)) || dragLeadingToInstanceOption.canDrag(type)) {
					clipboard.type = type;
					result = true;
				}

				// check is entry from project module.
				var currentSelectedProjectId = cosMainInstance.getCurrentSelectedProjectId();
				var currentInstanceHeaderId = cosMainInstance.getCurrentInstanceHeaderId();

				if (!(angular.isNumber(currentSelectedProjectId) &&
					angular.isNumber(currentInstanceHeaderId))) {
					platformModalService.showErrorBox('constructionsystem.main.entryError', 'Error');
					return false;
				}

				return result;
			};

			service.canPaste = function (dropType) {
				if (clipboard.type === 'cosMainInstance' && dragLeadingToInstanceOption.canPaste(dropType)) {
					return true;
				}
				var hasPermission = hasDropPermission(clipboard.type, dropType);
				if (!hasPermission) {
					return false;
				}

				var dest = findTypeFromDragType(clipboard.type);
				if (angular.isDefined(dest)) {
					var res = _.find(dest, function (item) {
						return item === dropType;
					});

					if (angular.isDefined(res)) {
						// for drag model objects and drop to instance, at least one instance must be selected.
						if (clipboard.type === 'cosModelObjects') {
							return cosMainInstance.multipleSelectedItems.length === 1;
						}
						// for drag object sets drop to cos instance, only allow one selected instance (IsDistinct = false).
						else if (clipboard.type === 'cosObjectSet' && dropType === dragTypeOption[3].cosObjectSet[0]) {
							var distinctInstaces = _.filter(cosMainInstance.multipleSelectedItems, {IsDistinctInstances: false});
							return distinctInstaces.length === 1;
						}
						// for drag object sets drop to cos masters, at least one cos master must be selected.
						else if (clipboard.type === 'cosObjectSet' && dropType === dragTypeOption[3].cosObjectSet[1]) {
							return cosMainMasterService.selectedItems.length > 0;
						}
						// for drag object sets drop to assign object, only allow one selected instance (IsDistinct = false).
						else if (clipboard.type === 'cosObjectSet' && dropType === dragTypeOption[3].cosObjectSet[2]) {
							var distinctInstacesOfAssignObject = _.filter(cosMainInstance.multipleSelectedItems, {IsDistinctInstances: false});
							return distinctInstacesOfAssignObject.length === 1;
						}
						// for drag cos masters drop to object sets, at least one cos master must be selected.
						else if (clipboard.type === 'cosMasterHeader' && dropType === dragTypeOption[0].cosMasterHeader[3]) {
							return cosMainMasterService.selectedItems.length > 0;
						}
						else {
							return true;
						}
					}

					return false;
				}
				else if (dragLeadingToInstanceOption.canPaste(clipboard.type) && dropType === 'cosMainInstance') {
					return true;
				}

				return false;
			};
			service.cut = function (items, type) {
				if (items) {
					clipboard.data = angular.copy(items);
					clipboard.type = type;
				}
			};

			service.copy = function (items, type) {
				clipboard.type = type;
				clipboard.data = angular.copy(items);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();

				clipboard.cut = false;
			};

			service.paste = function (selectedItem, type) {// dest type
				/* if (!service.canPaste(type)) {
				 clearClipboard();
				 return;
				 } */
				var leadingService = null;
				if (clipboard.type === 'cosMainInstance' && dragLeadingToInstanceOption.getLeadingService(type)) {
					leadingService = $injector.get(type);
					leadingService.leadingServiceName = type;
					assignLeadingServiceValueToInstance(cosMainInstance.multipleSelectedItems, leadingService);

				} else {
					if (type === 'cosMainInstance' && dragLeadingToInstanceOption.getLeadingService(clipboard.type)) {
						if (cosMainInstance.multipleSelectedItems && cosMainInstance.multipleSelectedItems.length) {
							// noinspection JSCheckFunctionSignatures
							leadingService = $injector.get(clipboard.type);
							leadingService.leadingServiceName = clipboard.type;
							assignLeadingServiceValueToInstance(cosMainInstance.multipleSelectedItems, leadingService);
						}
					}
					// drag objectset drop to cos instance
					else if (clipboard.type === 'cosObjectSet' && type === dragTypeOption[3].cosObjectSet[0]) {
						dragObjectSets2CosInstance(clipboard.data);
					}
					// drag objectset drop to cos master
					else if (clipboard.type === 'cosObjectSet' && type === dragTypeOption[3].cosObjectSet[1]) {
						dragObjectSets2CosMasterOrViceVerse();
					}
					// drag objectset drop to assign object
					else if (clipboard.type === 'cosObjectSet' && type === dragTypeOption[3].cosObjectSet[2]) {
						dragObjectSets2CosInstance(clipboard.data);
					}
					// drag cos master drop to objectset
					else if (clipboard.type === 'cosMasterHeader' && type === dragTypeOption[0].cosMasterHeader[3]) {
						dragObjectSets2CosMasterOrViceVerse();
					}
					else {
						postClipboard(type, function (data) {
							if (data && data.length) {
								switch (type) {
									case 'cosMainInstance':
									case 'cosModelObjects':
									case 'cosModelObjectsHierarchical': {
										var instanceData = _.map(data, 'Instance');
										cosMainInstance.formatterData(instanceData);

										cosMainInstance.syncCostGroups(instanceData, data);
										cosMainInstance.setList(_.union(filterData(cosMainInstance.getList()), instanceData));
										cosMainInstance.clearModifications();
										/* var parameters=_.map(data, 'InstanceParameterToSave');
										 instanceParameterService.formatterData(parameters);
										 instanceParameterService.setList(_.union(instanceParameterService.getList(), parameters)); */
										cosMainInstance.goToLast();

										_.forEach(data, function (item) {
											if (item.ModelValidateError && item.ModelValidateError.length > 0) {
												_.forEach(item.ModelValidateError, function (error) {
													platformModalService.showErrorDialog(error);
												});
											}
										});
									}
										break;
								}
							}
						});
					}
				}
				clearClipboard();
			};

			function assignLeadingServiceValueToInstance(instanceSelectedItems, leadingService) {
				if (_.isUndefined(instanceSelectedItems) || instanceSelectedItems.length <= 0) {
					return;
				}
				var leadingServiceSelectedItem;
				if (leadingService.leadingServiceName === 'constructionSystemMainBoqService') {
					if (leadingService.multipleSelectedItems.length) {
						var res = _.filter(leadingService.multipleSelectedItems, function (item) {
							return item.BoqLineTypeFk === 0;
						});
						if (res.length) {
							leadingServiceSelectedItem = _.head(res);
						}
					}
				} else {
					leadingServiceSelectedItem = _.head(leadingService.multipleSelectedItems);
				}
				_.forEach(instanceSelectedItems, function (selectedItem) {
					var serName = dragLeadingToInstanceOption.getLeadingService(leadingService.leadingServiceName);
					if (_.includes(serName, 'Prj')) {
						serName = serName.replace(/Prj/, 'Project');
					}
					_.forEach(Object.getOwnPropertyNames(selectedItem), function (item) {
						if (_.includes(item.toLowerCase(), serName.toLowerCase())) {
							if (serName === 'Boq') {
								selectedItem.BoqItemFk = leadingServiceSelectedItem.Id;
								selectedItem.BoqHeaderFk = leadingServiceSelectedItem.BoqHeaderFk;
							} else {
								selectedItem[item] = leadingServiceSelectedItem.Id;
							}
							return false;
						}
					});
				});
				$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/updateinstances', instanceSelectedItems).then(function (res) {
					if (res.data && res.data.length) {
						var list = cosMainInstance.getList();

						// fix defect #93403 - cos instance-instance?select an instance, then drag boq to the instance, then drag location to the instance, then it pop up error
						list.forEach(function (item) {
							var newItem = _.find(res.data, {InstanceHeaderFk: item.InstanceHeaderFk, Id: item.Id});
							if (newItem) {
								item.Version = newItem.Version;
							}
						});

						cosMainInstance.gridRefresh();
					}
				});
			}

			service.fireOnDragStart = function () {
				service.onDragStart.fire();
			};

			// #start drag & drop for 3D Viewer
			service.setDropMessageToViewer = function (msg) {
				modelViewerDragdropService.setDropMessage($translate.instant('constructionsystem.main.dragDropMessage', {target: msg}));
			};

			service.myDragdropAdapter = new modelViewerDragdropService.DragdropAdapter();

			// override canDrop and Drop
			service.myDragdropAdapter.canDrop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				return service.canPaste('modelViewer');

			};
			service.myDragdropAdapter.drop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}

				var objectsSelected = [];

				modelViewerDragdropService.paste().then(function (createParam) {
					getFilterValue();

					var objectIdSet = createParam.includedObjectIds;

					if (clipboard && clipboard.data && clipboard.type === 'cosMainInstance') {// drag instance to 3D viewer
						copyObjectsToModelObjects([{Instance: clipboard.data[0]}], [], createParam.modelId, false, objectIdSet);
					} else if (clipboard && clipboard.data && clipboard.type === 'cosMasterHeader') {// drag Master

						var modelObject = objectIdSet.useGlobalModelIds();
						for (var modelId in modelObject) {
							if (Object.prototype.hasOwnProperty.call(modelObject,modelId)) {
								var objectIds = modelObject[modelId];

								objectsSelected = objectsSelected.concat(_.filter(modelObjectsService.getAllsFromCache(), function (item) {
									return item.ModelFk.toString() === modelId && Object.prototype.hasOwnProperty.call(objectIds,item.Id);
								}));
							}
						}

						generateMainInstance(
							createParam.modelId,
							function (data) {
								if (data && data.length) {
									var instanceData = _.map(data, 'Instance');
									cosMainInstance.formatterData(instanceData);
									cosMainInstance.syncCostGroups(instanceData, data);
									cosMainInstance.setList(_.union(filterData(cosMainInstance.getList()), instanceData));
									cosMainInstance.goToLast();
								}
							},
							objectsSelected,
							function (response) {
								copyObjectsToModelObjects(response, objectsSelected, createParam.modelId, false, objectIdSet);
							});
					}
					clearClipboard();
				});
			};

			service.copyObjectsFromViewer = function copyObjectsFromViewer() {
				var selectedInstance = cosMainInstance.getSelected();
				if (selectedInstance && selectedInstance.Id) {
					modelViewerDragdropService.paste().then(function (createParam) {

						var objectIdSet = createParam.includedObjectIds;

						copyObjectsToModelObjects([{Instance: selectedInstance}], [], createParam.modelId, false, objectIdSet);
					});

				}
			};

			// #end

			function filterData(data) {
				return _.filter(data, function (item) {
					if (angular.isDefined(item.Id)) {
						return item;
					}
				});
			}

			service.fireOnDragEnd = function (e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function (e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clearClipboard = function () {
				clearClipboard();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			function clearClipboard() {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;

				service.clipboardStateChanged.fire();
			}

			var modelObjectSelected = [];
			modelObjectsService.objectSelectList.register(function (objects) {
				modelObjectSelected = objects;
			});

			function postClipboard(type, onSuccessCallback) {
				var modelSelectedId = cosMainInstance.getCurrentSelectedModelId();
				if (!clipboard.data || !clipboard.data.length || angular.isUndefined(modelSelectedId)) {
					return;
				}
				service.objectSelectedList.fire();
				if (clipboard.type === 'cosModelObjectsHierarchical' || type === 'cosModelObjectsHierarchical') {
					modelObjectSelected = constructionsystemMainObjectHierarchicalDataService.getSelectedWithChild();
				}
				/* var mainObjectsSelected = _.filter(modelObjectsService.getList(), function (item) {
				 return angular.isDefined(item.IsChecked) === true && item.IsChecked === true;
				 }); */
				// var mainObjectsSelected = modelObjectsService.getSelected();

				getFilterValue();
				dealDrag(type, onSuccessCallback, modelSelectedId, modelObjectSelected);
			}

			function getFilterValue() {
				filter = {};
				filter.ControllingUnitFk = getSelectedByFilter(controllingService);
				filter.LocationFk = getSelectedByFilter(locationService);
				filter.BoqItemFk = getSelectedByFilter(constructionSystemMainBoqService);
				filter.BoqHeaderFk = getSelectedByFilter(constructionSystemMainBoqService, true);

				var customerFilter = cosMainInstance.getCustomFurtherFilters();
				var costGroupFilter = _.find(customerFilter, {Token: 'COST_GROUP_FILTER'});
				var costGroupFilterValues = _.isObject(costGroupFilter) ? _.filter(costGroupFilter.Value.split(','), function (item) {
					return _.endsWith(item, ':1');
				}) : [];
				filter.CostGroups = _.map(costGroupFilterValues, function (filter) {
					var results = filter.split(':');
					return {
						CostGroupFk: _.parseInt(results[1]),
						CostGroupCatFk: _.parseInt(results[0]),
					};
				});
			}

			function getSelectedByFilter(services, needHeadFk) {
				var selectedItem = services.getSelected() || {};
				if (angular.isDefined(selectedItem.IsMarked)) {
					if (selectedItem.IsMarked) {
						return needHeadFk ? selectedItem.BoqHeaderFk : selectedItem.Id;
					}
				}
				return null;
			}

			function dealDrag(type, onSuccessCallback, modelSelectedId, mainObjectsSelected) {
				switch (type) {
					case 'cosMainInstance': {
						if (clipboard.type === dragTypeOption[0].cosMasterHeader[1]) {
							// copyObjectsToAssingedObjects();
							instanceToObjectsOrObjectsToInstance();
						} else if (clipboard.type === 'cosModelObjectsHierarchical') {
							instanceToObjectsOrObjectsToInstance();
						} else {
							generateMainInstance(modelSelectedId, onSuccessCallback);
						}

					}
						break;
					case 'cosModelObjects': {
						if (mainObjectsSelected && mainObjectsSelected.length > 0) {
							if (clipboard.type === 'cosMainInstance') {
								instanceToObjectsOrObjectsToInstance();
							} else {
								generateMainInstance(modelSelectedId, onSuccessCallback, mainObjectsSelected, function (response) {
									copyObjectsToModelObjects(response, mainObjectsSelected, modelSelectedId);
								});
							}
						}
					}
						break;
					case 'cosModelObjectsHierarchical': {
						if (mainObjectsSelected && mainObjectsSelected.length > 0) {
							if (clipboard.type === 'cosMainInstance') {
								instanceToObjectsOrObjectsToInstance();
							} else {
								generateMainInstance(modelSelectedId, onSuccessCallback, mainObjectsSelected, function (response) {
									copyObjectsToModelObjects(response, mainObjectsSelected, modelSelectedId);
								});
							}
						}
					}
						break;
					case 'cosMainInstance2Object': {
						if (clipboard.type === 'cosModelObjectsHierarchical') {
							var instanceSelected = cosMainInstance.getSelected() || {};
							var objectsSelected = constructionsystemMainObjectHierarchicalDataService.getSelectedWithChild();
							if (angular.isDefined(instanceSelected.Id) && objectsSelected.length > 0) {
								copyObjectsToModelObjects([{Instance: instanceSelected}], objectsSelected, modelSelectedId, true);
							}
						} else {
							copyObjectsToAssingedObjects();
						}

					}
						break;
				}

				function instanceToObjectsOrObjectsToInstance() {
					var instanceSelected = [];
					_.forEach(cosMainInstance.multipleSelectedItems, function (item) {
						instanceSelected.push({Instance: item});
					});
					copyObjectsToModelObjects(instanceSelected, mainObjectsSelected, modelSelectedId, true).then(function () {
						// cosMainInstance.goToFirst();
					});
				}

				function copyObjectsToAssingedObjects() {
					var instanceSelected = cosMainInstance.getSelected() || {};
					var objectsSelected = clipboard.data;
					if (angular.isDefined(instanceSelected.Id) && objectsSelected.length > 0) {
						copyObjectsToModelObjects([{Instance: instanceSelected}], objectsSelected, modelSelectedId, true);
					}
				}
			}

			function generateMainInstance(modelSelectedId, onSuccessCallback, mainObjectsSelected, onSecondCallback) {
				var headerData = clipboard.data;
				cosMainInstance.update().then(function () {
					var mainUrl = 'constructionsystem/main/instance/copy';
					copyMasterToMainInstance(headerData, modelSelectedId, mainObjectsSelected).then(function (reqParameters) {
						if (reqParameters.length > 0) {
							let instanceParams = angular.copy(reqParameters);
							_.forEach(instanceParams, function (param) {
								if (param.InstanceParameterDtos) {
									_.forEach(param.InstanceParameterDtos, function (instance) {
										instance.ModelPropertyFk = null; // api doesn't support string Fk.
									});
								}
							});
							$http.post(globals.webApiBaseUrl + mainUrl, instanceParams).then(function onSuccess(response) {
								response = response.data;
								if (angular.isFunction(onSuccessCallback)) {
									onSuccessCallback(response);
								}
								if (angular.isFunction(onSecondCallback)) {
									onSecondCallback(response);
								}
							}, function onError() {

							});
						}
					});
				});
			}

			function assignValueToInstance(fromMasterValue, fromLeadingValue) {
				return fromLeadingValue === null ? (angular.isUndefined(fromMasterValue) ? null : fromMasterValue) : fromLeadingValue;
			}

			// function setQuantityQuery(paramList){
			//          for(var i=0;i<paramList.length;i++){
			//              var parameter=paramList[i];
			//              var cosMasterParamQuantityQueryTr=parameter.QuantityQueryTr;
			//              var translationURL=globals.webApiBaseUrl + 'cloud/common/translation/getTranslationByIdAndLanguageId';
			//          if(service.basLanguageQtoFk===null){
			//             setBasLanguageQtoFk().then(
			//             function (){
			//                 var translationParameter={Id:cosMasterParamQuantityQueryTr,LangugeId:service.basLanguageQtoFk};
			//                 $http.post(translationURL, translationParameter).then(function onSuccess(response) {
			//                 if (response.data) {
			//                     parameter.QuantityQuery=response.data.Description;
			//                  }
			//                });
			//               }
			//             );
			//           }
			//    }
			// }

			function copyMasterToMainInstance(headData, modelSelectedId, mainObjectsSelected) {
				var defer = $q.defer();
				var reqParameters = [];
				var needInputDefaultParametersByMaster = [];
				var reqParametersToMaster = [];
				var promisses = [];
				var mdlObjectsSelectLen = mainObjectsSelected ? mainObjectsSelected.length : 0;
				var instanceHeaderFk = cosMainInstance.getCurrentInstanceHeaderId();
				if (headData && headData.length) {
					promisses = _.map(headData, function (headDto) {
						var headerDefer = $q.defer();
						masterParameterDataService.getListByHeadId(headDto.Id).then(function (req) {
							basicsLookupdataLookupDescriptorService.attachData(req.data);
							var reqParameter = {};
							reqParameter.InstanceDto = headDto;
							reqParameter.InstanceDto.ControllingUnitFk = assignValueToInstance(headDto.ControllingUnitFk, filter.ControllingUnitFk);
							reqParameter.InstanceDto.LocationFk = assignValueToInstance(headDto.LocationFk, filter.LocationFk);
							reqParameter.InstanceDto.BoqItemFk = assignValueToInstance(headDto.BoqItemFk, filter.BoqItemFk);
							reqParameter.InstanceDto.BoqHeaderFk = assignValueToInstance(headDto.BoqHeaderFk, filter.BoqHeaderFk);
							reqParameter.CostGroups = filter.CostGroups;

							if (instanceHeaderFk) {
								reqParameter.InstanceDto.InstanceHeaderFk = instanceHeaderFk;
							}

							if (headDto.IsDistinctInstances && mdlObjectsSelectLen > 1) {
								var parameters = req ? (req.data ? req.data.Main : []) : [];
								// setQuantityQuery(parameters);
								needInputDefaultParametersByMaster.push({
									masterData: headDto,
									parameterList: parameters
								});
								reqParametersToMaster.push({masterData: headDto, reqParameter: reqParameter});
								headerDefer.resolve();
							} else {
								var paramList = req ? (req.data ? req.data.Main : []) : [];
								if (mdlObjectsSelectLen > 0) {
									_.forEach(paramList, function (param) {
										if (param.CosDefaultTypeFk !== 1) {
											param.DefaultValue = null;
										}
									});
								}
								// setQuantityQuery(paramList);
								reqParameter.InstanceParameterDtos = paramList;
								copyValueFromParameterValue(reqParameter, headerDefer);

								// in case bad performance caused by a large number of parameters are sent on a slow internet
								if(reqParameter.InstanceParameterDtos && reqParameter.InstanceParameterDtos.length > 0){
									reqParameter.IsParametersFromBackEnd = true;
									reqParameter.InstanceParameterDtos = null;
								}
							}
						});
						return headerDefer.promise;
					});

					var cosMasterTemplatesPromise = basicsLookupdataLookupDescriptorService.loadData('CosTemplate');
					promisses.push(cosMasterTemplatesPromise);

					$q.all(promisses).then(function () {
						if (needInputDefaultParametersByMaster.length > 0) {
							var modalOptions = {
								backdrop: false,
								width: '850px',
								height: '600px',
								controller: 'constructionSystemMainInstanceParameterDefaultInputDialogController',
								templateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/instanceparameter-default-input-dialog.html',
								resizeable: true
							};
							var objectIds = _.map(mainObjectsSelected, function (item) {
								return {ObjectId: item.Id, ModelFk: item.ModelFk};
							});
							constructionSystemMainInstanceParameterDefaultInputDialogService.initData(needInputDefaultParametersByMaster, modelSelectedId, objectIds);
							platformModalService.showDialog(modalOptions).then(function (result) {
								var promisses = [];
								if (result.isOk) {
									var dataList = result.dataList;
									if (dataList) {
										_.forEach(dataList, function (data) {
											var headerDefer = $q.defer();
											var insParams = data.parameterList;
											var foundReqParam = _.find(reqParametersToMaster, function (item) {
												return item.masterData.Id === data.masterData.Id;
											});

											if (foundReqParam) {
												foundReqParam.reqParameter.InstanceDto.CosTemplateFk = data.selectedTemplateId !== 'D1' && data.selectedTemplateId !== 'D2' ? data.selectedTemplateId : null;
												foundReqParam.reqParameter.InstanceParameterDtos = insParams ? insParams : [];
												copyValueFromParameterValue(foundReqParam.reqParameter, headerDefer/* , true */);
											}

											promisses.push(headerDefer.promise);
										});
									}
								}
								$q.all(promisses).then(function () {
									defer.resolve(reqParameters);
								});
							});
						} else {
							$q.all(promisses).then(function () {
								defer.resolve(reqParameters);
							});
						}
					});
				}
				return defer.promise;

				function copyValueFromParameterValue(reqParameter, copyDefer/* , withObjects */) {
					// withObjects = angular.isDefined(withObjects) ?  withObjects : false;
					if (reqParameter.InstanceParameterDtos && reqParameter.InstanceParameterDtos.length > 0) {
						$q.all(_.map(reqParameter.InstanceParameterDtos, function (parameter) {
							var deferItem = $q.defer();

							parameter.ParameterFk = parameter.Id;


							if (parameter.IsLookup) {
								// parameter.ParameterValue may have value because parameter comes from the Create Instance Dialog
								if (parameter.DefaultValue && (parameter.ParameterValue === null || angular.isUndefined(parameter.ParameterValue))) {
									masterParameterValueDataService.getListByParameterId(parameter.Id).then(function (response) {

										if (response && response.data) {
											var temp = response.data.filter(function (item) {
												return item.Id === Number(parameter.DefaultValue);
											});
											parameter.ParameterValueFk = temp[0] ? temp[0].Id : null;
											parameter.ParameterValue = temp[0] ? temp[0].ParameterValue : null;
										} else {
											parameter.ParameterValueFk = null;
											parameter.ParameterValue = null;
										}
										deferItem.resolve();
									}
									);
								} else {
									deferItem.resolve();
								}
							} else {
								parameter.ParameterValue = parameter.DefaultValue;
								deferItem.resolve();
							}
							return deferItem.promise;
						})).then(function () {
							parameterResolve();
						});
					} else {
						parameterResolve();
					}

					function parameterResolve() {
						reqParameter.MasterId = reqParameter.InstanceDto.Id;
						reqParameter.ModelId = modelSelectedId;
						reqParameter.IsDistinctInstances = reqParameter.InstanceDto.IsDistinctInstances;

						if (mainObjectsSelected) {
							var modelObject = {};

							angular.forEach(mainObjectsSelected, function (item) {
								if (!Object.prototype.hasOwnProperty.call(modelObject,item.ModelFk)) {
									modelObject[item.ModelFk] = [];
								}
								modelObject[item.ModelFk].push(item.Id);
							});

							var subModelObjectIds = [];

							for (var modelId in modelObject) {
								if (Object.prototype.hasOwnProperty.call(modelObject,modelId)) {
									subModelObjectIds.push({SubModelId: modelId, ObjectIds: modelObject[modelId]});
								}
							}

							reqParameter.SubModelObjectIds = subModelObjectIds;
						}

						reqParameters.push(reqParameter);
						copyDefer.resolve();
					}
				}
			}

			function initCreateData(req, mainObjectsSelected, modelSelectedId, objectIdSet) {
				var reqParameters = [];
				if (req && req.length) {
					_.forEach(req, function (item) {
						var reqParameter = {};
						reqParameter.InstanceDto = item.Instance || {};
						// reqParameter.Instance2ObjectDtos = mainObjectsSelected;
						if (mainObjectsSelected && mainObjectsSelected.length > 0) {
							var modelObjectIdsObject = {};
							angular.forEach(mainObjectsSelected, function (modelObject) {
								var modelFk = modelObject.ModelFk;
								var objectId = modelObject.Id;
								if (!modelObjectIdsObject[modelFk]) {
									modelObjectIdsObject[modelFk] = [objectId];
								} else {
									modelObjectIdsObject[modelFk].push(objectId);
								}
							});
							var subModelObjectIdsForSelectObjects = [];
							for (var modelFk in modelObjectIdsObject) {
								if (Object.prototype.hasOwnProperty.call(modelObjectIdsObject,modelFk)) {
									subModelObjectIdsForSelectObjects.push({
										SubModelId: modelFk,
										ObjectIds: modelObjectIdsObject[modelFk]
									});
								}
							}
							reqParameter.SubModelObjectIds = subModelObjectIdsForSelectObjects;
						}

						if (objectIdSet && objectIdSet.useGlobalModelIds) {
							var subModelObjectIds = [];
							var modelObject = objectIdSet.useGlobalModelIds();
							for (var modelId in modelObject) {
								if (Object.prototype.hasOwnProperty.call(modelObject,modelId)) {
									subModelObjectIds.push({
										SubModelId: modelId, ObjectIds: (function (objIds) {
											var result = [];

											if (angular.isArray(objIds)) {
												result = objIds;
											}
											else if (angular.isObject(objIds)) {
												result = objIds.toArray(function (v) {
													return !!v;
												});
											}

											return result;
										})(modelObject[modelId])
									});
								}
							}

							reqParameter.SubModelObjectIds = subModelObjectIds;
						}

						reqParameter.ModelId = modelSelectedId;
						reqParameter.IsDistinctInstances = reqParameter.InstanceDto.IsDistinctInstances;
						reqParameters.push(reqParameter);
					});
				}
				return reqParameters;
			}

			function copyObjectsToModelObjects(req, selectedObjects, modelId, isFromObjectDirectly, objectIdSet) {
				return cosMainInstance.update().then(function () {
					var instance2ObjectUrl = 'constructionsystem/main/instance2object/copy';
					var reqParameters = initCreateData(req, selectedObjects, modelId, objectIdSet);
					_.forEach(reqParameters, function (item) {
						item.IsFromObjectDirectly = isFromObjectDirectly || false;
					});
					$http.post(globals.webApiBaseUrl + instance2ObjectUrl, reqParameters).then(function onSuccess(response) {
						response = response.data;
						if (response && response.ModelValidateError && response.ModelValidateError.length > 0) {
							_.forEach(response.ModelValidateError, function (error) {
								platformModalService.showErrorDialog(error);
							});
						}

						if (response && response.Objects && response.Objects.length > 0) {
							cosMainInstance.sync3DViewerIfSelectedIsChecked();
							cosMainInstance.updateStatusToModified();
							constructionSystemMainInstanceParameterService.load();
						}
						instance2ObjectService.load();
						// instance2ObjectService.formatterData(data || []);
						// instance2ObjectService.setList(_.union(instance2ObjectService.getList(), data || []));
					}, function onError() {

					});
				});
			}

			/**
			 * drag object sets drop to cos instance.
			 * assign object set's objects to the selected cos instance.
			 */
			function dragObjectSets2CosInstance(selectedObjectSets) {
				cosMainInstance.update().then(function () {
					var url = 'constructionsystem/main/instance2object/dragobjectsets2instance';
					var distinctInstaceIds = _.map(_.filter(cosMainInstance.multipleSelectedItems, {IsDistinctInstances: false}), 'Id');
					var parameters = {
						ProjectId: cosMainInstance.getCurrentSelectedProjectId(),
						ModelId: cosMainInstance.getCurrentSelectedModelId(),
						ObjectSetIds: _.map(selectedObjectSets, 'Id'),
						InstanceHeaderId: cosMainInstance.getCurrentInstanceHeaderId(),
						InstanceIds: distinctInstaceIds
					};

					$http.post(globals.webApiBaseUrl + url, parameters).then(function onSuccess(response) {
						if (response.data) {
							instance2ObjectService.load();
						}
					});
				});
			}

			/**
			 * drag object sets drop to cos masters or vice verse
			 * for the “IsDistinct = True" master, create a instance for each object in the object set and assign only the object to the instance.
			 * for the “IsDistinct = False" master, only create one instacne and assign all objects for the instance.
			 */
			function dragObjectSets2CosMasterOrViceVerse() {
				cosMainInstance.update().then(function () {
					var url = 'constructionsystem/main/instance/dragobjectsets2master';
					var parameters = {
						ProjectId: cosMainInstance.getCurrentSelectedProjectId(),
						ModelId: cosMainInstance.getCurrentSelectedModelId(),
						ObjectSetIds: _.map(objectSetDataService.selectedItems, 'Id'),
						CosInsHeaderId: cosMainInstance.getCurrentInstanceHeaderId(),
						CosHeaderIds: _.map(cosMainMasterService.selectedItems, 'Id')
					};

					$http.post(globals.webApiBaseUrl + url, parameters).then(function onSuccess(response) {
						if (response.data && response.data.length > 0) {
							var readData = {
								dtos: response.data,
								CostGroupToSave: _.flatten(_.map(_.filter(response.data, function (instance) {
									return instance.CostGroups && instance.CostGroups.length > 0;
								}), function (item) {
									return item.CostGroups;
								}))
							};
							cosMainInstance.syncCostGroups(readData.dtos, [readData]);
							cosMainInstance.setList(_.union((cosMainInstance.getList()), response.data));
						}
					});
				});
			}

			return service;
		}
	]);
})(angular);