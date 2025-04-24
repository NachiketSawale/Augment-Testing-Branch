/**
 * Created by chi on 2018/2/27.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.characteristic';
	angular.module(moduleName).factory('basicsCharacteristicGroupDataCombineLookupService', basicsCharacteristicGroupDataCombineLookupService);

	basicsCharacteristicGroupDataCombineLookupService.$inject = ['$q', '$http', 'globals', 'platformLookupDataServiceFactory'];

	function basicsCharacteristicGroupDataCombineLookupService($q, $http, globals, platformLookupDataServiceFactory) {

		var config = {
			httpRead: { route: globals.webApiBaseUrl + 'basics/characteristic/characteristic/', endPointRead: 'combinationlookup' }, // will be filtered on client side!
			filterParam: 'sectionId'
		};

		var container = platformLookupDataServiceFactory.createInstance(config);
		var service = container.service;
		var baseSetCache = service.setCache;
		var baseGetList = service.getList;

		service.setCache = setCache;
		service.getList = getList;
		service.getlookupType = getlookupType;
		service.getSearchList = getSearchList;
		return service;

		/////////////////////////
		function getlookupType() {
			return 'basicsCharacteristicGroupCodeLookup';
		}

		function setCache(items) {
			baseSetCache(container.options, items);
		}

		function getList(){
			if (!container.options) {
				return $q.when([]);
			}
			service.resetCache(container.options);
			return baseGetList(container.options);
		}

		function getSearchList(filterString, displayMember, scope, setting) {
			if (!setting.searchString) {
				return getList();
			}
			var upperStr = setting.searchString.toUpperCase();
			return getList().then(response => {
				const result = response.filter(item =>
					item.Code?.toUpperCase().includes(upperStr) ||
					item.DescriptionInfo?.Description?.toUpperCase().includes(upperStr)
				);
				return result;
			});
		}
	}
})(angular);