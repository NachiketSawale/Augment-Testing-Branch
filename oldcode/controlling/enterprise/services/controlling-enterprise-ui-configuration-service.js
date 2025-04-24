/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.enterprise';

	/**
	 * @ngdoc service
	 * @name controllingEnterpriseUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('controllingEnterpriseUIConfigurationService', [
		function () {
			var service = {};
			
			/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'controlling.enterprise.mainEntityNameForm',
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
