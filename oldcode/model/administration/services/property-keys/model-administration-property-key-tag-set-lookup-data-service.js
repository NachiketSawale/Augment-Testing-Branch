/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyTagSetLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to display data on property key tag sets.
	 */
	angular.module(moduleName).factory('modelAdministrationPropertyKeyTagSetLookupDataService', [
		'modelAdministrationPropertyKeyTagDataService',
		function (modelAdministrationPropertyKeyTagDataService) {
			var service = {};

			service.getItemById = function () {
				// This function must always return null so the async method is invoked.
				return null;
			};

			service.getItemByIdAsync = function (value) {
				return modelAdministrationPropertyKeyTagDataService.getDisplayTextForTagIds(value).then(function (text) {
					return {
						DisplayName: text
					};
				});
			};

			return service;
		}]);
})();