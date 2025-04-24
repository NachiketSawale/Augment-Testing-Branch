/*
 * $Id: timekeeping-period-ui-configuration-service.js 546944 2019-06-05 13:17:45Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'timekeeping.period';

	/**
	 * @ngdoc service
	 * @name timekeepingPeriodUIConfigurationService
	 * @function
	 * @requires timekeepingPeriodUIConfigurationService
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('timekeepingPeriodUIConfigurationService', [
		function () {
			let service = {};

			/*
						service.getMainEntityNameLayout = function () {
							return {
								fid: 'timekeeping.period.mainEntityNameForm',
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
