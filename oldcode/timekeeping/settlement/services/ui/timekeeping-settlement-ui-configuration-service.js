/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('timekeepingSettlementUIConfigurationService', [
		function () {
			var service = {};

			/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'timekeeping.settlement.mainEntityNameForm',
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
