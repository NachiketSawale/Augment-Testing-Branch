/**
 * Created by chd on 2/28/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,$,console */
	angular.module(moduleName).factory('procurementOrderChangeService',
		['platformModalService', '$filter', '$q', '$http', '$translate', 'cloudDesktopSidebarService', 'platformTranslateService',
			'basicsWorkflowEventService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupDataService', 'platformSidebarWizardCommonTasksService',
			'basicsWorkflowInstanceStatus', 'procurementCommonHeaderTextNewDataService', 'platformRuntimeDataService', 'procurementChangeOrderItemDeliveryScheduleDataService',
			'moment',
			function (platformModalService, $filter, $q, $http, $translate, cloudDesktopSidebarService, platformTranslateService,
				basicsWorkflowEventService, lookupDescriptorService, lookupDataService, platformSidebarWizardCommonTasksService, wfStatus, procurementCommonHeaderTextNewDataService, platformRuntimeDataService,
				procurementChangeOrderItemDeliveryScheduleDataService, moment) {
				platformTranslateService.registerModule('basics.common');

				var statusCache = {};
				var headerTextInit = {
					ChangeType: $translate.instant('basics.common.poChange.ChangeType'),
					OldDate: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
					NewDate: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
					OldAddress: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldAddress'),
					NewAddress: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewAddress'),
					OldQuantity: $translate.instant('cloud.common.entityQuantity'),
					NewQuantity: $translate.instant('cloud.common.entityNewQuantity'),
					UpdateDate: $translate.instant('basics.common.poChange.UpdateDate'),
					Items: $translate.instant('basics.common.poChange.itemsData'),
					ItemNo: $translate.instant('basics.common.poChange.itemNo'),
					RunningNumber: $translate.instant('procurement.contract.wizard.poChange.runningNo')
				};
				var executeWFInstances = [];
				var eventUUID = 'E75FF701D8FE42A3BA7D130D072282CD';
				var poChangeTypes = {
					CHG_DATELIN: 'CHG_DATELIN',
					CHG_ADDRESSLIN: 'CHG_ADDRESSLIN'
				};

				/* function canContinueWorkflowExecute(exeInstance, workflowConfig) {
					if (workflowConfig.IsMandatory === true || workflowConfig.IsBeforeStatus === true) {
						if (exeInstance.Status === wfStatus.failed || exeInstance.Status === wfStatus.escalate) {
							return false;
						}
					}
					return true;
				} */

				function doExecuteWorkflows(entityId, defer) {
					var workflowsPromises = [];
					workflowsPromises.push(
						{promise: basicsWorkflowEventService.startWorkflow(eventUUID, entityId, null)});

					$q.all(_.map(workflowsPromises, 'promise')).then(function (instances) {

						var canContinue = true;
						angular.forEach(instances, function (instance/* , index */) {
							executeWFInstances.push(instance);
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

				function executeWorkflows(entityId) {
					var defer = $q.defer();
					doExecuteWorkflows(entityId, defer);
					return defer.promise;
				}

				/* function saveStatus(options, comment) {
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'procurement/contract/wizard/changestatus',
						data: {
							NewStatusId: options.toStatusId,
							EntityId: options.entity.Id
						}
					}).then(function (result) {
						if (!options.isSimpleStatus) {
							$http({
								method: 'POST',
								url: globals.webApiBaseUrl + 'basics/common/status/savehistory',
								data: {
									statusName: options.statusName.toLowerCase(),
									objectId: options.entity.Id,
									statusOldFk: options.fromStatusId,
									statusNewFk: options.toStatusId,
									remark: comment
								}
							});
						}
						return result.data;
					});

				} */

				function httpPostObj(url, data) {
					return {
						method: 'POST',
						url: globals.webApiBaseUrl + url,
						data: data
					};
				}

				/* function getExtraDate(extraDays, datime) {
					datime = moment(datime).format('YYYY-MM-DD');
					var d = new Date(datime).valueOf();
					d = d + extraDays * 24 * 60 * 60 * 1000;
					d = new Date(d);
					return d;
				} */

				function updateChangeOrder(options) {
					var orderChangeDateList = [];
					var items = options.itemDataService.getList();
					var deliveryScheduleDataService = procurementChangeOrderItemDeliveryScheduleDataService.getService(options.itemDataService);
					var deliveryScheduleCacheDatas = deliveryScheduleDataService.getAllDeliveryScheduleCacheDatas();

					_.forEach(items, function (item) {
						var isChangeItemAddress = false;
						var isChangeItemRequireBy = false;
						var isChangeDeliveryScheduleRequireBy = false;

						if (item.NewAddress !== item.Address) {
							isChangeItemAddress = true;
						}

						if (item.NewDateRequired && item.DateRequired) {
							var NewDateValue = window.moment(item.NewDateRequired).utc();
							var DateRequired = window.moment(item.DateRequired).utc();
							var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
							if (duration !== 0) {
								isChangeItemRequireBy = true;
							}
						} else if ((item.NewDateRequired === null && item.DateRequired) || (item.NewDateRequired && item.DateRequired === null)) {
							isChangeItemRequireBy = true;
						}

						if (deliveryScheduleCacheDatas.length <= 0 || !item.Hasdeliveryschedule) {
							if (isChangeItemAddress || isChangeItemRequireBy) {
								var orderChangeItem = {
									ItemNo: item.Itemno,
									RunningNo: 0,
									IsChangeItemAddress: isChangeItemAddress,
									IsChangeItemRequireBy: isChangeItemRequireBy,
									IsChangeDeliveryScheduleRequireBy: false,
									NewItemAddress: item.NewAddress,
									NewItemDateRequired: window.moment(item.NewDateRequired).utc(),
									NewDeliveryScheduleRequireBy: null,
									isAlreadyChangeAddress: false
								};

								orderChangeDateList.push(orderChangeItem);
							}
						} else {
							_.forEach(deliveryScheduleCacheDatas, function (deliverySchedule) {
								isChangeDeliveryScheduleRequireBy = false;
								if (deliverySchedule.PrcItemFk === item.Id) {
									if (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired) {
										var NewDateValue = window.moment(deliverySchedule.NewDateRequired).utc();
										var DateRequired = window.moment(deliverySchedule.DateRequired).utc();
										var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
										if (duration !== 0) {
											isChangeDeliveryScheduleRequireBy = true;
										}
									} else if ((deliverySchedule.NewDateRequired === null && deliverySchedule.DateRequired) || (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired === null)) {
										isChangeDeliveryScheduleRequireBy = true;
									}
								}

								if (isChangeItemAddress || isChangeItemRequireBy || isChangeDeliveryScheduleRequireBy) {
									var orderChangeItem = {
										ItemNo: item.Itemno,
										RunningNo: deliverySchedule.RunningNumber,
										IsChangeItemAddress: isChangeItemAddress,
										IsChangeItemRequireBy: isChangeItemRequireBy,
										IsChangeDeliveryScheduleRequireBy: isChangeDeliveryScheduleRequireBy,
										NewItemAddress: item.NewAddress,
										NewItemDateRequired: item.NewDateRequired !== null ? window.moment(item.NewDateRequired).utc() : null,
										NewDeliveryScheduleRequireBy: deliverySchedule.NewDateRequired !== null ? window.moment(deliverySchedule.NewDateRequired).utc() : null,
										isAlreadyChangeAddress: false
									};

									orderChangeDateList.push(orderChangeItem);
								}

							});
						}
					});

					var ChangeDataDto = {
						ContractId: options.currentContract.contractId,
						ChangeItemsDtos: orderChangeDateList
					};

					return $http(httpPostObj('procurement/contract/wizard/quickchangeorder', ChangeDataDto)).then(function (result) {
						return result.data;
					});
				}

				function updatePurchaseOrderHistory(options, items, deliveryScheduleCacheDatas) {
					var PrcHeaderBlobDto = {};
					PrcHeaderBlobDto = {
						PlainText: compositeHeaderText(options, items, deliveryScheduleCacheDatas),
						PrcTexttypeFk: 9,
						PrcHeaderFk: options.entity.PrcHeaderFk,
						ConfigurationFk: options.entity.PrcHeaderEntity.ConfigurationFk
					};

					$http(httpPostObj('procurement/contract/wizard/updateprcheaderblobtext', PrcHeaderBlobDto)).then(function (result) {
						return result.data;
					});
				}

				function compositeHeaderText(options, itemDates, deliveryScheduleDatas) {
					var splitLine = '=================================================================================\r';
					var content = '';

					_.forEach(itemDates, function (item) {
						if (item.NewAddress !== item.Address) {
							var oldData = '';
							if (item.Address !== null && item.Address.Address !== null && item.Address.Address !== '') {
								oldData = item.Address.Address.replace(/\s+/g, ' ');
							}

							var newData = '';
							if (item.NewAddress !== null && item.NewAddress.Address !== null && item.NewAddress.Address !== '') {
								newData = item.NewAddress.Address.replace(/\s+/g, ' ');
							}
							content += splitLine +
								headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_ADDRESSLIN +
								'\r' + headerTextInit.ItemNo + ' :\r\t\t' + item.Itemno +
								'\r' + headerTextInit.OldAddress + ' :\r\t\t-' + oldData +
								'\r' + headerTextInit.NewAddress + ' :\r\t\t-' + newData +
								'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
						}

						if (item.NewDateRequired && item.DateRequired) {
							var NewDateValue = window.moment(item.NewDateRequired).utc();
							var DateRequired = window.moment(item.DateRequired).utc();
							var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
							if (duration !== 0) {
								content += splitLine +
									headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_DATELIN +
									'\r' + headerTextInit.ItemNo + ' :\r\t\t' + item.Itemno +
									'\r' + headerTextInit.OldDate + ' :\r\t\t-' + $filter('date')(new Date(item.DateRequired), 'yyyy-MM-dd').toString() +
									'\r' + headerTextInit.NewDate + ' :\r\t\t-' + $filter('date')(new Date(item.NewDateRequired), 'yyyy-MM-dd').toString() +
									'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
							}
						} else if ((item.NewDateRequired === null && item.DateRequired) || (item.NewDateRequired && item.DateRequired === null)) {
							var OldDate = item.DateRequired ? $filter('date')(new Date(item.DateRequired), 'yyyy-MM-dd').toString() : ' ';
							var NewDate = item.NewDateRequired ? $filter('date')(new Date(item.NewDateRequired), 'yyyy-MM-dd').toString() : ' ';
							content += splitLine +
								headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_DATELIN +
								'\r' + headerTextInit.ItemNo + ' :\r\t\t' + item.Itemno +
								'\r' + headerTextInit.OldDate + ' :\r\t\t-' + OldDate +
								'\r' + headerTextInit.NewDate + ' :\r\t\t-' + NewDate +
								'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
						}

						_.forEach(deliveryScheduleDatas, function (deliverySchedule) {
							var isChangeDeliveryScheduleRequireBy = false;
							if (deliverySchedule.PrcItemFk === item.Id) {
								if (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired) {
									var NewDateValue = window.moment(deliverySchedule.NewDateRequired).utc();
									var DateRequired = window.moment(deliverySchedule.DateRequired).utc();
									var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
									if (duration !== 0) {
										isChangeDeliveryScheduleRequireBy = true;
									}
								} else if ((deliverySchedule.NewDateRequired === null && deliverySchedule.DateRequired) || (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired === null)) {
									isChangeDeliveryScheduleRequireBy = true;
								}
							}

							if (isChangeDeliveryScheduleRequireBy) {
								content += splitLine +
									headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_DATELIN +
									'\r' + headerTextInit.ItemNo + ' :\r\t\t' + item.Itemno +
									'\r' + headerTextInit.RunningNumber + ' :\r\t\t' + deliverySchedule.RunningNumber +
									'\r' + headerTextInit.OldDate + ' :\r\t\t-' + $filter('date')(new Date(deliverySchedule.DateRequired), 'yyyy-MM-dd').toString() +
									'\r' + headerTextInit.NewDate + ' :\r\t\t-' + $filter('date')(new Date(deliverySchedule.NewDateRequired), 'yyyy-MM-dd').toString() +
									'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
							}
						});
					});

					return content;
				}

				function changePurchaseOrder(options) {
					var defer = $q.defer();
					// var entity = options.entity;

					var itemDatas = options.itemDataService.getList();
					var deliveryScheduleDataService = procurementChangeOrderItemDeliveryScheduleDataService.getService(options.itemDataService);
					var deliveryScheduleDatas = deliveryScheduleDataService.getAllDeliveryScheduleCacheDatas();

					// update purchase order
					updateChangeOrder(options).then(function (data) {
						executeWorkflows(data.Id).then(function (wfResult) {
							if (wfResult.canContinue) {
								getSentToYtwoStatus().then(function (sendStatus) {
									if (sendStatus === null) {
										var modalOptions = {
											headerText: $translate.instant('basics.common.poChange.services.modalInfo.headerText'),
											bodyText: $translate.instant('procurement.contract.wizard.poChange.NotFoundSendYtwoStatus'),
											showOkButton: true,
											iconClass: 'ico-info'
										};
										platformModalService.showDialog(modalOptions);
									}

									changeContractStatus(data.Id, sendStatus.Id);
									updatePurchaseOrderHistory(options, itemDatas, deliveryScheduleDatas);
									defer.resolve({changed: true, executed: true});
								});
							} else {
								console.log('wfResult.canContinue: ' + wfResult.canContinue);
								defer.resolve({changed: true, executed: false});
							}
						}, function (/* error */) {
							platformModalService.showErrorBox($translate.instant('procurement.contract.wizard.poChange.sendPoChangeFailed'), $translate.instant('basics.common.poChange.services.errorHeaderText'));
							rollBackData(options, itemDatas, deliveryScheduleDatas).then(function (data) {
								defer.resolve({changed: true, executed: true, entity: data});
							});
						});
					});

					return defer.promise;
				}

				function changeContractStatus(contractId, newStatusId) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/contract/constatus/changestatus',
						params: {
							contractId: contractId,
							newStatusId: newStatusId
						}
					}).then(function (respon) {
						return respon.data;
					});
				}

				function rollBackData(options, itemDatas, deliveryScheduleDatas) {
					var items = itemDatas;
					var orderChangeDateList = [];
					_.forEach(items, function (item) {
						var isChangeItemAddress = false;
						var isChangeItemRequireBy = false;
						var isChangeDeliveryScheduleRequireBy = false;

						if (item.NewAddress !== item.Address) {
							isChangeItemAddress = true;
						}

						if (item.NewDateRequired && item.DateRequired) {
							var NewDateValue = window.moment(item.NewDateRequired).utc();
							var DateRequired = window.moment(item.DateRequired).utc();
							var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
							if (duration !== 0) {
								isChangeItemRequireBy = true;
							}
						} else if ((item.NewDateRequired === null && item.DateRequired) || (item.NewDateRequired && item.DateRequired === null)) {
							isChangeItemRequireBy = true;
						}

						var deliveryScheduleCacheDatas = deliveryScheduleDatas;
						if (deliveryScheduleCacheDatas.length <= 0 || !item.Hasdeliveryschedule) {
							if (isChangeItemAddress || isChangeItemRequireBy) {
								var orderChangeItem = {
									ItemNo: item.Itemno,
									RunningNo: 0,
									IsChangeItemAddress: isChangeItemAddress,
									IsChangeItemRequireBy: isChangeItemRequireBy,
									IsChangeDeliveryScheduleRequireBy: false,
									NewItemAddress: item.Address,
									NewItemDateRequired: item.DateRequired !== null ? window.moment(item.DateRequired).utc() : null,
									NewDeliveryScheduleRequireBy: null,
									ItemStatusId: item.PrcItemstatusFk,
									isAlreadyChangeAddress: false
								};

								orderChangeDateList.push(orderChangeItem);
							}
						} else {
							_.forEach(deliveryScheduleCacheDatas, function (deliverySchedule) {
								isChangeDeliveryScheduleRequireBy = false;
								if (deliverySchedule.PrcItemFk === item.Id) {
									if (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired) {
										var NewDateValue = window.moment(deliverySchedule.NewDateRequired).utc();
										var DateRequired = window.moment(deliverySchedule.DateRequired).utc();
										var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
										if (duration !== 0) {
											isChangeDeliveryScheduleRequireBy = true;
										}
									} else if ((deliverySchedule.NewDateRequired === null && deliverySchedule.DateRequired) || (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired === null)) {
										isChangeDeliveryScheduleRequireBy = true;
									}
								}

								if (isChangeItemAddress || isChangeItemRequireBy || isChangeDeliveryScheduleRequireBy) {
									var orderChangeItem = {
										ItemNo: item.Itemno,
										RunningNo: deliverySchedule.RunningNumber,
										IsChangeItemAddress: isChangeItemAddress,
										IsChangeItemRequireBy: isChangeItemRequireBy,
										IsChangeDeliveryScheduleRequireBy: isChangeDeliveryScheduleRequireBy,
										NewItemAddress: item.Address,
										NewItemDateRequired: item.DateRequired !== null ? window.moment(item.DateRequired).utc() : null,
										NewDeliveryScheduleRequireBy: deliverySchedule.DateRequired !== null ? window.moment(deliverySchedule.DateRequired).utc() : null,
										ItemStatusId: item.PrcItemstatusFk,
										DeliveryScheduleStatusId: deliverySchedule.PrcItemstatusFk,
										isAlreadyChangeAddress: false
									};

									orderChangeDateList.push(orderChangeItem);
								}

							});
						}
					});

					var ChangeDataDto = {
						ContractId: options.currentContract.contractId,
						ChangeItemsDtos: orderChangeDateList
					};

					return $http(httpPostObj('procurement/contract/wizard/rollbackchangeorder', ChangeDataDto)).then(function (result) {
						return result.data;
					});
				}

				function showDialog(options) {
					var d = $q.defer();
					var defaultValue = {
						resizeable: true,
						codeField: 'Code',
						descField: 'Description',
						onReturnButtonPress: function () {
						}
					};

					$.extend(defaultValue, options, {
						templateUrl: globals.appBaseUrl + 'procurement.contract/partials/change-order/purchase-order-change-dialog.html'
					});

					if (!options.entity || !Object.prototype.hasOwnProperty.call(options.entity,defaultValue.statusField)) {
						d.reject('Change status dialog: empty object or cannot find needed field');
					}
					platformModalService.showDialog(defaultValue).then(function (result) {
						if (result.changed) {
							d.resolve(result);
						} else {
							d.reject(result);
						}

						executeWFInstances = [];
					}, function () {
						executeWFInstances = [];
					});
					return d.promise;
				}

				function getStatusList(options) {

					if (angular.isFunction(options.statusProvider)) {
						return options.statusProvider();
					} else if (options.statusLookupType) {
						return lookupDataService.getList(options.statusLookupType);
					} else {
						if (Object.prototype.hasOwnProperty.call(statusCache,options.statusName)) {
							return $q.when(statusCache[options.statusName]);
						}

						return $http.get(globals.webApiBaseUrl + 'basics/common/status/list?statusName=' + options.statusName)
							.then(function (respon) {
								statusCache[options.statusName] = respon.data;
								return respon.data;
							});
					}
				}

				function getAvailableStatus(options) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'basics/common/status/pochangeavailablestatus',
						params: {
							statusName: options.statusName,
							statusFrom: options.fromStatusId,
							projectId: options.projectId
						}
					}).then(function (respon) {
						return respon.data;
					});
				}

				function getCurrentStatus(options) {
					var statusId = options.entity[options.statusField];
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/contract/constatus/getconstatusbyid',
						params: {
							statusId: statusId
						}
					}).then(function (respon) {
						return respon.data;
					});
				}

				function getSentToYtwoStatus() {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/contract/constatus/externalcontatus',
						params: {
							externalsourceDesc: 'YTWO Platform',
							externalCode: 'CREATE'
						}
					}).then(function (respon) {
						return respon.data;
					});
				}

				function getDefaultStatus(options) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/status/default?statusName=' + options.statusName)
						.then(function (respon) {
							return respon.data;
						});
				}

				/* function getLeadTime(options) {
					return $http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getLeadTimeExtraDate?id=' + options.entity.Id)
						.then(function (respon) {
							return respon.data;
						});
				} */

				/* function getChangeHistoryHeaderText(mainItemId) {
					return $http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/changehistoryheadertext?MainItemId=' + mainItemId)
							.then(function (respon) {
								return respon.data;
							});
				} */

				function checkHasChangeAnything(options) {
					var hasChangeAny = false;
					var itemDataService = options.itemDataService;
					if (itemDataService && itemDataService.getList().length > 0) {
						angular.forEach(itemDataService.getList(), function (item) {
							if (item.NewAddress !== item.Address) {
								hasChangeAny = true;
							}

							if (item.NewDateRequired && item.DateRequired) {
								var NewDateValue = window.moment(item.NewDateRequired).utc();
								var DateRequired = window.moment(item.DateRequired).utc();
								var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
								if (duration !== 0) {
									hasChangeAny = true;
								}
							} else if ((item.NewDateRequired === null && item.DateRequired) || (item.NewDateRequired && item.DateRequired === null)) {
								hasChangeAny = true;
							}

							var deliveryScheduleDataService = procurementChangeOrderItemDeliveryScheduleDataService.getService(options.itemDataService);
							var deliveryScheduleDatas = deliveryScheduleDataService.getAllDeliveryScheduleCacheDatas();
							_.forEach(deliveryScheduleDatas, function (deliverySchedule) {
								// var isChangeDeliveryScheduleRequireBy = false;
								if (deliverySchedule.PrcItemFk === item.Id) {
									if (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired) {
										var NewDateValue = window.moment(deliverySchedule.NewDateRequired).utc();
										var DateRequired = window.moment(deliverySchedule.DateRequired).utc();
										var duration = _.round(moment.duration(DateRequired.diff(NewDateValue)).asDays());
										if (duration !== 0) {
											hasChangeAny = true;
										}
									} else if ((deliverySchedule.NewDateRequired === null && deliverySchedule.DateRequired) || (deliverySchedule.NewDateRequired && deliverySchedule.DateRequired === null)) {
										hasChangeAny = true;
									}
								}
							});
						});
					}

					return hasChangeAny;
				}

				function provideStatusChangeInstance(config) {
					return {
						id: config.id || 'POChange',
						text: config.title,
						text$tr$: config.title,
						type: 'item',
						showItem: true,
						cssClass: 'rw md',
						fn: function () {
							var MainService = config.mainService;
							var dataService = {};
							dataService = config.mainService;
							// var itemDataService = {};
							if (angular.isFunction(config.getItemDataService)) {
								config.itemDataService = config.getItemDataService();
								config.oldItemData = config.getItemDataService().getList();
							}

							MainService.updateAndExecute(function () {
								var title = config.title;
								var entity = dataService.getSelected();
								if (platformSidebarWizardCommonTasksService.assertSelection(entity, title)) {
									var options = angular.copy(config);
									options.entity = entity;
									options.headerText = $translate.instant(title);
									if (options.projectField) {
										options.projectId = entity[options.projectField];
									} else if (angular.isFunction(options.getProjectIdFn)) {
										options.projectId = options.getProjectIdFn();
									}

									options.imageSelector = 'platformStatusIconService';
									options.currentContract = {
										contractId: entity.Id,
										itemDataService: options.itemDataService
									};

									getCurrentStatus(options).then(function (item) {
										var hasPermission = false;
										if (item.IsOrdered) {
											hasPermission = true;
										}

										if (hasPermission) {
											showDialog(options).then(function (result) {
												if (angular.isFunction(config.handleSuccess)) {
													config.handleSuccess(result);
													return;
												}
												if (result.changed === true) {
													if (result.executed === true) {
														var mainItem = MainService.getSelected();
														// Refresh the whole data cause we don't know what changes in workflow
														// TODO: workaround save filterRequest temporarily
														var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
														cloudDesktopSidebarService.filterRequest.pKeys = _.map(MainService.getList(), 'Id');
														MainService.refresh().then(function () {
															cloudDesktopSidebarService.filterRequest = filterRequest;
															// Here we need to return a promise,so we use setSelected function
															MainService.setSelected({}).then(function () {
																var entity = MainService.getItemById(mainItem.Id);
																MainService.setSelected(entity);
															}
															);
														});
													} else {
														var item = result.entity;
														var oldItem = entity;

														if (oldItem) {
															angular.extend(oldItem, item);
														}
														dataService.gridRefresh();
													}

												}
											}, function (reject) {
												console.log(reject);
											});
										} else {
											var modalOptions = {
												headerText: $translate.instant('basics.common.poChange.services.modalInfo.headerText'),
												bodyText: $translate.instant('basics.common.poChange.services.modalInfo.bodyText'),
												showOkButton: true,
												iconClass: 'ico-info'
											};
											platformModalService.showDialog(modalOptions);
										}
									});
								}
							});
						}
					};
				}

				function getExecutingWfInstances() {
					return executeWFInstances;
				}

				function getMaterialbyId(id) {
					return $http.get(globals.webApiBaseUrl + 'basics/material/material?id=' + id)
						.then(function (respon) {
							return respon.data;
						});
				}

				function getPriceCondition(id) {
					return $http.get(globals.webApiBaseUrl + 'procurement/common/pricecondition/list?mainItemId=' + id)
						.then(function (respon) {
							return respon.data;
						});
				}

				function getHomeCurrency(id) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/currency/getcurrencybyid?id=' + id)
						.then(function (respon) {
							return respon.data;
						});
				}

				function updateReadOnly(item, model/* , value */) {
					var editable = getCellEditable(item, model);
					platformRuntimeDataService.readonly(item, [{field: 'oldaddress', readonly: !editable}]);
				}

				function getCellEditable(item, model) {
					if (model) {
						return false;
					}
					return false;
				}

				return {
					provideStatusChangeInstance: provideStatusChangeInstance,
					showDialog: showDialog,
					changePurchaseOrder: changePurchaseOrder,
					getStatusList: getStatusList,
					getAvailableStatus: getAvailableStatus,
					getDefaultStatus: getDefaultStatus,
					getExecutingWfInstances: getExecutingWfInstances,
					updateReadOnly: updateReadOnly,
					getCellEditable: getCellEditable,
					getPriceCondition: getPriceCondition,
					getMaterialbyId: getMaterialbyId,
					getHomeCurrency: getHomeCurrency,
					checkHasChangeAnything: checkHasChangeAnything
				};

			}]);
})(angular);
