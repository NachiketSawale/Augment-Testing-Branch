/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'timekeeping.certificate';

	/**
	 * @ngdoc service
	 * @name timekeepingCertificateUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('timekeepingCertificateUIConfigurationService', [
		function () {
			let service = {};

			/*
			service.getMainEntityNameLayout = function () {
				return {
					fid: 'timekeeping.certificate.mainEntityNameForm',
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
