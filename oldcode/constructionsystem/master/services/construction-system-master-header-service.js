(function (angular) {
	'use strict';
	/* global globals,$ */
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */
	angular.module(moduleName).factory('constructionSystemMasterHeaderService',
		['platformDataServiceFactory',
			'basicsLookupdataLookupDescriptorService',
			'basicsLookupdataLookupFilterService',
			'platformRuntimeDataService',
			'$translate',
			'PlatformMessenger',
			'platformDataServiceDataProcessorExtension',
			'platformDataServiceActionExtension',
			'platformDataServiceSelectionExtension',
			'platformModalService',
			'basicsCommonReadOnlyProcessorExtension',
			'$http',
			'$q',
			'platformDataValidationService',
			'platformModuleNavigationService',
			'cloudDesktopSidebarService',
			'constructionSystemMasterGroupFilterService',
			'constructionSystemMasterGroupService',
			'_',
			'$injector',
			'basicsCostGroupAssignmentService',
			function (
				platformDataServiceFactory,
				basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupFilterService,
				platformRuntimeDataService,
				$translate,
				PlatformMessenger,
				platformDataProcessorExtension,
				platformDataServiceActionExtension,
				platformDataServiceSelectionExtension,
				platformModalService,
				basicsCommonReadOnlyProcessorExtension,
				$http,
				$q,
				platformDataValidationService, platformModuleNavigationService, cloudDesktopSidebarService, constructionSystemMasterGroupFilterService, constructionSystemMasterGroupService,_,$injector,basicsCostGroupAssignmentService) {

				var headerIdToSelect;

				var BasicsCommonReadOnlyProcessorExtension = basicsCommonReadOnlyProcessorExtension;
				var sidebarSearchOptions = {
					moduleName: moduleName,
					enhancedSearchEnabled: false, // mike: it's not necessary for cos master. Thus, disable it.
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: true,
					withExecutionHints: false
				};

				var serviceOption = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterHeaderService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'constructionsystem/master/header/',
							usePostForRead: true,
							extendSearchFilter: function (filterRequest) {
								var items = constructionSystemMasterGroupFilterService.getFilter();
								filterRequest.furtherFilters = _.map(items, function (value) {
									return {
										Token: 'COSGROUP',
										Value: value
									};
								});
							}
						},
						entityRole: {
							root: {
								itemName: 'CosHeaders',
								moduleName: 'cloud.desktop.moduleDisplayNameConstructionSystemMaster',
								codeField: 'Code',
								descField: 'DescriptionInfo.Translated',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								handleUpdateDone: handleUpdateDone
							}
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									// creationData.CosGroupFk = constructionSystemMasterGroupService.getIfSelectedIdElse(-1);
									let selectedGroupId;
									let defaultGroup = constructionSystemMasterGroupService.getDefatulGroup();
									if (defaultGroup){
										selectedGroupId = defaultGroup.Id;
									}
									let filterItems = constructionSystemMasterGroupFilterService.getFilter();
									if (filterItems && filterItems.length > 0){
										selectedGroupId = filterItems[0];
									}
									creationData.CosGroupFk = selectedGroupId;
								},
								incorporateDataRead: incorporateDataRead,
								handleCreateSucceeded: handleCreateSucceeded
							}
						},
						sidebarSearch: {
							options: sidebarSearchOptions
						},
						sidebarWatchList: { active: true },
						dataProcessor: [new BasicsCommonReadOnlyProcessorExtension(['RubricCategoryFk'])],
						entitySelection: {supportsMultiSelection: true},
						translation: {
							uid: 'constructionSystemMasterHeaderService',
							title: 'constructionsystem.master.headerGridContainerTitle',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
							dtoScheme: {
								typeName: 'CosHeaderDto',
								moduleSubModule: 'ConstructionSystem.Master'
							}
						}
					}
				};
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				angular.extend(serviceContainer.service,
					{
						registerLookupFilter: registerLookupFilter,
						unregisterLookupFilter: unregisterLookupFilter
					}
				);

				var validationService = null;
				var lookupFilters = [
					{
						key: 'rubriccategorytrv-for-construction-system-master-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return {Rubric : 60};
						}
					},
					{
						key: 'costgroupfk-for-construction-system-master-filter',
						serverSide: true,
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							return 'LineItemContextFk=' + (currentItem ? currentItem.LineItemContextFk : '-1');
						}
					},
					{
						key: 'basformfk-for-construction-system-master-filter',
						serverSide: true,
						fn: function () {
							return '60';
						}
					}
				];
				var service = serviceContainer.service;
				service.completeEntityCreateed = new PlatformMessenger();
				service.selectionHeaderChanged = new PlatformMessenger();
				service.headerValidateComplete = new PlatformMessenger();
				service.updatedDoneMessenger = new PlatformMessenger();

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
					/** @namespace newData.CosHeaderDto */
					return onCreateSucceeded.call(serviceContainer.data, newData.CosHeaderDto, data, creationData).then(function () {
						service.completeEntityCreateed.fire(null, newData);
					});
				};

				var deepCopying = false;
				serviceContainer.service.createDeepCopy = function createDeepCopy() {
					if (!deepCopying) {
						deepCopying = true;
						$http.post(globals.webApiBaseUrl + 'constructionsystem/master/header/deepcopy', serviceContainer.service.getSelected())
							.then(function (response) {
								serviceContainer.service.syncCostGroups([response.data.CosHeader], [response.data]);
								service.setList(_.union(service.getList(), [response.data.CosHeader]));
								service.goToLast();
								deepCopying = false;
								/** @namespace response.data.CosHeader */
								// serviceContainer.data.handleOnCreateSucceeded(response.data.CosHeader, serviceContainer.data);
							},
							function (/* error */) {
							});
					}
				};

				serviceContainer.data.deleteItem = function deleteRootItem(entity, data) {
					if (platformRuntimeDataService.isBeingDeleted(entity)) {
						return $q.when(true);
					}
					platformRuntimeDataService.markAsBeingDeleted(entity);

					var deleteParams = {};
					deleteParams.entity = entity;
					deleteParams.index = data.itemList.indexOf(entity);
					platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
					data.doPrepareDelete(deleteParams, data);

					if (entity.Version === 0) {
						data.onDeleteDone(deleteParams, data, null);
						return $q.when(true);
					}
					else {
						deleteParams.entities = [deleteParams.entity];
						deleteRequest(deleteParams, data);
					}
				};

				serviceContainer.service.deleteEntities = function deleteRootItems(entities, data) {
					data = serviceContainer.data;
					if (platformRuntimeDataService.isBeingDeleted(entities)) {
						return $q.when(true);
					}

					var deleteParams = { entities: [] };
					var deleteParamsOnBackside = { entities: [] };
					platformRuntimeDataService.markListAsBeingDeleted(entities);
					entities.forEach(function (item) {
						item.index = data.itemList.indexOf(item);
					});
					platformDataValidationService.removeDeletedEntitiesFromErrorList(entities, service);
					data.doPrepareDelete({entities: entities}, data);

					$.extend(true, deleteParams.entities, entities);
					_.forEach(deleteParams.entities, function(val) {
						if (val.Version === 0) {
							data.onDeleteDone({entity: val}, data, null);
						}
						else {
							deleteParamsOnBackside.entities.push(val);
						}
					});

					if (deleteParamsOnBackside.entities.length !== 0) {
						deleteRequest(deleteParamsOnBackside, data);
					}
				};

				function deleteRequest(deleteParams, data) {
					return $http.post(data.httpDeleteRoute + 'deleteheaders', deleteParams.entities).then(function (response) {
						var res = response.data;
						if (res.Result) {
							data.onDeleteDone(deleteParams, data, res);
							return true;
						} else {
							/** @namespace res.ValidationErrors */
							if (res.ValidationErrors && res.ValidationErrors.length > 0) {
								var errors = res.ValidationErrors.join('\n');
								platformModalService.showYesNoDialog(errors, 'constructionsystem.master.dialog.deleteOtherModuleTitle', 'no').then(function (result) {
									if (result.yes) {
										return $http.post(data.httpDeleteRoute + 'deleteHeaderInInstanceWithLineItems?isDeleteLineItem=true', deleteParams.entities).then(function (response) {
											var resp = response.data;
											if (resp.Result) {
												data.onDeleteDone(deleteParams, data, resp);
												return true;
											}
										});
									}
									else {
										platformRuntimeDataService.removeMarkAsBeingDeletedFromList(deleteParams.entities);
									}
								});
							}
						}
						return true;
					});
				}

				serviceContainer.data.newEntityValidator = {
					validate: function validate(newItem){
						if(!validationService){

							validationService = $injector.get('constructionSystemMasterHeaderValidationService');
						}
						validationService.validateCode(newItem,newItem.Code,'Code');
					}
				};

				/* jshint -W069 */
				service.navigateTo = function () {
					registerNavigation(serviceContainer.data.httpReadRoute, {
						moduleName: moduleName,
						getNavData: function getNavData(item, triggerField) {
							if (triggerField === 'CosMasterHeaderCode' && _.isNumber(item['CosMasterHeaderId'])) {
								headerIdToSelect = item['CosMasterHeaderId'];
								return item['CosMasterHeaderId'];
							}
							if (triggerField === 'Code') {
								return item['Id'];
							}
							if (angular.isDefined(item.HeaderFk)) {
								return item.HeaderFk !== null ? item.HeaderFk : -1;
							}
						}
					});
				};

				service.assignCostGroups = function (readData) {
					basicsCostGroupAssignmentService.process(readData, service, {
						mainDataName: 'dtos',
						attachDataName: 'Header2CostGroups',
						dataLookupType: 'Header2CostGroups',
						identityGetter: function (entity) {
							return {
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

				service.getReadOnly = function () {
					return false;
				};

				service.getContainerUUID = function (){
					return 'ACC544C6504A4A678DBE74D8F390EEA8';
				};

				function registerNavigation(httpReadRoute, navigation) {
					platformModuleNavigationService.registerNavigationEndpoint({
						moduleName: navigation.moduleName,
						navFunc: function (item, triggerField) {
							var data = navigation.getNavData ? navigation.getNavData(item, triggerField) : item;
							if (angular.isNumber(data)) {
								cloudDesktopSidebarService.filterSearchFromPKeys([data]);
							} else if (angular.isString(data)) {
								cloudDesktopSidebarService.filterSearchFromPattern(data);
							} else {
								$http.post(httpReadRoute + (navigation.endRead || 'navigation'), data).then(function (response) {
									cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
								});
							}
						}
					});
				}

				// service.load();

				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				return service;

				function handleCreateSucceeded(creationData) {
					return creationData.CosHeaderDto;
				}

				function registerLookupFilter() {
					basicsLookupdataLookupFilterService.registerFilter(lookupFilters);
				}

				function unregisterLookupFilter() {
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilters);
				}

				function incorporateDataRead(result, data) {
					basicsLookupdataLookupDescriptorService.attachData(result || {});

					$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
						basicsCostGroupAssignmentService.process(result, service, {
							mainDataName: 'dtos',
							attachDataName: 'Header2CostGroups',
							dataLookupType: 'Header2CostGroups',
							identityGetter: function (entity) {
								return {
									Id: entity.MainItemId
								};
							}
						});
					}]);

					serviceContainer.data.handleReadSucceeded(result, data);
					if (headerIdToSelect) {
						var item = service.getItemById(headerIdToSelect);
						if (_.isObject(item)) {
							service.setSelected(item);
							headerIdToSelect = null;
						}
					}
				}

				function handleUpdateDone(updateData, response, data) {
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
							if (result !== null && updateData.Header !== null && updateData.Header !== undefined) {
								handleValidation(result, updateData.Header, item);
							}
							platformModalService.showErrorDialog(result.error);
						});
					} else {
						serviceContainer.service.updatedDoneMessenger.fire(null, response);
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
			}
		]);
})(angular);