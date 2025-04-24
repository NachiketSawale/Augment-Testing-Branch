(function (angular,globals) {
	/* global globals */
	'use strict';

	globals.lookups.AdditionalExpensePackageInfo = function AdditionalExpensePackage(_,$injector, basicsCommonUtilities, platformContextService) {
		let lookupDialogService = $injector.get('additionalExpensePackageLookupDialogService');
		return {
			lookupOptions:{
				lookupType: 'AdditionalExpensePackageInfo',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '2dd5570075e344a2af63c7994fb3ad17',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'packageStatusDescription',
						field: 'PackageStatusFk',
						name$tr$: 'cloud.common.entityState',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							lookupModuleQualifier: 'basics.customize.packagestatus',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						searchable: false
					},
					{
						id: 'packageConfigurationDescription',
						field: 'ConfigurationFk',
						name$tr$: 'procurement.common.prcConfigurationDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcconfiguration',
							displayMember: 'DescriptionInfo.Translated'
						},
						searchable: false
					}
				],
				title: {name:'procurement.common.packageLookupDialogTitle'},
				width: 500,
				height: 300,
				buildSearchString: function (searchValue) {
					let searchFields = ['Code', 'Description'];
					let searchFilter = basicsCommonUtilities.buildSearchFilter(searchFields, searchValue);
					let companyId = platformContextService.getContext().clientId;
					return 'CompanyFk=' + companyId + (_.isEmpty(searchValue) ? '' : ' AND ' + searchFilter);
				}
			},
			dataProvider: {
				myUniqueIdentifier: 'AdditionalExpensePackageLookupDataHandler',

				getList: function () {
					return lookupDialogService.getListAsync();
				},

				getSearchList: function (searchRequest) {
					return lookupDialogService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('controlling.generalcontractor').directive('controllingGeneralContractorAdditionalExpensePackageLookupDialog', ['_','$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCommonUtilities', 'platformContextService',
		function (_,$injector, BasicsLookupdataLookupDirectiveDefinition, basicsCommonUtilities, platformContextService) {
			let defaults = globals.lookups.AdditionalExpensePackageInfo(_,$injector, basicsCommonUtilities, platformContextService);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);
})(angular,globals);