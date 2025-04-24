/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.filtertrees';

	/**
	 * @ngdoc service
	 * @name modelFiltertreesUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('modelFiltertreesUIConfigurationService', [
		function () {
			var service = {};
			service.getModelObjectIFCTreeDetailLayout = function getModelObjectIFCTreeDetailLayout() {
				return {
					fid: 'model.filtertrees.getModelObjectIFCTreeDetailLayout',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['descriptioninfo']
						}
					],
					overloads: {
						descriptioninfo: { readonly: true },
						version: { readonly: true }
					}
				};
			};

			return service;
		}
	]);
})(angular);
