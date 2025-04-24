(function (angular) {
	'use strict';

	const moduleName = 'timekeeping.period';
	angular.module(moduleName).service('timekeepingPeriodSidebarWizardService', TimekeepingPeriodSidebarWizardService);

	TimekeepingPeriodSidebarWizardService.$inject = ['_','moment', '$http', 'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService',
		'basicsLookupdataSimpleLookupService', 'timekeepingPeriodDataService', '$translate', 'platformTranslateService', 'platformModalFormConfigService',
		'globals', 'timekeepingPeriodConstantValues', 'platformDialogService','platformModalService','timekeepingPeriodTransactionDataService'];

	function TimekeepingPeriodSidebarWizardService(_, moment, $http, platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService, basicsLookupdataSimpleLookupService, timekeepingPeriodDataService, $translate, platformTranslateService, platformModalFormConfigService, globals, timekeepingPeriodConstantValues, platformDialogService,platformModalService,timekeepingPeriodTransactionDataService) {
		let createPeriodStatusChanger = function createPeriodStatusChanger() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: timekeepingPeriodDataService,
					statusField: 'PeriodStatusFk',
					codeField: 'Code',
					descField: 'Description',
					statusDisplayField: 'Description',
					projectField: '',
					title: 'basics.customize.timekeepingperiodstatus',
					statusName: 'timekeepingperiodstatus',
					statusProvider: function () {
						return basicsLookupdataSimpleLookupService.getList({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.timekeepingperiodstatus'
						});
					},
					updateUrl: 'timekeeping/period/changestatus',
					id: 1
				}
			);
		};
		this.setPeriodStatus = createPeriodStatusChanger().fn;

		this.createPeriodTransactions = function createPeriodTransactions(options) {
			let isSettlementCreate= options.IsSettlementCreate ? options.IsSettlementCreate.toLowerCase() === 'true' : false;
			let selected = timekeepingPeriodDataService.getSelected();
			let selectedEntities = timekeepingPeriodDataService.getSelectedEntities();
			if(selectedEntities !== null && selectedEntities.length > 1) {
				platformDialogService.showInfoBox('timekeeping.period.selectOnlyOnePeriod');
			}else{
			if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'timekeeping.period.createTransactions')) {

				// Data ConsolidationLevel, PostingDate should be determined in a dialog
				let dataItem = {
					PKeys: [selected.Id],
					ConsolidationLevel: 1,
					FromDate:selected.StartDate ? selected.StartDate : moment(),
					ToDate:selected.EndDate ? selected.EndDate : moment(),
					PostingDate: selected.PostingDate ? selected.PostingDate : moment()
				};
				platformTranslateService.translateObject(timekeepingPeriodConstantValues.consolidationLevelValues, ['description']);
				// Config
				let startTransactionConfig = {
					title: $translate.instant('timekeeping.period.createTransactions'),
					dataItem: dataItem,
					formConfiguration: {
						fid: 'timekeeping.period.createTransaction',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['consilidationLevel', 'postingDate']
							}
						],
						rows: [{
							gid: 'baseGroup',
							rid: 'consolidationLevel',
							label$tr$: 'timekeeping.period.consolidation',
							type: 'select',
							readonly:true,
							options: {
								displayMember: 'description',
								valueMember: 'Id',
								items: timekeepingPeriodConstantValues.consolidationLevelValues
							},
							model: 'ConsolidationLevel',
							sortOrder: 1
						},
							{
								gid: 'baseGroup',
								rid: 'fromDate',
								label$tr$: 'timekeeping.period.fromDate',
								type: 'dateutc',
								model: 'FromDate',
								sortOrder: 2,
								validator: function validate(entity, value){
									if(_.isNil(value)){
										platformDialogService.showInfoBox('timekeeping.period.errorfromDateValidationMsg');
									}
								}
							},
							{
								gid: 'baseGroup',
								rid: 'toDate',
								label$tr$: 'timekeeping.period.toDate',
								type: 'dateutc',
								model: 'ToDate',
								sortOrder: 3,
								validator: function validate(entity, value){
									if(_.isNil(value)){
										platformDialogService.showInfoBox('timekeeping.period.errortoDateValidationMsg');
									}
								}
							},
							{
								gid: 'baseGroup',
								rid: 'postingDate',
								label$tr$: 'timekeeping.common.postingDate',
								type: 'dateutc',
								model: 'PostingDate',
								sortOrder: 4,
								validator: function validate(entity, value){
									if(_.isNil(value)){
										platformDialogService.showInfoBox('timekeeping.period.errorValidationMsg');
									}
								}
							}
						]
					},
					// Logic in OK Button


					handleOK: function handleOK(result) {
						let data = {
							PKeys: [selected.Id],
							ConsolidationLevel: result.data.ConsolidationLevel,
							PostingDate: result.data.PostingDate,
							FromDate:result.data.FromDate,
							ToDate:result.data.ToDate,
							IsSettlementCreate: isSettlementCreate
						};
						$http.post(globals.webApiBaseUrl + 'timekeeping/period/transaction/createforperiods', data
						).then(function () {
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('timekeeping.period.createTransactions');
						});
					},
					// Option for cancel button
					dialogOptions: {
						disableOkButton: function () {
							return dataItem.PostingDate === null;
						}}
				};
				// call function for Form startup and execution
				platformTranslateService.translateFormConfig(startTransactionConfig.formConfiguration);
				platformModalFormConfigService.showDialog(startTransactionConfig);
			}}
		};

		this.generateTimeSheetRecords = function generateTimeSheetRecords(options) {
			let dataI = {PeriodIds: _.map(timekeepingPeriodDataService.getSelectedEntities(), 'Id'), OverwriteExistingEntries: options && options.OverwriteExistingEntries ? options.OverwriteExistingEntries.toLowerCase() === 'true' : false};
			$http.post(globals.webApiBaseUrl + 'timekeeping/period/generatetimesheetrecords', dataI).then(function (response) {
				if (response && response.data.newEntities) {
					let newRecordings = response.data.newEntities.newRecordings.length;
					let newSheets = response.data.newEntities.newSheets.length;
					let newReports = response.data.newEntities.newReports.length;
					let message = response.data.message;
					if (newRecordings > 0 || newSheets > 0 || newReports > 0) {

						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText: 'Generate time sheet records',
							bodyText: `${message}! new Recordings :"${newRecordings}" ;
							new Sheets:"${newSheets}";
							new Reports:"${newReports}" were generated successfully.`,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					} else {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText: 'Generate time sheet records',
							bodyText: `${message}! No new records generated!`,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				} else {
					let modalOptions;
					modalOptions = {
						showGrouping: true,
						headerText: 'Generate time sheet records',
						bodyText: response.data.message,
						iconClass: 'ico-error'
					};
					platformModalService.showDialog(modalOptions);
				}
			});
		};

		this.lockIsSuccess = function lockIsSuccess() {
			let listTransaction = timekeepingPeriodTransactionDataService.getSelectedEntities();
			let modalOptions = {
				showGrouping: true,
				headerText: $translate.instant('timekeeping.period.locktransaction'),
				bodyText: $translate.instant('timekeeping.period.selectrecord'),
				iconClass: 'ico-info'
			};
			if (!listTransaction || listTransaction.length === 0) {

				platformModalService.showDialog(modalOptions);
				timekeepingPeriodTransactionDataService.load();
			}
			$http.post(globals.webApiBaseUrl + 'timekeeping/period/lockissuccess', listTransaction)
				.then(function(response) {
					if (response.data !== undefined && response.data !== null) {
						modalOptions.bodyText = $translate.instant('timekeeping.period.transactionlocksuccess');
					}
					platformModalService.showDialog(modalOptions);
					timekeepingPeriodTransactionDataService.load();
				})
				.catch(function(error) {
					console.error('Error occurred during HTTP request:', error);
				});
			return timekeepingPeriodTransactionDataService.load();
		};

		this.unlockIsSuccess = function unlockIsSuccess() {
			let listTransaction = timekeepingPeriodTransactionDataService.getSelectedEntities();
			if (listTransaction.length > 0 && listTransaction !== null && listTransaction !== undefined) {
				let CreateNewRecord = false; // Default value
				let dialogBodyText = $translate.instant('timekeeping.period.transactionalreadyunlocked');
				let modalOptions = {
					showGrouping: true,
					headerText: $translate.instant('timekeeping.period.transactionunlocked'),
					bodyText: dialogBodyText,
					iconClass: 'ico-info'
				};

				let dataItem = { CreateNewRecord: true };
				let transactionConfig = {
					title: $translate.instant('timekeeping.period.timekeepingperiodunlockrecord'),
					dataItem: dataItem,
					formConfiguration: {
						fid: 'timekeeping.period.timekeepingperiodunlockrecord',
						version: '1.0.0',
						showGrouping: false,
						groups: [{ gid: 'baseGroup', attributes: ['CreateNewRecord'] }],
						rows: [{
							gid: 'baseGroup',
							rid: 'CreateNewRecord',
							label$tr$: 'timekeeping.period.createnewrecordalso',
							type: 'boolean',
							visible: true,
							model: 'CreateNewRecord',
							sortOrder: 1
						}]
					},
					handleOK: function handleOK(result) {
						CreateNewRecord = result.data.CreateNewRecord;
						// To update CreateNewRecord property in each item of listTransaction
						listTransaction.forEach(e => {e.CreateNewRecord = CreateNewRecord;});
						function handleHttpRequest(url, data, successMessage) {
							return $http.post(globals.webApiBaseUrl + url, data)
								.then(function(response) {
									if (response.data !== undefined && response.data !== null) {
										modalOptions.bodyText = successMessage;
									}
									platformModalService.showDialog(modalOptions);
									timekeepingPeriodTransactionDataService.load();
								})
								.catch(function(error) {
									console.error('Error occurred during HTTP request:', error);
								});
						}
						// Unlock transaction records
						handleHttpRequest('timekeeping/period/unlockissuccess', listTransaction, $translate.instant('timekeeping.period.transactionunlocksuccess'));
					},
					dialogOptions: {} // Option for cancel button
				};

				// Call function for Form startup and execution
				platformTranslateService.translateFormConfig(transactionConfig.formConfiguration);
				platformModalFormConfigService.showDialog(transactionConfig);

			}
			else{
				let modalOptions = {
					showGrouping: true,
					headerText: $translate.instant('timekeeping.period.unlocktransaction'),
					bodyText: $translate.instant('timekeeping.period.selectrecord'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};
	}
})(angular);
