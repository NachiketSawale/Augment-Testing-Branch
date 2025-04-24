/*
 * Created by alm on 02.01.2021.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';
	angular.module('hsqe.checklist').factory('checkListWizardService', ['$http', '$injector', '$translate', 'platformDialogService',
		'platformModalService', 'cloudDesktopPinningContextService', 'basicsLookupdataLookupDescriptorService',
		'basicsCommonChangeStatusService', 'hsqeCheckListDataService', 'hsqeCheckListTemplateDataService', 'platformDialogService',
		function ($http, $injector, $translate, dialogService, platformModalService, cloudDesktopPinningContextService,
			basicsLookupdataLookupDescriptorService, changeStatusService, headerDataService, hsqeCheckListTemplateDataService, platformDialogService) {
			var service = {};
			service.createCheckListFromTemplate = function createCheckListFromTemplate() {
				var checkListTemplate = hsqeCheckListTemplateDataService.getSelected();
				var checklist = headerDataService.getSelected();
				if(checklist) {
					if (checklist.IsSameContextProjectsByCompany) {
						let strTitle = 'hsqe.checklist.wizard.createCheckList.title';
						let strBody = 'hsqe.checklist.wizard.readOnlyRecord';
						dialogService.showMsgBox(strBody, strTitle, 'info');
						return false;
					}
				}
				var project = cloudDesktopPinningContextService.getPinningItem('project.main');
				var projectId = null;
				if (project) {
					projectId = project.id;
				}
				if (!projectId && checklist) {
					projectId = checklist.PrjProjectFk;
				}
				var modalOptions = {
					headerTextKey: 'hsqe.checklist.wizard.createCheckList.title',
					templateUrl: globals.appBaseUrl + 'hsqe.checklist/templates/create-check-list-wizard.html',
					resizeable: true,
					minWidth: '650px',
					height: '250px',
					windowClass: 'form-modal-dialog',
					showCancelButton: true,
					hasCheckListTemplate: !!checkListTemplate,
					value: {
						fromCheckListTemplate: 2,
						projectFk: projectId,
						createDistinctChecklist:true
					}
				};
				platformModalService.showDialog(modalOptions).then(function (result) {
					if (result.ok) {
						var projectId = modalOptions.value.projectFk;
						var fromCheckListTemplate = parseInt(result.value.fromCheckListTemplate);
						var createDistinctChecklist=result.value.createDistinctChecklist;
						var param = {
							projectId: projectId,
							checkListTemplateId: checkListTemplate ? checkListTemplate.Id : null,
							fromCheckListTemplate: fromCheckListTemplate,
							createCheckListFlg: 0,
							createDistinctChecklist:createDistinctChecklist
						};
						if (2 === fromCheckListTemplate) {
							$http.post(globals.webApiBaseUrl + 'hsqe/checklist/wizard/checkChecklist', param).then(function (res) {
								var createFlg = res.data;
								if (createFlg > 0) {
									if (2 === createFlg) {
										var modalOptions1 = {
											headerTextKey: 'hsqe.checklist.wizard.createCheckList.createNewCheckListCreateOption',
											templateUrl: globals.appBaseUrl + 'hsqe.checklist/templates/create-check-list-option-wizard.html',
											resizeable: true,
											minWidth: '650px',
											height: '250px',
											windowClass: 'form-modal-dialog',
											showCancelButton: true,
											value: {
												createCheckListFlg: 1
											}
										};
										platformModalService.showDialog(modalOptions1).then(function (result1) {
											if (result1.ok) {
												param.createCheckListFlg = parseInt(result1.value.createCheckListFlg);
												createCheckList(param);
											}
										});
									} else {
										createCheckList(param);
									}
								} else {
									var strTitle = 'hsqe.checklist.wizard.createCheckList.title';
									var strBody = 'hsqe.checklist.wizard.createCheckList.getNoRecordFromChecklistTemplate';
									dialogService.showMsgBox(strBody, strTitle, 'info');
								}

							});
						} else {
							createCheckList(param);
						}

					}
				});
			};


			function createCheckList(param) {
				var fromCheckListTemplate = param.fromCheckListTemplate;
				$http.post(globals.webApiBaseUrl + 'hsqe/checklist/wizard/createChecklist', param).then(function (response) {
					var createChecklists = response.data;
					if (createChecklists && createChecklists.length > 0) {
						var strBody = 'hsqe.checklist.wizard.createCheckList.createSuccessTip';
						var codes = [];
						_.forEach(createChecklists, function (item) {
							codes.push(item.Code);
							headerDataService.createCheckListSuccess(item);
						});
						var code = _.join(codes, ',');
						platformModalService.showMsgBox($translate.instant(strBody, {code: code}), 'Info', 'ico-info');

					} else if (2 === fromCheckListTemplate) {
						var strTitle = 'hsqe.checklist.wizard.createCheckList.title';
						var strBody2 = 'hsqe.checklist.wizard.createCheckList.getNoRecordFromChecklistTemplate';
						dialogService.showMsgBox(strBody2, strTitle, 'info');
					}
				});
			}

			function createDefect(checklist) {
				if(null===checklist.PrjProjectFk) {
					var project = cloudDesktopPinningContextService.getPinningItem('project.main');
					var projectId = null;
					if (project) {
						projectId = project.id;
					}
					var modalOptions = {
						headerTextKey: 'hsqe.checklist.wizard.createDefect.title',
						templateUrl: globals.appBaseUrl + 'hsqe.checklist/templates/create-defect-wizard.html',
						resizeable: true,
						minWidth: '150px',
						height: '200px',
						windowClass: 'form-modal-dialog',
						showCancelButton: true,
						value: {projectFk: projectId}
					};
					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.ok) {
							$http.get(globals.webApiBaseUrl + 'hsqe/checklist/wizard/checkdefectscheduleproject?checklistId=' + checklist.Id + '&projectID=' + result.value.projectFk).then(function (checkResult) {
								if(!checkResult.data) {
									let projectNotSameModalOptions = {
										headerText: $translate.instant('hsqe.CheckList.wizard.createDefect.title'),
										bodyText: $translate.instant('hsqe.checklist.wizard.createDefect.projectNotSame'),
										showYesButton: true,
										showNoButton: true,
										defaultButton: 'yes',
										iconClass: 'ico-question'
									};
									platformModalService.showDialog(projectNotSameModalOptions).then(function (selectResult) {
										if (selectResult.yes) {
											let param = {
												projectId: result.value.projectFk,
												checkList: checklist,
												assignSchedule: false
											};
											createDefectByProject(param);
										}
									});
								}
								else {
									let param = {
										projectId: result.value.projectFk,
										checkList: checklist,
										assignSchedule: true
									};
									createDefectByProject(param);
								}
							});
						}
					});
				}
				else{
					let param = {
						projectId: checklist.PrjProjectFk,
						checkList: checklist,
						assignSchedule: true
					};
					createDefectByProject(param);
				}
			}

			function createDefectByProject(param){
				$http.post(globals.webApiBaseUrl + 'hsqe/checklist/wizard/createDefect', param).then(function (response) {
					var defect = response.data;
					if (defect) {
						var strBody = 'hsqe.checklist.wizard.createDefect.createDefectSuccessTip';
						var code = defect.Code;
						var navIds = [];
						navIds.push(defect.Id);
						var showMessage = $translate.instant(strBody, {code: code});
						var modalOptions = {
							headerText: $translate.instant('hsqe.checklist.wizard.createDefect.title'),
							templateUrl: globals.appBaseUrl + 'hsqe.checklist/templates/wizard/defect-goto-dialog.html',
							resizeable: true,
							minWidth: '150px',
							height: '200px',
							windowClass: 'form-modal-dialog',
							bodyText: showMessage,
							navIds: navIds
						};
						var lookupDataService = $injector.get('basicsLookupdataLookupDataService');
						lookupDataService.getItemByKey('CheckList', param.checkList.Id).then(function (data){
							if (data) {
								basicsLookupdataLookupDescriptorService.updateData('CheckList', [data]);
							}
						});
						platformModalService.showDialog(modalOptions).then(function (result) {
							if (result) {
								headerDataService.refresh().then(function () {
									var item = headerDataService.getItemById(param.checkList.Id);
									headerDataService.setSelected(item);
								});
							}
						});
					}
				});
			}

			service.createDefectFromCheckList = function createDefectFromCheckList() {
				headerDataService.update().then(function () {
					var checklist = headerDataService.getSelected();
					var strTitle = 'hsqe.checklist.wizard.createDefect.title';
					var strBody = '';
					if (checklist.IsSameContextProjectsByCompany) {
						strBody = 'hsqe.checklist.wizard.readOnlyRecord';
						dialogService.showMsgBox(strBody, strTitle, 'info');
						return false;
					}
					if (!checklist) {
						strBody = 'hsqe.checklist.wizard.createDefect.noSelectedChecklistRecord';
						dialogService.showMsgBox(strBody, strTitle, 'info');
						return false;
					} else {
						var statusId = checklist.HsqChlStatusFk;
						var checklistId = checklist.Id;
						var url = 'hsqe/checklist/wizard/checkStatus?checklistId=' + checklistId + '&statusId=' + statusId;
						$http.get(globals.webApiBaseUrl + url).then(function (res) {
							var flg = res.data;
							if (1 === flg) {
								strBody = 'hsqe.checklist.wizard.createDefect.cannotCreateDefectByStatusTip';
								dialogService.showMsgBox(strBody, strTitle, 'info');
							} else if (2 === flg) {
								strBody = 'hsqe.checklist.wizard.createDefect.noIsDefectCheckListStatus';
								dialogService.showMsgBox(strBody, strTitle, 'info');
							} else if (3 === flg) {
								strBody = 'hsqe.checklist.wizard.createDefect.noHasFailureCheckPointTip';
								// dialogService.showMsgBox(strBody, strTitle, 'info');
								var modalOptions = {
									headerTextKey: strTitle,
									bodyTextKey: strBody,
									showYesButton: true,
									showNoButton: true,
									defaultButton: 'yes',
									iconClass: 'ico-question'
								};
								platformModalService.showDialog(modalOptions).then(function (result) {
									if (result.yes) {
										createDefect(checklist);
									}
								});
							} else {
								createDefect(checklist);

							}
						});

					}
				});
			};

			let changeStatus = function changeStatus() {
				let bCCS = changeStatusService.provideStatusChangeInstance(
					{
						mainService: headerDataService,
						statusField: 'HsqChlStatusFk',
						projectField: 'PrjProjectFk',
						title: 'hsqe.checklist.wizard.changeStatus.title',
						statusName: 'checklist',
						updateUrl: 'hsqe/checklist/wizard/changestatus',
						id: 11,
						handleSuccess: function (result) {
							if (result.changed) {
								var checklist = headerDataService.getSelected();
								checklist.HsqChlStatusFk = result.entity.HsqChlStatusFk;
								headerDataService.gridRefresh();
								$injector.get('hsqeCheckListDataReadonlyProcessor').handlerItemReadOnlyStatus(checklist);
							}
						}
					});
				let fn = bCCS.fn;
				let newFn = function () {
					let checklist = headerDataService.getSelected();
					if (checklist.IsSameContextProjectsByCompany) {
						dialogService.showMsgBox('hsqe.checklist.wizard.readOnlyRecord', 'hsqe.checklist.wizard.changeStatus.title', 'info');
					} else {
						return fn();
					}
				};
				bCCS.fn = newFn;
				return bCCS;
			};

			service.changeStatus = changeStatus().fn;
			return service;
		}]);
})(angular);
