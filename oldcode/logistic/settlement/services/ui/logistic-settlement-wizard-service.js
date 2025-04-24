(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'logistic.settlement';
	angular.module(moduleName).service('logisticSettlementSidebarWizardService', LogisticSettlementSidebarWizardService);

	LogisticSettlementSidebarWizardService.$inject = ['_','logisticSettlementDataService','logisticSettlementItemDataService',
		'basicsCommonChangeStatusService', 'basicsLookupdataConfigGenerator', '$http', '$translate', 'platformSidebarWizardCommonTasksService',
		'platformTranslateService', 'platformModalFormConfigService', 'servicesSchedulerUIFrequencyValues', 'moment', 'platformModalService',
		'platformCreateUuid', 'basicsLookupdataSimpleLookupService', 'platformRuntimeDataService', 'logisticSettlementTransactionDataService','platformWizardDialogService', 'logisticSettlementClaimDataService', 'basicsLookupdataLookupFilterService', 'resourceCommonContextService', '$q'];

	function LogisticSettlementSidebarWizardService(_,logisticSettlementDataService, logisticSettlementItemDataService,
		basicsCommonChangeStatusService, basicsLookupdataConfigGenerator, $http, $translate, platformSidebarWizardCommonTasksService,
		platformTranslateService, platformModalFormConfigService, servicesSchedulerUIFrequencyValues, moment,platformModalService,
		platformCreateUuid, basicsLookupdataSimpleLookupService, platformRuntimeDataService, logisticSettlementTransactionDataService,platformWizardDialogService, logisticSettlementClaimDataService, basicsLookupdataLookupFilterService, resourceCommonContextService, $q) {

		let self = this;
		this.defaultValueSaving = {};
		self.workOperationFks =[];

		var setSettlementStatus = function setSettlementStatus() {

			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: logisticSettlementDataService,
					statusField: 'SettlementStatusFk',
					codeField: 'Code',
					descField: 'Description',
					statusDisplayField: 'Description',
					projectField: '',
					title: 'basics.customize.logisticssettlementstatus',
					statusName: 'logisticsettlementstatus',
					statusProvider: function () {
						var currentItem = logisticSettlementDataService.getSelected();
						return basicsLookupdataSimpleLookupService.getList({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.logisticssettlementstatus',
							filter: {
								customBoolProperty: 'ISREVISION',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								field: 'RubricCategoryFk'
							}
						}).then(function (respond) {
							var filtered = _.filter(respond, function (item) {
								return item.RubricCategoryFk === currentItem.RubricCategoryFk;
							});

							return filtered;
						});
					},
					updateUrl: 'logistic/settlement/changestatus',
					id: 1
				}
			);
		};
		this.setSettlementStatus = setSettlementStatus().fn;

		let claimStatusConfig = {
			refreshMainService: false,
			mainService: logisticSettlementDataService,
			dataService: logisticSettlementClaimDataService,
			statusField: 'ClaimStatusFk',
			descField: 'Description',
			projectField: '',
			title: 'basics.customize.logisticsclaimstatus',
			statusName: 'logisticssettlementclaimstatus',
			updateUrl: 'logistic/settlement/settlementclaim/logisticsclaimstatus',
			id: 2
		};

		let changeSettlementClaimStatus = function changeSettlementClaimStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(claimStatusConfig);
		};
		this.changeSettlementClaimStatus = changeSettlementClaimStatus().fn;

		function getRowsForDialogConfigForBatch(showDivision) {
			var rows = [];
			if(showDivision) {
				rows.push(basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.equipmentdivision', '',
					{
						gid: 'baseGroup',
						rid: 'division',
						label: 'Plant Division',
						label$tr$: 'basics.customize.equipmentdivision',
						type: 'integer',
						model: 'divisionFk',
						sortOrder: 1,
						required: true
					}, false)
				);
			}
			rows.push({
				gid: 'baseGroup',
				rid: 'dueDate',
				label: 'Due Date',
				label$tr$: 'logistic.settlement.batchDueDate',
				type: 'dateutc',
				model: 'dueDate',
				required: true,
				sortOrder: 2
			});
			rows.push({
				gid: 'baseGroup',
				rid: 'isTestRun',
				label: 'Test Run',
				label$tr$: 'logistic.settlement.batchTestRun',
				type: 'boolean',
				model: 'isTestRun',
				sortOrder: 3
			});
			rows.push({
				gid: 'baseGroup',
				rid: 'comment',
				label: 'comment',
				label$tr$: 'cloud.common.entityComment',
				type: 'integer',
				model: 'typeFk',
				sortOrder: 6
			});
			rows.push({
				gid: 'baseGroup',
				rid: 'PerformendByLoginCompany',
				label: 'Performend By Login Company',
				label$tr$: 'logistic.settlement.performendByLoginCompany',
				type: 'boolean',
				model: 'isPerformendByLoginCompany',
				sortOrder: 4
			});
			rows.push({
				gid: 'baseGroup',
				rid: 'isFilteringByReceivingProject',
				label: 'For Receiving Project',
				label$tr$: 'logistic.settlement.byReceivingProject',
				type: 'boolean',
				validator: function (item, value) {
					let fields = [];
					if(value){
						fields.push({field: 'projectFk', readonly: false});
					}
					else{
						fields.push({field: 'projectFk', readonly: true});
						item.projectFk = null;
					}
					platformRuntimeDataService.readonly(item, fields);
				},
				model: 'isFilteringByReceivingProject',
				sortOrder: 4
			});
			rows.push({
				gid: 'baseGroup',
				rid: 'project',
				label$tr$: 'cloud.common.entityProject',
				type: 'directive',
				directive: 'basics-lookup-data-project-project-dialog',
				options: {
					showClearButton: true
				},
				model: 'projectFk',
				sortOrder: 5,
			});
			return rows;
		}

		function setDialogConfigForBatch (showDivision, dataItem){
			return {
				title: $translate.instant('logistic.settlement.settlementBatchTitle'),
				dataItem: dataItem,
				dialogOptions: {
					disableOkButton: function () {
						if (dataItem){
							if(_.isNull(dataItem.dueDate)) {
								return true;
							}
							if(dataItem.divisionFk){
								return false;
							}
						}
						return showDivision;
					}
				},
				formConfiguration: {
					fid: 'logistic.settlement.settlementBatch',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: getRowsForDialogConfigForBatch(showDivision)
				}
			};
		}

		function addSchedulerConfig(configuration){
			platformTranslateService.translateObject(servicesSchedulerUIFrequencyValues, ['description']);
			configuration.rows.push({
				gid: 'baseGroup',
				rid: 'repeatUnit',
				label: 'Repeat Unit',
				label$tr$: 'services.schedulerui.columns.repeatunit',
				type: 'select',
				model: 'jobRepeatUnit',
				options: {
					displayMember: 'description',
					valueMember: 'Id',
					items: 'servicesSchedulerUIFrequencyValues'
				},
				sortOrder: 6
			});
			configuration.rows.push({
				gid: 'baseGroup',
				rid: 'repeatCount',
				label: 'Repeat Count',
				label$tr$: 'services.schedulerui.columns.repeatcount',
				type: 'integer',
				model: 'jobRepeatCount',
				sortOrder: 7
			});
			configuration.rows.push({
				gid: 'baseGroup',
				rid: 'startTime',
				label: 'Start Time',
				label$tr$: 'services.schedulerui.columns.starttime',
				type: 'datetime',
				model: 'startTime',
				sortOrder: 8
			});

		}

		function save(customModalOptions) {
			var link;

			link = angular.element(document.querySelector('#downloadLink'));

			var arr = [];
			arr.push(customModalOptions.bodyText.replace(/<br\/>/g, '\n\r'));
			var blob = new Blob(arr);
			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, customModalOptions.download);
			}
			else {
				link[0].href = URL.createObjectURL(blob);
				link[0].download = customModalOptions.download;
				link[0].target = '_blank';
				link[0].click();//call click function
			}
		}

		this.startSettlementBatch = function startSettlementBatch() {
			var dataItem = {
				divisionFk: null,
				dueDate: null,
				projectFk: null,
				isFilteringByReceivingProject: false,
				isPerformendByLoginCompany: false,
				isTestRun: true,
				comment: ''
			};
			platformRuntimeDataService.readonly(dataItem, [{field: 'projectFk', readonly: true}]);

			var modalCreateConfig = setDialogConfigForBatch(false, dataItem);
			if(self.defaultValueSaving.lastSettlementBatchDate) {
				dataItem.dueDate = self.defaultValueSaving.lastSettlementBatchDate;
			}
			modalCreateConfig.handleOK = function handleOK(result) {
				self.defaultValueSaving.lastSettlementBatchDate = result.data.dueDate;
				var data = {
					Division: -1,
					To: result.data.dueDate ? result.data.dueDate.utc() : null,
					IsTestRun: result.data.isTestRun,
					Comment: result.data.comment,
					ProjectFk: result.data.isFilteringByReceivingProject ? result.data.projectFk : null,
					IsPerformendByLoginCompany: result.data.isPerformendByLoginCompany
				};

				if(data.IsTestRun){
					$http.get(globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/checkclaimexist').then(function (response) {
						if (response && response.data) {
							// Error MessageText
							var modalOptions = {
								headerText: $translate.instant('logistic.settlement.settlementBatchTitle'),
								bodyText: $translate.instant('logistic.settlement.noTestRunWhenClaimExist'),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						} else {
							executeSettlementBatch(data, modalCreateConfig);
						}
					});
				}
				else{
					executeSettlementBatch(data, modalCreateConfig);
				}
			};

			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalCreateConfig);
		};

		function executeSettlementBatch(data, modalCreateConfig){
			$http.post(globals.webApiBaseUrl + 'logistic/settlement/batch/execute', data
			).then(function (response) {
				if(response && response.data){
					var modalOptions = {
						headerTextKey: 'logistic.settlement.settlementBatchTitle',
						bodyTextKey: response.data,
						download: 'ImportProtocol-' + platformCreateUuid() + '.txt',
						showOkButton: true,
						showCancelButton: true,
						resizeable: true,
						height: '500px',
						// bodyTemplateUrl: globals.appBaseUrl + 'scheduling.main/templates/importlogmessages.html',
						customButtons: [{
							id: 'saveAs',
							caption: $translate.instant('cloud.desktop.filterdefSaveSaveBnt'),
							autoClose: false,
							// cssClass: 'app-icons ico-test',
							fn: function (button, event, closeFn) {
								save(modalOptions);
								closeFn();
							}
						}]
					};

					platformModalService.showDialog(modalOptions);

				} else {
					logisticSettlementDataService.load();
					platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
				}
			});
		}

		this.createJobForSettlementBatch = function createJobForSettlementBatch() {
			var dataItem = {
				divisionFk: null,
				dueDate: null,
				projectFk: null,
				isFilteringByReceivingProject: false,
				isTestRun: false,
				comment: ''
			};
			platformRuntimeDataService.readonly(dataItem, [{field: 'projectFk', readonly: true}]);

			var modalCreateConfig = setDialogConfigForBatch(true, dataItem);
			modalCreateConfig.title = $translate.instant('logistic.settlement.settlementCreateJobForBatchTitle');
			angular.extend(modalCreateConfig.dataItem, dataItem, {
				jobRepeatCount: null,
				jobRepeatUnit: null,
				startTime: moment()
			});

			addSchedulerConfig(modalCreateConfig.formConfiguration);

			modalCreateConfig.handleOK = function handleOK(result) {
				var data = {
					Division: result.data.divisionFk,
					To: result.data.dueDate ? result.data.dueDate.utc() : null,
					IsTestRun: result.data.isTestRun,
					Comment: result.data.comment,
					JobRepeatCount: result.data.jobRepeatCount,
					JobRepeatUnit: result.data.jobRepeatUnit,
					StartDate: result.data.startTime.utc()
				};
				$http.post(globals.webApiBaseUrl + 'logistic/settlement/batch/createjobtoexecute', data
				).then(function () {
					platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
				});
			};
			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalCreateConfig);

		};

		this.startSettlementTransaction = function startSettlementTransaction() {
			let selectedEntities = logisticSettlementDataService.getSelectedEntities();
			let selected = logisticSettlementDataService.getSelected();
			let validatePostingDataData = {
				PostingDate: selected.PostingDate,
				SettlementId: selected.Id
			};
			$http.post(globals.webApiBaseUrl + 'logistic/settlement/validatepostingdate', validatePostingDataData).then(function (response){
				if(response && response.data && response.data.IsValid){
					if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'logistic.settlement.startSettlementTransactionTitle')) {
						let data = {
							PKeys: _.map(selectedEntities,'Id')
						};
						$http.post(globals.webApiBaseUrl + 'logistic/settlement/settlementtransaction/prepareforallsettlements', data
						).then(function () {
							logisticSettlementTransactionDataService.load();
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('logistic.settlement.startSettlementTransactionTitle');
						});
					}
				}
				else {
					platformModalService.showMsgBox('logistic.settlement.inValidPostingDate', 'logistic.settlement.startSettlementTransactionTitle', 'ico-error');
				}
			});
		};

		this.createJobForSettlementTransaction = function createJobForSettlementTransaction() {
			var selectedEntities = logisticSettlementDataService.getSelectedEntities();
			var selected = logisticSettlementDataService.getSelected();
			if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'logistic.settlement.startSettlementTransactionTitle')) {
				var modalCreateConfig = {
					title: $translate.instant('logistic.settlement.settlementTransactionTitle'),
					formConfiguration: {
						fid: 'logistic.settlement.settlementTransaction',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: []
					}
				};
				addSchedulerConfig(modalCreateConfig.formConfiguration);
				modalCreateConfig.dataItem = {
					jobRepeatCount: null,
					jobRepeatUnit: null,
					startTime: moment()
				};


				modalCreateConfig.handleOK = function handleOK(result) {
					var data = {
						// Context: platformContextService.getContext(),
						PKeysAsString: _.map(selectedEntities,'SettlementNo'),
						JobRepeatCount: result.data.jobRepeatCount,
						JobRepeatUnit: result.data.jobRepeatUnit,
						StartDate: result.data.startTime.utc()
					};
					$http.post(globals.webApiBaseUrl + 'logistic/settlement/settlementtransaction/createjobfortask', data
					).then(function () {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
					});
				};
				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				platformModalFormConfigService.showDialog(modalCreateConfig);
			}
		};

		this.changeTaxCodeOfSellectedSettlements = function changeTaxCodeOfSellectedSettlements() {
			var selectedEntities = logisticSettlementDataService.getSelectedEntities();
			var selected = logisticSettlementDataService.getSelected();
			if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'logistic.settlement.startSettlementTransactionTitle')) {
				var modalCreateConfig = {
					title: $translate.instant('logistic.settlement.changeTaxCodeWizardTitle'),
					formConfiguration: {
						fid: 'logistic.settlement.settlementTaxCodeWizard',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: [basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.taxcode.taxcode', '',
							{
								gid: 'baseGroup',
								rid: 'taxcode',
								label: 'Tax Code',
								label$tr$: 'basics.customize.taxcode',
								type: 'lookup',
								model: 'taxCodeFk',
								sortOrder: 1,
								required: true
							}, false)
						]
					}
				};

				modalCreateConfig.dataItem = {
					taxCodeFk: null
				};

				modalCreateConfig.handleOK = function handleOK(result) {
					var data = {
						// Context: platformContextService.getContext(),
						PKeys: _.flatMap(selectedEntities,'Id'),
						TaxCodeFk: result.data.taxCodeFk,
						SelectedId: selected.Id,
						Wizard: 1
					};
					$http.post(globals.webApiBaseUrl + 'logistic/settlement/executewizard', data
					).then(function () {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
					});
				};
				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				platformModalFormConfigService.showDialog(modalCreateConfig);
			}
		};


		/* Create claim wizard part begins */
		let filters = [
			{
				key: 'filter-claimreasonfk-by-settlementitemtype-value',
				fn: function(e,r){
					return _.includes(r.claimReasonOptions, e.Id);
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		this.createSettlementClaims = function createSettlementClaims(){

			var title = $translate.instant('logistic.settlement.createSettlementClaimTitle');

			if (!logisticSettlementItemDataService.getSelected()){
				// Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant('logistic.settlement.noSettlementItemSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			else{
				var settlementItemId = logisticSettlementItemDataService.getSelected().Id;
				let data = {
					Id : settlementItemId
				};

				$http.get(globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/cancreate?parentId=' + settlementItemId).then(function (response){
					if (response && response.data){
						$http.post(globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/getdefaultclaim', data).then(function (response) {
							let claimData = [];
							if (response && response.data) {
								claimData = {
									claimReasonFk: null,
									comment: '',
									previousSettlementExist: response.data.PreviousSettlementExist,
									settlementNo: response.data.SettlementNumber,
									settlementItemNo: response.data.SettlementItemNumber,
									settlementItemTypeFk: response.data.SettlementItemTypeFk,
									dispatchHeaderFk: response.data.DispatchHeaderFk,
									dispHeaderCode: response.data.DispHeaderCode,
									dispatchRecordFk: response.data.DispatchRecordFk,
									dispRecordCode: response.data.DispRecordCode,
									jobClaimFk: response.data.JobClaimFk,
									workOperationTypeFk: response.data.WorkOperationTypeFk,
									isHire: response.data.IsHire,
									effectiveDate: moment(response.data.ExpectedEffectiveDate),
									expectedQuantity: response.data.ExpectedQuantity,
									expectedWorkOperationTypeFk: null,
									expectedIsHire: null,
									expectedUomFk: response.data.ExpectedUomFk,
									plantTypeFk: response.data.PlantTypeFk,
									isBulkPlant: response.data.IsBulkPlant,
									claimReasonOptions: response.data.ClaimReasonOptions
								};

								if(claimData.plantTypeFk){
									asyncGetAvailableWOTFksFromPlants(claimData.plantTypeFk).then(function (wotFks) {
										self.workOperationFks = wotFks;
									});
								}

								let wizardConfig = {
									id: 'createSettlementClaims',
									title: title,
									steps: [
										{
											id: 'createSettlementClaims1',
											title: title,
											form: {
												fid: 'logistic.settlement.settlementclaim',
												version: '1.0.0',
												showGrouping: false,
												groups: [
													{
														gid: 'baseGroup',
														isOpen: true,
														visible: true,
														sortOrder: 1
													}],
												rows: [
													basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.logisticsclaimreason', '',
														{
															gid: 'baseGroup',
															rid: 'claimReasonFk',
															label: 'claimReasonFk',
															label$tr$: 'logistic.settlement.claimReasonFk',
															type: 'integer',
															model: 'claimReasonFk',
															required: true,
															sortOrder: 2
														}, false,{
															filterKey: 'filter-claimreasonfk-by-settlementitemtype-value'
														}),
													{
														gid: 'baseGroup',
														rid: 'comment',
														label: 'comment',
														label$tr$: 'cloud.common.entityComment',
														type: 'comment',
														model: 'comment',
														required: true,
														sortOrder: 3
													},
													{
														gid: 'baseGroup',
														rid: 'previousSettlementExist',
														label: 'previousSettlementExist',
														label$tr$: 'logistic.settlement.previousSettlementExist',
														type: 'boolean',
														model: 'previousSettlementExist',
														readonly: true,
														sortOrder: 4
													},
													{
														gid: 'baseGroup',
														rid: 'settlementNo',
														label: 'settlementNo',
														label$tr$: 'logistic.settlement.settlementNumber',
														type: 'code',
														model: 'settlementNo',
														readonly: true,
														sortOrder: 5
													},
													{
														gid: 'baseGroup',
														rid: 'settlementItemNo',
														label: 'settlementItemNo',
														label$tr$: 'logistic.settlement.settlementItemNumber',
														type: 'integer',
														model: 'settlementItemNo',
														readonly: true,
														sortOrder: 6
													},
													basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.logisticssettlementitemtype', '',
														{
															gid: 'baseGroup',
															rid: 'settlementItemTypeFk',
															label: 'settlementItemTypeFk',
															label$tr$: 'logistic.settlement.settlementItemTypeFk',
															type: 'type',
															model: 'settlementItemTypeFk',
															sortOrder: 7,
															readonly: true
														}),
													{
														gid: 'baseGroup',
														rid: 'dispatchHeaderFk',
														label: 'dispatchHeaderFk',
														label$tr$: 'logistic.dispatching.dispatchingHeader',
														type: 'integer',
														model: 'dispatchHeaderFk',
														readonly: true,
														sortOrder: 8
													},
													{
														gid: 'baseGroup',
														rid: 'dispHeaderCode',
														label: 'dispHeaderCode',
														label$tr$: 'logistic.settlement.dispHeaderCode',
														type: 'code',
														model: 'dispHeaderCode',
														readonly: true,
														sortOrder: 9
													},
													{
														gid: 'baseGroup',
														rid: 'dispatchRecordFk',
														label: 'dispatchRecordFk',
														label$tr$: 'logistic.dispatching.dispatchingRecord',
														type: 'integer',
														model: 'dispatchRecordFk',
														readonly: true,
														sortOrder: 10
													},
													{
														gid: 'baseGroup',
														rid: 'dispRecordCode',
														label: 'dispRecordCode',
														label$tr$: 'logistic.settlement.dispRecordCode',
														type: 'code',
														model: 'dispRecordCode',
														readonly: true,
														sortOrder: 11
													},
													{
														gid: 'baseGroup',
														rid: 'jobClaimFk',
														label: 'jobClaimFk',
														label$tr$: 'logistic.settlement.jobClaimFk',
														type: 'integer',
														model: 'jobClaimFk',
														readonly: true,
														sortOrder: 12
													},
													basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
														dataServiceName: 'resourceWorkOperationTypePlantTypeFilterLookupDataService',
														cacheEnable: true,
														additionalColumns: true,
														showClearButton: true,
														filter: function (){
															return claimData.plantTypeFk;
														}
													},{
														gid: 'baseGroup',
														rid: 'workOperationTypeFk',
														label: 'workOperationTypeFk',
														label$tr$: 'resource.wot.entityWorkOperationTypeFk',
														type: 'integer',
														model: 'workOperationTypeFk',
														required: false,
														readonly: true,
														sortOrder: 13
													}),
													{
														gid: 'baseGroup',
														rid: 'isHire',
														label: 'isHire',
														label$tr$: 'resource.wot.isHire',
														type: 'boolean',
														model: 'isHire',
														readonly: true,
														sortOrder: 14
													},
													{
														gid: 'baseGroup',
														rid: 'effectiveDate',
														label: 'effectiveDate',
														label$tr$: 'logistic.settlement.expectedEffectiveDate',
														type: 'dateutc',
														model: 'effectiveDate',
														readonly: true,
														sortOrder: 15
													},
													{
														gid: 'baseGroup',
														rid: 'expectedQuantity',
														label: 'expectedQuantity',
														label$tr$: 'logistic.settlement.expectedQuantity',
														type: 'decimal',
														model: 'expectedQuantity',
														readonly: true,
														sortOrder: 16
													},
													basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
														{
															dataServiceName: 'resourceWorkOperationTypePlantTypeFilterLookupDataService',
															showClearButton: true,
															filterKey: 'resource-wot-by-plant-type-filter'
														},
														{
															gid: 'baseGroup',
															rid: 'expectedWorkOperationTypeFk',
															model: 'expectedWorkOperationTypeFk',
															label$tr$: 'logistic.settlement.expectedWorkOperationTypeFk',
															label: 'expectedWorkOperationTypeFk',
															readonly: true,
															required: false,
															sortOrder: 17
														}),
													{
														gid: 'baseGroup',
														rid: 'expectedIsHire',
														label: 'expectedIsHire',
														label$tr$: 'logistic.settlement.expectedIsHire',
														type: 'boolean',
														model: 'expectedIsHire',
														readonly: true,
														sortOrder: 18
													},
													basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
														dataServiceName: 'basicsUnitLookupDataService',
														cacheEnable: true,
														additionalColumns: true,
														showClearButton: true
													}, {
														gid: 'baseGroup',
														rid: 'expectedUomFk',
														label: 'expectedUomFk',
														label$tr$: 'logistic.settlement.expectedUomFk',
														type: 'integer',
														model: 'expectedUomFk',
														required: false,
														readonly: true,
														sortOrder: 19
													}),
												]
											},
											canFinish: false,
											watches: [
												{
													expression: 'claimReasonFk',
													fn: updateRequiredInputFields
												},
												{
													expression: 'comment',
													fn: checkAllowFinish
												},
												{
													expression: 'expectedWorkOperationTypeFk',
													fn: updateWotIsHiredField
												},
											],
											prepareStep: updateRequiredInputFields
										}
									]
								};

								platformWizardDialogService.translateWizardConfig(wizardConfig);
								platformWizardDialogService.showDialog(wizardConfig, claimData).then(function (result) {
									if (result.success) {

										var data = {
											settlementItemId: settlementItemId,
											claimReasonId: result.data.claimReasonFk,
											comment: result.data.comment,
											effectiveDate: moment(result.data.effectiveDate),
											expectedQuantity: result.data.expectedQuantity,
											expectedWorkOperationTypeFk: result.data.expectedWorkOperationTypeFk,
											expectedUomFk: result.data.expectedUomFk,
											previousSettlementExist: result.data.previousSettlementExist
										};

										$http.post(globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/createsettlementclaim', data).then(function (result) {
											if (result.data.length > 0) {
												var modalOptions = {
													headerTextKey: 'logistic.settlement.createSettlementClaimTitle',
													bodyTextKey: result.data,
													showOkButton: true,
													showCancelButton: false,
													resizeable: true,
													height: '500px',
													iconClass: 'info'
												};

												platformModalService.showDialog(modalOptions);

											} else {
												platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
											}
										});
									}
								});
							}
						});
					}
					else{
						// Error MessageText
						var modalOptions = {
							headerText: $translate.instant(title),
							bodyText: $translate.instant('logistic.settlement.settlementNotTestRun'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				});
			}
		};

		function checkAllowFinish(info) {

			var createClaims = _.find(info.wizard.steps, {id: 'createSettlementClaims1'});

			var requiredRows = _.filter(info.wizard.steps[0].form.rows, { required: true});

			createClaims.canFinish = _.every(requiredRows,function(row){
				return !!info.model[row.model];
			});

			info.scope.$broadcast('form-config-updated');
		}

		function updateRequiredInputFields(info){

			if (info.newValue !== info.oldValue) {

				var settlementItemId = logisticSettlementItemDataService.getSelected().Id;
				let data = {
					Id : settlementItemId,
					PKey1: info.newValue
				};

				let rowsToChange = _.filter(info.wizard.steps[0].form.rows, function (row){
					return row.rid === 'effectiveDate' ||
						row.rid === 'expectedQuantity' ||
						row.rid === 'expectedWorkOperationTypeFk' ||
						row.rid === 'expectedUomFk';
				});

				_.map(rowsToChange, function (row){
					row.required = false;
					row.readonly = true;
				});

				$http.post(globals.webApiBaseUrl + 'logistic/settlement/settlementclaim/getdefaultclaim', data).then(function (response) {
					if (response && response.data) {
						info.model.effectiveDate = moment(response.data.ExpectedEffectiveDate);
						info.model.expectedQuantity = response.data.ExpectedQuantity;
						info.model.expectedWorkOperationTypeFk = null;
						info.model.expectedIsHire = null;
						info.model.expectedUomFk = response.data.ExpectedUomFk;
					}
				});

				data = {
					Id : info.newValue
				};
				$http.post(globals.webApiBaseUrl + 'basics/customize/logisticsclaimreason/instance', data).then(function (result){

					if (result && result.data) {

						let rowsRequire = [];
						let claimReason = result.data;

						if (claimReason.DateRequested) {
							rowsRequire.push(_.find(rowsToChange, function (row) {
								return row.rid === 'effectiveDate';
							}));
						}
						if (claimReason.QuantityRequested) {
							rowsRequire.push(_.find(rowsToChange, function (row) {
								return row.rid === 'expectedQuantity';
							}));
						}
						if (claimReason.WotRequested) {
							rowsRequire.push(_.find(rowsToChange, function (row) {
								return row.rid === 'expectedWorkOperationTypeFk';
							}));
						}
						if (claimReason.UomRequested) {
							rowsRequire.push(_.find(rowsToChange, function (row) {
								return row.rid === 'expectedUomFk';
							}));
						}

						_.map(rowsRequire, function (row) {
							row.required = true;
							row.readonly = false;
						});
					}

					info.scope.$broadcast('form-config-updated');

					return info;

				}).then(checkAllowFinish);

			}



		}

		function updateWotIsHiredField(info){

			info.model.expectedIsHire = false;

			if (!_.isNull(info.newValue) && info.newValue !== info.oldValue) {
				let data = {
					Id: info.newValue
				};
				$http.post(globals.webApiBaseUrl + 'resource/wot/workoperationtype/instance', data).then(function (result) {

					if (result && result.data) {

						info.model.expectedIsHire = result.data.IsHire;

						info.scope.$broadcast('form-config-updated');
					}

					return info;

				}).then(checkAllowFinish);
			}
		}
		/* Create claim wizard part ends */

		/* Correction methods wizard part begins */
		this.correctDispatchRecord = function correctDispatchRecord(){
			let selectedSettlementClaim = logisticSettlementClaimDataService.getSelected();
			if(selectedSettlementClaim.ClaimMethodFk !== 2 && selectedSettlementClaim.ClaimMethodFk !== 3
			 && selectedSettlementClaim.ClaimMethodFk !== 4 && selectedSettlementClaim.ClaimMethodFk !== 9){
				showWizardErrorMessage('', false);
				return;
			}
			if(selectedSettlementClaim.PlantTypeFk){
				asyncGetAvailableWOTFksFromPlants(selectedSettlementClaim.PlantTypeFk).then(function (wotFks) {
					self.workOperationFks = wotFks;
				});
			}
			if(!selectedSettlementClaim){
				showMessage('', false);
				return;
			}

			let correctionMethodsData = {
				claimId : selectedSettlementClaim.Id,
				projectCode : selectedSettlementClaim.ProjectNo,
				receivingJobCode : selectedSettlementClaim.JobCode,
				dispHeaderCode : selectedSettlementClaim.DispHeaderCode,
				dispRecordCode: selectedSettlementClaim.DispRecordArticleCode,
				dispRecordNo : selectedSettlementClaim.DispatchRecordNo,
				dispHeaderFk : selectedSettlementClaim.DispatchHeaderFk,
				dispRecordFk: selectedSettlementClaim.DispatchRecordFk,
				expectedRecordNo : selectedSettlementClaim.DispatchRecordNo,
				expectedDate : selectedSettlementClaim.ExpectedEffectiveDate,
				expectedWotFk: selectedSettlementClaim.ExpectedWorkOperationTypeFk,
				expectedQuantity: selectedSettlementClaim.ExpectedQuantity,
				expectedUomFk: selectedSettlementClaim.ExpectedUomFk
			};

			let title = $translate.instant('logistic.settlement.correctDispatchRecordTitle');
			let modalCreateClaimConfig = {
				title: title,
				steps : [
					{
						id: 'selection',
						title$tr$: title,
						form: {
							fid: 'logistic.settlement.selection',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'baseGroup',
								attributes: ['selection']
							}],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'projectCode',
									label: 'projectCode',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.projectCode',
									type: 'code',
									model: 'projectCode',
									readonly: true,
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'receivingJobCode',
									label: 'receivingJobCode',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.receivingJobCode',
									type: 'code',
									model: 'receivingJobCode',
									readonly: true,
									sortOrder: 2
								},
								{
									gid: 'baseGroup',
									rid: 'dispHeaderCode',
									label: 'dispHeaderCode',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.dispHeaderCode',
									type: 'code',
									model: 'dispHeaderCode',
									readonly: true,
									sortOrder: 3
								},
								{
									gid: 'baseGroup',
									rid: 'dispRecordCode',
									label: 'dispRecordCode',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.dispRecordCode',
									type: 'code',
									model: 'dispRecordCode',
									readonly: true,
									sortOrder: 4
								},
								{
									gid: 'baseGroup',
									rid: 'dispRecordNo',
									label: 'dispRecordNo',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.dispRecordNo',
									type: 'integer',
									model: 'dispRecordNo',
									readonly: true,
									sortOrder: 5
								},
								{
									gid: 'baseGroup',
									rid: 'expectedRecordNo',
									label: 'expectedRecordNo',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.expectedRecordNo',
									type: 'integer',
									model: 'expectedRecordNo',
									readonly: true,
									required: true,
									sortOrder: 6
								},
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
									{
										dataServiceName: 'resourceWorkOperationTypePlantTypeFilterLookupDataService',
										showClearButton: true,
										filterKey: 'resource-wot-by-plant-type-filter'
									},
									{
										gid: 'baseGroup',
										rid: 'expectedWotFk',
										model: 'expectedWotFk',
										label$tr$: 'logistic.settlement.correctionMethodsWizard.expectedWotFk',
										label: 'Work Operation Type',
										readonly: true,
										required: true,
										sortOrder: 7
									}),
								{
									gid: 'baseGroup',
									rid: 'expectedQuantity',
									label: 'expectedQuantity',
									label$tr$: 'logistic.settlement.expectedQuantity',
									type: 'integer',
									model: 'expectedQuantity',
									readonly: true,
									required: true,
									sortOrder: 8
								},
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'basicsUnitLookupDataService',
										showClearButton: true
									},
									{
										gid: 'baseGroup',
										rid: 'expectedUomFk',
										label: 'Uom',
										label$tr$: 'resource.reservation.entityUomFk',
										type: 'integer',
										model: 'expectedUomFk',
										readonly: true,
										required: true,
										sortOrder: 9
									}),
								{
									gid: 'baseGroup',
									rid: 'expectedDate',
									label: 'expectedDate',
									label$tr$: 'logistic.settlement.correctionMethodsWizard.expectedDate',
									type: 'dateutc',
									model: 'expectedDate',
									readonly: true,
									required: true,
									sortOrder: 10
								}]
						},
						disallowBack: true,
						disallowNext: true,
						canFinish: true,
						watches:
							[]
					},

				]};
			let correctMethodFK = selectedSettlementClaim.ClaimMethodFk;
			setFieldVisibilityForCorrectMethod(modalCreateClaimConfig, correctMethodFK);
			platformWizardDialogService.translateWizardConfig(modalCreateClaimConfig);
			platformWizardDialogService.showDialog(modalCreateClaimConfig, correctionMethodsData).then(function (result) {
				if (result.success) {
					const updateData = {
						ClaimID : result.data.claimId,
						ExpectedDate : result.data.expectedDate,
						ExpectedRecordNo : result.data.expectedRecordNo,
						ExpectedQuantity : result.data.expectedQuantity,
						ExpectedWotFk : result.data.expectedWotFk,
						ExpectedUomFk : result.data.expectedUomFk,
						MatchedCorrectMethodId : correctMethodFK,
						DispatchHeaderFk : result.data.dispHeaderFk,
						DispatchRecordFk : result.data.dispRecordFk
					};

					$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/updaredispatchrecordwizard', updateData).then(function (result) {
						if (result.data) {
							let modalOptions = {
								headerTextKey: 'logistic.settlement.correctDispatchRecordTitle',
								bodyTextKey: result.data,
								showOkButton: true,
								showCancelButton: true,
								resizeable: true,
								height: '500px',
								iconClass: 'info'
							};

							platformModalService.showDialog(modalOptions);

						}
						else {
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateClaimConfig.title);
						}
					});
				}
			});
		};

		let asyncGetAvailableWOTFksFromPlants = function asyncGetAvailableWOTFksFromPlants(plantTypeFk) {
			let promises = [
				resourceCommonContextService.init(),
				$http.get(globals.webApiBaseUrl +'resource/wot/workoperationtype/listbyplanttype?plantTypeFk=' + plantTypeFk)
			];
			return $q.all(promises).then(function (response) {
				let wots = response[1].data;
				let context = response[0];
				return _.map(_.filter(wots, w => w.EquipmentContextFk === context.EquipmentContextFk), w => w.Id);
			});
		};

		let wizardLookupFilter = [
			{
				key: 'resource-wot-by-plant-type-filter',
				fn: function (lookupItem) {
					return _.some(self.workOperationFks, wotFk => wotFk === lookupItem.Id);
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(wizardLookupFilter);


		function setFieldVisibilityForCorrectMethod(wizardConfig, correctionMethodId) {
			for (let i = 5; i < 10; i++) {
				wizardConfig.steps[0].form.rows[i].visible = false;
			}
			switch (correctionMethodId) {
				case 2:
					wizardConfig.steps[0].form.rows[9].visible = true;
					break;
				case 3:
					wizardConfig.steps[0].form.rows[6].visible = true;
					break;
				case 4:
					wizardConfig.steps[0].form.rows[7].visible = true;
					break;
				case 6:
					wizardConfig.steps[0].form.rows[8].visible = true;
					wizardConfig.steps[0].form.rows[7].visible = true;
					break;
				default:
					// TODO
					break;
			}
		}

		function showMessage(claim, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'logistic.settlement.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!claim) {
				headerTextKey = 'logistic.settlement.creationErrorNoClaimSelectedTitle';
				bodyTextKey = 'logistic.settlement.correctionMethodsWizard.creationErrorNoClaimSelected';
			} else {
				headerTextKey = 'logistic.settlement.creationErrorNoClaimSelectedTitle';
				bodyTextKey = 'logistic.settlement.correctionMethodsWizard.creationError';
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}


		this.revertAllocationFromDispatchRecord = function revertAllocationFromDispatchRecord(){
			let selectedSettlementClaim= logisticSettlementClaimDataService.getSelected();
			if(selectedSettlementClaim.ClaimMethodFk !== 1 && selectedSettlementClaim.ClaimMethodFk !== 9){
				showWizardErrorMessage('', false);
				return;
			}
			const payload = {
				DispatchRecordId: selectedSettlementClaim.DispatchRecordFk,
				SettlementClaimId: selectedSettlementClaim.Id,
				IsHire: selectedSettlementClaim.IsHire,
				IsMinorEquipment: selectedSettlementClaim.IsMinorEquipmentHire,
				SettlementItemTypeFk: selectedSettlementClaim.SettlementItemTypeFk
			};

			if (selectedSettlementClaim.SettlementItemTypeFk === 3 || (selectedSettlementClaim.SettlementItemTypeFk === 4 && !selectedSettlementClaim.IsHire && (!selectedSettlementClaim.IsMinorEquipmentHire || selectedSettlementClaim.IsMinorEquipmentHire))) {

				if(selectedSettlementClaim.PreviousSettlementExist){
					validate('', false);
					return;
				}
			}

			if(selectedSettlementClaim){
				{
					$http.post(globals.webApiBaseUrl + 'logistic/job/plantallocation/revertallocationfromrecord', payload).then(function () {
						let modalOptions = {
							headerTextKey: 'logistic.settlement.revertAllocationFromDispatchRecordTitle',
							bodyTextKey: 'logistic.settlement.success',
							showOkButton: true,
							showCancelButton: true,
							resizeable: true,
							height: '500px',
							iconClass: 'info'
						};
						platformModalService.showDialog(modalOptions);
					});
				}
			}
			else {
				platformModalService.showMsgBox(
					$translate.instant('logistic.settlement.correctionMethodsWizard.creationErrorNoClaimSelected'),
					$translate.instant('logistic.settlement.revertAllocationFromDispatchRecordTitle'),
					'error');
			}
		};


		function validate(settlementItemType, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'logistic.settlement.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!settlementItemType) {
				headerTextKey = 'logistic.settlement.revertAllocationFromDispatchRecordTitle';
				bodyTextKey = 'logistic.settlement.existSettlement';
			} else {
				//TODO:
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}

		function showWizardErrorMessage(selectedClaim, result){
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (!selectedClaim) {
				headerTextKey = 'logistic.settlement.revertAllocationFromDispatchRecordTitle';
				bodyTextKey = 'logistic.settlement.correctionMethodsWizard.missCorrectionMethodWizard';
			} else {
				//TODO:
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}

		function showMessage(claimCheckDispRecStat, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'logistic.settlement.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!claimCheckDispRecStat) {
				headerTextKey = 'logistic.settlement.revertAllocationFromDispatchRecordTitle';
				bodyTextKey = 'logistic.settlement.missDataInDispatchRec';
			} else {
				//TODO:
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}
		/* Correction methods wizard part ends */
	}
})(angular);
