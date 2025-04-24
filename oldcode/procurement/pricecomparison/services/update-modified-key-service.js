/**
 * Created by ada on 2018/12/25.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).service('PriceComparisonUpdateModifiedKeyService', ['_', 'procurementPriceComparisonCommonService',
		function (_, commonService) {

			var service = {};

			/**
			 * @param saveData
			 * @param type number => item: 1, boq => 2
			 * @param returnResult
			 */
			service.updateModifiedKey = function (saveData, type, returnResult) {

				var modifiedData = {};
				_.map(saveData.ModifiedData, function (value, key) {
					var newQtnId = returnResult.QtnHeaderSourceTargetIds[key],
						resultItem = null;

					if (newQtnId > 0) {
						if (type === commonService.constant.compareType.boqItem) {
							_.forEach(value, function (val) {
								resultItem = _.find(returnResult.BoqItemSourceTargetIds, {Key: val.Id});
								val.Id = resultItem ? resultItem.Value : val.Id;
							});
						} else {
							_.forEach(value, function (val) {
								resultItem = _.find(returnResult.PrcItemSourceTargetIds, {Key: val.Id});
								val.Id = resultItem ? resultItem.Value : val.Id;

								if (!resultItem) {
									val.Id = returnResult.ReplaceItemSourceTargetIds[val.Id];
								}
							});
						}

						modifiedData[newQtnId] = value;
					} else {
						modifiedData[key] = value;
					}
				});
				saveData.ModifiedData = modifiedData;
			};

			return service;
		}]);

})(angular);