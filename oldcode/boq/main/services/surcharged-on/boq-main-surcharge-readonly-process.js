/**
 * Created by xia on 2/1/2018.
 */
(function (angular) {
	'use strict';

	angular.module('boq.main').factory('boqMainSurchargeReadonlyProcessor', ['platformRuntimeDataService', 'boqMainService', 'boqMainCommonService',
		function (platformRuntimeDataService, boqMainService, boqMainCommonService) {
			var service = {};

			service.processItem = function processItem(boqItem) {
				var selectedBoqItem = boqMainService.getSelected();
				if (selectedBoqItem && boqMainCommonService.isSurchargeItem4(selectedBoqItem)) {
					platformRuntimeDataService.readonly(boqItem, [
						{field: 'QuantitySplit', readonly: true}
					]);
				}
			};

			return service;
		}]);
})(angular);
