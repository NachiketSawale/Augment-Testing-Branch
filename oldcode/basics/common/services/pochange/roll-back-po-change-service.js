(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonRollBackPOChangeService', [
		'platformModalService', '$filter', '$q', '$http', '$translate', 'cloudDesktopSidebarService', 'platformTranslateService',
		'basicsWorkflowInstanceService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupDataService', 'platformSidebarWizardCommonTasksService',
		'basicsWorkflowInstanceStatus', 'basicsWorkflowEventService', 'procurementCommonHeaderTextNewDataService', 'globals', '_', '$', 'moment',
		function (
			platformModalService, $filter, $q, $http, $translate, cloudDesktopSidebarService, platformTranslateService,
			basicsWorkflowInstanceService, lookupDescriptorService, lookupDataService, platformSidebarWizardCommonTasksService, wfStatus, basicsWorkflowEventService, procurementCommonHeaderTextNewDataService, globals, _, $, moment) {
			platformTranslateService.registerModule('basics.common');
			// const executeWFInstances = [];
			const modalOptionsQuestion = {
				headerTextKey: $translate.instant('basics.common.poChange.controller.modalQuestion.headerTextKey'),
				bodyTextKey: $translate.instant('basics.common.poChange.services.modalQuestion.bodyText'),
				showYesButton: true, showNoButton: true,
				iconClass: 'ico-question'
			};
			const RollBackTextInit = {
				ChangeType: $translate.instant('basics.common.poChange.ChangeType'),
				RollBack: $translate.instant('basics.common.poChange.rollback'),
				RollbackResult: $translate.instant('basics.common.poChange.rollbackResult'),
				RollBackSuccess: $translate.instant('basics.common.poChange.rollbackSuccess'),
				RollBackFailed: $translate.instant('basics.common.poChange.rollbackFailed'),
				UpdateDate: $translate.instant('basics.common.poChange.UpdateDate')
			};
			const eventUUID = '722DBD73A9B24D2FB2DF76AD548725B6';

			function getSpecificsContatus(filterValue) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'procurement/contract/constatus/specificscontatus',
					params: {
						filterValue: filterValue
					}
				}).then(function (response) {
					return response.data;
				});
			}

			function executeWorkflows(entityId) {
				const defer = $q.defer();
				doExecuteWorkflows(entityId, defer);
				return defer.promise;
			}

			function doExecuteWorkflows(entityId, defer) {
				const workflowsPromises = [];
				workflowsPromises.push(
					{promise: basicsWorkflowEventService.startWorkflow(eventUUID, entityId, null)});

				$q.all(_.map(workflowsPromises, 'promise')).then(function (instances) {

					let canContinue = true;
					angular.forEach(instances, function (instance) {
						// executeWFInstances.push(instance);
						if (instance.data[0].Status === wfStatus.failed || instance.data[0].Status === wfStatus.escalate) {
							canContinue = false;
						}
					});

					if (canContinue === false) {
						defer.reject({
							canContinue: false
						});

					} else {
						defer.resolve({
							canContinue: true
						});
					}
				});
			}

			function rollBackPOchangeImpl(options) {
				const defer = $q.defer();
				executeWorkflows(options.entity.Id).then(function (wfResult) {
					if (wfResult.canContinue) {
						defer.resolve({changed: true, executed: true});
					} else {
						defer.resolve({changed: true, executed: false});
					}
				}, function () {
					platformModalService.showErrorBox($translate.instant('basics.common.poChange.services.exeRBErrorMsg'), $translate.instant('basics.common.poChange.services.errorHeaderText'));
				});
				return defer.promise;
			}

			function rollBackPOChange(config) {
				const mainService = config.mainService;
				const entity = mainService.getSelected();
				const options = angular.copy(config);
				options.entity = entity;
				mainService.updateAndExecute(function () {
					options.fromStatusId = options.entity[options.statusField];
					getSpecificsContatus('ISORDERED=true and ISCHANGEREJECTED=true').then(function (data) {
						if (data && data[0] && data[0].Id === options.entity[options.statusField]) {
							platformModalService.showDialog(modalOptionsQuestion).then(function (result) {
								if (!result || result.no) {
									// ignore
								} else {
									rollBackPOchangeImpl(options).then(function (result) {
										if (result.changed === true) {
											if (result.executed === true) {
												updateRollBackHistory(options, true);
												const mainItem = mainService.getSelected();
												// Refresh the whole data cause we don't know what changes in workflow
												// TODO: workaround save filterRequest temporarily
												const filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
												cloudDesktopSidebarService.filterRequest.pKeys = _.map(mainService.getList(), 'Id');
												mainService.refresh().then(function () {
													cloudDesktopSidebarService.filterRequest = filterRequest;
													// Here we need to return a promise,so we use setSelected function
													mainService.setSelected({}).then(function () {
														const newEntity = mainService.getItemById(mainItem.Id);
														mainService.setSelected(newEntity);
													}
													);
												});

											} else {
												updateRollBackHistory(options, false);
												const item = result.entity;
												const oldItem = entity;

												if (oldItem) {
													angular.extend(oldItem, item);
												}
												mainService.gridRefresh();
											}

										}
									}, function (reject) {
										updateRollBackHistory(options, false);
										console.log(reject);
									});
								}
							});
						} else {
							const modalOptions = {
								headerText: $translate.instant('basics.common.poChange.services.modalInfo.headerText'),
								bodyText: $translate.instant('basics.common.poChange.services.modalInfo.bodyTextRB'),
								showOkButton: true,
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						}
					});
				});

				function updateRollBackHistory(options, success) {
					let headerBlobData;
					const hearTextList = procurementCommonHeaderTextNewDataService.getService(options.entity).getList();
					const history = hasPOChangeHistoryFn(hearTextList);
					if (history && angular.isDefined(history.hasPOChangeHistory) && history.hasPOChangeHistory) {
						headerBlobData = {
							headerBlobToUpdate: [{
								Id: history.Id,
								PlainText: history.originalData + '\n' + compositeHeaderText(options, success),
								PrcHeaderFk: options.entity.PrcHeaderFk,
								PrcTexttypeFk: history.PrcTexttypeFk
							}]
						};
					} else {
						headerBlobData = {
							headerBlobToInsert: [{
								PlainText: angular.isDefined(history.originalData) ? history.originalData : '' + '\n' + compositeHeaderText(options, success),
								PrcTexttypeFk: history.PrcTexttypeFk,
								PrcHeaderFk: options.entity.PrcHeaderFk
							}]
						};
					}

					$http(httpPostObj('procurement/contract/wizard/pochangeheaderblob', headerBlobData)).then(function (result) {
						return result.data;
					});
				}

				function httpPostObj(url, data) {
					return {
						method: 'POST',
						url: globals.webApiBaseUrl + url,
						data: data
					};
				}

				function hasPOChangeHistoryFn(hearTextList) {
					let poChangeHistoryObj = {};
					poChangeHistoryObj = _.find(hearTextList, {PrcTexttypeFk: 9});
					if (!poChangeHistoryObj || poChangeHistoryObj.length === 0) {
						poChangeHistoryObj = {PrcTexttypeFk: 9};
						$.extend(poChangeHistoryObj, {hasPOChangeHistory: false});
					} else {
						let isFound = false;
						angular.forEach(hearTextList, function (text) {
							if (!isFound) {
								if (text.PrcTexttypeFk === 9) {
									isFound = true;
									$.extend(poChangeHistoryObj, {
										hasPOChangeHistory: true,
										originalData: text.PlainText
									});
								}
							}
						});
					}
					return poChangeHistoryObj;
				}

				function compositeHeaderText(options, success) {
					const splitLine = '=================================================================================\r';
					let content;
					if (success) {
						content = splitLine +
							RollBackTextInit.ChangeType + ' :\r\t\t-' + RollBackTextInit.RollBack +
							'\r' + RollBackTextInit.RollbackResult + ' :\r\t\t-' + RollBackTextInit.RollBackSuccess +
							'\r' + RollBackTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
					} else {
						content = splitLine +
							RollBackTextInit.ChangeType + ' :\r\t\t-' + RollBackTextInit.RollBack +
							'\r' + RollBackTextInit.RollbackResult + ' :\r\t\t-' + RollBackTextInit.RollBackFailed +
							'\r' + RollBackTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
					}

					return content;
				}
			}

			return {
				rollBackPOChange: rollBackPOChange
			};
		}]);
})(angular);
