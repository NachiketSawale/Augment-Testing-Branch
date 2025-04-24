/*
 * $Id: model-annotation-model-main-viewpoint-data-service.js
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationModelMainViewpointDataService';

	myModule.factory(svcName, modelAnnotationModelMainViewpointDataService);

	modelAnnotationModelMainViewpointDataService.$inject = ['modelMainViewpointDataServiceFactory',
		'modelAnnotationDataService'];

	function modelAnnotationModelMainViewpointDataService(modelMainViewpointDataServiceFactory,
		modelAnnotationDataService) {

		return modelMainViewpointDataServiceFactory.createService({
			serviceName: svcName,
			parentService: modelAnnotationDataService
		});
	}
})(angular);
