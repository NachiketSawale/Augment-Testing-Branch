/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, $q */

	'use strict';
	var moduleName = 'hsqe.checklist';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name hsqeCheckListDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListDataService', ['$injector', '$http', '$translate','platformDataServiceFactory', 'cloudDesktopSidebarService',
		'basicsLookupdataLookupDescriptorService','basicsLookupdataLookupFilterService', 'platformContextService',
		'ServiceDataProcessDatesExtension','cloudDesktopPinningContextService','cloudDesktopInfoService',
		'checkListNumberGenerationSettingsService', 'platformRuntimeDataService', 'platformDataValidationService','hsqeCheckListDataReadonlyProcessor',
		'modelViewerModelSelectionService','modelViewerDragdropService', 'modelViewerMarkerService', 'modelViewerMarkerUiService', 'modelViewerViewerRegistryService','modelViewerPositioningService','documentsProjectFileActionProcessor',
		function ($injector, $http, $translate, dataServiceFactory, cloudDesktopSidebarService, lookupDescriptorService, basicsLookupdataLookupFilterService,
			platformContextService, ServiceDataProcessDatesExtension, cloudDesktopPinningContextService, cloudDesktopInfoService,
			checkListNumberGenerationSettingsService, platformRuntimeDataService, platformDataValidationService, hsqeCheckListDataReadonlyProcessor,
			modelViewerModelSelectionService, modelViewerDragdropService, modelViewerMarkerService, modelViewerMarkerUiService, modelViewerViewerRegistryService, modelViewerPositioningService, documentsProjectFileActionProcessor) {
			var service = {},serviceContainer = null;
			var markerService;
			var pickedItem;
			// set filter parameter for this module
			var sidebarSearchOptions = {
				moduleName: moduleName,  // required for filter initialization
				enhancedSearchEnabled: true,
				enhancedSearchVersion: '2.0',
				pattern: '',
				pageSize: 100,
				useCurrentClient: true,
				includeNonActiveItems: null,
				showOptions: true,
				showProjectContext: false,
				pinningOptions: {
					isActive: true, showPinningContext: [{token: 'project.main', show: true}, {token: 'model.main', show: true}],
					setContextCallback: function (prjService) {
						cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'PrjProjectFk');
					}
				},
				withExecutionHints: false,
				includeDateSearch:true
			};
			var onReadSucceeded = function onReadSucceeded(readData, data) {
				lookupDescriptorService.attachData(readData);
				var groupTemplateService = $injector.get('hsqeCheckListGroupTemplateDataService');
				if(groupTemplateService){
					groupTemplateService.load();
				}
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				var modelObjectService = $injector.get('hsqeCheckListModelObjectDataService');
				if(modelObjectService && service.ModelObjects.length < 1){
					service.getModelObjects();
				}

				return serviceContainer.data.handleReadSucceeded(result, data);
			};
			var initialDialogService = $injector.get('hsqeCheckListCreationInitialDialogService');
			var serviceOptions = {
				hierarchicalRootItem: {
					module: module,
					serviceName: 'hsqeCheckListDataService',
					entityNameTranslationID: 'hsqe.CheckList.title.header',
					entityInformation: { module: 'Hsqe.Checklist', entity: 'HsqCheckList', specialTreatmentService: initialDialogService},
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/header/',
						usePostForRead: true,
						endRead: 'listbyfilter'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/header/',
						usePostForRead: true,
						endCreate: 'createdto'
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'hsqe/checklist/header/', endUpdate: 'updatedto'},
					httpDelete: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/header/',
						usePostForRead: true,
						endDelete: 'deletedto'
					},
					entityRole: {
						root: {
							itemName: 'CheckListHeaders',
							moduleName: 'cloud.desktop.moduleDisplayNameCheckList',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							showProjectHeader: {
								getProject: function (entity) {
									if (!entity || !entity.PrjProjectFk) {
										return null;
									}
									return lookupDescriptorService.getLookupItem('Project', entity.PrjProjectFk);
								}
							},
							handleUpdateDone: function (updateData, response) {
								if (!response.CheckListHeaders && response.CheckListHeader) {
									response.CheckListHeaders = [];
									response.CheckListHeaders.push(response.CheckListHeader);
								}
								if (markerService && updateData.MarkerToSave && response.MarkerToSave) {
									markerService.onUpdateDone(response.MarkerToSave);
								}
								serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
							}
						}
					},
					presenter: {
						tree: {
							parentProp: 'HsqCheckListFk',
							childProp: 'HsqCheckListChildren',
							initialState: 'expanded',
							incorporateDataRead: onReadSucceeded,
							initCreationData: function initCreationData(creationData) {
								var pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
								if (pinProjectEntity) {
									creationData.PrjProjectFk = pinProjectEntity.id;
								}

							}
						}
					},
					dataProcessor: [
						{processItem: angular.noop},
						hsqeCheckListDataReadonlyProcessor,
						documentsProjectFileActionProcessor,
						new ServiceDataProcessDatesExtension(['DateReceived', 'DateRequired', 'DatePerformed']),
						{ processItem: processItem, revertProcessItem: revertProcessItem }],
					sidebarSearch: {options: sidebarSearchOptions},
					sidebarWatchList: {active: true},
					entitySelection: {supportsMultiSelection: true},
					actions: {
						delete: {}, create: 'flat',
						canDeleteCallBackFunc: function (item) {
							var readonlyStatusItems = _.filter(lookupDescriptorService.getData('checkliststatus'), {IsReadonly: true});
							return !_.some(readonlyStatusItems, {Id: item.HsqChlStatusFk});
						}
					},
					translation: {
						uid: 'hsqeCheckListDataService',
						title: 'hsqe.checklist.title.header',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'HsqCheckListDto',
							moduleSubModule: 'Hsqe.CheckList'
						}
					}
				}
			};
			serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
			service = serviceContainer.service;

			var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
				var checkListTypeId = newData.HsqChkListTypeFk;
				var checkListType = _.find(lookupDescriptorService.getData('HsqeCheckListType'), {Id: checkListTypeId});
				let defaultCode = $translate.instant('cloud.common.isGenerated');
				if (null !== checkListType && !angular.isUndefined(checkListType) && (newData.Code === null || newData.Code === defaultCode)) {
					var basRubricCategoryFk = checkListType.BasRubricCategoryFk;
					checkListNumberGenerationSettingsService.assertLoaded().then(function () {
						platformRuntimeDataService.readonly(newData, [{
							field: 'Code',
							readonly: checkListNumberGenerationSettingsService.hasToGenerateForRubricCategory(basRubricCategoryFk)
						}]);
						newData.Code = checkListNumberGenerationSettingsService.provideNumberDefaultText(basRubricCategoryFk, newData.Code);
						var currentItem = service.getSelected();
						var result = {apply: true, valid: true};
						if (newData.Code === '') {
							result.valid = false;
							result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
						}
						platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
						platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
						if (currentItem.HsqCheckListTemplateFk) {
							$injector.get('hsqeCheckListValidationService').validateHsqCheckListTemplateFk(currentItem, currentItem.HsqCheckListTemplateFk);
						}
						service.fireItemModified(currentItem);

						if (checkListNumberGenerationSettingsService.hasToGenerateForRubricCategory(basRubricCategoryFk)) {
							service.gridRefresh();
						}
					});
				}

				return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
					if (service.completeEntityCreateed !== undefined) {
						service.completeEntityCreateed.fire(null, newData);
					}
				});
			};

			var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
			confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

			// define properties
			Object.defineProperties(service, {
				'checkListRubricFk': {
					get: function () {
						return 90;
					},
					enumerable: true
				}
			});

			var filters = [{
				key: 'hsqe-checklist-rubric-category-filter',
				serverSide: true,
				fn: function () {
					return 'RubricFk = ' + service.checkListRubricFk;
				}
			},
			{
				key: 'check-list-psdactivity-filter',
				serverSide: true,
				fn: function (item) {
					return 'ScheduleFk=' + item.PsdScheduleFk;
				}
			},
			{
				key: 'hsqe-checklist-project-filter',
				serverSide: true,
				fn: function () {
					return {
						IsLive: true,
						CompanyFk: platformContextService.clientId
					};
				}
			},
			{
				key: 'hsqe-checklist-pes-header-filter',
				serverKey: 'defect-main-pes-header-filter',
				serverSide: true,
				fn: function (item) {
					if (item) {
						return {
							CompanyFk: platformContextService.clientId,
							ProjectFk: item ? (item.PrjProjectFk === 0 ? null : item.PrjProjectFk) : null,
							ConHeaderFk: item.ConHeaderFk
						};
					}
				}
			},
			{
				key:'check-list-Contract-filter',
				serverKey:'hsqe-checklist-contract-filter',
				serverSide: true,
				fn:function(item) {
					let ConHeaderFk = null;
					let pesEntity = $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('invoicepes', item.PesHeaderFk);
					if (pesEntity) {
						ConHeaderFk = pesEntity.ConHeaderFk;
						if (ConHeaderFk === null) {
							ConHeaderFk = -1; // Mark: Has assigned pes, but pes CON_HEADER_FK = null, need filter no result
						}
					}

					return {
						ProjectFk: item.PrjProjectFk,
						Id: ConHeaderFk

					};
				}
			},
			{
				key:'check-list-Subsidiary-filter',
				serverKey:'hsqe-checklist-subsidiary-filter',
				serverSide: true,
				fn:function(item) {
					if (item){
						return {
							BusinessPartnerFk: item.BpdBusinesspartnerFk
						};
					}
				}
			},
			{
				key:'check-list-Contact-filter',
				serverKey:'hsqe-checklist-contact-filter',
				serverSide: true,
				fn:function(item) {
					if (item){
						return {
							BusinessPartnerFk: item.BpdBusinesspartnerFk,
							SubsidiaryFk: item.BpdSubsidiaryFk !== null ? item.BpdSubsidiaryFk : null
						};
					}
				}
			}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.getModuleState = function() {
				var readonlyStatus = false;
				var headerItem = service.getSelected();
				if (!!headerItem && headerItem.IsReadonlyStatus !== undefined && headerItem.IsReadonlyStatus) {
					readonlyStatus = true;
				}
				if (headerItem && headerItem.IsSameContextProjectsByCompany) {
					readonlyStatus = true;
				}
				return readonlyStatus;
			};

			service.getHeaderEditAble = function() {
				return !service.getModuleState();
			};

			serviceContainer.data.newEntityValidator = {
				validate: function validate() {
				}
			};

			function processItem(item) {
				if (item.Action) {
					item.Action.actionList = modelViewerMarkerUiService.createMarkerActions({
						item: item,
						markerFkProperty: 'MdlMarkerFk',
						modelFkProperty: 'MdlModelFk',
						itemService: service,
						isActionActive: isActionActive,
						getMarkerService: function () {
							return markerService;
						},
						pickPosition: pickPosition
					});
				}
			}

			function pickPosition(item) {
				var preselected;
				if (pickedItem && item && pickedItem.Id !== item.Id) {
					modelViewerPositioningService.detachPickPosition();
				}

				pickedItem = item;
				// the next line may have to be checked to ensure that the first parameter of function getDataService is correct----2017.08.23
				markerService = modelViewerMarkerService.getDataService(modelViewerMarkerService.markerTypes.defect, service, module);
				if (item && item.MdlModelFk && markerService) {
					var markerList = markerService.getList();
					var marker = _.find(markerList, {ModelFk: item.MdlModelFk, Id: item.MdlMarkerFk});
					preselected = {
						pos: {
							x: marker.PositionX,
							y: marker.PositionY,
							z: marker.PositionZ
						}, camPos: {
							x: marker.CameraPositionX,
							y: marker.CameraPositionY,
							z: marker.CameraPositionZ
						}
					};
				}
				modelViewerPositioningService.pickPosition(preselected).then(function (posInfo) {
					var saveMarker;
					if (!item.MdlMarkerFk) {
						saveMarker = markerService.createMarker(posInfo.pos, posInfo.campos).then(function (newMarker) {
							var item = service.getSelected();
							item.MdlModelFk = newMarker.ModelFk;
							item.MdlMarkerFk = newMarker.Id;
							service.markCurrentItemAsModified();
						});
					} else {
						markerService.modifyMarker(item.MdlMarkerFk, posInfo.pos, posInfo.campos);
						saveMarker = $q.when(true);
					}
					saveMarker.then(function () {
						processItem(item);
						service.gridRefresh();
					});
				});
			}

			function isActionActive(modelId) {
				var viewerModelId = modelViewerModelSelectionService.getSelectedModelId();
				var viewers = modelViewerViewerRegistryService.getViewers();
				var readyViewers = _.find(viewers, function (viewer) {
					return viewer.isReady();
				});
				var isViewerActive = !!readyViewers;
				return viewerModelId && (modelId && viewerModelId === modelId || !modelId) && isViewerActive;
			}

			function revertProcessItem(item) {
				if (item.Action) {
					item.Action.length = 0;
					delete item.Action;
				}
			}

			/** Set Module Header Info */
			service.setShowHeaderAfterSelectionChanged(function (entity /* , data */) {
				if (entity !== null && !_.isEmpty(entity)) {
					var project = lookupDescriptorService.getLookupItem('Project', entity.PrjProjectFk);// get from cache,but the lookup for porject is not completed(because with filter)
					if (project) {
						var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');
						basicsLookupdataLookupDataService.getItemByKey('Project', entity.PrjProjectFk).then(function (response) {
							if(response) {
								project = response;
								lookupDescriptorService.updateData('Project', [project]);
							}
							service.updateModuleHeaderInfo(project, entity);
						});
					} else {
						service.updateModuleHeaderInfo(project, entity);
					}
				} else {
					service.updateModuleHeaderInfo();
				}
			});

			service.updateModuleHeaderInfo = function (project, entity) {
				var entityObject = {};
				if (entity) {
					if(project) {
						entityObject.project = {
							id: project.Id,
							description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(project.ProjectNo, project.ProjectName, ' - ')
						}
					}
					entityObject.module = {
						id: entity.Id,
						description: cloudDesktopPinningContextService.concate2StringsWithDelimiter(entity.Code, entity.DescriptionInfo.Translated, ' - '),
						moduleName: moduleName
					}
				}
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameCheckList', entityObject);
			};

			service.createItemByTemplate = function createItemByTemplate(templateEntity) {
				if (templateEntity.IsGroup !== true) {
					/* $http.post(globals.webApiBaseUrl + 'hsqe/checklist/header/create',{}).then(function(res){
						var newItem = res.data;
						if(newItem) {
							newItem.HsqCheckListTemplateFk = templateEntity.Id;
							newItem.HsqChkListTypeFk = templateEntity.HsqCheckListTypeFk;
							newItem.HsqCheckListTypeEntity = null;
							newItem.HsqChlStatusEntity = null;
							newItem.PrcStructureFk = templateEntity.PrcStructureFk;
							newItem.DescriptionInfo = templateEntity.DescriptionInfo;
							serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data, {});
						}
					}); */

					var checklist = service.getSelected();
					var project = cloudDesktopPinningContextService.getPinningItem('project.main');
					var projectId = null;
					if (project) {
						projectId = project.id;
					}
					if (!projectId && checklist) {
						projectId = checklist.PrjProjectFk;
					}

					var param = {
						projectId: projectId,
						checkListTemplateId: templateEntity.Id,
						fromCheckListTemplate: 1,
						createCheckListFlg: 0
					};
					$http.post(globals.webApiBaseUrl + 'hsqe/checklist/wizard/createChecklist', param).then(function (response) {
						var createChecklists = response.data;
						if (createChecklists && createChecklists.length > 0) {
							var checklistTreeList = service.getList();
							_.forEach(createChecklists, function (item) {
								var _findItem = _.find(checklistTreeList, function (treeitem) {
									return treeitem.Code === item.Code;
								});
								if (!_findItem) {
									checklistTreeList.push(item);
								}
								service.copySuccess(item);
							});

						}
					});
				}
			};

			service.createObjectSet = function createObjectSet(data) {
				modelViewerDragdropService.paste().then(function (createParam) {
					var objectIds = createParam.includedObjectIds;
					var reqParameters = [];
					var param = {
						CheckListId: data.Id,
						MdlModelId: createParam.modelId,
						ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
					};
					reqParameters.push(param);
					var modelObjectService = $injector.get('hsqeCheckListModelObjectDataService');
					modelObjectService.createObjectSetToCheckList(reqParameters);
				});
			};
			service.ModelObjects = [];
			service.getModelObjects = function getModelObjects(modelId){
				if(angular.isUndefined(modelId) || modelId === null){
					modelId = modelViewerModelSelectionService.getSelectedModelId();
				}
				if(angular.isUndefined(modelId) || modelId === null){
					var modelEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'model.main'});
					if(modelEntity) {
						modelId = modelEntity.id;
					}
				}
				if(modelId) {
					$http.get(globals.webApiBaseUrl + 'model/main/object/list?mainItemId=' + modelId)
						.then(function (response) {
							service.ModelObjects = response.data;
						});
				}
			};

			function refreshAction() {
				angular.forEach(service.getList(), function (item) {
					processItem(item);
				});
				service.gridRefresh();
			}

			service.setActionActive = function () {
				loadSelectedModel();
			};
			function loadSelectedModel() {
				if (markerService) {
					markerService.unregisterListLoaded(setMarkerListLoaded);
				}
				var viewerModelId = modelViewerModelSelectionService.getSelectedModelId();
				if (viewerModelId) {
					markerService = modelViewerMarkerService.getDataService(modelViewerMarkerService.markerTypes.defect, service, module);
					markerService.isMarkerListLoaded = markerService.getMarkerListLoaded();
					markerService.registerListLoaded(setMarkerListLoaded);
					service.getModelObjects(viewerModelId);
				}
				refreshAction();

			}

			modelViewerViewerRegistryService.onViewersChanged.register(refreshAction);
			modelViewerViewerRegistryService.registerViewerReadinessChanged(refreshAction);
			modelViewerModelSelectionService.onSelectedModelChanged.register(loadSelectedModel);
			service.unregisterAll = function unregisterAll() {
				modelViewerViewerRegistryService.unregisterViewerReadinessChanged(refreshAction);
				modelViewerViewerRegistryService.onViewersChanged.unregister(refreshAction);
				modelViewerModelSelectionService.onSelectedModelChanged.unregister(loadSelectedModel);
				if (markerService) {
					markerService.unregisterListLoaded(setMarkerListLoaded);
				}
			};

			function setMarkerListLoaded() {
				if (markerService) {
					markerService.isMarkerListLoaded = markerService.getMarkerListLoaded();
				}
				refreshAction();
			}

			lookupDescriptorService.loadData(['CheckListStatus','HsqeCheckListType']);

			service.getList = function getList() {
				var itemList = serviceContainer.data.itemList;
				itemList = _.filter(itemList, {IsSearchItem: true});
				serviceContainer.data.itemList = itemList;
				if (serviceContainer.data.itemFilterEnabled) {
					var platformDataServiceItemFilterExtension = $injector.get('platformDataServiceItemFilterExtension');
					return platformDataServiceItemFilterExtension.filterList(serviceContainer.data);
				}
				return serviceContainer.data.itemList;
			};


			service.canCopy = function canCopy() {
				var selected = service.getSelected();
				return null !== selected && selected.HsqCheckListFk === null;
			};

			service.createDeepCopy = function createDeepCopy() {
				$http.post(globals.webApiBaseUrl + 'hsqe/checklist/header/deepcopy', service.getSelected())
					.then(function (response) {
						if(response.data.CheckListHeader.HsqCheckListFk === null) {
							service.copySuccess(response.data.CheckListHeader);
						}
					},
					function (/* error */) {
					});
			};

			service.copySuccess = function(checklist){
				serviceContainer.data.handleOnCreateSucceeded(checklist, serviceContainer.data);
			};

			service.createCheckListSuccess = function(checklist){
				serviceContainer.data.onCreateSucceeded(checklist,serviceContainer.data);
			};

			service.createSubDeepCopy = function createSubDeepCopy() {
				$http.post(globals.webApiBaseUrl + 'hsqe/checklist/header/subdeepcopy', service.getSelected()).then(function (response) {
					if(response.data) {
						var checklistHeader=response.data.CheckListHeader;
						var checklistList = service.getList();
						var parentItem = _.find(checklistList, {Id: checklistHeader.HsqCheckListFk});
						if (parentItem) {
							parentItem.HasChildren = true;
							if (parentItem.HsqCheckListChildren === null) {
								parentItem.HsqCheckListChildren = [];
							}
							parentItem.HsqCheckListChildren.push(checklistHeader);
						}
						service.copySuccess(checklistHeader);
					}
				});
			};

			service.navigateTo = function navigateTo(item, triggerfield) {
				var checklistId = null;
				var platformObjectHelper=$injector.get('platformObjectHelper');
				if (item && (platformObjectHelper.getValue(item, triggerfield) || item.HsqChecklistFk)) {
					checklistId = platformObjectHelper.getValue(item, triggerfield) || item.HsqChecklistFk;
				}
				cloudDesktopSidebarService.filterSearchFromPKeys([checklistId]);
			};

			return service;
		}
	]);
})(angular);
