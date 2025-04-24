/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function (angular) {
	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).factory('basicsControllingCostCodesUIConfig', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			getControllingCostCodesUILayout: function () {
				return {
					'fid': 'basics.controllingcostcodes',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['code', 'descriptioninfo', 'uomfk', 'commenttext', 'isrevenue','iscostprr','isrevenueprr']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'code': {
							'mandatory': true,
							'searchable': true
						},
						'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						})
					}
				};
			}
		};
	}]);
})(angular);