/**
 * $Id: model-main-viewpoint-data-service.js$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.main');
	const svcName = 'modelMainViewpointDataService';

	myModule.factory(svcName, modelMainViewpointDataService);

	modelMainViewpointDataService.$inject = ['modelMainViewpointDataServiceFactory',
		'modelMainObjectDataService'];

	function modelMainViewpointDataService(modelMainViewpointDataServiceFactory,
		modelMainObjectDataService) {

		return modelMainViewpointDataServiceFactory.createService({
			serviceName: svcName,
			parentService: modelMainObjectDataService
		});
	}
})(angular);

