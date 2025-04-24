/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainValueTypeService
	 * @function
	 * @requires
	 *
	 * @description Provides utilities related to value types for use in model properties.
	 */
	angular.module('model.main').factory('modelMainValueTypeService', [
		function () {
			var service = {};

			service.valueTypes = {
				string: 1,
				decimal: 2,
				integer: 3,
				boolean: 4,
				dateTime: 5
			};

			return service;
		}]);
})();