/**
 * Created by leo on 07.11.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingSheetLookupByRecordingDataService
	 * @function
	 * @description
	 *
	 * data service for timekeeping sheet lookup filtered by recording.
	 */
	angular.module('basics.lookupdata').factory('timekeepingSheetLookupByRecordingDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			let readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingSheetLookupByRecordingDataService', {
				valMember: 'Id',
				dispMember: 'EmployeeDescription',
				columns: [
					{
						id: 'Comment',
						field: 'CommentText',
						name: 'CommentText',
						formatter: 'comment',
						width: 100,
						name$tr$: 'cloud.common.entityComment'
					},
					{
						id: 'Employee',
						field: 'EmployeeFk',
						name: 'EmployeeFk',
						width: 150,
						name$tr$: 'timekeeping.common.employee',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingEmployeeLookupDataService',
							cacheEnable: true,
							displayMember: 'Code',
							additionalColumns: false
						}).grid.formatterOptions
					},
					{
						id: 'Employee-Description',
						field: 'EmployeeDescription',
						name: 'Employee-Description',
						width: 150,
						name$tr$: 'timekeeping.common.employeeDescription',
						formatter: 'description'
					},
					{
						id: 'Employee-Firstname',
						field: 'EmployeeFk',
						name: 'First Name',
						width: 150,
						name$tr$: 'timekeeping.employee.entityFirstName',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingEmployeeLookupDataService',
							cacheEnable: true,
							dispMember: 'FirstName',
							additionalColumns: false
						}).grid.formatterOptions
					},
					{
						id: 'Employee-Familyname',
						field: 'EmployeeFk',
						name: 'Family Name',
						width: 150,
						name$tr$: 'timekeeping.employee.entityFamilyName',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingEmployeeLookupDataService',
							cacheEnable: true,
							dispMember: 'FamilyName',
							additionalColumns: false
						}).grid.formatterOptions
					},
					{
						id: 'SheetStatus',
						field: 'SheetStatusFk',
						name: 'SheetStatusFk',
						width: 150,
						name$tr$: 'basics.customize.timekeepingsheetstatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.timekeepingsheetstatus',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						}
					},
					{
						id: 'SheetSymbol',
						field: 'SheetSymbolFk',
						name: 'SheetSymbolFk',
						width: 150,
						name$tr$: 'timekeeping.common.sheetSymbol',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.timekeepingsheetsymbol',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						}
					}
				],
				uuid: '8540db15475c4dc0ae19783686141508'
			});

			let lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/recording/sheet/', endPointRead: 'listbyparent'},
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
