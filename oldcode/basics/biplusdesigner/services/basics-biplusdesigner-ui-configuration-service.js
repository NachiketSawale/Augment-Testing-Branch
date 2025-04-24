/*
 * $Id: basics-biplusdesigner-ui-configuration-service.js 604408 2020-09-24 08:43:19Z lta $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'basics.biplusdesigner';

	/**
	 * @ngdoc service
	 * @name basicsBiPlusDesignerUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('basicsBiPlusDesignerUIConfigurationService', [
		function () {
			var service = {};
			
			/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'basics.biplusdesigner.mainEntityNameForm',
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
