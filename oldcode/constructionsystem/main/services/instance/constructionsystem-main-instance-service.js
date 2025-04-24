(function (angular) {
	'use strict';

	// eslint-disable-next-line no-unused-vars
	/* global globals,_ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionsystem main instance grid/form controller.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstanceService', ['$http', 'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService', 'constructionSystemMainHeaderService',
		'cloudDesktopSidebarService', '$translate', 'platformModalService', 'PlatformMessenger',
		'constructionSystemMainFilterService', '$injector', '$log', '_', 'basicsLookupdataLookupDescriptorService',
		'cloudDesktopPinningContextService', 'constructionSystemMainLocationService',
		'constructionSystemMainControllingService', 'constructionSystemMainBoqService', 'constructionSystemMainObjectService',
		'$q', '$timeout', 'basicsCommonGridCellService', 'cloudDesktopInfoService',
		'constructionsystemMainInitFilterService', 'constructionsystemMainObjectHierarchicalDataService',
		'modelViewerStandardFilterService', 'constructionSystemMainInstanceHeaderParameterService', 'platformRuntimeDataService',
		'platformDataValidationService', 'platformGridAPI', 'constructionsystemMainCommonLookupService', 'basicsCostGroupAssignmentService',
		'platformContextService', 'constructionSystemCommonPropertyNameLookupService',
		function ($http, platformDataServiceFactory, basicsLookupdataLookupFilterService,
			constructionSystemMainHeaderService, cloudDesktopSidebarService, $translate, platformModalService,
			PlatformMessenger, constructionSystemMainFilterService, $injector, $log, _, basicsLookupdataLookupDescriptorService,
			cloudDesktopPinningContextService, locationService, controllingService, boqService,
			objectService, $q, $timeout, basicsCommonGridCellService, cloudDesktopInfoService,
			constructionsystemMainInitFilterService, constructionsystemMainObjectHierarchicalDataService,
			modelViewerStandardFilterService, instanceHeaderParameterService, platformRuntimeDataService,
			platformDataValidationService, platformGridAPI, cosMainCommonLookupService, basicsCostGroupAssignmentService,platformContextService,
			constructionSystemCommonPropertyNameLookupService) {

			var sidebarSearchOptions = {
				moduleName: moduleName,
				enhancedSearchEnabled: true,
				pattern: '',
				pageSize: 100,
				useCurrentClient: null, // mike: disable show options cause it must filter by line item context of login company when enter the module.
				includeNonActiveItems: false,
				showOptions: true,
				showProjectContext: false,
				pinningOptions: {
					isActive: true,
					showPinningContext: [{token: 'project.main', show: true}, {
						token: 'estimate.main',
						show: true
					}, {token: 'model.main', show: true}, {token: 'constructionsystem.main', show: true}],
					setContextCallback: setCurrentPinningContext // useless in construction.main and this is only used for toolbar (pin)
				},
				withExecutionHints: false,
				includeDateSearch:true,
				enhancedSearchVersion: '2.0'
			};

			let currentSelectedProjectId;
			let currentSelectedModelId;
			let currentInstanceHeaderId;
			let currentSelectedEstimateHeaderId;
			let currentBoqHeaderId;
			let currentProjectEntity = {};
			let currentInsHeaderEntity = {};
			let customFurtherFilters = [];

			let isFromApi = false;

			let currentSelectInstanceId;
			let currentInstanceHeaderInfo = {};
			let serviceOption = {
				flatRootItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainInstanceService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/instance/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function (readData, data) {
							readData.StructuresFilters = constructionSystemMainFilterService.getFilters();
							angular.extend(readData, data.searchFilter);
							readData.CustomFurtherFilter = customFurtherFilters;
						}
					},
					entityRole: {
						root: {
							useIdentification: true,
							itemName: 'Instances',
							moduleName: 'cloud.desktop.moduleDisplayNameConstructionSystemInstance',
							codeField: 'Code',
							descField: 'DescriptionInfo.Translated',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							showProjectHeader: {
								getProject: function (entity) {
									if (entity) {

										return currentProjectEntity;
									}
								},
								getHeaderEntity: function (entity) {
									if (entity) {
										return currentInsHeaderEntity;
									}

								},
								getHeaderOptions: function () {
									return {codeField: 'Code', descField: 'DescriptionInfo.Translated'};
								}
							},
							handleUpdateDone: handleUpdateDone
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								$injector.get('constructionsystemMainCommonLookupService').setSysOpts(readData.SystemOptions);
								basicsLookupdataLookupDescriptorService.updateData('CosTemplate', readData.CosTemplate);

								service.assignCostGroups(readData);

								/** @namespace readData.InstanceHeaderProjectInfoDto */
								/** @namespace readData.IsFavoritesJump */
								if (readData.InstanceHeaderProjectInfoDto) {
									service.setSelectedProjectInfo(readData.InstanceHeaderProjectInfoDto);
									setTitleShowData(readData.InstanceHeaderProjectInfoDto);
									service.setCurrentInstanceHeaderInfo(readData.InstanceHeaderProjectInfoDto);
									if (readData.IsFavoritesJump) {
										setCurrentInstanceHeader(readData.InstanceHeaderProjectInfoDto, true, service);
									}
								}
								data.selectedItem = null;
								data.handleReadSucceeded(readData, data);
								serviceContainer.data.selectionChanged.fire();
								if (readData.dtos && readData.dtos.length === 0) {
									serviceContainer.data.selectionChanged.fire();
								} else if (currentSelectInstanceId) {
									setInstanceSelected();
								} else {
									service.goToFirst(data);
								}
								service.onContextUpdated.fire();
								if (readData.InstanceHeaderProjectInfoDto){
									platformContextService.setPermissionObjectInfo(readData.InstanceHeaderProjectInfoDto.PermissionObjectInfo || null);
								}

							}
						}
					},
					actions: {delete: true, create: true},
					sidebarSearch: {
						options: sidebarSearchOptions
					},
					entitySelection: {supportsMultiSelection: true},
					sidebarWatchList: {active: true},
					translation: {
						uid: 'constructionSystemMainInstanceService',
						title: 'constructionsystem.main.instanceGridContainerTitle',
						columns: [
							{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'InstanceDto',
							moduleSubModule: 'ConstructionSystem.Main'
						}
					}
				}
			};


			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = serviceContainer.service;
			let selectedProjectInfo = null;

			service.getSelectedProjectInfo = function getSelectedProjectInfo() {
				return selectedProjectInfo;
			};
			service.setSelectedProjectInfo = function setSelectedProjectInfo(projectEntity) {
				selectedProjectInfo = {
					ProjectNo: projectEntity.ProjectNo,
					ProjectName: projectEntity.ProjectName,
					ProjectId: projectEntity.ProjectId,
					ProjectCurrency: projectEntity.CurrencyFk,
					PrjCalendarId: projectEntity.CalendarFk
				};
			};
			let doReadDataFromBase = serviceContainer.data.doReadData;

			let startUpFilter = platformContextService.getApplicationValue('cloud.desktop.StartupParameter');
			if (startUpFilter && startUpFilter.furtherFilter && startUpFilter.furtherFilter.navInfo && startUpFilter.furtherFilter.navInfo.project && startUpFilter.furtherFilter.navInfo.id && startUpFilter.furtherFilter.navInfo.extparams){
				currentSelectedProjectId = parseInt(startUpFilter.furtherFilter.navInfo.project);
				currentInstanceHeaderId = parseInt(startUpFilter.furtherFilter.navInfo.id);
				currentSelectedEstimateHeaderId = parseInt(startUpFilter.furtherFilter.navInfo.extparams);
				isFromApi = true;
			} else if(startUpFilter && startUpFilter.furtherFilter && startUpFilter.projectContextId && _.isArray(startUpFilter.filter) && startUpFilter.filter.length > 0){
				currentSelectedProjectId = startUpFilter.projectContextId; // add fallback condition to handle projectContextId and filter values in startUpFilter for project navigator
				currentInstanceHeaderId = startUpFilter.furtherFilter[0].Value;
				isFromApi = true;
			}
			serviceContainer.data.doReadData = function doReadData(data) {
				let searchPattern = '';
				if (data.searchFilter && data.searchFilter.Pattern){
					searchPattern = data.searchFilter.Pattern;
				}
				// deal with F5 refresh on the construction system instance main page.
				if (angular.isNumber(currentSelectedProjectId) &&
					angular.isNumber(currentInstanceHeaderId) &&
					angular.isNumber(currentSelectedEstimateHeaderId)) {
					if (!data.searchFilter || isFromApi) {
						data.searchFilter = {
							ExecutionHints: sidebarSearchOptions.withExecutionHints,
							PageNumber: 0,
							PageSize: sidebarSearchOptions.pageSize,
							ProjectContextId: currentSelectedProjectId,
							useCurrentClient: sidebarSearchOptions.useCurrentClient,
							PinningContext: cloudDesktopPinningContextService.getContext()
						};
						if (isFromApi){
							data.searchFilter.Pattern = searchPattern;
						}
					}
					return doReadDataFromBase(data);
				}
				if (data.searchFilter && data.searchFilter.furtherFilters && angular.isArray(data.searchFilter.furtherFilters) && data.searchFilter.furtherFilters.length === 1 && data.searchFilter.furtherFilters[0].Token === 'COS_INS_HEADER') {
					return doReadDataFromBase(data);
				}

				platformModalService.showErrorBox('constructionsystem.main.entryError', 'Error');// todo-mike:localize the text.

				return $q.when(true);
			};

			var i = 0;
			serviceContainer.service.createDeepCopy = function createDeepCopy() {
				if (i === 0 || i === 2) {
					i = 1;
					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/execute', serviceContainer.service.getSelected()).then(function (response) {

						serviceContainer.service.syncCostGroups([response.data.Instance], [response.data]);
						service.setList(_.union(service.getList(), [response.data.Instance]));
						service.goToLast();
						i = 2;
					// serviceContainer.data.handleOnCreateSucceeded(response.data.Instance, serviceContainer.data);
					},
					function (/* error */) {
					});
				}
			};

			// region Column change for isusermodified column
			service.gridIdForReset = null;

			service.setGridIdForRest = function (gridId) {
				service.gridIdForReset = gridId;
			};
			service.setScope = function setScope(scope) {
				service.parentScope = scope;
			};
			service.reset = function reset() {
				deleteDynamicColumnsLayoutToGrid();
			};

			var data = {
				sectionId: 33, // Resource characteristic section Id
				isInitialized: false,
				colPrefix: 'isusermodified',
				resGridId: service.gridIdForReset, // Estimate resource grid Id to add columns manually

				chars: [], // Resource characteristics from all resources
				charsDefaultDictionary: {}, // Default characteristics per estimate module, when estimate is refreshed, defaults characteristics will got the latest changes
				charsDictionary: {} // Characteristics to control dynamic columns in estimate resource container
			};

			function deleteDynamicColumnsLayoutToGrid() {
				var platformGridAPI = $injector.get('platformGridAPI');

				var grid = platformGridAPI.grids.element('id', service.gridIdForReset);
				if (grid && grid.instance) {
					var cols = grid.columns.current;

					var allColumns = _.filter(cols, function (col) {
						return col.id !== data.colPrefix;
					});

					platformGridAPI.columns.configuration(service.gridIdForReset, allColumns);
					platformGridAPI.grids.resize(service.gridIdForReset);

				}
			}

			// end region setting is user modified

			service.instanceHeaderDto = null;
			service.getInstanceHeaderDto = function () {
				var defer = $q.defer();
				if (service.instanceHeaderDto === null) {
					var selectedInstanceDto = service.getSelected();
					if (selectedInstanceDto) {
						var instanceHeaderFk = selectedInstanceDto.InstanceHeaderFk;
						$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/getInstanceHeaderById?cosInsHeaderId=' + instanceHeaderFk).then(function (response) {
							service.instanceHeaderDto = response.data;
							defer.resolve(service.instanceHeaderDto);
						}, function () {
							defer.reject(null);
						});
					}
				} else {
					defer.resolve(service.instanceHeaderDto);
				}
				return defer.promise;
			};

			service.registerListLoaded(function () {
				service.syncModelViewWithCheckedInstances();
			});

			/* jshint -W074 */ // Cyclomatic complexity
			function initContext() {
				if (!angular.isNumber(currentSelectedProjectId) || !angular.isNumber(currentInstanceHeaderId) || !angular.isNumber(currentSelectedEstimateHeaderId) || !angular.isNumber(currentSelectedModelId)) {

					var context = cloudDesktopPinningContextService.getContext();
					if (context !== undefined && context !== null) {
						for (var i = 0; i < context.length; i++) {
							if (context[i].token === 'project.main') {
								currentSelectedProjectId = context[i].id;
							}
							else if (context[i].token === 'estimate.main') {
								currentSelectedEstimateHeaderId = context[i].id;
								constructionsystemMainInitFilterService.setEstHeaderId(currentSelectedEstimateHeaderId, currentSelectedProjectId);
							}
							else if (context[i].token === 'model.main') {
								currentSelectedModelId = context[i].id;
							}
							else if (context[i].token === 'constructionsystem.main') {
								currentInstanceHeaderId = context[i].id;
							}
							else if (context[i].token === 'boq.main') {
								currentBoqHeaderId = context[i].id;
							}
						}
						setLeadingStructuresFilters(currentSelectedProjectId);
						instanceHeaderParameterService.setInstanceHeaderId(currentInstanceHeaderId);
						constructionSystemCommonPropertyNameLookupService.setCurrentModelId(currentSelectedModelId);
					}
				}
			}

			service.ensureInitContext = function () {
				initContext();
			};

			var constructionSystemMainModelFilterService = $injector.get('constructionSystemMainModelFilterService');
			service.syncModelViewWithCheckedInstances = function () {// collect instances id which is checked
				modelViewerStandardFilterService.updateMainEntityFilter();
			};
			service.sync3DViewerIfSelectedIsChecked = function () {
				var selectedItem = service.getSelected();
				if (selectedItem && selectedItem.IsChecked) {
					service.updateAndExecute(service.syncModelViewWithCheckedInstances);
				}
			};

			var lookupFilters = [
				{
					key: 'costgroupfk-for-construction-system-main-filter',
					serverSide: true,
					fn: function (item) {
						if (item) {
							var model = _.find(constructionSystemMainHeaderService.getAllData(), {'Id': item.HeaderFk});
							// var model = constructionSystemMainHeaderService.getItemById(item.HeaderFk);
							if (model) {
								var lineItemContextFk = model.LineItemContextFk;
								return 'LineItemContextFk=' + (lineItemContextFk > -1 ? lineItemContextFk : '-1');

							}
						}
					}
				},
				{
					key: 'construction-system-main-instance-template-filter',
					fn: function (context) {
						var current = service.getSelected();
						if (current && angular.isDefined(current.Id)) {
							return context.CosHeaderFk === current.HeaderFk;
						}

						return false;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

			service.updatedDoneMessenger = new PlatformMessenger();
			service.templateChangedMessenger = new PlatformMessenger();
			service.onContextUpdated = new PlatformMessenger();
			service.onQuantityChanged = new PlatformMessenger();
			service.onSelectStatementChanged = new PlatformMessenger();
			service.registerSelectStatementChanged = function (fn) {
				service.onSelectStatementChanged.register(fn);
			};
			service.unregisterSelectStatementChanged = function (fn) {
				service.onSelectStatementChanged.unregister(fn);
			};
			service.fireSelectStatementChanged = function (e, args) {
				service.onSelectStatementChanged.fire(e, args);
			};

			service.formatterData = function (newData) {
				_.forEach(newData, function (item) {
					if (!item.__rt$data) {
						item.__rt$data = {};
					}
				});
			};

			service.templateChangedMessenger.register(function (e, args) {
				var isSelectStatementChanged = false;
				var template = _.find(basicsLookupdataLookupDescriptorService.getData('CosTemplate'), {Id: args.templateId});
				if(template){
					args.entity.SelectStatement = template.SelectStatement;
					isSelectStatementChanged = true;
				}
				else{
					var cosMaster = _.find(constructionSystemMainHeaderService.getAllData(), {'Id': args.entity.HeaderFk});
					if(cosMaster){
						args.entity.SelectStatement = cosMaster.SelectStatement;
						isSelectStatementChanged = true;
					}
				}

				if(isSelectStatementChanged){
					service.markItemAsModified(args.entity);
					service.fireSelectStatementChanged(null, args.entity);
				}
			});

			service.goToEstimate = function goToEstimate() {
				/* var mainItem = service.getSelected();
				 if (mainItem && mainItem.hasOwnProperty('Id')) { */
				if (currentInstanceHeaderId) {
					$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/getprojectinfo?instanceHeaderId=' + /* mainItem.InstanceHeaderFk */currentInstanceHeaderId).then(function (response) {
						var projectNo = response.data.ProjectNo;
						var projectName = response.data.ProjectName;
						/** @namespace response.data.EstimateHeaderId */
						var estimateHeaderId = response.data.EstimateHeaderId;
						if (angular.isNumber(estimateHeaderId)) {
							var postData = {
								projectFk: response.data.ProjectId
							};
							$http.post(globals.webApiBaseUrl + 'estimate/project/list', postData).then(function (response) {
								var items = _.filter(response.data, function (item) {
									/** @namespace item.EstHeader */
									return item.EstHeader.Id === estimateHeaderId;
								});

								items[0].projectInfo = {
									ProjectNo: projectNo,
									ProjectName: projectName
								};

								// items[0].cosInstance = mainItem;
								$injector.get('estimateProjectRateBookConfigDataService').setClearDataFlag(false);

								$injector.get('constructionSystemProjectInstanceHeaderService').setFilterByCurrentInstance(true);

								$injector.get('platformModuleNavigationService').navigate({
									moduleName: 'estimate.main'
								}, items[0]/* , 'cosMainInstance.Id' */ // Mike: disable the filter to show all of estimate lines winthin its header.
								);
							});
						}
						else {
							$log.error('estimateHeaderId NOT Exist! Therefore, [Go To Estimate] failed to work!!');
						}
					});
				}
			};

			/* jshint -W069 */
			service.navigateTo = function navigateTo(item, triggerField, dataService) {
				if (triggerField === 'Code') {
					setCurrentInstanceHeader(item, dataService);
				} else if (triggerField === 'CosInstanceCode' && _.isNumber(item['CosInstanceFk']) && _.isNumber(item['CosInsHeaderFk'])) {
					currentSelectInstanceId = item['CosInstanceFk'];
					setCurrentPinningContext(item['CosInsHeaderFk'], true, dataService);
				} else if (triggerField === 'Ids' && typeof item.Ids === 'string') {
					const ids = item.Ids.split(',').map(e => parseInt(e));
					item = { CosInsHeaderFk: ids[0],  };
					setCurrentPinningContext(item.CosInsHeaderFk, true, dataService);
				} else {
					$log.warn('The navigation endpiont NOT Support in ConstructionSystem.Main!');
				}
			};

			service.registerUpdateDataExtensionEvent(onUpdateRequested);

			function onUpdateRequested(d) {
				if (d.InstanceHeaderParameter && d.InstanceHeaderParameter.length !== 0) {
					instanceHeaderParameterService.markEntitiesAsModified(d.InstanceHeaderParameter);
					delete d.InstanceHeaderParameter;
				}
			}

			function setTitleShowData(instanceHeaderInfo) {
				currentProjectEntity.ProjectNo = instanceHeaderInfo.ProjectNo;
				currentProjectEntity.ProjectName = instanceHeaderInfo.ProjectName;
				/** @namespace instanceHeaderInfo.HeaderCode */
				/** @namespace instanceHeaderInfo.HeaderDescription */
				currentInsHeaderEntity.Code = instanceHeaderInfo.HeaderCode;
				currentInsHeaderEntity.DescriptionInfo = {Translated: instanceHeaderInfo.HeaderDescription};
			}

			// eslint-disable-next-line no-unused-vars
			var waitForDynamicColumnCalculate = false;
			// eslint-disable-next-line no-unused-vars
			var dynamicColumnCalculatePromise = null;

			service.setWaitForDynamicColumnCalculate = function (value) {
				waitForDynamicColumnCalculate = value;
			};

			service.setDynamicColumnCalculatePromise = function (value) {
				dynamicColumnCalculatePromise = value;
			};

			var sortCodeInfoToSave = [];
			// add sortcode into ToSave array for update data
			service.addSortCodeChangeInfo = function addSortCodeChangeInfo(scField, item) {
				var field = scField.slice(0, -2),
					value = item[scField],
					scItem = _.find(sortCodeInfoToSave, {Field: field}),
					isExist = _.isNumber(value);
				if (scItem) {
					scItem.Code = value;
					scItem.IsExist = isExist;
				} else {
					sortCodeInfoToSave.push({Field: field, Code: value, IsExist: isExist});
				}
			};

			function setCurrentInstanceHeader(instanceHeaderInfo, isFavoritesJump, dataService) {
				currentSelectedProjectId = instanceHeaderInfo.ProjectId || instanceHeaderInfo.ProjectFk;
				currentSelectedModelId = instanceHeaderInfo.ModelId || instanceHeaderInfo.ModelFk;
				currentInstanceHeaderId = instanceHeaderInfo.Id || instanceHeaderInfo.HeaderId;
				currentSelectedEstimateHeaderId = instanceHeaderInfo.EstimateHeaderId || instanceHeaderInfo.EstimateHeaderFk;
				currentBoqHeaderId = instanceHeaderInfo.BoqHeaderId || instanceHeaderInfo.BoqHeaderFk;
				constructionsystemMainInitFilterService.setEstHeaderId(currentSelectedEstimateHeaderId, currentSelectedProjectId);
				setLeadingStructuresFilters(currentSelectedProjectId, currentBoqHeaderId);
				instanceHeaderParameterService.setInstanceHeaderId(currentInstanceHeaderId);
				constructionSystemCommonPropertyNameLookupService.setCurrentModelId(currentSelectedModelId);
				if (isFavoritesJump) {
					setPinningContext(instanceHeaderInfo, dataService);
				} else {
					setCurrentPinningContext(currentInstanceHeaderId, dataService);
				}
			}

			function setCurrentPinningContext(instanceHeaderId, setCurrentContextData, dataService) {
				return $http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/getprojectinfo?instanceHeaderId=' + instanceHeaderId).then(function (response) {
					var instanceHeaderInfo = response.data;
					if (setCurrentContextData) {
						currentSelectedProjectId = instanceHeaderInfo.ProjectId;
						currentSelectedModelId = instanceHeaderInfo.ModelId;
						currentInstanceHeaderId = instanceHeaderInfo.HeaderId;
						currentSelectedEstimateHeaderId = instanceHeaderInfo.EstimateHeaderId;
						currentBoqHeaderId = instanceHeaderInfo.BoqHeaderId;
						constructionsystemMainInitFilterService.setEstHeaderId(currentSelectedEstimateHeaderId, currentSelectedProjectId);
						setLeadingStructuresFilters(currentSelectedProjectId);
						instanceHeaderParameterService.setInstanceHeaderId(currentInstanceHeaderId);
						constructionSystemCommonPropertyNameLookupService.setCurrentModelId(currentSelectedModelId);
					}
					setPinningContext(instanceHeaderInfo, dataService);
					cloudDesktopSidebarService.filterStartSearch(true);
				});
			}

			function setInstanceSelected() {
				$timeout(function () {
					if (_.isNumber(currentSelectInstanceId)) {
						var item = service.getItemById(currentSelectInstanceId);
						if (_.isObject(item)) {
							service.setSelected(item);
							currentSelectInstanceId = null;
						}
					}
				});
			}

			function setPinningContext(data, dataService) {
				var pinningContext = [];
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem('project.main', data.ProjectId,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(data.ProjectNo, data.ProjectName, ' - ')));

				/** @namespace data.EstimateHeaderCode */
				/** @namespace data.EstimateHeaderDescription */
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem('estimate.main', data.EstimateHeaderId,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(data.EstimateHeaderCode, data.EstimateHeaderDescription, ' - ')));

				/** @namespace data.ModelDescription */
				/** @namespace data.ModelCode */
				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem('model.main', data.ModelId,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(data.ModelCode, data.ModelDescription, ' - ')));

				pinningContext.push(
					new cloudDesktopPinningContextService.PinningItem('constructionsystem.main', data.HeaderId,
						cloudDesktopPinningContextService.concate2StringsWithDelimiter(data.HeaderCode, data.HeaderDescription, ' - ')));

				pinningContext.push(new cloudDesktopPinningContextService.PinningItem('boq.main', data.BoqHeaderId));

				cloudDesktopPinningContextService.setContext(pinningContext, dataService);
				setTitleShowData(data);
			}

			function handleUpdateDone(updateData, response, data) {
				/** @namespace response.ModelValidateError */
				if (response && Array.isArray(response.ModelValidateError) && response.ModelValidateError.length > 0) {
					response.ModelValidateError.forEach(function (item) {
						var result = null;
						switch (item) {
							case 'Code':
								result = {
									apply: true,
									valid: false,
									error: $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'Code'})
								};
								break;
							default:
								result = {
									apply: true,
									valid: false,
									error: item
								};
								break;
						}
						/** @namespace updateData.Header */
						if (result !== null && updateData.Header !== null && updateData.Header !== undefined) {
							handleValidation(result, updateData.Header, item);
						}
						platformModalService.showErrorBox(result.error);
					});
				} else {
					serviceContainer.service.updatedDoneMessenger.fire(null, updateData);
				}
				if(updateData.EstLineItemsToSave){
					$injector.get('constructionsystemMainLineItemService').gridRefresh();
				}
				data.handleOnUpdateSucceeded(updateData, response, data, true);
			}

			function handleValidation(result, item, model) {
				if (result.valid) {
					if (item.__rt$data && item.__rt$data.errors) {
						delete item.__rt$data.errors[model];
					}
				} else {
					if (!item.__rt$data) {
						item.__rt$data = {errors: {}};
					} else if (!item.__rt$data.errors) {
						item.__rt$data.errors = {};
					}
					item.__rt$data.errors[model] = result;
				}
			}


			service.getCurrentSelectedProjectId = function getCurrentSelectedProjectId() {
				return currentSelectedProjectId;
			};
			service.getCurrentSelectedModelId = function getCurrentSelectedModelId() {
				return currentSelectedModelId;
			};
			service.getCurrentInstanceHeaderId = function getCurrentInstanceHeaderId() {
				return currentInstanceHeaderId;
			};
			service.getCurrentBoqHeaderId = function getCurrentBoqHeaderId() {
				return currentBoqHeaderId;
			};
			service.setCurrentInstanceHeaderInfo = function setCurrentInstanceHeaderInfo(instanceHeaderInfo) {
				currentInstanceHeaderInfo = instanceHeaderInfo;
			};
			service.getCurrentInstanceHeaderInfo = function getCurrentInstanceHeaderInfo() {
				return currentInstanceHeaderInfo;
			};

			function setLeadingStructuresFilters(prjId, BoqHeaderId) {
				locationService.markAsHasntLoaded();
				controllingService.markAsHasntLoaded();
				boqService.setFilterByProjectId(prjId, BoqHeaderId);
				objectService.markAsHasntLoaded();
				$injector.get('constructionSystemMainObjectSetService').load();
				constructionsystemMainObjectHierarchicalDataService.setCurrentModelId(currentSelectedModelId);
				// set model id for 3D Viewer filter by main service
				constructionSystemMainModelFilterService.setCurrentModelId(currentSelectedModelId);
			}

			service.refreshProgress = function (gridId) {
				var deferred = $q.defer();
				var dataItems = service.getList();
				var hasRunningItem = dataItems.some(function (item) {
					return item.Status === 1 || item.Status === 11 || item.Status === 4;
				});

				if (hasRunningItem) {
					basicsCommonGridCellService.updateColumn(gridId, 'status');
				}

				$timeout(function () {
					deferred.resolve();
				}, 800);

				return deferred.promise;
			};
			service.registerEntityCreated = function () {
			};

			service.updateModuleHeaderInfo = function (instance) {
				var entityText = '';
				if (currentProjectEntity.ProjectNo) {
					entityText = currentProjectEntity.ProjectNo + ' - ' + currentProjectEntity.ProjectName;

				}
				if (currentInsHeaderEntity.Code) {
					entityText += currentInsHeaderEntity ? ' / ' + currentInsHeaderEntity.Code + ' - ' + currentInsHeaderEntity.DescriptionInfo.Translated : '';
				}
				var instanceItem = service.getSelected();
				if (instanceItem) {
					entityText += ' / ' + instanceItem.Code + ' - ' + instanceItem.DescriptionInfo.Translated;
					instance = undefined;
				}
				entityText += !_.isEmpty(instance) ? ' / ' + instance.Code + ' - ' + instance.DescriptionInfo.Translated : '';
				cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameConstructionSystemInstance', entityText);
			};
			service.onContextUpdated.register(service.updateModuleHeaderInfo);

			service.updateStatusToModified = function updateStatusToModified() {
				var selectedInstance = service.getSelected();
				var ignoreStatusId = [0, 11, 21];
				if (selectedInstance && selectedInstance.Id && ignoreStatusId.indexOf(selectedInstance.Status) === -1) {
					selectedInstance.Status = 25;
					// service.gridRefresh();
					service.markItemAsModified(selectedInstance);
				}
			};

			service.updateIsUserModified = function updateIsUserModified(isModified) {

				var selectedInstance = service.getSelected();
				if (!!selectedInstance && selectedInstance.Id) {
					selectedInstance.IsUserModified = isModified;
					selectedInstance.Status = 26;
					service.markItemAsModified(selectedInstance);

				}
			};
			service.onQuantityChanged = new PlatformMessenger();

			serviceContainer.service.deleteEntities = function (entities, data) {
				data = serviceContainer.data;
				if (platformRuntimeDataService.isBeingDeleted(entities)) {
					return $q.when(true);
				}

				var deleteParams = {};
				platformRuntimeDataService.markListAsBeingDeleted(entities);
				deleteParams.entities = entities;
				entities.forEach(function (item) {
					item.index = data.itemList.indexOf(item);
				});
				platformDataValidationService.removeDeletedEntityFromErrorList(entities, service);
				data.doPrepareDelete(deleteParams, data);

				deleteParams.entities = _.map(entities, function (ele) {
					if (ele.Version === 0) {
						data.onDeleteDone(deleteParams, data, null);
					}
					else {
						return ele;
					}
				});

				if (deleteParams.entities.length !== 0) {
					return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/delete', deleteParams.entities).then(function (response) {
						var res = response.data;
						if (res.Result) {
							data.onDeleteDone(deleteParams, data, res);
							return true;
						} else {
							if (res.ValidationErrors && res.ValidationErrors.length > 0) {
								var errors = res.ValidationErrors.join('\n');
								platformModalService.showYesNoDialog(errors, 'constructionsystem.main.deleteInstanceWithLineItemDialog.title', 'no').then(function (result) {
									if (result.yes) {
										return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance/deleteInstanceWithLineItem', deleteParams.entities)
											.then(function (response) {
												data.onDeleteDone(deleteParams, data, response.data);
												return true;
											}
											);
									}
									else {
										platformRuntimeDataService.removeMarkAsBeingDeletedFromList(entities);
									}
								});
							}
						}
						return true;
					});
				}
			};

			service.getSelectedProjectId = function () {
				var projectId = cloudDesktopSidebarService.filterRequest.projectContextId;
				if (projectId === null) {
					return -1;
				}
				else {
					return projectId;
				}
			};

			service.onCostGroupCatalogsLoaded = new PlatformMessenger();

			service.extendCustomFurtherFilters = function (token, value) {
				var target = _.find(customFurtherFilters, {Token: token});
				if (target) {
					target.Value = value;
				} else {
					customFurtherFilters.push({Token: token, Value: value});
				}
			};

			service.getCustomFurtherFilters = function () {
				return customFurtherFilters;
			};

			service.assignCostGroups = function (readData) {
				basicsCostGroupAssignmentService.process(readData, service, {
					mainDataName: 'dtos',
					attachDataName: 'Header2CostGroups',
					dataLookupType: 'Header2CostGroups',
					identityGetter: function (entity) {
						return {
							InstanceHeaderFk: entity.RootItemId,
							Id: entity.MainItemId
						};
					}
				});
			};

			service.syncCostGroups = function (dtos, completeData) {
				var readData = {
					dtos: dtos,
					CostGroupCats: service.costGroupCatalogs,
					Header2CostGroups: []
				};
				_.each(completeData, function (tmpl) {
					if (tmpl.CostGroupToSave && tmpl.CostGroupToSave.length > 0) {
						_.each(tmpl.CostGroupToSave, function (group) {
							readData.Header2CostGroups.push(group);
						});
					}
				});

				service.assignCostGroups(readData);
			};

			service.show2dObjectDialog = function show2dObjectDialog() {
				service.updateAndExecute(function () {
					var selectedInstance = service.getSelected();
					platformModalService.showDialog({
						selectedInstance: selectedInstance,
						templateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/construction-system-instance-2d-object-dialog.html',
						backdrop: false,
						showCancelButton: true,
						showOkButton: true,
						width: '800px'
					}).then(function () {
					});
				});
			};


			service.clearModifications = function(){
				var items = serviceContainer.data.itemList;
				angular.forEach(items, function(item){
					serviceContainer.data.doClearModifications(item, serviceContainer.data);
				});
			};

			return service;
		}
	]);
})(angular);
