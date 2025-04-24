/**
 * Created by janas on 08.06.2020.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectBilltoLookupDataService
	 * @function
	 *
	 * @description
	 * data service for project billto lookups
	 */
	angular.module('basics.lookupdata').factory('projectBilltoLookupDataService',
		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectBilltoLookupDataService', {
					valMember: 'Id',
					dispMember: 'Code',
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'desc',
							field: 'Description',
							name: 'Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'BusinesspartnerFk',
							field: 'BusinesspartnerFk',
							name: 'BusinessPartner',
							name$tr$: 'businesspartner.main.name1',
							formatter: 'lookup',
							formatterOptions: {
								lookupSimpleLookup: true,
								lookupModuleQualifier: 'businesspartner.lookup.businesspartner',
								displayMember: 'BP_NAME1',
								valueMember: 'Id'
							},
							width: 150
						},
						{
							id: 'SubsidiaryFk',
							field: 'SubsidiaryFk',
							name: 'Branch',
							name$tr$: 'cloud.common.entitySubsidiary',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'subsidiary',
								displayMember: 'AddressLine'
							},
							width: 150
						},
						{
							id: 'customerfk',
							field: 'CustomerFk',
							name: 'Customer',
							name$tr$: 'cloud.common.entityCustomer',
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'Code',
								lookupType: 'customer'
							}
						},
						{
							id: 'quantityPortion',
							field: 'QuantityPortion',
							name: 'Quantity Portion (in %)',
							name$tr$: 'project.main.quantityPortion',
							formatter: 'percent'
						},
						{
							id: 'Comments',
							field: 'Comment',
							name: 'Comment',
							formatter: 'comment',
							width: 100,
							name$tr$: 'cloud.common.entityComment'
						},
						{
							id: 'Remark',
							field: 'Remark',
							name: 'remarks',
							formatter: 'remark',
							width: 100,
							name$tr$: 'cloud.common.entityRemark'
						}
					],
					uuid: '284a0140f0e547fc8ac839181362f1dc'
				});

				var readData = {PKey1: null};
				var lookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl + 'project/main/billto/',
						endPointRead: 'listbyparent'
					},
					filterParam: readData,
					prepareFilter: function prepareFilter(projectId) {
						readData.PKey1 = projectId;
						return readData;
					}
				};

				return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
			}]);
})(angular);
