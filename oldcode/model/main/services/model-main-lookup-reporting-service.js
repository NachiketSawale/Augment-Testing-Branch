/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/* global globals */
	'use strict';

	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name mainModelReportingLookupService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('mainModelReportingLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('mainModelReportingLookupService', {
				valMember: 'Id',
				dispMember: 'ReportName',
				showIcon: false,
				columns: [
					{
						id: 'id',
						field: 'ReportName',
						name: 'ReportName',
						formatter: 'description',
						name$tr$: 'cloud.common.entityName'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '9fd7de80cd874d09a5e943c9a9f7b989'
			});

			var config = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/reporting/report/', endPointRead: 'list' }
			};

			var container = platformLookupDataServiceFactory.createInstance(config);

			container.service.getlookupType = function() {
				return 'mainModelReportingLookupService';
			};

			return container.service;

		}]);
})(angular);
