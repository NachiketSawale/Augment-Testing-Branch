/**
 * Created by frank baedeker on 21.08.2014.
 */
(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);
	var serviceContainer;
	/**
	 * @ngdoc service
	 * @name projectMainService
	 * @function
	 *
	 * @description
	 * projectMainService is the data service for all project related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainService',
		['platformDataServiceFactory', '$translate', '$injector', 'platformObjectHelper', 'platformDataServiceConfiguredReadonlyExtension',
			'platformRuntimeDataService', 'basicsLookupdataLookupFilterService', 'platformDataServiceProcessDatesBySchemeExtension',
			'projectMainNumberGenerationSettingsService', '$http', 'cloudDesktopSidebarService', 'platformMultiAddressService', '$q',
			'basicsLookupdataLookupDescriptorService', 'mainViewService', '$timeout', 'projectMainCopyEntityService', 'platformGridAPI',
			'projectMainPinnableEntityService', 'projectMainCreationInitialDialogService', 'projectMainConstantValues',
			'projectMainCharacteristicService', 'projectMainProjectNewEntityValidator', 'platformPermissionService', 'permissions', 'procurementContractHeaderFilterService',

			function (platformDataServiceFactory, $translate, $injector, platformObjectHelper, platformDataServiceConfiguredReadonlyExtension,
				platformRuntimeDataService, basicsLookupdataLookupFilterService, platformDataServiceProcessDatesBySchemeExtension,
				projectMainNumberGenerationSettingsService, $http, cloudDesktopSidebarService, platformMultiAddressService, $q,
				descriptorService, mainViewService, $timeout, projectMainCopyEntityService, platformGridAPI,
				projectMainPinnableEntityService, projectMainCreationInitialDialogService, projectMainConstantValues,
				projectMainCharacteristicService, projectMainProjectNewEntityValidator, platformPermissionService, permissions, procurementContractHeaderFilterService
			) {

				var characteristicColumn = '';
				var eventUUID = '3819677C443E482789F928175775E59A';
				var isLoadedByFavorites = false;
				var pinnedProject = null;
				var modelEventUUID = '061FCD44219940FA897F1409B41AC462';
				let projectIdToSelect = null;
				function processProject(item) {
					if(item.IsReadOnly){
						platformRuntimeDataService.readonly(item, true);
					}
					else{
						platformRuntimeDataService.readonly(item, false);
						let fields = [];

						fields.push({field: 'ProjectModeFk', readonly: item.Version >= 1});
						fields.push({field: 'CurrencyFk', readonly: item.Version >= 1});
						fields.push({field: 'IsCompletePerformance', readonly: item.HasAcceptedWIPs});
						fields.push({field: 'ControltemplateFk', readonly: item.Version >= 1});
						fields.push({field: 'CatalogConfigTypeFk', readonly: item.Version >= 1});
						fields.push({field: 'RubricCategoryFk', readonly: item.Version >= 1});

						fields.push({field: 'ProjectGroupFk', readonly: item.Version >= 1});

						if (!item.BusinessPartnerFk) {
							fields.push({field: 'SubsidiaryFk', readonly: true});
							fields.push({field: 'ContactFk', readonly: true});
						}

						if( item.TypeFk === projectMainConstantValues.values.iTwo5DProject) {
							fields.push({field: 'ProjectNo', readonly: true});
						}
						else if (projectMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
							fields.push({field: 'ProjectNo', readonly: true});
						}

					platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('project.main', 'Project', fields);

						if (fields.length > 0) {
							platformRuntimeDataService.readonly(item, fields);
						}
					}
				}

				function revertProcessProject(item) {
					if (item.Version === 0 && projectMainNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						item.HasToGenerateProjectNumber = true;
					}
				}

				function setCurrentPinningContext() {
					if (!!pinnedProject && projectMainPinnableEntityService.getPinned() !== pinnedProject) {
						var ids = {};
						projectMainPinnableEntityService.appendId(ids, pinnedProject);
						projectMainPinnableEntityService.pin(ids, serviceContainer.service);
						isLoadedByFavorites = false;
						pinnedProject = null;
					}
				}

				// The instance of the main service - to be filled with functionality below
				var activityServiceOption = {
					flatRootItem: {
						module: projectMainModule,
						serviceName: 'projectMainService',
						entityNameTranslationID: 'cloud.common.entityProject',
						entityInformation: { module: 'Project.Main', entity: 'Project', specialTreatmentService: projectMainCreationInitialDialogService },
						httpCreate: {
							route: globals.webApiBaseUrl + 'project/main/',
							endCreate: 'createproject'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'project/main/',
							endRead: 'filtered',
							usePostForRead: true,
							extendSearchFilter: function extendSearchFilter(readData, data) {
								if(!readData.isReadingDueToRefresh && !!readData.PKeys && !!readData.PKeys[0]){
									isLoadedByFavorites = true;
									pinnedProject = readData.PKeys[0].Id;
								}
								if (data.prjID) {
									readData.PKeys = readData.PKeys || [];
									readData.PKeys.push({Id: data.prjID});
								}

								if (!!readData.furtherFilters && !!readData.furtherFilters.navInfo && readData.Pattern === readData.furtherFilters.navInfo.project) {
									readData.furtherFilters = [{Token: 'PROJECTNO', Value: readData.Pattern}];
									readData.furtherFilters.navInfo = null;
									readData.Pattern = null;
									readData.UseCurrentClient = true;
								}
							}
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'project/main/',
							endDelete: 'deleteproject'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'project/main/',
							endRead: 'update'
						},
						dataProcessor: [{
							processItem: processProject,
							revertProcessItem: revertProcessProject
						}, platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'ProjectDto',
							moduleSubModule: 'Project.Main'
						})],
						actions: {delete: {}, create: 'flat'},
						entityRole: {
							root: {
								rootForModule: moduleName,
								codeField: 'ProjectLongNo',
								descField: 'ProjectName',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								itemName: 'Projects',
								useIdentification: true,
								moduleName: 'cloud.desktop.moduleDisplayNameProjectMain',
								handleUpdateDone: function (updateData, response, data) {

									$injector.get('estimateMainRuleUpdateService').clear();
									$injector.get('estimateParamUpdateService').clear();
									$injector.get('estimateParameterFormatterService').handleUpdateDone(response);
									$injector.get('estimateRuleFormatterService').handleUpdateDone(response);
									$injector.get('estimateProjectService').handleUpdateDone(response);
									$injector.get('projectMainCompanyService').refresh();

									if(updateData && updateData.ModelsToSave && updateData.ModelsToSave.length > 0){

										angular.forEach(updateData.ModelsToSave,function (model) {
											if(model.Models && model.Models.isNewlyCreated){
												executeModelWorkflows(updateData.ModelsToSave[0].MainItemId);
											}
										});

									}

									if (response && response.PrjEstRuleToSave && response.PrjEstRuleToSave.length) {
										// after modify parameter value of the parameter ,need update the cache about the paramter value
										let PrjEstRuleToSave = response.PrjEstRuleToSave[0];

										let PrjRuleParamValueToSave = [];
										if (PrjEstRuleToSave && PrjEstRuleToSave.PrjEstRuleParamToSave && PrjEstRuleToSave.PrjEstRuleParamToSave.length > 0) {
											_.forEach(PrjEstRuleToSave.PrjEstRuleParamToSave, function (prjRuleParam) {
												if (prjRuleParam.PrjRuleParamValueToSave && prjRuleParam.PrjRuleParamValueToSave.length > 0) {
													PrjRuleParamValueToSave = PrjRuleParamValueToSave.concat(prjRuleParam.PrjRuleParamValueToSave);
												}
											});
										}

										if (PrjRuleParamValueToSave.length > 0) {
											$injector.get('basicsLookupdataLookupDescriptorService').updateData('PrjRuleParameterValueLookup', PrjRuleParamValueToSave);
											_.each(PrjRuleParamValueToSave, function (item) {
												platformRuntimeDataService.readonly(item, [{field: 'ParameterCode', readonly: true}]);
											});
										}
									}

									if (response && response.EstLineItemSelStatementToSave && response.EstLineItemSelStatementToSave.length > 0) {
										$injector.get('estimateProjectEstimateLineItemSelStatementListService').handleUpdateDone(response.EstLineItemSelStatementToSave);
									}

									// if update master data filter for customize then check selection statement
									if (updateData && updateData.RateBookToSave && updateData.RateBookToSave.length > 0) {
										$injector.get('estimateProjectRateBookConfigDataService').OnMasterDataFilterChanged.fire();
									}

									if(serviceContainer.service.hasOwnProperty('newProjectId') && serviceContainer.service.newProjectId !== null){
										executeProjectWorkflows(serviceContainer.service.newProjectId);
										clearNewProjectCreatedId();
									}

									if(response && response.PrjCostCodesToSave && response.PrjCostCodesToSave.length > 0){
										let prjCostCodesToDelete = [];
										response.PrjCostCodesToSave.forEach(function(toSave){
											if(toSave.PrjCostCodesJobRateToDelete && toSave.PrjCostCodesJobRateToDelete.length > 0){
												prjCostCodesToDelete = prjCostCodesToDelete.concat(toSave.PrjCostCodesJobRateToDelete);
											}
										});
									}

									if(response && response.PrjUserDefinedPriceCompleteToSave && response.PrjUserDefinedPriceCompleteToSave.length > 0){
										let prjUserDefinedPriceCompleteToSave = response.PrjUserDefinedPriceCompleteToSave;
										// project cost code
										$injector.get('projectCostCodesDynamicUserDefinedColumnService').handleUpdateDone(_.find(prjUserDefinedPriceCompleteToSave, {'ModuleName': 'PorjectCostCode'}));

										// project cost code job rate
										$injector.get('projectCostCodesJobRateDynamicUserDefinedColumnService').handleUpdateDone(_.find(prjUserDefinedPriceCompleteToSave, {'ModuleName': 'PorjectCostCoeJobRate'}));

										// project assembly
										$injector.get('projectAssemblyDynamicUserDefinedColumnService').handleUpdateDone(_.find(prjUserDefinedPriceCompleteToSave, {'ModuleName': 'ProjectAssembly'}), response.PrjEstLineItemToSave);

										// project assembly resource
										$injector.get('projectAssemblyResourceDynamicUserDefinedColumnService').handleUpdateDone(_.find(prjUserDefinedPriceCompleteToSave, {'ModuleName': 'ProjectAssemblyResoruce'}));
									}

									if(response.EstLineItems && response.EstLineItems.length > 0){
										if(response.IsProjectAssembly){
											$injector.get('projectAssemblyMainService').merge(response.EstLineItems);
											$injector.get('projectAssemblyMainService').refresh();
										} else {
											$injector.get('projectPlantAssemblyMainService').merge(response.EstLineItems);
										}
									}

									if(response.EstResourceToSave && response.EstResourceToSave.length > 0){
										if(response.IsProjectAssembly){
											$injector.get('projectAssemblyResourceService').handleUpdateDone(response.EstResourceToSave);
											$injector.get('projectAssemblyResourceService').refresh();
										} else {
											$injector.get('projectPlantAssemblyResourceService').handleUpdateDone(response.EstResourceToSave);
										}
									}

									if(response.PrjEstLineItemToSave && response.PrjEstLineItemToSave.length > 0){
										let prjAssemblies = _.map(response.PrjEstLineItemToSave, 'PrjEstLineItem');
										if(prjAssemblies && prjAssemblies.length > 0){
											$injector.get('projectAssemblyMainService').merge(prjAssemblies);
											$injector.get('projectAssemblyMainService').refresh();
										}
										let prjAssemblyResourcesComplete = _.map(response.PrjEstLineItemToSave, 'PrjEstResourceToSave');

										let prjAssemblyResources = [];

										_.forEach(prjAssemblyResourcesComplete, function(item){
											if(item){
												prjAssemblyResources = _.concat(prjAssemblyResources, item);
											}
										});

										if(prjAssemblyResources && prjAssemblyResources.length > 0){
											$injector.get('projectAssemblyResourceService').handleUpdateDone(prjAssemblyResources);
											$injector.get('projectAssemblyResourceService').refresh();
										}
									}

									if(response.PrjPlantAssemblyToSave && response.PrjPlantAssemblyToSave.length > 0){

										let prjAssemblyResourcesComplete = _.map(response.PrjPlantAssemblyToSave, 'PrjPlantAssemblyResourceToSave');

										let prjAssemblyResources = [];

										_.forEach(prjAssemblyResourcesComplete, function(item){
											if(item){
												prjAssemblyResources = _.concat(prjAssemblyResources, item);
											}
										});

										if(prjAssemblyResources && prjAssemblyResources.length > 0){
											$injector.get('projectPlantAssemblyResourceService').handleUpdateDone(prjAssemblyResources);
										}
									}

									if (response.IsLoadPrjAssembly){
										let prjAssemblyMainService = $injector.get('projectAssemblyMainService');
										prjAssemblyMainService.load();
									}

									// load the project assembly or assembly resource, after changed paramter
									if (response.EstLineItems && response.EstLineItems.length > 0){
										$injector.get('projectAssemblyMainService').load();
									}
									else if(response.EstResourceToSave && response.EstResourceToSave.length > 0){
										$injector.get('projectAssemblyResourceService').load();
									}

									if(updateData.CurrencyRatesToSave && serviceContainer.service.getSelected()){
										$injector.get('estimateMainExchangeRateService').loadData(serviceContainer.service.getSelected().Id, true);
									}

									data.handleOnUpdateSucceeded(updateData, response, data, true);
								}
							}
						},
						entitySelection: {supportsMultiSelection: true},
						sidebarSearch: {
							options: {
								moduleName: moduleName,
								enhancedSearchEnabled: true,
								enhancedSearchVersion: '2.0',
								pattern: '',
								pageSize: 100,
								useCurrentClient: true,
								useCurrentProfitCenter: false,
								includeNonActiveItems: false,
								showOptions: true,
								showProjectContext: false,
								pinningOptions: {
									isActive: true, showPinningContext: [{token: 'project.main', show: true}],
									setContextCallback: function (prjService) {
										cloudDesktopSidebarService.setCurrentProjectToPinnningContext(prjService, 'Id');
									}
								},
								withExecutionHints: false
							}
						},
						sidebarWatchList: {active: true},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									let result = serviceContainer.data.handleReadSucceeded(readData, data);
									if (projectIdToSelect) {
										selectProject();
									}
									// refresh the leadingStructure2Rule for formatter
									let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
									if(estimateRuleFormatterService){
										estimateRuleFormatterService.refresh();
									}
									let estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
									if(estimateParameterFormatterService){
										estimateParameterFormatterService.refresh();
									}
									let projectMainCompanyService = $injector.get('projectMainCompanyService');
									if(projectMainCompanyService){
										projectMainCompanyService.refresh();
									}
									$injector.get('estimateParamUpdateService').clear();
									let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
									estimateMainParameterValueLookupService.clear();

									var exist = platformGridAPI.grids.exist('713b7d2a532b43948197621ba89ad67a');
									if (exist) {
										var characterColumnService = $injector.get('projectMainCharacteristicColumnService');
										characterColumnService.appendCharacteristicCols(readData.dtos);
									}
									if (isLoadedByFavorites) {
										setCurrentPinningContext();
									}
									return result;
								},
								handleCreateSucceeded: function (item) {
									setNewProjectCreatedId(item.Id);
									projectMainCharacteristicService.onEntityCreated(serviceContainer.service, item);
									var exist = platformGridAPI.grids.exist('713b7d2a532b43948197621ba89ad67a');
									if (exist) {
										var characterColumnService = $injector.get('projectMainCharacteristicColumnService');
										characterColumnService.appendDefaultCharacteristicCols(item);
									}
								}
							}
						}
					}
				};

				function selectProject() {
					$timeout(function () {
						if (_.isNumber(projectIdToSelect)) {
							let item = serviceContainer.service.getItemById(projectIdToSelect);
							if (_.isObject(item)) {
								serviceContainer.service.setSelected(item);
								projectIdToSelect = null;
							}
						}
					});
				}

				serviceContainer = platformDataServiceFactory.createNewComplete(activityServiceOption);
				serviceContainer.data.newEntityValidator = projectMainProjectNewEntityValidator;
				serviceContainer.data.supportsDefaultingForConfiguredCreate = true;

				serviceContainer.service.setProjectSelectedId = function(projectId) {
					projectIdToSelect = projectId;
				};

				serviceContainer.service.doPrepareUpdateCall = function (updateData) {
					// TODO: clear Deserialization Error net core for estimate save
					updateData.ProjectId = serviceContainer.service.getSelected() ? serviceContainer.service.getSelected().Id : -1;
					$injector.get('estimateMainCommonService').ClearDeserializationError(updateData);
				};

				function setNewProjectCreatedId(id){
					serviceContainer.service.newProjectId = id;
				}

				function clearNewProjectCreatedId(){
					serviceContainer.service.newProjectId = null;
				}

				function executeProjectWorkflows(entityId) {
					var basicsWorkflowInstanceService = $injector.get('basicsWorkflowInstanceService');
					basicsWorkflowInstanceService.startWorkflowByEvent(eventUUID, entityId, null);
				}

				function executeModelWorkflows(entityId){
					var basicsWorkflowInstanceService = $injector.get('basicsWorkflowInstanceService');

					$http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'project/main/listsubscribedevent',
						data: {
							Uuid: modelEventUUID,
							ObjectId: entityId,
							Context : ''
						}
					}).then(function (response) {
						if( response.data !== null && response.data.length > 0 ){
							angular.forEach(response.data,function (event) {
								basicsWorkflowInstanceService.startWorkflow(event.TemplateId,entityId,null);
							});
						}
					});
				}
				function navigateTo(item, triggerfield) {

					if (triggerfield === 'fromRfqReq' || triggerfield === 'fromQtnReq') {
						var items = descriptorService.getData('reqheaderlookupview');
						var req = _.filter(items, function (rfq) {
							return rfq.Id === item.ReqHeaderFk;
						});
						if (req) {
							serviceContainer.data.prjID = req[0].ProjectFk;
						}
					} else if (triggerfield === 'Schedule.Project.ProjectNo') {
						serviceContainer.data.prjID = item.ProjectFk;
					} else if ((item && (platformObjectHelper.getValue(item, triggerfield) || item.ProjectFk)) || parseInt(item)) {
						serviceContainer.data.prjID = platformObjectHelper.getValue(item, triggerfield) || item.ProjectFk || parseInt(item);
					}
					projectMainPinnableEntityService.clear();
					serviceContainer.service.load().then(function () {
						const prjId = _.isString(serviceContainer.data.prjID) ? parseInt(serviceContainer.data.prjID) : serviceContainer.data.prjID;
						var prj = serviceContainer.service.getItemById(prjId);// Hope it is an id ...
						serviceContainer.service.setSelected(prj);
						pinnedProject = prjId;
						serviceContainer.data.prjID = null;
						setCurrentPinningContext();
					});

				}

				serviceContainer.service.navigateTo = navigateTo;

				/*
				serviceContainer.service.createItem = function createProject() {
					projectMainCreationInitialDialogService.showCreateDialog(serviceContainer.service, serviceContainer.data);
				};
				*/

				serviceContainer.service.mergeAfterEditCostGroupConfig = function mergeAfterEditCostGroupConfig(oldPrj, newPrj) {
					serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldPrj, newPrj, true, serviceContainer.data);
				};

				serviceContainer.service.takeOver = function takeOver(entity) {
					var data = serviceContainer.data;
					var dataEntity = data.getItemById(entity.Id, data);

					data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
					data.markItemAsModified(dataEntity, data);

					var fields = [
						{field: 'SubsidiaryFk', readonly: !dataEntity.BusinessPartnerFk},
						{field: 'ContactFk', readonly: !dataEntity.BusinessPartnerFk}
					];
					platformRuntimeDataService.readonly(dataEntity, fields);
				};

				serviceContainer.service.mergeProjectsAfterAlternativeCreation = function mergeItemAfterSuccessfullUpdate(projects) {
					const data = serviceContainer.data;
					_.forEach(projects, function(project) {
						const oldProjectState = data.getItemById(project.Id, data);
						if(oldProjectState) {
							data.mergeItemAfterSuccessfullUpdate(oldProjectState, project, true, data);
						}
					});
				};

				const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = function (deleteParams, data, responseData) {
					let dialogText = '';
					let show = false;
					if(!_.isNil(responseData)) {
						_.forEach(deleteParams.entities, function (entity) {
							const key = entity.ProjectNo;
							if (Object.hasOwn(responseData, key)) {
								if (!show) {
									show = true;
									dialogText += responseData[key];
								} else {
									dialogText += '\n';
									dialogText += '\n';
									dialogText += responseData[key];
								}
							}
						});
					}

					if(show) {
						var platformModalService = $injector.get('platformModalService');

						var modalOptions = {
							headerText: $translate.instant(moduleName + '.projectDeleteTitle'),
							bodyText: dialogText,
							iconClass: 'ico-info'
						};

						platformModalService.showDialog(modalOptions);
					}

					return originalOnDeleteDone.apply(this, arguments);
				};

				var projectEntityRelatedFilters = [
					{
						key: 'project-main-project-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (item) {
							return {
								BusinessPartnerFk: item !== null ? item.BusinessPartnerFk : null
							};
						}

					},
					{
						key: 'project-main-bill-subsidiary-filter',
						fn: function (subsidiary, item) {
							return (subsidiary.BusinessPartnerFk === item.BusinessPartnerFk);
						}
					},
					{
						key: 'project-main-project-customer-filter',
						serverSide: true,
						serverKey: 'project-main-project-customer-filter',
						fn: function () {
							var currentItem = serviceContainer.service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null
							};
						}
					},
					{
						key: 'project-main-contact-by-bizpartner-server-filter',
						serverSide: true,
						serverKey: 'project-main-contact-by-bizpartner-server-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinessPartnerFk
							};
						}
					},
					{
						key: 'project-main-bizpartner-contact-filter',
						serverSide: true,
						serverKey: 'project-main-bizpartner-contact-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinessPartnerFk
							};
						}
					},
					{
						key: 'project-main-status-by-rubric-category-filter',
						fn: function (status, project) {
							return status.RubricCategoryFk === project.RubricCategoryFk;
						}
					},
					{
						key: 'project-main-rubric-category-by-rubric-filter',
						fn: function (rc /** ,project */) {
							return rc.RubricFk === 3;//3 is rubric for project.
						}
					},
					{
						key: 'project-location-rubric-category-by-rubric-filter',
						fn: function (rc /** ,project */) {
							return rc.RubricFk === 85;//85 is rubric for location.
						}
					},
					{
						key: 'project-sales-rubric-category-by-rubric-filter',
						fn: function (rc /** ,project */) {
							return rc.RubricFk === 41;//41 is rubric for proeject sales.
						}
					},
					{
						key: 'project-controlling-unit-rubric-category-by-rubric-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							// 50 is rubric for controlling unit.
							return {Rubric: 50};
						}
					},
					{
						key: 'project-main-bill-to-customer-filter',
						serverSide: true,
						serverKey: 'project-main-project-customer-filter',
						fn: function () {
							var currentItem = $injector.get('projectMainBillToDataService').getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk:currentItem !== null ? currentItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'project-main-customer-subsidiary-filter',
						serverSide: true,
						serverKey: 'sales-common-customer-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity !== null ? entity.BusinessPartnerFk : null,
								SubsidiaryFk: entity !== null ? entity.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'project-clerk-role-by-is-for-project-filter',
						fn: function (cr /** ,project */) {
							return cr.IsForProject;//3 is rubric for location.
						}
					},
					{
						key: 'project-clerk-role-by-is-for-stock-filter',
						fn: function (cr) {
							return cr.IsForStock;
						}
					},
					{
						key: 'project-main-quantity-control-is-live-filter',
						fn: function (qc /*, project */) {
							return qc.IsLive;
						}
					},
					{
						key: 'project-group-hide-inactive-leave-filter',
						fn: function (pg /** ,project */) {
							return pg.IsLive|| ((!_.isNil(pg.Children) || pg.Children.length > 0) && _.some(pg.Children, function(pgc) {
								return pgc.IsLive || ((!_.isNil(pgc.Children) || pgc.Children.length > 0));
							}));
						}
					},
					{
						key: 'project-main-rubric-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: 3 };// 3 is rubric for project.
						}
					},
					{
						key: 'dispatch-nodes-rubric-category-lookup-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: 34 };
						}
					},
					{
						key: 'project-bill-to-rubric-category-by-rubric-filter',
						fn: function (rc) {
							return rc.RubricFk === projectMainConstantValues.values.billToRubricId ;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(projectEntityRelatedFilters);
				procurementContractHeaderFilterService.registerFilters();

				projectMainCharacteristicService.unregisterCreateAll(serviceContainer.service);

				serviceContainer.service.createDeepCopy = function createDeepCopy() {
					let project = serviceContainer.service.getSelected();
					project.copyObject = {};
					var command = {
						Action: 4,
						Project: project,
						copySuccessCallback: function (data, copyIdentifier) {
							serviceContainer.data.handleOnCreateSucceeded(data.Projects[0], serviceContainer.data);
							var pos = _.findIndex(copyIdentifier, function (item) {
								return item === 'basics.characteristic.data';
							});
							if (pos <= 0) {
								projectMainCharacteristicService.onEntityCreated(serviceContainer.service, data.Projects[0]);
							}
						},
						projectEntityFormConfig: projectMainCreationInitialDialogService.getFormConfig()
					};

					projectMainCopyEntityService.copyProject(command);
				};

				var costGroupNumberRegEx = /^PrjCostGroup(\d+)Fk*/;
				var selectedCostGroupIndex;
				var selectedCostGroupFk;

				function selectCostGroupItem(costGroupService, costGroupIndex) {
					if (selectedCostGroupFk && selectedCostGroupIndex && selectedCostGroupIndex === costGroupIndex) {
						$timeout(function () {
							var selectedCostGroupItem = costGroupService.getItemById(selectedCostGroupFk);
							if (selectedCostGroupItem) {
								costGroupService.setSelected(selectedCostGroupItem);
								selectedCostGroupFk = null;
								selectedCostGroupIndex = null;
							}
						});
					}
				}

				serviceContainer.service.selectCostGroupItem = selectCostGroupItem;

				serviceContainer.service.navigateToCostGroup = function (item, triggerField) {
					if (_.isObject(item) && _.isNumber(item[triggerField])) {
						var numberResult = costGroupNumberRegEx.exec(triggerField);
						if (_.isArray(numberResult) && numberResult.length === 2) {
							var index = Number(numberResult[1]);
							var costGroupService = $injector.get('projectMainCostGroup' + index + 'DataService');
							// Id for project cost groups list container starts from 10 and then incremented by two.
							// So below equation is created to get container Id from current cost groups type
							var targetContainer = 8 + (index * 2);
							var success = showTargetContainer(targetContainer.toString());
							if (success) {
								selectedCostGroupIndex = index;
								selectedCostGroupFk = item[triggerField];
								selectCostGroupItem(costGroupService, index);
							}
						}
					}
				};

				function showTargetContainer(targetContainer) {
					var tabList = mainViewService.getTabs();
					return _.some(tabList, function (tab, index) {
						if (_.isObject(tab.activeView) && _.isObject(tab.activeView.Config)) {
							var config = tab.activeView.Config;
							if (_.isArray(config.subviews)) {
								var isSubViewMatching = _.some(config.subviews, function (subView) {
									if (_.isObject(subView)) {
										var content = subView.content;
										if (_.isString(content) && targetContainer === content) {
											return true;
										} else if (_.isArray(content)) {
											var index = _.findIndex(content, function (item) {
												return item === targetContainer;
											});
											if (index >= 0) {
												if (index > 0) {
													content.splice(index, 1);
													content.unshift(targetContainer);
												}
												return true;
											}
										}
									}
									return false;
								});
								if (isSubViewMatching) {
									if (mainViewService.getActiveTab() !== index) {
										mainViewService.setActiveTab(index);
									}
									return true;
								}
							}
						}
						return false;
					});
				}

				function updateResourcesToSaveAndToDelete(estResourcesToSave, estResourcesToDelete,isPrjAssembly){
					estResourcesToSave = estResourcesToSave || [];
					estResourcesToDelete = estResourcesToDelete || [];

					// Prepare
					let estimateMainResourceService = isPrjAssembly ? $injector.get('projectAssemblyResourceService') : $injector.get('projectPlantAssemblyResourceService');
					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					let estimateMainCompleteCalculationService = $injector.get('estimateMainCompleteCalculationService');
					let cloudCommonGridService = $injector.get('cloudCommonGridService');
					let itemName = isPrjAssembly ? 'PrjEstResource' : 'PrjPlantAssemblyResource';
					let estimateMainResourceType = $injector.get('estimateMainResourceType');
					let resources = angular.copy(estResourcesToSave);
					let resTypesToValidate = [estimateMainResourceType.CostCode, estimateMainResourceType.Material, estimateMainResourceType.Plant, estimateMainResourceType.Assembly, estimateMainResourceType.SubItem]; // CostCode, Material,Equipment, Assembly and SubItem
					let resFieldToValidate = 'Code';

					let resourcesToRemoveFromCache = _.filter(resources, function(res){
						let resDto = res[itemName];
						// Created Items without Code assignment will be removed
						return resDto && resTypesToValidate.indexOf(resDto.EstResourceTypeFk) > -1 && (_.isEmpty(resDto[resFieldToValidate]) || platformRuntimeDataService.hasError(resDto, resFieldToValidate)) && resDto.Version === 0;
					});
					let resourcesToRevertFromCache = _.filter(resources, function(res){
						let resDto = res[itemName];
						return resDto && resTypesToValidate.indexOf(resDto.EstResourceTypeFk) > -1 && platformRuntimeDataService.hasError(resDto, resFieldToValidate) && resDto.Version > 0;
					});

					// Case 1: New resources with validation error(empty Code) will not be saved and will be removed here
					_.forEach(resourcesToRemoveFromCache, function(r){

						let resToSave = _.map(estResourcesToSave, itemName);
						let childrenRelationIds = [];
						let childRelated = _.find(resToSave, { EstResourceFk: r.MainItemId, Version: 0 });

						while (childRelated !== undefined){
							childrenRelationIds.push(childRelated.Id);
							childRelated = _.find(resToSave, { EstResourceFk: childRelated.Id, Version: 0 });
						}
						// Remove children relation
						_.forEach(childrenRelationIds, function(id){
							_.remove(estResourcesToSave,{ MainItemId: id });
						});
						// Remove resource with error
						_.remove(estResourcesToSave,{ MainItemId: r.MainItemId });
					});

					// Case 2: Existing resources were updated and were left with errors
					let resDataOriginal = estimateMainResourceService.getDataOriginal();
					let resDataToUpdate = [];

					_.forEach(resourcesToRevertFromCache, function(r){

						// Revert changes from UI
						let resOriginal = _.find(resDataOriginal, { Id: r.MainItemId });
						let resItemToRevert = estimateMainResourceService.getItemById(r.MainItemId);
						if (resItemToRevert.__rt$data && resItemToRevert.__rt$data.errors) {
							resItemToRevert.__rt$data.errors = null;
						}

						// Keep current resources items and do not revert from original otherwise will mismatch will occur
						if (resOriginal.EstAssemblyFk > 0){
							// Restore composite resources
							let itemCompositeList = [];
							cloudCommonGridService.flatten([resOriginal], itemCompositeList, 'EstResources');
							_.forEach(itemCompositeList, function(c){
								let itemComposite = _.find(estResourcesToDelete,{ Id: c.Id} );
								if (itemComposite){
									_.remove(estResourcesToDelete,{ Id: c.Id });
									var estResourceToSaveItem = {};
									estResourceToSaveItem.MainItemId = c.Id;
									estResourceToSaveItem[itemName] = itemComposite;
									estResourcesToSave.push(estResourceToSaveItem);
									estimateMainResourceService.getList().push(itemComposite);
								}
							});
						}else{
							delete resOriginal.EstResources;
						}
						// Restore
						angular.extend(resItemToRevert, resOriginal);

						while (resOriginal !== undefined){
							resDataToUpdate.push(resOriginal);
							resOriginal = _.find(resDataOriginal, { Id: resOriginal.EstResourceFk || 0 });
						}
					});

					// Re-Calculate resources
					if (resDataToUpdate.length > 0){
						let r = resourcesToRevertFromCache[0][itemName];
						let lineItem = isPrjAssembly ? $injector.get('projectAssemblyMainService').getItemById(r.EstLineItemFk) : $injector.get('projectPlantAssemblyMainService').getItemById(r.EstLineItemFk);
						let resourceTree = estimateMainResourceService.getTree();
						estimateMainCompleteCalculationService.updateResourcesNew(lineItem, resourceTree);

						// Update to Save
						let resourceList = estimateMainResourceService.getList();
						_.forEach(resDataToUpdate, function(r){
							let resToSave = _.find(estResourcesToSave, { MainItemId: r.Id });
							let resCalculated = _.find(resourceList, { Id: r.Id });

							angular.extend(resToSave[itemName], resCalculated);
						});
					}

					// Refresh UI for current line item
					if (resourcesToRemoveFromCache.length > 0 || resourcesToRevertFromCache.length > 0){
						let selectedLineItem = isPrjAssembly ? $injector.get('projectAssemblyMainService').getSelected() || {} : $injector.get('projectPlantAssemblyMainService').getSelected() || {};
						let lineItemId = (resourcesToRemoveFromCache.concat(resourcesToRevertFromCache))[0][itemName].EstLineItemFk;

						if (selectedLineItem && Object.prototype.hasOwnProperty.call(selectedLineItem,'Id') && selectedLineItem.Id === lineItemId){
							// Remove errors from UI
							let resourcesToDelete = _.map(resourcesToRemoveFromCache, itemName);

							let selectedResource = estimateMainResourceService.getSelected() || {};
							estimateMainResourceService.deleteEntities(resourcesToDelete);

							// highlight the selected resource if it is reverted
							estimateMainResourceService.setSelected(selectedResource);
						}
					}
				}

				function collectUserDefinedPriceValueToSave(updateData){
					let PrjUserDefinedPriceCompleteToSave = [];

					function getUpdateData(serviceName, toSave){
						let dynamicUserDefinedColumnService = $injector.get(serviceName);
						if(dynamicUserDefinedColumnService.isNeedUpdate()){
							toSave.push(dynamicUserDefinedColumnService.getUpdateData());
						}
					}

					// from project cost code
					getUpdateData('projectCostCodesDynamicUserDefinedColumnService', PrjUserDefinedPriceCompleteToSave);

					// from project cost code job rate
					getUpdateData('projectCostCodesJobRateDynamicUserDefinedColumnService', PrjUserDefinedPriceCompleteToSave);

					// from project assembly
					getUpdateData('projectAssemblyDynamicUserDefinedColumnService', PrjUserDefinedPriceCompleteToSave);

					// from project assembly resource
					getUpdateData('projectAssemblyResourceDynamicUserDefinedColumnService', PrjUserDefinedPriceCompleteToSave);

					// from project plant assembly
					getUpdateData('projectPlantAssemblyDynamicUserDefinedColumnService', PrjUserDefinedPriceCompleteToSave);

					// from project plant assembly resource
					getUpdateData('projectPlantAssemblyResourceDynamicUserDefinedColumnService', PrjUserDefinedPriceCompleteToSave);

					if(PrjUserDefinedPriceCompleteToSave.length > 0){
						updateData.PrjUserDefinedPriceCompleteToSave = PrjUserDefinedPriceCompleteToSave;
					}

				}

				function provideUpdateData(updateData) {
					let isPrjAssembly = true;
					if (updateData && updateData.PrjEstLineItemToSave && updateData.PrjEstLineItemToSave.length > 0){
						_.forEach(updateData.PrjEstLineItemToSave, function(updateDataPrjEstLineItemToSave){
							updateResourcesToSaveAndToDelete(updateDataPrjEstLineItemToSave.PrjEstResourceToSave, updateDataPrjEstLineItemToSave.PrjEstResourceToDelete,isPrjAssembly);
						});
					}

					if (updateData && updateData.PrjPlantAssemblyToSave && updateData.PrjPlantAssemblyToSave.length > 0){
						isPrjAssembly = false;
						_.forEach(updateData.PrjPlantAssemblyToSave, function(resToSave){
							updateResourcesToSaveAndToDelete(resToSave.PrjPlantAssemblyResourceToSave, resToSave.PrjPlantAssemblyResourceToDelete,isPrjAssembly);
						});
					}

					// get user defined cost(price) value to update
					collectUserDefinedPriceValueToSave(updateData);

					return updateData;
				}

				serviceContainer.data.provideUpdateData = provideUpdateData;
				serviceContainer.service.showTargetContainer = showTargetContainer;

				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				serviceContainer.service.deleteEntities = function deleteEntities(entities) {
					var platformModalService = $injector.get('platformModalService');
					var modalOptions = {
						headerTextKey: moduleName + '.confirmDeleteTitle',
						bodyTextKey: $translate.instant(moduleName + '.confirmDeletePrjHeader'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};
					return platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.yes) {
							serviceContainer.data.deleteEntities(entities, serviceContainer.data);
						}
					});
				};

				serviceContainer.service.registerRefreshRequested($injector.get('basicsCommonUserDefinedColumnConfigService').reLoad);

				//new refresh
				serviceContainer.service.callRefresh = serviceContainer.service.refresh || serviceContainer.data.onRefreshRequested;

				serviceContainer.service.getContainerData = function getContainerData() {
					return serviceContainer.data;
				};

				serviceContainer.data.readOnlyFlag = null;

				serviceContainer.service.registerDataModified (
					function (e, item){
						let selected = serviceContainer.service.getSelected();
						if(selected && selected.IsReadOnly !== serviceContainer.data.readOnlyFlag){
							serviceContainer.service.setReadOnly(selected.IsReadOnly);
						}
					}
				);

				serviceContainer.service.registerSelectionChanged (
					function (e, item){
						if(item){
							serviceContainer.service.setReadOnly(item.IsReadOnly);
						}
					}
				);

				serviceContainer.data.getCurrentViewsWithoutRoot = function getCurrentViewsWithoutRoot() {
					let mainContainerUuid = projectMainConstantValues.uuid.container.projectList.toLowerCase();
					let availableContainer = mainViewService.getAllViews();
					if(_.isNil(availableContainer)) {
						return [];
					}
					return _.filter(availableContainer.map(v => v.uuid), uuid => uuid !== mainContainerUuid);
				};

				serviceContainer.service.setReadOnly = function setReadOnly (isReadOnly) {
					if (serviceContainer.data.readOnlyFlag === isReadOnly) {
						return; // Nothing has changed -> nothing to be done
					}
					serviceContainer.data.readOnlyFlag = isReadOnly;
					let availableContainer = serviceContainer.data.getCurrentViewsWithoutRoot();

					if(availableContainer.length > 0) {
						if (isReadOnly) {
							platformPermissionService.restrict(availableContainer, permissions.read);
						} else {
							platformPermissionService.restrict(availableContainer);
						}
					}
				};

				return serviceContainer.service;
			}]);
})();
