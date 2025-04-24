/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/* global globals */
	'use strict';

	var moduleName = 'controlling.controllingunittemplate';
	angular.module(moduleName).factory('controllingControllingunittemplateLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('controllingControllingunittemplateLookupService', {
				valMember: 'Id',
				dispMember: 'Code',
				uuid: '2c2afe968f6f48ea9c638f289defa1a7',
				showIcon: false,
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			});

			var container = platformLookupDataServiceFactory.createInstance({
				httpRead: {
					route: globals.webApiBaseUrl + 'controlling/controllingunittemplate/',
					endPointRead: 'lookuplist'
				}
			});

			return container.service;

		}]);
})(angular);