/*
 *  $Id$
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.annotation';
	const serviceName = 'modelAnnotationBcfVersionLookupDataService';

	angular.module(moduleName).factory(serviceName, modelAnnotationBcfVersionLookupDataService);

	modelAnnotationBcfVersionLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAnnotationBcfVersionLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'BcfVersion',
			dispMember: 'DisplayName',
			columns: [{
				id: 'Description',
				field: 'DisplayName',
				name: 'Description',
				formatter: 'description',
				width: 200,
				name$tr$: 'cloud.common.descriptionInfo'
			}],
			uuid: '1a964c08d7914fd5a73f54b79919379d'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/annotation/bcf/',
				endPointRead: 'outputversions'
			}
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}

})(angular);

