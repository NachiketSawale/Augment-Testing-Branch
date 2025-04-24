/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.formwork';

	/**
	 * @ngdoc service
	 * @name productionplanningFormworkUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('productionplanningFormworkUIConfigurationService', [
		function () {
			var service = {};
			
/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'productionplanning.formwork.mainEntityNameForm',
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
