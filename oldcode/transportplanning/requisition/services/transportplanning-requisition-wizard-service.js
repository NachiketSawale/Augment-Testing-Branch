/**
 * Created by waz on 9/18/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningRequisitionWizardService', RequisiitonWizardService);
	RequisiitonWizardService.$inject = [
		'platformSidebarWizardConfigService', 'basicsCommonChangeStatusService',
		'transportplanningRequisitionMainService',
		'transportplanningRequisitionMatRequisitionDataService',
		'$injector',
		'transportplanningRequisitionContainerInformationService',
		'platformSidebarWizardCommonTasksService',
		'platformModalService',
		'$translate',
		'platformTranslateService',
		'platformModalFormConfigService',
		'$http',
		'basicsLookupdataLookupDescriptorService',
		'$q',
		'platformDataValidationService',
		'platformRuntimeDataService',
		'platformLayoutHelperService',
		'platformModuleNavigationService',
		'transportplanningRequisitionDataProcessor',
	   'productionplanningCommonLayoutHelperService',
	   'basicsCompanyNumberGenerationInfoService',
	   'ppsCommonCodGeneratorConstantValue',
		'platformValidationDataConcurrencyService'];

	function RequisiitonWizardService(platformSidebarWizardConfigService, basicsCommonChangeStatusService, mainService,
									  matRequisitionDataService,
									  $injector,
									  transportRequisitionContainerInformationService,
									  platformSidebarWizardCommonTasksService,
									  platformModalService,
									  $translate,
									  platformTranslateService,
									  platformModalFormConfigService,
									  $http,
									  basicsLookupdataLookupDescriptorService,
									  $q,
									  platformDataValidationService,
									  platformRuntimeDataService,
									  platformLayoutHelperService,
									  navigationService,
		                       requisitionDataProcessor,
		                       ppsCommonLayoutHelperService,
		                       basicsCompanyNumberGenerationInfoService,
									  ppsCommonCodGeneratorConstantValue,
									  platformValidationDataConcurrencyService) {

		var service = {};
		var wizardID = 'transportplanningRequisitionWizardService';

		var trsResReservation = 'b03a0abb4c284179924e5fc6d7d26bfa';

		function changeRequisitionStatus() {
			let countOfSelected = mainService.getSelectedEntities().length;
			let selectedWhenStarted = _.cloneDeep(mainService.getSelectedEntities());
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				id: 13,
				mainService: mainService,
				statusField: 'TrsReqStatusFk',
				title: 'transportplanning.requisition.wizard.changeRequisitionStatus',
				statusName: 'trsRequisition',
				updateUrl: 'transportplanning/requisition/wizard/changeRequisitionStatus',
				supportMultiChange: true,
				HookExtensionOperation: HookExtensionOperation,
				handleSuccess: (data) => {
					mainService.refreshEntities([data.entity], false).then(loaded => {
						if (selectedWhenStarted.length > 0) {
							countOfSelected--;
							if (countOfSelected === 0) {

								const dbChangesCheckService = new platformValidationDataConcurrencyService(
									mainService,
									null,
									'transportplanning/requisition/checkchanges',
									function (item) {
										selectedWhenStarted = selectedWhenStarted.filter(req => req.Id !== item.Id);
										dbChangesCheckService.setCheckOnlyItemsInList(true, selectedWhenStarted);
										if (selectedWhenStarted.length === 0) {
											dbChangesCheckService.deactivateDbChangesCheck();
										}
									}
								);
								dbChangesCheckService.setCheckForChildServices(false);
								dbChangesCheckService.setDoShowConcurrencyErrorDialog(false);
								dbChangesCheckService.setCheckOnlyItemsInList(true, selectedWhenStarted);
								dbChangesCheckService.setCheckInterval(1000); // request check every second

								dbChangesCheckService.activateDbChangesCheck();
								dbChangesCheckService.checkForChanges();
								let requisitionServiceData = mainService.getContainerData();
								if(requisitionServiceData?.searchFilter){
									requisitionServiceData.searchFilter = null;
								}
								setTimeout(() => {
									dbChangesCheckService.deactivateDbChangesCheck(); // deactivate after 2 min
								}, 2 * 60 * 1000);
							}
						}
					});
				}
			});
		}

		function HookExtensionOperation (options, dataItems) {
			var schemaOption = {typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition'};
			var translationSrv = $injector.get('transportplanningRequisitionTranslationService');
			return $injector.get('ppsCommonLoggingStatusChangeReasonsDialogService').showDialog(options, dataItems, schemaOption, translationSrv);
		}

		service.HookExtensionOperation = HookExtensionOperation;

		function processDataByService(entities, service) {
			var simpleProcessors = _.filter(service.getDataProcessor(), function(proc) {
				return _.isFunction(proc.processItem) && proc.processItem.length === 1;
			});
			_.forEach(simpleProcessors, function(processor) {
				_.forEach(entities, processor.processItem);
			});
		}

		//service.changeRequisitionStatus = changeRequisitionStatus().fn;
		function newChangeRequisitionStatus(){
			var entity = mainService.getSelected();
			if(!_.isNil(entity)){
				// check for statusworkflow at first, then invoke the original method changeRequisitionStatus()
				var url = 'transportplanning/requisition/wizard/checkforstatusworkflow?statusid=' + entity.TrsReqStatusFk;
				$http.get(globals.webApiBaseUrl + url)
					.then(function (result) {
						changeRequisitionStatus().fn();
					});
			}
			else {
				changeRequisitionStatus().fn();
			}
		}
		service.changeRequisitionStatus = newChangeRequisitionStatus;

		function changeTrsResRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: mainService,
					dataService: $injector.get('transportplanningRequisitionResRequisitionDataService'),
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					supportMultiChange: true
				}
			);
		}

		service.changeTrsResRequisitionStatus = changeTrsResRequisitionStatus().fn;

		function changeTrsResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: mainService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var dynamicTrsResReservationService = transportRequisitionContainerInformationService.getContainerInfoByGuid(trsResReservation).dataServiceName;
						return {
							getSelected: function () {
								return dynamicTrsResReservationService ? dynamicTrsResReservationService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return dynamicTrsResReservationService ? dynamicTrsResReservationService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								dynamicTrsResReservationService.gridRefresh();
							},
							processData: function(entities) {
								var simpleProcessors = _.filter(dynamicTrsResReservationService.getDataProcessor(), function(proc) {
									return _.isFunction(proc.processItem) && proc.processItem.length === 1;
								});
								_.forEach(simpleProcessors, function(processor) {
									_.forEach(entities, processor.processItem);
								});
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeTrsResReservationStatus = changeTrsResReservationStatus().fn;

		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'transportplanning.requisition.wizard.wizardGroupname1',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					changeRequisitionStatus()
				]
			}]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		function enableRequisition() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(mainService, 'Enable Requisition',
				'transportplanning.requisition.wizard.enableRequisitionTitle', 'Code',
				'transportplanning.requisition.wizard.enableDisableRequisitionDone',
				'transportplanning.requisition.wizard.requisitionAlreadyEnabled',
				'item');
		}

		function disableRequisition() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(mainService, 'Disable Requisition',
				'transportplanning.requisition.wizard.disableRequisitionTitle', 'Code',
				'transportplanning.requisition.wizard.enableDisableRequisitionDone',
				'transportplanning.requisition.wizard.requisitionAlreadyDisabled',
				'item');
		}

		service.enableRequisition = function () {
			enableRequisition().fn.apply(service, arguments);
		};

		service.disableRequisition = function () {
			disableRequisition().fn.apply(service, arguments);
		};

		var formConfig = {
			fid: 'transportplanning.requisition.createTrsRouteModal',
			showGrouping: false,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup'
				}
			],
			rows: [
				{
					gid: 'baseGroup',
					rid: 'Code',
					label$tr$: 'cloud.common.entityCode',
					model: 'Code',
					type: 'code',
					required: true,
					sortOrder: 2
				},
				{
					gid: 'baseGroup',
					rid: 'Description',
					label$tr$: 'cloud.common.entityDescription',
					model: 'DescriptionInfo',
					type: 'translation',
					sortOrder: 3
				},
				{
					gid: 'baseGroup',
					rid: 'eventtypefk',
					model: 'EventTypeFk',
					sortOrder: 4,
					label$tr$: 'transportplanning.transport.entityEventTypeFk',
					type: 'directive',
					required: true,
					directive: 'productionplanning-common-event-type-lookup',
					options: {
						filterKey: 'transportplanning-transport-route-eventtype-filter'
					},
				},
				{
					gid: 'baseGroup',
					rid: 'projectfk',
					model: 'ProjectFk',
					sortOrder: 5,
					label$tr$: 'cloud.common.entityProject',
					type: 'directive',
					required: true,
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						displayMember: 'Code',
						descriptionMember: 'ProjectName',
						lookupOptions: {
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.LgmJobFk = null;
									}
								}
							]
						}
					}
				},
				{
					gid: 'baseGroup',
					rid: 'lgmjobfk',
					model: 'LgmJobFk',
					sortOrder: 6,
					label$tr$: 'logistic.job.entityJob',
					type: 'directive',
					required: true,
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'logistic-job-paging-extension-lookup',
						displayMember: 'Code',
						descriptionMember: 'Address.Address',
						lookupOptions: {
							defaultFilter: {projectFk: 'ProjectFk'},
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.LgmJobFk = args.selectedItem.Id;
										args.entity.ProjectFk = args.selectedItem.ProjectFk;
									}
								}
							]
						}
					}
				},
				{
					gid: 'baseGroup',
					rid: 'projectdeffk',
					model: 'ProjectDefFk',
					sortOrder: 7,
					label$tr$: 'transportplanning.transport.entityProjectDefFk',
					type: 'directive',
					readonly: true,
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						displayMember: 'Code',
						descriptionMember: 'ProjectName',
						lookupOptions: {
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										args.entity.JobDefFk = null;
									}
								}
							]
						}
					}
				},
				(function () {
					var setting = ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectDefFk',
						jobType: 'external'
					});
					setting = _.extend(setting.detail,
						{
							gid: 'baseGroup',
							rid: 'jobdeffk',
							model: 'JobDefFk',
							sortOrder: 8,
							label$tr$: 'transportplanning.transport.entityJobDefFk',
						}
					);
					setting.options.descriptionMember = 'Address.Address';
					setting.options.lookupOptions.events = [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								if (args.selectedItem) {
									args.entity.JobDefFk = args.selectedItem.Id;
									args.entity.ProjectDefFk = args.selectedItem.ProjectFk;
									args.entity.HasDefaultDstWaypoint = true;
									if (!args.entity.PlannedDelivery) {
										args.entity.PlannedDelivery = _.clone(args.entity.DefaultPlannedDelivery);
										platformDataValidationService.ensureNoRelatedError(args.entity, 'PlannedDelivery', ['PlannedDelivery'], $injector.get('transportplanningTransportValidationService'), $injector.get('transportplanningTransportMainService'));
									}
								}
								else {
									args.entity.JobDefFk = null;
									args.entity.ProjectDefFk = null;
									args.entity.HasDefaultDstWaypoint = false;
									args.entity.PlannedDelivery = null;
								}
								platformRuntimeDataService.readonly(args.entity, [{field: 'PlannedDelivery', readonly: !args.entity.PlannedDelivery}]);
							}
						}
					];
					return setting;
				})(),
				{
					gid: 'baseGroup',
					rid: 'plannedstart',
					label$tr$: 'productionplanning.common.event.plannedStart',
					model: 'PlannedStart',
					type: 'datetimeutc',
					required: true,
					sortOrder: 9
				},
				{
					gid: 'baseGroup',
					rid: 'plannedfinish',
					label$tr$: 'productionplanning.common.event.plannedFinish',
					model: 'PlannedFinish',
					type: 'datetimeutc',
					required: true,
					sortOrder: 10
				},
				{
					gid: 'baseGroup',
					rid: 'internalHours',
					label$tr$: 'transportplanning.requisition.wizard.intervalHour',
					model: 'IntervalHours',
					type: 'integer',
					required: true,
					sortOrder: 11
				},
				{
					gid: 'baseGroup',
					rid: 'planneddelivery',
					label$tr$: 'transportplanning.transport.plannedDelivery',
					model: 'PlannedDelivery',
					type: 'datetimeutc',
					required: true,
					sortOrder: 12
				},
				{
					gid: 'baseGroup',
					rid: 'commenttext',
					label$tr$: 'cloud.common.entityComment',
					model: 'CommentText',
					type: 'comment',
					sortOrder: 13
				}
			]
		};

		service.showDialogToCreateTrsRoute = function (title, createRouteOptions, routeProcessor, okHandler) {
			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createroute', createRouteOptions).then(function (result) {
				if(result) {
					var data = result.data;
					//set code to data
					var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(data.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportRoute);
					if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').hasToGenerateForRubricCategory(categoryId) ) {
						data.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').provideNumberDefaultText(categoryId);
						platformRuntimeDataService.readonly(data, [{field: 'Code', readonly: true}]);
					}

					(routeProcessor || angular.identity)(data);
					var transportMainService = $injector.get('transportplanningTransportMainService');
					var validationService = $injector.get('transportplanningTransportValidationService');
					var modalCreateConfig = {
						title: title,
						resizeable: true,
						dataItem: data,
						formConfiguration: ProcessFields(angular.copy(formConfig), createRouteOptions.hideFields, createRouteOptions.readonlyFields),
						validationService: $injector.get('transportplanningTransportValidationService'),
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return platformDataValidationService.hasErrors(transportMainService);
							}
						},
						handleOK: function () {
							(okHandler || angular.identity)(data);
						}
					};
					platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

					platformModalFormConfigService.showDialog(modalCreateConfig).then(function () {
						platformDataValidationService.removeDeletedEntityFromErrorList(data, transportMainService);
					}, function () {
						platformDataValidationService.removeDeletedEntityFromErrorList(data, transportMainService);
					});
				}
			});
		};

		function ProcessFields(formConfig, fieldsToHide, fieldsToReadonly){
			if(Array.isArray(fieldsToHide)){
				fieldsToHide.forEach( field =>{
					let rowToHide = _.find(formConfig.rows, {model: field});
					if(rowToHide){
						rowToHide.visible = false;
					}
				});
			}
			if(Array.isArray(fieldsToReadonly)){
				fieldsToReadonly.forEach( field =>{
					let rowToReadonly = _.find(formConfig.rows, {model: field});
					if(rowToReadonly){
						rowToReadonly.readonly = true;
					}
				});
			}
			return formConfig;
		}

		service.createTransportRouteFromTrsReq = function () {
			var selected = _.clone(mainService.getSelected());
			var title = $translate.instant('transportplanning.requisition.wizard.createTrsRouteFromTrsReq');

			if (!platformSidebarWizardCommonTasksService.assertSelection(selected, title)) {
				return;
			}
			mainService.updateAndExecute(function () {
				if ($injector.get('transportplanningRequisitionValidationService').hasErrors()) {
					return;//stop when still has errors
				}
				var status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', selected.TrsReqStatusFk);
				if (!status.IsAccepted) {
					platformModalService.showDialog({
						headerTextKey: title,
						bodyTextKey: status.Code + $translate.instant('transportplanning.requisition.wizard.errorStatus'),
						iconClass: 'ico-error'
					});
					return;
				}
				var createRteOption = {
					projectId: selected.ProjectFk,
					TrsRequsitionSiteFk: selected.SiteFk,
					SiteFk: selected.SiteFk
				};
				var routeProcessor = function (data) {
					data.SelectedTrsReqId = selected.Id;
					data.IntervalHours = 2;
					data.PlannedStart = selected.PlannedStart;
					data.PlannedFinish = selected.PlannedFinish;
					data.JobDefFk = selected.LgmJobFk;
					if (selected.IsPickup) {//reverse the job&project
						var jobDefFk = data.JobDefFk;
						var projectDefFk = data.ProjectDefFk;
						data.JobDefFk = data.LgmJobFk;
						data.ProjectDefFk = data.ProjectFk;
						data.LgmJobFk = jobDefFk;
						data.ProjectFk = projectDefFk;
					}
					data.HasDefaultDstWaypoint = !!data.JobDefFk;
					if (data.HasDefaultDstWaypoint) {
						data.PlannedDelivery = selected.PlannedFinish;
					}
					data.DefaultPlannedDelivery = selected.PlannedFinish;
					platformRuntimeDataService.readonly(data, [{
						field: 'PlannedDelivery',
						readonly: !data.HasDefaultDstWaypoint
					}]);
				};
				var okHandler = function handleOK(data) {
					data.EarliestStart = data.LatestStart = data.PlannedStart;
					data.EarliestFinish = data.LatestFinish = data.PlannedFinish;
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createBySelectedGoods', {
						'TrsRoute': data,
						'TransportRequisitionId': selected.Id,
						'IntervalHours': data.IntervalHours
					}).then(function (respond) {
						mainService.reloadService('TrsGoodDataService', null, 'transportplanning.requisition.trsgoods.list');
						var url = 'transportplanning/requisition/wizard/getRequisitionStatusForCreateRoute';
						var msg = $translate.instant('transportplanning.requisition.wizard.notify2SetStatusWizardParamValue') + ': ' +
							$translate.instant('transportplanning.requisition.wizard.wizardCreateTransport') + '\\' +
							$translate.instant('transportplanning.requisition.wizard.wizardParameter_RequisitionStatus2Set');
						changeRequisitionStatusAfterDispatch([selected], url, msg).then(function (errMsg) {
							var message = errMsg !== '' ? errMsg : $translate.instant('transportplanning.requisition.wizard.createTrsRouteSuccess',
								{code: respond.data.Code});
							//update routesInfo of trsRequisition #111351 changed status will clear RouteInfo, so update RouteInfo after changed status
							if(selected.RoutesInfo){
								if(selected.RoutesInfo.Ids && _.isArray(selected.RoutesInfo.Ids)){
									selected.RoutesInfo.Ids.push(respond.data.Id);
								}
								else {
									selected.RoutesInfo.Ids = [respond.data.Id];
								}
								if(selected.RoutesInfo.Codes!== null && selected.RoutesInfo.Codes!== ''){
									selected.RoutesInfo.Codes = selected.RoutesInfo.Codes+','+respond.data.Code;
								}
								else {
									selected.RoutesInfo.Codes = respond.data.Code;
								}
							}
							else {
								selected.RoutesInfo = {Ids:[respond.data.Id],Codes:respond.data.Code};
							}
							mainService.gridRefresh();
							var dialogOption = {
								windowClass : 'msgbox',
								iconClass: 'info',
								headerTextKey: title,
								bodyTextKey: message,
								customButtons: [{
									id: 'goToTrsRoute',
									caption: 'transportplanning.requisition.wizard.goToRoute',
									disabled: false,
									autoClose: false,
									cssClass: 'app-icons ico-test',
									fn: function(button, event, closeFn) {
										closeFn();
										navigationService.navigate({
											moduleName: 'transportplanning.transport'
										}, respond.data, 'Code');
									}
								}]
							};

							platformModalService.showDialog(dialogOption);
						});
					});
				};
				service.showDialogToCreateTrsRoute(title, createRteOption, routeProcessor, okHandler);
			});
		};

		function changeRequisitionStatusAfterDispatch(reqs, url) {
			var defer = $q.defer();
			$http.get(globals.webApiBaseUrl + url)
				.then(function (response) {
					var statusId = response.data;
					if(statusId !== 0){
						var config = {
							mainService: mainService,
							refreshMainService: false,
							statusField: 'TrsReqStatusFk',
							statusName: 'trsRequisition',
							supportMultiChange: true,
							title: 'transportplanning.requisition.wizard.changeRequisitionStatus',
							updateUrl: 'transportplanning/requisition/wizard/changeRequisitionStatus'
						};
						var promises = [];
						reqs.forEach(function (req) {
							if(req.TrsReqStatusFk !== statusId){
								var options = _.clone(config);
								_.extend(options, {
									id: req.Id,
									entity: req,
									entities: [req],
									fromStatusId: req.TrsReqStatusFk,
									toStatusId: statusId !== -1 ? statusId : req.TrsRteStatusFk
								});
								promises.push(basicsCommonChangeStatusService.changeStatus(options, ''));
							}
						});
						$q.all(promises).then(function (results) {
							basicsCommonChangeStatusService.afterDoneAll(config, mainService, results, reqs);
							var errMsgs = [];
							results.forEach(function (r) {
								if(!_.isNil(r.ErrorMsg)){
									errMsgs.push(r.ErrorMsg);
								}
							});
							defer.resolve(_.join(errMsgs, '<br>'));
						});
					} else {
						defer.resolve('');
					}
				});
			return defer.promise;
		}

		service.synchronizeTransportRequisition = function (){
			var service = $injector.get('transportplanningRequisitionSynchronizeWizardService');
			var selected = mainService.getSelected();
			if(selected){
				service.createSynchronizeWizardDialog(selected);
			}
			else{
				platformModalService.showDialog({
					headerTextKey: $translate.instant('transportplanning.requisition.synchronizeDialog.dialogTitle'),
					bodyTextKey: 'transportplanning.requisition.synchronizeDialog.noSelectedError',
					iconClass: 'ico-error'
				});
			}
		};

		service.createReturnRequisition = function(){
			var selected = mainService.getSelected();
			var modalConfig = {
				templateUrl: 'transportplanning.requisition/templates/transport-requisition-return-requisition-creation-template.html',
				controller: 'transportplanningRequisitionReturnRequisitionController',
				resizeable: true,
				width: '900px',
				resolve: {
					$options: function () {
						return {
							entity: selected
						};
					}
				}
			};
			platformModalService.showDialog(modalConfig);
		};

		service.createReturnPlantRequisition = function createReturnPlantRequisition(){
			var selected = mainService.getSelected();
			var modalConfig = {
				templateUrl: 'transportplanning.requisition/templates/transport-requisition-return-plant-requisition-template.html',
				controller: 'transportplanningRequisitionPlantRequisitionController',
				resizeable: true,
				width: '900px',
				resolve: {
					$options: function () {
						return {
							entity: selected
						};
					}
				}
			};
			platformModalService.showDialog(modalConfig);
		};

		return service;
	}
})(angular);
