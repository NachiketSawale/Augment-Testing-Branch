/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';
	const serviceName = 'modelAdministrationPropertyKeyTagCategoryLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyTagCategoryLookupDataService
	 * @function
	 *
	 * @description
	 * Lists property key tag categories.
	 */
	angular.module(moduleName).factory(serviceName,
		modelAdministrationPropertyKeyTagCategoryLookupDataService);

	modelAdministrationPropertyKeyTagCategoryLookupDataService.$inject = ['_',
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		'ServiceDataProcessArraysExtension'];

	function modelAdministrationPropertyKeyTagCategoryLookupDataService(_,
		platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,
		ServiceDataProcessArraysExtension) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			dispMember: 'DescriptionInfo.Translated',
			valMember: 'Id',
			columns: [{
				id: 'Description',
				field: 'DescriptionInfo.Translated',
				name: 'Description',
				formatter: 'description',
				width: 150,
				name$tr$: 'cloud.common.entityDescription'
			}],
			uuid: '5d5c988bfe3c42e680b0fbf9f946a6f4'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/administration/propkeytagcat/',
				endPointRead: 'list'
			},
			dataProcessor: [new ServiceDataProcessArraysExtension(['Children'])],
			tree: {
				parentProp: 'PropertyKeyTagParentCategoryFk',
				childProp: 'Children'
			},
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		return container.service;
	}
})(angular);
