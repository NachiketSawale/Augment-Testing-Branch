(function () {
	'use strict';
	/*global angular, _*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).service('ppsEngineeringProgressProcessor', [
		'moment', 'platformRuntimeDataService',
		function (moment, platformRuntimeDataService) {
			this.processItem = function (item) {
				var start = item.ActualStartDate;
				var end = item.ActualEndDate;
				var isManualQty = item.IsManualQuantity;
				Object.defineProperties(item, {
					'ActualStartDate': {
						get: function () {
							return start;
						},
						set: function (value) {
							start = value;
							if (item.IsManualQuantity === false) {
								var autoQty = calcAutoQty(item);
								if(autoQty) {
									item.Quantity = autoQty;
								}
							}

							setPerformanceDate(item); // set PerformanceDate
						}
					},
					'ActualEndDate': {
						get: function () {
							return end;
						},
						set: function (value) {
							end = value;
							if (item.IsManualQuantity === false) {
								var autoQty = calcAutoQty(item);
								if(autoQty) {
									item.Quantity = autoQty;
								}
							}
						}
					},
					'IsManualQuantity': {
						get: function () {
							return isManualQty;
						},
						set: function (value) {
							isManualQty = value;
							if (value === false) {
								var autoQty = calcAutoQty(item);
								if (autoQty) {
									item.Quantity = autoQty;
								}
							}

							setQuantityReadOnly(item);
						}
					}
				});

				setQuantityReadOnly(item);
			};

			function setQuantityReadOnly(item) {
				var isReadonly = !item.IsManualQuantity;
				platformRuntimeDataService.readonly(item, [{field: 'Quantity', readonly: isReadonly}]);
			}

			function isNotEmptyDate(item) {
				return item && !_.isNil(item.ActualStartDate) && !_.isNil(item.ActualEndDate) &&
					moment.isMoment(item.ActualStartDate) && moment.isMoment(item.ActualEndDate);
			}

			function calcAutoQty(item) {
				if(isNotEmptyDate(item)) {
					return item.ActualEndDate.diff(item.ActualStartDate, 'minutes') / 60;
				}
				return undefined;
			}

			function setPerformanceDate(item) {
				if(isNotEmptyDate(item)) {
					var d = moment.utc();
					d.year(item.ActualStartDate.year());
					d.month(item.ActualStartDate.month());
					d.date(item.ActualStartDate.date());
					item.PerformanceDate = d;
				}
			}
		}]);
})();
