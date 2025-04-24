/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const serviceName = 'modelMainPropertyProcessorLookupDataService';

	angular.module('model.main').factory(serviceName,
		modelMainPropertyProcessorLookupDataService);

	modelMainPropertyProcessorLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator', '_'];

	function modelMainPropertyProcessorLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator, _) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'key',
			dispMember: 'name',
			uuid: '873b854663494643b998216a6985e0c5',
			columns: [{
				id: 'Description',
				field: 'name',
				formatter: 'description',
				name$tr$: 'cloud.common.entityDescription'
			}]
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'model/main/propprocessing/',
				endPointRead: 'processors'
			},
			dataProcessor: [{
				processItem: function (item) {
					item.key = item.Code;
					item.name = _.get(item, 'DescriptionInfo.Translated');

					delete item.Code;
					delete item.DescriptionInfo;
					delete item.Id;
				}
			}]
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}
})(angular);
