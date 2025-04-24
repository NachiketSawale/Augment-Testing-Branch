/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.measurements';

	angular.module(moduleName).factory('modelMeasurementGroupFilterService', ['modelMeasurementFilterServiceProvider', function (modelMeasurementFilterServiceProvider) {


		const service = modelMeasurementFilterServiceProvider.getFilterService('modelMeasurementGroupFilterService');

		return service;

	}]);

})(angular);