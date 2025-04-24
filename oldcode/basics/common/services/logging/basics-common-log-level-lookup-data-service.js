/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'basics.common';
	const serviceName = 'basicsCommonLogLevelLookupDataService';

	angular.module(moduleName).factory(serviceName, basicsCommonLogLevelLookupDataService);

	basicsCommonLogLevelLookupDataService.$inject = ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator'];

	function basicsCommonLogLevelLookupDataService(platformLookupDataServiceFactory,
		basicsLookupdataConfigGenerator) {

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(serviceName, {
			valMember: 'Id',
			dispMember: 'DisplayName',
			columns: [{
				id: 'Description',
				field: 'DisplayName',
				name: 'Description',
				formatter: 'description',
				width: 200,
				name$tr$: 'cloud.common.descriptionInfo'
			}],
			uuid: '3595383ee7a34bab8165eccbef2dac32'
		});

		const config = {
			httpRead: {
				route: globals.webApiBaseUrl + 'basics/common/loglevel/',
				endPointRead: 'list'
			},
			dataProcessor: [{
				processItem: function (item) {
					item.Id = item.Id.Id;
					item.DisplayName = item.DescriptionInfo.Translated;
				}
			}]
		};

		return platformLookupDataServiceFactory.createInstance(config).service;
	}

})(angular);
