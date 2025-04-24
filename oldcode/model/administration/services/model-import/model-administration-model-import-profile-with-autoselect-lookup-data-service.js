/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';
	const serviceName = 'modelAdministrationModelImportProfileWithAutoselectLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationModelImportProfileWithAutoselectLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to model administration model import profiles and an auto-select option for a lookup.
	 */
	angular.module(moduleName).factory(serviceName,
		modelAdministrationModelImportProfileWithAutoselectLookupDataService);

	modelAdministrationModelImportProfileWithAutoselectLookupDataService.$inject = ['_',
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

	function modelAdministrationModelImportProfileWithAutoselectLookupDataService(_,
		platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

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
			uuid: '559c465eaf8647a3955b0708f2b4edcb'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/administration/importprf/',
				endPointRead: 'listforlookupwithauto'
			},
			dataProcessor: [{
				processItem: function (item) {
					item.Id = item.Id.Id;
				}
			}],
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		container.service.getDefaultItemId = function () {
			return -1;
		};

		return container.service;
	}
})(angular);
