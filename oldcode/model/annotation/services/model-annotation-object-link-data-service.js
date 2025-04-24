/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationObjectLinkDataService';

	myModule.factory(svcName, modelAnnotationObjectLinkDataService);

	modelAnnotationObjectLinkDataService.$inject = ['modelAnnotationObjectLinkDataServiceFactory',
		'modelAnnotationDataService'];

	function modelAnnotationObjectLinkDataService(modelAnnotationObjectLinkDataServiceFactory,
		modelAnnotationDataService) {

		return modelAnnotationObjectLinkDataServiceFactory.createService({
			serviceName: svcName,
			parentService: modelAnnotationDataService
		});
	}
})(angular);
