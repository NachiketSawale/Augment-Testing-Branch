(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainPriceAdjustmentCalculateService', ['_', 'estimateMainPriceAdjustmentDataService', 'estimateMainPriceAdjustmentTotalDataService',
		'boqMainCommonService',
		function (_, estimateMainPriceAdjustmentDataService, estimateMainPriceAdjustmentTotalDataService) {
			let service = {};

			function calUrbProcess(calculator) {
				let item = calculator.item;
				let num = calculator.num;
				let isNotEmpty = calculator.isNotEmpty;
				let changeAdjustment = calculator.changeAdjustment;
				return {
					urbAdjustment: function urbAdjustment(i, urbKey) {
						if (item[urbKey + 'Estimated'] !== null) {

							item[urbKey + 'Adjustment'] = isNotEmpty ? calculator.getUrbRate(urbKey) * item.UrAdjustment : null;
							item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Adjustment'] : null;
							item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : null;

							calculator.tempValue += item[urbKey + 'Adjustment'];
						}
					},
					urbTender: function urbTender(i, urbKey) {
						if (item[urbKey + 'Estimated'] !== null || item[urbKey + 'Adjustment'] !== null) {

							item[urbKey + 'Tender'] = isNotEmpty ? calculator.getUrbRate(urbKey) * item.UrTender : null;
							item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : (item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] - item[urbKey + 'Estimated'] : null);

							calculator.tempValue += item[urbKey + 'Tender'];
						}
					},
					urbDelta: function urbDelta(i, urbKey) {
						if (item[urbKey + 'Estimated'] !== null) {

							item[urbKey + 'Tender'] = item.UrTender !== null ? calculator.getUrbRate(urbKey) * item.UrTender : null;

							if (changeAdjustment) {
								item[urbKey + 'Adjustment'] = item[urbKey + 'Tender'];
							}

							item[urbKey + 'Delta'] = item[urbKey + 'Tender'] - item[urbKey + 'Estimated'];

							calculator.tempValue += item[urbKey + 'Tender'];
						}
					},
					urbAdjustment1: function urbAdjustment1(i, urbKey) {
						if (item[urbKey + 'Estimated'] !== null || (!item.IsUrb && (i === num || (i !== num && (item[urbKey + 'Adjustment'] !== null || item[urbKey + 'Tender'] !== null))))) {
							if (i !== num) {
								item[urbKey + 'Adjustment'] = isNotEmpty ? (item[urbKey + 'Adjustment'] === null ? item[urbKey + 'Estimated'] : item[urbKey + 'Adjustment']) : null;
							}
							item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] : item[urbKey + 'Tender'] : null;
							item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : null;

							calculator.tempValue += item[urbKey + 'Adjustment'];
							calculator.temp2Value += item[urbKey + 'Tender'];
						}
					},
					urbTender1: function urbTender1(i, urbKey) {
						if (item[urbKey + 'Estimated'] !== null || (!item.IsUrb && (i === num || (i !== num && item[urbKey + 'Tender'] !== null)))) {
							if (i !== num) {
								item[urbKey + 'Tender'] = isNotEmpty ? (item[urbKey + 'Tender'] === null ? (item[urbKey + 'Estimated'] === null ? item[urbKey + 'Delta'] : item[urbKey + 'Estimated']) : item[urbKey + 'Tender']) : null;
							}
							item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Tender'] - item[urbKey + 'Estimated'] : (item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] - item[urbKey + 'Estimated'] : null);

							calculator.tempValue += item[urbKey + 'Tender'];
						}
					},
					urbDelta1: function urbDelta1(i, urbKey) {
						if (item[urbKey + 'Estimated'] !== null || (!item.IsUrb && (i === num || (i !== num && item[urbKey + 'Delta'] !== null)))) {
							let isChangeAdjust = false;
							if (item[urbKey + 'Adjustment'] === null && item[urbKey + 'Tender'] === null) {
								isChangeAdjust = true;
							}
							if (i === num) {
								item[urbKey + 'Tender'] = isNotEmpty ? item[urbKey + 'Delta'] + item[urbKey + 'Estimated'] : (item[urbKey + 'Estimated'] !== null ? item[urbKey + 'Estimated'] : 0);
								item[urbKey + 'Delta'] = isNotEmpty ? item[urbKey + 'Delta'] : 0;
							} else {
								item[urbKey + 'Tender'] = item[urbKey + 'Tender'] !== null ? item[urbKey + 'Tender'] : item[urbKey + 'Adjustment'] !== null ? item[urbKey + 'Adjustment'] - item[urbKey + 'Estimated'] : item[urbKey + 'Estimated'] !== null ? item[urbKey + 'Estimated'] : item[urbKey + 'Delta'];
								item[urbKey + 'Delta'] = item[urbKey + 'Tender'] - item[urbKey + 'Estimated'];
							}
							if (changeAdjustment && isChangeAdjust && item[urbKey + 'Delta'] !== null) {
								item[urbKey + 'Adjustment'] = item[urbKey + 'Tender'];
								item.UrAdjustment += item[urbKey + 'Adjustment'];
							}
							calculator.tempValue += item[urbKey + 'Tender'];
						}
					}
				};
			}

			function calPriceProcess(calculator, calUrb) {
				let item = calculator.item;
				let field = calculator.field;
				let isNotEmpty = calculator.isNotEmpty;
				let changeAdjustment = calculator.changeAdjustment;
				return {
					adjustment: function adjustment() {
						if (field.indexOf('Wq') !== -1) {
							item.UrAdjustment = item.WqQuantity && item.Factor ? item.WqAdjustmentPrice / item.WqQuantity / item.Factor : 0;
						} else if (field.indexOf('Aq') !== -1) {
							item.UrAdjustment = item.AqQuantity && item.Factor ? item.AqAdjustmentPrice / item.AqQuantity / item.Factor : 0;
						}
						if (item.IsUrb) {
							calculator.calUrb1N6(calUrb.urbAdjustment);
							item.UrAdjustment = calculator.isExistUrb ? calculator.returnTempValue() : item.UrAdjustment;
							calculator.resetValue();
						} else {
							calculator.clearUrb();
						}
						item.UrAdjustment = isNotEmpty ? item.UrAdjustment : null;
						item.UrTender = isNotEmpty ? item.UrAdjustment : null;
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : null;
					},
					tender: function tender() {
						if (field.indexOf('Wq') !== -1) {
							item.UrTender = item.WqQuantity && item.Factor ? item.WqTenderPrice / item.WqQuantity / item.Factor : 0;
						} else if (field.indexOf('Aq') !== -1) {
							item.UrTender = item.AqQuantity && item.Factor ? item.AqTenderPrice / item.AqQuantity / item.Factor : 0;
						}
						if (item.IsUrb) {
							calculator.calUrb1N6(calUrb.urbTender);
							item.UrTender = calculator.isExistUrb ? calculator.returnTempValue() : item.UrTender;
							calculator.resetValue();
						} else {
							calculator.clearUrb();
						}

						item.UrTender = isNotEmpty ? item.UrTender : null;
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : (item.UrAdjustment !== null ? item.UrAdjustment - item.UrEstimated : null);
					},
					delta: function delta() {
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
							calculator.calUrb1N6(calUrb.urbDelta);
							item.UrTender = calculator.isExistUrb ? calculator.returnTempValue(true) : item.UrTender;
						} else {
							calculator.clearUrb();
						}
						item.UrDelta = item.UrTender - item.UrEstimated;
						if (changeAdjustment) {
							item.UrAdjustment = item.UrTender !== null ? item.UrTender : null;
						}
					},
					urbAdjustment: function urbAdjustment() {
						calculator.calUrb1N6(calUrb.urbAdjustment1);
						item.UrAdjustment = calculator.returnTempValue();

						item.UrAdjustment = isNotEmpty ? item.UrAdjustment : null;
						if (item.IsUrb) {
							item.UrTender = isNotEmpty ? item.UrAdjustment : null;
						} else {
							item.UrTender = calculator.returnTemp2Value();
						}
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : null;
					},
					urbTender: function urbTender() {
						calculator.calUrb1N6(calUrb.urbTender1);
						item.UrTender = calculator.returnTempValue();

						item.UrTender = isNotEmpty ? item.UrTender : null;
						item.UrDelta = isNotEmpty ? item.UrTender - item.UrEstimated : (item.UrAdjustment !== null ? item.UrAdjustment - item.UrEstimated : null);
					},
					urbDelta: function urbDelta() {
						calculator.calUrb1N6(calUrb.urbDelta1);
						item.UrTender = calculator.returnTempValue(true);
						item.UrDelta = item.UrTender - item.UrEstimated;
						if (changeAdjustment) {
							item.UrAdjustment = item.UrTender;
						}
					},
					calWq: function calWq() {
						item.WqAdjustmentPrice = item.UrAdjustment !== null ? item.UrAdjustment * item.WqQuantity * item.Factor : null;
						item.WqTenderPrice = item.UrTender !== null ? item.UrTender * item.WqQuantity * item.Factor : null;
						item.WqDeltaPrice = item.UrDelta !== null ? item.UrDelta * item.WqQuantity * item.Factor : null;
					},
					calAq: function calAq(calEstimate) {
						if (calEstimate) {
							item.AqEstimatedPrice = item.UrEstimated !== null ? item.UrEstimated * item.AqQuantity * item.Factor : null;
						}
						item.AqAdjustmentPrice = item.UrAdjustment !== null ? item.UrAdjustment * item.AqQuantity * item.Factor : null;
						item.AqTenderPrice = item.UrTender !== null ? item.UrTender * item.AqQuantity * item.Factor : null;
						item.AqDeltaPrice = item.UrDelta !== null ? item.UrDelta * item.AqQuantity * item.Factor : null;
					}
				};
			}

			function EstPriceAdjustmentCalculator(item, field, newValue) {
				item[field] = newValue;
				this.num = _.parseInt(field.match(/\d+/g));
				this.isExistUrb = false;
				this.isNotEmpty = this.isNotEmptyOrNull(newValue);
				this.tempValue = null;
				this.temp2Value = null;
				this.calculateValue = null;
				this.item = item;
				this.field = field;
				this.value = newValue;
				this.changeAdjustment = item.UrAdjustment === null && item.UrTender === null;
				this.unCalUrbs = estimateMainPriceAdjustmentDataService.getReadOnlyURBFiledName(item);
			}

			EstPriceAdjustmentCalculator.prototype.calUrb1N6 = function calUrb1N6(callback) {
				let _this = this;
				_this.tempValue = null;
				_.forEach([1, 2, 3, 4, 5, 6], function (k) {
					let urbKey = 'Urb' + k;
					if (!_this.unCalUrbs.includes(urbKey)) {
						_this.isExistUrb = true;
						callback(k, urbKey);
					}
				});
			};

			EstPriceAdjustmentCalculator.prototype.clearUrb = function () {
				let item = this.item;
				this.calUrb1N6(function (i, urbKey) {
					item[urbKey + 'Adjustment'] = null;
					item[urbKey + 'Tender'] = null;
					item[urbKey + 'Delta'] = null;
				});
			};

			EstPriceAdjustmentCalculator.prototype.getUrbRate = function getUrbRate(urbKey) {
				let item = this.item;
				if (this.field.indexOf('Adjustment') !== -1) {
					return item.UrEstimated !== null && item.UrEstimated !== 0 ? item[urbKey + 'Estimated'] / item.UrEstimated : 0;
				} else if (item.UrAdjustment !== null && item.UrAdjustment !== 0) {
					return item[urbKey + 'Adjustment'] / item.UrAdjustment;
				} else if (item.UrEstimated !== null && item.UrEstimated !== 0) {
					return item[urbKey + 'Estimated'] / item.UrEstimated;
				}
				return 0;
			};

			EstPriceAdjustmentCalculator.prototype.calculate = function () {

				let _this = this;
				let item = _this.item;
				let field = _this.field;
				let calUrb = calUrbProcess(_this);
				let calPrice = calPriceProcess(_this, calUrb);

				switch (field) {
					case 'AqAdjustmentPrice':
					case 'WqAdjustmentPrice':
					case 'UrAdjustment':
						calPrice.adjustment();
						break;
					case 'AqTenderPrice':
					case 'WqTenderPrice':
					case 'UrTender':
						calPrice.tender();
						break;
					case 'AqDeltaPrice':
					case 'WqDeltaPrice':
					case 'UrDelta':
						calPrice.delta();
						break;
					case 'Urb1Adjustment':
					case 'Urb2Adjustment':
					case 'Urb3Adjustment':
					case 'Urb4Adjustment':
					case 'Urb5Adjustment':
					case 'Urb6Adjustment':
						calPrice.urbAdjustment();
						break;
					case 'Urb1Tender':
					case 'Urb2Tender':
					case 'Urb3Tender':
					case 'Urb4Tender':
					case 'Urb5Tender':
					case 'Urb6Tender':
						calPrice.urbTender();
						break;
					case 'Urb1Delta':
					case 'Urb2Delta':
					case 'Urb3Delta':
					case 'Urb4Delta':
					case 'Urb5Delta':
					case 'Urb6Delta':
						calPrice.urbDelta();
						break;
					case 'AqQuantity':
						calPrice.calAq(true);
						break;
					default:
						break;
				}

				calPrice.calWq();
				calPrice.calAq();

				_this.calculateValue = item[field];

				if (field.indexOf('Delta') !== -1) {
					if (!_this.isNotEmpty) {
						_this.calculateValue = 0;
					}
					_this.resetValue();
				}
				_this.resetSpecialValue();
			};

			EstPriceAdjustmentCalculator.prototype.isNotEmptyOrNull = function (v) {
				return v !== null && v !== '';
			};

			EstPriceAdjustmentCalculator.prototype.returnTempValue = function (isTmpValue) {
				return this.isNotEmpty || isTmpValue ? (this.tempValue === null ? 0 : this.tempValue) : null;
			};

			EstPriceAdjustmentCalculator.prototype.returnTemp2Value = function () {
				return this.isNotEmpty ? (this.temp2Value === null ? 0 : this.temp2Value) : null;
			};

			EstPriceAdjustmentCalculator.prototype.resetValue = function () {
				let _this = this;
				setTimeout(function () {
					_this.item[_this.field] = _this.calculateValue;
					restSpecialItem(_this.item);
					estimateMainPriceAdjustmentDataService.gridRefresh();
				});
			};

			EstPriceAdjustmentCalculator.prototype.resetSpecialValue = function () {
				let _this = this;
				setTimeout(function () {
					restSpecialItem(_this.item);
					estimateMainPriceAdjustmentDataService.gridRefresh();
				});
			};

			EstPriceAdjustmentCalculator.prototype.isQuantityEqualZero = function () {
				let isQuantityEqualZero = false;
				if (this.field.indexOf('Wq') > -1) {
					isQuantityEqualZero = this.item.WqQuantity === 0;
				} else if (this.field.indexOf('Aq') > -1) {
					if (this.field !== 'AqQuantity') {
						isQuantityEqualZero = this.item.AqQuantity === 0;
					}
				}
				if(isQuantityEqualZero) {
					if (this.changeAdjustment) {
						this.item[this.field] = null;
					} else {
						this.item[this.field] = 0;
					}
					this.calculateValue = this.item[this.field];
				}
				return isQuantityEqualZero;
			};

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

				let calculator = new EstPriceAdjustmentCalculator(item, field, newValue);

				if(!calculator.isQuantityEqualZero()) {
					calculator.calculate();
				}else {
					calculator.resetValue();
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

			function restItemURB(item, boqUnsetUrbs) {
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

			function restSpecialItem(item) {
				// let specialFields = ['UrDelta', 'UrAdjustment', 'UrTender', 'WqDeltaPrice', 'AqDeltaPrice'];
				if (estimateMainPriceAdjustmentDataService.hasSpecialReadOnly(item)) {
					item.WqDeltaPrice = item.WqDeltaPrice !== null ? 0 : null;
					item.WqAdjustmentPrice = item.WqAdjustmentPrice !== null ? 0 : null;
					item.WqTenderPrice = item.WqTenderPrice !== null ? 0 : null;
					item.AqDeltaPrice = item.AqDeltaPrice !== null ? 0 : null;
					item.AqAdjustmentPrice = item.AqAdjustmentPrice !== null ? 0 : null;
					item.AqTenderPrice = item.AqTenderPrice !== null ? 0 : null;
				}
			}

			service.recalculate = recalculate;

			service.restStatus = restStatus;

			service.restItemURB = restItemURB;

			return service;
		}]);
})(angular);