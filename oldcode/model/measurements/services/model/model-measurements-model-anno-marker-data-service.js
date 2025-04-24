/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const modelMeasurementsModule = angular.module('model.measurements');

	const svcName = 'modelMeasurementModelAnnoMarkerDataService';

	/**
	 * @ngdoc service
	 * @name modelMeasurementModelAnnoMarkerDataService
	 * @function
	 *
	 * @description
	 */
	modelMeasurementsModule.factory(svcName,
		modelMeasurementModelAnnoMarkerDataService);

	modelMeasurementModelAnnoMarkerDataService.$inject = ['modelMeasurementDataService',
		'modelAnnotationMarkerDataServiceFactory'];

	function modelMeasurementModelAnnoMarkerDataService(modelMeasurementDataService,
		modelAnnotationMarkerDataServiceFactory) {

		return modelAnnotationMarkerDataServiceFactory.createService({
			moduleName: 'model.measurements',
			serviceName: svcName,
			parentService: modelMeasurementDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'model.measurements'
		});
	}
})(angular);