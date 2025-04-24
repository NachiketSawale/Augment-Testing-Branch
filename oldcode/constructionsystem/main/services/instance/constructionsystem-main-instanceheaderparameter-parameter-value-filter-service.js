/**
 * Created by lvy on 4/25/2018.
 */

(function(angular){
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainInstanceHeaderParameterParameterValueFilterService', constructionSystemMainInstanceHeaderParameterParameterValueFilterService);

	constructionSystemMainInstanceHeaderParameterParameterValueFilterService.$inject = [];

	function constructionSystemMainInstanceHeaderParameterParameterValueFilterService() {
		return function (key, needToShowVirtualValue, customfilterFunc) {
			needToShowVirtualValue = angular.isDefined(needToShowVirtualValue) && needToShowVirtualValue !== null ? needToShowVirtualValue : false;
			function filterFunc(item) {
				var filter = null;
				if (item) {
					var CosGlobalParamFk = item.CosGlobalParamFk;
					if (CosGlobalParamFk > -1) {
						filter = 'CosGlobalParamFk=' + CosGlobalParamFk;
					}
				}
				return {
					customerFilter: filter,
					needToShowVirtualValue: needToShowVirtualValue,
					currentItemId: item.Id
				};
			}

			return {
				key: key,
				serverSide: true,
				fn: angular.isFunction(customfilterFunc) ? customfilterFunc : filterFunc
			};
		};
	}
})(angular);