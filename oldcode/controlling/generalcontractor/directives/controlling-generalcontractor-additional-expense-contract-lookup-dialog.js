(function (angular,globals) {
	/* global globals */
	'use strict';

	globals.lookups.AdditionalExpenseContractInfo = function AdditionalExpenseContractInQto(_,$injector, basicsCommonUtilities, platformContextService) {
		let lookupDialogService = $injector.get('additionalExpenseContractLookupDialogService');
		return {
			lookupOptions:{
				lookupType: 'AdditionalExpenseContractInfo',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'b6df174e022a4e52bed65c30ace7a60a',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						name$tr$: 'cloud.common.entityReferenceCode'
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'status',
						field: 'ConStatusFk',
						name$tr$: 'cloud.common.entityState',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							lookupModuleQualifier: 'basics.customize.constatus',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100,
						searchable: false
					},
					{
						id: 'dateOrdered',
						field: 'DateOrdered',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDate',
						formatter: 'dateutc'
					},
					{
						id: 'prcConfigurationFk',
						field: 'PrcConfigurationFk',
						name: 'PrcConfigurationFk',
						width: 150,
						name$tr$: 'procurement.common.prcConfigurationDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcConfiguration',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					{
						id: 'BPName1',
						field: 'BpName1',
						name: 'BPName1',
						width: 150,
						name$tr$: 'cloud.common.entityBusinessPartnerName1',
					},
					{
						id: 'BPName2',
						field: 'BpName2',
						name: 'BPName2',
						width: 150,
						name$tr$: 'cloud.common.entityBusinessPartnerName2',
					},
					{
						id: 'supplierCode',
						field: 'SupplierCode',
						name: 'supplierCode',
						width: 150,
						name$tr$: 'cloud.common.entitySupplierCode',
					},
					{
						id: 'supplier2Code',
						field: 'Supplier2Code',
						name: 'Supplier2Code',
						width: 150,
						name$tr$: 'cloud.common.entitySupplier2Code'
					},
					{
						id: 'BP2Name1', field: 'Bp2Name1', name: 'BP2Name1', width: 150, name$tr$: 'cloud.common.entityBusinessPartner2Name1'
					},
					{
						id: 'BP2Name2', field: 'Bp2Name2', name: 'BP2Name2', width: 150, name$tr$: 'cloud.common.entityBusinessPartner2Name2'
					},
					{
						id: 'projectNo',
						field: 'ProjectNo',
						name: 'projectNo',
						width: 100,
						name$tr$: 'cloud.common.entityProjectNo',
					},
					{
						id: 'projectName',
						field: 'ProjectName',
						name: 'projectName',
						width: 150,
						name$tr$: 'cloud.common.entityProjectName',
					}
				],
				title: {name: 'Assign Basis Contract', name$tr$: 'procurement.common.assignContract'},
				width: 500,
				height: 300,
				buildSearchString : function (searchValue) {
					let searchFields = ['Code', 'Description'];
					let searchFilter = basicsCommonUtilities.buildSearchFilter(searchFields, searchValue);

					let companyId = platformContextService.getContext().clientId;
					return 'CompanyFk=' + companyId + (_.isEmpty(searchValue) ? '' : ' AND ' + searchFilter);
				}
			},
			dataProvider: {
				myUniqueIdentifier: 'AdditionalExpenseContractLookupDataHandler',

				getList: function () {
					return lookupDialogService.getListAsync();
				},

				getSearchList: function (searchRequest) {
					return lookupDialogService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('controlling.generalcontractor').directive('controllingGeneralContractorAdditionalExpenseContractLookupDialog', ['_','$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCommonUtilities', 'platformContextService','moment',
		function (_,$injector, BasicsLookupdataLookupDirectiveDefinition, basicsCommonUtilities, platformContextService,moment) {
			let defaults = globals.lookups.AdditionalExpenseContractInfo(_,$injector, basicsCommonUtilities, platformContextService);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider,
				processData: function (dataList) {
					_.forEach(dataList,function(item){
						item.DateOrdered=moment.utc(item.DateOrdered);
					});
					return dataList;
				}
			});
		}]);
})(angular,globals);