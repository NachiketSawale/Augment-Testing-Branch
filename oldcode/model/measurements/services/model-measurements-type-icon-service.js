/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.measurements');

	/**
	 * @ngdoc service
	 * @name modelMeasurementTypeIconService
	 * @description Provides icons for the different types of model measurements.
	 */
	myModule.service('modelMeasurementTypeIconService', ModelMeasurementTypeIconService);

	ModelMeasurementTypeIconService.$inject = ['platformIconBasisService', 'modelMeasurementTypes'];

	function ModelMeasurementTypeIconService(platformIconBasisService, modelMeasurementTypes) {
		platformIconBasisService.setBasicPath('');

		const icons = [
			platformIconBasisService.createCssIconWithId(modelMeasurementTypes.byCode.StraightDistance, 'model.measurements.distance', 'control-icons ico-measurement-type-distance'),
			platformIconBasisService.createCssIconWithId(modelMeasurementTypes.byCode.Perimeter, 'model.measurements.perimeter', 'control-icons ico-measurement-type-perimeter'),
			platformIconBasisService.createCssIconWithId(modelMeasurementTypes.byCode.Area, 'model.measurements.area', 'control-icons ico-measurement-type-surface'),
			platformIconBasisService.createCssIconWithId(modelMeasurementTypes.byCode.Volume, 'model.measurements.volume', 'control-icons ico-measurement-type-volume')
		];

		platformIconBasisService.extend(icons, this);
	}
})(angular);
