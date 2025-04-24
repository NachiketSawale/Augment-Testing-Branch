(function() {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainPriceAdjustmentDataService', ['$timeout', '_', 'globals', '$q', '$injector', '$http',
		'platformDataServiceFactory', 'estimateMainService', 'boqMainImageProcessor', 'estimateMainBoqStructureDataFactory',
		'estimateMainPriceAdjustmentReadonlyProcessService', 'platformGridAPI', 'boqMainCommonService', 'boqMainItemTypes',
		'boqMainItemTypes2','ServiceDataProcessArraysExtension','estimateMainPriceAdjustmentImageProcess','platformPermissionService','estimateMainBoqService',
		function ($timeout, _, globals, $q, $injector, $http, platformDataServiceFactory, estimateMainService, boqMainImageProcessor, estimateMainBoqStructureDataFactory,
			estimateMainPriceAdjustmentReadonlyProcessService, platformGridAPI, boqMainCommonService, boqMainItemTypes,
			boqMainItemTypes2,ServiceDataProcessArraysExtension,estimateMainPriceAdjustmentImageProcess,platformPermissionService, estimateMainBoqService ) {
			let service = {};

			let priceAdjustments = null;

			let boqTree = null;

			let boqHeader2URB = {};

			let estimateFk = null;

			let $scope = null;

			let boqServiceOption = {
				serviceName: 'estimateMainPriceAdjustmentDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'estimate/main/priceadjustment/',
					endRead: 'getestpriceadjustmentlist',
					initReadData: function (readData) {
						let projectFk = estimateMainService.getSelectedProjectId();
						let estHeaderFk = estimateMainService.getSelectedEstHeaderId();
						if (projectFk && estHeaderFk) {
							readData.filter = '?projectFk=' + projectFk + '&estHeaderFk=' + estHeaderFk;
						}
						return readData;
					}
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'estimate/main/priceadjustment/',
					endUpdate: 'updateestPriceadjustment'
				},
				presenter: {
					tree: {
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems',
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					root: {
						itemName: 'EstimatePriceAdjustmentToSave',
						moduleName: 'estimate.main',
						handleUpdateDone: function (updateData, response, data) {
							if (response.EstimatePriceAdjustmentToSave && response.EstimatePriceAdjustmentToSave.length > 0) {
								let boqList = service.getList();
								_.forEach(response.EstimatePriceAdjustmentToSave, boqItem => {
									let oldBoqItem = _.find(boqList, {Id: boqItem.Id});
									specialMergeBoqItem(oldBoqItem, boqItem);
								});
							}
							data.handleOnUpdateSucceeded(updateData, response, data, true);
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']),boqMainImageProcessor, estimateMainPriceAdjustmentReadonlyProcessService,estimateMainPriceAdjustmentImageProcess],
			};

			function incorporateDataRead(responseData, data) {
				if (!responseData) {
					return data.handleReadSucceeded([], data);
				}

				let boqTree = responseData.boqTree;

				service.setAdjustments(responseData.priceAdjustments);
				service.setBoqHeader2URB(responseData);
				service.setBoqTree(boqTree);
				if (!boqTree) {
					return data.handleReadSucceeded([], data);
				} else {
					let boqList = [];
					$injector.get('cloudCommonGridService').flatten(boqTree, boqList, 'BoqItems');

					// join price adjustment data to boq structure
					_.forEach(boqList, boqItem => {
						angular.extend(boqItem, _.find(responseData.priceAdjustments, {Id: boqItem.Id}));

						if (!boqItem.BoqItemFk) {
							boqItem.BoqItemFk = -1;
						}

						if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
							if (boqItem.AqTenderPrice !== null && boqItem.AqEstimatedPrice !== null && boqItem.AqDeltaPrice === null) {
								boqItem.AqDeltaPrice = boqItem.AqTenderPrice - boqItem.AqEstimatedPrice;
							}
							if (boqItem.WqTenderPrice !== null && boqItem.WqEstimatedPrice !== null && boqItem.WqDeltaPrice === null) {
								boqItem.WqDeltaPrice = boqItem.WqTenderPrice - boqItem.WqEstimatedPrice;
							}
						}
						if (boqMainCommonService.isItem(boqItem)) {
							$injector.get('estimateMainPriceAdjustmentCalculateService').restItemURB(boqItem, service.getReadOnlyURBFiledName(boqItem));
						}
					});

					let vRoot = createRootBoq(boqTree);

					let result = data.handleReadSucceeded([vRoot], data);

					return result;
				}
			}

			service = estimateMainBoqStructureDataFactory.getService('estimateMainPriceAdjustmentDataService', boqServiceOption);

			function asyncCreatePriceAdjustments(count) {
				let estHeaderId = estimateMainService.getSelectedEstHeaderId();
				return $http.get(globals.webApiBaseUrl + 'estimate/main/priceadjustment/create?estHeaderFk=' + estHeaderId + '&count=' + count).then(function (result) {
					return result.data;
				});
			}

			function createRootBoq(boqiItems) {
				let vRoot = {
					Id: -1,
					BoqItems: boqiItems,
					BoqItemFk: null,
					BoqHeaderFk: null,
					HasChildren: boqiItems.length > 0,
					image: 'ico-folder-estimate',
					BoqLineTypeFk: 103,
					WqEstimatedPrice: 0,
					WqAdjustmentPrice: 0,
					WqTenderPrice: 0,
					WqDeltaPrice: 0,
					AqEstimatedPrice: 0,
					AqAdjustmentPrice: 0,
					AqTenderPrice: 0,
					AqDeltaPrice: 0,
					Status: 0
				};

				let estHeader = estimateMainService.getSelectedEstHeaderItem();

				if (estHeader) {
					vRoot.Reference = estHeader.Code;
					vRoot.BriefInfo = {
						Description: estHeader.DescriptionInfo.Description,
						Translated: estHeader.DescriptionInfo.Translated
					};
					vRoot.EstHeaderFk = estHeader.Id;
					vRoot.IsRoot = true;
				}

				_.forEach(boqiItems, function (boqItem) {
					vRoot.WqEstimatedPrice += boqItem.WqEstimatedPrice;
					vRoot.WqAdjustmentPrice += boqItem.WqAdjustmentPrice;
					vRoot.WqTenderPrice += boqItem.WqTenderPrice;
					vRoot.WqDeltaPrice += boqItem.WqDeltaPrice;
					vRoot.AqEstimatedPrice += boqItem.AqEstimatedPrice;
					vRoot.AqAdjustmentPrice += boqItem.AqAdjustmentPrice;
					vRoot.AqTenderPrice += boqItem.AqTenderPrice;
					vRoot.AqDeltaPrice += boqItem.AqDeltaPrice;
				});

				$injector.get('estimateMainPriceAdjustmentCalculateService').restStatus(vRoot);

				return vRoot;
			}

			let totalFields = ['WqEstimatedPrice', 'WqAdjustmentPrice', 'WqTenderPrice', 'WqDeltaPrice'];

			let inverseEntityName = {
				'totalEntity': 'filteredTotalEntity',
				'filteredTotalEntity': 'totalEntity',
			};

			let calculateFields = {
				'WqModificationPercent': (entity, inverseEntity, valuePercent) => {
					valuePercent = valuePercent || 0;
					let rate = valuePercent / 100;
					let adjustmentValue = entity.WqAdjustmentPrice * rate;
					updateEntityFields(entity, adjustmentValue);
					updateInverseEntity(inverseEntity, adjustmentValue);
				},
				'WqTenderPrice': (entity, inverseEntity, tenderPrice) => {
					tenderPrice = tenderPrice || 0;
					if (entity.WqAdjustmentPrice === 0) {
						return;
					}
					let adjustmentValue = tenderPrice - entity.WqAdjustmentPrice;
					let adjustmentRate = (adjustmentValue / entity.WqAdjustmentPrice) * 100;
					entity.WqModificationPercent = adjustmentRate;
					updateEntityFields(entity, adjustmentValue);
					updateInverseEntity(inverseEntity, adjustmentValue);
				},
				'WqModificationAbsolute': (entity, inverseEntity, adjustmentValue) => {
					adjustmentValue = adjustmentValue || 0;
					if (entity.WqAdjustmentPrice === 0) {
						return;
					}
					let adjustmentRate = (adjustmentValue / entity.WqAdjustmentPrice) * 100;
					entity.WqModificationPercent = adjustmentRate;
					updateEntityFields(entity, adjustmentValue);
					updateInverseEntity(inverseEntity, adjustmentValue);
				}
			};

			/**
			 * Special merge for boq item
			 * If WqQuantity or AqQuantity is 0, then WqAdjustmentPrice, WqTenderPrice, WqDeltaPrice, AqAdjustmentPrice, AqTenderPrice, AqDeltaPrice should be reset
			 * @param oldBoq
			 * @param newBoq
			 */
			function specialMergeBoqItem(oldBoq,newBoq) {
				let specialFields = {
					'WqQuantity': ['WqAdjustmentPrice', 'WqTenderPrice', 'WqDeltaPrice'],
					'AqQuantity': ['AqAdjustmentPrice', 'AqTenderPrice', 'AqDeltaPrice'],
				};
				let resetPrice = function (oldItem, newItem, field) {
					newItem[field] = oldItem[field] !== newItem[field] ? oldItem[field] : newItem[field];
				}
				Object.keys(specialFields).forEach(function (key) {
					if (newBoq[key] === 0) {
						specialFields[key].forEach(function (field) {
							resetPrice(oldBoq, newBoq, field);
						});
					}
				});
			}

			function updateEntityFields(entity, adjustmentValue) {
				entity.WqTenderPrice = entity.WqAdjustmentPrice + adjustmentValue;
				entity.WqModificationAbsolute = adjustmentValue;
			}

			function updateInverseEntity(inverseEntity, adjustmentValue) {
				if(inverseEntity.WqAdjustmentPrice === 0) {
					return;
				}
				inverseEntity.WqTenderPrice = inverseEntity.WqAdjustmentPrice + adjustmentValue;
				inverseEntity.WqModificationAbsolute = adjustmentValue;
				inverseEntity.WqModificationPercent = (adjustmentValue / inverseEntity.WqAdjustmentPrice) * 100;
			}

			service.cellChangeFilterData = function(entityName, field) {
				if (!$scope) {
					return;
				}
				let entity = $scope[entityName];
				let inverseEntity = $scope[inverseEntityName[entityName]];
				if (!entity || !inverseEntity) {
					return;
				}
				if($scope.filteredTotalEntity.WqAdjustmentPrice === 0) {
					$timeout(() => {
						service.updateFilterTotalData(service.filterItemList);
					});
					return;
				}

				let fieldHandler = calculateFields[field];
				if (typeof fieldHandler !== 'function') {
					return;
				}
				// update total entity
				fieldHandler(entity, inverseEntity, entity[field]);

				let rate = $scope.filteredTotalEntity.WqModificationPercent / 100;

				// update grid
				service.updateGridItem(rate).then(() => {
					service.update();
				});
			};

			service.updateGridItem = function(rate, itemList, newValue, wqAdjustmentPrice) {
				if (!$scope) {
					return $q.when(null);
				}
				let isNoRefresh = true;
				if (rate === null) {
					isNoRefresh = false;
					let safeAdjustmentPrice = wqAdjustmentPrice || 0;
					let safeNewValue = newValue || 0;

					if (safeAdjustmentPrice !== 0) {
						rate = (safeNewValue - safeAdjustmentPrice) / safeAdjustmentPrice;
					} else {
						rate = 0;
					}
				}

				let modifyItems = [];
				let processedIds = new Set();

				let isEligibleItem = (item) =>
					!boqMainCommonService.isDivisionOrRoot(item) &&
					(item.WqEstimatedPrice !== 0 || item.WqAdjustmentPrice !== null) &&
					!processedIds.has(item.Id);

				let processItem = (item) => {
					if (item.HasChildren) {
						item.BoqItems.forEach(processItem);
					} else if (isEligibleItem(item)) {
						let price = item.WqAdjustmentPrice !== null ? item.WqAdjustmentPrice : item.WqEstimatedPrice;

						modifyItems.push({
							entity: item,
							value: price * (1 + rate)
						});
						processedIds.add(item.Id);
					}
				};

				// select items to modify
				let itemsSource = _.isArray(itemList) ? itemList
					: service.filterItemList && service.filterItemList.length ? service.filterItemList
						: service.getBoqTree() || [];
				itemsSource.forEach(processItem);

				if (!modifyItems.length) {
					return $q.when(null);
				}

				// cache entities to avoid multiple requests
				let entities = modifyItems.map(e => e.entity);
				let calculateService = $injector.get('estimateMainPriceAdjustmentCalculateService');

				// request price adjustment entity ids
				return service.checkPriceAdjustment(entities)
					.then(() => Promise.all(
						modifyItems.map(item =>
							calculateService.recalculate(item.entity, 'WqTenderPrice', item.value)
						)
					)).then(() => {
						service.markEntitiesAsModified(entities);
						service.updateFilterTotalData(service.filterItemList, isNoRefresh);
					})
					.catch(error => {
						console.error('Price adjustment failed:', error);
					});
			};

			service.updateFilterTotalData = function(itemList, isNoRefresh) {

				service.filterItemList = itemList;

				if (!$scope) { return; }

				let rootItem = service.getRootItem();
				if (!rootItem) { return; }

				// Initialization/Reset total entity
				totalFields.forEach(field => {
					$scope.totalEntity[field] = rootItem[field];
					$scope.filteredTotalEntity[field] = 0;
				});
				if(!isNoRefresh) {
					$scope.totalEntity.WqModificationPercent = 0;
					$scope.totalEntity.WqModificationAbsolute = 0;
					$scope.filteredTotalEntity.WqModificationPercent = 0;
					$scope.filteredTotalEntity.WqModificationAbsolute = 0;
				}

				if (itemList && itemList.length > 0) {
					let ignoreIds = new Set();

					let setIgnoreIds = (item) => {
						if (!ignoreIds.has(item.Id)) {
							ignoreIds.add(item.Id);
							if (item.HasChildren) {
								item.BoqItems.forEach(child => setIgnoreIds(child));
							}
						}
					};

					itemList.forEach(item => {
						if (!ignoreIds.has(item.Id)) {
							totalFields.forEach(field => {
								if (['WqAdjustmentPrice', 'WqTenderPrice'].includes(field) && item[field] === null) {
									$scope.filteredTotalEntity[field] += item.WqEstimatedPrice;
								} else {
									$scope.filteredTotalEntity[field] += item[field];
								}
							});
							setIgnoreIds(item);
						}
					});
				}else {
					totalFields.forEach(field => {
						$scope.filteredTotalEntity[field] = rootItem[field];
					});
				}
				$timeout(function () {
					$scope.$apply();
				});
			};

			service.checkPriceAdjustment = function (items) {
				if (!angular.isUndefined(items) && angular.isArray(items)) {
					let noFkItems = items.filter(function (e) {
						return !e.EstPriceAdjustmentFk;
					});
					if (noFkItems.length > 0) {
						return asyncCreatePriceAdjustments(noFkItems.length).then(function (result) {
							if (result && result.length > 0 && result.length === noFkItems.length) {
								for (let i = 0; i < result.length; i++) {
									noFkItems[i].EstPriceAdjustmentFk = result[i].Id;
									noFkItems[i].EstHeaderFk = result[i].EstHeaderFk;
									noFkItems[i].InsertedAt = result[i].InsertedAt;
									noFkItems[i].InsertedBy = result[i].InsertedBy;
									noFkItems[i].UpdatedAt = result[i].UpdatedAt;
									noFkItems[i].UpdatedBy = result[i].UpdatedBy;
									noFkItems[i].Version = result[i].Version;
								}
							}
						});
					}
				}
				return $q.when(null);
			};

			service.setAdjustments = function (adjustments) {
				priceAdjustments = adjustments;
			};

			service.getAdjustments = function () {
				return priceAdjustments;
			};

			service.setCurrentEstimateId = function(estimateId){
				estimateFk = estimateId;
			};

			service.getCurrentEstimateId = function(){
				return estimateFk;
			};

			service.setBoqHeader2URB = function (responseData) {
				let boqHeaderFks = _.map(responseData.boqTree, 'BoqHeaderFk');
				_.forEach(boqHeaderFks, function (fk) {
					let URBFields = [];
					if (responseData.boqStructure && responseData.boqStructure[fk]) {
						if (!responseData.boqStructure[fk].NameUrb1) {
							URBFields.push('Urb1');
						}
						if (!responseData.boqStructure[fk].NameUrb2) {
							URBFields.push('Urb2');
						}
						if (!responseData.boqStructure[fk].NameUrb3) {
							URBFields.push('Urb3');
						}
						if (!responseData.boqStructure[fk].NameUrb4) {
							URBFields.push('Urb4');
						}
						if (!responseData.boqStructure[fk].NameUrb5) {
							URBFields.push('Urb5');
						}
						if (!responseData.boqStructure[fk].NameUrb6) {
							URBFields.push('Urb6');
						}
					} else {
						URBFields = ['Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6'];
					}
					boqHeader2URB[fk] = URBFields;
				});
			};

			service.setBoqTree = function(boqs){
				boqTree = boqs;
			};

			service.getBoqTree = function(){
				return boqTree;
			};

			service.getReadOnlyURBFiledName = function(boqItem) {
				return boqHeader2URB[boqItem.BoqHeaderFk] || ['Urb1', 'Urb2', 'Urb3', 'Urb4', 'Urb5', 'Urb6'];
			};

			service.isValid = function (boqItem) {
				return ((boqMainCommonService.isItem(boqItem) &&
							(boqItem.BasItemTypeFk === 0 || // todo tmp for old boqs
								boqItem.BasItemTypeFk === boqMainItemTypes.standard ||
								boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithIT) &&
							(boqItem.BasItemType2Fk === null || // todo tmp for old boqs
								boqItem.BasItemType2Fk === boqMainItemTypes2.normal ||
								boqItem.BasItemType2Fk === boqMainItemTypes2.base ||
								boqItem.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded))||
						!boqMainCommonService.isItem(boqItem)) &&
					!service.IsDisabledOrNA(boqItem);
			};

			service.IsDisabledOrNA = function (boqItem) {
				let isDisableOrNa = boqItem.IsDisabled || boqItem.IsNotApplicable;
				if (!isDisableOrNa) {
					let parentBoqItem =  service.getParentItem(boqItem);
					if (parentBoqItem) {
						return service.IsDisabledOrNA(parentBoqItem);
					}
				}
				return isDisableOrNa;
			};

			/**
			 *
			 * @param boqItem
			 */
			service.getParentItem = function(boqItem) {
				if (boqItem.BoqItemFk) {
					let parentBoqItem = service.getItemById(boqItem.BoqItemFk);
					if (parentBoqItem) {
						return parentBoqItem;
					}
				}
				return null;
			};

			service.getRootItem = function() {
				let tree = service.getTree();
				return tree.length > 0 ? tree[0] : null;
			};

			service.updateSuccess=function(EstimatePriceAdjustmentToSave) {
				if (EstimatePriceAdjustmentToSave && EstimatePriceAdjustmentToSave.length > 0) {
					let boqList = service.getList();
					_.forEach(EstimatePriceAdjustmentToSave, boqItem => {
						let oldBoqItem = _.find(boqList, {Id: boqItem.Id});
						specialMergeBoqItem(oldBoqItem, boqItem);
						angular.extend(oldBoqItem, boqItem);
					});
					service.gridRefresh();
				}
			};

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
				let childServices = service.getChildServices();
				if (childServices && childServices.length > 0) {
					childServices.forEach(function (childService) {
						if (childService.doPrepareUpdateCall) {
							childService.doPrepareUpdateCall(updateData);
						}
					});
				}
			};

			service.hasUpdatePermission = function hasUpdatePermission() {
				if ($scope && $scope.gridId) {
					return platformPermissionService.hasWrite($scope.gridId);
				}
			};

			service.estMainUpdatePermission = function estMainUpdatePermission() {
				return platformPermissionService.hasWrite('681223e37d524ce0b9bfa2294e18d650');
			};

			service.hasReadOnly = function() {
				return !(service.hasUpdatePermission() && (!estimateMainService.getHeaderStatus() && service.estMainUpdatePermission()) && (boqTree !== null && _.size(boqTree) > 0));
			};

			service.hasReadOnlyItem = function (boqItem) {
				if (boqItem && !service.hasReadOnly()) {
					return !boqItem.IsAssignedLineItem;
				} else {
					return true;
				}
			};

			service.hasSpecialReadOnly = function hasSpecialReadOnly(boqItem) {
				return boqItem.IsDisabled || (estimateMainBoqService.IsLineItemOptional(boqItem) && !estimateMainBoqService.IsLineItemOptionalIt(boqItem));
			};

			service.canEditWqTenderPrice = function(boqItem) {
				if (!service.hasReadOnly() && boqMainCommonService.isDivisionOrRoot(boqItem)) {
					return true;
				}
				return false;
			};

			service.setScope = function(scope){
				$scope = scope;
			};

			return service;
		}]);
})();
