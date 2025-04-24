/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const modelMeasurementsModule = angular.module('model.measurements');

	const svcName = 'modelMeasurementModelAnnoCameraDataService';

	/**
	 * @ngdoc service
	 * @name modelMeasurementModelAnnoCameraDataService
	 * @function
	 *
	 * @description
	 */
	modelMeasurementsModule.factory(svcName,
		modelMeasurementModelAnnoCameraDataService);

	modelMeasurementModelAnnoCameraDataService.$inject = ['modelMeasurementDataService',
		'modelAnnotationCameraDataServiceFactory'];

	function modelMeasurementModelAnnoCameraDataService(modelMeasurementDataService,
		modelAnnotationCameraDataServiceFactory) {

		return modelAnnotationCameraDataServiceFactory.createService({
			moduleName: 'model.measurements',
			serviceName: svcName,
			parentService: modelMeasurementDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'model.measurements',
			getProjectIdFromParent: item => item.PrjProjectFk
		});
	}
})(angular);
