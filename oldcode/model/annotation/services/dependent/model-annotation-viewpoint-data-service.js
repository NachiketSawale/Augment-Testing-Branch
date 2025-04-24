/*
 * $Id: model-annotation-model-main-viewpoint-data-service.js
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationViewpointDataService';

	myModule.factory(svcName, modelAnnotationViewpointDataService);

	modelAnnotationViewpointDataService.$inject = ['modelMainViewpointDataServiceFactory',
		'modelAnnotationDataService'];

	function modelAnnotationViewpointDataService(modelMainViewpointDataServiceFactory,
		modelAnnotationDataService) {

		return modelMainViewpointDataServiceFactory.createService({
			serviceName: svcName,
			parentService: modelAnnotationDataService
		});
	}
})(angular);
