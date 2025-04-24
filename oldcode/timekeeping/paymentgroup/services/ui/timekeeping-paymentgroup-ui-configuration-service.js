/*
 * $Id: timekeeping-paymentgroup-ui-configuration-service.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'timekeeping.paymentgroup';

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentgroupUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('timekeepingPaymentGroupUIConfigurationService', [
		function () {
			var service = {};
			
			service.getPaymentGroupLayout = function () {
				return {
					fid: 'timekeeping.paymentgroup.paymentGroupForm',
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
			
			return service;
		}
	]);
})(angular);
