/*
 * $Id: timekeeping-timecontrolling-ui-configuration-service.js 50932 2022-08-15 07:33:12Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc service
	 * @name timekeepingTimecontrollingUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('timekeepingTimeControllingUIConfigurationService', [
		function () {
			var service = {};

			/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'timekeeping.timecontrolling.mainEntityNameForm',
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
