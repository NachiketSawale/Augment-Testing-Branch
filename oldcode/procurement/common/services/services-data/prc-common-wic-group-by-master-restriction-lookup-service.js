/**
 * Created by chi on 3/26/2019.
 */

(function(angular){
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonWicGroupByMasterRestrictionLookupService', procurementCommonWicGroupByMasterRestrictionLookupService);

	procurementCommonWicGroupByMasterRestrictionLookupService.$inject = ['globals', 'platformLookupDataServiceFactory'];

	function procurementCommonWicGroupByMasterRestrictionLookupService(globals, platformLookupDataServiceFactory) {
		var config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'boq/wic/group/',
				endPointRead: 'lookupbycontractid'
			},
			filterParam: 'contractId',
			prepareFilter: function (contractId) {
				return '?contractId=' + contractId;
			},
			tree: {parentProp: 'WicGroupFk', childProp: 'WicGroups'}
		};
		return platformLookupDataServiceFactory.createInstance(config).service;
	}
})(angular);