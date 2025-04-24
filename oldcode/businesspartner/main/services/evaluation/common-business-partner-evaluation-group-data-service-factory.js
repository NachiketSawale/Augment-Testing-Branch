/**
 * Created by wed on 12/13/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('commonBusinessPartnerEvaluationGroupDataServiceFactory', [
		'_',
		'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension',
		'platformSchemaService',
		'platformRuntimeDataService',
		'ServiceDataProcessDatesExtension',
		'basicsLookupdataLookupDescriptorService',
		'$translate',
		'platformDataServiceSelectionExtension',
		'platformDataServiceActionExtension',
		'platformDataServiceModificationTrackingExtension',
		'PlatformMessenger',
		'commonBusinessPartnerEvaluationServiceCache',
		'businessPartnerRecalculateService',
		'businessPartnerMainEvaluationModificationService',
		'globals',
		'$http',
		'basicsPermissionServiceFactory',
		'$q',
		'platformGridAPI',
		'basicsUserformCommonService',
		'platformTranslateService',
		function (_,
		          platformDataServiceFactory,
		          platformDataServiceDataProcessorExtension,
		          platformSchemaService,
		          platformRuntimeDataService,
		          ServiceDataProcessDatesExtension,
		          basicsLookupdataLookupDescriptorService,
		          $translate,
		          platformDataServiceSelectionExtension,
		          platformDataServiceActionExtension,
		          platformDataServiceModificationTrackingExtension,
		          PlatformMessenger,
		          serviceCache,
		          recalculateService,
		          businessPartnerMainEvaluationModificationService,
		          globals,
		          $http,
		          basicsPermissionServiceFactory,
		          $q,
		          platformGridAPI,
		          basicsUserformCommonService,
		          platformTranslateService
		) {
			let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');

			platformTranslateService.registerModule('basics.userform');

			function createService(serviceDescriptor, evaluationDetailService, options) {

				if (serviceCache.hasService(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor)) {
					return serviceCache.getService(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor);
				}

				var groupIcons = [],
					createOptions = angular.merge({
						moduleName: moduleName
					}, options),
					serviceOption = {
						hierarchicalNodeItem: {
							module: angular.module(createOptions.moduleName),
							serviceName: serviceCache.getServiceName(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor),
							httpRead: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/',
								endRead: 'tree'
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/',
								endCreate: 'creategroup'
							},
							presenter: {
								tree: {
									initCreationData: initCreationData,
									incorporateDataRead: incorporateDataRead
								}
							},
							dataProcessor: [{processItem: processGroupDataIcon}],
							entityRole: {
								node: {
									parentProp: 'PId',
									childProp: 'ChildrenItem',
									itemName: 'EvaluationGroupData',
									parentService: evaluationDetailService
								}
							},
							actions: {
								'delete': false,
								'create': false
							}
						}
					};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				var data = serviceContainer.data;
				service.isCreate = true;
				service.CreateEntities = [];
				var hasWrite = true;
				var recalculateError = null;
				var gridId = null;
				var hasUserForm = false;
				let formInfoCache = [];

				// var hasWriteFromHierarchyDic = {};

				data.updateOnSelectionChanging = null;

				angular.extend(service, {
					itemName: data.itemName,
					createGroupItems: createGroupItems,
					itemPointsChangedHandler: itemPointsChangedHandler,
					changePointHandler: changePointHandler,
					clearAllData: clearAllData,
					markItemAsModified: function doMarkItemAsModified(item) {
						markItemAsModified(item, data);
					},
					markCurrentItemAsModified: markCurrentItemAsModified,
					getModifiedDataCache: getModifiedDataCache,
					setIsCreateByUserModified: setIsCreateByUserModified,
					evalClerkValidationErrorMessenger: new PlatformMessenger(),
					evalClerkValidationMessenger: new PlatformMessenger(),
					// getHasWriteFromHierarchy: getHasWriteFromHierarchy,
					updateListReadonly: updateListReadonly,
					permissionUpdated: new PlatformMessenger(),
					clearEntityErrors: new PlatformMessenger(),
					calculationEvaluation: calculationEvaluation,
					recalculateAll: recalculateAll,
					clearRecalcuteError: clearRecalcuteError,
					setGridId: setGridId
				});

				angular.extend(data, {
					onCreateSucceeded: onCreateSucceeded,
					markItemAsModified: markItemAsModified,
					entityCreated: new PlatformMessenger()
				});

				Object.defineProperties(service, {
					'hasWrite': {
						get: function () {
							return hasWrite;
						},
						set: function (value) {
							hasWrite = value;
						},
						enumerable: true
					}
				});

				serviceContainer.data.loadSubItemList = function () {
					var parentService = serviceContainer.service.parentService();
					if (parentService.view && parentService.getList().length > 0) {
						var filter = 'mainItemId=' + parentService.getSelected().Id;
						serviceContainer.data.setFilter(filter);

						return serviceContainer.data.doReadData(serviceContainer.data);
					}
				};

				serviceContainer.service.registerSelectionChanged(onSelectionChanged);

				function clearAllData() {
					data.itemList.length = 0;
					data.itemTree.length = 0;
					data.selectedItem = null;
					// hasWriteFromHierarchyDic = {};
					hasWrite = true;
					recalculateError = null;
				}

				function createGroupItems() {

					var creationData = serviceContainer.data.doPrepareCreate(serviceContainer.data);
					// clear the old Group data and item data
					var updateData = platformDataServiceModificationTrackingExtension.getModifications(serviceContainer.service);
					if (updateData && Array.isArray(updateData.EvaluationGroupDataToSave)) {
						updateData.EntitiesCount -= updateData.EvaluationGroupDataToSave.length;
						updateData.EvaluationGroupDataToSave.length = 0;
					}
					serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
				}

				function initCreationData(creationData, data) {
					clearAllData();
					var currentParentItem = data.parentService.getList()[0];
					if (currentParentItem) {
						creationData.EvaluationSchemaId = currentParentItem.EvaluationSchemaFk;
						creationData.EvaluationId = currentParentItem.Id;
					}
				}

				function incorporateDataRead(readItems, data) {
					clearAllData();
					// var localEvaluationData = evaluationDetailService.collectLocalEvaluationData.fire();
					var localEvaluationData = evaluationDetailService.collectLocalEvaluationDataScreen.fire();
					if (!readItems) {
						readItems = {};
						readItems.dtos = localEvaluationData.CreateEntities.CreateEntities;
						service.isCreate = true;
					}
					readItems = readItems || {};
					if (evaluationDetailService.view && evaluationDetailService.view.getDataFromLocal) {
						if (localEvaluationData && localEvaluationData.EvaluationGroupDataToSave) {
							var evaluationGroupDtos = _.map(localEvaluationData.EvaluationGroupDataToSave, 'EvaluationGroupData');
							_.forEach(evaluationGroupDtos, function (item) {
								if (!item) {
									return;
								}
								var isChange = false;
								for (var i = 0; i < readItems.dtos.length; i++) {
									if (readItems.dtos[i].EvaluationGroupFk === item.EvaluationGroupFk &&
										readItems.dtos[i].IsEvaluationSubGroupData === item.IsEvaluationSubGroupData) {

										item.Id = readItems.dtos[i].Id;
										readItems.dtos[i] = item;
										isChange = true;
										break;
									}
								}
								if (!isChange && item.PId) {
									var readItemsParentDto = _.find(readItems.dtos, {Id: item.PId});
									var children = readItemsParentDto ? readItemsParentDto.ChildrenItem : [];
									for (var j = 0; j < children.length; j++) {
										if (children[j].EvaluationGroupFk === item.EvaluationGroupFk &&
											children[j].IsEvaluationSubGroupData === item.IsEvaluationSubGroupData) {
											item.Id = children[j].Id;
											children[j] = item;
											break;
										}
									}
								}
							});
						}
					}

					if (readItems && !readItems.dtos) {
						readItems = {
							dtos: [],
							GroupIcons: []
						};
					}
					groupIcons = readItems.GroupIcons || [];

					data.itemList.length = 0;
					data.itemTree.length = 0;
					for (var j = 0; j < readItems.dtos.length; ++j) {
						data.itemTree.push(readItems.dtos[j]);
					}
					data.itemList = getTreeAllList(data.itemTree);

					// To-Do
					data.itemList.forEach(function (item) {
						// data.markItemAsModified(item, data);
						processItemReadonly(item, data);
					});
					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
					data.listLoaded.fire(data.itemList);

					// recalculate by Formula

					recalculateAll();
					return data.itemList;
				}

				function processGroupDataIcon(newItem) {
					newItem.Icon = -1;
					newItem.IconCommentText = null;
					for (var i = 0; i < groupIcons.length; i++) {
						if (groupIcons[i].EvaluationGroupFk === newItem.EvaluationGroupFk && !newItem.PId &&
							groupIcons[i].PointsFrom <= newItem.Evaluation && groupIcons[i].PointsTo >= newItem.Evaluation/* && newItem.Evaluation !== 0 */) {
							newItem.Icon = groupIcons[i].Icon;
							newItem.IconCommentText = groupIcons[i].CommentText;
							break;
						}
					}
				}

				function onCreateSucceeded(newItems, data) {
					service.isCreate = true;
					groupIcons = newItems.GroupIcons;
					platformDataServiceDataProcessorExtension.doProcessData(newItems.dtos, data);
					data.itemTree = newItems.dtos;

					if (newItems.dtos.length > 0) {
						data.listLoaded.fire(null, newItems.dtos[0]);
						platformDataServiceActionExtension.fireEntityCreated(data, newItems.dtos[0]);
					}
					data.itemList = getTreeAllList(newItems.dtos);
					data.itemList.forEach(function (item) {
						processItemReadonly(item, data);
						// data.markItemAsModified(item, data);
					});
					data.itemTree = newItems.dtos;

					var modifiedDataCache = evaluationDetailService.getModifiedDataCache();
					var parent = evaluationDetailService.getSelected();
					if (!modifiedDataCache.CreateEntities) {
						modifiedDataCache.CreateEntities = [
							{
								MainItemId: parent.Id,
								CreateEntities: newItems.dtos
							}
						];
					} else {
						modifiedDataCache.CreateEntities.push({
							MainItemId: parent.Id,
							CreateEntities: newItems.dtos
						});
					}

					data.listLoaded.fire(data.itemList);
					// recalculate by Formula
					recalculateAll();

					hasUserForm = false;
					var moduleName = service.getModule().name;
					//Checking schema has formfk, if true, open user form
					if (parent && parent.FormFk && newItems && newItems.dtos && newItems.dtos.length > 0 && moduleName == 'businesspartner.main') {
						hasUserForm = true;
					}
				}

				service.openUserForm = function (itemDataService) {
					if (hasUserForm) {
						const parent = evaluationDetailService.getSelected();
						const formFk = parent.FormFk;
						const options = {
							contextId: parent.EvaluationSchemaFk,
							formDataId: null,
							formId: formFk,
							openMethod: 2,
							setReadonly: false
						};

						let formInfo = _.filter(formInfoCache, {formFk: formFk});
						if (_.isArray(formInfo) && formInfo.length === 0) {
							$http.get(globals.webApiBaseUrl + 'basics/userform/field/list?mainItemId=' + formFk).then(function (response){
								if (response.data && response.data.length > 0){
									formInfoCache.push({
										formFk: formFk,
										formFields: response.data
									});
									openForm(response.data, options);
								}
							});
						}else{
							openForm(formInfo[0].formFields, options);
						}
					}
				}

				function openForm(formFields, options){
					if (formFields.length === 0){
						return;
					}

					let dataSource = {};
					let schemaData = {};
					let subgroupsWithFormField = _.filter(service.getList(), function (subgroup){
						return !_.isNull(subgroup.FormFieldFk);
					});

					_.forEach(service.getList(), function (subgroup){
						let subgroupFormFieldFk = subgroup.FormFieldFk;
						if (subgroupFormFieldFk){
							const formField = _.filter(formFields, {Id: subgroupFormFieldFk});
							if (formField && formField.length > 0){
								schemaData[formField[0].FieldName] = subgroup.Points;
							}
						}
					});

					$http.get(globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationitem/getitembyschema?mainItemId=' + options.contextId)
						.then(function (response){
							let data = response.data;

							_.forEach(data, function (item){
								let itemFormFieldFk = item.FormFieldFk;
								if (itemFormFieldFk){
									const formField = _.filter(formFields, {Id: itemFormFieldFk});
									if (formField && formField.length > 0){
										schemaData[formField[0].FieldName] = item.Points;
									}
								}
							});

							/*
								the public data structure for third party user
								dataSource:{
									headerData: {}  -- evaluation header data, extend for future
									schemaData: {
										BIMUse: 0,
										SoftwareCollaboration: 0,
										SoftwareModel: 0,
										BIMApllied: 0,
										Visualizing : 0,
										....
									}  -- schema data, names come from form fields
								}
							*/
							dataSource.schemaData = schemaData;

							let userformHelp = basicsUserformCommonService.createNewInstance({
								getDataSource: function () {
									return dataSource;
								}
							});

							userformHelp.formSubmitted.register(onFormSubmitted);

							userformHelp.editData(options);
						});
				}

				function getTreeAllList(treeList) {
					var list = [];
					for (var i = 0; i < treeList.length; i++) {
						if (treeList[i].nodeInfo) {
							treeList[i].nodeInfo.collapsed = false;
						} else {
							treeList[i].nodeInfo = {
								collapsed: false,
								lastElement: false,
								level: 0
							};
						}
						list.push(treeList[i]);

						var childItem = treeList[i][serviceOption.hierarchicalNodeItem.entityRole.node.childProp];
						childItem.forEach(function (item) {
							if (item.nodeInfo) {
								item.nodeInfo.collapsed = false;
							} else {
								item.nodeInfo = {
									collapsed: false,
									lastElement: true,
									level: 1
								};
							}
						});
						Array.prototype.push.apply(list, childItem);
					}
					return list;
				}

				function evaluationSchemaChangedHandler() {
					var parentService = serviceContainer.service.parentService();

					if (parentService.create) {
						serviceContainer.service.createGroupItems();
					} else if (parentService.view) {
						serviceContainer.service.loadSubItemList();
					}
				}

				function evaluationGroupValidationdHandler() {
					var result = serviceContainer.service.evalClerkValidationMessenger.fire();
					var list = serviceContainer.service.getList();
					if (result && Array.isArray(list) && list.length > 0) {
						_.forEach(list, function (item) {
							if (item.__rt$data && item.__rt$data.errors) {
								for (var property in item.__rt$data.errors) {
									if (Object.prototype.hasOwnProperty.call(item.__rt$data.errors, property) && item.__rt$data.errors[property]) {
										result = false;
										break;
									}
								}
							}
						});
					}

					if (result && recalculateError) {
						result = false;
					}
					return result;
				}

				function evaluationGroupValidationErrorHandler() {
					var list = serviceContainer.service.getList();
					var errorString = '';
					_.forEach(list, function (item) {
						var errors = item.__rt$data ? item.__rt$data.errors : null;
						if (errors) {
							for (var property in errors) {
								if (Object.prototype.hasOwnProperty.call(errors, property) && errors[property]) {
									if (errorString && errorString.trim() !== '') {
										errorString += '; ' + errors[property].error;
									} else {
										errorString += errors[property].error;
									}
								}
							}
						}
					});

					if (recalculateError) {
						var tempError = $translate.instant('businesspartner.main.failToRecalculate') + recalculateError;
						if (errorString) {
							errorString += '; ' + tempError;
						} else {
							errorString += tempError;
						}
					}
					errorString += service.evalClerkValidationErrorMessenger.fire();
					return errorString;
				}

				function itemPointsChangedHandler(entity, args, fromRecal) {
					var currentItem = serviceContainer.service.getSelected() || entity;
					if (fromRecal) {
						currentItem = entity;
					}
					var tree = serviceContainer.service.getTree();

					var newEvaluation = args.points * currentItem.Weighting / 100;
					if (currentItem.Points !== args.points || currentItem.Evaluation !== newEvaluation) {
						currentItem.Points = args.points;
						currentItem.Evaluation = newEvaluation;
						setIsCreateByUserModified(currentItem);
						serviceContainer.data.markItemAsModified(currentItem, serviceContainer.data);
					}

					var parentItem = _.find(tree, {Id: currentItem.PId});
					if (parentItem) {
						var groupData = service.getList();
						var subGroupData = _.filter(groupData, function (item) {
							return item.EvaluationFk === parentItem.Id && item.IsEvaluationSubGroupData;
						});
						var request = {
							SubGroupData: subGroupData,
							GroupData: parentItem
						};
						$http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/updateparentcalculationresult', request)
							.then(function (response) {
								if (response && response.data) {
									var parentItemModified = response.data;
									if (parentItemModified && (parentItemModified.Points !== parentItem.Points ||
										parentItemModified.Evaluation !== parentItem.Evaluation || parentItemModified.Total !== parentItem.Total)) {
										parentItem.Points = parentItemModified.Points;
										parentItem.Evaluation = parentItemModified.Evaluation;
										parentItem.Total = parentItemModified.Total;
										setIsCreateByUserModified(parentItem);
										serviceContainer.data.markItemAsModified(parentItem, serviceContainer.data);
										processGroupDataIcon(parentItem);
										serviceContainer.service.gridRefresh();
										evaluationDetailService.pointsChangeHanler(tree);

										if (!fromRecal) {
											var groupValidateService = serviceCache.getService(serviceCache.serviceTypes.GROUP_VALIDATION, serviceDescriptor);
											recalculateService.setPlaceHolderPoint(entity, entity.Points);
											recalculateService.recalculateData(groupValidateService, groupData, entity);
											service.gridRefresh();
										}
									}
								}
							});
					}
				}

				function calculationEvaluation(notFormulaEvalList) {
					var groupData = service.getList();
					var parentGroup = _.filter(notFormulaEvalList, {'HasChildren': true});
					var childrenGroup = _.filter(notFormulaEvalList, {'HasChildren': false});
					_.forEach(childrenGroup, function (item) {
						var newEvaluation = item.Points * item.Weighting / 100;
						if (item.Evaluation !== newEvaluation) {
							item.Evaluation = newEvaluation;
							setIsCreateByUserModified(item);
							serviceContainer.data.markItemAsModified(item, serviceContainer.data);
						}
					});
					$http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/updatecalculationEvaluation', parentGroup)
						.then(function (response) {
							if (response && response.data) {
								_.forEach(response.data.groupTree, function (item) {
									var currData = _.find(groupData, {Id: item.Id});
									if (currData && (currData.Points !== item.Points ||
										currData.Evaluation !== item.Evaluation || currData.Total !== item.Total)) {
										currData.Points = item.Points;
										currData.Evaluation = item.Evaluation;
										currData.Total = item.Total;
										setIsCreateByUserModified(currData);
										serviceContainer.data.markItemAsModified(currData, serviceContainer.data);
										processGroupDataIcon(currData);
									}
								});
								serviceContainer.service.gridRefresh();
								evaluationDetailService.pointsChangeHanler(serviceContainer.service.getTree());
								// evaluationDetailService.setEvaluationDetailPoint(response.data.evaluationTotal);
							}
						});
				}

				function changePointHandler(item, points) {
					var selectedItem = serviceContainer.service.getSelected();
					itemPointsChangedHandler(selectedItem, points, false);
				}

				function processItemReadonly(newItem, data) {
					platformRuntimeDataService.readonly(newItem, !hasWrite);
					if (!newItem.__rt$data || !newItem.__rt$data.readonly) {
						newItem.__rt$data = newItem.__rt$data || {};
						newItem.__rt$data.readonly = [];
					} else {
						newItem.__rt$data.readonly = [];
					}
					if (!hasWrite) {
						return;
					}

					if (!(newItem.IsEvaluationSubGroupData && newItem.IsEditable)) {
						var pointFields = [{
							'field': 'Points',
							'readonly': true
						}];
						platformRuntimeDataService.readonly(newItem, pointFields);
					}

					var fields = [];
					var parentSelected = data.parentService ? data.parentService.getSelected() : null;
					if (parentSelected) {
						var evaluationStatus = evaluationDetailService.getEvaluationStatus();
						var status = _.find(evaluationStatus, {'Id': parentSelected.EvalStatusFk});
						fields = [{
							'field': 'Points',
							'readonly': true
						}, {
							'field': 'IsTicked',
							'readonly': true
						}, {
							'field': 'Remark',
							'readonly': true
						}];
						if (status && status.Readonly) {
							platformRuntimeDataService.readonly(newItem, fields);
							return;
						}

						// set readonly by Evaluation IsReadonly
						if (parentSelected.IsReadonly) {
							platformRuntimeDataService.readonly(newItem, fields);
							return;
						}
					}

				}

				function markItemAsModified(item, data) {
					var modifiedDataCache = evaluationDetailService.getModifiedDataCache();

					if (!modifiedDataCache[data.itemName + 'ToSave']) {
						modifiedDataCache[data.itemName + 'ToSave'] = [
							{
								MainItemId: item.Id,
								EvaluationGroupData: item
							}
						];
						modifiedDataCache.EntitiesCount += 1;
					} else {
						var existed = _.find(modifiedDataCache[data.itemName + 'ToSave'], function (itemData) {
							return itemData.MainItemId === item.Id && itemData.EvaluationGroupData &&
								itemData.EvaluationGroupData.IsEvaluationSubGroupData === itemData.EvaluationGroupData.IsEvaluationSubGroupData;
						});
						if (!existed) {
							modifiedDataCache[data.itemName + 'ToSave'].push(
								{
									MainItemId: item.Id,
									EvaluationGroupData: item
								}
							);
							modifiedDataCache.EntitiesCount += 1;
						} else if (!existed.EvaluationGroupData) {
							existed.EvaluationGroupData = item;
						}
					}
					data.itemModified.fire(null, item);
				}

				function markCurrentItemAsModified() {
					var item = service.getSelected();
					if (item) {
						markItemAsModified(item, data);
					}
				}

				function getModifiedDataCache() {
					return service.parentService().getModifiedDataCache();
				}

				evaluationDetailService.evaluationSchemaChangedMessenger.register(evaluationSchemaChangedHandler);
				evaluationDetailService.evaluationGroupValidationdMessenger.register(evaluationGroupValidationdHandler);
				evaluationDetailService.evaluationGroupValidationErrorMessenger.register(evaluationGroupValidationErrorHandler);
				evaluationDetailService.clearEntityErrors.register(onClearEntityErrors);

				businessPartnerMainEvaluationModificationService.initialize(service, data, {
					parentService: service.parentService(),
					getRootModifiedDataCache: getModifiedDataCache,
					getSelectedItemsToMarkAsModified: getSelectedItemsToMarkAsModified,
					markSelectedAsModified: true
				});

				serviceCache.setService(serviceCache.serviceTypes.GROUP_DATA, serviceDescriptor, service);

				return service;

				// ////////////

				function getSelectedItemsToMarkAsModified() {
					var selectedItem = data.selectedItem;
					var modifiedItems = [];
					if (selectedItem) {
						modifiedItems.push(selectedItem);
						if (selectedItem.IsEvaluationSubGroupData) {
							var tree = serviceContainer.service.getTree();
							var parentItem = _.find(tree, {Id: selectedItem.PId});
							if (parentItem) {
								modifiedItems.push(parentItem);
							}
						}
					}
					return modifiedItems;
				}

				function setIsCreateByUserModified(entity) {
					entity.isCreateByModified = true;
				}

				function updateListReadonly() {
					data.itemList.forEach(function (item) {
						processItemReadonly(item, data);
					});
				}

				function onSelectionChanged(e, selected) {
					if (!selected) {
						return;
					}
					businessPartnerMainEvaluationPermissionService.setPermissionObjectInfo(selected.EvalPermissionObjectInfo)
						.then(function () {
							service.permissionUpdated.fire(null, selected);
						});
				}

				function onClearEntityErrors() {
					serviceContainer.service.clearEntityErrors.fire();
				}

				function recalculateAll(formulaSqlField) {
					recalculateError = '';
					var list = service.getList();
					var request = {
						Evaluation: evaluationDetailService.getSelected(),
						Groups: list,
						FormulaSQLField: formulaSqlField
					};
					let paras = angular.copy(request);
					if (!paras.Evaluation.Code || !(paras.Evaluation.Code.trim(''))) {
						paras.Evaluation.Code = '-';
					}
					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/recalculateall', paras)
						.then(function (response) {
							if (!response || !response.data) {
								return null;
							}

							var evaluation = response.data.Evaluation;
							var groups = response.data.Groups || [];
							var results = response.data.Results || {};

							let IsAnyModified = false;

							_.forEach(groups, function (item) {
								var found = _.find(list, {Id: item.Id});
								var result = results[item.Id];
								if (found && result) {
									if (result.IsModified) {
										IsAnyModified = true;
										setIsCreateByUserModified(found);
										serviceContainer.data.markItemAsModified(found, serviceContainer.data);
										found.Points = item.Points;
										found.Evaluation = item.Evaluation;
										if (!found.IsEvaluationSubGroupData) {
											found.Total = item.Total;
											processGroupDataIcon(found);
										}
									}
								}
							});

							if (evaluation) {
								evaluationDetailService.setEvaluationDetailPoint(evaluation.Points);
							}

							if (IsAnyModified) {
								_.forEach(list, function (item) {
									if (item.isCreateByModified) {
										var res = results[item.Id];
										var result = {valid: true, apply: true};
										if (res && res.HasError) {
											result.valid = false;
											if (res.ErrorCode === 1) {
												result.error = $translate.instant('businesspartner.main.amongValueErrorMessage', {
													min: res.Arg1,
													max: res.Arg2,
													value: res.Arg3
												});
											} else if (res.ErrorCode === 2) {
												result.error = $translate.instant('businesspartner.main.failToExecuteFormula', {
													formulaParsed: res.Arg1,
													formula: res.Arg2
												});
											} else if (res.ErrorCode === 3) {
												result.error = $translate.instant('businesspartner.main.failToExecuteSql', {
													formula: res.Arg1,
													message: res.Arg2
												});
											}
										}
										platformRuntimeDataService.applyValidationResult(result, item, 'Points');
									}
								});
							}
							evaluationDetailService.evaluationValidationMessenger.fire();
							gridRefreshAndBackToActiveCell();
							return results;
						}, function (error) {
							if (error && error.data && error.data.ErrorMessage) {
								recalculateError = error.data.ErrorMessage;
							}
							return {error: true};
						});
				}

				function clearRecalcuteError() {
					recalculateError = null;
				}

				function setGridId(id) {
					gridId = id;
				}

				function gridRefreshAndBackToActiveCell() {
					if (gridId) {
						var grid = platformGridAPI.grids.element('id', gridId).instance;
						var cell = grid.getActiveCell();
						service.gridRefresh();
						if (cell) {
							grid.setCellFocus(cell.row, cell.cell, true);
						}
					}
				}

				function onFormSubmitted(formData) {
					let gridGroups = service.getList();
					if (formData) {
						let parent = evaluationDetailService.getSelected();
						let formInfo = _.filter(formInfoCache, {formFk: parent.FormFk});
						let formfields = formInfo[0].formFields;
						let groupValidateService = serviceCache.getService(serviceCache.serviceTypes.GROUP_VALIDATION, serviceDescriptor)
						let promise = [];
						_.forEach(gridGroups, function (gridGroup) {
							let gridFormFieldFk = gridGroup.FormFieldFk;
							if (gridFormFieldFk) {
								let formFieldInCache = _.filter(formfields, {Id: gridFormFieldFk});
								if (formFieldInCache && formFieldInCache.length > 0) {
									let formfield = _.filter(formData, {name: formFieldInCache[0].FieldName})[0];
									if (formfield) {
										let points = _.toNumber(formfield.value);
										if (!_.isNaN(points)) {
											if (gridGroup.Points !== points) {
												promise.push(groupValidateService.asyncValidatePoints(gridGroup, points, 'Points'));
											}
										}
									}
								}
							}
						});
						if (promise.length > 0) {
							$q.all(promise).then(function (result) {
								service.gridRefresh();
							});
						}
					}
				}
			}

			return {
				createService: createService
			};
		}
	]);
})(angular);
