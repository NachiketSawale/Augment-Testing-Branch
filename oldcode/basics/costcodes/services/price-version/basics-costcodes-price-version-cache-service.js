(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';


	angular.module(moduleName).factory('basicsCostcodesPriceVersionCacheService',
		[
			function () {
				let costCodeId2PriceVersionMap = {};

				let service = {};

				service.set = function (costCodeId, priceVersion) {
					costCodeId2PriceVersionMap[costCodeId] = priceVersion;
				};


				service.get = function (costCodeId) {
					return costCodeId2PriceVersionMap[costCodeId];
				};

				service.delete = function(costCodeId){
					delete costCodeId2PriceVersionMap[costCodeId];
				};

				return service;

			}]);
})(angular);