/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateMainSplitLineItemQuantityDialogService
	 * @function
	 *
	 * @description
	 * This is the data service to split LineItem by Percentage and Quantity.
	 */
	angular.module(moduleName).factory('estimateMainSplitLineItemQuantityDialogService',
		['$q', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'platformDataValidationService', 'PlatformMessenger', 'platformRuntimeDataService', 'estimateMainService',
			function ($q, $http, $injector, $translate, platformDataServiceFactory, platformDataValidationService, PlatformMessenger, platformRuntimeDataService, estimateMainService) {

				let service = {
					listLoaded: new PlatformMessenger(),
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					getList: getList,
					assignReference: assignReference,
					createSplitLineItem: createSplitLineItem,
					getMainItem: getMainItem,
					getMainItemId: getMainItemId,
					addItems: addItems,
					getDataItem: getDataItem,
					setDataList: setDataList,
					refreshGrid: refreshGrid,
					parentService: parentService,
					getSplitLineItems: getSplitLineItems,
					calculateSplitQuantity: calculateSplitQuantity,
					canSplitSelected: canSplitSelected,
					markItemAsModified: null,
					processDataToUpdate: processDataToUpdate,
					saveSplitLineItems: saveSplitLineItems,
					recalculateItems:recalculateItems
				};
				let dataList  =[];
				let mainItem;
				let dataToUpdate = {};
				let quantityPercent = 1;

				let estimateSplitLineItemQuantityServiceOptions = {
					module: estimateMainModule,
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainSplitLineItemQuantityDialogService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					},
					entitySelection: {}
				};

				let container = platformDataServiceFactory.createNewComplete(estimateSplitLineItemQuantityServiceOptions);
				container.data.usesCache = false;
				container.service.markItemAsModified = null;
				angular.extend(service, container.service);

				function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				}

				function unregisterListLoaded(callBackFn) {
					service.listLoaded.unregister(callBackFn);
				}

				function getList(){
					return  dataList;
				}

				function getMainItemId(item){
					if(!item){
						return null;
					}
					if(item.IsMainItem){
						return item.MainId;
					}else{
						let baseItem = _.find(dataList, {IsMainItem : true});
						return baseItem ? baseItem.MainId : null;
					}
				}

				function getMainItem(){
					return mainItem;
				}

				function createSplitLineItem (entity, doCreateRefItem,applySplitResultTo){
					if(!entity){
						return;
					}

					if(entity.QuantityPercent === 100){
						entity.QuantityTotal = mainItem.QuantityTotal;
						entity.RemainingQuantity = 0;
						setList([mainItem, entity]);
					}else{
						let splitItem =  angular.copy(entity);
						splitItem.IsMainItemToSplit = false;
						let totalSplitQuantity = getTotalSplitQuantity();

						if(totalSplitQuantity !== mainItem.QuantityTotal){
							entity.RemainingQuantity = mainItem.QuantityTotal - totalSplitQuantity;
							if(entity.RemainingQuantity <= 0){
								entity.QuantityTotal = entity.QuantityTotal + entity.RemainingQuantity;
								entity.RemainingQuantity = 0;
								entity.QuantityPercent = entity.QuantityTotal / mainItem.QuantityTotal * 100;
								service.addItems([entity]);
							}else {
								splitItem.Id = -1;

								if(applySplitResultTo ==='Quantity'){
									let entityQuantityPercent = (entity.QuantityTotal / mainItem.QuantityTotal).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
									entity.SplitDifference = (( entityQuantityPercent * mainItem.QuantityTotal)- entity.QuantityTotal).toFixed(3) - 0;

									quantityPercent = quantityPercent-entityQuantityPercent;
									splitItem.QuantityPercent = quantityPercent * 100;
									splitItem.QuantityTotal = entity.RemainingQuantity;
									splitItem.SplitDifference = ((quantityPercent * mainItem.QuantityTotal) -splitItem.QuantityTotal).toFixed(3) - 0;
								}else{
									entity.SplitDifference =0;
									splitItem.SplitDifference =0;
									splitItem.QuantityPercent = entity.RemainingQuantity / mainItem.QuantityTotal * 100;
									splitItem.QuantityTotal = entity.RemainingQuantity;
								}
								splitItem.RemainingQuantity = 0;
								splitItem.EstLineItemFk = doCreateRefItem && !splitItem.IsMainItemToSplit ? getMainItemId(mainItem) : null;
								service.addItems([splitItem]);
							}
						}
					}
				}

				function recalculateItems(result){
					let quantityPercent = 1;

					let splittedItems = service.getSplitLineItems();
					if(splittedItems.length <= 1){
						return;
					}
					splittedItems.forEach((entity, key, arr) => {
						if(entity && !entity.IsMainItem){
							if(result.applySplitResultTo ==='Quantity'){
								if (Object.is(arr.length - 1, key)) {
									entity.SplitDifference = (( quantityPercent * mainItem.QuantityTotal)- entity.QuantityTotal).toFixed(3) - 0;
									entity.QuantityPercent = quantityPercent * 100;
								}else{
									let entityQuantityPercent = (entity.QuantityTotal / mainItem.QuantityTotal).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
									entity.SplitDifference = (( entityQuantityPercent * mainItem.QuantityTotal)- entity.QuantityTotal).toFixed(3) - 0;
									quantityPercent = quantityPercent-entityQuantityPercent;
									entity.QuantityPercent = entityQuantityPercent * 100;
								}
							}else{
								entity.SplitDifference = 0;
								entity.QuantityPercent = entity.QuantityTotal / mainItem.QuantityTotal * 100;
							}
						}
					});

					service.refreshGrid();
				}

				function processItems(items){
					angular.forEach(items, function(item){
						processItem(item);
					});
				}

				function processItem(item){
					let isMainItem = item && !!item.IsMainItem;
					if(isMainItem){
						let fields = [
							{field: 'QuantityPercent', readonly: isMainItem},
							{field: 'QuantityTotal', readonly: isMainItem},
							{field: 'BoqItemFk', readonly: isMainItem},
							{field: 'MdcControllingUnitFk', readonly: isMainItem},
							{field: 'PsdActivityFk', readonly: isMainItem},
							{field: 'PrjLocationFk', readonly: isMainItem}];

						if (isMainItem && item.__rt$data && _.isArray(item.__rt$data.readonly)){
							item.__rt$data.readonly = fields;
						}
						platformRuntimeDataService.readonly(item, fields);
					}else{
						item.__rt$data.readonly = [];
					}
				}

				function hasPackageRes(lineItem){
					let allResources =  $injector.get('estimateMainResourceService').getList();
					let resourceList = allResources && allResources.length ? _.filter(allResources, {EstLineItemFk : lineItem.Id, EstHeaderFk : lineItem.EstHeaderFk}) : [];
					if(resourceList.length){
						let packageRes =  _.find(resourceList, function(item){
							return item && item.PrcPackageFk;
						});
						return !!packageRes;
					}
					return false;
				}

				function getTotalSplitQuantity(){
					let totalSplitQuantity = 0;
					let splittedItems = service.getSplitLineItems();
					angular.forEach(splittedItems, function(item){
						if(item && !item.IsMainItem){
							totalSplitQuantity += item.QuantityTotal;
						}
					});
					return totalSplitQuantity;
				}

				function assignReference(doSplitAsReference){
					let splitItems = service.getSplitLineItems();
					angular.forEach(splitItems, function (item){
						if(item){
							item.EstLineItemFk = doSplitAsReference && !item.IsMainItemToSplit ? getMainItemId(mainItem) : item.EstLineItemFk;
						}
					});
					service.gridRefresh();
				}

				function setList(items) {
					dataList = _.isArray(items) ? items : [];
					processItems(dataList);
					container.data.itemList = dataList;
					service.refreshGrid();
				}

				function updateMainItems(selectedLineItem){
					if(selectedLineItem && selectedLineItem.Id){
						mainItem = angular.copy(selectedLineItem);
						let itemToSplit = angular.copy(mainItem);
						mainItem.cssClass = 'row-readonly-background';
						mainItem.QuantityPercent = 100;
						mainItem.QuantityTotal = selectedLineItem.QuantityTotal;
						mainItem.IsMainItem = true;
						mainItem.MainId = selectedLineItem.Id;
						itemToSplit.QuantityPercent = 100;
						itemToSplit.QuantityTotal = selectedLineItem.QuantityTotal;
						itemToSplit.IsMainItemToSplit = true;
						dataList = [];
						quantityPercent = 1;
						service.addItems([mainItem, itemToSplit]);
					}
				}

				function addItems(items) {
					if (items === null) {
						return;
					}
					dataList = _.isArray(dataList) ? dataList : [];
					angular.forEach(items, function(item){
						if(item){
							let matchedItem = _.find(dataList, {Id:item.Id});
							if(matchedItem && !matchedItem.IsMainItem){
								angular.extend(matchedItem, item);
							}else{
								dataList.push(item);
							}
						}
					});
					let cnt = 0;
					angular.forEach(dataList, function(item){
						if(item){
							item.Id = ++cnt;
						}
					});
					processItems(dataList);
					container.data.itemList = dataList;

					service.refreshGrid();
				}

				function getDataItem() {
					return dataList;
				}

				function setDataList (isWizardOpen) {
					if(isWizardOpen){
						let selectedLineItem = estimateMainService.getSelected();
						updateMainItems(selectedLineItem);
					}else{
						dataList= [];
						quantityPercent = 1;
					}
				}

				function refreshGrid() {
					service.listLoaded.fire();
				}

				function parentService (){
					return estimateMainService;
				}

				function getSplitLineItems() {
					return _.filter(dataList, function(item){
						return item && !item.IsMainItem;
					});
				}

				function calculateSplitQuantity (data){
					if(!data){
						return;
					}
					let qtyField = data.ApplySplitResultTo;
					let doSplitAsReference = data.DoSplitAsReference;
					let splitItems = data.SplitLineItems;
					let selectedLineItem = data.LineItems && data.LineItems.length ? data.LineItems[0] : estimateMainService.getSelected();

					let map2Detail = {
						Quantity: 'QuantityDetail',
						QuantityTarget: 'QuantityTargetDetail',
						WqQuantityTarget: 'WqQuantityTargetDetail'
					};

					if(qtyField === 'QuantityTarget'){
						let isCalcTotalWithWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();
						qtyField = isCalcTotalWithWq ? 'WqQuantityTarget' : 'QuantityTarget';
					}

					if(map2Detail[qtyField]){
						angular.forEach(splitItems, function (item){
							if(item){
								if(qtyField === 'QuantityTarget' || qtyField === 'WqQuantityTarget'){
									item.QuantityPercent = (item.QuantityTotal / mainItem.QuantityTotal * 100);
									item.QuantityTotal = (item[qtyField] * item.QuantityPercent / 100).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
								}else{
									item.QuantityTotal = (item[qtyField] * item.QuantityPercent / 100).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
								}
								item[qtyField] = item.QuantityTotal;
								item[map2Detail[qtyField]] = item.QuantityTotal.toString();

								item.WqQuantityTarget = qtyField === 'QuantityTarget' ? item.WqQuantityTarget * item.QuantityPercent / 100 : item.WqQuantityTarget;
								item.WqQuantityTarget = item.WqQuantityTarget.toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('WqQuantityTarget')) - 0;
								item.WqQuantityTargetDetail = qtyField === 'QuantityTarget' ? item.WqQuantityTarget.toString() : item.WqQuantityTargetDetail;

								item.QuantityTarget = qtyField === 'WqQuantityTarget' ? item.QuantityTarget * item.QuantityPercent / 100 : item.QuantityTarget;
								item.QuantityTarget = item.QuantityTarget.toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('WqQuantityTarget')) - 0;
								item.QuantityTargetDetail = qtyField === 'WqQuantityTarget' ? item.QuantityTarget.toString() : item.QuantityTargetDetail;

								item.EstLineItemFk = doSplitAsReference && selectedLineItem && !item.IsMainItemToSplit ? selectedLineItem.Id : item.EstLineItemFk;
							}
						});
					}

					let baseSplitItem = _.find(splitItems, {IsMainItemToSplit : true});
					if(baseSplitItem){
						selectedLineItem.Quantity = baseSplitItem.Quantity;
						selectedLineItem.QuantityDetail = baseSplitItem.QuantityDetail;
						selectedLineItem.QuantityTarget = baseSplitItem.QuantityTarget;
						selectedLineItem.QuantityTargetDetail = baseSplitItem.QuantityTargetDetail;
						selectedLineItem.WqQuantityTarget = baseSplitItem.WqQuantityTarget;
						selectedLineItem.WqQuantityTargetDetail = baseSplitItem.WqQuantityTargetDetail;
						selectedLineItem.BoqHeaderFk = baseSplitItem.BoqHeaderFk;
						selectedLineItem.BoqItemFk = baseSplitItem.BoqItemFk;
						selectedLineItem.BoqSplitQuantityFk = baseSplitItem.BoqSplitQuantityFk;
						selectedLineItem.PsdActivityFk = baseSplitItem.PsdActivityFk;
						selectedLineItem.MdcControllingUnitFk = baseSplitItem.MdcControllingUnitFk;
						selectedLineItem.PrjLocationFk = baseSplitItem.PrjLocationFk;
						selectedLineItem.IsGc = baseSplitItem.IsGc;
						selectedLineItem.IsIncluded = baseSplitItem.IsIncluded;
						selectedLineItem.IsFixedPrice = baseSplitItem.IsFixedPrice;
						selectedLineItem.BasUomTargetFk = baseSplitItem.BasUomTargetFk;
						selectedLineItem.DescriptionInfo = baseSplitItem.DescriptionInfo;

						let estimateMainResourceService = $injector.get('estimateMainResourceService');
						let estimateMainCommonService = $injector.get('estimateMainCommonService');
						let resourceList = estimateMainResourceService.getList();
						let originalRes = angular.copy(resourceList);

						angular.forEach(data.SplitLineItems, function(originalsplitItems){
							originalsplitItems.EstResourceEntities = originalRes;
						});

						estimateMainCommonService.calculateLineItemAndResources(selectedLineItem, resourceList);
						estimateMainService.markItemAsModified(selectedLineItem);

						data.SplitLineItems = _.filter(splitItems, function (item) {
							return item && !item.IsMainItemToSplit;
						});
					}
				}

				function canSplitSelected() {
					let canSplit = true;
					let canSplitText = null;

					let selectedItem = estimateMainService.getSelected();
					if (selectedItem && selectedItem.Id) {
						canSplit = selectedItem.QuantityTotal !== 0;

						if (canSplit && !hasPackageRes(selectedItem)) {
							let postData ={
								lineItems:[selectedItem],
								estHeaderFk:estimateMainService.getSelectedEstHeaderId(),
								prjProjectFk:  estimateMainService.getProjectId()
							};
							return $http.post(globals.webApiBaseUrl + 'estimate/main/wizard/haslinktopackageorwip',postData).then(function (response) {
								return response.data ? 'estimate.main.splitLineItemWizard.currentLineItemCanNotSplitText' : null;
							},
							function (/* error */) {
							});
						}
						else {
							canSplitText = 'estimate.main.splitLineItemWizard.currentLineItemCanNotSplitText';
						}
					}else{
						canSplitText = 'estimate.main.noCurrentLineItemSelection';
					}
					return $q.when(canSplitText);
				}

				function processDataToUpdate(data){
					dataToUpdate = angular.copy(data);
					let postData = {
						EstHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
						PrjProjectFk: estimateMainService.getSelectedProjectId() || -1,
						ResultSet: dataToUpdate.estimateScope,
						LineItems: [estimateMainService.getSelected()],
						SplitMethod: dataToUpdate.splitMethod,
						SplitLineItems: dataToUpdate.splitLineItems,
						ApplySplitResultTo: dataToUpdate.applySplitResultTo,
						DoSplitAsReference: dataToUpdate.doSplitAsReference,
						NoRelation: dataToUpdate.noRelation
					};
					service.calculateSplitQuantity(postData);
					dataToUpdate = postData;

					let items = postData.SplitLineItems.concat(postData.LineItems);
					angular.forEach(items, function (item) {
						if (item && dataToUpdate.NoRelation && dataToUpdate.ApplySplitResultTo === 'QuantityTarget') {
							// set relation to no relation
							item.EstQtyRelBoqFk = 3;
							item.EstQtyRelActFk = 3;
							item.EstQtyRelGtuFk = 3;
							item.EstQtyTelAotFk = 3;
						}
					});
				}

				function saveSplitLineItems(){
					if(!dataToUpdate.SplitLineItems || !dataToUpdate.SplitLineItems.length){
						return;
					}

					// Show loading indicator
					let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
					estMainStandardDynamicService.showLoadingOverlay();

					$http.post(globals.webApiBaseUrl + 'estimate/main/wizard/savesplitlineitems', dataToUpdate).then(function (response) {
						dataList = [];
						quantityPercent = 1;
						dataToUpdate = {};
						let lineItems = response.data;

						estMainStandardDynamicService.hideLoadingOverlay();

						if (lineItems && lineItems.length) {
							estimateMainService.addList(lineItems);
							estimateMainService.fireListLoaded();
							$injector.get('estimateMainLineItem2MdlObjectService').callRefresh();
							estimateMainService.callRefresh();
							$injector.get('platformSidebarWizardCommonTasksService').showSuccessfullyDoneMessage($translate.instant('estimate.main.splitLineItemWizard.splitMessage'));
						}else{
							let modalOptions = {
								headerText: $translate.instant('estimate.main.splitLineItemWizard.title'),
								bodyText: $translate.instant('estimate.main.splitLineItemWizard.failSplitByPercentAndQuantity'),
								iconClass: 'warning'
							};
							return $injector.get('platformDialogService').showDialog(modalOptions);
						}
					}, function(){

					});
				}

				return service;
			}]);
})();
