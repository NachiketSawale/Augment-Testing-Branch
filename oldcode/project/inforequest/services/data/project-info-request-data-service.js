/*
 * $Id: project-info-request-data-service.js 523418 2018-11-27 14:28:02Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardStepDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardStepDataService is a data service for managing steps of generic wizard  instances.
	 */
	module.factory('projectInfoRequestDataService', ['_', '$injector', '$http', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'cloudDesktopPinningContextService', 'cloudDesktopSidebarService',
		'platformDataServiceMandatoryFieldsValidatorFactory', 'platformRuntimeDataService', '$q',
		'platformModalFormConfigService', '$translate', 'basicsLookupdataConfigGenerator',
		'platformDataServiceActionExtension', 'projectInfoRequestProcessorService', 'platformPermissionService', 'permissions',
		'modelViewerToggleObjectSelectionHelperService', 'platformGenericStructureService', 'platformObservableService', 'modelViewerViewerRegistryService', 'modelViewerModelIdSetService',

		function (_, $injector, $http, platformDataServiceFactory,
			platformDataServiceProcessDatesBySchemeExtension,
			cloudDesktopPinningContextService, cloudDesktopSidebarService,
			fieldsValidatorFactory, platformRuntimeDataService, $q,
			platformModalFormConfigService, $translate, basicsLookupdataConfigGenerator,
			platformDataServiceActionExtension, projectInfoRequestProcessorService, platformPermissionService, permissions,
			modelViewerToggleObjectSelectionHelperService, platformGenericStructureService, platformObservableService, modelViewerViewerRegistryService, modelViewerModelIdSetService) {

			var container;
			var projectInfoRequestDataServiceOption = {
				flatRootItem: {
					module: module,
					serviceName: 'projectInfoRequestDataService',
					entityNameTranslationID: 'project.translation.resourceEntity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'project/rfi/informationrequest/',
						usePostForRead: true,
						endRead: 'filtered',
						endDelete: 'multidelete',
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();
							if (groupingFilter) {
								filterRequest.groupingFilter = groupingFilter;
							}
						},
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'InfoRequestDto',
						moduleSubModule: 'Project.InfoRequest'
					}), {
						processItem: processItem,
						revertProcessItem: revertProcessItem
					}, projectInfoRequestProcessorService],
					modification: {},
					entityRole: {
						root: {
							itemName: 'Requests',
							moduleName: 'cloud.desktop.moduleDescriptionProjectInfoRequest',
							mainItemName: 'Request',
							useIdentification: true,
							showProjectHeader: {
								getProject: function (entity) {
									return (entity) ? entity.Project : null;
								}
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								for (var prop in creationData) {
									if (creationData.hasOwnProperty(prop)) {
										delete creationData[prop];
									}
								}
								var context = cloudDesktopPinningContextService.getPinningItem('project.main');
								if (context) {
									if (context.id.Id !== undefined) {
										creationData.PKey1 = context.id.Id;
									} else {
										creationData.PKey1 = context.id;
									}
								} else {
									initCreationDataWithCreateResult(creationData);
								}

								var modelContext = cloudDesktopPinningContextService.getPinningItem('model.main');
								if (modelContext) {
									if (modelContext.id.Id !== undefined) {
										creationData.PKey2 = modelContext.id.Id;
									} else {
										creationData.PKey2 = modelContext.id;
									}
								}

							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: modName,
							enhancedSearchEnabled: true,
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							showOptions: false,
							//showProjectContext: true,
							withExecutionHints: false,
							pinningOptions: {
								isActive: true,
								showPinningContext: [{token: 'project.main', show: true}, {token: 'model.main', show: true}],
								setContextCallback: setProjectPinningContext,
								setModelContextCallback:setModelPinningContext,
								disableModelContextBtnCallback:function (selected) {
									return selected.ModelFk <= 0;
								},
							}
						}
					}
				}
			};

			const globalSettings = {
				overwriteBlacklist: _.assign(platformObservableService.createObservableBoolean({
					initialValue: true
				}), {
					uiHints: {
						id: 'toggleOverwriteBlacklist',
						caption$tr$: 'model.annotation.updateBlacklist',
						iconClass: 'tlb-icons ico-set-model-blacklist'
					}
				}),
				cuttingPlanes: _.assign(platformObservableService.createObservableBoolean({
					initialValue: true
				}), {
					uiHints: {
						id: 'toggleCutObjects',
						caption$tr$: 'model.annotation.cuttingPlanes ',
						iconClass: 'tlb-icons ico-set-cutting-planes'
					}
				})
			};

			container = platformDataServiceFactory.createNewComplete(projectInfoRequestDataServiceOption);
			container.data.newEntityValidator = fieldsValidatorFactory.createValidator('projectInfoRequestValidationService', 'Code');
			var service = container.service;

			var createInProject = {};

			function initCreationDataWithCreateResult(creationData) {
				creationData.PKey1 = createInProject.Id;
				creationData.PKey2 = createInProject.PKey2;
				creationData.PKey3 = createInProject.PKey3;
				delete createInProject.Id;
				delete createInProject.PKey2;
				delete createInProject.PKey3;
			}

			service.registerSelectionChanged(function (e, item) {
				if (item) {
					service.setReadOnly(item.IsStatusReadOnly);
				}
			});
			service.setReadOnly = function setReadOnly(isreadonly) {

				if (isreadonly) {
					platformPermissionService.restrict(
						[
							// rfi parent
							'281de48b068c443c9b7c62a7f51ac45f',
							// Container relevant to
							'55f24a16454c4b8ab9fbf2e4fe2e90e6',
							// Container contribution
							'65becece765a419099b148c803a116f5',
							// Container model annotation marker
							'cf264c9dbb51466cb147e1a7f7f5d888',
						],
						permissions.read);
				} else {
					platformPermissionService.restrict(
						[
							// rfi parent
							'281de48b068c443c9b7c62a7f51ac45f',
							// Container relevant to
							'55f24a16454c4b8ab9fbf2e4fe2e90e6',
							// Container contribution
							'65becece765a419099b148c803a116f5',
							// Container model annotation marker
							'cf264c9dbb51466cb147e1a7f7f5d888',
						], false);
				}
			};
			service.createItem = function createInfoRequest(creationOptions) {
				if (hasContext()) {
					return platformDataServiceActionExtension.createItem(creationOptions, container.data);
				}
				return $http.post(globals.webApiBaseUrl + 'basics/customize/rubriccategory/list').then(function (response) {
					let res = _.find(response.data, {RubricFk: 39, IsDefault: true, IsLive: true});
					_.assign(container.data, {resItem: res});
					return getProjectForRfiCreation(creationOptions, createInProject, container.data);
				});
			};

			function hasContext() {
				var context = cloudDesktopPinningContextService.getContext();
				var findPinning = _.find(context, {'token': 'project.main'});
				return (context && findPinning !== undefined && findPinning !== null);
			}

			function setProjectPinningContext(dataService) {
				const currentItem = dataService.getSelected();
				if (currentItem) {
					let projectPromise = $q.when(true);
					const pinningContext = [];

					if (angular.isNumber(currentItem.ProjectFk)) {
						projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.ProjectFk).then(function (pinningItem) {
							pinningContext.push(pinningItem);
						});
					}

					return $q.all([projectPromise]).then(
						function () {
							if (pinningContext.length > 0) {
								cloudDesktopPinningContextService.setContext(pinningContext, dataService);
							}
						});
				}
			}

			function setModelPinningContext(dataService) {
				return cloudDesktopPinningContextService.setCurrentModelToPinnningContext(dataService, 'ModelFk', 'ProjectFk');
			}

			function getProjectForRfiCreation(options, initData, data) {
				var modalCreateProjectConfig = {
					title: $translate.instant('project.inforequest.createRfiTitle'),
					resizeable: true,
					dataItem: {
						ProjectFk: null,
						ModelFk: null,
						RubricCategoryFk: data.resItem.Id
					},
					formConfiguration: getInfoRequestCreateFormConfig(),
					handleOK: function handleOK(result) {// result not used
						initData.Id = result.data.ProjectFk;
						initData.PKey2 = result.data.ModelFk;
						initData.PKey3 = result.data.RubricCategoryFk;

						return platformDataServiceActionExtension.createItem(options, data);
					},
					dialogOptions: {
						disableOkButton: function () {
							return !modalCreateProjectConfig.dataItem.ProjectFk;
						}
					}
				};

				return platformModalFormConfigService.showDialog(modalCreateProjectConfig);
			}

			container.service.setActionActive = function () {
			};

			function processItem(item) {
				var fields = [
					{
						field: 'ModelFk',
						readonly: !!item.ModelFk
					}
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			function revertProcessItem(item) {
				if (item.Action) {
					item.Action.length = 0;
					delete item.Action;
				}
			}

			service.navigation = function (item, triggerfield) {
				if (!item || !triggerfield) return;
				if (triggerfield === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)){
					const ids = item.Ids.split(',').map(id => id.trim()).filter(id => id);
					if (ids.length > 0) {
						cloudDesktopSidebarService.filterSearchFromPKeys(ids);
					}
				}
			};

			function getInfoRequestCreateFormConfig() {
				return {
					fid: 'change.main.createChangeOrder',
					version: '1.0.0',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: ['projectfk']
					}],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'projectfk',
							model: 'ProjectFk',
							sortOrder: 1,
							label: 'Project',
							label$tr$: 'cloud.common.entityProjectName',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelProjectModelLookupDataService',
							filter: function (item) {
								return !_.isNil(item.ProjectFk) ? item.ProjectFk : -1;
							},
							enableCache: true,
							showClearButton: true
						}, {
							gid: 'baseGroup',
							rid: 'modelfk',
							model: 'ModelFk',
							sortOrder: 2,
							label$tr$: 'model.main.entityModel',
							label: 'Model',
						}),
						{
							gid: 'baseGroup',
							rid: 'rubricCategoryFk',
							model: 'RubricCategoryFk',
							required: true,
							sortOrder: 3,
							label$tr$: 'change.main.entityBasRubricCategoryFk',
							label: 'Rubric Category',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'project-inforequest-rubric-category-lookup-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RubricCategoryByRubricAndCompany',
								displayMember: 'Description'
							}
						}
					]
				};
			}

			let modelAnnotationMarkerDisplayService = null;

			container.data.onReadSucceeded = function onReadSucceeded(readData, data) {
				let modelContext = cloudDesktopPinningContextService.getPinningItem('model.main');
				if (modelContext) {
					readData.dtos = _.filter(readData.dtos, function (item){
						return item.ModelFk === modelContext.id;
					});
				}

				return container.data.handleReadSucceeded(readData.dtos, data);
			};

			const originalOnDeleteDone = container.data.onDeleteDone;
			container.data.onDeleteDone = function (deleteParams) {
				if (!modelAnnotationMarkerDisplayService) {
					modelAnnotationMarkerDisplayService = $injector.get('modelAnnotationMarkerDisplayService');
				}

				const delItems = Array.isArray(deleteParams.entities) ? deleteParams.entities : [deleteParams.entity];
				for (let item of delItems) {
					modelAnnotationMarkerDisplayService.removeAnnotationParent(`!InfoRequest!${item.Id}`);
				}

				return originalOnDeleteDone.apply(this, arguments);
			};

			service.retrieveModelObjectIds = function (info) {
				return $http.get(globals.webApiBaseUrl + 'project/rfi/rfi2mdlobject/objids', {
					params: {
						rfiIds: _.join(_.map(info.items, rfi => rfi.Id), ':'),
						modelId: info.modelId
					}
				}).then(r => r.data);
			};

			service.registerSelectionChanged(function (e, entity) {
				const viewer = modelViewerViewerRegistryService.getViewers();
				if (entity && entity.Camera) {
					if (viewer && entity.Camera.Id !== 0) {
						_.forEach(viewer, function (v) {
							if (!v.isReady()) {
								return;
							}

							v.showCamPos({
								pos: {
									x: entity.Camera.PosX,
									y: entity.Camera.PosY,
									z: entity.Camera.PosZ
								},
								trg: {
									x: entity.Camera.PosX + entity.Camera.DirX,
									y: entity.Camera.PosY + entity.Camera.DirY,
									z: entity.Camera.PosZ + entity.Camera.DirZ
								}
							});
							if (globalSettings.overwriteBlacklist.getValue()) {
								const bl = v.getFilterEngine().getBlacklist();
								bl.excludeAll();

								if (entity.Camera.HiddenMeshIds) {
									const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(entity.Camera.HiddenMeshIds).useSubModelIds();
									bl.includeMeshIds(meshIds);
								}
							}
							if (globalSettings.cuttingPlanes.getValue()) {
								if (Array.isArray(entity.Camera.ClippingPlanes) && entity.Camera.ClippingPlanes.length > 0) {
									v.setCuttingPlane(entity.Camera.ClippingPlanes);
									v.setCuttingActive();
								} else {
									v.setCuttingInactive();
								}
							}
						});
					}
				}
			});



			modelViewerToggleObjectSelectionHelperService.initializeObservable({
				dataService: service,
				titleKey: 'project.inforequest.selectObjects',
				initialValue: true
			});

			return service;
		}
	]);
})();
