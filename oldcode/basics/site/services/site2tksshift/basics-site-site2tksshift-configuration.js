/**
 * Created by lav on 11/28/2019.
 */
(function () {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).factory('basicsSite2TksShiftLayout', Layout);

	Layout.$inject = ['basicsLookupdataConfigGenerator'];

	function Layout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'basics.site.site2TksShiftLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['tksshiftfk', 'islive']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				tksshiftfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingShiftModelLookupDataService'
				})
			}
		};
	}
})();