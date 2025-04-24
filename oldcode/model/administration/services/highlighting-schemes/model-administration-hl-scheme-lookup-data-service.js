/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';
	const serviceName = 'modelAdministrationHlSchemeLookupDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationHlSchemeLookupDataService
	 * @function
	 *
	 * @description
	 * Lists highlighting schemes.
	 */
	angular.module(moduleName).factory(serviceName, modelAdministrationHlSchemeLookupDataService);

	modelAdministrationHlSchemeLookupDataService.$inject = ['_', 'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function modelAdministrationHlSchemeLookupDataService(_, platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			dispMember: 'DescriptionInfo.Translated',
			valMember: 'Id'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/administration/hlscheme/',
				endPointRead: 'listschemes'
			},
			filterParam: 'rulesetId'
		};

		const container = platformLookupDataServiceFactory.createInstance(config);

		container.service.getlookupType = function () {
			return serviceName;
		};

		return container.service;
	}
})(angular);
