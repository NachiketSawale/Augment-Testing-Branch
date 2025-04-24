(function (angular, globals) {

	'use strict';

	globals.lookups.OutlookRecipient = function ($injector) {
		let outlookRecipientDialogService = $injector.get('cloudDesktopOutlookRecipientDialogService');
		return {
			lookupOptions: {
				lookupType: 'OutlookRecipient',
				valueMember: 'Id',
				displayMember: 'FullName',
				uuid: '31bfc88abf6444ed981a8d690f84481f',
				columns: [
					{
						id: 'FullName',
						field: 'FullName',
						name: 'First Name',
						name$tr$: 'businesspartner.main.firstName',
						width: 100,
						searchable: false
					},
					{
						id: 'LastName',
						field: 'LastName',
						name: 'Last Name',
						name$tr$: 'businesspartner.main.familyName',
						width: 100
					},
					{
						id: 'Email',
						field: 'Email',
						name: 'Email',
						name$tr$: 'businesspartner.main.email',
						width: 100
					},
					{
						id: 'ContactRoleFk',
						field: 'ContactRoleFk',
						name: 'Role',
						name$tr$: 'businesspartner.main.role',
						width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.contact.role',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						searchable: false
					},
					{
						id: 'BusinessPartnerFk',
						field: 'BusinessPartnerFk',
						name: 'BusinessPartnerFk',
						name$tr$: 'cloud.common.entityBusinessPartner',
						width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						searchable: false
					},
					{
						id: 'SubsidiaryFk',
						field: 'SubsidiaryFk',
						name: 'Branch',
						name$tr$: 'sales.common.entitySubsidiaryFk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'AddressLine',
							lookupType: 'Subsidiary'
						},
						searchable: false
					},
					{
						id: 'AddressLine',
						field: 'AddressLine',
						name: 'AddressLine',
						name$tr$: 'cloud.common.address',
						width: 300,
						searchable: false
					},
					{
						id: 'CompanyFk',
						field: 'CompanyFk',
						name: 'CompanyFk',
						name$tr$: 'cloud.common.entityCompany',
						width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						searchable: false
					},
					{
						id: 'Salutation',
						field: 'Salutation',
						name: 'Salutation',
						name$tr$: 'businesspartner.contact.title',
						width: 100,
						searchable: false
					},
					{
						id: 'Department',
						name: 'Department',
						name$tr$: 'cloud.common.entityDepartment',
						field: 'Department',
						width: 150,
						searchable: false
					},
				],
				title: {name: 'Email look up from BP, Contact & Clerk', name$tr$: 'cloud.desktop.outlook.dialogTitleRecipient'},
				pageOptions: {
					enabled: false
				},
				disableTeams: false
			},
			dataProvider: {
				getListAsync: outlookRecipientDialogService.getListAsync,
				getItemByIdAsync: outlookRecipientDialogService.getItemByIdAsync,
				getSearchList: outlookRecipientDialogService.getSearchList,
				loadData: outlookRecipientDialogService.loadData,
				getItemByKey: outlookRecipientDialogService.getItemById,
				getList: outlookRecipientDialogService.getList
			}
		};
	};

	angular.module('cloud.desktop').directive('cloudDesktopOutlookRecipientDialog',
		['BasicsLookupdataLookupDirectiveDefinition', '$injector',
			function (BasicsLookupdataLookupDirectiveDefinition, $injector) {

				let defaults = globals.lookups.OutlookRecipient($injector);
				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit',
					defaults.lookupOptions, {
						dataProvider: defaults.dataProvider
					});
			}
		]);

})(angular, globals);