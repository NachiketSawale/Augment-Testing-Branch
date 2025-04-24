/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationCameraDataService';

	myModule.factory(svcName, modelAnnotationCameraDataService);

	modelAnnotationCameraDataService.$inject = ['modelAnnotationCameraDataServiceFactory',
		'modelAnnotationDataService'];

	function modelAnnotationCameraDataService(modelAnnotationCameraDataServiceFactory,
		modelAnnotationDataService) {

		return modelAnnotationCameraDataServiceFactory.createService({
			serviceName: svcName,
			parentService: modelAnnotationDataService
		});
	}
})(angular);
