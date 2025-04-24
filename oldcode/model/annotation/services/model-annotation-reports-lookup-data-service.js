/*
 * $Id: model-annotation-reports-lookup-data-service.js
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.annotation';
	const serviceName = 'modelAnnotationReportsLookupDataService';

	angular.module(moduleName).factory(serviceName, modelAnnotationReportsLookupDataService);

	modelAnnotationReportsLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAnnotationReportsLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'Id.Id',
			dispMember: 'DisplayName',
			columns: [{
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'description',
				width: 200,
				name$tr$: 'cloud.common.descriptionInfo'
			}],
			uuid: ''
		});
		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/annotation/',
				endPointRead: 'reports'
			},
			dataProcessor: [{
				processItem(item) {
					item.Id = item.Id.Id;
				}
			}]
		};
		return platformLookupDataServiceFactory.createInstance(config).service;
	}

})(angular);

