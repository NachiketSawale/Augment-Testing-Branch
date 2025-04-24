(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainPriceAdjustmentCalculateOldService', ['_', 'estimateMainPriceAdjustmentDataService', 'estimateMainPriceAdjustmentTotalDataService',
		'boqMainCommonService',
		function (_, estimateMainPriceAdjustmentDataService, estimateMainPriceAdjustmentTotalDataService) {
			let service = {};

			function calParentItem(item) {

				let parentItem = estimateMainPriceAdjustmentDataService.getItemById(item.BoqItemFk);

				if (parentItem && !estimateMainPriceAdjustmentDataService.IsDisabledOrNA(parentItem)) {

					if (estimateMainPriceAdjustmentDataService.isValid(item)) {
						parentItem.WqEstimatedPrice = item.WqEstimatedPrice;
						parentItem.WqAdjustmentPrice = item.WqAdjustmentPrice === null ? item.WqEstimatedPrice : item.WqAdjustmentPrice;
						parentItem.WqTenderPrice = item.WqTenderPrice === null ? item.WqEstimatedPrice : item.WqTenderPrice;

						parentItem.AqEstimatedPrice = item.AqEstimatedPrice;
						parentItem.AqAdjustmentPrice = item.AqAdjustmentPrice === null ? item.AqEstimatedPrice : item.AqAdjustmentPrice;
						parentItem.AqTenderPrice = item.AqTenderPrice === null ? item.AqEstimatedPrice : item.AqTenderPrice;

						_.forEach(parentItem.BoqItems.filter(function (e) {
							return e.Id !== item.Id && estimateMainPriceAdjustmentDataService.isValid(e);
						}), function (boq) {
							parentItem.WqEstimatedPrice += boq.WqEstimatedPrice;
							parentItem.WqAdjustmentPrice += boq.WqAdjustmentPrice === null ? boq.WqEstimatedPrice : boq.WqAdjustmentPrice;
							parentItem.WqTenderPrice += boq.WqTenderPrice === null ? boq.WqEstimatedPrice : boq.WqTenderPrice;

							parentItem.AqEstimatedPrice += boq.AqEstimatedPrice;
							parentItem.AqAdjustmentPrice += boq.AqAdjustmentPrice === null ? boq.AqEstimatedPrice : boq.AqAdjustmentPrice;
							parentItem.AqTenderPrice += boq.AqTenderPrice === null ? boq.AqEstimatedPrice : boq.AqTenderPrice;
						});

						parentItem.WqDeltaPrice = parentItem.WqTenderPrice - parentItem.WqEstimatedPrice;
						parentItem.AqDeltaPrice = parentItem.AqTenderPrice - parentItem.AqEstimatedPrice;

						restStatus(parentItem);
					}

					calParentItem(parentItem);
				}
			}

			function recalculate(item, field, newValue) {

				let num = _.parseInt(field.match(/\d+/g));

				let isExistUrb = false;

				let isNotEmpty = isNotEmptyOrNull(newValue);

				let tempValue = null;

				let temp2Value = null;

				let calculateValue = null;

				// let oldValue = item[field];

				item[field] = newValue;

				let unCalUrbs = estimateMainPriceAdjustmentDataService.getReadOnlyURBFiledName(item);

				function calUrb1N6(callback) {
					tempValue = null;
					_.forEach([1, 2, 3, 4, 5, 6], function (k) {
						let urbKey = 'Urb' + k;
						if (!unCalUrbs.includes(urbKey)) {
							isExistUrb = true;
							callback(k, urbKey);
						}
					});
				}

				function getRate(urbKey) {
					if (field.indexOf('Adjustment') !== -1) {
						return item.UrEstimated !== null && item.UrEstimated !== 0 ? item[urbKey + 'Estimated'] / item.UrEstimated : 0;
					} else if (item.UrAdjustment !== null && item.UrAdjustment !== 0) {
						return item[urbKey + 'Adjustment'] / item.UrAdjustment;
					} else if (item.UrEstimated !== null && item.UrEstimated !== 0) {
						return item[urbKey + 'Estimated'] / item.UrEstimated;
					}
					return 0;
				}

				function isNotEmptyOrNull(v) {
					return v !== null && v !== '';
				}

				function urbAdjustment(i, urbKey) {
					if (item[urbKey + 'Estimated'] !== null) {
						if (tempValue === null) {
							tempValue = 0;
						}
						item[urbKey + 'Adjustment'] = isNotEmpty ? getRate(urbKey) * item.UrAdjustment : null;
						item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Adjustment'] : null;
						item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : null;

						tempValue += item[urbKey + 'Adjustment'];
					}
				}

				function urbTender(i, urbKey) {
					if (item[urbKey + 'Estimated'] !== null || item[urbKey + 'Adjustment'] !== null) {
						if (tempValue === null) {
							tempValue = 0;
						}
						item[urbKey + 'Tender'] = isNotEmpty ? getRate(urbKey) * item.UrTender : null;
						item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : (item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] - item[urbKey + 'Estimated'] : null);

						tempValue += item[urbKey + 'Tender'];
					}
				}

				function urbDelta(i, urbKey) {
					if (item[urbKey + 'Estimated'] !== null) {
						if (tempValue === null) {
							tempValue = 0;
						}
						item[urbKey + 'Tender'] = item.UrTender !== null ? getRate(urbKey) * item.UrTender : null;

						if (item[urbKey + 'Adjustment'] === null) {
							item[urbKey + 'Adjustment'] = item[urbKey + 'Tender'] !== null ? item[urbKey + 'Tender'] : null;
						}

						item[urbKey + 'Delta'] = item[urbKey + 'Tender'] - item[urbKey + 'Estimated'];

						tempValue += item[urbKey + 'Tender'];
					}
				}

				function urbAdjustment1(i, urbKey) {
					if (item[urbKey + 'Estimated'] !== null || (!item.IsUrb && (i === num || (i !== num && (item[urbKey + 'Adjustment'] !== null || item[urbKey + 'Tender'] !== null))))) {
						if (tempValue === null) {
							tempValue = 0;
						}
						if(temp2Value===null){
							temp2Value = 0;
						}
						if (i !== num) {
							item[urbKey + 'Adjustment'] = isNotEmpty ? (item[urbKey + 'Adjustment'] === null ? item[urbKey + 'Estimated'] : item[urbKey + 'Adjustment']) : null;
						}
						item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] : item[urbKey + 'Tender'] : null;
						item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : null;

						tempValue += item[urbKey + 'Adjustment'];
						temp2Value += item[urbKey + 'Tender'];
					}
				}

				function urbTender1(i, urbKey) {
					if (item[urbKey + 'Estimated'] !== null || (!item.IsUrb && (i === num || (i !== num && item[urbKey + 'Tender'] !== null)))) {
						if (tempValue === null) {
							tempValue = 0;
						}

						if (i !== num) {
							item[urbKey + 'Tender'] = isNotEmpty ? (item[urbKey + 'Tender'] === null ? item[urbKey + 'Estimated'] : item[urbKey + 'Tender']) : null;
						}
						item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : (item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] - item[urbKey + 'Estimated'] : null);

						tempValue += item[urbKey + 'Tender'];
					}
				}

				function urbDelta1(i, urbKey) {
					if (item[urbKey + 'Estimated'] !== null || (!item.IsUrb && (i === num || (i !== num && item[urbKey + 'Delta'] !== null)))) {
						if (tempValue === null) {
							tempValue = 0;
						}
						let isChangeAdjust = false;
						if (item[urbKey + 'Adjustment'] === null && item[urbKey + 'Tender'] === null) {
							isChangeAdjust = true;
						}
						if (i === num) {
							item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Delta'] + item[urbKey + 'Estimated'] : item[urbKey + 'Estimated'];
							item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Delta'] : 0;
						} else {
							item[urbKey + 'Tender'] = item[urbKey + 'Tender'] !== null ? item[urbKey + 'Tender'] : item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] - item[urbKey + 'Estimated'] : item[urbKey + 'Estimated'];
							item[urbKey + 'Delta'] = item[urbKey + 'Tender'] - item[urbKey + 'Estimated'];
						}
						if (item[urbKey + 'Tender'] !== null) {
							item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Delta'] + item[urbKey + 'Estimated'] : item[urbKey + 'Estimated'];
						}
						if (isChangeAdjust && item[urbKey + 'Delta'] !== null) {
							item[urbKey + 'Adjustment'] = item[urbKey + 'Tender'];
						}
						tempValue += item[urbKey + 'Tender'];
					}
				}

				function calWq() {
					item.WqAdjustmentPrice = item.UrAdjustment !== null ? item.UrAdjustment * item.WqQuantity * item.Factor : null;
					item.WqTenderPrice = item.UrTender !== null ? item.UrTender * item.WqQuantity * item.Factor : null;
					item.WqDeltaPrice = item.UrDelta !== null ? item.UrDelta * item.WqQuantity * item.Factor : null;
				}

				/**
				 *
				 * @param calEstimate bool
				 */
				function calAq(calEstimate) {
					if (calEstimate) {
						item.AqEstimatedPrice = item.UrEstimated !== null ? item.UrEstimated * item.AqQuantity * item.Factor : null;
					}
					item.AqAdjustmentPrice = item.UrAdjustment !== null ? item.UrAdjustment * item.AqQuantity * item.Factor : null;
					item.AqTenderPrice = item.UrTender !== null ? item.UrTender * item.AqQuantity * item.Factor : null;
					item.AqDeltaPrice = item.UrDelta !== null ? item.UrDelta * item.AqQuantity * item.Factor : null;

				}

				function returnTempValue(isTmpValue) {
					return isNotEmpty || isTmpValue ? (tempValue === null ? 0 : tempValue) : null;
				}
				function returnTempValue1() {
					return isNotEmpty ? (temp2Value === null ? 0 : temp2Value) : null;
				}

				function resetValue() {
					setTimeout(function () {
						item[field] = calculateValue;
						estimateMainPriceAdjustmentDataService.gridRefresh();
					});
				}

				function clearUrb(i, urbKey) {
					item[urbKey + 'Adjustment'] = null;
					item[urbKey + 'Tender'] = null;
					item[urbKey + 'Delta'] = null;
				}

				if (field.indexOf('Urb') !== -1) {
					if (field.indexOf('Adjustment') !== -1) {
						calUrb1N6(urbAdjustment1);
						item.UrAdjustment = returnTempValue();

						item.UrAdjustment = isNotEmpty ? item.UrAdjustment : null;
						if (item.IsUrb) {
							item.UrTender = isNotEmpty ? item.UrAdjustment : null;
						}else {
							item.UrTender = returnTempValue1();
						}
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : null;
					} else if (field.indexOf('Tender') !== -1) {
						calUrb1N6(urbTender1);
						item.UrTender = returnTempValue();

						item.UrTender = isNotEmpty ? item.UrTender : null;
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : (item.UrAdjustment !== null ? item.UrAdjustment - item.UrEstimated : null);
					} else if (field.indexOf('Delta') !== -1) {
						calUrb1N6(urbDelta1);
						item.UrTender = returnTempValue(true);
						item.UrDelta = item.UrTender - item.UrEstimated;
						if (item.UrAdjustment === null) {
							item.UrAdjustment = item.UrTender;
						}
						// resetValue();
					}
					calWq();
					calAq();
				} else if (field.indexOf('Wq') !== -1 || field.indexOf('Aq') !== -1 || field.indexOf('Ur') !== -1) {
					//  1.calculate ur
					if (field.indexOf('Adjustment') !== -1) {
						// region Adjustment(wq/aq/ur)
						if (field.indexOf('Wq') !== -1) {
							item.UrAdjustment = item.WqQuantity && item.Factor ? item.WqAdjustmentPrice / item.WqQuantity / item.Factor : 0;
						} else if (field.indexOf('Aq') !== -1) {
							item.UrAdjustment = item.AqQuantity && item.Factor ? item.AqAdjustmentPrice / item.AqQuantity / item.Factor : 0;
						}
						if (item.IsUrb) {
							// 2-1 calculate urb
							calUrb1N6(urbAdjustment);
							item.UrAdjustment = isExistUrb ? returnTempValue() : item.UrAdjustment;
							resetValue();
						} else {
							calUrb1N6(clearUrb);
						}
						// 3-1 recalculate ur
						item.UrAdjustment = isNotEmpty ? item.UrAdjustment : null;
						item.UrTender = isNotEmpty ? item.UrAdjustment : null;
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : null;
						// endregion
					} else if (field.indexOf('Tender') !== -1) {
						// region Tender(wq/aq/ur)
						if (field.indexOf('Wq') !== -1) {
							item.UrTender = item.WqQuantity && item.Factor ? item.WqTenderPrice / item.WqQuantity / item.Factor : 0;
						} else if (field.indexOf('Aq') !== -1) {
							item.UrTender = item.AqQuantity && item.Factor ? item.AqTenderPrice / item.AqQuantity / item.Factor : 0;
						}
						if (item.IsUrb) {
							// 2-2 calculate urb
							calUrb1N6(urbTender);
							item.UrTender = isExistUrb ? returnTempValue() : item.UrTender;
							resetValue();
						} else {
							calUrb1N6(clearUrb);
						}

						item.UrTender = isNotEmpty ? item.UrTender : null;
						// 3-2 recalculate ur
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : (item.UrAdjustment !== null ? item.UrAdjustment - item.UrEstimated : null);
						// endregion
					} else if (field.indexOf('Delta') !== -1) {
						// region Delta(wq/aq/ur)
						if (field.indexOf('Wq') !== -1) {
							item.WqTenderPrice = isNotEmpty ? item.WqDeltaPrice + item.WqEstimatedPrice : item.WqEstimatedPrice;
							item.UrTender = item.WqQuantity && item.Factor ? item.WqTenderPrice / item.WqQuantity / item.Factor : 0;
						} else if (field.indexOf('Aq') !== -1) {
							item.AqTenderPrice = isNotEmpty ? item.AqDeltaPrice + item.AqEstimatedPrice : item.AqEstimatedPrice;
							item.UrTender = item.AqQuantity && item.Factor ? item.AqTenderPrice / item.AqQuantity / item.Factor : 0;
						} else {
							item.UrTender = isNotEmpty ? item.UrDelta + item.UrEstimated : item.UrEstimated;
						}
						if (item.IsUrb) {
							// 2-3 calculate urb
							calUrb1N6(urbDelta);
							if (item.UrAdjustment === null) {
								item.UrTender = isExistUrb ? returnTempValue() : item.UrTender;
							}
							// resetValue();
						} else {
							calUrb1N6(clearUrb);
						}
						// 3-2 recalculate ur
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : 0;
						if (item.UrAdjustment === null) {
							item.UrAdjustment = item.UrTender !== null ? item.UrTender : null;
						}
						// endregion
					} else if (field.indexOf('Quantity') !== -1) {
						// calculate aq quantity
						calAq(true);
					}
					// 4.calculate wq/aq
					calWq();
					calAq();

					calculateValue = item[field];

				}

				if (field.indexOf('Delta') !== -1 && !isNotEmpty) {
					calculateValue = 0;
					resetValue();
				}

				restStatus(item);

				calParentItem(item);

				estimateMainPriceAdjustmentDataService.gridRefresh();

				estimateMainPriceAdjustmentTotalDataService.load();
			}

			function restStatus(item) {
				let tenderPrice = item.WqTenderPrice === null ? item.WqAdjustmentPrice === null ? item.WqEstimatedPrice : item.WqAdjustmentPrice : item.WqTenderPrice;
				if (item.WqEstimatedPrice === item.AqEstimatedPrice) {
					if (item.WqEstimatedPrice === tenderPrice) {
						item.Status = 1; // Gray ICON: left-gray-under,right-gray-under
					} else if (item.WqEstimatedPrice < tenderPrice) {
						item.Status = 3; // Red ICON:left-gray-under,right-red-upper
					} else {
						item.Status = 4; // Red ICON: left-gray-under,right-red-under
					}
				} else if (item.WqEstimatedPrice < item.AqEstimatedPrice) {
					if (item.WqEstimatedPrice === tenderPrice) {
						item.Status = 2; // Red ICON: left-red-upper,right-gray-under
					} else if (item.WqEstimatedPrice < tenderPrice) {
						item.Status = 9; // Green ICON: left-green-upper,right-green-upper
					} else {
						item.Status = 6; // Red ICON: left-red-upper,right-red-under
					}
				} else if (item.WqEstimatedPrice > item.AqEstimatedPrice) {
					if (item.WqEstimatedPrice === tenderPrice) {
						item.Status = 5; // Red ICON: left-red-under,right-gray-under
					} else if (item.WqEstimatedPrice < tenderPrice) {
						item.Status = 7; // Red ICON: left-red-under,right-red-upper
					} else {
						item.Status = 8; // Green ICON: left-green-under,right-green-under
					}
				} else {
					item.Status = 1;
				}
			}

			function restItemURB(item,boqUnsetUrbs) {
				function calUrb1N6(callback) {
					_.forEach([1, 2, 3, 4, 5, 6], function (k) {
						let urbKey = 'Urb' + k;
						if (boqUnsetUrbs.includes(urbKey)) {
							callback(k, urbKey);
						}
					});
				}

				function resetUrb(i, urbKey) {
					item[urbKey + 'Estimated'] = null;
					item[urbKey + 'Adjustment'] = null;
					item[urbKey + 'Tender'] = null;
					item[urbKey + 'Delta'] = null;
				}

				calUrb1N6(resetUrb);
			}

			service.recalculate = recalculate;

			service.restStatus = restStatus;

			service.restItemURB = restItemURB;

			return service;
		}]);
})(angular);