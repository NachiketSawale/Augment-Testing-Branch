/*
 * $Id: documents-centralquery-ui-configuration-service.js 589978 2020-06-08 07:48:38Z pel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global */
	var moduleName = 'documents.centralquery';

	/**
	 * @ngdoc service
	 * @name documentsCentralQueryUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('documentsCentralQueryUIConfigurationService', [
		function () {
			var service = {};
			/* service.getMainEntityNameLayout = function () {
				return {
					fid: 'documents.centralquery.mainEntityNameForm',
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
			}; */


			return service;
		}
	]);
})(angular);
