/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc service
	 * @name modelMeasurementPointUIConfigurationService
	 * @function
	 *
	 * @description
	 * modelMeasurementPointUIConfigurationService is the data service for the UI configurations of the model measurement point entity.
	 */
	angular.module(moduleName).factory('modelMeasurementPointUIConfigurationService', modelMeasurementPointUIConfigurationService);

	modelMeasurementPointUIConfigurationService.$inject = [];

	function modelMeasurementPointUIConfigurationService() {
		const service = {};

		service.getModelMeasurementPointLayout = function () {
			return {
				fid: 'model.measurements.modelMeasurementsPointForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'sorting', 'posx', 'posy', 'posz']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}]
			};
		};
		return service;
	}
})(angular);
