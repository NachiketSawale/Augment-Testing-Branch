/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const modelMeasurementsModule = angular.module('model.measurements');

	const svcName = 'modelMeasurementModelAnnoObjectLinkDataService';

	/**
	 * @ngdoc service
	 * @name modelMeasurementModelAnnoObjectLinkDataService
	 * @function
	 *
	 * @description
	 */
	modelMeasurementsModule.factory(svcName,
		modelMeasurementModelAnnoObjectLinkDataService);

	modelMeasurementModelAnnoObjectLinkDataService.$inject = ['modelMeasurementDataService',
		'modelAnnotationObjectLinkDataServiceFactory'];

	function modelMeasurementModelAnnoObjectLinkDataService(modelMeasurementDataService,
		modelAnnotationObjectLinkDataServiceFactory) {

		return modelAnnotationObjectLinkDataServiceFactory.createService({
			moduleName: 'model.measurements',
			serviceName: svcName,
			parentService: modelMeasurementDataService,
			getParentIdComponents: item => [item.Id],
			typeId: 'model.measurements'
		});
	}
})(angular);
