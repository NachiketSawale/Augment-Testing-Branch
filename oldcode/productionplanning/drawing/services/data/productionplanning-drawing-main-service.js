/**
 * Created by zov on 02/04/2019.
 */
(function () {
	'use strict';
	/*global angular, _, globals, Platform*/

	var moduleName = 'productionplanning.drawing';
	var module = angular.module(moduleName);
	module.factory('productionplanningDrawingMainService', [
		'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService',
		'cloudDesktopPinningContextService',
		'basicsCommonMandatoryProcessor',
		'$injector',
		'$q',
		'$http',
		'platformDataServiceModificationTrackingExtension',
		'$rootScope',
		'$timeout',
		'platformRuntimeDataService',
		'productionplanningDrawingClobControllerService',
		'productionplanningCommonStructureFilterService',
		'productionplanningDrawingProcessor',
		'productionplanningDrawingStatusLookupService',
		'productionplanningDrawingNavigationExtension',
		'productionplanningDrawingPinningContextExtension',
		'ppsCommonDataserviceWorkflowCallbackExtension',
		'transportplanningTransportUtilService',
		'cloudDesktopInfoService',
		'basicsLookupdataLookupDescriptorService',
		'cloudDesktopSidebarService',
		function (
			platformDataServiceFactory,
			basicsLookupdataLookupFilterService,
			cloudDesktopPinningContextService,
			basicsCommonMandatoryProcessor,
			$injector,
			$q,
			$http,
			platformDataServiceModificationTrackingExtension,
			$rootScope,
			$timeout,
			platformRuntimeDataService,
			clobControllerService,
			ppsCommonStructureFilterService,
			drawingProcessor,
			drawingStatusLookupService,
			navigationExtension,
			pinningContextExtension,
			workflowCallbackExtension,
			transportplanningTransportUtilService,
			cloudDesktopInfoService,
			basicsLookupdataLookupDescriptorService,
			cloudDesktopSidebarService) {

			function registerLookupFilters() {
				var filters = [{
					key: 'productionplanning-drawing-controlling-unit-filter',
					fn: function (item, engDrawing) {
						return item.PrjProjectFk === engDrawing.PrjProjectFk;
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);
			}

			registerLookupFilters();

			let ResetFilter = false;
			var loadDrawingStatusCompleted = false;
			var changePartListInternally = false; // indicate part list is not changed by user
			var serviceInfo = {
				flatRootItem: {
					module: module,
					serviceName: 'productionplanningDrawingMainService',
					entityNameTranslationID: 'productionplanning.drawing.entityDrawing',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/drawing/',
						endRead: 'customfiltered',
						endDelete: 'multidelete',
						usePostForRead: true,
						extendSearchFilter: function extendSearchFilter(filterRequest) {
							if (filterRequest.PKeys && filterRequest.PKeys.length === 1 && filterRequest.furtherFilters) {
								var furtherfilter = _.find(filterRequest.furtherFilters, {Token: 'productionplanning.drawing'});
								if (furtherfilter && furtherfilter.Value === filterRequest.PKeys[0]) {
									filterRequest.PKeys = null;
								}
							}

							filterRequest.orderBy = [{Field: 'Code'}];
							ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningDrawingMainService', filterRequest);
							ppsCommonStructureFilterService.setFilterRequest('productionplanningDrawingMainService', filterRequest);
						}
					},
					entityRole: {
						root: {
							itemName: 'Drawing',
							moduleName: 'cloud.desktop.moduleDisplayNameEngineeringDrawing',
							handleUpdateDone: handleUpdateDone,
							useIdentification: true
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.dtos || []
								};
								service.resetFilter();
								return localData.handleReadSucceeded(result, data);
							},
							initCreationData: function initCreationData(creationData) {
								var ctx = cloudDesktopPinningContextService.getContext();
								if (!_.isNil(ctx)) {
									var f = _.find(ctx, {'token': cloudDesktopPinningContextService.tokens.projectToken});
									if (f) {
										creationData.PKey1 = f.id; // set project id for creationData
									}
								}
							},
							handleCreateSucceeded: function (newItem) {
								enSureInvalidValue(newItem);
							}
						}
					},
					sidebarWatchList: {active: true}, // enable watchlist for this module
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: false,
							pinningOptions: pinningContextExtension.createPinningOptions()
						}
					},
					entitySelection: {supportsMultiSelection: true},
					dataProcessor: [drawingProcessor],
					actions: {
						delete: {},
						create: 'flat',
						canDeleteCallBackFunc: function (selectedItem) {
							if (selectedItem.Version <= 0) {
								return true;
							}
							if (!selectedItem.EngDrawingStatusFk) {
								return false;
							}

							if (!loadDrawingStatusCompleted) { //ensure status has loaded
								return false;
							} else {
								var statusList = drawingStatusLookupService.getList();
								var status = _.find(statusList, {Id: selectedItem.EngDrawingStatusFk});
								return status && status.IsDeletable;
							}
						}
					}
				}
			};

			function enSureInvalidValue(newItem) {
				//ensure the validation correct
				if (newItem) {
					Object.keys(newItem).forEach(function (prop) {
						if (prop.endsWith('Fk')) {
							if (newItem[prop] === 0) {
								newItem[prop] = null;
							}
						}
					});
				}
			}

			function handleUpdateDone(updateData, response, data) {
				if (response.ClobToSave) {
					angular.merge(data.currentPartlist, response.ClobToSave);
					clearModifiedPartList();
				}
				data.handleOnUpdateSucceeded(updateData, response, data, true);

				if (updateData.PpsDocumentToSave) {
					reloadService({
						guid: '7c0fdef1f8c4447abe524ee7130e7d6e',
						containerId: 'productionplanning.drawing.drwrevision.list'
					});
				} else if (updateData.ProductDescriptionToSave && _.find(updateData.ProductDescriptionToSave, function (pdtoSave) {
					return !!pdtoSave.PpsDocumentToSave;
				})) {
					reloadService({
						guid: 'c490cfd649c94d02851bded0e77d2411',
						containerId: 'productionplanning.drawing.tmplrevision.list',
						reSelected: true,
						serviceName: 'ppsDrawingTmplRevisionDataService',
						httpSuffix: 'productionplanning/drawing/tmplrevision/',
						entityNameTranslationID: 'productionplanning.drawing.entityRevision',
						parentFactory: 'productionplanningProducttemplateProductDescriptionDataServiceFactory',
						parentService: 'productionplanningDrawingProductDescriptionDataService',
						parentFilter: 'productDescription',
						endRead: 'getbyproductdescription',
						isReadonly: true,
						itemName: 'TemplateRevisions'
					});
				}
				if(angular.isDefined(updateData.Drawing) && updateData.Drawing[0]) {
					service.updateModuleHeaderInfo(updateData.Drawing[0]);
				}
			}

			function reloadService(options) {
				var containerInfo = $injector.get('productionplanningDrawingContainerInformationService');
				var dataService = $injector.get(containerInfo.getContainerInfoByGuid(options.guid).dataServiceName);
				if(options.guid === 'c490cfd649c94d02851bded0e77d2411'){
					dataService = dataService.getService(options);
				}
				if (dataService) { //template revision's parent is changed from drawing revision to product template, not need to reselect the parent
					var selected2 = dataService.getSelected();
					dataService.unloadSubEntities();
					dataService.clearCache();
					if (transportplanningTransportUtilService.hasShowContainerInFront(options.containerId)) {
						dataService.load().then(function () {
							dataService.setSelected(selected2);
						});
					}
				}
			}

			var container = platformDataServiceFactory.createNewComplete(serviceInfo);
			var localData = container.data;
			var service = container.service;

			//added refresh after workflow
			workflowCallbackExtension.addWorkflowCallbackExtension(container);

			localData.modifiedPartList = null;
			localData.newEntityValidator = basicsCommonMandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'EngDrawingDto',
				moduleSubModule: 'ProductionPlanning.Drawing',
				validationService: 'productionplanningDrawingValidationService'
			});
			localData.loadPartListById = function (clobId) {
				if (clobId) {
					$http.get(globals.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + clobId).then(function (response) {
						if (response && response.data) {
							setCurrentPartList(response.data);
						}
					}, function () {
						setEmptyPartList();
					});
				} else {
					setEmptyPartList();
				}
			};
			/**
			 * @ngdoc filter
			 * @name onSetSelected
			 * @function
			 * @description React on selected item changed
			 * #
			 * Filters for
			 * @param {Object} e : in our case this is supposed to be null
			 * @param {Object} args : in our case this is supposed the new set boq item
			 */
			localData.onSetSelected = function onSetSelected(e, args) {
				if (!_.isNil(args)) {
					localData.loadPartListById(args.BasClobsFk);
				} else {
					setEmptyPartList();
				}
			};
			localData.provideUpdateData = function (updateData/*, data*/) {
				updateData.ClobToSave = localData.modifiedPartList;
			};

			function loadDrawingStatus() {
				drawingStatusLookupService.load().then(function () {
					loadDrawingStatusCompleted = true;
					var drawing = service.getSelected();
					if (drawing) {
						localData.selectionChanged.fire(null, drawing);
					}
				});
			}

			loadDrawingStatus();

			//register refreshRequested messenger
			localData.refreshRequested.register(function () {
				loadDrawingStatusCompleted = false;
				loadDrawingStatus();
			});

			function updateAndValidateField(entity, field, value) {
				entity[field] = value;
				var validSrv = $injector.get('productionplanningDrawingValidationService');

				var result = validSrv['validate' + field](entity, entity[field], field);
				platformRuntimeDataService.applyValidationResult(result, entity, field);

				if (result.valid && validSrv['asyncValidate' + field]) {
					validSrv['asyncValidate' + field](entity, entity[field], field).then((result) => {
						platformRuntimeDataService.applyValidationResult(result, entity, field);
						service.markItemAsModified(entity);
					});
				} else {
					service.markItemAsModified(entity);
				}

				if(field === 'PrjProjectFk') {
					updateAndValidateField(entity, 'Code', entity.Code);
				}
			}

			service.handleFieldChanged = function (entity, field) {
				switch (field) {
					case 'PrjProjectFk':
						$http.get(globals.webApiBaseUrl + 'logistic/job/ownedByProject?projectFk=' + entity.selectedProject.Id).then(function (respond) {
							if (!_.isNull(respond.data) && Array.isArray(respond.data)) {
								var defJob = _.find(respond.data, {IsProjectDefault: true});
								if (defJob) {
									updateAndValidateField(entity, 'LgmJobFk', defJob.Id);
								}
							}
						});
						// validate code again after project changed.
						updateAndValidateField(entity, 'Code', entity.Code);
						break;
					case 'LgmJobFk':
						if (entity.selectedLgmJob) {
							updateAndValidateField(entity, 'PrjProjectFk', entity.selectedLgmJob.ProjectFk);
						}
						break;
				}
			};

			service.enSureInvalidValue = enSureInvalidValue;

			service.getProjectId = function (drawing) {
				var projectId = -1;
				if (drawing && drawing.PrjProjectFk) {
					projectId = drawing.PrjProjectFk;
				}
				return projectId;
			};

			service.getSelectedProjectId = function () {
				return service.getProjectId(service.getSelected());
			};

			service.updateSelection = function (newItem) {
				var data = container.data;
				var existed = _.find(data.itemList, {Id: newItem.Id});
				if (existed) {
					if (newItem.Version !== existed.Version) {
						$injector.get('platformDataServiceDataProcessorExtension').doProcessItem(newItem, data);
						_.extend(existed, newItem);
						service.gridRefresh();
					}
				} else {
					$injector.get('platformDataServiceDataProcessorExtension').doProcessItem(newItem, data);
					data.itemList.push(newItem);
					$injector.get('platformDataServiceActionExtension').fireEntityCreated(data, newItem);
				}
				if (service.hasSelection()) {
					service.deselect().then(function () {
						service.setSelected(existed || newItem);
					});
				} else {
					service.setSelected(existed || newItem);
				}
			};

			service.currentPartListChanged = new Platform.Messenger();
			service.getCurrentPartList = function () {
				return localData.currentPartlist;
			};

			function setCurrentPartList(partList) {
				if (localData.currentPartlist !== partList) {
					changePartListInternally = true;
					localData.currentPartlist = partList;
					service.currentPartListChanged.fire(partList);
					$timeout(function () {
						changePartListInternally = false; // reset flag
					}, 500);
				}
			}

			function setEmptyPartList() {
				setCurrentPartList({
					Content: null,
					Id: 0,
					Version: 0
				});
			}

			service.setPartListAsModified = function (partList) {
				if (!changePartListInternally) {
					var selectedItem = service.getSelected();
					if (selectedItem && localData.modifiedPartList !== partList) {
						localData.modifiedPartList = partList;
						$rootScope.$emit('updateRequested', true); // Close evantually open grid editor to avoid loosing the focus in specification container caused by event fired in following markItemAsModified and by this unintentionally overwrite data in grid.
						service.markItemAsModified(selectedItem);
					}
				} else {
					changePartListInternally = false;
				}
			};

			function clearModifiedPartList() {
				localData.modifiedPartList = null;
			}

			service.registerEvents = function () {
				service.registerSelectionChanged(localData.onSetSelected);
			};

			service.onDestroy = function () {
				service.unregisterSelectionChanged(localData.onSetSelected);
			};

			setEmptyPartList();

			//for navigational function
			navigationExtension.addNavigation(service);

			clobControllerService.decorateMainService(container);

			// emplatory solution for creating new item by custom creation data, it is better implemented in the base class.
			service.createItemSimple = function createItem(creationOptions, customCreationData, onCreateSucceeded) {
				var data = container.data;
				var creationData = _.merge(data.doPrepareCreate(data, creationOptions), customCreationData);
				return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
			};

			service.updateSimple = function (updateData) {
				return container.data.doCallHTTPUpdate(updateData, container.data);
			};

			service.getCode = function (engDrawingTypeFk, lgmJobFk) {
				if (!_.isNil(engDrawingTypeFk) && !_.isNil(lgmJobFk)) {
					var generateCodeUrl = globals.webApiBaseUrl + 'productionplanning/drawing/getCode?drawingTypeId=' + engDrawingTypeFk + '&&lgmJobId=' + lgmJobFk;
					return $http.get(generateCodeUrl).then(function (generatedCode) {
						return generatedCode;
					});
				} else {
					var defer = $q.defer();
					defer.resolve();
					return defer.promise;
				}
			};

			/* Show Module Header */
			var selectedDrawingProject = {};

			service.updateModuleHeaderInfo = function (drawing) {
				if (drawing !== null && !_.isEmpty(drawing)) {
					selectedDrawingProject = {};
					var project = basicsLookupdataLookupDescriptorService.getLookupItem('Project', drawing.PrjProjectFk);
					if (project) {
						selectedDrawingProject = {
							ProjectNo: project.ProjectNo,
							ProjectName: project.ProjectName,
							ProjectId: project.Id
						};
					}
					setHeaderInfo(drawing);
				}
			};

			function setHeaderInfo (drawing) {
				let entityHeaderObject = {};
				if (drawing && angular.isDefined(drawing)) {
					if (selectedDrawingProject && selectedDrawingProject.ProjectNo) {
						entityHeaderObject.project = {
							id: selectedDrawingProject.ProjectId,
							description: selectedDrawingProject.ProjectNo + ' - ' + selectedDrawingProject.ProjectName
						}
					}
					if (drawing && drawing.Code) {
						entityHeaderObject.module = {
							id: drawing.Id,
							description: drawing.Code + (isEmptyString(drawing.Description) ? '' : ' - ' + drawing.Description),
							moduleName: moduleName
						}
					}
				}
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameEngineeringDrawing', entityHeaderObject);
			}

			function isEmptyString(text) {
				return _.isNil(text) || text.trim() === '';
			}
			service.setShowHeaderAfterSelectionChanged(service.updateModuleHeaderInfo);

			service.resetFilter = (reset) =>{
				if(ResetFilter) {
					cloudDesktopSidebarService.filterResetPattern();
					cloudDesktopPinningContextService.setContext([]);
					service.unHookRequiresRefresh();
					ResetFilter = false;
				}
				else if(reset){
					ResetFilter = true;
				}
			};

			return service;
		}]);
})();