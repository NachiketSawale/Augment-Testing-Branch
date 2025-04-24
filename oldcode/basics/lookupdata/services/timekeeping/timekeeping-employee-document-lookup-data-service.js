/**
 * $Id: timekeeping-employee-document-lookup-data-service.js 36806 2025-03-24 14:29:59Z chd $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeDocumentLookupDataService
	 * @function
	 * @description
	 *
	 * data service for timekeeping employee documents lookup filtered by employee.
	 */
	angular.module('basics.lookupdata').factory('timekeepingEmployeeDocumentLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			let readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingEmployeeDocumentLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'DocumentType',
						field: 'DocumentTypeFk',
						name: 'Type',
						width: 150,
						name$tr$: 'cloud.common.entityType',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.documenttype',
							displayMember: 'Description',
							readOnly: true,
							valueMember: 'Id',
						},
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						readOnly: true,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'EmployeeDocumentType',
						field: 'EmployeeDocumentTypeFk',
						name: 'Document Type',
						width: 150,
						name$tr$: 'timekeeping.employee.entityEmployeeDocumentTypeFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.timekeepingemployeedocumenttype',
							displayMember: 'Description',
							readOnly: true,
							valueMember: 'Id',
						},
					},
					{
						id: 'OriginFileName',
						field: 'OriginFileName',
						name: 'OriginFileName',
						formatter: 'description',
						width: 150,
						readOnly: true,
						name$tr$: 'timekeeping.employee.entityOriginFileName'
					},
					{
						id: 'IsHiddenInPublicApi',
						field: 'IsHiddenInPublicApi',
						name: 'Is Hidden In Public Api',
						width: 150,
						name$tr$: 'timekeeping.employee.entityIsHiddenInPublicPpi',
						formatter: 'boolean',
						readOnly: true,
					},
				],
				uuid: 'cec0f3c32ddf4c94b30dfe313fc4526e'
			});

			let lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/employees/document/', endPointRead: 'listbyparent'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},
				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);