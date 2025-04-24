/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationMarkerDataService';

	myModule.factory(svcName, modelAnnotationMarkerDataService);

	modelAnnotationMarkerDataService.$inject = ['modelAnnotationMarkerDataServiceFactory',
		'modelAnnotationDataService'];

	function modelAnnotationMarkerDataService(modelAnnotationMarkerDataServiceFactory,
		modelAnnotationDataService) {

		return modelAnnotationMarkerDataServiceFactory.createService({
			serviceName: svcName,
			parentService: modelAnnotationDataService
		});
	}
})(angular);
