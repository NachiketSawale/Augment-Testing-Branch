/*
 * $Id: cloud-uitesting-ui-configuration-service.js 562411 2019-10-10 11:46:18Z ong $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'cloud.uitesting';

	/**
	 * @ngdoc service
	 * @name cloudUitestingUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('cloudUitestingUIConfigurationService', [
		function () {
			var service = {};
			
/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'cloud.uitesting.mainEntityNameForm',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': []
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
					}
				};
			};
*/
			
			return service;
		}
	]);
})(angular);
