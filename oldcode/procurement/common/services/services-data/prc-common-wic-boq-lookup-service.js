/**
	 * Created by chi on 3/26/2019.
	 */

(function(angular){
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonWicBoqLookupService', procurementCommonWicBoqLookupService);

	procurementCommonWicBoqLookupService.$inject = ['$http', 'globals', 'platformLookupDataServiceFactory'];

	function procurementCommonWicBoqLookupService($http, globals, platformLookupDataServiceFactory) {
		var config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'boq/wic/boq/',
				endPointRead: 'boqrootitemsbywicgroupid'
			},
			filterParam: 'groupId',
			prepareFilter: function (groupId) {
				return '?groupId=' + groupId;
			}
		};
		var service = platformLookupDataServiceFactory.createInstance(config).service;

		service.getBoqRootItemsByWicCatGroupId = getBoqRootItemsByWicCatGroupId;

		return service;

		// ////////////////////////////
		function getBoqRootItemsByWicCatGroupId(groupId) {
			return $http.get(globals.webApiBaseUrl + 'boq/wic/boq/boqrootitemsbywicgroupid?groupId=' + groupId);
		}
	}
})(angular);