
(function (angular) {
	'use strict';

	let moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqPartialreqAssignedDataDirectiveDataService', [
		'$q', 'platformDataServiceFactory', 'globals', '_','procurementRfqMainService', 'procurementRfqBusinessPartnerService', 'procurementRfqPartialreqAssignedDataService',
		'basicsLookupdataLookupDescriptorService', 'procurementRfqRequisitionService', '$http',
		function ($q, platformDataServiceFactory, globals, _,procurementRfqMainService, procurementRfqBusinessPartnerService, procurementRfqPartialreqAssignedDataService,
			basicsLookupdataLookupDescriptorService, procurementRfqRequisitionService, $http) {
			let dataCache = {};
			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementRfqPartialreqAssignedDataDirectiveDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/rfq/partialreqassigned/',
					endRead: 'tree',
					usePostForRead:true,
					initReadData: function initReadData(readData) {
						let rfqHeader = procurementRfqMainService.getSelected();
						let bidderData=procurementRfqBusinessPartnerService.getSelected();
						readData.RfqHeaderFk = rfqHeader ? rfqHeader.Id : -1;
						readData.BusinesspartnerFk= bidderData ? bidderData.BusinessPartnerFk : -1;
						if (readData.BusinesspartnerFk > 0) {
							dataCache[readData.BusinesspartnerFk] = [];
						}
					}
				},
				presenter: {
					tree: {
						parentProp: 'Pid',
						childProp: 'Children',
						incorporateDataRead: incorporateDataRead
					}
				},
				entitySelection: {},
				modification: {},
				actions: {
					delete: false,
					create: false
				}
			};
			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;
			let data = container.data;
			service.storeChanges = storeChanges;
			procurementRfqBusinessPartnerService.businessPartnerFkChanged.register(onBusinessPartnerFkChanged);
			procurementRfqBusinessPartnerService.registerListLoaded(onRfqBusinessPartnerListLoaded);
			procurementRfqRequisitionService.registerEntityDeleted(onRfqRequisitionDeleted);
			procurementRfqRequisitionService.reqHeaderFkChanged.register(onRfqRequisitionUpdated);
			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			service.getSelectedCodeAsync = getSelectedCodeAsync;
			service.getSelectedCode = getSelectedCode;
			service.getSelectedData = getSelectedData;
			service.clearData = clearData;
			service.loadData = loadData;
			service.validationService = {
				validateIsSelect: function (item, value, model) {
					let result = {apply: true, valid: true};
					let list = service.getList();
					if (!value) {
						var countObj = _.countBy(list, function (item) {
							return item[model];
						});

						if (countObj.true === 1) {
							result.apply = false;
							return result;
						}
						return result;
					}

					_.forEach(list, function (data) {
						if (data.Id === item.Id) {
							return;
						}

						if (item.Pid && (data.Id === item.Pid || data.Pid === item.Pid)) {
							data.IsSelect = false;
							return;
						}

						if (!item.Pid && data.Pid === item.Id) {
							data.IsSelect = false;
						}
					});

					service.gridRefresh();
					return result;
				}
			};
			service.dragDropDataHandler = dragDropDataHandler;
			return service;

			// /////////////////
			function incorporateDataRead(readData, data) {
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
				if (readData.Main.length > 0) {
					dataCache[readData.Main[0].BusinessPartnerFk] = readData.Main;
				}
				return data.handleReadSucceeded(readData.Main, data);
			}

			function storeChanges() {
				let list = service.getList();
				let partialList = procurementRfqPartialreqAssignedDataService.getList();
				let parentService = procurementRfqPartialreqAssignedDataService.parentService();
				let parentSelectedItem = parentService.getSelected();
				if (!parentSelectedItem || list.length === 0) {
					return;
				}

				let baseItems = [];
				let selectedBaseItems = [];
				let selectedVariantItems = [];
				_.forEach(list, function (item) {
					if (item.Id > 0) {
						baseItems.push(item);
						if (item.IsSelect) {
							selectedBaseItems.push(item);
						}
					}
					else if (item.IsSelect) {
						selectedVariantItems.push(item);
					}
				});

				if (baseItems.length === selectedBaseItems.length) {
					_.forEach(partialList, function (partial) {
						procurementRfqPartialreqAssignedDataService.deleteItem(partial);
					});

					return;
				}

				let selectedItems = selectedBaseItems.concat(selectedVariantItems);
				var newId = -1;
				_.forEach(selectedItems, function (item) {
					let foundItem = _.find(partialList, {RfqHeaderFk: item.RfqHeaderFk, BpdBusinessPartnerFk: parentSelectedItem.BusinessPartnerFk, ReqHeaderFk: item.ReqHeaderId});
					if (foundItem) {
						if (foundItem.ReqVariantFk !== item.ReqVariantId) {
							foundItem.ReqVariantFk = item.ReqVariantId;
							procurementRfqPartialreqAssignedDataService.markItemAsModified(foundItem);
						}
					}
					else {
						let newItem = {Id: newId--, RfqHeaderFk: item.RfqHeaderFk, BpdBusinessPartnerFk: parentSelectedItem.BusinessPartnerFk, ReqHeaderFk: item.ReqHeaderId, ReqVariantFk: item.ReqVariantId, Version: 0};
						procurementRfqPartialreqAssignedDataService.createItem(newItem);
					}
				});

				_.forEach(partialList, function (partial) {
					let foundItem = _.find(selectedItems, {RfqHeaderFk: partial.RfqHeaderFk, BusinessPartnerFk: parentSelectedItem.BusinessPartnerFk, ReqHeaderId: partial.ReqHeaderFk});
					if (!foundItem) {
						procurementRfqPartialreqAssignedDataService.deleteItem(partial);
					}
				});
			}

			function onBusinessPartnerFkChanged(e, args) {
				if (!args || !args.businessPartnerFk) {
					return;
				}

				dataCache[args.businessPartnerFk] = [];
				let list = service.getList();
				if (list && list.length > 0 && list[0].BusinessPartnerFk === args.businessPartnerFk) {
					service.setList([]);
				}
			}

			function getSelectedCode(dataContext) {
				if (!dataContext || !dataContext.BusinessPartnerFk) {
					return '';
				}

				let businessPartnerFk = dataContext.BusinessPartnerFk;
				let tree = dataCache[businessPartnerFk];
				if (!tree || tree.length === 0) {
					return '';
				}
				return doGetSelectedCode(tree);
			}

			function getListAsync(dataContext) {
				if (!dataContext || !dataContext.BusinessPartnerFk) {
					return $q.when([]);
				}
				let businessPartnerFk = dataContext.BusinessPartnerFk;
				let rfqHeaderFk = dataContext.RfqHeaderFk;
				return $http.post(globals.webApiBaseUrl + 'procurement/rfq/partialreqassigned/tree',
					{
						RfqHeaderFk: rfqHeaderFk,
						BusinesspartnerFk: businessPartnerFk
					})
					.then(function (response) {
						if (!response || !response.data) {
							return [];
						}
						dataCache[businessPartnerFk] = [];
						return data.onReadSucceeded(response.data, data);
					});
			}

			function getSelectedCodeAsync(dataContext) {
				if (!dataContext || !dataContext.BusinessPartnerFk) {
					return $q.when('');
				}

				let businessPartnerFk = dataContext.BusinessPartnerFk;
				let rfqHeaderFk = dataContext.RfqHeaderFk;
				let tree = dataCache[businessPartnerFk];

				if (!tree) {
					return getListAsync({
						RfqHeaderFk: rfqHeaderFk,
						BusinessPartnerFk: businessPartnerFk
					}).then(function (data) {
						return doGetSelectedCode(data);
					});
				}
				else {
					if (tree.length === 0) {
						return $q.when('');
					}
					return $q.when(doGetSelectedCode(tree));
				}
			}

			function doGetSelectedCode(tree) {
				let flatten = [];
				container.data.flatten(tree, flatten, serviceOption.presenter.tree.childProp);
				let selectedMember = '';
				let selectedBaseCount = 0;
				let baseCount = 0;
				let reqHeaders = basicsLookupdataLookupDescriptorService.getData('ReqHeaderLookupView');
				_.forEach(flatten, function (item) {
					if (item.Id > 0) {
						baseCount++;
					}
					if (!item.IsSelect) {
						return;
					}
					let code = null;
					let reqHeader = reqHeaders[item.ReqHeaderFk];
					if (reqHeader) {
						code = reqHeader.Code;
					}

					if (code) {
						selectedMember += code + ';';
					}
					if (item.Id > 0) {
						selectedBaseCount++;
					}
				});

				return baseCount === selectedBaseCount ? '' : selectedMember;
			}

			function getSelectedData() {
				let rfqBp = procurementRfqBusinessPartnerService.getSelected();
				if (!rfqBp || !rfqBp.BusinessPartnerFk) {
					return [];
				}

				let tree = dataCache[rfqBp.BusinessPartnerFk];
				if (!tree || tree.length === 0) {
					return;
				}

				let flatten = [];
				container.data.flatten(tree, flatten, serviceOption.presenter.tree.childProp);
				return _.filter(flatten, {IsSelect: true});
			}

			function clearData() {
				let rfqBp = procurementRfqBusinessPartnerService.getSelected();
				if (!rfqBp || !rfqBp.BusinessPartnerFk) {
					return;
				}

				let tree = dataCache[rfqBp.BusinessPartnerFk];
				if (!tree || tree.length === 0) {
					return;
				}
				let flatten = [];
				container.data.flatten(tree, flatten, serviceOption.presenter.tree.childProp);
				_.forEach(flatten, function (item) {
					item.IsSelect = item.Id > 0;
				});
				procurementRfqPartialreqAssignedDataService.clearData()
					.then(function (result) {
						if (result) {
							procurementRfqBusinessPartnerService.gridRefresh();
						}
					});
			}

			function onRfqBusinessPartnerListLoaded() {
				dataCache = {};
				procurementRfqBusinessPartnerService.gridRefresh();
			}

			function onRfqRequisitionUpdated(e, args) {
				if (!args || !args.entity) {
					return;
				}
				let entity = angular.copy(args.entity);
				doRfqRequisitionChanged(entity);
			}

			function onRfqRequisitionDeleted(e, args) {
				doRfqRequisitionChanged(args);
			}

			function doRfqRequisitionChanged(orginalEntity) {
				if (!orginalEntity) {
					return;
				}

				if (!dataCache) {
					dataCache = {};
					return;
				}

				for (var prop in dataCache) {
					if (!Object.hasOwn(dataCache, prop)) {
						return;
					}
					let tree = dataCache[prop];
					if (!tree || tree.length === 0) {
						return;
					}

					if (angular.isArray(orginalEntity)) {
						_.forEach(orginalEntity, function (rfqReq) {
							if (rfqReq.Pid) {
								return;
							}
							tree = _.filter(tree, function (item) {
								return item.ReqHeaderId !== rfqReq.ReqHeaderFk;
							});
						});
					} else if (angular.isObject(orginalEntity)) {
						tree = _.filter(tree, function (item) {
							return item.ReqHeaderId !== orginalEntity.ReqHeaderFk;
						});
					}

					dataCache[prop] = tree;
				}
				procurementRfqBusinessPartnerService.gridRefresh();
			}

			function loadData() {
				let promises = [];
				promises.push(service.load());
				promises.push(procurementRfqPartialreqAssignedDataService.loadSubItemList());
				return $q.all(promises);
			}

			function dragDropDataHandler(sourceItems, targetItemBpFk) {
				if (!sourceItems || sourceItems.length === 0 || !targetItemBpFk || targetItemBpFk <= 0) {
					return;
				}

				procurementRfqMainService.update()
					.then(function (validationResult) {
						if (_.isBoolean(validationResult) && !validationResult) {
							return false;
						}

						let rfqHeaderFk = sourceItems[0].RfqHeaderFk;
						let promises = [];
						let dataContext = {RfqHeaderFk: rfqHeaderFk, BusinessPartnerFk: targetItemBpFk};
						promises.push(getListAsync(dataContext));
						promises.push(procurementRfqPartialreqAssignedDataService.getListAsync(dataContext));
						return $q.all(promises);
					})
					.then(function (result) {
						if (_.isBoolean(result) && !result) {
							return;
						}
						let rfqReqs = procurementRfqRequisitionService.getList();
						let list = service.getList();
						_.forEach(sourceItems, function (item) {
							item.IsSelect = true;
							item.BusinessPartnerFk = targetItemBpFk;
							if (item.Id > 0) {
								item.ReqHeaderId = item.ReqHeaderFk;
								item.ReqVariantId = null;
							} else {
								let baseItem = _.find(rfqReqs, function (rfqReq) {
									return rfqReq.Id === item.Pid;
								});
								if (!baseItem) {
									return;
								}
								item.ReqHeaderId = baseItem.ReqHeaderFk;
								item.ReqVariantId = -item.ReqHeaderFk;
							}

							service.validationService.validateIsSelect(item, true, 'IsSelect');
							let found = _.find(list, {Id: item.Id});
							if (found) {
								found.IsSelect = item.IsSelect;
							}
						});

						storeChanges();
						procurementRfqMainService.update()
							.finally(function () {
								procurementRfqBusinessPartnerService.gridRefresh();
							});
					});
			}
		}
	]);
})(angular);