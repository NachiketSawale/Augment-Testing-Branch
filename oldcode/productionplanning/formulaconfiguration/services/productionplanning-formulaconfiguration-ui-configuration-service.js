/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.formulaconfiguration';

	/**
	 * @ngdoc service
	 * @name productionPlanningFormulaConfigurationUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('productionPlanningFormulaConfigurationUIConfigurationService', [
		function () {
			var service = {};
			
/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'productionplanning.formulaconfiguration.mainEntityNameForm',
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
