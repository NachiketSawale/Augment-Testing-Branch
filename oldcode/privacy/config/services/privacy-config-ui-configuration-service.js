/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'privacy.config';

	/**
	 * @ngdoc service
	 * @name privacyConfigUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('privacyConfigUIConfigurationService', [
		function () {
			var service = {};
			
			service.getPrivacyHandledTypeLayout = function () {
				return {
					fid: 'privacy.config.privacyHandledTypeForm',
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
