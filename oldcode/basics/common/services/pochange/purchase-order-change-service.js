(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonPurchaseOrderChangeService', [
		'platformModalService', '$filter', '$q', '$http', '$translate', 'cloudDesktopSidebarService', 'platformTranslateService',
		'basicsWorkflowInstanceService', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupDataService', 'platformSidebarWizardCommonTasksService',
		'basicsWorkflowInstanceStatus', 'procurementCommonHeaderTextNewDataService', 'platformRuntimeDataService', 'moment', '_', '$', 'globals',
		function (
			platformModalService, $filter, $q, $http, $translate, cloudDesktopSidebarService, platformTranslateService,
			basicsWorkflowInstanceService, lookupDescriptorService, lookupDataService, platformSidebarWizardCommonTasksService, wfStatus, procurementCommonHeaderTextNewDataService, platformRuntimeDataService, moment, _, $, globals) {
			platformTranslateService.registerModule('basics.common');

			const statusCache = {};
			const itemQty = {'data': 0};
			const headerTextInit = {
				ChangeType: $translate.instant('basics.common.poChange.ChangeType'),
				OldDate: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
				NewDate: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
				OldAddress: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldAddress'),
				NewAddress: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewAddress'),
				OldQuantity: $translate.instant('cloud.common.entityQuantity'),
				NewQuantity: $translate.instant('cloud.common.entityNewQuantity'),
				UpdateDate: $translate.instant('basics.common.poChange.UpdateDate'),
				Items: $translate.instant('basics.common.poChange.itemsData'),
				ItemNo: $translate.instant('basics.common.poChange.itemNo')
			};
			let executeWFInstances = [];
			const poChangeTypes = {
				CHG_QTYLIN: 'CHG_QTYLIN',
				CHG_DATELIN: 'CHG_DATELIN',
				CHG_ADDRESSLIN: 'CHG_ADDRESSLIN',
				CANLIN: 'CANLIN'
			};

			function compositeHeaderText(options) {
				const splitLine = '=================================================================================\r';
				let content = '';
				if (options.currentItem.isChangeDate) {
					let newdate = new Date(options.currentItem.newdate);
					if (options.currentItem.pfChecked) {
						if (options.currentItem.pfSelectedChecked) {
							if (!options.currentItem.IsChecked) {
								newdate = new Date(options.currentItem.newdate);
							}
						} else {
							if (options.currentItem.IsChecked) {
								newdate = new Date(options.currentItem.leadTime);
							}
						}
					} else {
						newdate = new Date(options.currentItem.newdate);
					}

					content += splitLine +
						headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_DATELIN +
						'\r' + headerTextInit.OldDate + ' :\r\t\t-' + $filter('date')(new Date(options.currentItem.olddate), 'yyyy-MM-dd').toString() +
						'\r' + headerTextInit.NewDate + ' :\r\t\t-' + $filter('date')(newdate, 'yyyy-MM-dd').toString() +
						'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
				}

				if (options.currentItem.isChangeAddress) {
					content += splitLine +
						headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_ADDRESSLIN +
						'\r' + headerTextInit.OldAddress + ' :\r\t\t-' + options.currentItem.oldaddress.Address.replace(/\s+/g, ' ') +
						'\r' + headerTextInit.NewAddress + ' :\r\t\t-' + options.currentItem.newaddress.Address.replace(/\s+/g, ' ') +
						'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
				}

				if (options.currentItem.isChangeQty) {
					content += splitLine +
						headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CHG_QTYLIN +
						'\r' + compositeItemsHistory(options) +
						'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
				}

				if (options.currentItem.isCancelPO) {
					content += splitLine +
						headerTextInit.ChangeType + ' :\r\t\t-' + poChangeTypes.CANLIN +
						'\r' + compositeItemsHistory(options) +
						'\r' + headerTextInit.UpdateDate + ' :\r\t\t-' + $filter('date')(new Date(moment()), 'yyyy-MM-dd HH:mm:ss').toString() + '\n';
				}

				return content;
			}

			function compositeItemsHistory(options) {
				let contentstr = headerTextInit.Items + ':\r';
				const newItemData = options.itemDataService().getList();
				const oldItemData = options.currentItem.olditemData;
				for (let i = 0; i < newItemData.length; i++) {
					let newQtyVal = '';
					if (options.currentItem.isCancelPO)
						newQtyVal = (angular.isDefined(newItemData[i].NewQuantity) && newItemData[i].NewQuantity !== '' ? newItemData[i].NewQuantity : '0');
					else
						newQtyVal = (angular.isDefined(newItemData[i].NewQuantity) && newItemData[i].NewQuantity !== '' ? newItemData[i].NewQuantity : 'N/A');
					if (i !== newItemData.length - 1)
						newQtyVal += '\r';
					contentstr += '\t\t-' + headerTextInit.ItemNo + ':\t' + newItemData[i].Itemno + '\t\t' + headerTextInit.OldQuantity + ':\t' + oldItemData[i].Quantity + '\t\t' + headerTextInit.NewQuantity + ':\t' + newQtyVal;
				}
				return contentstr;
			}

			function canContinueWorkflowExecute(exeInstance, workflowConfig) {
				if (workflowConfig.IsMandatory === true || workflowConfig.IsBeforeStatus === true) {
					if (exeInstance.Status === wfStatus.failed || exeInstance.Status === wfStatus.escalate) {
						return false;
					}
				}
				return true;
			}

			function doExecuteWorkflows(workflows, currentIndex, entityId, context, defer) {

				if (workflows && currentIndex < workflows.length) {
					const workflowsPromises = [];

					const currentSorting = workflows[currentIndex].Sorting;
					for (; currentIndex < workflows.length; currentIndex++) {
						if (currentSorting === workflows[currentIndex].Sorting) {

							workflowsPromises.push(
								{
									promise: basicsWorkflowInstanceService.startWorkflow(workflows[currentIndex].WfeTemplateFk, entityId, context),
									config: workflows[currentIndex]
								});
						} else {
							break;
						}
					}

					$q.all(_.map(workflowsPromises, 'promise')).then(function (instances) {

						let canContinue = true;
						let errMessage = '';
						angular.forEach(instances, function (instance, index) {
							executeWFInstances.push(instance);

							if (!canContinueWorkflowExecute(instance, workflowsPromises[index].config)) {
								canContinue = false;
								errMessage = instance.errorMessage;
							}
						});

						if (canContinue === false) {
							// Workflow stopped
							defer.reject({
								canContinue: false,
								wfExecuted: false,
								errmessage: errMessage
							});
							return;
						}
						doExecuteWorkflows(workflows, currentIndex, entityId, context, defer);
					});

				} else {
					defer.resolve(
						{
							canContinue: true,
							wfExecuted: currentIndex > 0
						});
				}
			}

			function executeWorkflows(workflows, entityId, context) {
				const defer = $q.defer();
				doExecuteWorkflows(workflows, 0, entityId, context, defer);
				return defer.promise;
			}

			function saveStatus(options, comment) {
				return $http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'procurement/contract/wizard/changestatus',
					data: {
						NewStatusId: options.toStatusId,
						EntityId: options.entity.Id
					}
				}).then(function (result) {
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

			function updatePurchaseOrder(options) {
				let newHeaderDate = {};
				if (options.currentItem.isChangeDate) {
					if (options.currentItem.pfChecked) {
						if (options.currentItem.pfSelectedChecked) {
							if (!options.currentItem.IsChecked) {
								newHeaderDate = {
									EntityId: options.entity.Id,
									newDeliveryDate: moment(options.currentItem.newdate).format('YYYY-MM-DD')
								};
							}
						} else {
							if (options.currentItem.IsChecked) {
								newHeaderDate = {
									EntityId: options.entity.Id,
									newDeliveryDate: moment(options.currentItem.leadTime).format('YYYY-MM-DD')
								};
							} else {
								newHeaderDate = {
									EntityId: options.entity.Id,
									newDeliveryDate: moment(options.currentItem.newdate).format('YYYY-MM-DD')
								};
							}
						}
					} else {
						newHeaderDate = {
							EntityId: options.entity.Id,
							newDeliveryDate: moment(options.currentItem.newdate).format('YYYY-MM-DD')
						};
					}
				}

				let newHeaderAddress = {};
				if (options.currentItem.isChangeAddress) {
					newHeaderAddress = {
						ZipCode: options.currentItem.newaddress.ZipCode,
						Id: options.currentItem.newaddress.Id,
						CountryFk: options.currentItem.newaddress.CountryFk,
						Street: options.currentItem.newaddress.Street,
						City: options.currentItem.newaddress.City,
						County: options.currentItem.newaddress.County,
						StateFk: options.currentItem.newaddress.StateFk,
						Latitude: options.currentItem.newaddress.Latitude,
						Longitude: options.currentItem.newaddress.Longitude,
						AddressLine: options.currentItem.newaddress.AddressLine,
						Address: options.currentItem.newaddress.Address,
						AddressModified: options.currentItem.newaddress.AddressModified,
						UpdatedAt: moment(),
						UpdatedBy: options.currentItem.newaddress.UpdatedBy
					};
				}

				const POChangeHeaderDto = {
					isChangeDate: options.currentItem.isChangeDate,
					isChangeAddress: options.currentItem.isChangeAddress,
					changeDeliveryDateDto: newHeaderDate,
					addressEntity: newHeaderAddress
				};

				return updatePrcItemChange(options, false).then(function (data) {
					return $http(httpPostObj('procurement/contract/wizard/pochangeheader', POChangeHeaderDto)).then(function (result) {
						return result.data;
					});
				});
			}

			function updatePrcItemChange(options, isRB) {
				let linesDate = {};
				if (options.currentItem.isChangeDate) {
					if (!isRB) {
						if (options.currentItem.pfChecked) {
							if (options.currentItem.pfSelectedChecked) {
								if (!options.currentItem.IsChecked) {
									linesDate = {
										prcHeaderFK: options.entity.PrcHeaderFk,
										newDate: moment(options.currentItem.newdate).format('YYYY-MM-DD'),
										updateFlag: true,
										expressFree: 0
									};
								}
							} else {
								if (options.currentItem.IsChecked) {
									linesDate = {
										prcHeaderFK: options.entity.PrcHeaderFk,
										newDate: moment(options.currentItem.leadTime).format('YYYY-MM-DD'),
										updateFlag: true,
										expressFree: options.currentItem.expressFree
									};
								} else {
									linesDate = {
										prcHeaderFK: options.entity.PrcHeaderFk,
										newDate: moment(options.currentItem.newdate).format('YYYY-MM-DD'),
										updateFlag: true,
										expressFree: 0
									};
								}
							}
						} else {
							linesDate = {
								prcHeaderFK: options.entity.PrcHeaderFk,
								newDate: moment(options.currentItem.newdate).format('YYYY-MM-DD'),
								updateFlag: false,
								expressFree: 0
							};
						}
					} else {
						linesDate = {
							prcHeaderFK: options.entity.PrcHeaderFk,
							newDate: moment(options.currentItem.olddate).format('YYYY-MM-DD'),
							updateFlag: true,
							expressFree: options.currentItem.olditemData[0].PriceExtraOc
						};
					}
				}

				let linesAddress = {};
				if (options.currentItem.isChangeAddress) {
					if (!isRB) {
						linesAddress = {
							PrcHeaderFk: options.entity.PrcHeaderFk,
							AddressEntity: {
								ZipCode: options.currentItem.newaddress.ZipCode,
								CountryFk: options.currentItem.newaddress.CountryFk,
								Street: options.currentItem.newaddress.Street,
								City: options.currentItem.newaddress.City,
								County: options.currentItem.newaddress.County,
								StateFk: options.currentItem.newaddress.StateFk,
								Latitude: options.currentItem.newaddress.Latitude,
								Longitude: options.currentItem.newaddress.Longitude,
								AddressLine: options.currentItem.newaddress.AddressLine,
								Address: options.currentItem.newaddress.Address,
								AddressModified: options.currentItem.newaddress.AddressModified,
								UpdatedAt: moment(),
								UpdatedBy: options.currentItem.newaddress.UpdatedBy
							}
						};
					} else {
						linesAddress = {
							PrcHeaderFk: options.entity.PrcHeaderFk,
							AddressEntity: {
								ZipCode: options.currentItem.oldaddress.ZipCode,
								CountryFk: options.currentItem.oldaddress.CountryFk,
								Street: options.currentItem.oldaddress.Street,
								City: options.currentItem.oldaddress.City,
								County: options.currentItem.oldaddress.County,
								StateFk: options.currentItem.oldaddress.StateFk,
								Latitude: options.currentItem.oldaddress.Latitude,
								Longitude: options.currentItem.oldaddress.Longitude,
								AddressLine: options.currentItem.oldaddress.AddressLine,
								Address: options.currentItem.oldaddress.Address,
								AddressModified: options.currentItem.oldaddress.AddressModified,
								UpdatedAt: moment(),
								UpdatedBy: options.currentItem.oldaddress.UpdatedBy
							}
						};
					}
				}

				let linesQty = {};
				if (options.currentItem.isChangeQty) {
					if (!isRB) {
						linesQty = {POChangeItems: options.itemDataService().getList()};
						if (linesQty.POChangeItems !== null) {
							linesQty.POChangeItems.forEach(function (item) {
								item.Quantity = item.NewQuantity;
							});
						}
					} else {
						linesQty = {POChangeItems: options.currentItem.olditemData};
					}
				}

				const POChangeLinesDto = {
					isChangeDate: options.currentItem.isChangeDate,
					isChangeAddress: options.currentItem.isChangeAddress,
					isChangeQty: options.currentItem.isChangeQty,
					isCancelPO: options.currentItem.isCancelPO,
					updateDeliveryDateToItemDto: linesDate,
					addressToItemsDto: linesAddress,
					changeItemsQtyDto: linesQty
				};

				return $http(httpPostObj('procurement/contract/wizard/pochangelines', POChangeLinesDto)).then(function (result) {
					return result.data;
				});
			}

			function updatePurchaseOrderHistory(options) {
				const PrcHeaderBlobDto = {
					PlainText: compositeHeaderText(options),
					PrcTexttypeFk: 9,
					PrcHeaderFk: options.entity.PrcHeaderFk,
					ConfigurationFk: options.entity.PrcHeaderEntity.ConfigurationFk
				};

				$http(httpPostObj('procurement/contract/wizard/updateprcheaderblobtext', PrcHeaderBlobDto)).then(function (result) {
					return result.data;
				});
			}

			function changePurchaseOrder(options, remark) {
				const defer = $q.defer();
				const entity = options.entity;
				getStatusList(options).then(function (status) {
					const fromStatus = _.find(status, {Id: options.fromStatusId});
					const toStatus = _.find(status, {Id: options.toStatusId});
					// Start the status workflow.
					$http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'basics/common/status/workflows',
						params: {
							statusName: options.statusName.toLowerCase(),
							statusFrom: options.fromStatusId,
							statusTo: options.toStatusId
						}
					}).then(function (respond) {
						const workflows = respond.data;
						let type;
						if (options.currentItem.isCancelPO) {
							type = 'CANLIN'; // CANLIN:Cancel Order Line
						} else {
							type = 'CHGLIN'; // CHGLIN:Change Line Data
						}
						const context = angular.toJson({
							fromStatus: fromStatus.Id,
							toStatus: toStatus.Id,
							isUpgrade: fromStatus.Sorting < toStatus.Sorting,
							statusProperty: options.statusField,
							ChangeType: type
						});
						updatePurchaseOrder(options).then(function (data) {
							executeWorkflows(workflows, entity.Id, context).then(
								function (wfResult) {
									if (wfResult.canContinue) {
										saveStatus(options, remark).then(function (data) {
											updatePurchaseOrderHistory(options);
											defer.resolve({changed: true, executed: true, entity: data});
										});
									} else {
										defer.resolve({changed: false});
									}
								}, function (error) {
									console.log(error.errmessage);
									platformModalService.showErrorBox($translate.instant('basics.common.poChange.services.exeErrorMsg'), $translate.instant('basics.common.poChange.services.errorHeaderText'));
									rollBackData(options).then(function (data) {
										defer.resolve({changed: true, executed: true, entity: data});
									});
								}
							);
						});
					});
				});
				return defer.promise;
			}

			function rollBackData(options) {
				let oldHeaderDate = {};
				if (options.currentItem.isChangeDate) {
					oldHeaderDate = {
						NewDeliveryDate: $filter('date')(options.currentItem.olddate, 'yyyy-MM-dd'),
						EntityId: options.entity.Id,
					};
				}

				let oldHeaderAddress = {};
				if (options.currentItem.isChangeAddress) {
					oldHeaderAddress = {
						ZipCode: options.currentItem.oldaddress.ZipCode,
						Id: options.currentItem.oldaddress.Id,
						CountryFk: options.currentItem.oldaddress.CountryFk,
						Street: options.currentItem.oldaddress.Street,
						City: options.currentItem.oldaddress.City,
						County: options.currentItem.oldaddress.County,
						StateFk: options.currentItem.oldaddress.StateFk,
						Latitude: options.currentItem.oldaddress.Latitude,
						Longitude: options.currentItem.oldaddress.Longitude,
						AddressLine: options.currentItem.oldaddress.AddressLine,
						Address: options.currentItem.oldaddress.Address,
						AddressModified: options.currentItem.oldaddress.AddressModified,
						UpdatedAt: moment(),
						UpdatedBy: options.currentItem.oldaddress.UpdatedBy
					};
				}

				const POChangeHeaderDto = {
					isChangeDate: options.currentItem.isChangeDate,
					isChangeAddress: options.currentItem.isChangeAddress,
					changeDeliveryDateDto: oldHeaderDate,
					addressEntity: oldHeaderAddress
				};

				return updatePrcItemChange(options, true).then(function () {
					return $http(httpPostObj('procurement/contract/wizard/pochangeheader', POChangeHeaderDto)).then(function (result) {
						result.data;
					});
				});
			}

			function showDialog(options) {
				const d = $q.defer();
				const defaultValue = {
					resizeable: true,
					codeField: 'Code',
					descField: 'Description',
					onReturnButtonPress: function () {
					}
				};

				$.extend(defaultValue, options, {
					templateUrl: globals.appBaseUrl + 'basics.common/partials/pochange/purchase-order-change-dialog.html'
				});

				if (!options.entity || !Object.prototype.hasOwnProperty.call(options.entity, defaultValue.statusField)) {
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
					if (Object.prototype.hasOwnProperty.call(statusCache, options.statusName)) {
						$q.when(statusCache[options.statusName]);
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

			function getChangeSentStatus() {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'procurement/contract/constatus/specificscontatus',
					params: {
						filterValue: 'ISCHANGSENT=true'
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

			function getLeadTime(options) {
				return $http.get(globals.webApiBaseUrl + 'procurement/contract/wizard/getLeadTimeExtraDate?id=' + options.entity.Id)
					.then(function (respon) {
						return respon.data;
					});
			}

			function getCurrentStatusId(options) {
				const deferred = $q.defer();
				const statusId = options.entity[options.statusField];

				if (statusId === null) { // if current status is null, using default status.
					getDefaultStatus(options).then(function (data) {
						if (data) {
							deferred.resolve(data.Id);
						} else {
							deferred.reject('Current data item has no valid or default status!');
						}
					});
				} else {
					deferred.resolve(statusId);
				}

				return deferred.promise;
			}

			function setItemNewQty(options) {
				itemQty.data = options || 0;
			}

			function getItemNewQty() {
				return itemQty.data;
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
						const MainService = config.mainService;
						let dataService = {};
						dataService = config.mainService;
						if (angular.isFunction(config.getItemDataService)) {
							config.itemDataService = config.getItemDataService;
							config.olditemData = config.getItemDataService().getList();
						}

						MainService.updateAndExecute(function () {
							const title = config.title;
							const entity = dataService.getSelected();
							if (platformSidebarWizardCommonTasksService.assertSelection(entity, title)) {
								const options = angular.copy(config);
								options.entity = entity;
								options.headerText = $translate.instant(title);
								if (options.projectField) {
									options.projectId = entity[options.projectField];
								} else if (angular.isFunction(options.getProjectIdFn)) {
									options.projectId = options.getProjectIdFn();
								}

								options.imageSelector = 'platformStatusIconService';
								getLeadTime(options).then(function (lendTime) {
									options.currentItem = {
										changeType: poChangeTypes.CHG_QTYLIN,
										isChangeQty: true,
										isChangeDate: false,
										isChangeAddress: false,
										isCancelPO: false,
										olddate: entity.DateDelivery,
										leadTime: moment(lendTime),
										oldaddress: entity.AddressEntity,
										newdate: entity.DateDelivery,
										pfChecked: false,
										pfSelectedChecked: false,
										newaddress: entity.AddressEntity,
										itemDataService: options.itemDataService,
										olditemData: options.olditemData,
										IsChecked: false,
										expressFree: '',
										updateQty: 0
									};
									getCurrentStatusId(options).then(function (id) {
										options.fromStatusId = id;
										getChangeSentStatus().then(function (chgStatus) {
											getAvailableStatus(options).then(function (status) {
												let hasPermission = false;
												status.forEach(function (item) {
													if (chgStatus && chgStatus[0].Id === item.Id) {
														hasPermission = true;
														options.toStatusId = item.Id;
													}
												});
												if (hasPermission) {
													showDialog(options).then(function (result) {

														if (angular.isFunction(config.handleSuccess)) {
															config.handleSuccess(result);
															return;
														}
														if (result.changed === true) {
															if (result.executed === true) {
																const mainItem = MainService.getSelected();
																// Refresh the whole data cause we don't know what changes in workflow
																// TODO: workaround save filterRequest temporarily
																const filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
																cloudDesktopSidebarService.filterRequest.pKeys = _.map(MainService.getList(), 'Id');
																MainService.refresh().then(function () {
																	cloudDesktopSidebarService.filterRequest = filterRequest;
																	// Here we need to return a promise,so we use setSelected function
																	MainService.setSelected({}).then(
																		function () {
																			const newEntity = MainService.getItemById(mainItem.Id);
																			MainService.setSelected(newEntity);
																		}
																	);
																});

															} else {
																const item = result.entity;
																const oldItem = entity;

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
													const modalOptions = {
														headerText: $translate.instant('basics.common.poChange.services.modalInfo.headerText'),
														bodyText: $translate.instant('basics.common.poChange.services.modalInfo.bodyText'),
														showOkButton: true,
														iconClass: 'ico-info'
													};
													platformModalService.showDialog(modalOptions);
												}
											});
										});
									});
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

			function updateReadOnly(item, model, value) {
				const editable = getCellEditable(item, model);
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
				setItemNewQty: setItemNewQty,
				getItemNewQty: getItemNewQty
			};

		}]);
})(angular);
