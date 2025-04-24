(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'logistic.dispatching';
	angular.module(moduleName).service('logisticDispatchingSidebarWizardService', LogisticDispatchingSidebarWizardService);

	LogisticDispatchingSidebarWizardService.$inject = [
		'$q', '_', 'logisticDispatchingHeaderDataService', 'basicsCommonChangeStatusService', 'logisticDispatchingRecordDataService',
		'basicsLookupdataSimpleLookupService', '$translate', '$http', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'platformSidebarWizardCommonTasksService', 'platformTranslateService', 'platformModalFormConfigService', 'platformModalService',
		'$injector', 'documentProjectDocumentsStatusChangeService', 'logisticDispatchingConstantValues'];

	function LogisticDispatchingSidebarWizardService(
		$q, _, logisticDispatchingHeaderDataService, basicsCommonChangeStatusService, logisticDispatchingRecordDataService,
		basicsLookupdataSimpleLookupService, $translate, $http, platformLayoutHelperService, basicsLookupdataConfigGenerator,
		platformSidebarWizardCommonTasksService, platformTranslateService, platformModalFormConfigService, platformModalService,
		$injector, documentProjectDocumentsStatusChangeService, logisticDispatchingConstantValues) {
		let hasStock = r => r.StockReceivingFk || r.StockLocationReceivingFk || r.PrjStockFk;
		let isMaterial = r => r.RecordTypeFk === logisticDispatchingConstantValues.record.type.material;
		let isPickedOrCanceledStatus = (r, isPickedOrCanceledStatusIds) => isPickedOrCanceledStatusIds.includes(r.DispatchRecordStatusFk);
		let isMaterialWithStockCanceledOrPickedAndTheRestAlways = (r, isPickedOrCanceledStatusIds) => !(isMaterial(r) && hasStock(r)) || isPickedOrCanceledStatus(r,isPickedOrCanceledStatusIds);
		var setDispatchHeaderStatus = function setDispatchHeaderStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: logisticDispatchingHeaderDataService,
					statusField: 'DispatchStatusFk',
					codeField: 'Code',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.dispatchstatus',
					statusDisplayField: 'Description',
					statusName: 'logisticdispatchheaderstatus',
					statusProvider: function () {
						var currentDispatchItem = logisticDispatchingHeaderDataService.getSelected();
						return basicsLookupdataSimpleLookupService.getList({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.dispatchstatus',
							filter: {
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								field: 'RubricCategoryFk'
							}
						}).then(function (respond) {
							return _.filter(respond, function (item) {
								return item.RubricCategoryFk === currentDispatchItem.RubricCategoryFk && item.isLive === true;
							});
						});
					},
					filterStatuses: function filterStatuses(options, statuses) {
						let reqs = [];
						reqs.push($http.post(globals.webApiBaseUrl + 'basics/customize/dispatchrecordstatus/list'));
						reqs.push($http.post(globals.webApiBaseUrl + 'basics/customize/dispatchstatus/list'));
						reqs.push(...(_.map(options.entities, e => $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/listbyparent',{PKey1 : e.Id, PKey2: e.CompanyFk}))));
						return $q.all(reqs).then(function (response) {
							let isPickedOrCanceledStatusIds = _.map(_.filter(response[0].data, s => s.IsPicked || s.IsCanceled), s => s.Id);
							let isStockPostedStatusIds = _.map(_.filter(response[1].data, s => s.IsStockPosted), s => s.Id);
							let dispatchRecords = _.flatten(_.map(_.slice(response, 2), 'data')); //_.map(_.initial(response), r => r.data);
							let isTransitionToSockPostedAllowed = _.every(dispatchRecords, r => isMaterialWithStockCanceledOrPickedAndTheRestAlways(r, isPickedOrCanceledStatusIds));
							return _.filter(statuses, s => !isStockPostedStatusIds.includes(s) || isTransitionToSockPostedAllowed); //remove the more complexe unallowed StockPosted transitions
						});
					},
					updateUrl: 'logistic/dispatching/header/changestatus',
					pKey1Field: 'CompanyFk',
					id: 1
				}
			);
		};
		let dipRecordStatusConfig = {
			refreshMainService: false,
			mainService: logisticDispatchingHeaderDataService,
			dataService: logisticDispatchingRecordDataService,
			statusField: 'DispatchRecordStatusFk',
			codeField: 'RecordNo',
			descField: 'Description',
			projectField: '',
			title: 'basics.customize.dispatchrecordstatus',
			statusName: 'logisticdispatchrecordstatus',
			updateUrl: 'logistic/dispatching/record/changestatus',
			pKey1Field: 'CompanyFk',
			pKey2Field: 'DispatchHeaderFk',
			id: 2
		};

		this.setDispatchHeaderStatus = setDispatchHeaderStatus().fn;
		var setDispatchRecordStatus = function setDispatchRecordStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(dipRecordStatusConfig);
		};
		this.setDispatchRecordStatus = setDispatchRecordStatus().fn;

		function changeStatusForProjectDocument() {
			return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(logisticDispatchingHeaderDataService, 'logistic.dispatching');
		}

		this.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;
		var clearProject = function clearProject() {
			var hasSelection = false;
			if (logisticDispatchingHeaderDataService.hasSelection()) {
				hasSelection = true;
			}
			var data = {
				useSelection: hasSelection,
				jobInFk: null,
				jobOutFk: null,
				stockFk: null,
				stockLocationFk: null
			};

			function getProjectFromSelectedJob(id){
				let descriptor = $injector.get('basicsLookupdataLookupDescriptorService');
				let item = descriptor.getLookupItem('logisticJob', id);
				if(item && item.ProjectFk){
					return item.ProjectFk;
				}
				return null;
			}

			function getJobRow(model, label, label$tr$, sortOrder, required) {
				var jobRow = platformLayoutHelperService.provideJobLookupOverload().detail;
				angular.extend(jobRow, {
					sortOrder: sortOrder,
					required: required,
					gid: 'baseGroup',
					rid: model,
					label: label,
					label$tr$: label$tr$,
					model: model
				});
				return jobRow;
			}

			var modalCreateConfig = {
				title: $translate.instant('logistic.job.clearProject'),
				dataItem: data,
				formConfiguration: {
					fid: 'logistic.job.clearProject',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: [{
						gid: 'baseGroup',
						rid: 'useSelection',
						label: 'Use selected Receiving Jobs as Performing Jobs',
						label$tr$: 'logistic.dispatching.useSelection',
						type: 'boolean',
						model: 'useSelection',
						sortOrder: 1,
						readonly: !hasSelection
					},
					getJobRow('jobInFk', 'Performing Job', 'logistic.dispatching.performingJob', 2, !hasSelection),
					getJobRow('jobOutFk', 'Receiving Job', 'logistic.dispatching.receivingJob', 3, true),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'projectStockLookupDataService',
						enableCache: true,
						filter: function (item) {
							let project = null;
							if (item.jobOutFk) {
								project = getProjectFromSelectedJob(item.jobOutFk);
							}
							let prj = {PKey1: null, PKey2: null, PKey3: null};
							if (_.isNil(project)) {
								prj.PKey3 = 0;
							} else {
								prj.PKey3 = project;
							}
							return prj;
						}
					}, {
						gid: 'baseGroup',
						rid: 'receivingStock',
						label: 'Stock Receiving',
						label$tr$: 'logistic.dispatching.stockReceivingFk',
						type: 'lookup',
						model: 'stockFk',
						sortOrder: 4
					}), {
						gid: 'baseGroup',
						rid: 'receivingStockLocation',
						label: 'Stock Location Receiving ',
						label$tr$: 'logistic.dispatching.stockLocationReceivingFk',
						model: 'stockLocationFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'project-stock-location-dialog-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true,
							lookupOptions: {
								additionalFilters: [{
									'projectFk': 'projectFk',
									projectFkReadOnly: true,
									getAdditionalEntity: function (item) {
										let prj = null;
										if (item.jobOutFk) {
											prj = getProjectFromSelectedJob(item.jobOutFk);
										}
										return {
											'projectFk': prj
										};
									}
								}, {
									'projectStockFk': 'stockFk',
									projectStockFkReadOnly: false,
									getAdditionalEntity: function (item) {
										return item;
									}
								}],
								showClearButton: true
							}
						},
						sortOrder: 5
					}

						/*					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'projectStockLocationLookupDataService',
						enableCache: true,
						filter: function (item) {
							var prj;
							if (item) {
								prj = item.stockFk;
							}
							return prj;
						}
					}, {
						gid: 'baseGroup',
						rid: 'receivingStockLocation',
						label: 'Stock Location Receiving ',
						label$tr$: 'logistic.dispatching.stockLocationReceivingFk',
						type: 'lookup',
						model: 'stockLocationFk',
						sortOrder: 5
					}) */]
				},
				handleOK: function handleOK(result) {
					var inJobIds = [result.data.jobInFk];
					if (result.data.useSelection) {
						inJobIds = _.uniq(_.map(logisticDispatchingHeaderDataService.getSelectedEntities(), 'Job2Fk'));
					}
					var data = {
						InJobIds: inJobIds,
						OutJobId: result.data.jobOutFk,
						StockId: result.data.stockFk,
						StockLocationId: result.data.stockLocationFk
					};
					$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/clearproject', data
					).then(function (response) {
						if (!response.data || response.data.length === 0) {
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
							logisticDispatchingHeaderDataService.load();
						} else {
							platformModalService.showMsgBox(response.data, modalCreateConfig.title, 'ico-info');
						}
					});
				}

			};
			modalCreateConfig.dialogOptions = {};
			modalCreateConfig.dialogOptions.disableOkButton = function () {
				return data.jobInFk === null && !data.useSelection || data.jobOutFk === null;
			};
			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalCreateConfig);
		};
		this.clearProject = clearProject;

		var generateTransportRecords = function generateTransportRecords(){
			var selectedHeaders = logisticDispatchingHeaderDataService.getSelectedEntities();
			var bodyText = '';
			var headerText = '';
			if(selectedHeaders !== null && selectedHeaders.length > 0){
				var performingJobs = _.uniq(_.map(selectedHeaders, 'Job1Fk'));
				if(performingJobs !== null && performingJobs.length > 1) {
					bodyText = $translate.instant('logistic.dispatching.samePerformingJobNeeded');
					headerText = $translate.instant('logistic.dispatching.createTransportRoute');
					platformModalService.showMsgBox(bodyText, headerText, 'warning');
				}
				else{
					var postData = {
						DispatchHeaders: selectedHeaders
					};
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/checkDispatchHeader', postData).then(function (response) {
						if (response && response.data.length > 0) {
							var headers = _.filter(selectedHeaders, function(h){
								return response.data.indexOf(h.Id) > -1;
							});
							var msg = '';
							_.forEach(headers, function(h){
								msg += h.Code + ', ';
							});
							msg = msg.slice(0, msg.lastIndexOf(','));
							bodyText = $translate.instant('logistic.dispatching.hasRouteForHeaders', {message: msg});
							headerText = $translate.instant('logistic.dispatching.createTransportRoute');
							platformModalService.showMsgBox(bodyText, headerText, 'warning');
						} else {
							var modalCreateConfig = {
								width: '1000px',
								resizeable: true,
								templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transport-create-dispatch-header-route-dialog.html',
								controller: 'transportplanningTransportCreateRouteDispatchHeaderController',
								resolve: {
									'$options': function () {
										return {
											DispatchHeaders: selectedHeaders
										};
									}
								}
							};
							platformModalService.showDialog(modalCreateConfig);
						}
					});
				}
			}
			else{
				bodyText = $translate.instant('logistic.dispatching.selectEntityNeeded');
				headerText = $translate.instant('logistic.dispatching.createTransportRoute');
				platformModalService.showMsgBox(bodyText, headerText, 'warning');
			}
		};
		this.generateTransportRecords = generateTransportRecords;

		let getComplete = function (dispHeader){
			return {
				MainItemId: dispHeader.Id,
				DispatchHeader: [dispHeader],
				RecordsToSave: []
			};
		};

		function setDialogConfigForBulkSetWot(dataItem) {
			return {
				title: $translate.instant('logistic.dispatching.bulkSetWotWizard.bulkSetWotWizardTitle'),
				dataItem: dataItem,
				formConfiguration: {
					fid: 'logistic.dispatching.bulkSetWotWizard',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'resourceWorkOperationTypePlantTypeFilterNewLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: true
						},
						{
							gid: 'baseGroup',
							rid: 'group',
							label: 'Work Operation Type',
							type: 'integer',
							model: 'wotFk',
							sortOrder: 1
						}),
					]
				}
			};
		}
		function showMessage(dispRecords, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = $translate.instant('logistic.dispatching.bulkSetWotWizard.creationSuccess');
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!dispRecords) {
				headerTextKey = $translate.instant('logistic.dispatching.bulkSetWotWizard.creationErrorNoDispatchingRecordSelected');
				bodyTextKey = $translate.instant('logistic.dispatching.bulkSetWotWizard.creationErrorNoDispatchingRecordSelected');
			} else {
				headerTextKey = $translate.instant('logistic.dispatching.bulkSetWotWizard.creationErrorNoDispatchingRecordSelected');
				bodyTextKey = $translate.instant('logistic.dispatching.bulkSetWotWizard.creationError');
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}

		this.bulkSetWot = function bulkSetWot(){

			let selectedDispRecords = logisticDispatchingRecordDataService.getSelectedEntities();
			if(selectedDispRecords.length === 0){
				showMessage('', false);
				return;
			}
			let dataItem = {
				dispRecords: logisticDispatchingRecordDataService.getSelectedEntities()
			};

			let modalCreateConfig = setDialogConfigForBulkSetWot(dataItem);
			modalCreateConfig.handleOK = function handleOK(result) {
				let data = {
					WorkOperationTypeFk: result.data.wotFk,
					DispatchRecords: result.data.dispRecords
				};
				$http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/bulksetwot', data
				).then(function (response) {
					if(response && response.data){
						let modalOptions = {
							headerTextKey: 'logistic.dispatching.bulkSetWotWizard.bulkSetWotWizardTitle',
							bodyTextKey: response.data,
							showOkButton: true,
							showCancelButton: true
						};

						platformModalService.showDialog(modalOptions);

					} else {
						logisticDispatchingRecordDataService.load();
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
					}
				});
			};

			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalCreateConfig);

		};
		this.recalculateDispatchNotes = function recalculateDispatchNotes() {
			let selectedDispatchNotes = logisticDispatchingHeaderDataService.getSelectedEntities();
			let dispatchNoteFks = selectedDispatchNotes.map(dN => dN.Id);
			if(_.some(dispatchNoteFks)){
				return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/recalcpricesfromwizard', dispatchNoteFks).then(function () {
					return logisticDispatchingHeaderDataService.refreshSelectedEntities().then(function () {
						platformModalService.showMsgBox(
							$translate.instant('logistic.dispatching.recalcDispatchNotes.success'),
							$translate.instant('logistic.dispatching.recalcDispatchNotes.title'),
							'warning');
					});
				});
			}
			else{
				platformModalService.showMsgBox(
					$translate.instant('logistic.dispatching.recalcDispatchNotes.noSelection'),
					$translate.instant('logistic.dispatching.recalcDispatchNotes.title'),
					'warning');
			}
		};
		this.ITwoPost = function ITwoPost(relAddress, arguments2server) {
			return $http.post(globals.webApiBaseUrl + relAddress, arguments2server).then(function (response) {
				return response.data;
			});
		};
		let self = this;
		this.getContracts = function getContracts(dispatchRecordFks){
			return self.ITwoPost('logistic/dispatching/record/getcontractfks', dispatchRecordFks).then(function (dip2contracts) {
				return self.ITwoPost('procurement/contract/header/listall', dip2contracts.map(dN2C => dN2C.ConHeaderFk)).then(function (conHeaders) {
					_.forEach(dip2contracts, function (dip2contract) {
						let conHeader = _.first(conHeaders, cH => cH.Id === dip2contract.ConHeaderFk);
						conHeader.DispatchRecordDateEffective = dip2contract.DateEffective;
						conHeader.DispatchRecordQuantity = dip2contract.Quantity;
						if(_.isNull(conHeader.ControllingUnitFk)){
							conHeader.DispatchHeaderPerformingControllingUnit = dip2contract.PerformingControllingUnitFk;
						}
					});
					return conHeaders;
				});
			});
		};
		this.createPES = function createPES() {
			let selectedDispatchNotes = logisticDispatchingHeaderDataService.getSelectedEntities();
			if(_.some(selectedDispatchNotes)){
				self.getContracts(selectedDispatchNotes.map(dN => dN.Id)).then(function (contracts) {
					if(contracts.length > 0) {
						let pesWizardService = $injector.get('procurementPesWizardHelpService');
						return pesWizardService.createBatch(contracts);
					} else {
						let msg = $translate.instant('logistic.dispatching.createPES.nocontractassignedinfo');
						let title = $translate.instant('logistic.dispatching.createPES.title');
						platformModalService.showMsgBox(msg, title, 'ico-info');
					}
				});
			}
			else{
				platformModalService.showMsgBox(
					$translate.instant('logistic.dispatching.recalcDispatchNotes.noSelection'),
					$translate.instant('logistic.dispatching.createPES.title'),
					'warning');
			}
		};

		this.revertAllocationFromDispatchRecord = function revertAllocationFromDispatchRecord(){
			let selectedDispatchNoteId = logisticDispatchingHeaderDataService.getSelected().Id;
			let selectedDispRecords = logisticDispatchingRecordDataService.getSelectedEntities();
			if(selectedDispatchNoteId){
				$http.get(globals.webApiBaseUrl + 'logistic/dispatching/header/checkdispheadersettled?dispHeaderId=' + selectedDispatchNoteId).then(function (response) {
					if (response && response.data) {
						// Error MessageText
						let modalOptions = {
							headerText: $translate.instant('logistic.dispatching.revertAllocationFromDispRecord'),
							bodyText: $translate.instant('logistic.dispatching.alreadySettled'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
					else if(selectedDispRecords.length === 0){
						let modalOptions = {
							headerText: $translate.instant('logistic.dispatching.revertAllocationFromDispRecord'),
							bodyText: $translate.instant('logistic.dispatching.noRecordSelected'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					} else if (!selectedDispRecords.every(item => item.RecordTypeFk === selectedDispRecords[0].RecordTypeFk)){
						showWizardErrorMessage('', false);
						return;
					}
					else {
						const payload = {
							DispatchHeaderId: selectedDispatchNoteId,
							DispatchRecordIds: selectedDispRecords ? _.map(selectedDispRecords, 'Id') : []
						};
						if(selectedDispRecords.length > 0){
							{
								$http.post(globals.webApiBaseUrl + 'logistic/job/plantallocation/revertallocationfromrecord', payload).then(function () {
									let modalOptions = {
										headerTextKey: 'logistic.dispatching.revertAllocationFromDispRecord',
										bodyTextKey: 'logistic.dispatching.success',
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
								$translate.instant('logistic.dispatching.noRecordSelected'),
								$translate.instant('logistic.dispatching.revertAllocationFromDispRecord'),
								'error');
						}
					}
				});
			}
		};

		function showWizardErrorMessage(selectedRecords, result){
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (!selectedRecords) {
				headerTextKey = 'logistic.dispatching.revertAllocationFromDispatchRecordTitle';
				bodyTextKey = 'logistic.dispatching.notSameRecordType';
			} else {
				//TODO:
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}

	}
})(angular);
