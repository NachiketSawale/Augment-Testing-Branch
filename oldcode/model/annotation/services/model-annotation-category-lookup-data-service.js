/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const serviceName = 'modelAnnotationCategoryLookupDataService';

	angular.module('model.annotation').factory(serviceName,
		modelAnnotationCategoryLookupDataService);

	modelAnnotationCategoryLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAnnotationCategoryLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'Id',
			dispMember: 'Description',
			additionalColumns: false,
			uuid: '9f713cae272a4fc78435ec504034a33a'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/annotation/category/',
				endPointRead: 'listfortype'
			},
			filterParam: 'rawAnnotationType'
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}
})(angular);
