(function (angular) {
	'use strict';
	/* global globals, _ */
	var salesContractModule = 'sales.contract';
	angular.module(salesContractModule).constant('maxInt32Value',0x7fffffff);

	angular.module(salesContractModule).factory('salesContractPaymentScheduleDataService',
		[
			'$http',
			'$injector',
			'$translate',
			'paymentScheduleDataFactory',
			'salesContractService',
			'ordPaymentScheduleReadonlyProcessor',
			'procurementCommonPaymentScheduleFormatterProcessor',
			'basicsLookupdataLookupDescriptorService',
			'platformDataServiceDataProcessorExtension',
			'platformDataServiceSelectionExtension',
			'platformDataServiceActionExtension',
			'prcCommonCalculationHelper',
			'platformModalService',
			'maxInt32Value',
			'ordPaymentScheduleImageProcessor',
			'platformDataServiceEntitySortExtension',
			'platformDataValidationService',
			function (
				$http,
				$injector,
				$translate,
				dataServiceFactory,
				parentService,
				ReadonlyProcessor,
				formatterProcessor,
				basicsLookupdataLookupDescriptorService,
				platformDataServiceDataProcessorExtension,
				platformDataServiceSelectionExtension,
				platformDataServiceActionExtension,
				prcCommonCalculationHelper,
				platformModalService,
				maxInt32Value,
				imageProcessor,
				platformDataServiceEntitySortExtension,
				platformDataValidationService
			) {
				var readonlyProcessor = new ReadonlyProcessor(parentService);
				var itsMainOrderIsBilled = false;
				var filters = [{
					key: 'sales-contract-payment-schedule-billing-filter',
					fn: function (item, entity) {
						return item.OrdHeaderFk === entity.OrdHeaderFk;
					}
				}, {
					key: 'sales-contract-ps-billing-type-filter',
					fn: function (item) {
						return item.IsPaymentSchedule;
					}
				}];
				var serviceInfo = {
					hierarchicalLeafItem: {
						module: angular.module(salesContractModule),
						serviceName: 'salesContractPaymentScheduleDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/contract/paymentschedule/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function (readData) {
								var sel = parentService.getSelected();
								readData.PKey1 = sel.Id;
							}
						},
						presenter: {
							tree: {
								parentProp: 'PaymentScheduleFk',
								childProp: 'ChildItems',
								incorporateDataRead: function incorporateDataRead(responseData, data) {
									var parentSelected = parentService.getSelected();
									service.setPaymentScheduleTotalSetting({
										Code: 'Total',
										PsTotalId: null,
										TotalNetOc: parentSelected ? parentSelected.AmountNetOc : 0,
										TotalGrossOc: parentSelected ? parentSelected.AmountGrossOc : 0,
										hasTotalSetting: responseData.hasTotalSetting,
										paymentScheduleNetOc: responseData.paymentScheduleNetOc,
										paymentScheduleGrossOc: responseData.paymentScheduleGrossOc
									});
									var list = service.setParentTotalPercent(responseData.Main);
									var hasSumLineList = service.addSumLine(list, true);
									itsMainOrderIsBilled = responseData.itsMainOrderIsBilled;
									return data.handleReadSucceeded(hasSumLineList, data);
								},
								initCreationData: initCreationData
							},
							handleCreateSucceeded: function (createItem) {
								setSortingNCodeForNewItem(createItem);
								return createItem;
							}
						},
						actions: {delete: true, create: 'hierarchical',
							canCreateCallBackFunc: ordCanCreateCallBackFunc,
							canDeleteCallBackFunc: ordCanDeleteCallBackFunc
						},
						entityRole: {
							leaf: {
								itemName: 'OrdPaymentSchedule',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						translation: {
							uid: 'salesContractPaymentScheduleDataService',
							title: 'sales.common.paymentSchedule.titleList',
							columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
							dtoScheme: {
								typeName: 'OrdPaymentScheduleDto',
								moduleSubModule: 'Sales.Contract'
							}
						},
						dataProcessor: [readonlyProcessor, formatterProcessor, imageProcessor, {processItem: addAdditionalProperties}]
					}
				};
				var service = dataServiceFactory.getService(parentService, serviceInfo, filters);
				service.createChildItem = null;
				var data = service.getServiceContainerData();
				basicsLookupdataLookupDescriptorService.loadData(['OrdPsStatus', 'prcconfigheader', 'prcconfiguration']);

				data.handleOnCreateSucceeded = function(newItem, data) {
					var existTotal = existFinalLine(newItem.PaymentScheduleFk);
					if (existTotal || (newItem.IsStructure && !newItem.PaymentScheduleFk)) {
						platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
						insertNewItemBeforeTotalLine(data.itemList, newItem, existTotal);
						platformDataServiceActionExtension.fireEntityCreated(data, newItem);
						if (data.itemTree.length > 1) {
							data.itemTree.splice(1, data.itemTree.length-1);
						}
						return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
							function () {
								if (data.newEntityValidator) {
									data.newEntityValidator.validate(newItem);
								}
								data.markItemAsModified(newItem, data);
								return newItem;
							},
							function () {
								data.markItemAsModified(newItem, data);
								return newItem;
							}
						);
					}
					else {
						return createFinalLine(newItem.PaymentScheduleFk).then(function (finalLine) {
							platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
							data.itemList.push(newItem);
							platformDataServiceActionExtension.fireEntityCreated(data, newItem);
							if (data.itemTree.length > 1) {
								data.itemTree.splice(1, data.itemTree.length-1);
							}
							if (finalLine) {
								platformDataServiceDataProcessorExtension.doProcessItem(finalLine, data);
								var parent = finalLine.PaymentScheduleFk ? _.find(data.itemList, {Id: finalLine.PaymentScheduleFk}) : service.getSumLine();
								if (parent && parent.ChildItems) {
									parent.ChildItems.push(finalLine);
								}
								data.itemList.push(finalLine);
								platformDataServiceActionExtension.fireEntityCreated(data, finalLine);
								if (data.itemTree.length > 1) {
									data.itemTree.splice(1, data.itemTree.length-1);
								}
								data.markItemAsModified(finalLine, data);
							}

							return platformDataServiceSelectionExtension.doSelect(newItem, data).then(
								function () {
									if (data.newEntityValidator) {
										data.newEntityValidator.validate(newItem);
									}
									data.markItemAsModified(newItem, data);
									return newItem;
								},
								function () {
									data.markItemAsModified(newItem, data);
									return newItem;
								}
							);
						});
					}
				};

				data.onCreateSucceeded = function onCreateSucceededInTree(newData, data, creationData) {
					var newItem;
					var opt = serviceInfo.hierarchicalLeafItem.presenter;
					if (opt.handleCreateSucceeded) {
						newItem = opt.handleCreateSucceeded(newData, data);
						if (!newItem) {
							newItem = newData;
						}
					} else {
						newItem = newData;
					}
					if (data.addEntityToCache) {
						data.addEntityToCache(newItem, data);
					}
					let parentId = newItem[data.treePresOpt.parentProp];
					parentId = parentId ? parentId : -1;
					if (parentId) {
						let parent = creationData.parent;
						if (!parent) {
							parent = service.getSumLine();
						}
						parent.HasChildren = true;
						if (!parent[data.treePresOpt.childProp]) {
							parent[data.treePresOpt.childProp] = [];
						}
						var childs = parent[data.treePresOpt.childProp];
						if (childs.length && childs[childs.length-1].IsFinal) {
							parent[data.treePresOpt.childProp].splice(-1, 0, newItem);
						}
						else {
							parent[data.treePresOpt.childProp].push(newItem);
						}
						platformDataServiceEntitySortExtension.sortBranchOfTree(parent[data.treePresOpt.childProp], data);
						if (_.isFunction(data.processNewParent)) {
							data.processNewParent(parent, data);
						}
					}
					if (newItem[data.treePresOpt.childProp] && newItem[data.treePresOpt.childProp].length > 0) {
						newItem.HasChildren = true;
					} else {
						newItem.HasChildren = false;
						newItem[data.treePresOpt.childProp] = [];
					}

					return data.handleOnCreateSucceeded(newItem, data);
				};

				service.createEmptySumLine = function createEmptySumLine() {
					return _.merge(service.baseEmptySumLine, { DescriptionInfo: {
							Description: '',
							Translated: ''
						} });
				};

				var originalCreateItem = service.createItem;
				service.createItem = function salesContractPSCreateItem() {
					if (itsMainOrderIsBilled) {
						platformModalService.showMsgBox($translate.instant('sales.common.CannotCreateCallOffPS'), $translate.instant('sales.common.infoTitle'), 'info');
					}
					else {
						originalCreateItem();
					}
				};

				service.createNewParent = function salesContractPSCreateParent() {
					if (itsMainOrderIsBilled) {
						platformModalService.showMsgBox($translate.instant('sales.common.CannotCreateCallOffPS'), $translate.instant('sales.common.infoTitle'), 'info');
					}
					else {
						service.checkCreateParent(createNewParentRequest);
					}
				};

				function getCodeMaxNum() {
					var list = service.getParents();
					var codeMaxNum = 0;
					var codes = (list && list.length) ? _.map(list, function (i) {return i.Code;}) : [];
					_.forEach(codes, function (r) {
						if ((/^(P_)[0-9]+$/).test(r)) {
							r = r.replace(/^(P_){1}/, '');
							var n = parseInt(r);
							if (typeof n === 'number' && n === n && n >= codeMaxNum) {
								codeMaxNum = n;
							}
						}
					});
					return codeMaxNum;
				}

				function createNewParentRequest() {
					var codeMaxNum = getCodeMaxNum();
					var creationData = {
						PKey1: parentService.getSelected().Id,
						PKey3: codeMaxNum ? codeMaxNum : null
					};
					var url = globals.webApiBaseUrl + 'sales/contract/paymentschedule/createparent';
					$http.post(url, creationData)
						.then(function (response) {
							if (data.onCreateSucceeded) {
								return data.onCreateSucceeded(response.data, data, creationData);
							}
							return response.data;
						});
				}

				function deepRemoveEntityFromHierarchy(entity, parent, removeItem, data, service) {
					platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
					data.doClearModifications(entity, data);
					data.itemList = _.filter(data.itemList, function (item) {
						return item.Id !== entity.Id;
					});
					if (removeItem) {
						parent = parent || _.find(data.itemList, {Id: entity[data.treePresOpt.parentProp]});
						if (!parent) {
							parent = service.getSumLine();
						}
						if (parent && parent.Id) {
							parent[data.treePresOpt.childProp] = _.filter(parent[data.treePresOpt.childProp], function (child) {
								return child.Id !== entity.Id;
							});
						}
					}
					if (entity[data.treePresOpt.childProp] && entity[data.treePresOpt.childProp].length > 0) {
						angular.forEach(entity[data.treePresOpt.childProp], function (child) {
							deepRemoveEntityFromHierarchy(child, entity, false, data, service);
						});
					}
				}

				data.doDeepRemove = function deepRemove(deleteParams, removeItem, data) {
					var deleteEntities = deleteParams.entities || [];
					if (deleteParams.entity && deleteParams.entity.Id) {
						deleteEntities.push(deleteParams.entity);
					}
					var service = deleteParams.service;

					_.forEach(deleteEntities, function (entity) {
						deepRemoveEntityFromHierarchy(entity, null, removeItem, data, service);
					});
				};

				var originOnDeleteDone = data.onDeleteDone;
				data.onDeleteDone = function doPrepareDelete(deleteParams, data) {
					originOnDeleteDone(deleteParams, data, null);
					if (deleteParams.entities && deleteParams.entities.length) {
						var children = _.filter(deleteParams.entities, function(i) {return i.PaymentScheduleFk;});
						var parentId = _.map(children, function(i) {return i.PaymentScheduleFk;});
						var uniqParentId = _.uniq(parentId);
						if (uniqParentId && uniqParentId.length) {
							_.forEach(uniqParentId, function (pId) {
								service.banlacingInFinalLine(pId);
								service.resetSumLine(true, pId);
							});
						}
						var notChildren = _.filter(deleteParams.entities, function(i) {return !i.PaymentScheduleFk;});
						if (notChildren && notChildren.length) {
							service.banlacingInFinalLine();
							service.resetSumLine(true);
						}
						service.calculateRemaining(false);
					}
				};

				var customizeSumFields = ['PercentOfContract', 'AmountNet', 'AmountNetOc', 'AmountGross', 'AmountGrossOc',
					'ActualAmountGrossOc', 'ActualAmountGross', 'ActualAmountNetOc', 'ActualAmountNet'];
				service.setSumField(customizeSumFields);

				service.readonlyNoConsiderTotalSetting = function readonlyNoConsiderTotalSetting() {
					var parentItem = parentService.getSelected();
					return !parentItem || !parentItem.Id || !parentItem.Version;
				};

				function calculatePaymentBalanceForList(list) {
					if (list && list.length) {
						var sumNetOfPS = 0, sumGrossOfPS = 0, sumNetOfBIL = 0, sumGrossOfBIL = 0;
						angular.forEach(list, function (item) {
							item.PaymentBalanceNet = 0;
							item.PaymentBalanceGross = 0;
							sumNetOfPS += item.AmountNet;
							sumGrossOfPS += item.AmountGross;
							sumNetOfBIL += item.BilAmountNet;
							sumGrossOfBIL += item.BilAmountGross;
							item.PaymentBalanceNet = sumNetOfPS - sumNetOfBIL;
							item.PaymentBalanceGross = sumGrossOfPS - sumGrossOfBIL;
						});
					}
				}
				service.calculatePaymentBalance = function calculatePaymentBalance(dontRefreshGrid) {
					var allList = service.getListNoSumLine();
					var roots = (allList && allList.length) ? _.filter(allList, function(i) {
						return !i.PaymentScheduleFk;
					}) : null;
					calculatePaymentBalanceForList(roots);
					var children = (allList && allList.length) ? _.filter(allList, function (i) {return i.PaymentScheduleFk;}) : null;
					if (children && children.length) {
						var childrenGroup = _.groupBy(children, 'PaymentScheduleFk');
						_.forEach(childrenGroup, function(c) {
							calculatePaymentBalanceForList(c);
						});
					}
					if (dontRefreshGrid !== true) {
						service.gridRefresh();
					}
				};

				service.copyPaymentBalanceAfterChangeStatus = function copyPaymentBalanceAfterChangeStatus(source, object) {
					object.PaymentBalanceNet = source.PaymentBalanceNet;
					object.PaymentBalanceGross = source.PaymentBalanceGross;
				};

				service.calculatePaymentDifferenceGross = function calculatePaymentDifferenceGross(item) {
					item.PaymentDifferenceGross = item.ActualAmountGross - item.AmountGross;
					item.PaymentDifferenceGrossOc = item.ActualAmountGrossOc - item.AmountGrossOc;
				};

				service.getModuleState = function (item) {
					var res = {};
					res.IsReadonly = $injector.get('salesCommonStatusHelperService').checkIsReadOnly('salesContractStatusLookupDataService', 'OrdStatusFk', item);
					return res;
				};

				service.setNewEntityValidator(
					'OrdPaymentScheduleDto',
					'Sales.Contract',
					['Code', 'BasPaymentTermFk', 'AmountNet', 'AmountGross', 'AmountNetOc', 'AmountGrossOc']
				);

				service.updateCalculation = function updateCalculation() {
					var url = globals.webApiBaseUrl + 'sales/contract/paymentschedule/recalculate';
					var getSelected = parentService.getSelected();
					var valData = {
						PKey1: getSelected.Id
					};
					parentService.update().then(function () {
						$http.post(url, valData
						).then(function (res) {
							if (!res.data) {
								return;
							}
							service.onRecalculated.fire();
							var itemList = data.itemList || [], newItems = res.data;

							_.forEach(newItems, function (updateItem) {
								var oldItem = _.find(itemList, {Id: updateItem.Id});
								if (oldItem) {
									data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, true, data);
								}
							});
							service.resetSumLine(true);
							service.load();
						});
					});
				};

				service.updateReadOnly = function (item) {
					readonlyProcessor.processItem(item);
				};

				service.setFieldsReadOnly = function setFieldsReadOnly(item) {
					readonlyProcessor.setFieldsReadOnly(item);
				};

				service.banlacingInFinalLine = function banlacingInFinalLine(parentId) {
					var finalLine = existFinalLine(parentId);
					if (finalLine) {
						var finalLineObj = getFinalLineValue(parentId);
						finalLine.AmountNet = finalLineObj.AmountNet;
						finalLine.AmountNetOc = finalLineObj.AmountNetOc;
						finalLine.AmountGross = finalLineObj.AmountGross;
						finalLine.AmountGrossOc = finalLineObj.AmountGrossOc;
						finalLine.PercentOfContract = finalLineObj.PercentOfContract;
						finalLine.Remaining = 0;
						finalLine.RemainingOc = 0;
						service.markItemAsModified(finalLine);
					}
				};

				service.isFinalLine = function isFinalLine (item) {
					return item.IsFinal;
				};

				service.getListNoSumLineNFinalLine = function getListNoSumLineNFinalLine() {
					var list = service.getList();
					return list.filter(function(i) {
						return !service.isSumLine(i) && !service.isFinalLine(i);
					});
				};

				service.getParents = function getParents() {
					var list = service.getList();
					return list.filter(function(i) {
						return i.IsStructure && !i.PaymentScheduleFk;
					});
				};

				function initCreationData(creationData) {
					creationData.parent = null;
					creationData.PKey1 = parentService.getSelected().Id;
					var list = service.getListNoSumLine();
					var parentItems = _.filter(list, {PaymentScheduleFk: null, IsStructure: true});
					if (parentItems && parentItems.length) {
						var parentItem = null;
						var selected = service.getSelected();
						if (selected) {
							if (selected.IsStructure && !selected.PaymentScheduleFk) {
								parentItem = selected;
							}
							else {
								parentItem = _.find(parentItems, {Id: selected.PaymentScheduleFk});
							}
						}
						if (!parentItem) {
							if (parentItems && parentItems.length) {
								parentItem = _.maxBy(parentItems, 'Id');
							}
						}
						if (parentItem) {
							creationData.PKey2 = parentItem.Id;
							creationData.parentId = parentItem.Id;
							creationData.parent = parentItem;
						}
					}
				}

				function ordCanCreateCallBackFunc() {
					var parentItem = parentService.getSelected();
					if (!parentItem) {
						return false;
					}

					if (parentIsChangeOrderNIsConsolidate(parentItem)) {
						return false;
					}
					return !!parentItem && !!parentItem.Id;
				}

				function ordCanCreateParentCallBackFunc() {
					var parentItem = parentService.getSelected();
					if (!parentItem) {
						return false;
					}

					if (parentIsChangeOrderNIsConsolidate(parentItem)) {
						return false;
					}
					var list = service.getListNoSumLine();
					if (!list || !list.length) {
						return true;
					}
					var isStructureItems = _.find(list, {IsStructure: true});
					return !!isStructureItems;
				}

				function ordCanDeleteCallBackFunc(item) {
					var ordPsStatuss = basicsLookupdataLookupDescriptorService.getData('OrdPsStatus');
					var isSumLine = service.isSumLine(item);
					if (isSumLine) {
						return false;
					}
					if (item && ordPsStatuss) {
						var ordPsStatus = ordPsStatuss[item.OrdPsStatusFk];
						if (ordPsStatus && ordPsStatus.IsReadonly) {
							return false;
						}
					}
					var parentItem = parentService.getSelected();
					if (!parentItem) {
						return false;
					}
					return !(parentIsChangeOrderNIsConsolidate(parentItem));
				}

				function addAdditionalProperties() {
					service.calculateRemaining(true);
				}

				function getFinalLineValue(parentId) {
					var list = service.getListNoSumLineNFinalLine();
					var parent = parentId ? _.find(list, {Id: parentId}) : null;
					list = parent ? _.filter(list, function (i) {
						return i.PaymentScheduleFk === parentId;
					}) : list;
					var sumAmountNetOc = 0, sumAmountGrossOc = 0, sumPercent = 0;
					var result = {
						AmountNetOc: 0,
						AmountNet: 0,
						AmountGrossOc: 0,
						AmountGross: 0,
						PercentOfContract: 0
					};
					if (list && list.length) {
						_.forEach(list, function (ps) {
							sumPercent += (ps.IsStructure && !ps.PaymentScheduleFk) ? ps.TotalPercent : ps.PercentOfContract;
							sumAmountNetOc += ps.AmountNetOc;
							sumAmountGrossOc += ps.AmountGrossOc;
						});
					}
					if (sumPercent !== 100) {
						var totalSetting = service.getPaymentScheduleTotalSetting();
						var psNetOc = parent ? parent.AmountNetOc : totalSetting.paymentScheduleNetOc;
						var psGrossOc = parent ? parent.AmountGrossOc : totalSetting.paymentScheduleGrossOc;
						var parentSelected = service.parentService().getSelected();
						var rate = parentSelected.ExchangeRate ? parentSelected.ExchangeRate : 1;
						if (sumPercent === 0) {
							result.AmountNetOc = psNetOc / 1;
							result.AmountNet = prcCommonCalculationHelper.round(result.AmountNetOc / rate);
							result.AmountGrossOc = psGrossOc / 1;
							result.AmountGross = prcCommonCalculationHelper.round(result.AmountGrossOc / rate);
							result.PercentOfContract = 100;
						}
						else if (sumPercent > 0 && sumPercent < 100) {
							result.AmountNetOc = prcCommonCalculationHelper.round(psNetOc - sumAmountNetOc);
							result.AmountNet = prcCommonCalculationHelper.round(result.AmountNetOc / rate);
							result.AmountGrossOc = prcCommonCalculationHelper.round(psGrossOc - sumAmountGrossOc);
							result.AmountGross = prcCommonCalculationHelper.round(result.AmountGrossOc / rate);
							result.PercentOfContract = prcCommonCalculationHelper.round(100 - sumPercent);
						}
					}
					return result;
				}

				function existFinalLine(parentId) {
					var list = service.getList();
					parentId = parentId ? parentId : null;
					return _.find(list, {IsFinal: true, PaymentScheduleFk: parentId});
				}

				function createFinalLine(parentId) {
					var url = globals.webApiBaseUrl + 'sales/contract/paymentschedule/createpaymentschedulefinalline';
					var parentSelected = parentService.getSelected();
					var finalLineObj = getFinalLineValue();
					var parameter = {
						OrdHeaderFk: parentSelected.Id,
						AmountNet: finalLineObj.AmountNet,
						AmountNetOc: finalLineObj.AmountNetOc,
						AmountGross: finalLineObj.AmountGross,
						AmountGrossOc: finalLineObj.AmountGrossOc,
						PercentOfContract: finalLineObj.PercentOfContract,
						PaymentScheduleFk: parentId ? parentId : null
					};
					return $http.post(url, parameter
					).then(function (res) {
						return res.data;
					});
				}

				function setCodeForNormalNChild(createItem, entitiesNoSumNFinal) {
					var codeOnlyHasNumberReg = new RegExp(/^[0-9]+$/);
					var isChild = (createItem.IsStructure && createItem.PaymentScheduleFk);
					if (isChild) {
						var parent = _.find(entitiesNoSumNFinal, {Id: createItem.PaymentScheduleFk});
						if (parent) {
							createItem.Code = parent.Code + '.01';
							var siblings = _.filter(entitiesNoSumNFinal, {PaymentScheduleFk: createItem.PaymentScheduleFk});
							if (siblings && siblings.length) {
								var siblingsSubCode = _.map(siblings, function (s) {
									var c = s.Code;
									var splitCode = c.split(parent.Code + '.');
									if (splitCode && splitCode.length > 1 && !splitCode[0]) {
										return splitCode[1].trim();
									}
									return '';
								});
								siblingsSubCode = _.filter(siblingsSubCode, function (i) { return !!i; });
								if (siblingsSubCode && siblingsSubCode.length) {
									var validedSubCode = _.filter(siblingsSubCode, function (c) {
										return codeOnlyHasNumberReg.test(c);
									});
									var subCode = '01';
									if (validedSubCode && validedSubCode.length) {
										validedSubCode.sort(function(x, y) {
											return ((x-0)-(y-0));
										});
										var maxSubCode = validedSubCode[validedSubCode.length - 1];
										subCode = (maxSubCode - 0 + 1);
										subCode  = isNaN(subCode) ? 1 : subCode;
										subCode = subCode < 10 ? '0'+ subCode : subCode + '';
									}
									createItem.Code = parent.Code + '.' + subCode;
								}
							}
						}
					}
					else {
						var validedCodeItems = _.filter(entitiesNoSumNFinal, function (e) {
							return codeOnlyHasNumberReg.test(e.Code);
						});
						createItem.Code = '01';
						if (validedCodeItems && validedCodeItems.length) {
							validedCodeItems.sort(function(x, y) {
								return ((x-0)-(y-0));
							});
							var maxCode = validedCodeItems[validedCodeItems.length - 1].Code;
							createItem.Code = (maxCode - 0 + 1);
							createItem.Code  = isNaN(createItem.Code) ? 1 : createItem.Code;
							createItem.Code = createItem.Code < 10 ? '0'+ createItem.Code : createItem.Code + '';
						}
					}
				}

				function setSortingNCodeForNewItem(createItem) {
					var entities = service.getListNoSumLineNFinalLine();
					var parentSortingInterval = 100;
					var normalSortingInterval = 1;
					var childSortingInterval = 5;
					var isParent = (createItem.IsStructure && !createItem.PaymentScheduleFk);
					if (isParent) {
						var parentList = _.filter(entities, function (e) {
							return (e.IsStructure && !e.PaymentScheduleFk && e.Sorting !== maxInt32Value);
						});
						createItem.Sorting = parentSortingInterval;
						if (parentList && parentList.length) {
							var maxSortingParent = _.maxBy(parentList, function(e) {
								return e.Sorting;
							});
							createItem.Sorting = maxSortingParent.Sorting + parentSortingInterval;
						}
					}
					else {
						var isChild = (createItem.IsStructure && createItem.PaymentScheduleFk);
						if (isChild) {
							var parent = _.find(entities, {Id: createItem.PaymentScheduleFk});
							var parentSorting = parent ? parent.Sorting : 0;
							var siblings = _.filter(entities, function (e) {
								return (e.IsStructure && e.PaymentScheduleFk && e.PaymentScheduleFk === createItem.PaymentScheduleFk && e.Sorting !== maxInt32Value);
							});
							createItem.Sorting = parentSorting + childSortingInterval;
							if (siblings && siblings.length) {
								var maxSortingChild = _.maxBy(siblings, function(e) {
									return e.Sorting;
								});
								createItem.Sorting = maxSortingChild.Sorting + childSortingInterval;
							}
						}
						else {
							var normals = _.filter(entities, function (e) {
								return (!e.IsStructure && !e.PaymentScheduleFk && e.Sorting !== maxInt32Value);
							});
							createItem.Sorting = normalSortingInterval;
							if (normals && normals.length) {
								var maxSortingNormal = _.maxBy(normals, function(e) {
									return e.Sorting;
								});
								createItem.Sorting = maxSortingNormal.Sorting + normalSortingInterval;
							}
						}
						setCodeForNormalNChild(createItem, entities);
					}
				}

				var _updateVarianceToFinalLineInPSSysOpt = null;
				function asyncGetUpdateVarianceToFinalLineSysOpt() {
					var updateVarianceToFinalLineInPSSysOptId = 10075;
					var basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
					return basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(updateVarianceToFinalLineInPSSysOptId).then(function (val) {
						_updateVarianceToFinalLineInPSSysOpt = (val === '1');
						return _updateVarianceToFinalLineInPSSysOpt;
					});
				}
				asyncGetUpdateVarianceToFinalLineSysOpt();

				function insertNewItemBeforeTotalLine(list, newItem, existTotal) {
					if (existTotal) {
						var totalLineIndex = -1;
						_.find(list, function (o, k) {
							if (o.Id === existTotal.Id) {
								totalLineIndex = k;
								return true;
							}
						});
						list.splice(totalLineIndex, 0, newItem);
					}
					else {
						list.push(newItem);
					}
				}

				function configurationIsConsolidateChange(configurationFk) {
					const defaultIsConsolidateChange = true;
					if (!configurationFk) {
						return defaultIsConsolidateChange;
					}

					let isConsolidateChange = defaultIsConsolidateChange;
					const config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: configurationFk});
					if (config) {
						const configHeader = _.find(basicsLookupdataLookupDescriptorService.getData('PrcConfigHeader'), {Id: config.PrcConfigHeaderFk});
						isConsolidateChange = configHeader.IsConsolidateChange;
					}

					return isConsolidateChange;
				}

				function parentIsChangeOrderNIsConsolidate(parentItem) {
					return parentItem && parentItem.OrdHeaderFk && parentItem.PrjChangeFk && service.configurationIsConsolidateChange(parentItem.ConfigurationFk);
				}

				parentService.onUpdateAmounts.register(service.calculateRemaining);
				parentService.onUpdateSucceeded.register(service.calculateRemaining);
				parentService.onUpdateSucceeded.register(service.loadSubItemList);

				service.navigateHelpService = function (item, triggerField){
					let timeoutFun = $injector.get('$timeout');
					if(_.isEmpty(service.getList())){
						timeoutFun(function () {
							service.load().then(navToRule);
						}, 300);
					}else{
						navToRule();
					}

					function navToRule(){
						let pay = _.find(service.getList(), {BilHeaderFk: triggerField.Id});
						service.setSelected(pay);
						let viewId = 'sales.contract.paymentSchedule.list';

						if(service.isSelection(pay)){
							timeoutFun(function (){
								let mainViewService = $injector.get('mainViewService');
								let tabIndex = _.findIndex(mainViewService.getTabs(), {'Id': viewId});
								if (tabIndex > -1 && mainViewService.getActiveTab() !== tabIndex) {
									timeoutFun(function () {
										mainViewService.setActiveTab(tabIndex);
									}, 0);
								}else{
									let config = mainViewService.getCurrentView().Config,
										estAddToContainer = null,
										estViews = [];

									if(config){
										let containers = angular.copy(config.subviews) || [];

										angular.forEach(containers, function (container, ci){
											let views = angular.isArray(container.content) ? container.content : [container.content];
											return angular.forEach(views, function (view, vi) {
												if (view === viewId) {
													estViews.push(view);
													if (vi > 0) {
														let estRuleView = containers[ci].content[vi];
														config.subviews[ci].content.splice(vi, 1);
														config.subviews[ci].content.unshift(estRuleView);
													}
												}
												if (view !== '1') {
													container.index = ci;
													estAddToContainer = container;
												}
											});
										});

										if(estViews.length !== 1){
											estAddToContainer = estAddToContainer || config.subviews[0];
											estAddToContainer.index = estAddToContainer.index || 0;
											let container = config.subviews[estAddToContainer.index];
											config.subviews[estAddToContainer.index].content = angular.isArray(container.content) ? container.content : [container.content];
											config.subviews[estAddToContainer.index].content.unshift(viewId);

											mainViewService.applyConfig(config, false, false);
										}
									}
								}
							});
						}
					}
				};

				service.ifItsMainOrderIsBilled = function () {
					return itsMainOrderIsBilled;
				};

				service.getUpdateVarianceToFinalLine = function() {
					return _updateVarianceToFinalLineInPSSysOpt;
				};

				service.ordCanCreateParentCallBackFunc = ordCanCreateParentCallBackFunc;
				service.configurationIsConsolidateChange = configurationIsConsolidateChange;
				service.parentIsChangeOrderNIsConsolidate = parentIsChangeOrderNIsConsolidate;

				return service;
			}]);

})(angular);