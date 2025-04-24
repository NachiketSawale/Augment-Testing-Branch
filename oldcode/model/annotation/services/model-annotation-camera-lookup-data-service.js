(function (angular) {
	/* global globals */
	'use strict';

	const serviceName = 'modelAnnotationCameraLookupDataService';

	angular.module('model.annotation').factory(serviceName,
		modelAnnotationCameraLookupDataService);

	modelAnnotationCameraLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAnnotationCameraLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'Id',
			dispMember: 'DescriptionInfo.Translated',
			columns: [
				{
					id: 'DescriptionInfo',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					formatter: 'description',
					width: 150,
					name$tr$: 'model.annotation.cameraListTitle'
				}
			],
			uuid: '93db555a58bc4b9ea211b45569adfe1b'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/annotation/camera/',
				endPointRead: 'list'
			},
			filterParam: 'annotationId'
		};

		var temp = platformLookupDataServiceFactory.createInstance(config).service;
		return temp;
	}
})(angular);
