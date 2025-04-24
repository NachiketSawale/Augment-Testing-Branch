(() => {
	'use strict';

	angular.module('timekeeping.recording').factory('timekeepingRecordingReportClockingService', timekeepingRecordingReportClockingService);

	timekeepingRecordingReportClockingService.$inject = ['_', '$http', 'platformDialogDefaultButtonIds', 'platformModalFormConfigService','platformTranslateService',
		'platformDialogService', 'platformModalGridConfigService', '$translate', '$injector', 'platformCreateUuid'];

	function timekeepingRecordingReportClockingService(_, $http, defaultButtonIds, platformModalFormConfigService, platformTranslateService,
		platformDialogService, platformModalGridConfigService, $translate,	$injector, platformCreateUuid) {
		let connectedEmployee = {};
		let timeSymbols = [];
		let travelTimeSymbol = null;
		let travelDistanceSymbol = null;
		let standardTimeSymbol = null;
		let actionTimeSymbol = null;
		let drivingHomeReports = [];
		function checkUserConnectToEmployee(userId) {
			let _toReturn;
			return $http.get(globals.webApiBaseUrl + 'timekeeping/employee/getconnectedemployee/?userId=' + userId).then(function (response) {
				if (response.data) {
					connectedEmployee = response.data;
					_toReturn = true;
				} else {
					connectedEmployee = {};
					_toReturn = false;
				}
				return {isConnected: _toReturn, employee: connectedEmployee};
			});
		}

		function startWork(entity) {
			let reports = [{
				EmployeeFk: entity.employeeId,
				DueDate: moment().format(),
				TimeSymbolFk: standardTimeSymbol.Id,
				ProjectFk: entity.projectId,
				ProjectActionFk: entity.prjActionId,
				CommentText: entity.comment
			}];
			if (!_.isNil(travelTimeSymbol) && entity.travelTime !== null){
				reports.push({
					EmployeeFk: entity.employeeId,
					DueDate: moment().format(),
					TimeSymbolFk: travelTimeSymbol.Id,
					ProjectFk: entity.projectId,
					ProjectActionFk: entity.prjActionId,
					CommentText: entity.comment,
					Duration: entity.travelTime
				});
			}
			if (!_.isNil(travelDistanceSymbol) && entity.travelDistance !== null){
				reports.push({
					EmployeeFk: entity.employeeId,
					DueDate: moment().format(),
					TimeSymbolFk: travelDistanceSymbol.Id,
					ProjectFk: entity.projectId,
					ProjectActionFk: entity.prjActionId,
					CommentText: entity.comment,
					Duration: entity.travelDistance
				});
			}
			if (drivingHomeReports){
				_.forEach(drivingHomeReports, function(item) {
					if (item.Duration !== null) {
						item['DueDate'] = item['DueDate'].format();
						reports.push(item);
					}
				});
			}
			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/startworkreportfromclocking', reports).then(function () {
				platformDialogService.showMsgBox('cloud.desktop.employeeClocking.successMsg', 'cloud.desktop.employeeClocking.recordTime', 'info');
			});
		}
		function startBreak(report){
			let breakRecord = {
				ReportFk: report.Id,
				BreakStart: moment().format('YYYY[-]MM[-]DD[T]HH[:]mm[:]ss[Z]')
			};
			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/break/startbreakfromclocking', breakRecord).then(function () {
				platformDialogService.showMsgBox('cloud.desktop.employeeClocking.successMsg', 'cloud.desktop.employeeClocking.recordTime', 'info');
			});
		}

		function endBreak(report){
			let breakRecord = {
				ReportFk: report.Id,
				BreakEnd: moment().format('YYYY[-]MM[-]DD[T]HH[:]mm[:]ss[Z]')
			};
			return $http.post(globals.webApiBaseUrl + 'timekeeping/recording/break/endbreakfromclocking', breakRecord).then(function () {
				platformDialogService.showMsgBox('cloud.desktop.employeeClocking.successMsg', 'cloud.desktop.employeeClocking.recordTime', 'info');
			});
		}

		function endWork(report){
			report.To = moment().format('YYYY[-]MM[-]DD[T]HH[:]mm[:]ss[Z]');
			$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/endworkreportfromclocking', report)
		}

		function endWorkSurcharges(entities, report){
			if (entities && entities.length > 1) {
				let reports = [];
				_.forEach(entities, function (entity) {
					if (entity.Quantity != null) {
						let newReport = {
							DueDate: report.DueDate,
							SheetFk: report.SheetFk,
							RecordingFk: report.RecordingFk,
							EmployeeFk: report.EmployeeFk,
							TimeSymbolFk: entity.Id,
							ItwositeId: report.Id,
							Duration: entity.Quantity
						}
						reports.push(newReport);
					}
				});
				$http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/surchargereportsfromclocking', reports).then(function () {
					platformDialogService.showMsgBox('cloud.desktop.employeeClocking.successMsg', 'cloud.desktop.employeeClocking.recordTime', 'info');
				});
			}
		}

		function getDrivingHomeReports()
		{
			if (drivingHomeReports){
				_.forEach(drivingHomeReports, function(report){
					let timesymbol = _.find (timeSymbols, ['Id', report.TimeSymbolFk]);
					if (timesymbol) {
						report.TimeSymbol = timesymbol;
					}
					report['DueDate'] = moment(report['DueDate']);
				});
			}
			return drivingHomeReports;
		}
		function checkTimeSymbolyForEmployee(){
			return $http.post(globals.webApiBaseUrl + 'timekeeping/timesymbols/listbysymbol', {PKey1: connectedEmployee.Id, ByTimeAllocation: false})
				.then(function(response) {
					if (response.data){
						timeSymbols = response.data;
						let travelTimeSymbols = _.filter(response.data, function(item){
							return item.IsTravelTime && item.IsLive;
						});
						travelTimeSymbol = null;
						travelDistanceSymbol = null;
						if (travelTimeSymbols.length >= 1){
							travelTimeSymbol = _.find(travelTimeSymbols, ['IsDefault', true]);
							if (_.isNil(travelTimeSymbol)) {
								travelTimeSymbol = _.head(travelTimeSymbols);
							}
						}
						let travelDistanceSymbols = _.filter(response.data, function(item){
							return item.IsTravelDistance && item.IsLive;
						});
						if (travelDistanceSymbols.length >= 1){
							travelDistanceSymbol = _.find(travelDistanceSymbols, ['IsDefault', true]);
							if (_.isNil(travelDistanceSymbol)) {
								travelDistanceSymbol = _.head(travelDistanceSymbols);
							}
						}
						let standardTimeSymbols = _.filter(response.data, function(item){
							return item.IsReporting && item.IsLive;
						});
						if (standardTimeSymbols.length >= 1){
							standardTimeSymbol = _.find(standardTimeSymbols, ['IsDefault', true]);
							if (_.isNil(standardTimeSymbol)) {
								standardTimeSymbol = _.head(standardTimeSymbols);
							}
						}
						let actionTimeSymbols = _.filter(response.data, function(item){
							return item.IsAction && item.IsLive;
						});
						if (actionTimeSymbols.length >= 1){
							actionTimeSymbol = _.find(actionTimeSymbols, ['IsDefault', true]);
							if (_.isNil(actionTimeSymbol)) {
								actionTimeSymbol = _.head(actionTimeSymbols);
							}
						}
						if (standardTimeSymbol === null){
							platformDialogService.showMsgBox('cloud.desktop.employeeClocking.errorNoTimeSymbol', 'cloud.desktop.employeeClocking.recordTime', 'error');
							return false;
						}
					}
					return true;
				})
		}
		function startClocking() {
			let entity = {
				projectId: null,
				prjActionId: null,
				travelTime: null,
				travelDistance: null,
				comment:'',
				travelTimeHome: null,
				travelDistanceHome: null,
				employeeId: connectedEmployee.Id
			};
			checkTimeSymbolyForEmployee().then(function(result){
				if (result) {
					let startClockingConfig = {
						title: $translate.instant('cloud.desktop.employeeClocking.recordTime'),
						dataItem: entity,
						formConfiguration: {
							fid: 'timekeeping.recording.clocking.recordTime',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup'
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'projectId',
									label: 'Project',
									label$tr$: 'cloud.common.entityProject',
									type: 'directive',
									directive: 'basics-lookup-data-project-project-dialog',
									options: {
										showClearButton: true
									},
									model: 'projectId',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'prjActionId',
									label: 'Action',
									label$tr$: 'cloud.common.entityProjectAction',
									model: 'prjActionId',
									sortOrder: 2,
									type: 'directive',
									visible: actionTimeSymbol !== null,
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'project-main-action-lookup',
										displayMember: 'Code',
										descriptionMember: 'Description',
										showClearButton: true,
										lookupOptions: {
											defaultFilter: {projectFk: 'projectId', employeeFk: 'employeeId'},
											showClearButton: true,
											filterOptions: {
												serverSide: true,
												serverKey: 'projectActionFilter',
												fn: function (item) {
													let serv = $injector.get('projectMainActionLookupDataService');
													let params = serv.getFilterParams(item);
													if (_.isEmpty(params)) {
														return {'projectFk': item.projectId};
													} else {
														return params;
													}
												}
											}
										}
									}
								}, {
									gid: 'baseGroup',
									rid: 'travelTime',
									label: 'Travel Time to Site',
									label$tr$: 'cloud.desktop.employeeClocking.travelTime',
									model: 'travelTime',
									sortOrder: 3,
									type: 'decimal',
									visible: travelTimeSymbol !== null
								}, {
									gid: 'baseGroup',
									rid: 'travelDistance',
									label: 'Travel Distance to Site',
									label$tr$: 'cloud.desktop.employeeClocking.travelDistance',
									model: 'travelDistance',
									sortOrder: 4,
									type: 'decimal',
									visible: travelDistanceSymbol !== null
								}, {
									gid: 'baseGroup',
									rid: 'comment',
									label: 'Comment',
									label$tr$: 'cloud.common.entityComment',
									model: 'comment',
									sortOrder: 5,
									type: 'comment',
								}, {
									gid: 'baseGroup',
									rid: 'projectId',
									type: 'directive',
									label: 'Travel Home',
									label$tr$: 'cloud.desktop.employeeClocking.travelHome',
									directive: 'timekeeping-recording-travel-reports-grid-directive',
									visible: drivingHomeReports !== null && drivingHomeReports.length > 0,
									model: 'projectId',
									sortOrder: 6
								}
							]
						},
						buttons: [{
							id: 'Ok',
							caption: $translate.instant('cloud.desktop.employeeClocking.startWorkBtn'),
							caption$tr$: 'cloud.desktop.employeeClocking.startWorkBtn',
							disabled: function (item) {
								return (entity.projectId === null && entity.prjActionId === null);
							},
							fn: function () {
								startWork(entity);
							},
							autoClose: true
						}, {
							id: 'cancel',
							show: false
						}],
						showOkButton: false
					};
					// if (drivingHomeReports !== null) {
					// 	addRows(drivingHomeReports, startClockingConfig.formConfiguration.rows);
					// }
					platformTranslateService.translateFormConfig(startClockingConfig.formConfiguration);
					platformModalFormConfigService.showDialog(startClockingConfig);
				}
			});
		}

		function continueClocking(report) {
			let continueClockingConfig = {
				headerText$tr$: 'cloud.desktop.employeeClocking.clockingTime',
				headerText: 'cloud.desktop.employeeClocking.clockingTime',
				bodyText$tr$: 'cloud.desktop.employeeClocking.working',
				bodyText: 'cloud.desktop.employeeClocking.working',
				buttons: [{
					id: 'btn1',
					caption: $translate.instant('cloud.desktop.employeeClocking.startBreakBtn'),
					caption$tr$: 'cloud.desktop.employeeClocking.startBreakBtn',
					fn: function () {
						startBreak(report);
					},
					autoClose: true
				}, {
					id: 'btn2',
					caption: $translate.instant('cloud.desktop.employeeClocking.endWorkBtn'),
					caption$tr$: 'cloud.desktop.employeeClocking.endWorkBtn',
					fn: function () {
						// endWork(report);
						surchargeClocking(report);
					},
					autoClose: true
				}, {
					id: 'cancel',
					show: false
				}],
				showOkButton: false
			};
			platformDialogService.showDialog(continueClockingConfig);
		}

		function endClocking(report) {
			let endClockingConfig = {
				headerText$tr$: 'cloud.desktop.employeeClocking.clockingTime',
				headerText: 'cloud.desktop.employeeClocking.clockingTime',
				bodyText$tr$: 'cloud.desktop.employeeClocking.onBreak',
				bodyText: 'cloud.desktop.employeeClocking.onBreak',
				buttons: [{
					id: 'btn1',
					caption: $translate.instant('cloud.desktop.employeeClocking.endBreakBtn'),
					caption$tr$: 'cloud.desktop.employeeClocking.endBreakBtn',
					fn: function () {
						endBreak(report);
					},
					autoClose: true
				}, {
					id: 'btn2',
					caption: $translate.instant('cloud.desktop.employeeClocking.endWorkBtn'),
					caption$tr$: 'cloud.desktop.employeeClocking.endWorkBtn',
					fn: function () {
						// endWork(report);
						surchargeClocking(report);
					},
					autoClose: true
				}, {
					id: 'cancel',
					show: false
				}],
				showOkButton: false
			};
			platformDialogService.showDialog(endClockingConfig);
		}

		function surchargeClocking(report) {
			// get all timesymbols for surcharge
			return $http.post(globals.webApiBaseUrl + 'timekeeping/timesymbols/listbysymbol', {PKey1: connectedEmployee.Id, ByTimeAllocation: false})
				.then(function(response) {
					if (response && response.data) {
						let surchargesTimeSymbols = _.filter (response.data, function (data){
							return data.IsSurcharges && data.IsLive;
						});
						if (surchargesTimeSymbols.length > 0) {
							let entities = []
							_.forEach(surchargesTimeSymbols, function(item){
								item.Quantity = null;
								entities.push(item);
							});
							let surchargeClockingConfig = {
								title: $translate.instant('cloud.desktop.employeeClocking.surchargeDialog'),
								showOkButton: false,
								dataItems: entities,
								gridConfiguration: {
									uuid: platformCreateUuid(),
									version: '0.1.0',
									columns: [
										{id: 'Code', field: 'Code', name: 'Code', width: 100, formatter: 'code', name$tr$: 'cloud.common.entityCode'},
										{id: 'Description', field: 'Description', name: 'Description', width: 200, formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
										{id: 'Quantity', field: 'Quantity', name: 'Quantity', width: 100, formatter: 'decimal', editor: 'decimal', name$tr$: 'basics.common.Quantity'},
										{
											id: 'Uom', field: 'UoMFk', name: 'UoM', width: 50, formatter: 'lookup', formatterOptions: {
												lookupType: 'uom',
												displayMember: 'Unit'
											}, name$tr$: 'cloud.common.entityUoM'
										}
									]},
								handleOK: function(result) {
									endWorkSurcharges(result.data, report);
									endWork(report);
								}
							};
							platformTranslateService.translateGridConfig(surchargeClockingConfig.gridConfiguration.columns);
							platformModalGridConfigService.showDialog(surchargeClockingConfig);
						} else {
							endWork(report);
						}
					} else {
						endWork(report);
					}
				});
		}

		function clockingTimes(){
			return $http.get(globals.webApiBaseUrl + 'timekeeping/recording/report/foremployeeandclocking/?employeeId=' + connectedEmployee.Id + '&date=' + moment.utc().format()).then(function (response) {
					let mainReport = null;
					drivingHomeReports = null;
					if (response.data) {
						mainReport = _.find(response.data, ['RecordingState',1]);
						if (_.isNil(mainReport)){
							mainReport = _.find(response.data, ['RecordingState',2])
						}
						drivingHomeReports = _.filter(response.data, function(item){
							return ((item.RecordingState === 3000 || item.RecordingState === 4000) && item.Duration === null);
							});
					}
					if (_.isNil(mainReport))
					{
						startClocking();
					} else if (mainReport.RecordingState === 1)
					{
						continueClocking(mainReport);
					}
					else
					{
						endClocking(mainReport);
					}
				});
		}
		let service = {
			checkUserConnectToEmployee: checkUserConnectToEmployee,
			clockingTimes: clockingTimes,
			getDrivingHomeReports : getDrivingHomeReports
		};

		return service;
	}
})();