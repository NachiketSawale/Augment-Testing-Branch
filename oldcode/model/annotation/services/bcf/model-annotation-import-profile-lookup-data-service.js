(function (angular) {
	/* global globals */
	'use strict';

	const serviceName = 'modelAnnotationImportProfileLookupDataService';

	angular.module('model.annotation').factory(serviceName,
		modelAnnotationImportProfileLookupDataService);

	modelAnnotationImportProfileLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAnnotationImportProfileLookupDataService(platformLookupDataServiceFactory,
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
					name$tr$: 'model.annotation.bcf.profilName'
				}
			],
			uuid: '04e7fb8146544ba9a29c87e381a34548'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/annotation/importprf/',
				endPointRead: 'list'
			}
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}
})(angular);
