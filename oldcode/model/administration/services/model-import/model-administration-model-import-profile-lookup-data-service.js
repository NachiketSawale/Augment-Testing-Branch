/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	const serviceName = 'modelAdministrationModelImportProfileLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationModelImportProfileLookupDataService
	 * @function
	 *
	 * @description
	 * Provides access to model administration model import profiles for a lookup.
	 */
	angular.module(moduleName).factory(serviceName,
		modelAdministrationModelImportProfileLookupDataService);

	modelAdministrationModelImportProfileLookupDataService.$inject = ['_', 'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAdministrationModelImportProfileLookupDataService(_, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
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
				endPointRead: 'listforlookup'
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

		return container.service;
	}
})(angular);
