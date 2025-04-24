(function () {
	'use strict';

	angular.module('estimate.main').factory('estimateMainModifyPriceAdjustmentService', ['$q', '_', 'globals', '$injector', '$http', '$translate', 'estimateMainPriceAdjustmentDataService', 'boqMainCommonService',
		function ($q, _, globals, $injector, $http, $translate, estimateMainPriceAdjustmentDataService, boqMainCommonService) {
			let service = {};

			let currentEntity = null;

			service.validateModifyOption = function validateModifyOption($scope) {
				return modifyAdjustment($scope).then(function (result) {
					service.setEntity($scope.modifyOption);
					return _.extend({valid: true}, result);
				});
			};

			service.setEntity = function (entity) {
				currentEntity = angular.copy(entity);
			};

			service.getPrevEntity = function () {
				return currentEntity;
			};

			function modifyAdjustmentPrice(boqItems, func) {
				return estimateMainPriceAdjustmentDataService.checkPriceAdjustment(boqItems).then(function () {
					_.forEach(boqItems, func);
				}).then(function () {
					estimateMainPriceAdjustmentDataService.markEntitiesAsModified(boqItems);
					estimateMainPriceAdjustmentDataService.update();
				});
			}

			function modifyAdjustment($scope) {

				let rate = 0;  // aq/wq
				let factor = 0; // factor
				let sourceField = ''; // base unit rate
				let targetField = ''; // target price
				let overwrite = $scope.modifyOption.OverwriteExistPrices;

				let comment = '';
				let estimateMainPriceAdjustmentCalculateService = $injector.get('estimateMainPriceAdjustmentCalculateService');

				let resetField = [];

				let boqItems = getAreaBoqItems($scope); // estimateMainPriceAdjustmentDataService.getSelectedEntities();

				if (!boqItems || boqItems.length === 0) {
					return $q.when({
						valid: false,
						msg: 'No BoqItem Change'
					});
				}

				function modifyPrice(boqItem) {
					if (factor > 0 && sourceField && boqItem[sourceField] !== null) {
						if (overwrite || boqItem[targetField] === null) {
							if (parseInt($scope.modifyOption.BaseUnitRateType) === 3 && boqItem.UrAdjustment !== null) {
								sourceField = 'UrAdjustment';
							}
							boqItem[targetField] = boqItem[sourceField] * factor;
							if (rate !== 0) {
								boqItem.AqQuantity = boqItem.WqQuantity * rate;
							}
							addComment(boqItem);
							estimateMainPriceAdjustmentCalculateService.recalculate(boqItem, targetField, boqItem[targetField]);
						} else if (rate !== 0) {
							modifyAqQuantity(boqItem);
						}
					} else if ($scope.modifyOption.AqFromWqQuantity && rate !== 0) {
						modifyAqQuantity(boqItem);
					}
				}

				function modifyAqQuantity(boqItem) {
					boqItem.AqQuantity = boqItem.WqQuantity * rate;
					addComment(boqItem);
					estimateMainPriceAdjustmentCalculateService.recalculate(boqItem, 'AqQuantity', boqItem.AqQuantity);
				}

				function resetAdjustPrice(boqItem) {
					_.forEach(resetField, function (r) {
						if (angular.isFunction(r.value)) {
							boqItem[r.field] = r.value(boqItem);
						} else {
							boqItem[r.field] = r.value;
						}
						if (r !== 'Comment') {
							estimateMainPriceAdjustmentCalculateService.recalculate(boqItem, r.field, boqItem[r.field]);
						}
					});
				}

				function addComment(boqItem) {
					boqItem.Comment = boqItem.Comment ? boqItem.Comment : '';
					if ($scope.modifyOption.AddComment && (boqItem.Comment + comment).length < 2000) {
						boqItem.Comment += comment;
					}
				}

				if (parseInt($scope.modifyOption.SelectAreaType) === 1) {

					// AQ update
					if ($scope.modifyOption.AqFromWqQuantity) {
						rate = $scope.modifyOption.AqDivWq * 1;
					}

					// price update
					if ($scope.modifyOption.Prices) {

						factor = $scope.modifyOption.Factor * 1;

						comment += $translate.instant('estimate.main.priceAdjust.baseUnitRate');
						comment += ':';

						switch (parseInt($scope.modifyOption.BaseUnitRateType)) {
							case 1:
								sourceField = 'UrEstimated';
								comment += $translate.instant('estimate.main.priceAdjust.estimatePriceOnly');
								break;
							case 2:
								sourceField = 'UrAdjustment';
								comment += $translate.instant('estimate.main.priceAdjust.adjustPriceOnly');
								break;
							case 3:
								sourceField = 'UrEstimated';
								comment += $translate.instant('estimate.main.priceAdjust.adjustOrEstPrice');
								break;
							case 4:
								sourceField = 'UrTender';
								comment += $translate.instant('estimate.main.priceAdjust.tenderPriceOnly');
								break;
						}

						if (factor > 0) {
							comment += ',' + $translate.instant('estimate.main.priceAdjust.factor') + '=' + $scope.modifyOption.Factor;
						}

						switch (parseInt($scope.modifyOption.TargetUnitRateType)) {
							case 1:
								if ([1, 2].includes(parseInt($scope.modifyOption.BaseUnitRateType))) {
									targetField = 'UrAdjustment';
									comment += ',' + $translate.instant('estimate.main.priceAdjust.targetUnitRate') + ':' + $translate.instant('estimate.main.priceAdjust.adjustPrices');
								}
								break;
							case 2:
								targetField = 'UrTender';
								comment += ',' + $translate.instant('estimate.main.priceAdjust.targetUnitRate') + ':' + $translate.instant('estimate.main.priceAdjust.tenderPrices');
								break;
						}
						if ($scope.modifyOption.OverwriteExistPrices) {
							comment += ',' + $translate.instant('estimate.main.priceAdjust.overwriteExistPrices');
						}
						if ($scope.modifyOption.AqFromWqQuantity) {
							comment += ',' + $translate.instant('estimate.main.priceAdjust.aqFromWqQuantity') + '=' + $scope.modifyOption.AqDivWq;
						}
						comment += ';';
						return modifyAdjustmentPrice(boqItems, modifyPrice);

					} else if (!$scope.modifyOption.Prices && $scope.modifyOption.AqFromWqQuantity) {
						comment += $translate.instant('estimate.main.priceAdjust.aqFromWqQuantity') + ': ' + $scope.modifyOption.AqDivWq;
						return modifyAdjustmentPrice(boqItems, modifyAqQuantity);
					}

				} else if (parseInt($scope.modifyOption.SelectAreaType) === 2) {
					// detele adjustment price
					if ($scope.modifyOption.DelAdjustPrices) {
						resetField.push({field: 'UrAdjustment', value: null});
					}

					// delete tender price
					if ($scope.modifyOption.DelTenderPrices) {
						resetField.push({field: 'UrTender', value: null});
					}

					// delete comment
					if ($scope.modifyOption.DelComment) {
						resetField.push({field: 'Comment', value: null});
					}

					// reset AqQuantity
					if ($scope.modifyOption.ResetAqToWqQuantity) {
						resetField.push({
							field: 'AqQuantity', value: (e) => {
								return e.WqQuantity;
							}
						});
					}
					if ($scope.modifyOption.ResetAqFromBoqAqQuantity) {
						resetField.push({
							field: 'AqQuantity', value: (e) => {
								return e.QuantityAdj;
							}
						});
					}

					let promises = [];

					promises.push(modifyAdjustmentPrice(boqItems, resetAdjustPrice));
					// reset fixed price
					if ($scope.modifyOption.DelFixedPriceFlag) {
						promises.push(updateAdjustmentFixedPrice(boqItems));
					}

					return $q.all(promises);

				}

				return $q.when(null);

			}

			function updateAdjustmentFixedPrice(boqItems) {
				let estHeader = $injector.get('estimateMainService').getSelectedEstHeaderItem();
				let param = {
					EstimatePriceAdjustmentToSave: boqItems,
					EstHeaderId: estHeader.Id
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/main/priceadjustment/updateAdjustmentFixedPrice', param).then(function (result) {
					return result.data;
				}).then(function () {
					let estimateMainService = $injector.get('estimateMainService');
					estimateMainService.refresh();
				});
			}

			function getAreaBoqItems($scope) {
				let startIndex = 0, endIndex = -1;
				let boqList = estimateMainPriceAdjustmentDataService.getList();
				if ($scope.modifyOption.FromRefNo && $scope.modifyOption.ToRefNo) {
					startIndex = _.findIndex(boqList, {Id: $scope.modifyOption.FromRefNo});
					endIndex = _.findIndex(boqList, {Id: $scope.modifyOption.ToRefNo});
				} else if ($scope.modifyOption.FromRefNo) {
					startIndex = _.findIndex(boqList, {Id: $scope.modifyOption.FromRefNo});
					endIndex = boqList.length - 1;
				} else if ($scope.modifyOption.ToRefNo) {
					endIndex = _.findIndex(boqList, {Id: $scope.modifyOption.ToRefNo});
				}
				let boqItems = _.slice(boqList, startIndex, endIndex + 1);

				boqItems = _.filter(boqItems, (e) => {
					return boqMainCommonService.isItem(e) && e.IsAssignedLineItem;
				});

				return boqItems;
			}

			return service;

		}]);
})();