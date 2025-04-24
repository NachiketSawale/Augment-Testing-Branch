/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateMainBidCreationWizardController
	 * @function
	 *
	 * @description
	 * Controller for the wizard dialog used to collect the settings and informations to be able to create a bid
	 * based on the current status of the line items in the estimation
	 **/
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainBidCreationWizardController',
		['$scope',
			'_',
			'$q',
			'$sce',
			'$http',
			'$translate',
			'platformGridAPI',
			'platformUtilService',
			'$timeout',
			'platformTranslateService',
			'platformModuleNavigationService',
			'estimateMainService',
			'salesBidService',
			'estimateMainBidCreationService',
			'salesBidCreateBidDialogService',
			'estimateMainEstUppUIConfigService',
			'estimateMainEstUppConfigTypeService',
			'estimateMainEstUppDataService',
			'$injector',
			'salesBidBillingSchemaService',
			'estimateMainUpp2CostcodeDetailDataService',
			'boqMainPropertiesConfigService',
			'salesCommonBaseBoqLookupService',
			'cloudCommonGridService',
			'basicsLookupdataConfigGenerator',
			'estimateMainBidCreationProcessService',
			'schedulingLookupScheduleDataService',
			'platformModalService',
			'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDescriptorService',
			'schedulingLookupScheduleTypeDataService',
			'salesBidValidationService',
			'estimateMainScopeSelectionService',
			'platformRuntimeDataService',
			'WizardHandler',
			'mainViewService',
			'estimeMainCraeteBidOptionProfileService',
			function ($scope,// jshint ignore:line
				_,
				$q,
				$sce,
				$http,
				$translate,
				platformGridAPI,
				platformUtilService,
				$timeout,
				platformTranslateService,
				naviService,
				estimateMainService,
				salesBidService,
				estimateMainBidCreationService,
				salesBidCreateBidDialogService,
				estimateMainEstUppUIConfigService,
				estimateMainEstUppConfigTypeService,
				estimateMainEstUppDataService,
				$injector,
				salesBidBillingSchemaService,
				estimateMainUpp2CostcodeDetailDataService,
				boqMainPropertiesConfigService,
				salesCommonBaseBoqLookupService,
				cloudCommonGridService,
				basicsLookupdataConfigGenerator,
				estimateMainBidCreationProcess,
				schedulingLookupScheduleDataService,
				platformModalService,
				basicsLookupdataLookupFilterService,
				basicsLookupdataLookupDescriptorService,
				schedulingLookupScheduleTypeDataService,
				salesBidValidationService,
				estimateMainScopeSelectionService,
				platformRuntimeDataService,
				WizardHandler,
				mainViewService,
				estimeMainCraeteBidOptionProfileService) {

				let optionalGridId = '402e0a30c8a54a90b3af9ec03d591328';

				$scope.path = globals.appBaseUrl;
				$scope.trustAsHtml = $sce.trustAsHtml;

				$scope.error = {
					show: false,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.executedError'),
					iconCol: 1,
					type: 3
				};

				$scope.urpSelectionError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.urpSelectionError'),
					iconCol: 1,
					type: 1
				};

				$scope.assignError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.assignmentError'),
					iconCol: 1,
					type: 3
				};

				$scope.executionScheduleError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.scheduleExecutionError'),
					iconCol: 1,
					type: 3
				};

				$scope.noLineItemStructureError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.noLineItemStructureData'),
					iconCol: 1,
					type: 3
				};

				$scope.noMainBidSelelectedError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.noMainBidSelectedError'),
					iconCol: 1,
					type: 3
				};


				$scope.steps = [
					{number: 0, identifier: 'basic', name: $translate.instant('estimate.main.bidCreationWizard.basic')},
					{
						number: 1,
						identifier: 'structure',
						name: $translate.instant('estimate.main.bidCreationWizard.structure')
					},
					{
						number: 2,
						identifier: 'uppConfig',
						name: $translate.instant('estimate.main.bidCreationWizard.uppConfig')
					},
					{
						number: 3,
						identifier: 'projectChange',
						name: $translate.instant('estimate.main.bidCreationWizard.projectChange')
					},
					{
						number: 4,
						identifier: 'surcharge',
						name: $translate.instant('estimate.main.bidCreationWizard.surchargeCheck')
					},
					{
						number: 5,
						identifier: 'optional',
						name: $translate.instant('estimate.main.bidCreationWizard.optional')
					}
				];

				// region loading status

				$scope.isLoading = false;
				$scope.loadingInfo = '';

				// endregion

				// region config view step 0 (Basic Setting)
				let formConfigBasicSettings = salesBidCreateBidDialogService.getFormConfig();


				$scope.formOptionsBasicSettings = {
					configure: formConfigBasicSettings
					// validationMethod:
				};


				// endregion

				// region config view step 1 (Urp Config)
				let isSelectedUpdateMode = false;
				let boqLookupValues = [], activityLookupValues = [], estUppDefaultConfigTypeFk = null,
					boqStructures = [], currentMaxStep = 0, loadSuccessFlag = false,
					bidHeaderId = null, usingURP = false, isUppConfigLoaded = false;

				let formConfigUppConfigSettings = estimateMainEstUppUIConfigService.getFormConfig();
				let boqURPConfigProperties = boqMainPropertiesConfigService.getFormConfig(true);
				let boqURPConfigPropertiesGrp = _.filter(boqURPConfigProperties.groups, {gid: '3'});
				if (boqURPConfigPropertiesGrp && angular.isArray(boqURPConfigPropertiesGrp) && boqURPConfigPropertiesGrp.length > 0) {
					boqURPConfigPropertiesGrp[0].sortOrder = 5;
					boqURPConfigPropertiesGrp[0].isOpen = false;
				}
				let boqURPConfigPropertiesRows = _.filter(boqURPConfigProperties.rows, {gid: '3'});

				let basicGroupForURP = [
					{
						gid: 'estBasicURP',
						header: 'Structure Configuration',
						header$tr$: 'estimate.main.bidCreationWizard.Configuration',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				];

				let urpConfigForWizard = [

					// Split Per Structure
					{
						gid: 'estBasicURP',
						rid: 'estUppSplitPerStructure',
						label: 'Split Per Structure',
						label$tr$: 'estimate.main.estUppSplitPerStructure',
						type: 'boolean',
						model: 'SplitPerStructure',
						sortOrder: 1,
						visible: false
					},

					// Edit Type
					{
						gid: 'estUpp',
						rid: 'estUppEditType',
						label: 'Edit Type',
						label$tr$: 'estimate.main.estUppEditType',
						type: 'boolean',
						model: 'EstUppEditType',
						sortOrder: 11
					}
				];

				// region structures lookup
				function boqCopy(selectedLookupItem, boqHeaderFk, sourceInfo, estUppDefaultConfigTypeFk, data) {
					if (selectedLookupItem.BoqHeader && selectedLookupItem.BoqHeader.Id) {
						boqHeaderFk = selectedLookupItem.BoqHeader.Id;
					}
					sourceInfo = boqHeaderFk;
					copyURPConfigIntoAssignments(selectedLookupItem.Id, boqHeaderFk, sourceInfo, selectedLookupItem, estUppDefaultConfigTypeFk, data);
					return {boqHeaderFk: boqHeaderFk, sourceInfo: sourceInfo};
				}

				function boqItemSelectedChangeEvent(selectedLookupItem, selectedItem, previousLookupItem) {
					let boqHeaderFk = null;
					let sourceInfo = null;

					if (selectedLookupItem && selectedItem) {
						currentSelectedLookupItem = selectedLookupItem;
						if (previousLookupItem && previousLookupItem.BoqHeader && previousLookupItem.BoqHeader.Id && previousLookupItem.BoqRootItem && previousLookupItem.BoqRootItem.Reference) {
							boqHeaderFk = previousLookupItem.BoqHeader.Id;
							// sourceInfo = previousLookupItem.BoqRootItem.Reference + '-' + previousLookupItem.BoqRootItem.BriefInfo.Translated;
							sourceInfo = boqHeaderFk;
							// copy the urp config into StructureURPAssignments
							copyURPConfigIntoAssignments(previousLookupItem.Id, boqHeaderFk, sourceInfo, selectedLookupItem);
							// copy the selected structure into entity
							copyURPConfigIntoEntity(selectedLookupItem.Id, selectedLookupItem.BoqHeader.Id);
							setUrpConfigReadOnly(selectedLookupItem.BoqHeader.hasVersionBoq);
							estimateMainUpp2CostcodeDetailDataService.resetGridHeaderTitle($scope.entity);
						} else {
							boqCopy(selectedLookupItem, boqHeaderFk, sourceInfo);
						}
					}
				}

				function setUrpConfigReadOnly(readonly){
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'NameUrb1', readonly);
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'NameUrb2', readonly);
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'NameUrb3', readonly);
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'NameUrb4', readonly);
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'NameUrb5', readonly);
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'NameUrb6', readonly);
					estimateMainBidCreationProcess.setReadOnly($scope.entity, 'CalcFromUrb', readonly);
				}

				function boqStructureLookup() {
					// Structure
					return {
						gid: 'estBasicURP',
						rid: 'estUppStructure',
						label: 'Structures',
						label$tr$: 'estimate.main.estUppStructures',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-base-boq-lookup',
							descriptionMember: 'BoqRootItem.BriefInfo.Translated',
							lookupOptions: {
								showClearButton: false,
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = args.entity;
											let selectedLookupItem = args.selectedItem;
											let previousLookupItem = args.previousItem;

											boqItemSelectedChangeEvent(selectedLookupItem, selectedItem, previousLookupItem);
										}
									}
								],
								onDataRefresh: function ($scope) {
									salesCommonBaseBoqLookupService.clearBaseBoqList();
									salesCommonBaseBoqLookupService.getSalesBaseBoqList().then(function (data) {
										boqLookupValues = data;
										$scope.refreshData(data);
									});
								}
							}
						},
						model: 'EstUppStructure',
						sortOrder: 2
					};
				}

				// activity structure lookup
				function activityCopy(selectedLookupItem, activityFk, sourceInfo, estUppDefaultConfigTypeFk, data) {
					if (selectedLookupItem.Id) {
						activityFk = selectedLookupItem.Id;
					}
					sourceInfo = activityFk;// new solution for udpate->using original fk as sourceinfo for update process
					copyURPConfigIntoAssignments(selectedLookupItem.Id, activityFk, sourceInfo, selectedLookupItem, estUppDefaultConfigTypeFk, data);
					return {activityFk: activityFk, sourceInfo: sourceInfo};
				}

				function activitySelectedItemEvent(selectedLookupItem, selectedItem, previousLookupItem) {
					let activityFk = null;
					let sourceInfo = null;

					if (selectedLookupItem && selectedItem) {
						if (previousLookupItem && previousLookupItem.Id && previousLookupItem.Code && previousLookupItem.DescriptionInfo) {
							activityFk = previousLookupItem.Id;
							// sourceInfo = previousLookupItem.Code + '-' + previousLookupItem.DescriptionInfo.Translated;
							sourceInfo = activityFk;
							// copy the urp config into StructureURPAssignments
							copyURPConfigIntoAssignments(previousLookupItem.Id, activityFk, sourceInfo, selectedLookupItem);
							// copy the selected structure into entity
							copyURPConfigIntoEntity(selectedLookupItem.Id);
						} else {
							activityCopy(selectedLookupItem, activityFk, sourceInfo);
						}
					}
				}

				let isExecutionScheduleTypes = [];

				let filter = {
					key: 'scheduling-bid-creation-dialog-lookup-filter',
					serverSide: false,
					fn: function (item) {
						return (item.IsLive && _.includes(isExecutionScheduleTypes, item.ScheduleTypeFk));
					}
				};
				basicsLookupdataLookupFilterService.registerFilter(filter);

				let projectContractTypefilter = {
					key: 'basic-project-contract-type-lookup-filter',
					serverSide: false,
					fn: function (item){
						return item.IsLive;
					}
				};
				basicsLookupdataLookupFilterService.registerFilter(projectContractTypefilter);

				function activityStructureLookup() {
					let lookupConfig = basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
						dataServiceName: 'schedulingLookupScheduleDataService',
						filter: function () {
							return ($scope.entity.ProjectFk + '&estHeaderFk=' + estimateMainService.getSelectedEstHeaderId());
						},
						desMember: 'DescriptionInfo.Translated',
						filterKey: 'scheduling-bid-creation-dialog-lookup-filter',
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									let selectedItem = args.entity;
									let selectedLookupItem = args.selectedItem;
									let previousLookupItem = args.previousItem;

									activitySelectedItemEvent(selectedLookupItem, selectedItem, previousLookupItem);
								}
							}
						]
					}, {
						gid: 'estBasicURP',
						rid: 'estUppStructure',
						model: 'EstUppStructure',
						sortOrder: 2,
						label: 'Structures',
						label$tr$: 'estimate.main.estUppStructures',
						type: 'integer'
					});
					lookupConfig.options.disableDataCaching = false;
					return lookupConfig;
				}

				// only boq and activity have the lookup type
				function getLookupByStructureType(type) {
					let structureType = type || $scope.entity.StructureType;
					let lookupObject;
					switch (structureType) {
						case 1: // Boq
							lookupObject = boqStructureLookup();
							// initBoqLookupData();
							break;
						case 2: // Activity
							lookupObject = activityStructureLookup();
							// initActivityLookupData();
							break;
						default:
							lookupObject = boqStructureLookup();
							lookupObject.readonly = true;
							$scope.entity.EstUppStructure = -1;
							$scope.entity.SplitPerStructure = false;
							break;
					}
					return platformTranslateService.translateObject(lookupObject);
				}

				function initSelectEstimateScope(entity) {

					if (entity.StructureType !== 1) {
						// return $q.when({data: false});
						return false;
					}

					return estimateMainBidCreationService.hasSurcharge4boq();

					// let projectId = estimateMainService.getSelectedProjectId();

					// let estHeaderId = estimateMainService.getSelectedEstHeaderId();

					// return $http.get(globals.webApiBaseUrl + 'boq/project/iscontainersurcharge4boq?projectId=' + projectId + '&estHeaderId=' + estHeaderId);
				}

				function setEstimateScopeVisible(value) {

					let estimateScopeRow = _.find($scope.formOptionsStructureSettings.configure.rows, {model: 'estimateScope'});

					if (estimateScopeRow) {
						estimateScopeRow.visible = value;
					}

					$scope.$broadcast('form-config-updated');
				}

				function initBoqLookupData() {
					let defered = $q.defer();
					if (boqLookupValues.length <= 0) {
						salesCommonBaseBoqLookupService.clearBaseBoqList();
						salesCommonBaseBoqLookupService.getSalesBaseBoqList().then(function (data) {
							let boqIdsString = '';
							boqLookupValues = data;
							_.forEach(boqLookupValues, function (item){boqIdsString += item.BoqHeader.Id + '|';});
							$http.get(globals.webApiBaseUrl + 'estimate/main/estboq2uppconfig/getestboq2uppconfigs?estHeaderId='+estimateMainService.getSelectedEstHeaderId()+'&boqIdsString=' + boqIdsString).then(function (res){
								if(res && res.data){
									_.forEach(boqLookupValues, function (boq) {
										let uppConfig = _.find(res.data, {BoqHeaderFk: boq.BoqHeader.Id});
										boq.uppConfigFk = uppConfig ? uppConfig.EstUppConfigFk : null;
										boq.uppConfigTypeFk = uppConfig ? uppConfig.EstUppConfigtypeFk : null;
									});
								}

								_.forEach(boqLookupValues, function (boq) {
									if (boq.BoqHeader) {
										// load structure set cache
										getBoqStructureFromCache(boq.BoqHeader.BoqStructureFk);

										$http.post(globals.webApiBaseUrl + 'boq/main/hasversionboqs?baseBoqHeaderId='+boq.BoqHeader.Id).then(function (res){
											boq.BoqHeader.hasVersionBoq = res && !!res.data;
										});

									}
								});
								// add success flag here to enable 'next' button
								loadSuccessFlag = true;
								defered.resolve(data);
							});
						});
					} else {
						// add success flag here to enable 'next' button
						loadSuccessFlag = true;
						defered.resolve(boqLookupValues);
					}
					return defered.promise;
				}

				function initActivityLookupData() {
					let defered = $q.defer();
					if (activityLookupValues.length <= 0) {
						let options = {
							disableDataCaching: false
						};
						schedulingLookupScheduleDataService.setFilter($scope.entity.ProjectFk);
						schedulingLookupScheduleDataService.getList(options).then(function (data) {

							activityLookupValues = _.filter(data, function (item) {
								return (_.includes(isExecutionScheduleTypes, item.ScheduleTypeFk) && item.IsLive);
							});
							// if activityLookupValues.length === 0 then show error
							if (activityLookupValues.length === 0) {
								$scope.executionScheduleError.show = true;
							}
							activityLookupValues = _.orderBy(activityLookupValues, ['Code'], ['asc']);

							// add success flag here to enable 'next' button
							loadSuccessFlag = true;
							defered.resolve(data);
						});
					} else {
						if (activityLookupValues.length === 0) {
							$scope.executionScheduleError.show = true;
						}
						activityLookupValues = _.orderBy(activityLookupValues, ['Code'], ['asc']);

						// add success flag here to enable 'next' button
						loadSuccessFlag = true;

						defered.resolve(activityLookupValues);
					}
					return defered.promise;
				}

				function getIsExecutionScheduleType() {
					let scheduleType = basicsLookupdataLookupDescriptorService.getData('ScheduleType');
					isExecutionScheduleTypes = _.map(_.filter(scheduleType, function (item) {
						return (item.Isexecution && item.IsLive);
					}), 'Id');
				}

				function changeToStructureLookup() {
					// first remove the pre structure type lookup
					_.remove(formConfigUppConfigSettings.rows, function (item) {
						return item.rid === 'estUppStructure';
					});
					formConfigUppConfigSettings.rows = formConfigUppConfigSettings.rows.concat(getLookupByStructureType());
				}

				// endregion

				formConfigUppConfigSettings.groups = formConfigUppConfigSettings.groups.concat(boqURPConfigPropertiesGrp).concat(basicGroupForURP);
				formConfigUppConfigSettings.rows = formConfigUppConfigSettings.rows.concat(boqURPConfigPropertiesRows);

				formConfigUppConfigSettings.rows = _.orderBy(formConfigUppConfigSettings.rows.concat(urpConfigForWizard), ['sortOrder'], ['asc']);

				// make upp config type readonly
				let processItemRows = _.filter(formConfigUppConfigSettings.rows, {gid: 'estUpp'});

				function processItem(refresh) {
					estimateMainBidCreationProcess.processItem($scope.entity, processItemRows, getFlatCostCodes());
					if (refresh) {
						estimateMainUpp2CostcodeDetailDataService.gridRefresh();
					}
				}

				function showConfirmDeleteDialog() {
					let modalOptions = {
						headerTextKey: $translate.instant('estimate.main.bidCreationWizard.configTypeChangeConfirmTitle'),
						bodyTextKey: $translate.instant('estimate.main.bidCreationWizard.configTypeChangeConfirmBody'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};
					return platformModalService.showDialog(modalOptions);
				}

				function uppConfigTypeChangeEvent(item) {
					$scope.isLoading = true;
					estimateMainEstUppDataService.loadByContextId(item.estUppConfigTypeFk).then(function (data) {
						if (data) {
							// set the urp config description here
							$scope.entity.estUppConfigDesc = data.estUppConfigDesc;
							$scope.entity.EstUppConfigtypeFk = $scope.entity.estUppConfigTypeFk;
							if (data.estUppConfig) {
								$scope.entity.EstUppConfigFk = data.estUppConfig.Id;
							}
							// processItem(true);
						} else {
							processItem(true);
						}
						$scope.isLoading = false;
					});
				}

				// Add change handler
				formConfigUppConfigSettings.change = function change(item, model) {
					// let urpEditType = $scope.entity.EstUppEditType;
					if (model === 'estUppConfigTypeFk') {
						if (item.EstUppEditType) {
							showConfirmDeleteDialog().then(function (result) {
								if (result.yes) {
									uppConfigTypeChangeEvent(item);
								} else {
									$scope.entity.estUppConfigTypeFk = $scope.entity.EstUppConfigtypeFk;
								}
							});
						} else {
							uppConfigTypeChangeEvent(item);
						}
					} else if (model === 'EstUppEditType') {
						if (item.EstUppEditType) {
							// reload the cost code detail when there is no urp config type
							$scope.entity.EstUppConfigFk = null;
							// reset the current 'EstUppUsingURP' and 'EstUpp2Costcode'
							$scope.entity.EstUppUsingURP = true;
							// $scope.entity.SplitPerStructure = true;
							makeCostCodesFlatAndAssign();
							// set readonly for the upp config detail
							processItem(true);
						} else {
							// reload from urp settings by config type
							item.estUppConfigTypeFk = item.EstUppConfigtypeFk = (item.EstUppConfigtypeFk || estUppDefaultConfigTypeFk);
							if (item.EstUpp2Costcode) {
								item.EstUpp2Costcode = [];
							}
							uppConfigTypeChangeEvent(item);
						}
					}
				};

				$scope.formOptionsUppConfigSettings = {
					configure: formConfigUppConfigSettings
					// validationMethod:
				};
				platformTranslateService.translateFormConfig($scope.formOptionsUppConfigSettings.configure);

				function updateUppConfig(uppConfig) {
					$scope.entity.uppConfig = uppConfig;
				}

				estimateMainEstUppDataService.onItemChange.register(updateUppConfig);
				estimateMainUpp2CostcodeDetailDataService.onItemModified.register(urpValidation);
				estimateMainUpp2CostcodeDetailDataService.clearData();

				// endregion

				// region config view step 2 (Structure Settings)

				let structureOptionItems = [
					{Id: 1, Description: $translate.instant('estimate.main.boqHeaderFk')},
					{Id: 4, Description: $translate.instant('estimate.main.mdcControllingUnitFk')},
					{Id: 3, Description: $translate.instant('estimate.main.prjLocationFk')},
					{Id: 2, Description: $translate.instant('estimate.main.psdActivityFk')},
					// {Id: 6, Description: $translate.instant('estimate.main.licCostGroup1Fk')},
					// {Id: 7, Description: $translate.instant('estimate.main.licCostGroup2Fk')},
					// {Id: 8, Description: $translate.instant('estimate.main.licCostGroup3Fk')},
					// {Id: 9, Description: $translate.instant('estimate.main.licCostGroup4Fk')},
					// {Id: 10, Description:$translate.instant('estimate.main.licCostGroup5Fk')},
					// {Id: 11, Description: $translate.instant('estimate.main.prjCostGroup1Fk')},
					// {Id: 12, Description: $translate.instant('estimate.main.prjCostGroup2Fk')},
					// {Id: 13, Description: $translate.instant('estimate.main.prjCostGroup3Fk')},
					// {Id: 14, Description: $translate.instant('estimate.main.prjCostGroup4Fk')},
					// {Id: 15, Description: $translate.instant('estimate.main.prjCostGroup5Fk')},
					{Id: 16, Description: $translate.instant('estimate.main.lineItemGroupingContainer')}
				];

				let scopeRow = estimateMainScopeSelectionService.getScopeFormRow(!estimateMainBidCreationService.hasSurcharge4boq());

				if (scopeRow) {
					scopeRow.gid = 'baseGroup';
					scopeRow.sortOrder = 5;
				}
				$injector.get('estimateWizardStructureTypeLookupService').setProjectId(estimateMainService.getSelectedProjectId());
				let formConfigStructureSettings =
					{
						fid: 'sales.bid.createBidWizardModal',
						version: '0.0.1',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [
									'structuretype', 'unassignedprojectchange', 'assignedprojectchange'
								]
							}
						],
						rows: [

							// Structure Type !make the Id same as Estimate Structure Type
							{
								gid: 'baseGroup',
								rid: 'structuretype',
								label$tr$: 'sales.bid.wizard.structureType',
								model: 'StructureType',
								type: 'select',
								options: {
									displayMember: 'Description',
									valueMember: 'Id',
									inputDomain: 'description',
									select: 1,
									serviceName: 'estimateWizardStructureTypeLookupService'
								},
								change: function(entity){
									$scope.UpdateOptions.StructureType = entity.StructureType;
								},
								visible: true,
								sortOrder: 1
							},
							// {
							// gid: 'baseGroup',
							// rid: 'boqItemquantityfromtype',
							// label$tr$: 'sales.bid.wizard.boqItemQuantityFromType',
							// model: 'BoqItemQuantityFromType',
							// type: 'select',
							// options: {
							// displayMember: 'Description',
							// valueMember: 'Id',
							// inputDomain: 'description',
							// select: 1,
							// serviceName: 'estimateWizardBoqItemQuantityFromTypeLookupService'
							// },
							// visible: true,
							// sortOrder: 1
							// },
							// Unassigned
							{
								gid: 'baseGroup',
								rid: 'majorLineItems',
								label: 'Based on major line items',
								label$tr$: 'estimate.main.basedOnMajorLineItems',
								type: 'boolean',
								model: 'MajorLineItems',
								change: function(entity){
									$scope.UpdateOptions.MajorLineItems = entity.MajorLineItems;
								},
								sortOrder: 1
							},
							// Assigned
							{
								gid: 'baseGroup',
								rid: 'projectChangeLineItems',
								label: 'Based on project change line items',
								label$tr$: 'estimate.main.basedOnProjectChangeLineItems',
								type: 'boolean',
								model: 'ProjectChangeLineItems',
								sortOrder: 2
							},

							// Using URP
							{
								gid: 'baseGroup',
								rid: 'estUppUsingURP',
								label: 'Use UR Breakdown',
								label$tr$: 'estimate.main.basedOnURB',
								type: 'boolean',
								model: 'EstUppUsingURP',
								change: function(entity){
									$scope.UpdateOptions.EstUppUsingURP = entity.EstUppUsingURP;
								},
								sortOrder: 4
							},
							{
								gid: 'baseGroup',
								rid: 'calculateHours',
								label: 'Update Hours',
								label$tr$: 'estimate.main.calculateHours',
								type: 'boolean',
								model: 'CalculateHours',
								change: function(entity){
									$scope.UpdateOptions.CalculateHours = entity.CalculateHours;
								},
								sortOrder: 5
							},
							{
								gid: 'baseGroup',
								rid: 'delOriginalBoq',
								label: 'Delete original Bid BoQ',
								label$tr$: 'estimate.main.bidCreationWizard.deleteOriginalBoq',
								type: 'boolean',
								model: 'DeleteOriginalBidBoq',
								sortOrder: 6,
								change: function(entity){
									if($scope.formOptionsBasicSettings.salesBidCreateUpdateWizardUpdateOrCreate !== '1'){
										$scope.UpdateOptions.DeleteOriginalBidBoq = entity.DeleteOriginalBidBoq;
									}
								},
								readonly: true
							},
							scopeRow
						]
					};

				formConfigStructureSettings.change = function change(item, model) {
					if (model === 'StructureType') {
						// initSelectEstimateScope($scope.entity).then(function(result){
						if (initSelectEstimateScope($scope.entity)) {
							$scope.entity.estimateScope = 0;
						}

						setEstimateScopeVisible(!initSelectEstimateScope($scope.entity));

						// set estimateScope readonly
						// estimateMainBidCreationProcess.setReadOnly($scope.entity, 'estimateScope', result.data);

						$scope.sameBoq2MultiLineItemWithDifferentChange.show = $scope.entity.StructureType === 1;

						validateAnyLineItemAssignment().then(function (valid) {
							if (valid) {
								clearAllUrpAssignments(true);
								if ($scope.entity.StructureType === 1) {
									initBoqLookupData();
								} else if ($scope.entity.StructureType === 2) {
									initActivityLookupData();
								} else {
									loadSuccessFlag = true;
								}
							}
						});

						// });

					} else if (model === 'estimateScope') {
						$scope.UpdateOptions.EstimateScope = item.estimateScope;
						validateAnyLineItemAssignment();
						updateSurchargeGrid(true,true);
					} else if (model === 'ProjectChangeLineItems' || model === 'MajorLineItems') {

						validateAnyLineItemAssignment().then(function () {
							// add success flag here to enable 'next' button
							loadSuccessFlag = true;
						});
						updateSurchargeGrid(true,true);
					} else if (model === 'EstUppUsingURP') {
						if (item.EstUppUsingURP) {
							if (item.StructureURPAssignments && item.StructureURPAssignments.length > 0) {
								item.StructureURPAssignments[0].EstUppUsingURP = item.EstUppUsingURP;
							}
							if (!usingURP && isUpdateMode() && bidHeaderId && angular.isNumber(bidHeaderId)) {
								usingURP = true;
								loadSettings(bidHeaderId, true);
							}
						} else {
							// should clear all the urpAssignments
							clearAllUrpAssignments();
							$scope.entity.EstUppUsingURP = false;
							usingURP = false;
						}
					} else if (model === 'CalculateHours') {
						if (item.CalculateHours) {
							if (item.StructureURPAssignments && item.StructureURPAssignments.length > 0) {
								item.StructureURPAssignments[0].CalculateHours = item.CalculateHours;
							}
						} else {
							$scope.entity.CalculateHours = false;
						}
					}
				};

				let dynamicColumns = $injector.get('basicsCommonUserDefinedColumnConfigService').getDynamicColumnConfig();
				if(dynamicColumns && dynamicColumns.length > 0){
					formConfigStructureSettings.rows.push({
						gid: 'baseGroup',
						rid: 'bidBoqUintRateGen',
						label: 'Bid BoQ Unit Rate Generate Criteria',
						label$tr$: 'estimate.main.bidCreationWizard.bidBoqUnitRateCri',
						type: 'directive',
						directive: 'estimate-main-create-bid-boq-unit-assign',
						model: 'BidBoqUintRateGen',
						sortOrder: 3
					});
				}

				formConfigStructureSettings.rows.push({
					gid: 'baseGroup',
					rid: 'updateFpBoqUnitRate',
					label: 'Update Unit Rate of fixed price BoQ items',
					label$tr$: 'estimate.main.bidCreationWizard.updateFpBoqUnitRate',
					type: 'boolean',
					model: 'UpdateFpBoqUnitRate',
					change: function(entity){
						$scope.UpdateOptions.UpdateFpBoqUnitRate = entity.UpdateFpBoqUnitRate;
					},
					sortOrder: 3
				});

				$scope.formOptionsStructureSettings = {
					configure: formConfigStructureSettings
					// validationMethod:
				};

				// endregion

				// region config view step 3 (Project Change Settings)

				let loadProjectChangeStatus = function () {
					return $http.post(globals.webApiBaseUrl + 'basics/customize/projectchangestatus/list').then(function (datas){
						if(datas && datas.data && datas.data.length > 0){
							datas.data = _.filter(datas.data, {IsLive: true});
						}
						return datas;
					});
				};

				let statusGridColumns = [
					{
						id: 'stateSelected',
						field: 'StateSelected',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						validator: 'stateSelectedChange'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true
					}
				];

				let statusGridId = 'b4c8fe94db154e72bed8fb879b08e2fa';

				$scope.statusGridData = {
					state: statusGridId
				};

				function setupStatusGrid() {

					if (!platformGridAPI.grids.exist(statusGridId)) {
						let statusGridConfig = {
							columns: angular.copy(statusGridColumns),
							data: [],
							id: statusGridId,
							lazyInit: false,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(statusGridConfig);
						platformTranslateService.translateGridConfig(statusGridConfig.columns);
					}
					updateStatusGrid();
				}

				function updateStatusGrid() {

					loadProjectChangeStatus().then(function (result) {
						if (angular.isDefined(result) && angular.isDefined(result.data) && _.isArray(result.data) && result.data.length > 0) {
							$scope.entity.ProjectChangeStatus = result.data;

							// Enhance project change status object by check property
							$scope.entity.ProjectChangeStatus = _.map($scope.entity.ProjectChangeStatus, function (statusItem) {
								statusItem.StateSelected = false;
								return statusItem;
							});
						}

						platformGridAPI.grids.invalidate(statusGridId);
						platformGridAPI.items.data(statusGridId, $scope.entity.ProjectChangeStatus);
					});
				}

				$scope.stateSelectedChange = function (entity, value, model) {
					/*
			 return {
			 apply: false,
			 error: $translate.instant('procurement.package.wizard.createRequisition.uniqueListViewError'),
			 error$tr$: $translate.instant('procurement.package.wizard.createRequisition.uniqueListViewError'),
			 valid: false
			 };
			 */
					if ($scope.entity.ProjectChangeStatus) {
						let projectChangeStatus = _.find($scope.entity.ProjectChangeStatus, {Id: entity.Id});
						if (projectChangeStatus) {
							projectChangeStatus[model] = value;
						}
						let changeStatus = _.filter($scope.entity.ProjectChangeStatus, function (item) {
							return item.StateSelected === true;
						});
						let changeStatusIds = _.map(changeStatus, 'Id');
						updateChangeOrderGrid(true, changeStatusIds);
					}
					return true;
				};

				let loadprojectChangeLineItems = function (filterByChangeStatus, changeStatusIds) {

					let filterInfo = {
						ProjectFk: estimateMainService.getSelectedProjectId(),
						EstHeaderFk: estimateMainService.getSelectedEstHeaderId(),
						FilterByChangeStatus: filterByChangeStatus,
						ChangeStatusIds: filterByChangeStatus ? changeStatusIds : []
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/getprojectchangelineitems', filterInfo);

					// The project change details list returns all line items that have a project change reference set.
					// return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getprojectchangelineitems?estHeaderFk=' + estimateMainService.getSelectedEstHeaderId());
				};


				let detailsGridId = '2873f82c86f34e04bd90a08e936e52bf';

				$scope.detailsGridData = {
					state: detailsGridId
				};

				function updateDetailsGrid(filterByChangeStatus, changeStatusIds) {

					loadprojectChangeLineItems(filterByChangeStatus, changeStatusIds).then(function (result) {
						let lineItems = result.data;
						if (angular.isDefined(lineItems) && _.isArray(lineItems) && lineItems.length > 0) {
							$scope.entity.ProjectChangeDetails = lineItems;

							// Enhance project change detail object (line item) by check property
							$scope.entity.ProjectChangeDetails = _.map($scope.entity.ProjectChangeDetails, function (detailItem) {
								detailItem.DetailSelected = false;
								return detailItem;
							});

							platformGridAPI.grids.invalidate(detailsGridId);
							platformGridAPI.items.data(detailsGridId, $scope.entity.ProjectChangeDetails);
						} else {
							$scope.entity.ProjectChangeDetails = [];
							platformGridAPI.grids.invalidate(detailsGridId);
							platformGridAPI.items.data(detailsGridId, $scope.entity.ProjectChangeDetails);
						}
					},
					function () {
						$scope.entity.ProjectChangeDetails = [];
						platformGridAPI.grids.invalidate(detailsGridId);
						platformGridAPI.items.data(detailsGridId, $scope.entity.ProjectChangeDetails);
					});
				}

				$scope.detailSelectedChange = function (/* entity, value */) {
					/*
			 return {
			 apply: false,
			 error: $translate.instant('procurement.package.wizard.createRequisition.uniqueListViewError'),
			 error$tr$: $translate.instant('procurement.package.wizard.createRequisition.uniqueListViewError'),
			 valid: false
			 };
			 */
				};

				let changeOrderGridColumns = [
					{
						id: 'changeOrderSelected',
						field: 'ChangeOrderSelected',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						validator: 'changeOrderSelectedChange'
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'code',
						readonly: true
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						// formatter: 'translation',
						readonly: true
					},
					{
						id: 'ChangeTypeFk',
						field: 'ChangeTypeFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							displayMember: 'Description',
							lookupModuleQualifier: 'project.main.changetype',
							valueMember: 'Id'
						},
						name: 'Change Type',
						name$tr$: 'project.main.entityChangeType',
						sortable: true,
						readonly: true
					}
				];

				$scope.changeOrderSelectedChange = function changeOrderSelectedChange(selectItem, newValue, module) {
					selectItem[module] = newValue;
					updateSurchargeGrid(true, true);
					return {apply: true, valid: true, error: ''};
				};

				let ChangeOrderGridId = '56ca31983ce74daa96feb61459f766f8';

				$scope.changeOrderGridData = {
					state: ChangeOrderGridId
				};

				$scope.sameBoq2MultiLineItemWithDifferentChange = {
					show: true,
					messageCol: 1,
					message: $translate.instant('estimate.main.bidCreationWizard.sameBoq2MultiLineItemWithDifferentChange'),
					iconCol: 1,
					type: 1
				};

				function setupChangeOrderGrid() {

					if (!platformGridAPI.grids.exist(ChangeOrderGridId)) {
						let changeOrderGridConfig = {
							columns: angular.copy(changeOrderGridColumns),
							data: [],
							id: ChangeOrderGridId,
							lazyInit: false,
							options: {
								tree: false,
								indicator: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};
						platformGridAPI.grids.config(changeOrderGridConfig);
						platformTranslateService.translateGridConfig(changeOrderGridConfig.columns);
					}
					// updateChangeOrderGrid(false);
				}

				function updateChangeOrderGrid(filterByChangeStatus, changeStatusIds) {

					loadprojectChangeOrders(filterByChangeStatus, changeStatusIds).then(function (result) {
						let changeOrders = result.data;
						if (angular.isDefined(changeOrders) && _.isArray(changeOrders) && changeOrders.length > 0) {

							// get exist change orders
							let changeOrderIds = estimateMainBidCreationService.getChangeOrderSelectedIds($scope.entity);

							$scope.entity.ProjectChangeOrders = changeOrders;

							// Enhance project change detail object (line item) by check property
							$scope.entity.ProjectChangeOrders = _.map($scope.entity.ProjectChangeOrders, function (changeOrderItem) {
								changeOrderItem.ChangeOrderSelected = _.includes(changeOrderIds, changeOrderItem.Id);
								return changeOrderItem;
							});

							platformGridAPI.grids.invalidate(ChangeOrderGridId);
							platformGridAPI.items.data(ChangeOrderGridId, $scope.entity.ProjectChangeOrders);
						} else {
							$scope.entity.ProjectChangeOrders = [];
							platformGridAPI.grids.invalidate(ChangeOrderGridId);
							platformGridAPI.items.data(ChangeOrderGridId, $scope.entity.ProjectChangeOrders);
						}
					},
					function () {
						$scope.entity.ProjectChangeOrders = [];
						platformGridAPI.grids.invalidate(ChangeOrderGridId);
						platformGridAPI.items.data(ChangeOrderGridId, $scope.entity.ProjectChangeOrders);
					});
				}

				function loadprojectChangeOrders(filterByChangeStatus, changeStatusIds) {

					let filterInfo = {
						ProjectFk: estimateMainService.getSelectedProjectId(),
						EstHeaderFk: estimateMainService.getSelectedEstHeaderId(),
						FilterByChangeStatus: filterByChangeStatus,
						ChangeStatusIds: filterByChangeStatus ? changeStatusIds : []
					};

					return $http.post(globals.webApiBaseUrl + 'change/main/getprojectchangeorders', filterInfo);

					// The project change details list returns all line items that have a project change reference set.
					// return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getprojectchangelineitems?estHeaderFk=' + estimateMainService.getSelectedEstHeaderId());
				}

				// endregion

				// region config view step 4 (Select Surcharge item)
				let gridSurchargeGirdId = '64f8eac9c9264b95be0c5cd8124984f4';
				let surchargeColumns = [
					{ id: 'checked', field: 'Selected', name: 'Selected', width: 60, toolTip: 'Select', formatter: 'boolean', headerChkbox: true, name$tr$: 'basics.common.checkbox.select',
						editor: 'boolean',validator: 'isCheckedValueChange'},
					{ id: 'pref', field: 'Reference', name: 'Project BoQ Ref No.', width:120, toolTip: 'Reference', formatter: 'description', name$tr$: 'boq.main.Reference'},
					{ id: 'boqLineType', field: 'BoqLineTypeFk', name: 'BoQ Line Type',width: 120,toolTip: 'BoQ Line Type',formatter: 'lookup',name$tr$: 'boq.main.BoqLineTypeFk',
						formatterOptions:{displayMember: 'Description',lookupType: 'BoqLineType'}},
					{ id: 'pBrief', field: 'BriefInfo', name: 'Brief', width: 120, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'},
					{ id: 'quantity', field: 'Quantity', name: 'Quantity', width:80, toolTip: 'Quantity', formatter: 'quantity', name$tr$: 'cloud.common.entityQuantity'},
					{ id: 'pQtyUom', field: 'BasUomFk', name: 'BasUomFk', width: 60, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					},
					{ id: 'price', field: 'Price', name: 'Price', width:80, toolTip: 'Price', formatter: 'money', name$tr$: 'boq.main.Price'},
					{ id: 'total', field: 'Finalprice', name: 'Final Price', width:80, toolTip: 'Final Price', formatter: 'money', name$tr$: 'boq.main.Finalprice'}
				];
				$scope.lastHeaderCheckBoxVal = false;
				function onHeaderCheckboxChange(/* e */) {
					$scope.lastHeaderCheckBoxVal = !$scope.lastHeaderCheckBoxVal;  // e.target.checked
					let data = platformGridAPI.items.data(gridSurchargeGirdId);
					_.forEach(data, function (item) {
						$scope.isCheckedValueChange(item, $scope.lastHeaderCheckBoxVal);
					});
				}

				$scope.isCheckedValueChange = function isCheckedValueChange(selectItem, newValue) {
					checkChildren(selectItem, newValue);
					let allItems = platformGridAPI.items.data(gridSurchargeGirdId);
					allItems.forEach(doItemCheck);

					platformGridAPI.grids.invalidate(gridSurchargeGirdId);
					platformGridAPI.grids.refresh(gridSurchargeGirdId);


					$scope.$apply();
					return {apply: true, valid: true, error: ''};
				};

				function checkChildren(item, flg) {
					if (item.BoqItemExtendDtos !== null && item.BoqItemExtendDtos.length > 0) {
						for (let i = 0; i < item.BoqItemExtendDtos.length; i++) {
							checkChildren(item.BoqItemExtendDtos[i], flg);
						}
					}
					if(item.BoqLineTypeFk === 103 || item.BoqLineTypeFk === 0 || (item.BoqLineTypeFk > 0 && item.BoqLineTypeFk <= 9)){
						item.Selected = true;
					}else{
						item.Selected = flg || item.ReadOnly;
					}
				}

				function doItemCheck(item) {
					if (item.BoqItemExtendDtos && item.BoqItemExtendDtos.length) {
						let checkedItems = [], unCheckedItems = [];

						item.BoqItemExtendDtos.forEach(function (item) {
							let isChecked = doItemCheck(item);

							if (isChecked === true) {
								checkedItems.push(item);
							} else {
								unCheckedItems.push(item);
							}
						});
						if (checkedItems.length === item.BoqItemExtendDtos.length) {
							item.Selected = true;
						} else if (unCheckedItems.length === item.BoqItemExtendDtos.length) {
							item.Selected = false;
						} else {
							item.Selected = false;
						}
						item.Selected = item.Selected || item.ReadOnly;
					}
					return item.Selected;
				}

				$scope.gridSurchargeData = {
					state: gridSurchargeGirdId
				};

				$scope.ShowSurchargeGrid = function (){
					return $scope.entity.StructureType === 1 &&  $scope.entity.SurchargeItems && $scope.entity.SurchargeItems.length > 0;
				};

				function setupSurchargeGrid(showGrid){
					if($scope.entity.StructureType !== 1){
						return;
					}

					if(!platformGridAPI.grids.exist(gridSurchargeGirdId)){
						let surchargeGridConfig = {
							columns: angular.copy(surchargeColumns),
							data:[],
							id: gridSurchargeGirdId,
							presenter: {
								tree: {
									parentProp: 'BoqItemFk',
									childProp: 'BoqItemExtendDtos',
									showChildrenItems: true
								}
							},
							options: {
								tree: true,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								parentProp: 'BoqItemFk',
								childProp: 'BoqItemExtendDtos',
								collapsed: false
							}
						};

						platformGridAPI.grids.config(surchargeGridConfig);
						platformTranslateService.translateGridConfig(surchargeGridConfig.columns);
						platformGridAPI.events.register(gridSurchargeGirdId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
						updateSurchargeGrid(showGrid);
					}
				}

				function updateSurchargeGrid(showGrid, forceLoad) {
					if($scope.entity.StructureType !== 1){
						return;
					}

					if(forceLoad || !$scope.entity.SurchargeItems || $scope.entity.SurchargeItems.length <= 0){
						let postData = {
							EstimateScope : $scope.entity.estimateScope,
							EstimateHeaderId: estimateMainService.getSelectedEstHeaderId(),
							FilterRequest: estimateMainService.getLastFilter(),
							MajorLineItems: $scope.entity.MajorLineItems,
							ProjectChangeLineItems: $scope.entity.ProjectChangeLineItems
						};

						if(isUpdateMode()){
							let existedBidHeader = estimateMainBidCreationService.getBidHeaderFromLookup($scope.entity.Code);
							postData.BidId = existedBidHeader && existedBidHeader.Id ? existedBidHeader.Id : 0;
						}else{
							postData.BidId = 0;
						}

						if($scope.entity.ProjectChangeLineItems){
							postData.ProjectChangeOrders = _.map(_.filter($scope.entity.ProjectChangeOrders, function (item) { return item.ChangeOrderSelected; }), function (item) { return item.Id; });
						}

						$http.post(globals.webApiBaseUrl + 'sales/bid/getsurchargetextnodeitemforbid', postData).then(function (datas){
							if(datas && datas.data && datas.data.length > 0){
								$scope.entity.SurchargeItems = datas.data;
								let itemList = [];
								$injector.get('cloudCommonGridService').flatten($scope.entity.SurchargeItems, itemList, 'BoqItemExtendDtos');
								let boqMainImageProcess = $injector.get('boqMainImageProcessor');
								_.forEach(itemList, function (item) {
									boqMainImageProcess.processItem(item);
									item.Reference = item.Reference === '(?)' ? '' : item.Reference;
									platformRuntimeDataService.readonly(item, [{
										field: 'Selected',
										readonly: item.ReadOnly || item.BoqLineTypeFk === 103 || item.BoqLineTypeFk === 0 || (item.BoqLineTypeFk > 0 && item.BoqLineTypeFk <= 9)
									}]);
									item.Selected = item.ReadOnly;
								});
							}else{
								$scope.entity.SurchargeItems = [];
							}

							platformGridAPI.grids.invalidate(gridSurchargeGirdId);
							platformGridAPI.items.data(gridSurchargeGirdId, $scope.entity.SurchargeItems);
							platformGridAPI.grids.refresh(gridSurchargeGirdId);
						});
					}else{
						$timeout(function () {
							platformGridAPI.grids.invalidate(gridSurchargeGirdId);
							platformGridAPI.items.data(gridSurchargeGirdId, $scope.entity.SurchargeItems);
							platformGridAPI.grids.refresh(gridSurchargeGirdId);
						}, 200);
					}
				}

				// endregion

				// region config view step 5 (project optional)

				$scope.optionalSelectedChange = function (entity, value, model) {
					if (entity && value && model === 'IsOptional') {
						entity.BasItemTypeFk = 5;

						platformRuntimeDataService.readonly(entity, [{field: 'IsOptionalIt', readonly: false}]);

						// set children flag
						if (entity.GroupChildren) {
							_.each(entity.GroupChildren, function (item) {
								item.IsOptional = value;
								platformRuntimeDataService.readonly(item, [{field: 'IsOptionalIt', readonly: false}]);
							});
							platformGridAPI.grids.refresh(optionalGridId, true);
						}
					} else {
						entity.BasItemTypeFk = 1;
						entity.IsOptionalIt = false;
						platformRuntimeDataService.readonly(entity, [{field: 'IsOptionalIt', readonly: true}]);
						// set children flag
						if (entity.GroupChildren) {
							_.each(entity.GroupChildren, function (item) {
								item.IsOptional = value;
								item.IsOptionalIt = false;
								platformRuntimeDataService.readonly(item, [{field: 'IsOptionalIt', readonly: true}]);
							});
							platformGridAPI.grids.refresh(optionalGridId, true);
						}
					}
				};

				$scope.optionalItSelectedChange = function (entity, value, model) {
					if (entity && value && model === 'IsOptionalIt') {
						entity.BasItemTypeFk = 2;

						// set children flag
						if (entity.GroupChildren) {
							_.each(entity.GroupChildren, function (item) {
								item.IsOptionalIt = value;
							});
							platformGridAPI.grids.refresh(optionalGridId, true);
						}
					} else {
						entity.BasItemTypeFk = 5;

						// set children flag
						if (entity.GroupChildren) {
							_.each(entity.GroupChildren, function (item) {
								item.IsOptionalIt = value;
							});
							platformGridAPI.grids.refresh(optionalGridId, true);
						}
					}
				};

				let optionalGridColumns = [
					{
						id: 'originOptional',
						field: 'OriginOptional',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							let html;
							if (value === true) {
								html = '<input disabled="disabled" type="checkbox" checked />';
							} else if (value === 'indeterminate') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input disabled="disabled" type="checkbox"/>';
							} else {
								html = '<input disabled="disabled" type="checkbox" unchecked/>';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						name: 'Optional(Origin)',
						name$tr$: 'estimate.main.estOriginOptional',
						width: 87,
						readonly: true
					},
					{
						id: 'isOptional',
						field: 'IsOptional',
						formatter: 'boolean',
						name: 'Optional',
						name$tr$: 'estimate.main.estIsOptional',
						editor: 'boolean',
						width: 50,
						validator: 'optionalSelectedChange'
					},
					{
						id: 'originOptionalIt',
						field: 'OriginOptionalIt',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							let html;
							if (value === true) {
								html = '<input disabled="disabled" type="checkbox" checked />';
							} else if (value === 'indeterminate') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input disabled="disabled" type="checkbox"/>';
							} else {
								html = '<input disabled="disabled" type="checkbox" unchecked/>';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						name: 'Optional It(Origin)',
						name$tr$: 'estimate.main.estOriginOptionalIt',
						width: 87,
						readonly: true
					},
					{
						id: 'isOptionalIt',
						field: 'IsOptionalIt',
						formatter: 'boolean',
						name: 'Optional It',
						name$tr$: 'estimate.main.estIsOptionalIt',
						editor: 'boolean',
						width: 50,
						validator: 'optionalItSelectedChange'
					},
					{
						id: 'IsFixedPrice',
						field: 'IsFixedPrice',
						formatter: 'boolean',
						name: 'IsFixedPrice(BoQ)',
						name$tr$: 'estimate.main.boqFixedPrice',
						width: 50,
						validator: 'optionalSelectedChange',
						readonly: true
					},
					{
						id: 'IsFixedPriceLineItem',
						field: 'IsFixedPriceLineItem',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							let html;
							if (value === true) {
								html = '<input disabled="disabled" type="checkbox" checked />';
							} else if (value === 'indeterminate') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input disabled="disabled" type="checkbox"/>';
							} else {
								html = '<input disabled="disabled" type="checkbox" unchecked/>';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						name: 'IsFixedPrice(LineItem)',
						name$tr$: 'estimate.main.lineItemFixedPrice',
						width: 50,
						validator: 'optionalSelectedChange',
						readonly: true
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'code',
						width: 80,
						readonly: true
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						width: 120,
						readonly: true
					},
					{
						id: 'BasItemTypeFk',
						field: 'BasItemTypeFk',
						name: 'BasItemTypeFk',
						name$tr$: 'boq.main.BasItemTypeFk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.lookup.boqitemtype',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100
					},
					{
						id: 'BasItemType2Fk',
						field: 'BasItemType2Fk',
						name: 'BasItemType2Fk',
						name$tr$: 'boq.main.BasItemType2Fk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.lookup.boqitemtype2',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100
					}
				];

				$scope.optionalGridData = {
					state: optionalGridId
				};

				$scope.$watch('entity.ProjectChangeGenerateMode', function (){
					$scope.entity.AssignChangeToEachBid = false;
					$scope.entity.AssignChangeToBidHeader = false;
				});

				function onGridDblClick(e, args) {// jshint ignore:line
					// reload data with groupfk
					let entity = args.grid.getDataItem(args.row);
					if (entity && !entity.GroupFk) {
						updateOptionalGrid(entity.Id);
					}
				}

				function setupOptionalGrid() {

					if (!platformGridAPI.grids.exist(optionalGridId)) {
						let optionalGridConfig = {
							columns: angular.copy(optionalGridColumns),
							data: [],
							id: optionalGridId,
							lazyInit: false,
							presenter: {
								tree: {
									parentProp: 'GroupFk',
									childProp: 'GroupChildren',
									showChildrenItems: true
								}
							},
							options: {
								tree: true,
								indicator: true,
								idProperty: 'Id',
								iconClass: '',
								parentProp: 'GroupFk',
								childProp: 'GroupChildren',
								collapsed: false,
								cellChangeCallBack: function () {
									// let item = arg.item;
									// if (!item) {
									// return;
									// }
								}
							}
						};
						platformGridAPI.grids.config(optionalGridConfig);
						platformTranslateService.translateGridConfig(optionalGridConfig.columns);
						platformGridAPI.events.register(optionalGridId, 'onDblClick', onGridDblClick);
					}
					updateOptionalGrid();
				}

				function setScopeOptionalData(result) {
					$scope.entity.EstimateOptional = _.each(result.data.OptionalTreeItems, function (item) {
						item.Id = 'LS' + item.Id;
						// set isoptional value
						if (item.Total === item.IsOptionalCount) {
							item.OriginOptional = true;
						} else if (item.IsOptionalCount === 0) {
							item.OriginOptional = false;
						} else {
							item.OriginOptional = 'indeterminate';
						}

						// set isoptionalIt value
						if (item.Total === item.IsOptionalItCount) {
							item.OriginOptionalIt = true;
						} else if (item.IsOptionalItCount === 0) {
							item.OriginOptionalIt = false;
						} else {
							item.OriginOptionalIt = 'indeterminate';
						}

						// set isfixedprice value
						if (item.Total === item.IsFixedPriceCount) {
							item.IsFixedPriceLineItem = true;
						} else if (item.IsFixedPriceCount === 0) {
							item.IsFixedPriceLineItem = false;
						} else {
							item.IsFixedPriceLineItem = 'indeterminate';
						}

						// icon for ls
						let iconImage = '';
						switch ($scope.entity.StructureType) {
							case 2:
								iconImage = 'ico-task';// Schedules
								break;
							case 3:
								iconImage = 'ico-location2';// Location
								break;
							case 4:
								iconImage = 'ico-controlling-unit2';// Controlling Units
								break;
							case 6:
								iconImage = 'ico-cost-group1';// Enterprise Cost Group 1
								break;
							case 7:
								iconImage = 'ico-cost-group2';// Enterprise Cost Group 2
								break;
							case 8:
								iconImage = 'ico-cost-group3';// Enterprise Cost Group 3
								break;
							case 9:
								iconImage = 'ico-cost-group4';// Enterprise Cost Group 4
								break;
							case 10:
								iconImage = 'ico-cost-group5';// Enterprise Cost Group 5
								break;
							case 11:
								iconImage = 'ico-prj-cost-group1';// Project Cost Group 1
								break;
							case 12:
								iconImage = 'ico-prj-cost-group2';// Project Cost Group 2
								break;
							case 13:
								iconImage = 'ico-prj-cost-group3';// Project Cost Group 3
								break;
							case 14:
								iconImage = 'ico-prj-cost-group4';// Project Cost Group 4
								break;
							case 15:
								iconImage = 'ico-prj-cost-group5';// Project Cost Group 5
								break;
						}
						item.image = iconImage;
					});
					// set readonly for boq
					if ($scope.entity.StructureType === 1) {
						setOptionalReadOnly($scope.entity.EstimateOptional, true);
					}
				}

				function setOptionalReadOnly(items, readonly) {
					let fields = [];
					_.each(items, function (item) {
						fields = [{field: 'IsOptional', readonly: readonly}, {field: 'IsOptionalIt', readonly: readonly}];
						if (item.__rt$data) {
							item.__rt$data.readonly = [];
						}
						if (item && item.Id) {
							platformRuntimeDataService.readonly(item, fields);
						}
					});
				}

				function updateOptionalGrid(groupFk) {
					if ($scope.entity.StructureType === 1) {
						$scope.optionalWarning = $translate.instant('estimate.main.bidCreationWizard.optionalBoqWarning');
					} else {
						$scope.optionalWarning = $translate.instant('estimate.main.bidCreationWizard.optionalLSWarning');
					}

					estimateMainBidCreationService.isAnyAssignmentByStructure($scope.entity.StructureType, $scope.entity.estimateScope, groupFk, $scope.entity).then(function (result) {
						if (angular.isDefined(result) && angular.isDefined(result.data) && _.isArray(result.data.OptionalTreeItems) && result.data.OptionalTreeItems.length > 0) {
							if (result.data && result.data.GroupFk) {
								let expandItem = _.find($scope.entity.EstimateOptional, {Id: 'LS' + result.data.GroupFk});
								if (expandItem) {
									expandItem.GroupChildren = result.data.OptionalChildrenItems;
									expandItem.HasChildren = true;
									// set children isoptional same as parent
									_.each(expandItem.GroupChildren, function (item) {
										item.IsOptional = expandItem.IsOptional;
										item.IsOptionalIt = expandItem.IsOptionalIt;
										item.IsFixedPrice = expandItem.IsFixedPrice;
										// icon for lineitem
										item.image = item.EstLineItemFk > 0 ? 'ico-reference-line' : 'ico-base-line';
									});
									setOptionalReadOnly(expandItem.GroupChildren, true);
								}
							} else if (!$scope.entity.EstimateOptional) {
								setScopeOptionalData(result);
							}
						}

						platformGridAPI.grids.invalidate(optionalGridId);
						platformGridAPI.items.data(optionalGridId, $scope.entity.EstimateOptional);
						if (groupFk) {
							platformGridAPI.grids.refresh(optionalGridId);
						}
					});
				}

				// endregion

				// region wizard navigation

				$scope.wizardTemplateUrl = globals.appBaseUrl + 'app/components/wizard/partials/wizard-template.html';

				$scope.selectStep = angular.copy($scope.steps[0]);
				$scope.modalTitle = $scope.selectStep.name;
				$scope.wizardName = $scope.modalOptions.value.wizardName;
				$scope.wizard = $scope.modalOptions.value.wizard;

				$scope.getEnabledSteps = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.getEnabledSteps();
					} else {
						return [];
					}
				};
				$scope.getCurrentStepNumber = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.currentStepNumber();
					} else {
						return '';
					}
				};
				$scope.getTotalStepCount = function () {
					let wz = WizardHandler.wizard($scope.wizardName);
					if (wz) {
						return wz.totalStepCount();
					} else {
						return '';
					}
				};
				$scope.getNextStep = function getNextStep(titleOnly) {
					let wz = WizardHandler.wizard($scope.wizardName);
					let nextStep = wz.getEnabledSteps()[wz.currentStepNumber()];
					if (titleOnly) {
						return nextStep ? nextStep.title : $scope.wzStrings.stepFinish;
					} else {
						return nextStep;
					}
				};
				$scope.wzStrings = {
					cancel: $translate.instant('platform.cancelBtn'),
					finish: $translate.instant('estimate.main.createMaterialPackageWizard.resetBtn'),
					nextStep: $translate.instant('platform.wizard.nextStep')
				};

				$scope.isLastStep = function () {
					return $scope.selectStep.number === $scope.steps.length - 1;
				};

				$scope.isFirstStep = function () {
					return $scope.selectStep.number === 0;
				};

				$scope.previousStep = function () {
					switch ($scope.selectStep.identifier) {
						case 'uppConfig':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'structure':
							setCurrentStep($scope.selectStep.number - 1);
							break;
						case 'projectChange':
							if ($scope.entity.EstUppUsingURP) {
								setCurrentStep($scope.selectStep.number - 1);
							} else {
								setCurrentStep($scope.selectStep.number - 2);
							}
							break;
						case 'surcharge':
							if ($scope.entity.ProjectChangeLineItems) {
								setCurrentStep($scope.selectStep.number - 1);
							} else if ($scope.entity.EstUppUsingURP) {
								setCurrentStep($scope.selectStep.number - 2);
							} else {
								setCurrentStep($scope.selectStep.number - 3);
							}
							if ($scope.entity.ProjectChangeLineItems) {
								setupStatusGrid();
								setupChangeOrderGrid();
							}
							break;
						case 'optional':
							if ($scope.ShowSurchargeGrid()){
								setupSurchargeGrid(true);
								setCurrentStep($scope.selectStep.number - 1);
							} else if ($scope.entity.ProjectChangeLineItems) {
								setCurrentStep($scope.selectStep.number - 2);
							} else if ($scope.entity.EstUppUsingURP) {
								setCurrentStep($scope.selectStep.number - 3);
							} else {
								setCurrentStep($scope.selectStep.number - 4);
							}
							if ($scope.entity.ProjectChangeLineItems) {
								setupStatusGrid();
								setupChangeOrderGrid();
							}
							break;
						default:
							if (!$scope.isFirstStep()) {
								let previousNumber = $scope.selectStep.number - 1;
								// $scope.selectStep = angular.copy($scope.steps[previousNumber]);
								setCurrentStep(previousNumber);
							}
							break;
					}

					setCurrentWinHeight($scope);

				};

				function loadSettings(existedBidHeaderId, usingUrp) {
					// load settings
					salesBidCreateBidDialogService.getBidCreationSettings(existedBidHeaderId, $scope.entity.StructureType).then(function (settingdata) {
						let settings = settingdata.data;
						if (settings) {
							reStoreTheSettings(settings, usingUrp);
						}
						// add success flag here to enable 'next' button
						loadSuccessFlag = true;
						bidHeaderId = existedBidHeaderId;
					});
				}

				// make all the assignments with correctly value
				function resetWithDefaultValues(estUppDefaultConfigTypeFk, data) {
					if ($scope.entity.StructureURPAssignments && _.isArray($scope.entity.StructureURPAssignments)) {
						_.each($scope.entity.StructureURPAssignments, function (item) {
							if (!item.EstUppEditType) {
								// only reset with default value when no default value
								if (!item.EstUppConfigtypeFk) {
									item.EstUppConfigtypeFk = estUppDefaultConfigTypeFk;
								}
								if (data && data.estUppConfig && !item.EstUppConfigFk) {
									item.EstUppConfigFk = data.estUppConfig.Id;
									item.estUppConfigDesc = data.estUppConfigDesc;
								}
							}
							item.EstUppUsingURP = true;
						});
					}
					if (!$scope.entity.EstUppEditType && !$scope.entity.EstUppConfigtypeFk) {
						$scope.entity.EstUppConfigtypeFk = estUppDefaultConfigTypeFk;
						if (data && data.estUppConfig) {
							$scope.entity.EstUppConfigFk = data.estUppConfig.Id;
							$scope.entity.estUppConfigDesc = data.estUppConfigDesc;
						}
					}
					if (!$scope.entity.EstUppUsingURP) {
						$scope.entity.EstUppUsingURP = true;
					}
				}

				function setDefaultAssignments(lookupvalues, uppConfigTypeFk, data, reload) {
					let currentItem = null;
					uppConfigTypeFk = uppConfigTypeFk || estUppDefaultConfigTypeFk;
					switch ($scope.entity.StructureType) {
						case 1:
							_.each(lookupvalues || boqLookupValues, function (boq) {
								// assign the default upp config type for each new assignment
								boqCopy(boq, '', '', uppConfigTypeFk, data);
								// assign the default structure values
								if (boq && boq.BoqHeader) {
									// also need to load structure info(UrbNames) from project boq as default
									let existStructure = _.find(boqStructures, {Id: boq.BoqHeader.BoqStructureFk});
									let currentStructureIndex = getCurrentStructureIndex(boq.Id);
									if (existStructure && currentStructureIndex >= 0) {
										copyStructureInfo(existStructure.boqStructure, $scope.entity.StructureURPAssignments[currentStructureIndex]);
									}

									if(currentStructureIndex >= 0 && boq.uppConfigFk){
										$scope.entity.StructureURPAssignments[currentStructureIndex].EstUppConfigFk = boq.uppConfigFk;
										$scope.entity.StructureURPAssignments[currentStructureIndex].EstUppConfigtypeFk = boq.uppConfigTypeFk;
									}
								}
								if (!currentItem) {
									// if current EstUppStructure has value then as default one
									currentItem = boq;
									$scope.entity.EstUppConfigFk = boq.uppConfigFk || $scope.entity.EstUppConfigFk;
									$scope.entity.EstUppConfigtypeFk = boq.uppConfigTypeFk || $scope.entity.EstUppConfigtypeFk;
								}
							});
							if ($scope.entity.EstUppStructure) {
								let defaultStructure = _.find(boqLookupValues, {Id: $scope.entity.EstUppStructure});
								if (defaultStructure) {
									currentItem = defaultStructure;
								}
							}
							// reset urpAssignment with default URP config values
							resetWithDefaultValues(uppConfigTypeFk, data);
							if (currentItem) {
								if (currentItem.BoqHeader) {
									// also need to load structure info(UrbNames) from project boq as default
									let existStructure = _.find(boqStructures, {Id: currentItem.BoqHeader.BoqStructureFk});
									let currentStructureIndex = getCurrentStructureIndex(currentItem.Id);
									if (existStructure && currentStructureIndex >= 0) {
										copyStructureInfo(existStructure.boqStructure, $scope.entity);
									}
								}
								if (reload) {
									boqItemSelectedChangeEvent(currentItem, $scope.entity, currentItem);
								}
							}
							break;
						case 2:
							activityLookupValues = _.orderBy(activityLookupValues, ['Code'], ['asc']);
							_.each(lookupvalues || activityLookupValues, function (activity) {
								activityCopy(activity, '', '', uppConfigTypeFk, data);
								if (!currentItem) {
									currentItem = activity;
								}
							});
							if ($scope.entity.EstUppStructure) {
								let defStructure = _.find(activityLookupValues, {Id: $scope.entity.EstUppStructure});
								if (defStructure) {
									currentItem = defStructure;
								}
							}
							// reset urpAssignment with default URP config values
							resetWithDefaultValues(uppConfigTypeFk, data);
							if (currentItem) {
								let activityStructureIndex = getCurrentStructureIndex(currentItem.Id);
								if (activityStructureIndex >= 0) {
									copyStructureInfo($scope.entity.StructureURPAssignments[activityStructureIndex]);
								}
								if (reload) {
									activitySelectedItemEvent(currentItem, $scope.entity, currentItem);
								}
							}
							break;
					}
					$scope.error.show = !structureTypesValidation();

				}

				function validateAnyLineItemAssignment() {
					let countDefer = $q.defer();

					if (!$scope.entity.BidHeaderFk && $scope.entity.ProjectChangeLineItems) {
						$scope.assignError.show = false;
						$scope.noMainBidSelelectedError.show = true;
						countDefer.resolve(true);
						return countDefer.promise;
					} else {
						$scope.noMainBidSelelectedError.show = false;
					}

					estimateMainBidCreationService.isAnyAssignmentByStructure($scope.entity.StructureType, $scope.entity.estimateScope, null, $scope.entity).then(function (result) {
						$scope.noMainBidSelelectedError.show = false;
						$scope.noLineItemStructureError.show = false;
						if (result && result.data) {
							// show optional grid
							$scope.ShowOptionalGrid = result.data.ShowOptionalGrid = false;
							setScopeOptionalData(result);

							if (result.data.HasData) {
								// show warning message and invalid executed
								$scope.assignError.show = false;

								if ($scope.entity.StructureType === 16) {
									let grouped = mainViewService.customData('66788defaa8f43319b5122462e09c41d', 'grpInfo');
									$scope.noLineItemStructureError.show = !grouped || grouped.length === 0;
									countDefer.resolve(!!grouped && grouped.length > 0);
								} else {
									countDefer.resolve(true);
								}
							} else {
								if(result.data.IsMajorDataError){
									$scope.assignError.message = $translate.instant('estimate.main.bidCreationWizard.assignmentMajorLineItemError');
								}else if(result.data.IsChangeDataError){
									$scope.assignError.message = $translate.instant('estimate.main.bidCreationWizard.assignmentChangeLineItemError');
								}else{
									$scope.assignError.message = $translate.instant('estimate.main.bidCreationWizard.assignmentError');
								}

								$scope.assignError.show = true;
								// hide optional grid
								countDefer.resolve(false);
							}
						} else {
							$scope.assignError.show = true;
							// hide optional grid
							countDefer.resolve(false);
						}
					});
					return countDefer.promise;
				}

				function setCurrentWinHeight($scope) {

					let heights = ['700px', '600px', '950px', '800px', '700px', '630px'];
					let width = ['750px', '750px', '1000px', '750px', '750px', '750px'];
					$scope.$parent.$parent.$parent.options.height = heights[$scope.selectStep.number];
					$scope.$parent.$parent.$parent.options.width = width[$scope.selectStep.number];
				}

				$scope.nextStep = function () {
					switch ($scope.selectStep.identifier) {
						case 'basic':
							platformUtilService.loadTemplates(['estimate.main/templates/config-dialog/estimate-main-config-dialog-templates.html']);

							setCurrentStep($scope.selectStep.number + 1);
							currentMaxStep = 0;

							// Status grid
							setupStatusGrid();
							// Detail grid -> update and loading data is done when the Detail radio button is triggered
							setupChangeOrderGrid();

							updateSurchargeGrid(false, true);

							// reset to default option items for the structure type lookup
							formConfigStructureSettings.rows[0].options.items = angular.copy(structureOptionItems);

							var deleteBidBoqOption = _.find(formConfigStructureSettings.rows, {rid: 'delOriginalBoq'});
							deleteBidBoqOption.readonly = true;

							updatePrjChangeLineItemsOption();

							estimeMainCraeteBidOptionProfileService.load($scope.entity.updateModel, $scope.entity.TypeFk).then(function (response){
								if (isUpdateMode()) {
									onSelectOptionItemChanged().then(function (){
										let existedBidHeader = estimateMainBidCreationService.getBidHeaderFromLookup($scope.entity.Code);
										// making the structure type readonly
										$scope.entity.StructureType = existedBidHeader.StructureType;

										if (existedBidHeader.StructureType === 16) {
											deleteBidBoqOption.readonly = false;
										}

										validateAnyLineItemAssignment().then(function (valid) {
											if (valid && currentMaxStep < 1) {
												if ($scope.entity.StructureType === 1) {
													initBoqLookupData().then(function () {
														loadSettings(existedBidHeader.Id);
													});
												} else if ($scope.entity.StructureType === 2) {
													initActivityLookupData().then(function () {
														loadSettings(existedBidHeader.Id);
													});
												} else {
													loadSettings(existedBidHeader.Id);
												}
											}
											currentMaxStep++;
										});
										afterDoOptionSetting($scope.entity,'StructureType');
									});
									// });
								} else {
									currentMaxStep++;

									if(response) {
										$scope.UpdateOptions.optionProfile =estimeMainCraeteBidOptionProfileService.getDescription(response);
										let propertyConfig = response.PropertyConfig;
										if (propertyConfig) {
											let optionItem = JSON.parse(propertyConfig);
											doOptionSetting($scope,optionItem, true);
											$scope.entity.StructureType = optionItem.StructureType;
											$scope.sameBoq2MultiLineItemWithDifferentChange.show = $scope.entity.StructureType === 1;
											if((!$scope.entity.PriceColumns || $scope.entity.PriceColumns.length <= 0) && optionItem.PriceColumns && optionItem.PriceColumns.length > 0){
												let dynamicColumns = $injector.get('basicsCommonUserDefinedColumnConfigService').getDynamicColumnConfig();

												$scope.entity.PriceColumns = [];
												_.forEach(dynamicColumns, function (item){
													let priceItem = _.find(optionItem.PriceColumns, {Id: item.Id});
													if(priceItem){$scope.entity.PriceColumns.push({
														Id: item.Id,
														Description: item.DescriptionInfo.Translated || item.DescriptionInfo.Description,
														checked: priceItem && priceItem.checked
													});}
												});
											}
										}
										else{
											doOptionSetting($scope,null, true);
										}
										afterDoOptionSetting($scope.entity,'StructureType');
									}

									let isFilter = false;// if want to filter the structure type then set 'true' in here
									if (isFilter) {
										// filter the structure type lookup only with the not existed type in this estimate
										$injector.get('estimateMainBidLookupService').getList().then(function (data) {
											let filterStructureTypes = _.uniq(_.map(data, 'StructureType'));

											formConfigStructureSettings.rows[0].options.items = _.filter(formConfigStructureSettings.rows[0].options.items, function (item) {
												return !_.includes(filterStructureTypes, item.Id);
											});
											if (formConfigStructureSettings.rows[0].options.items.length > 0) {
												$scope.entity.StructureType = formConfigStructureSettings.rows[0].options.items[0].Id;
												validateAnyLineItemAssignment();
											} else {
												estimateMainBidCreationProcess.setReadOnly($scope.entity, 'StructureType', true);
												$scope.entity.StructureType = null;
											}
										});
									} else {
										if (formConfigStructureSettings.rows[0].options.items.length > 0) {
											$scope.entity.StructureType = $scope.entity.StructureType || formConfigStructureSettings.rows[0].options.items[0].Id;

											validateAnyLineItemAssignment().then(function (valid) {
												if (valid) {
													if ($scope.entity.StructureType === 1) {
														initBoqLookupData();
													} else if ($scope.entity.StructureType === 2) {
														initActivityLookupData();
													} else {
														// add success flag here to enable 'next' button
														loadSuccessFlag = true;
													}
												}
											});
											// });
										} else {
											estimateMainBidCreationProcess.setReadOnly($scope.entity, 'StructureType', true);
											$scope.entity.StructureType = null;
										}
									}
								}
							});

							estimateMainBidCreationProcess.setReadOnly($scope.entity, 'StructureType', isUpdateMode());
							break;
						case 'structure':
							if ($scope.entity.EstUppUsingURP) {
								$scope.isLoading = true;
								if($scope.entity.StructureType !== 1 && $scope.entity.StructureType !== 2){
									estimateMainEstUppDataService.setCurrentScope($scope);
								}

								setCurrentStep($scope.selectStep.number + 1);
								changeToStructureLookup();
								estimateMainEstUppConfigTypeService.setFilterByMdcContextId(true);
								if (currentMaxStep < 2 || !isUppConfigLoaded) {
									estimateMainEstUppConfigTypeService.loadData().then(function (data) {
										// isUppConfigLoaded = true;
										let uppCofigTypeRow = _.find($scope.formOptionsUppConfigSettings.configure.rows, {rid: 'estUppType'});
										uppCofigTypeRow.options.items = estimateMainEstUppConfigTypeService.getList();
										$scope.entity.EstUppStructure = null;
										if (data.length > 0) {

											let defaultUppConfigType = _.find(data, {IsDefault: true});
											estUppDefaultConfigTypeFk = angular.isDefined(defaultUppConfigType) && (defaultUppConfigType !== null) ? defaultUppConfigType.Id : null;
											// If can't find default value, then set 1st item as selected
											if (!estUppDefaultConfigTypeFk) {
												estUppDefaultConfigTypeFk = data[0].Id;
											}

											if (!isUpdateMode()) {
												$scope.entity.estUppConfigTypeFk = estUppDefaultConfigTypeFk;
											}

											estimateMainEstUppDataService.loadByContextId($scope.entity.estUppConfigTypeFk || estUppDefaultConfigTypeFk, $scope.entity.StructureType === 1 || $scope.entity.updateModel).then(function (data) {
												// set the urp config description here
												if (!isUpdateMode() && data) {
													$scope.entity.EstUppStructure = $scope.entity.EstUppStructure || null;
													$scope.entity.estUppConfigDesc = data.estUppConfigDesc;
													$scope.entity.EstUppConfigtypeFk = estUppDefaultConfigTypeFk;
													if (data.estUppConfig) {
														$scope.entity.EstUppConfigFk = data.estUppConfig.Id;
													}
													// generate the default assignments if has the default upp config type fk
													if (estUppDefaultConfigTypeFk) {
														setDefaultAssignments(null, estUppDefaultConfigTypeFk, data, true);
													} else {
														$scope.error.show = !structureTypesValidation();
													}
												} else {// update mode
													if (estUppDefaultConfigTypeFk) {
														// filter the lookup values without assignments
														let lookupValues = null;
														let urpAssignIds = _.map($scope.entity.StructureURPAssignments, 'EstUppStructure');
														switch ($scope.entity.StructureType) {
															case 1:
																var boqIds = _.map(boqLookupValues, 'Id');
																var notAssignIds = _.difference(boqIds, urpAssignIds);
																lookupValues = _.filter(boqLookupValues, function (item) {
																	return _.includes(notAssignIds, item.Id);
																});
																break;
															case 2:
																var actBoqIds = _.map(activityLookupValues, 'Id');
																var actNotAssignIds = _.difference(actBoqIds, urpAssignIds);
																lookupValues = _.filter(activityLookupValues, function (item) {
																	return _.includes(actNotAssignIds, item.Id);
																});
																break;
															default:
																// reset the default urp config type for other types
																if ($scope.entity.StructureURPAssignments && $scope.entity.StructureURPAssignments.length > 0 && !$scope.entity.EstUppEditType && !$scope.entity.EstUppConfigtypeFk) {
																	$scope.entity.StructureURPAssignments[0].EstUppConfigtypeFk = estUppDefaultConfigTypeFk;
																	if (data.estUppConfig) {
																		$scope.entity.StructureURPAssignments[0].EstUppConfigFk = data.estUppConfig.Id;
																		$scope.entity.StructureURPAssignments[0].estUppConfigDesc = data.estUppConfigDesc;
																	}
																}
																break;
														}
														setDefaultAssignments(lookupValues, estUppDefaultConfigTypeFk, data);
													} else {
														$scope.error.show = !structureTypesValidation();
													}

													// find out the first item in lookup
													initStructureLookup();

													// assign urp settings
													copyURPConfigIntoEntity($scope.entity.EstUppStructure || -1, $scope.entity.StructureType === 1 ? $scope.entity.MainItemId : null, true);
												}
											});
										} else {
											if (!isUpdateMode()) {
												setDefaultAssignments(null, null, null, true);
												// load upp2costcode details
												estimateMainUpp2CostcodeDetailDataService.setDataListFromMdc();
											} else {
												$scope.entity.EstUppConfigFk = null;
												$scope.entity.EstUppConfigtypeFk = null;
												$scope.entity.EstUppEditType = false;
												$scope.entity.EstUpp2Costcode = [];

												// assign the default urp settings
												// filter the lookup values without assignments
												let lookupValues = null;
												let urpAssignIds = _.map($scope.entity.StructureURPAssignments, 'EstUppStructure');
												switch ($scope.entity.StructureType) {
													case 1:
														var boqIds = _.map(boqLookupValues, 'Id');
														var notAssignIds = _.difference(boqIds, urpAssignIds);
														lookupValues = _.filter(boqLookupValues, function (item) {
															return _.includes(notAssignIds, item.Id);
														});
														break;
													case 2:
														var actBoqIds = _.map(activityLookupValues, 'Id');
														var actNotAssignIds = _.difference(actBoqIds, urpAssignIds);
														lookupValues = _.filter(activityLookupValues, function (item) {
															return _.includes(actNotAssignIds, item.Id);
														});
														break;
												}
												setDefaultAssignments(lookupValues, null, null);

												initStructureLookup();

												// update mode, need to load cost codes from server and assigned urp settings
												copyURPConfigIntoEntity($scope.entity.EstUppStructure || -1, $scope.entity.StructureType === 1 ? $scope.entity.MainItemId : null, true);
											}
										}
									});
								} else {
									estimateMainUpp2CostcodeDetailDataService.setNeedToForceGridRefresh(true);
								}
								currentMaxStep++;
							} else if ($scope.entity.ProjectChangeLineItems) {
								setCurrentStep($scope.selectStep.number + 2);
								setupStatusGrid();
								setupChangeOrderGrid();
							}  else if ($scope.ShowSurchargeGrid()) {
								setupSurchargeGrid(true);
								setCurrentStep($scope.selectStep.number + 3);
							} else if ($scope.ShowOptionalGrid) {
								setCurrentStep($scope.selectStep.number + 4);
								setupOptionalGrid();
							}else {

								setCurrentStep($scope.selectStep.number + 2);
								// currentMaxStep++;
								if ($scope.entity.ProjectChangeOrders) {
									setupStatusGrid();
									setupChangeOrderGrid();
								}
							}
							break;
						case 'uppConfig':
							var stepIndex = 1;
							if (!$scope.entity.ProjectChangeLineItems) {
								if($scope.ShowSurchargeGrid()){
									setupSurchargeGrid(true);
									stepIndex = 2;
								}else if($scope.ShowOptionalGrid){
									stepIndex = 3;
								}
							}
							setCurrentStep($scope.selectStep.number + stepIndex);
							currentMaxStep++;
							if ($scope.entity.ProjectChangeLineItems) {
								setupStatusGrid();
								setupChangeOrderGrid();
							} else if ($scope.ShowOptionalGrid) {
								setupOptionalGrid();
							}
							break;
						case 'projectChange':
							setCurrentStep($scope.selectStep.number + 1);
							if (!$scope.ShowSurchargeGrid() && $scope.ShowOptionalGrid) {
								stepIndex = 2;
								// show optional grid
								setupOptionalGrid();
							}else{
								setupSurchargeGrid(true);
							}

							currentMaxStep++;
							break;
						case 'surcharge':
							setCurrentStep($scope.selectStep.number + 1);
							if ($scope.ShowOptionalGrid) {
								// show optional grid
								setupOptionalGrid();
							}
							currentMaxStep++;
							break;
						case 'optional':
							setCurrentStep($scope.selectStep.number + 1);
							currentMaxStep++;
							break;
						default:
							// start todo:no useful?
							if ($scope.isLastStep()) { // jshint ignore:line

							} else {
								setCurrentStep($scope.selectStep.number + 1);
							}
					}

					setCurrentWinHeight($scope);

				};

				function initStructureLookup(){
					switch ($scope.entity.StructureType) {
						case 1: // boqLookupValues = _.orderBy(boqLookupValues, ['Code'], ['asc']);
						{
							let boqFirstItem = boqLookupValues && _.isArray(boqLookupValues) ? boqLookupValues[0] : null;
							if (boqFirstItem && boqFirstItem.Id) {
								$scope.entity.EstUppStructure = boqFirstItem.Id;
								$scope.entity.MainItemId = boqFirstItem.BoqHeader.Id;
							}
							break;
						}
						case 2: {
							activityLookupValues = _.orderBy(activityLookupValues, ['Code'], ['asc']);
							let actFirstItem = activityLookupValues && _.isArray(activityLookupValues) ? activityLookupValues[0] : null;
							if (actFirstItem) {
								$scope.entity.EstUppStructure = actFirstItem.Id;
							}
							break;
						}
					}
				}

				let currentSelectedLookupItem = null;

				function getBoqStructureFromCache(boqStructureFk) {
					let boqDefer = $q.defer();
					let existStructure = _.find(boqStructures, {Id: boqStructureFk});
					if (existStructure) {
						boqDefer.resolve(existStructure);
					} else {
						let boqMainDocPropertiesService = $injector.get('boqMainDocPropertiesService');
						boqMainDocPropertiesService.getBoqStructure(boqStructureFk).then(function (response) {
							let newStructure = {Id: boqStructureFk, boqStructure: response.data};
							boqStructures.push(newStructure);
							boqDefer.resolve(newStructure);
						});
					}
					return boqDefer.promise;
				}

				// restore data from creation using SourceInfo link
				function reStoreTheSettings(settings, usingUrp) {
					if (_.isArray(settings)) {

						let copySettings = [];
						_.each(settings, function (item) {
							let sourceInfoInt = _.parseInt(_.isEmpty(item.SourceInfo) ? '-1' : item.SourceInfo);
							item.MainItemId = sourceInfoInt;
							let originalBoq = null;
							switch ($scope.entity.StructureType) {
								case 1:
									originalBoq = _.find(boqLookupValues, function (boq) {
										return boq.BoqHeader && boq.BoqHeader.Id === sourceInfoInt;
									});
									// also need to load structure info(UrbNames) from project boq as default
									if (originalBoq && originalBoq.BoqHeader) {
										let existStructure = _.find(boqStructures, {Id: originalBoq.BoqHeader.BoqStructureFk});
										if (existStructure) {
											copyStructureInfo(existStructure.boqStructure, item);
										}
									}
									break;
								case 2:
									originalBoq = _.find(activityLookupValues, function (activity) {
										return activity.Id === sourceInfoInt;
									});
									break;
							}
							item.EstUppStructure = originalBoq ? originalBoq.Id : -1;
							if (usingUrp) {
								item.EstUppUsingURP = true;
							}
							let existEstUppStructure = _.find(copySettings, {EstUppStructure: item.EstUppStructure});
							if (!existEstUppStructure) {
								copySettings.push(item);
							}
						});
						$scope.entity.StructureURPAssignments = copySettings;
						if (copySettings.length > 0 && copySettings[0].EstUppStructure) {
							// copyURPConfigIntoEntity(settings[0].EstUppStructure);
							let settingsSturcture = copySettings[0].EstUppStructure;
							$scope.entity.EstUppStructure = settingsSturcture;
							$scope.entity.EstUppUsingURP = copySettings[0].EstUppUsingURP || usingURP;
							$scope.entity.EstUppConfigFk = copySettings[0].EstUppConfigFk;
							$scope.entity.EstUppConfigtypeFk = copySettings[0].EstUppConfigtypeFk;
							$scope.entity.EstUppEditType = copySettings[0].EstUppEditType;
							$scope.entity.estUppConfigDesc = copySettings[0].estUppConfigDesc;

							switch ($scope.entity.StructureType) {
								case 1:
									currentSelectedLookupItem = _.find(boqLookupValues, function (boq) {
										return boq.Id === settingsSturcture;
									});
									break;
								case 2:
									currentSelectedLookupItem = _.find(activityLookupValues, function (activity) {
										return activity.Id === settingsSturcture;
									});
									break;
							}
						}
					}
				}

				function updatePrjChangeLineItemsOption(){
					let prjChangeLineItemsOption = _.find(formConfigStructureSettings.rows, {rid: 'projectChangeLineItems'});
					prjChangeLineItemsOption.readonly = false;
					$scope.entity.ProjectChangeLineItems = false;

					if($scope.entity.TypeEntity && $scope.entity.TypeEntity.IsChange) {
						prjChangeLineItemsOption.readonly = true;
						$scope.entity.ProjectChangeLineItems = true;
					}else if($scope.entity.TypeEntity && ($scope.entity.TypeEntity.IsSide || $scope.entity.TypeEntity.IsMain)){
						prjChangeLineItemsOption.readonly = true;
						$scope.entity.ProjectChangeLineItems = false;
					}
				}


				function setCurrentStep(step) {
					let currentStepNumber = $scope.selectStep.number;
					$scope.selectStep = angular.copy($scope.steps[step]);
					$scope.modalTitle = $scope.selectStep.name;
					let wz = WizardHandler.wizard($scope.wizardName);
					let allSteps = wz.getEnabledSteps();
					for (let i = 0; i < step; i++) {
						allSteps[i].completed = true;
					}
					for (let j = allSteps.length - 1; j >= step; j--) {
						allSteps[j].selected = false;
						allSteps[j].completed = false;
					}
					allSteps[step].completed = currentStepNumber > step;
					wz.goTo(step);
				}

				// endregion

				// region translation

				// object holding translated strings
				$scope.translate = {};

				let loadTranslations = function () {
					platformTranslateService.translateFormConfig(formConfigBasicSettings);
					platformTranslateService.translateFormConfig(formConfigStructureSettings);
				};
				//
				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				$scope.getButtonText = function () {
					if ($scope.isLastStep()) {
						return $translate.instant('basics.common.button.ok');
					}

					return $translate.instant('basics.common.button.nextStep');
				};
				// endregion

				$scope.canExecuteNextButton = function () {

					switch ($scope.selectStep.number) {
						case 0: {
							let isValid = salesBidCreateBidDialogService.isValid($scope.entity) && $scope.formOptionsBasicSettings.salesBidCodeAvailable === '1';
							if (isValid) {
								if (isSelectedUpdateMode) {
									isValid = ($scope.entity.Code !== '');
								} else {
									isValid = salesBidValidationService.isCodeUnique;
								}
							}
							return isValid;
						}
						case 1:
							return ($scope.entity.EstUppUsingURP || $scope.entity.ProjectChangeLineItems || $scope.ShowOptionalGrid || $scope.ShowSurchargeGrid())
								&& !!$scope.entity.StructureType
								&& !$scope.assignError.show
								&& !$scope.noLineItemStructureError.show
								&& !$scope.executionScheduleError.show
								&& !$scope.noMainBidSelelectedError.show
								&& loadSuccessFlag;
						case 2:
							return ($scope.entity.ProjectChangeLineItems || $scope.ShowOptionalGrid  || $scope.ShowSurchargeGrid()) && !$scope.isLoading;
						case 3:
							return (($scope.ShowOptionalGrid || $scope.ShowSurchargeGrid()) && !$scope.isLoading);
						case 4:
							return ($scope.ShowOptionalGrid && !$scope.isLoading);
						case 5:
							return false;
						default:
							return !$scope.isLoading;
					}
				};



				// un-register on destroy
				$scope.$on('$destroy', function () {

					if (platformGridAPI.grids.exist(statusGridId)) {
						platformGridAPI.grids.unregister(statusGridId);
					}

					if (platformGridAPI.grids.exist(detailsGridId)) {
						platformGridAPI.grids.unregister(detailsGridId);
					}
					if (platformGridAPI.grids.exist(ChangeOrderGridId)) {
						platformGridAPI.grids.unregister(ChangeOrderGridId);
					}
					if (platformGridAPI.grids.exist(optionalGridId)) {
						platformGridAPI.grids.unregister(optionalGridId);
					}

					if (platformGridAPI.grids.exist(gridSurchargeGirdId)){
						platformGridAPI.grids.unregister(gridSurchargeGirdId);
						platformGridAPI.events.unregister(gridSurchargeGirdId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
					}

					estimateMainEstUppDataService.setCurrentScope(null);

					platformTranslateService.translationChanged.unregister(loadTranslations);

					estimateMainEstUppDataService.onItemChange.unregister(updateUppConfig);
					estimateMainUpp2CostcodeDetailDataService.onItemModified.unregister(urpValidation);
					estimateMainUpp2CostcodeDetailDataService.clearData();

					estimateMainEstUppConfigTypeService.clearFilterByMdcContextId();

					basicsLookupdataLookupFilterService.unregisterFilter(filter);
					basicsLookupdataLookupFilterService.unregisterFilter(projectContractTypefilter);
					estimateMainUpp2CostcodeDetailDataService.onItemModified.unregister(reloadUppDetail);
					platformGridAPI.events.unregister(optionalGridId, 'onDblClick', onGridDblClick);
					estimeMainCraeteBidOptionProfileService.selectItemChanged.unregister(onSelectOptionItemChanged);
					estimateMainEstUppDataService.clear();
				});

				let updateModeInitValues = {
					entity: {},
					codeField: {},
					codeIsAutoGenerated: false,
					canUpdate: false
				};

				// region get/save settings
				let bidCreationData = salesBidCreateBidDialogService.getCopyOfInitDataItem();
				let bidCreationUrpData = salesBidCreateBidDialogService.getCopyOfInitUrpDataItem();

				salesBidCreateBidDialogService.resetToDefault(bidCreationData);
				$scope.entity = salesBidCreateBidDialogService.getCopyOfInitDataItem();
				// TODO: check if we wait for promise to resolve here...
				// salesBidCreateBidDialogService.resetToDefault($scope.entity).then(....
				// ...
				salesBidCreateBidDialogService.resetToDefault($scope.entity, updateModeInitValues);
				// Add additional properties
				$scope.entity.StructureType = 1;
				$scope.entity.BoqItemQuantityFromType = 1;
				$scope.entity.MajorLineItems = true;
				$scope.entity.estimateScope = 0;
				$scope.entity.ProjectFk = estimateMainService.getSelectedProjectId();
				$scope.entity.ProjectChangeLineItems = false;
				$scope.entity.DeleteOriginalBidBoq = false;
				$scope.entity.ProjectChangeMode = 'Status';
				$scope.entity.ProjectChangeStatus = [];
				$scope.entity.ProjectChangeDetails = [];
				$scope.entity.ProjectChangeOrders = [];
				$scope.entity.BidBoqUintRateGen = '';
				$scope.entity.UpdateFpBoqUnitRate = false;
				$scope.entity.CopyLineItemRete = true;
				$scope.entity.PriceColumns = [];
				$scope.entity.SurchargeItems = [];
				$scope.entity.SourceInfo = '';

				function getFlatCostCodes() {
					let upp2costcodes = estimateMainUpp2CostcodeDetailDataService.getList();
					return cloudCommonGridService.flatten(upp2costcodes, [], 'CostCodes');
				}

				// reduce content to sent
				function cleanURPAssignment(flatCostCodes) {
					flatCostCodes = _.filter(flatCostCodes, function (item) {
						return item.UppId > 0;
					});
					return _.map(flatCostCodes, function (item) {
						return {
							'UppId': item.UppId,
							'MdcCostCodeFk': item.MdcCostCodeFk,
							'Project2MdcCstCdeFk': item.Project2MdcCstCdeFk,
							'LineType': item.LineType
						};
					});
				}

				function makeCostCodesFlatAndAssign() {
					$scope.entity.EstUpp2Costcode = estimateMainUpp2CostcodeDetailDataService.getOriginList();
				}

				function makeAllCostCodesFlat() {
					angular.forEach($scope.entity.StructureURPAssignments, function (item) {
						if (item.EstUppEditType && item.EstUppUsingURP) {
							let upp2CostCodes = item.EstUpp2Costcode;
							let flatCostCodes = cloudCommonGridService.flatten(upp2CostCodes, [], 'CostCodes');
							item.EstUpp2Costcode = cleanURPAssignment(flatCostCodes);
						} else {
							item.EstUpp2Costcode = [];
						}
					});
					if ($scope.entity.EstUpp2Costcode) {
						$scope.entity.EstUpp2Costcode = [];
					}
				}

				// check if all the urp assignments with the edittype = false
				function validateForUPPType() {
					let isvalid = true;
					angular.forEach($scope.entity.StructureURPAssignments, function (item) {
						if (item && !item.EstUppEditType && !item.EstUppConfigFk && !!estUppDefaultConfigTypeFk) {
							isvalid = false;
						}
					});
					return isvalid;
				}

				function copyStructureInfo(structure, sourceItem) {
					if (structure && sourceItem) {
						sourceItem.CalcFromUrb = structure.CalcFromUrb;
						sourceItem.NameUrb1 = structure.NameUrb1;
						sourceItem.NameUrb2 = structure.NameUrb2;
						sourceItem.NameUrb3 = structure.NameUrb3;
						sourceItem.NameUrb4 = structure.NameUrb4;
						sourceItem.NameUrb5 = structure.NameUrb5;
						sourceItem.NameUrb6 = structure.NameUrb6;
					} else if (structure) {
						$scope.entity.CalcFromUrb = structure.CalcFromUrb;
						$scope.entity.NameUrb1 = structure.NameUrb1;
						$scope.entity.NameUrb2 = structure.NameUrb2;
						$scope.entity.NameUrb3 = structure.NameUrb3;
						$scope.entity.NameUrb4 = structure.NameUrb4;
						$scope.entity.NameUrb5 = structure.NameUrb5;
						$scope.entity.NameUrb6 = structure.NameUrb6;
					}
				}

				// copy the urp config into StructureURPAssignments
				function copyURPConfigIntoAssignments(estUppStructure, boqHeaderFk, sourceInfo, selectedLookupItem, estUppDefaultConfigTypeFk, data) {

					makeCostCodesFlatAndAssign();
					currentSelectedLookupItem = currentSelectedLookupItem || selectedLookupItem;

					let currentStructureIndex = 0;
					if ($scope.entity.StructureURPAssignments) {
						// find the current structure and assign
						currentStructureIndex = getCurrentStructureIndex(estUppStructure);
						// if not found in list, create it
						if (currentStructureIndex === -1 && estUppStructure !== null || $scope.entity.StructureURPAssignments.length === 0) {
							let newUrp = angular.copy(bidCreationUrpData);
							newUrp.EstUppStructure = estUppStructure;
							newUrp.MainItemId = boqHeaderFk;
							newUrp.SourceInfo = sourceInfo;
							newUrp.CreationType = $scope.entity.StructureType;
							if (estUppDefaultConfigTypeFk) {
								newUrp.EstUppConfigtypeFk = estUppDefaultConfigTypeFk;
							}
							if (data && data.estUppConfig) {
								newUrp.EstUppConfigFk = data.estUppConfig.Id;
								newUrp.estUppConfigDesc = data.estUppConfigDesc;
							} else if (!estUppDefaultConfigTypeFk && !data) {
								newUrp.EstUppConfigFk = null;
								newUrp.estUppConfigDesc = null;
							}
							newUrp.EstUppEditType = !(newUrp.EstUppConfigtypeFk && newUrp.EstUppConfigFk);
							if (!estUppDefaultConfigTypeFk && !data) {
								newUrp.EstUppEditType = false;
							}

							$scope.entity.StructureURPAssignments.push(newUrp);

							currentStructureIndex = getCurrentStructureIndex(estUppStructure);
						}
					}
					if (!angular.isUndefined(currentStructureIndex) && currentStructureIndex >= 0 && !estUppDefaultConfigTypeFk) {
						for (let property in bidCreationUrpData) {
							// eslint-disable-next-line no-prototype-builtins
							if ($scope.entity.hasOwnProperty(property)) {
								let entityVal = $scope.entity[property];
								entityVal = property === 'EstUppStructure' ? estUppStructure || entityVal : entityVal;
								entityVal = property === 'MainItemId' ? boqHeaderFk || entityVal : entityVal;
								entityVal = property === 'SourceInfo' ? sourceInfo || entityVal : entityVal;
								entityVal = property === 'EstUppConfigtypeFk' ? $scope.entity.estUppConfigTypeFk || entityVal : entityVal;
								if (property === 'CreationType') {
									entityVal = $scope.entity.StructureType;
								}

								if(property !== 'EstUppConfigFk') {
									$scope.entity.StructureURPAssignments[currentStructureIndex][property] = entityVal;
								}else{
									$scope.entity.StructureURPAssignments[currentStructureIndex][property] = entityVal || $scope.entity.StructureURPAssignments[currentStructureIndex][property];
								}
							}
						}
					}
				}

				function copyCurrentURPConfig(selectedItem) {

					let estUppStructure = null, boqHeaderFk = null, sourceInfo = null;
					switch ($scope.entity.StructureType) {
						case 1:
							if (selectedItem && selectedItem.Id && selectedItem.BoqHeader) {
								estUppStructure = selectedItem.Id;
								boqHeaderFk = selectedItem.BoqHeader.Id;
								// sourceInfo = selectedItem.BoqRootItem.Reference + '-' + selectedItem.BoqRootItem.BriefInfo.Translated;
								sourceInfo = boqHeaderFk;
							}
							break;
						case 2:
							if (selectedItem && selectedItem.Id && selectedItem.Code) {
								estUppStructure = selectedItem.Id;
								boqHeaderFk = selectedItem.Id;
								// sourceInfo = selectedItem.Code + '-' + selectedItem.DescriptionInfo.Translated;
								sourceInfo = boqHeaderFk;
							}
							break;
						default:
							estUppStructure = -1;
							break;
					}

					copyURPConfigIntoAssignments(estUppStructure, boqHeaderFk, sourceInfo, selectedItem);
				}

				function getCurrentStructureIndex(estUppStructure) {
					if (estUppStructure === null) {
						return -1;
					}
					return _.findIndex($scope.entity.StructureURPAssignments, {EstUppStructure: estUppStructure || $scope.entity.EstUppStructure});
				}

				// copy the urp config from structures into current entity
				function copyURPConfigIntoEntity(estUppStructure, boqHeaderId, fromPrevStep) {
					if (estUppStructure !== null) {
						let currentStructureIndex = _.findIndex($scope.entity.StructureURPAssignments, {EstUppStructure: estUppStructure});
						if (!angular.isUndefined(currentStructureIndex) && currentStructureIndex >= 0) {
							for (let property in bidCreationUrpData) {
								// eslint-disable-next-line no-prototype-builtins
								if ($scope.entity.hasOwnProperty(property)) {
									if(property === 'CalculateHours'){
										if(!fromPrevStep){
											$scope.entity[property] = $scope.entity.StructureURPAssignments[currentStructureIndex][property];
										}
									}
									else {
										$scope.entity[property] = $scope.entity.StructureURPAssignments[currentStructureIndex][property];
									}
									if (property === 'EstUppConfigtypeFk') {
										$scope.entity.estUppConfigTypeFk = $scope.entity.StructureURPAssignments[currentStructureIndex][property];
										if ($scope.entity.EstUppEditType) {// jshint ignore:line
											// when restore the settings at first time ??
											if ($scope.entity.EstUppConfigFk && _.isNumber($scope.entity.EstUppConfigFk)) {
												// load from uppConfigId
												if(boqHeaderId){
													estimateMainUpp2CostcodeDetailDataService.registerListLoaded(upp2CostCodeLoaded);
												}
												let permission = !boqHeaderId
													? estimateMainEstUppDataService.loadByConfigId($scope.entity.EstUppConfigFk)
													: estimateMainEstUppDataService.loadByEstNBoq(null, boqHeaderId);
												permission.then(function (data) {// jshint ignore:line
													if ($scope.entity.EstUppEditType) {
														$scope.entity.estUppConfigDesc = data.estUppConfig && data.estUppConfig.DescriptionInfo ? data.estUppConfig.DescriptionInfo.Translated : '';
														// do not load from server at second time
														$scope.entity.EstUppConfigFk = null;
													}
													if(!boqHeaderId ){$scope.isLoading = false;}
													// processItem(true);
												});
											} else {
												// load from StructureURPAssignments.EstUpp2Costcode
												let curentUpp2CostCode = $scope.entity.StructureURPAssignments[currentStructureIndex]['EstUpp2Costcode'];// jshint ignore:line
												estimateMainUpp2CostcodeDetailDataService.setDataList(curentUpp2CostCode).then(function () {// jshint ignore:line
													estimateMainUpp2CostcodeDetailDataService.refreshGrid();
												});
											}
										} else { // jshint ignore:line
											if ((!!$scope.entity.estUppConfigTypeFk && _.isNumber($scope.entity.estUppConfigTypeFk)) || boqHeaderId) {
												// load URP config by contextId
												if(!boqHeaderId) {
													estimateMainUpp2CostcodeDetailDataService.registerListLoaded(upp2CostCodeLoaded);
													estimateMainEstUppDataService.loadByContextId($scope.entity.estUppConfigTypeFk).then(function () {// jshint ignore:line

													});
												}else{
													estimateMainUpp2CostcodeDetailDataService.registerListLoaded(upp2CostCodeLoaded);
													estimateMainEstUppDataService.loadByEstNBoq(null, boqHeaderId).then(function(data){
														if(data){
															$scope.entity.estUppConfigDesc = data.estUppConfig && data.estUppConfig.DescriptionInfo ? data.estUppConfig.DescriptionInfo.Translated : '';
															$scope.entity.StructureURPAssignments[currentStructureIndex].EstUppConfigFk = data.estUppConfig ? data.estUppConfig.Id : null;
															$scope.entity.StructureURPAssignments[currentStructureIndex].EstUppConfigtypeFk = data.estUppConfigTypeFk;
															$scope.entity.EstUppConfigtypeFk = data.estUppConfigTypeFk;
															$scope.entity.estUppConfigTypeFk = data.estUppConfigTypeFk;
														}
													});
												}
											} else {
												// load upp2costcode details
												estimateMainUpp2CostcodeDetailDataService.setDataListFromMdc().then(function (){
													$scope.isLoading = false;
												});
											}
										}
									}
								}
							}
							// processItem();
						} else {
							processItem(true);
						}
					} else {
						processItem(true);
					}
				}

				function upp2CostCodeLoaded(){
					$scope.isLoading = false;
					estimateMainUpp2CostcodeDetailDataService.unregisterListLoaded(upp2CostCodeLoaded);
				}

				$scope.adjustProjectChangeMode = function (mode) {
					$scope.entity.ProjectChangeMode = mode;

					if (mode === 'Detail') {
						$timeout(function () {
							updateDetailsGrid();
						}, 200);
					}
				};

				$scope.isExecting = false;

				$scope.execute = function () {
					$scope.isExecting = true;

					// First copy the entered data to a special creationData object that fulfills the needs of the given service call to create a new bid header.
					let creationData = {};
					for (let property in bidCreationData) {
						// eslint-disable-next-line no-prototype-builtins
						if ($scope.entity.hasOwnProperty(property)) {
							creationData[property] = $scope.entity[property];
						}
					}

					// estimateMainEstUppDataService.provideUpdateData($scope.entity.uppConfig);

					creationData.EstimateHeaderFk = estimateMainService.getSelectedEstHeaderId();
					$scope.entity.EstimateHeaderFk = creationData.EstimateHeaderFk;

					$scope.isLoading = true;
					$scope.loadingInfo = $translate.instant('sales.bid.wizard.loadingInfo');

					// copy the selected one as the current structure
					if ($scope.entity.EstUppUsingURP) {
						copyCurrentURPConfig(currentSelectedLookupItem);
						makeAllCostCodesFlat();
					}

					// for multiple Structure, synchronize Urb Configuration from first Structure is its own is empty.
					if (!!$scope.entity.StructureURPAssignments && $scope.entity.StructureURPAssignments.length > 1) {
						let firstItem = $scope.entity.StructureURPAssignments[0];
						for (let i = 1; i < $scope.entity.StructureURPAssignments.length; i++) {
							let item = $scope.entity.StructureURPAssignments[i];
							if (!item.NameUrb1 && !item.NameUrb2 && !item.NameUrb3 && !item.NameUrb4 && !item.NameUrb5 && !item.NameUrb6 && !item.CalcFromUrb) {
								item.NameUrb1 = firstItem.NameUrb1;
								item.NameUrb2 = firstItem.NameUrb2;
								item.NameUrb3 = firstItem.NameUrb3;
								item.NameUrb4 = firstItem.NameUrb4;
								item.NameUrb5 = firstItem.NameUrb5;
								item.NameUrb6 = firstItem.NameUrb6;
								item.CalcFromUrb = firstItem.CalcFromUrb;
							}
							// if (!item.EstUppEditType && firstItem.EstUppEditType) {
							// item.EstUpp2Costcode = firstItem.EstUpp2Costcode;
							// item.EstUppEditType = true;
							// }
						}
						$scope.entity.SplitPerStructure = true;
					}

					// no need for the uppcostcode
					if (creationData && creationData.EstUpp2Costcode) {
						creationData.EstUpp2Costcode = [];
					}

					let creationSettings = $scope.entity; // Take the settings done in the dialog

					// see #126648: configuration id is not transferred
					creationData.ConfigurationId = creationSettings.ConfigurationFk;

					/* use for create bid by line items structure */
					creationSettings.GroupingColumns = [];
					creationSettings.Module = 'estimate.main';
					creationSettings.OutputColumns = [];
					if (creationSettings.StructureType === 16) {
						creationSettings.OutputColumns.push({
							aggregateFunction: 'SUM',
							outputColumnName: 'CostTotal',
							sortingBy: 0
						});

						/* get grouping columns */
						creationSettings.GroupingColumns = estimateMainBidCreationService.handleGroupColumns();
					}

					if(creationSettings.StructureType === 1){
						let itemList = [];
						$injector.get('cloudCommonGridService').flatten($scope.entity.SurchargeItems, itemList, 'BoqItemExtendDtos');
						creationSettings.SurchargeTextNoteBoqItems = _.filter(itemList, function (item){ return  item.Selected=== true && !item.ReadOnly;});
					}

					creationData.StructureMainId = $injector.get('estimateWizardStructureTypeLookupService').getSelectMainId(creationSettings.StructureType);

					if(creationSettings.ProjectChangeLineItems && !creationSettings.MajorLineItems){
						if(!creationSettings.ProjectChangeOrders || creationSettings.ProjectChangeOrders.length <= 0){
							$injector.get('platformDialogService').showInfoBox('estimate.main.bidCreationWizard.noChangeOrderSelect');
							$scope.isLoading = false;
							$scope.isExecting = false;
							return;
						}
					}

					if (isUpdateMode()) {

						let existedBidHeader = estimateMainBidCreationService.getBidHeaderFromLookup(creationData.Code);
						// update existed bid boq

						existedBidHeader.ExchangeRate = existedBidHeader.ExchangeRate || 1;
						creationSettings.BidHeaderFk = existedBidHeader.Id; // Add the already created bid header
						estimateMainBidCreationService.updateBidBoqs(creationData, creationSettings).then(function (/* result */) {
							$scope.isLoading = false;
							$scope.$parent.$close(false);

							estimateMainBidCreationService.saveBidCreatingConfig($scope.entity, existedBidHeader.Id);

							// navigate to sales bid module
							showNavigationDialog(existedBidHeader);
						},
						function () {
							// Something must have gone wrong when updating the bid boqs
							$scope.isLoading = false;
							$scope.$parent.$close(false);
						}
						);
					} else {

						// let creationSettings = $scope.entity; // Take the settings done in the dialog
						estimateMainBidCreationService.createBidBoqsEx(creationData, creationSettings).then(function (createBidHeaderResults) {
							$scope.isLoading = false;
							$scope.$parent.$close(false);

							// $injector.get('salesBidBillingSchemaService').copyBillingSchemas(createBidHeaderResult);

							if(createBidHeaderResults && createBidHeaderResults.length > 0) {
								_.forEach(createBidHeaderResults, function (createBidHeaderResult){
									estimateMainBidCreationService.saveBidCreatingConfig($scope.entity, createBidHeaderResult.Id);
								});
							}

							estimateMainService.refresh().then(function () {
								// navigate to sales bid module
								showNavigationDialog(createBidHeaderResults);
							});
						},
						function () {
							// Something must have gone wrong when creating the bid boqs
							$scope.isLoading = false;
							$scope.$parent.$close(false);
						});
					}

				};

				function showNavigationDialog(newBidOrBids) {
					let navigateToBid = _.isArray(newBidOrBids) ? _.first(newBidOrBids) : newBidOrBids;
					let navigator = {moduleName: 'sales.bid'};
					var modalOptions = {
						templateUrl: 'sales.common/templates/sales-common-header-created-navigation-dialog.html',
						okBtnText: $translate.instant('sales.common.bidCreated.okBtn'),
						navigate: function () {
							$injector.get('platformModuleNavigationService').navigate(navigator, navigateToBid);
							toggleSideBarWizard();
							this.cancel();
						}
					};
					// one or more bids?
					if (_.isArray(newBidOrBids)) {
						let codeTxt = $translate.instant('cloud.common.entityCode');
						let codes = _.join(_.map(newBidOrBids, bid => {
							return codeTxt + ': \'' + bid.Code + '\'';
						}), ', <br/> ');
						modalOptions.headerText = $translate.instant('sales.common.bidsCreated.header');
						modalOptions.bodyText = $translate.instant('sales.common.bidsCreated.body') + codes;
					} else {
						modalOptions.headerText = $translate.instant('sales.common.bidCreated.header');
						modalOptions.bodyText = $translate.instant('sales.common.bidCreated.body', {code: newBidOrBids.Code});
					}
					platformModalService.showDialog(modalOptions);
				}

				function toggleSideBarWizard() {
					let sideBarService = $injector.get('cloudDesktopSidebarService');
					let sideBarId, sideBarItem;
					if (sideBarService.getSidebarIds() && sideBarService.getSidebarIds().newWizards) {
						sideBarId = sideBarService.getSidebarIds().newWizards;
						sideBarItem = _.find(sideBarService.commandBarDeclaration.items, {id: '#' + sideBarId});
						if (sideBarItem) {
							sideBarItem.fnWrapper(sideBarId);
						}
					}
				}

				$scope.canExecute = function () {
					return salesBidCreateBidDialogService.isValid($scope.entity)
						&& !$scope.isLoading
						&& !$scope.assignError.show
						&& !$scope.noLineItemStructureError.show
						&& !$scope.executionScheduleError.show
						&& !$scope.noMainBidSelelectedError.show
						&& structureTypesValidation()
						&& ($scope.selectStep.number === 5 ||
							($scope.selectStep.number === 4 && !$scope.ShowOptionalGrid) ||
							($scope.selectStep.number === 3 && !$scope.ShowSurchargeGrid() && !$scope.ShowOptionalGrid) ||
							($scope.selectStep.number === 2 && !$scope.ShowSurchargeGrid() && !$scope.ShowOptionalGrid && !$scope.entity.ProjectChangeLineItems) ||
							($scope.selectStep.number === 1 && !$scope.ShowSurchargeGrid() && !$scope.ShowOptionalGrid && !$scope.entity.EstUppUsingURP && !$scope.entity.ProjectChangeLineItems));
				};

				// check the structures all assigned values
				function structureTypesValidation() {
					let isValid = true;
					if (!$scope.entity.EstUppUsingURP) {
						return true;
					}

					$scope.entity.StructureURPAssignments = _.filter($scope.entity.StructureURPAssignments, function (data) {
						return data && data.EstUppStructure > -2;
					});
					$scope.entity.StructureURPAssignments = _.sortBy($scope.entity.StructureURPAssignments, ['EstUppStructure']);
					let urpAssignIds = _.map($scope.entity.StructureURPAssignments, 'EstUppStructure');

					if ($scope.entity.StructureType === 1) {
						// make sure all assigned values
						boqLookupValues = _.sortBy(boqLookupValues, ['Id']);
						urpAssignIds = settingUrpAssignIds(urpAssignIds);
						isValid = _.isEqual(_.map(boqLookupValues, 'Id'), urpAssignIds) && urpAssignIds.length > 0;
					} else if ($scope.entity.StructureType === 2) {
						activityLookupValues = _.sortBy(activityLookupValues, ['Id']);
						urpAssignIds = settingUrpAssignIds(urpAssignIds);
						isValid = _.isEqual(_.map(activityLookupValues, 'Id'), urpAssignIds) && urpAssignIds.length > 0;
					} else {
						isValid = true;
					}
					isValid = (isValid && validateForUPPType());
					// $scope.error.show = !isValid;

					return isValid;
				}

				function settingUrpAssignIds(urpAssignIds) {
					// push current selected into urpAssignIds
					if (currentSelectedLookupItem && urpAssignIds && currentSelectedLookupItem.Id && !_.includes(urpAssignIds, currentSelectedLookupItem.Id)) {
						urpAssignIds.push(currentSelectedLookupItem.Id);
					}
					return _.sortBy(urpAssignIds);
				}

				// watch the entity and make sure the urp valid, show warning message
				$scope.$watchGroup(['entity.EstUppConfigtypeFk', 'entity.EstUppEditType', 'entity.EstUppStructure', 'entity.EstUpp2Costcode'], function () {
					urpValidation();
				});

				function urpValidation() {
					// validate for the urp settings
					$scope.urpSelectionError.show = !checkIfAllURPSeleted();
				}

				function checkIfAllURPSeleted() {
					let uppflatCostCodes = getFlatCostCodes();
					let anyCodes = _.filter(uppflatCostCodes, function (item) {
						return item.UppId && item.UppId > 0;
					});
					return (_.isArray(anyCodes) && anyCodes.length === uppflatCostCodes.length);
				}

				function clearAllUrpAssignments(isIgnoreEstUppUsingURP) {
					if(!isIgnoreEstUppUsingURP){
						$scope.entity.EstUppUsingURP = true;
					}
					$scope.entity.CreationType = null;
					$scope.entity.MainItemId = -1;
					$scope.entity.SourceInfo = '';
					$scope.entity.EstUppStructure = null;
					$scope.entity.EstUppEditType = false;
					$scope.entity.EstUppConfigtypeFk = null;
					$scope.entity.EstUppConfigFk = null;
					$scope.entity.estUppConfigDesc = '';
					$scope.entity.CalcFromUrb = false;
					$scope.entity.NameUrb1 = '';
					$scope.entity.NameUrb2 = '';
					$scope.entity.NameUrb3 = '';
					$scope.entity.NameUrb4 = '';
					$scope.entity.NameUrb5 = '';
					$scope.entity.NameUrb6 = '';
					$scope.entity.EstUpp2Costcode = [];
					// $scope.entity.SurchargeItems = [];

					$scope.entity.StructureURPAssignments = [];
					currentMaxStep = $scope.selectStep.number; // reset the max step to currentStep, will reload the urp config again
					currentSelectedLookupItem = null;
				}

				// endregion

				// region misc

				$scope.close = function () {
					// $modalInstance.dismiss();
					$scope.$parent.$close(false);
				};

				$scope.dialog = {};
				$scope.dialog.cancel = function () {
					$scope.close();
				};

				$scope.change = function change(item, model) {
					let urpEditType = $scope.entity.EstUppEditType;
					if (model === 'estUppConfigTypeFk' && !urpEditType) {
						estimateMainEstUppDataService.loadByContextId(item.estUppConfigTypeFk).then(function () {
							// processItem(true);
							makeCostCodesFlatAndAssign();
						});
					}
				};

				// endregion


				// region update bid
				$scope.formOptionsBasicSettings.salesBidCreateUpdateWizardUpdateOrCreate = '1'; // radio button, create bid by default
				$scope.formOptionsBasicSettings.salesBidCodeAvailable = '1'; // 1 by default available, the bid code

				$scope.entity.ProjectChangeGenerateMode = 2;// default separate bid for each change
				let codeFieldIndex = null;

				function isUpdateMode() {
					let bidHeader = estimateMainBidCreationService.getBidHeaderFromLookup($scope.entity.Code);
					return (
						!_.isEmpty(bidHeader) &&
						$scope.formOptionsBasicSettings.salesBidCreateUpdateWizardUpdateOrCreate === '2'
					);
				}

				function reconstructAsynValidator(asyncValidatorFn) {
					if (!_.isFunction(asyncValidatorFn)) {
						return asyncValidatorFn;
					}
					return function (entity, value) {
						let defer = $q.defer();
						asyncValidatorFn(entity, value).then(function (rsData) {
							if (rsData === true) {
								// no error
								$scope.formOptionsBasicSettings.salesBidCodeAvailable = '1'; // pass
							} else {
								$scope.formOptionsBasicSettings.salesBidCodeAvailable = '0'; // no-pass
							}

							defer.resolve(rsData);
						});
						return defer.promise;
					};
				}

				function initializeValuesBeforeUpdate() {
					function getCodeField() {
						let codeConfigField = _.find(salesBidCreateBidDialogService.getFormConfig().rows, {
							gid: 'baseGroup',
							rid: 'code',
							model: 'Code'
						}) || {};
						if (!_.isEmpty(codeConfigField)) {
							updateModeInitValues.codeField = angular.extend(codeConfigField, {
								visible: true,
								required: isSelectedUpdateMode,
								label: $translate.instant(codeConfigField.label$tr$)
							});
							// re-write the validator
							if (_.isFunction(codeConfigField.asyncValidator)) {
								updateModeInitValues.codeField.asyncValidator = reconstructAsynValidator(codeConfigField.asyncValidator);
							}
						}
						return codeConfigField;
					}

					// reserve the initial setting code field
					updateModeInitValues.getCodeField = getCodeField;
					updateModeInitValues.canUpdate = !_.isEmpty(getCodeField());

					// reserve the code field initial index in the scope form settings
					$scope.formOptionsBasicSettings.configure.rows.map(function (row, index) {
						if (!_.isEmpty(row) && row.gid === 'baseGroup' && row.rid === 'code' && row.model === 'Code') {
							codeFieldIndex = index;
							// row.required = true; // set this field to be required
							$scope.formOptionsBasicSettings.configure.rows[index] = getCodeField();
						}
					});

					// reserve the creation initial values
					if (updateModeInitValues.codeIsAutoGenerated === true) {
						let numberGenSettingsService = $injector.get('salesBidNumberGenerationSettingsService');
						numberGenSettingsService.assertLoaded().then(function () {
							$scope.entity.Code = numberGenSettingsService.provideNumberDefaultText($scope.entity.RubricCategoryFk, $scope.entity.Code);
						});
					}
					platformRuntimeDataService.readonly($scope.entity, [{
						field: 'Code',
						readonly: updateModeInitValues.codeIsAutoGenerated
					}]);
				}

				$scope.isUpdateModeFor = function () {
					return isUpdateMode();
				};

				function setUpdateMode() {
					isSelectedUpdateMode = true;
					// select the first bid's code by default
					$scope.entity.Code = retrieveBackBidInfo();
					$scope.entity.updateModel = true;
					resetCodeErrors();
					// set to editable
					platformRuntimeDataService.readonly($scope.entity, [{field: 'Code', readonly: false}]);
					setCodeFieldToLookup(true);
					setUpdateFieldsReadOnly(true);

					// choose based on project change line items
					$scope.entity.ProjectChangeLineItems = false;
					$scope.entity.ProjectChangeGenerateMode = 1;

					// this is for CostGroup type bid
					$injector.get('estimateWizardStructureTypeLookupService').loadData();

					$scope.$broadcast('form-config-updated');
				}

				function setCreateMode() {
					isSelectedUpdateMode = false;
					angular.extend($scope.entity, updateModeInitValues.entity);// reset the values
					$scope.entity.updateModel = false;

					if (updateModeInitValues.entity.ContractTypeFk !== undefined) {
						if (updateModeInitValues.entity.ContractTypeFk <= 0) {
							salesBidCreateBidDialogService.resetToDefault($scope.entity, updateModeInitValues);
						}
					}
					let salesBidNumberGenerateSetting = $injector.get('salesBidNumberGenerationSettingsService');
					let codeReadonly = salesBidNumberGenerateSetting.hasToGenerateForRubricCategory($scope.entity.RubricCategoryFk);
					platformRuntimeDataService.readonly($scope.entity, [{field: 'Code', readonly: codeReadonly}]);
					$scope.entity.Code = salesBidNumberGenerateSetting.provideNumberDefaultText($scope.entity.RubricCategoryFk, $scope.entity.Code);

					// reset the init auto-generated readonly status
					// platformRuntimeDataService.readonly($scope.entity, [{
					// field: 'Code',
					// readonly: updateModeInitValues.codeIsAutoGenerated
					// }]);

					setCodeFieldToLookup(false);
					setUpdateFieldsReadOnly(false);

					// choose based on project change line items
					$scope.entity.ProjectChangeLineItems = false;
					$scope.entity.DeleteOriginalBidBoq = false;
					$scope.entity.UpdateFpBoqUnitRate = false;
					$scope.entity.ProjectChangeGenerateMode = 2;

					$scope.$broadcast('form-config-updated');
				}

				function setCodeFieldToLookup(fieldIsLookup) {

					// set the code to lookup type in update mode
					let codeFieldInCreateFormat = updateModeInitValues.getCodeField();

					if (fieldIsLookup === true) {
						angular.extend(codeFieldInCreateFormat, estimateMainBidCreationService.bidCodeLookupField());
					}

					if (codeFieldIndex !== null) {
						$scope.formOptionsBasicSettings.configure.rows[codeFieldIndex] = codeFieldInCreateFormat;
					}

				}

				function resetCodeErrors() {
					$scope.entity.__rt$data = $scope.entity.__rt$data || {};
					$scope.entity.__rt$data.errors = $scope.entity.__rt$data.errors || {};
					$scope.entity.__rt$data.errors.Code = null; // reset the error
					$scope.formOptionsBasicSettings.salesBidCodeAvailable = '1'; // next button is click-able
				}

				function reValidateCode(newCode) {
					if (updateModeInitValues.canUpdate === false) {
						return true;
					}

					resetCodeErrors();
					let codeField = $scope.formOptionsBasicSettings.configure.rows[codeFieldIndex];
					if (_.isFunction(codeField.validator)) {
						codeField.validator($scope.entity, newCode, 'Code', isSelectedUpdateMode);
					}
					if ($scope.formOptionsBasicSettings.salesBidCreateUpdateWizardUpdateOrCreate === '1' && _.isFunction(codeField.asyncValidator)) {
						codeField.asyncValidator($scope.entity, newCode); // check the code unique
					}
				}

				function setUpdateFieldsReadOnly(isReadOnly) {
					if (isReadOnly !== true) {
						isReadOnly = false;
					}
					let fields = [
						// 'RubricCategoryFk',
						'Description',
						'ResponsibleCompanyFk',
						'ClerkFk',
						'ContractTypeFk',
						'ProjectFk'
					];
					let readOnlyFields = fields.map(function (key) {
						return {field: key, readonly: isReadOnly};
					});
					platformRuntimeDataService.readonly($scope.entity, readOnlyFields);
				}

				function retrieveBackBidInfo(code) {
					let rsCode = '';
					let existedBidHeader = estimateMainBidCreationService.getBidHeaderFromLookup(code);
					if (!_.isEmpty(existedBidHeader)) { // update
						$scope.entity.Description = existedBidHeader.DescriptionInfo.Translated;
						$scope.entity.RubricCategoryFk = existedBidHeader.RubricCategoryFk;
						$scope.entity.ResponsibleCompanyFk = existedBidHeader.CompanyResponsibleFk;
						$scope.entity.ProjectFk = existedBidHeader.ProjectFk;
						$scope.entity.ClerkFk = existedBidHeader.ClerkFk;
						$scope.entity.ContractTypeFk = existedBidHeader.ContractTypeFk;

						$scope.entity.BusinesspartnerFk = existedBidHeader.BusinesspartnerFk;
						$scope.entity.SubsidiaryFk = existedBidHeader.SubsidiaryFk;
						$scope.entity.CustomerFk = existedBidHeader.CustomerFk;
						$scope.entity.BidHeaderFk = existedBidHeader.BidHeaderFk;
						$scope.entity.BidId = existedBidHeader.Id;
						$scope.entity.PrcStructureFk = existedBidHeader.PrcStructureFk;

						rsCode = existedBidHeader.Code;
					}
					return rsCode;
				}

				let currentMode = '1';

				$scope.chooseUpdateOrCreate = function ($value) {
					if(
						($value === '1' && !$scope.entity.updateModel)
						|| ($value === '2' && $scope.entity.updateModel)
					){
						return false;
					}
					if (updateModeInitValues.canUpdate === false) {
						return false;
					}
					reValidateCode($scope.entity.Code);
					switch ($value) {
						case '1': // create
							setCreateMode();
							break;
						case '2': // update
							setUpdateMode();
							break;
					}
					if (currentMode !== $value) {
						// reset to the default assignment
						$scope.entity.StructureType = 1;
						clearAllUrpAssignments(true);
						currentMode = $value;
					}

					// console.log($scope.formOptionsBasicSettings.configure.rows);

				};

				initializeValuesBeforeUpdate();

				$scope.$watch('entity.Code', function (code) {

					// only do the watching for UPDATE MODE
					if (updateModeInitValues.canUpdate === false || !isUpdateMode()) {
						return false;
					}

					retrieveBackBidInfo(code);

					// clean pre settings
					clearAllUrpAssignments(true);
				});

				$scope.$watch('entity.EstimateScope', function (){
					setupSurchargeGrid(false, true);
				});

				// TODO: refactoring (if we can create a common code for this)
				$scope.$watch('entity.TypeFk', function (newTypeId) {
					if(!newTypeId) {return;}

					$injector.get('salesBidTypeLookupDataService').getItemByIdAsync(newTypeId).then(function (typeEntity) {
						// if type has changed we have to update validation on field
						var prjChange = _.find(formConfigBasicSettings.rows, { model: 'PrjChangeFk' });
						var mainBid = _.find(formConfigBasicSettings.rows, { model: 'BidHeaderFk' });
						if (typeEntity.IsMain) {
							prjChange.required = false;
							mainBid.required = false;
							mainBid.visible = false;
						} else if (typeEntity.IsSide) {
							prjChange.required = false;
							mainBid.required = true;
							mainBid.visible = true;
						} else {
							// prjChange.required = true;
							mainBid.required = true;
							mainBid.visible = true;
						}

						salesBidCreateBidDialogService.onMainBidChanged($scope.entity,  typeEntity.IsMain ? null :$scope.entity.SelectMainBidEntity);
						if($scope.entity.DefaultTypeFk === newTypeId && !$scope.entity.updateModel) {
							$scope.entity.BusinesspartnerFk = $scope.entity.DefaultBusinesspartnerFk;
							$scope.entity.SubsidiaryFk = $scope.entity.DefaultSubsidiaryFk;
							$scope.entity.CustomerFk = $scope.entity.DefaultCustomerFk;
						}

						$scope.$broadcast('form-config-updated');
					});
				});

				// contract type value is assigned in async action, after the action, should refresh form
				$scope.$watch('entity.ContractTypeFk', function (newTypeId) {
					$scope.$broadcast('form-config-updated');
				});

				// endregion

				function reloadUppDetail() {
					processItem(true);
				}

				function onSelectOptionItemChanged(actionByManually) {
					if(!actionByManually && $scope.entity.updateModel){
						return estimateMainBidCreationService.getBidCreatingConfig($scope.entity.BidId).then(function (data){
							if(data) {
								$scope.entity.MajorLineItems = data.MajorLineItems;
								// $scope.entity.ProjectChangeLineItems = data.ProjectChangeLineItems;
								$scope.entity.CalculateHours = data.CalculateHours;
								$scope.entity.CopyLineItemRete = data.CopyLineItemRete;
								$scope.entity.estimateScope = data.estimateScope;
								$scope.entity.EstUppUsingURP = data.EstUppUsingURP;
								// $scope.entity.DeleteOriginalBidBoq = data.DeleteOriginalBidBoq;
								$scope.entity.UpdateFpBoqUnitRate = data.UpdateFpBoqUnitRate;

								if((!$scope.entity.PriceColumns || $scope.entity.PriceColumns.length <= 0) && data.PriceColumns && data.PriceColumns.length > 0){
									let dynamicColumns = $injector.get('basicsCommonUserDefinedColumnConfigService').getDynamicColumnConfig();

									$scope.entity.PriceColumns = [];
									_.forEach(dynamicColumns, function (item){
										let priceItem = _.find(data.PriceColumns, {Id: item.Id});
										if(priceItem){$scope.entity.PriceColumns.push({
											Id: item.Id,
											Description: item.DescriptionInfo.Translated || item.DescriptionInfo.Description,
											checked: priceItem && priceItem.checked
										});}
									});
								}else{
									_.forEach($scope.entity.PriceColumns, function (item){
										let matched = _.find(data.PriceColumns, {Id: item.Id});
										if(matched){
											item.checked = matched.checked;
										}
									});
								}
							}else{
								$scope.entity.MajorLineItems = true;
								// $scope.entity.ProjectChangeLineItems = false;
								$scope.entity.CalculateHours = false;
								$scope.entity.CopyLineItemRete = true;
								$scope.entity.estimateScope = 0;
								// $scope.entity.DeleteOriginalBidBoq = false;
								_.forEach($scope.entity.PriceColumns, function (item){
									item.checked = false;
								});
							}
						});
					}
					let profile = estimeMainCraeteBidOptionProfileService.getSelectedItem();
					if(profile) {
						$scope.UpdateOptions.optionProfile =estimeMainCraeteBidOptionProfileService.getDescription(profile);
						let propertyconfig = profile.PropertyConfig;
						if (propertyconfig) {
							let optionItem = JSON.parse(propertyconfig);
							doOptionSetting($scope,optionItem);
						}
						else{
							doOptionSetting($scope,null);
						}
					}
				}
				function doOptionSetting(scope,optionItem, ignoreValidation){
					let isChangeStructureType = false;
					if(scope.formOptionsBasicSettings.salesBidCreateUpdateWizardUpdateOrCreate === '1'){
						let structureType = $injector.get('estimateWizardStructureTypeLookupService').getList();
						if(optionItem && structureType.length && _.find(structureType,{Id:optionItem.StructureType})){
							isChangeStructureType = scope.entity.StructureType !== optionItem.StructureType;
							scope.entity.StructureType = optionItem.StructureType;
						}else {
							isChangeStructureType = optionItem ? scope.entity.StructureType !== optionItem.StructureType : scope.entity.StructureType !== 1;
							scope.entity.StructureType = 1;
						}
					}
					let isChangeMajorLineItems = optionItem ? scope.entity.MajorLineItems !== optionItem.MajorLineItems : !scope.entity.MajorLineItems;
					scope.entity.MajorLineItems = optionItem ? optionItem.MajorLineItems : true;

					scope.entity.CopyLineItemRete = optionItem ? optionItem.CopyLineItemRete : true;

					let isChangeEstUppUsingURP = optionItem ? scope.entity.EstUppUsingURP !== optionItem.EstUppUsingURP : scope.entity.EstUppUsingURP;
					scope.entity.EstUppUsingURP = optionItem ? optionItem.EstUppUsingURP : false;

					let isChangeCalculateHours = optionItem ? scope.entity.CalculateHours !== optionItem.CalculateHours : scope.entity.CalculateHours;
					scope.entity.CalculateHours = optionItem ? optionItem.CalculateHours : false;

					if(scope.formOptionsBasicSettings.salesBidCreateUpdateWizardUpdateOrCreate !== '1' && scope.entity.StructureType === 16){
						scope.entity.DeleteOriginalBidBoq = optionItem ? optionItem.DeleteOriginalBidBoq : false;
					}else {
						scope.entity.DeleteOriginalBidBoq = false;
					}

					$scope.entity.UpdateFpBoqUnitRate= optionItem ? optionItem.UpdateFpBoqUnitRate : false;

					$scope.sameBoq2MultiLineItemWithDifferentChange.show = $scope.entity.StructureType === 1;

					$scope.entity.estimateScope = optionItem ? (optionItem.EstimateScope ||  0) : 0;

					if(optionItem && optionItem.PriceColumns.length){
						angular.forEach(scope.entity.PriceColumns,function (item) {
							let data = _.find(optionItem.PriceColumns,{Description:item.Description});
							if(data){
								item.checked = data.checked;
							}
						});
					}else {
						angular.forEach(scope.entity.PriceColumns,function (item) {
							item.checked = false;
						});
					}

					updateUpdateOptions(scope);

					if(ignoreValidation){
						return;
					}

					if(isChangeStructureType || isChangeMajorLineItems || isChangeEstUppUsingURP || isChangeCalculateHours){
						validateAnyLineItemAssignment().then(function (valid) {
							if (isChangeStructureType){
								afterDoOptionSetting(scope.entity,'StructureType', valid);
							}

							if (isChangeMajorLineItems){
								afterDoOptionSetting(scope.entity,'MajorLineItems');
							}

							if (isChangeEstUppUsingURP){
								afterDoOptionSetting(scope.entity,'EstUppUsingURP');
							}

							if (isChangeCalculateHours){
								afterDoOptionSetting(scope.entity,'CalculateHours');
							}
						});
					}
				}

				function afterDoOptionSetting(item, model, valid) {
					if (model === 'StructureType') {
						// initSelectEstimateScope($scope.entity).then(function(result){
						if (initSelectEstimateScope($scope.entity)) {
							$scope.entity.estimateScope = 0;
						}

						setEstimateScopeVisible(!initSelectEstimateScope($scope.entity));

						// set estimateScope readonly
						// estimateMainBidCreationProcess.setReadOnly($scope.entity, 'estimateScope', result.data);

						if (valid) {
							clearAllUrpAssignments(true);
							if ($scope.entity.StructureType === 1) {
								initBoqLookupData();
							} else if ($scope.entity.StructureType === 2) {
								initActivityLookupData();
							} else {
								loadSuccessFlag = true;
							}
						}

						// });

					} else if (model === 'estimateScope') {
						updateSurchargeGrid(true,true);
					} else if (model === 'ProjectChangeLineItems' || model === 'MajorLineItems') {

						loadSuccessFlag = true;
						updateSurchargeGrid(true,true);
					} else if (model === 'EstUppUsingURP') {
						if (item.EstUppUsingURP) {
							if (item.StructureURPAssignments && item.StructureURPAssignments.length > 0) {
								item.StructureURPAssignments[0].EstUppUsingURP = item.EstUppUsingURP;
							}
							if (!usingURP && isUpdateMode() && bidHeaderId && angular.isNumber(bidHeaderId)) {
								usingURP = true;
								loadSettings(bidHeaderId, true);
							}
						} else {
							// should clear all the urpAssignments
							clearAllUrpAssignments();
							$scope.entity.EstUppUsingURP = false;
							usingURP = false;
						}
					} else if (model === 'CalculateHours') {
						if (item.CalculateHours) {
							if (item.StructureURPAssignments && item.StructureURPAssignments.length > 0) {
								item.StructureURPAssignments[0].CalculateHours = item.CalculateHours;
							}
						} else {
							$scope.entity.CalculateHours = false;
						}
					}
				}

				function updateUpdateOptions(scope) {
					scope.UpdateOptions.StructureType = scope.entity.StructureType;
					scope.UpdateOptions.MajorLineItems = scope.entity.MajorLineItems;
					scope.UpdateOptions.CopyLineItemRete = scope.entity.CopyLineItemRete;
					scope.UpdateOptions.PriceColumns = scope.entity.PriceColumns;
					scope.UpdateOptions.EstUppUsingURP = scope.entity.EstUppUsingURP;
					scope.UpdateOptions.CalculateHours = scope.entity.CalculateHours;
					scope.UpdateOptions.DeleteOriginalBidBoq = scope.entity.DeleteOriginalBidBoq;
					scope.UpdateOptions.EstimateScope = scope.entity.estimateScope;
					scope.UpdateOptions.UpdateFpBoqUnitRate = scope.entity.UpdateFpBoqUnitRate;
				}

				estimeMainCraeteBidOptionProfileService.selectItemChanged.register(onSelectOptionItemChanged);

				$scope.UpdateOptions = {
					StructureType: 1,
					MajorLineItems : true,
					CopyLineItemRete: true,
					PriceColumns: [],
					EstUppUsingURP: false,
					CalculateHours: false,
					DeleteOriginalBidBoq: false,
					UpdateFpBoqUnitRate: false,
					EstimateScope: 0
				};

				$scope.serviceoptions1 = {
					service: $injector.get('estimeMainCraeteBidOptionProfileService')
				};

				estimateMainUpp2CostcodeDetailDataService.onItemModified.register(reloadUppDetail);

				let init = function () {
					loadTranslations();
					let projectFk = estimateMainService.getSelectedProjectId();
					salesBidCreateBidDialogService.setBasicSettingsByProject(projectFk, $scope.entity);
					// filter the boq structure by project
					salesCommonBaseBoqLookupService.setCurrentProject(projectFk);

					schedulingLookupScheduleTypeDataService.getLookupData({
						lookupType: 'schedulingLookupScheduleTypeDataService',
						disableDataCaching: false
					}).then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('ScheduleType', response);
						getIsExecutionScheduleType();
					});

					salesCommonBaseBoqLookupService.setStyleEnableAndEstHeader(estimateMainService.getSelectedEstHeaderId());
				};
				init();

			}]);
})();
