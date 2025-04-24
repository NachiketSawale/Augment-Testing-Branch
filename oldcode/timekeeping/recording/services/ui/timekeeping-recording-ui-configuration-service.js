/*
 * $Id: timekeeping-recording-ui-configuration-service.js 558194 2019-09-10 09:19:36Z postic $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingUIConfigurationService
	 * @function
	 * @requires 
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('timekeepingRecordingUIConfigurationService', [
		function () {
			var service = {};
			
			/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'timekeeping.recording.mainEntityNameForm',
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
