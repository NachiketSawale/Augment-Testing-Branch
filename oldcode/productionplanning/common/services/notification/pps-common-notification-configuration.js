/**
 * Created by lav on 10/22/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	//master Layout
	angular.module(moduleName).factory('ppsCommonNotificationConfigLayout', Layout);

	Layout.$inject = [];

	function Layout() {

		return {
			'fid': 'pps.common.notification',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'source', 'code', 'description', 'message'
					]
				}
			],
			'overloads': {
				source: {readonly: true},
				code: {readonly: true},
				description: {readonly: true},
				message: {readonly: true}
			}
		};
	}

})(angular);