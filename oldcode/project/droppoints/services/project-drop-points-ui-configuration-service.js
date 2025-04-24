/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'project.droppoints';

	/**
	 * @ngdoc service
	 * @name projectDropPointsUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('projectDropPointsUIConfigurationService', [
		function () {
			var service = {};

/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'project.DropPoints.mainEntityNameForm',
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
