/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('resourcePlantpricingUIConfigurationService', [
		function () {
			var service = {};
			
/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'resource.plantpricing.mainEntityNameForm',
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
