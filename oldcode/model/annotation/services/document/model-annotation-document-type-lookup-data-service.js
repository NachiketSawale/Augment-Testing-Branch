/*
 * $Id: model-annotation-document-type-lookup-data-service.js
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.annotation';
	const serviceName = 'modelAnnotationDocumentTypeLookupDataService';

	angular.module(moduleName).factory(serviceName, modelAnnotationDocumentTypeLookupDataService);

	modelAnnotationDocumentTypeLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAnnotationDocumentTypeLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'DocumentType',
			dispMember: 'DisplayName',
			columns: [{
				id: 'Description',
				field: 'DisplayName',
				name: 'Description',
				formatter: 'description',
				width: 200,
				name$tr$: 'cloud.common.descriptionInfo'
			}],
			uuid: '97eb9337637549d6ac0a302bb14d7988'
		});
		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/annotation/',
				endPointRead: 'documenttypes'
			}
		};
		return platformLookupDataServiceFactory.createInstance(config).service;
	}

})(angular);

