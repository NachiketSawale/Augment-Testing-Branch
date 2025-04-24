/**
 * Created by chi on 6/13/2016.
 */
(function(angular){
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainInstanceParameterParameterValueFilterService', constructionSystemMainInstanceParameterParameterValueFilterService);

	constructionSystemMainInstanceParameterParameterValueFilterService.$inject = [];

	function constructionSystemMainInstanceParameterParameterValueFilterService() {
		return function (key, needToShowVirtualValue, customfilterFunc) {
			needToShowVirtualValue = angular.isDefined(needToShowVirtualValue) && needToShowVirtualValue !== null ? needToShowVirtualValue : false;
			function filterFunc(item) {
				var filter = null;
				if (item) {
					var cosParameterFk = item.ParameterFk;
					if (cosParameterFk > -1) {
						filter = 'CosParameterFk=' + cosParameterFk;
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