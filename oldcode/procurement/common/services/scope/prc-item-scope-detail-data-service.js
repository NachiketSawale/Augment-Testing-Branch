/**
 * Created by wui on 10/16/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).factory('prcItemScopeDetailDataService', [
		'$q',
		'$http',
		'$injector',
		'platformDataServiceFactory',
		'procurementCommonServiceCache',
		'basicsMaterialScopeUtilityService',
		'prcItemScopeDetailPriceConditionDataService',
		'prcItemScopeItemTextDataService',
		'prcItemScopeDetailTotalProcessor',
		'platformRuntimeDataService',
		'PlatformMessenger',
		'procurementContextService',
		'prcCommonItemCalculationHelperService',
		function ($q,
			$http,
			$injector,
			platformDataServiceFactory,
			procurementCommonServiceCache,
			basicsMaterialScopeUtilityService,
			prcItemScopeDetailPriceConditionDataService,
			prcItemScopeItemTextDataService,
			prcItemScopeDetailTotalProcessor,
			platformRuntimeDataService,
			PlatformMessenger,
			moduleContext,
			prcCommonItemCalculationHelper) {

			function constructorFn(parentService) {
				var prcItemService = parentService.parentService();
				var prcItemServiceName=prcItemService.getServiceName();
				let roundingType = prcCommonItemCalculationHelper.roundingType;
				var serviceContainer;
				var service;
				var setReadonlyor;
				var canItemTypeEdit;
				var serviceOption = {
					flatNodeItem: {
						module: angular.module(moduleName),
						serviceName: prcItemServiceName+'_prcItemScopeDetailDataService',
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/common/item/scope/detail/',
							endCreate: 'createnew'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/common/item/scope/detail/',
							initReadData: function (readData) {
								var mainItem = parentService.getSelected();
								readData.filter = '?mainItemId=' + mainItem.Id + '&projectId=' + prcItemService.getProjectId();
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData (creationData) {
									var materialScope = parentService.getSelected();
									creationData.Id ={
										Id: materialScope.Id,
										PKey1: materialScope.MaterialFk
									};
									creationData.MaxNo = basicsMaterialScopeUtilityService.getMaxInt(service.getList(), 'ItemNo');

								},
								handleCreateSucceeded: function (newData) {
									return newData;
								},
								incorporateDataRead: function incorporateDataRead(readData, data) {
									var readItems = readData.dtoes || readData; // in case from cache
									var Isreadonly = !setReadonlyor();
									var dataRead = serviceContainer.data.handleReadSucceeded(readItems, data, true);
									if (Isreadonly) {
										service.setFieldReadonly(readItems);
									}

									$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
										basicsCostGroupAssignmentService.process(readData, service, {
											mainDataName: 'dtoes',
											attachDataName: 'ScopeDetailCostGroups', // name of MainItem2CostGroup
											dataLookupType: 'ScopeDetailCostGroups',// name of MainItem2CostGroup
											identityGetter: function identityGetter(entity){
												return {
													Id: entity.MainItemId
												};
											},
											isReadonly: moduleContext.isReadOnly
										});
									}]);
									var parentItem =parentService.parentService().getSelected();
									if (parentItem) {
										let itemTypeFk = parentItem.BasItemTypeFk;
										if (itemTypeFk === 7) {
											service.setFieldReadonly(readItems);
										}
									}


									return dataRead;
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'PrcItemScopeDetail',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						translation: {
							uid: 'prcItemScopeDetailDataService',
							title: 'basics.material.scopeDetail.listTitle',
							columns: [
								{
									header: 'cloud.common.entityDescription',
									field: 'Description1Info'
								},
								{
									header: 'basics.material.record.furtherDescription',
									field: 'Description2Info'
								},
								{
									header: 'cloud.common.EntitySpec',
									field: 'SpecificationInfo',
									maxLength: 2000
								},
							],
							dtoScheme: {
								typeName: 'PrcItemScopeDetailDto',
								moduleSubModule: 'Procurement.Common'
							}
						},
						dataProcessor: [prcItemScopeDetailTotalProcessor, {
							processItem: function (item) {
								var prcItem = prcItemService.getSelected();
								item.TotalQuantity = prcCommonItemCalculationHelper.round(roundingType.TotalQuantity, prcItem.Quantity * item.Quantity);
							}
						}]
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				// add the onCostGroupCatalogsLoaded messenger
				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				var readonlyFields = [{field: 'AddressFk', readonly: true},
					{field: 'Address', readonly: true}, {field: 'Batchno', readonly: true},
					{field: 'CommentText', readonly: true}, {field: 'Description1Info', readonly: true},
					{field: 'Description2Info', readonly: true},{field: 'DateRequired', readonly: true},
					{field: 'FactorPriceUnit', readonly: true}, {field: 'HasText', readonly: true},
					{field: 'ItemNo', readonly: true}, {field: 'LicCostGroup1Fk', readonly: true}, {field: 'LicCostGroup2Fk', readonly: true},
					{field: 'LicCostGroup3Fk', readonly: true}, {field: 'LicCostGroup4Fk', readonly: true},
					{field: 'LicCostGroup5Fk', readonly: true}, {field: 'MaterialFk', readonly: true}, {field: 'PaymentTermFiFk', readonly: true},
					{field: 'PaymentTermPaFk', readonly: true},
					{field: 'PrcIncotermFk', readonly: true},
					{field: 'PrcItemScopeFk', readonly: true}, {field: 'PrcPriceConditionFk', readonly: true},
					{field: 'PrcStructureFk', readonly: true},
					{field: 'Price', readonly: true}, {field: 'PriceExtra', readonly: true},
					{field: 'PriceExtraOc', readonly: true}, {field: 'PriceOc', readonly: true}, {field: 'PriceUnit', readonly: true},
					{field: 'PrjCostGroup1Fk', readonly: true},
					{field: 'PrjCostGroup2Fk', readonly: true},
					{field: 'PrjCostGroup3Fk', readonly: true}, {field: 'PrjCostGroup4Fk', readonly: true},
					{field: 'PrjCostGroup5Fk', readonly: true},
					{field: 'Quantity', readonly: true}, {field: 'QuantityAskedFor', readonly: true},
					{field: 'QuantityDelivered', readonly: true}, {field: 'Remark', readonly: true},
					{field: 'ScopeOfSupplyTypeFk', readonly: true},
					{field: 'SpecificationInfo', readonly: true},
					{field: 'SupplierReference', readonly: true},
					{field: 'Trademark', readonly: true}, {field: 'UomFk', readonly: true}, {field: 'UomPriceUnitFk', readonly: true},
					{field: 'UserDefined1', readonly: true}, {field: 'UserDefined2', readonly: true},
					{field: 'UserDefined3', readonly: true}, {field: 'UserDefined4', readonly: true}, {field: 'UserDefined5', readonly: true}];
				service.setFieldReadonly = function(items){
					if(_.isArray(items)){
						_.forEach(items, function(item){
							platformRuntimeDataService.readonly(item, readonlyFields);
						});
					}
				};

				service.getData = function () {
					return serviceContainer.data;
				};

				service.overridePrcItemScope = function (prcItemScope, materialScope) {
					prcItemScope.DescriptionInfo.Translated = materialScope.DescriptionInfo.Translated;
					prcItemScope.DescriptionInfo.Modified = true;
					prcItemScope.BusinessPartnerFk = materialScope.BusinessPartnerFk;
					prcItemScope.SubsidiaryFk = materialScope.SubsidiaryFk;
					prcItemScope.SupplierFk = materialScope.SupplierFk;
					prcItemScope.BusinessPartnerProdFk = materialScope.BusinessPartnerProdFk;
					prcItemScope.SubsidiaryProdFk = materialScope.SubsidiaryProdFk;
					prcItemScope.SupplierProdFk = materialScope.SupplierProdFk;
					prcItemScope.CommentText = materialScope.CommentText;
					prcItemScope.Remark = materialScope.Remark;
					prcItemScope.UserDefined1 = materialScope.UserDefined1;
					prcItemScope.UserDefined2 = materialScope.UserDefined2;
					prcItemScope.UserDefined3 = materialScope.UserDefined3;
					prcItemScope.UserDefined4 = materialScope.UserDefined4;
					prcItemScope.UserDefined5 = materialScope.UserDefined5;
				};

				service.reloadByMatScopeAsync = function (materialId, matScope, prcItemScope) {
					var deferred = $q.defer();

					// clear data first.
					var list = service.getList();
					service.deleteEntities(list);

					var prcItemService = parentService.parentService();
					var prcItem = prcItemService.getSelected();
					var prcHeader = prcItemService.getSelectedPrcHeader();

					$http.post(globals.webApiBaseUrl + 'procurement/common/item/scope/detail/reload', {
						MaterialId: materialId,
						MatScope: matScope,
						PrcItemScopeId: prcItemScope.Id,
						CurrencyId: prcHeader.CurrencyFk || prcHeader.BasCurrencyFk,
						ExchangeRate: prcHeader.ExchangeRate,
						ProjectId: prcHeader.ProjectFk
					}).then(function (response) {
						var newPrcItemScope = response.data.PrcItemScope;
						var newPrcItemScopeDetails = response.data.PrcItemScopeDetailToSave;

						if(!newPrcItemScopeDetails || !newPrcItemScopeDetails.length) {
							service.overridePrcItemScope(prcItemScope, newPrcItemScope);
							deferred.resolve();
							return;
						}

						var pcService = prcItemScopeDetailPriceConditionDataService.getService(service);
						var blobService = prcItemScopeItemTextDataService.getService(service);

						(function each(index) {
							let item = newPrcItemScopeDetails[index];

							serviceContainer.data.handleCreateSucceededWithoutSelect(item.PrcItemScopeDetail, serviceContainer.data);

							if (item.PrcItemScopeDetailPcToSave && item.PrcItemScopeDetailPcToSave.length) {
								item.PrcItemScopeDetailPcToSave.forEach(function (pcItem) {
									pcService.data.itemList.push(pcItem);
									pcService.markItemAsModified(pcItem);
								});

								pcService.data.storeCacheFor(item.PrcItemScopeDetail, pcService.data);
								pcService.recalculate(item.PrcItemScopeDetail, item.PrcItemScopeDetail.PrcPriceConditionFk, item.PrcItemScopeDetailPcToSave);
							}

							if (item.PrcItemScopeDtlBlobToSave && item.PrcItemScopeDtlBlobToSave.length) {
								item.PrcItemScopeDtlBlobToSave.forEach(function (blobItem) {
									blobService.data.itemList.push(blobItem);
									blobService.markItemAsModified(blobItem);
								});

								blobService.data.storeCacheFor(item.PrcItemScopeDetail, blobService.data);
							}

							index++;

							if(index < newPrcItemScopeDetails.length){
								each(index);
							}
							else{
								if(prcItemScope.IsSelected){
									service.sumTotal(prcItem, prcItemScope);
								}
								service.overridePrcItemScope(prcItemScope, newPrcItemScope);
								deferred.resolve();
							}
						})(0);
					}, function () {
						deferred.reject();
					});

					return deferred.promise;
				};

				var supplyTypeDeferred = $http.post(globals.webApiBaseUrl + 'basics/customize/ScopeOfSupplyType/list', {filter: ''});

				service.sumTotal = function (prcItem, prcItemScope) {
					var currentParentItem = serviceContainer.data.currentParentItem;

					// scope selection change
					if (currentParentItem !== prcItemScope) {
						service.registerListLoaded(onListLoaded);
					}
					else { // same scope selection
						sum();
					}

					function onListLoaded() {
						sum();
						service.unregisterListLoaded(onListLoaded);
					}

					function sum() {
						$q.when(supplyTypeDeferred).then(function (res) {

							var result = {
								total: 0,
								totalOc: 0,
								price: 0,
								priceOc: 0,
								priceExtra: 0,
								priceExtraOc: 0
							};
							var list = service.getList();
							var prcItemService = parentService.parentService();
							var scopeOfSupplyTypes = res.data;
							var scopeOfSupplyTypeIds = [];

							if (scopeOfSupplyTypes && scopeOfSupplyTypes.length) {
								scopeOfSupplyTypeIds = scopeOfSupplyTypes.filter(function (item) {
									return item.Ispricecomponent;
								}).map(function (item) {
									return item.Id;
								});
							}

							list.filter(function (item) {
								return scopeOfSupplyTypeIds.indexOf(item.ScopeOfSupplyTypeFk) !== -1;
							}).forEach(function (item) {
								result.total += item.Total;
								result.totalOc += item.TotalCurrency;
								result.price += item.Price;
								result.priceOc += item.PriceOc;
								result.priceExtra += item.PriceExtra;
								result.priceExtraOc += item.PriceExtraOc;
							});

							if(prcItemScope.IsSelected && prcItem.HasScope) {
								var isResetGross = true;
								prcItem.Price = prcCommonItemCalculationHelper.round(roundingType.Price, result.total);
								prcItem.PriceOc = prcCommonItemCalculationHelper.round(roundingType.PriceOc, result.totalOc);
								prcItemService.calculateTotal(prcItem, isResetGross);
								prcItemService.gridRefresh();
							}

							prcItemScope.Price = result.price;
							prcItemScope.PriceOc = result.priceOc;
							prcItemScope.PriceExtra = result.priceExtra;
							prcItemScope.PriceExtraOc = result.priceExtraOc;
							prcItemScope.Total = result.total;
							prcItemScope.TotalCurrency = result.totalOc;
							parentService.gridRefresh();

							return result;
						});
					}
				};

				service.resetTotal = function (prcItem) {
					var prcItemService = parentService.parentService();
					if(prcItem.OrginalPrcItem) {
						var isResetGross = true;
						prcItem.Price = prcItem.OrginalPrcItem.Price;
						prcItem.PriceOc = prcItem.OrginalPrcItem.PriceOc;
						prcItemService.calculateTotal(prcItem, isResetGross);
						prcItemService.gridRefresh();
						prcItem.OrginalPrcItem=null;
					}
				};

				parentService.isSelectedChanged.register(function (e, args) {
					var prcItem = args.prcItem;
					if(prcItem.HasScope){
						service.sumTotal(prcItem, args.itemScope);
					}
					else{
						service.resetTotal(prcItem);
					}

					platformRuntimeDataService.readonly(prcItem, [{field: 'Price', readonly: prcItem.HasScope}, {field: 'PriceOc', readonly: prcItem.HasScope}]);
				});

				prcItemService.onQuantityChanged.register(function (args) {
					var list = service.getList();
					list.forEach(function (item) {
						item.TotalQuantity = prcCommonItemCalculationHelper.round(roundingType.TotalQuantity, item.Quantity * args.newValue);
					});
					service.gridRefresh();
				});

				setReadonlyor = function () {
					var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
					if (getModuleStatusFn) {
						var status = getModuleStatusFn();
						return !(status.IsReadOnly || status.IsReadonly);
					}
					return false;
				};
				canItemTypeEdit = function () {
					var prcItem =parentService.parentService().getSelected();
					var parentItem =parentService.getSelected();
					if (prcItem && parentItem) {
						let itemTypeFk = prcItem.BasItemTypeFk;
						if (itemTypeFk === 7) {
							return false;
						} else {
							return true;
						}
					}
					return false;
				};
				service.getModuleState = function () {
					return parentService.getModuleState();
				};
				service.getReadOnly = function () {
					return !setReadonlyor();
				};
				var canCreate = service.canCreate;
				service.canCreate = function () {
					return canCreate() && setReadonlyor() && canItemTypeEdit();
				};
				var canDelete = service.canDelete;
				service.canDelete = function () {
					return canDelete() && setReadonlyor() && canItemTypeEdit();
				};

				service.readonlyFieldsByItemType=(entity,itemTypeFk,g)=>{
					let columns = Object.keys(entity);
					_.forEach(columns, (item) => {
						if(itemTypeFk=== 7){
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);}else{
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
						}
					});
				};

				service.updateToolsEvent = new PlatformMessenger();
				return service;
			}

			return procurementCommonServiceCache.registerService(constructorFn, 'prcItemScopeDetailDataService');
		}
	]);

})(angular);