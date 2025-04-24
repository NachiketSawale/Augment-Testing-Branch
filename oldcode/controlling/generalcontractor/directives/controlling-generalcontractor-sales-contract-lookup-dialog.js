
(function (angular,globals) {
	/* global globals */
	'use strict';

	globals.lookups.SalesContractInfo = function SalesContractInQto(_,$injector, basicsCommonUtilities, platformContextService){
		let lookupDialogService = $injector.get('controllingGeneralContractorSalesContractLookupDialogService');
		return {
			lookupOptions:{
				lookupType: 'SalesContractInfo',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '8CDDAEFEF07B4E0EB46B4BCDE225A8FC',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						width: 180,
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						width: 300,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'status', field: 'OrdStatusFk', name: 'Status', name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							lookupModuleQualifier: 'basics.customize.orderstatus',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100,
						searchable: false
					},
					{
						id: 'businesspartnerfk',
						field: 'BusinesspartnerFk',
						name: 'Business Partner',
						name$tr$: 'cloud.common.entityBusinessPartner',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						width: 100,
						searchable: false
					},
					{
						id: 'subsidiaryfk',
						field: 'SubsidiaryFk',
						name: 'Branch',
						name$tr$: 'sales.common.entitySubsidiaryFk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'AddressLine',
							lookupType: 'Subsidiary'
						}
					},
					{
						id: 'customerfk',
						field: 'CustomerFk',
						name: 'Customer',
						name$tr$: 'sales.common.entityCustomerFk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Code',
							lookupType: 'customer'
						},
						width: 100,
						searchable: false
					},
					{
						id: 'customerfkDescription',
						field: 'CustomerFk',
						name: 'Customer',
						name$tr$: 'qto.main.customerDescription',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							lookupType: 'customer'
						},
						width: 100,
						searchable: false
					},
					{
						id: 'projectfk', field: 'ProjectFk', name: 'Project', name$tr$: 'qto.main.projectNo',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'ProjectNo',
							lookupType: 'project'
						},
						width: 100,
						searchable: false
					},
					{
						id: 'projectfkDescription',
						field: 'ProjectFk',
						name: 'Project Description',
						name$tr$: 'qto.main.projectName',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'ProjectName',
							lookupType: 'project'
						},
						width: 100,
						searchable: false
					}
				],
				title: {name: 'Assign Sales Contract', name$tr$: 'sales.common.dialogTitleAssignContract'},
				width: 500,
				height: 300,
				buildSearchString : function (searchValue) {
					let searchFields = ['Code', 'DescriptionInfo'];
					let searchFilter = basicsCommonUtilities.buildSearchFilter(searchFields, searchValue);

					let companyId = platformContextService.getContext().clientId;
					return 'CompanyFk=' + companyId + (_.isEmpty(searchValue) ? '' : ' AND ' + searchFilter);
				}
			},
			dataProvider: {
				myUniqueIdentifier: 'controllingGeneralContractorSalesContractLookupDataHandler',

				getList: function () {
					return lookupDialogService.getListAsync();
				},

				getItemByKey: function (value) {
					return lookupDialogService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return lookupDialogService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return lookupDialogService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('controlling.generalcontractor').directive('controllingGeneralContractorSalesContractLookupDialog', ['_','$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCommonUtilities', 'platformContextService',
		function (_,$injector, BasicsLookupdataLookupDirectiveDefinition, basicsCommonUtilities, platformContextService) {
			let defaults = globals.lookups.SalesContractInfo(_,$injector, basicsCommonUtilities, platformContextService);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);

})(angular, globals);

