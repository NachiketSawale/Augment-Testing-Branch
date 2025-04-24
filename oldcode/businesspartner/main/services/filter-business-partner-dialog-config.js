(function (angular) {

	'use strict';

	const moduleName = 'businesspartner.main';


	angular.module(moduleName).factory('filterBusinessPartnerDialogFields', ['basicsLookupdataConfigGenerator','$translate','platformUserInfoService', function (basicsLookupdataConfigGenerator,$translate,platformUserInfoService) {
		return [{
			id: 'BusinessPartnerStatus',
			field: 'BpdStatusFk',
			name: 'BusinessPartnerStatus',
			name$tr$: 'cloud.common.entityState',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'BusinessPartnerStatus',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			},
			sortable: true,
			width: 100
		}, {
			id: 'BusinessPartnerStatus2',
			field: 'BpdStatus2Fk',
			name: 'BusinessPartnerStatus2',
			name$tr$: 'businesspartner.main.entityStatus2',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'BusinessPartnerStatus2',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'platformStatusIconService'
			},
			sortable: true,
			width: 100
		}, {
			id: 'desc',
			field: 'Description',
			name: 'Main Branch Description',
			name$tr$: 'businesspartner.main.mainBranchDesc',
			sortable: true,
			width: 150
		}, {
			id: 'matchCode',
			field: 'MatchCode',
			name: 'Match Code',
			name$tr$: 'businesspartner.main.matchCode',
			sortable: true,
			width: 100
		}, {
			id: 'bpName1',
			field: 'BusinessPartnerName1',
			name: 'Name',
			name$tr$: 'businesspartner.main.name1',
			sortable: true,
			width: 100
		}, {
			id: 'bpName2',
			field: 'BusinessPartnerName2',
			name: 'Name',
			name$tr$: 'businesspartner.main.name2',
			sortable: true,
			width: 100
		}, {
			id: 'bpName3',
			field: 'BusinessPartnerName3',
			name: 'Name 3',
			name$tr$: 'businesspartner.main.name3',
			sortable: true,
			width: 100
		}, {
			id: 'bpName4',
			field: 'BusinessPartnerName4',
			name: 'Name 4',
			name$tr$: 'businesspartner.main.name4',
			sortable: true,
			width: 100
		}, {
			id: 'tradeName',
			field: 'TradeName',
			name: 'Trade Name',
			name$tr$: 'businesspartner.main.tradeName',
			sortable: true,
			width: 100
		}, {
			id: 'street',
			field: 'Street',
			name: 'Street',
			name$tr$: 'cloud.common.entityStreet',
			sortable: true,
			width: 150
		}, {
			id: 'city', field: 'City', name: 'City', name$tr$: 'cloud.common.entityCity', sortable: true, width: 100
		}, {
			id: 'iso2', field: 'Iso2', name: 'Country', name$tr$: 'cloud.common.entityCountry', sortable: true, width: 100
		}, {
			id: 'county',
			field: 'County',
			name: 'Country',
			name$tr$: 'cloud.common.AddressDialogCounty',
			sortable: true,
			width: 100
		}, {
			id: 'country',
			field: 'CountryFk',
			name: 'Country Description',
			name$tr$: 'basics.common.entityCountryDescription',
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'country',
				displayMember: 'Description'
			},
			width: 100
		},{
			id: 'zipCode',
			field: 'ZipCode',
			name: 'ZipCode',
			name$tr$: 'cloud.common.entityZipCode',
			sortable: true,
			width: 100
		}, {
			id: 'telephone',
			field: 'TelephoneNumber1',
			name: 'TelephoneNumber1',
			name$tr$: 'businesspartner.main.telephoneNumber',
			sortable: true,
			width: 100
		}, {
			id: 'internet',
			field: 'Internet',
			name: 'Internet',
			name$tr$: 'businesspartner.main.internet',
			sortable: true,
			width: 150
		}, {
			id: 'email',
			field: 'Email',
			name: 'Email',
			name$tr$: 'businesspartner.main.email',
			sortable: true,
			width: 100
		}, {
			id: 'crefono',
			field: 'CrefoNo',
			name: 'CrefoNo',
			name$tr$: 'businesspartner.main.creFoNo',
			sortable: true,
			width: 100
		}, {
			id: 'bedirektno',
			field: 'BedirektNo',
			name: 'BedirektNo',
			name$tr$: 'businesspartner.main.import.bedirektNo',
			sortable: true,
			width: 100
		}, {
			id: 'dunsNo',
			field: 'DunsNo',
			name: 'DunsNo',
			name$tr$: 'businesspartner.main.import.dunsNo',
			sortable: true,
			width: 100
		}, {
			id: 'vatno',
			field: 'VatNo',
			name: 'VatNo',
			name$tr$: 'businesspartner.main.import.vatNo',
			sortable: true,
			width: 100
		}, {
			id: 'taxno',
			field: 'TaxNo',
			name: 'TaxNo',
			name$tr$: 'businesspartner.main.taxNo',
			sortable: true,
			width: 100
		}, {
			id: 'traderegister',
			field: 'TradeRegister',
			name: 'TradeRegister',
			name$tr$: 'businesspartner.main.import.tradeRegister',
			sortable: true,
			width: 100
		}, {
			id: 'traderegisterno',
			field: 'TradeRegisterNo',
			name: 'TradeRegisterNo',
			name$tr$: 'businesspartner.main.tradeRegisterNo',
			sortable: true,
			width: 100
		}, {
			id: 'avaid',
			field: 'Avaid',
			name: 'Avaid',
			name$tr$: 'businesspartner.main.import.avaid',
			sortable: true,
			width: 100
		}, {
			id: 'craftcooperative',
			field: 'CraftCooperative',
			name: 'CraftCooperative',
			name$tr$: 'businesspartner.main.import.craftCooperative',
			sortable: true,
			width: 100
		}, {
			id: 'craftcooperativetype',
			field: 'CraftCooperativeType',
			name: 'CraftCooperativeType',
			name$tr$: 'businesspartner.main.import.craftCooperativeType',
			sortable: true,
			width: 100
		}, {
			id: 'customerabcfk',
			field: 'CustomerAbcFk',
			name: 'Customer ABC',
			name$tr$: 'basics.customize.customerabc',
			readonly: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'businesspartner.customerabc',
				att2BDisplayed: null,
				readOnly: true,
				options: {showIcon: true}
			}).formatterOptions
		}, {
			id: 'customersectorfk',
			field: 'CustomerSectorFk',
			name: 'Customer Sector',
			name$tr$: 'businesspartner.main.customerSector',
			sortable: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'businesspartner.customersector',
				att2BDisplayed: null,
				readOnly: true,
				options: {}
			}).formatterOptions,
			width: 100
		}, {
			id: 'customerstatusfk',
			field: 'CustomerStatusFk',
			name: 'Customer Status',
			name$tr$: 'basics.customize.customerstate',
			sortable: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'businesspartner.customerstatus',
				att2BDisplayed: null,
				readOnly: true,
				options: {}
			}).formatterOptions,
			width: 100
		}, {
			id: 'customergroupfk',
			field: 'CustomerGroupFk',
			name: 'Customer Group',
			name$tr$: 'businesspartner.main.customerGroup',
			sortable: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'businesspartner.customergroup',
				att2BDisplayed: null,
				readOnly: true,
				options: {}
			}).formatterOptions,
			width: 100
		}, {
			id: 'legalformfk',
			field: 'LegalFormFk',
			name: 'Legal Form',
			name$tr$: 'businesspartner.main.import.legalForm',
			sortable: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'businesspartner.legal.form',
				att2BDisplayed: null,
				readOnly: true,
				options: {}
			}).formatterOptions,
			width: 100
		}, {
			id: 'creditstandingfk',
			field: 'CreditstandingFk',
			name: 'Credit Standing',
			name$tr$: 'businesspartner.main.import.creditStanding',
			sortable: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'basics.customize.creditstanding',
				att2BDisplayed: null,
				readOnly: true,
				options: {}
			}).formatterOptions,
			width: 100
		}, {
			id: 'remarkmarketing',
			field: 'RemarkMarketing',
			name: 'RemarkMarketing',
			name$tr$: 'businesspartner.main.import.remarkMarketing',
			sortable: true,
			width: 100
		}, {
			id: 'remark1',
			field: 'Remark1',
			name: 'Remark1',
			name$tr$: 'businesspartner.main.import.remark1',
			sortable: true,
			width: 100
		}, {
			id: 'remark2',
			field: 'Remark2',
			name: 'Remark2',
			name$tr$: 'businesspartner.main.import.remark2',
			sortable: true,
			width: 100
		}, {
			id: 'userdefined1',
			field: 'Userdefined1',
			name: $translate.instant('cloud.common.entityUserDefined')+ ' 1',
			sortable: true,
			width: 100
		}, {
			id: 'userdefined2',
			field: 'Userdefined2',
			name: $translate.instant('cloud.common.entityUserDefined')+ ' 2',
			sortable: true,
			width: 100
		}, {
			id: 'userdefined3',
			field: 'Userdefined3',
			name: $translate.instant('cloud.common.entityUserDefined')+ ' 3',
			sortable: true,
			width: 100
		}, {
			id: 'userdefined4',
			field: 'Userdefined4',
			name: $translate.instant('cloud.common.entityUserDefined')+ ' 4',
			sortable: true,
			width: 100
		}, {
			id: 'userdefined5',
			field: 'Userdefined5',
			name: $translate.instant('cloud.common.entityUserDefined')+ ' 5',
			sortable: true,
			width: 100
		}, {
			id: 'referenceValue1',
			field: 'RefValue1',
			name: 'RefValue1',
			name$tr$: 'businesspartner.main.referenceValue1',
			sortable: true,
			width: 100
		}, {
			id: 'referenceValue2',
			field: 'RefValue2',
			name: 'RefValue2',
			name$tr$: 'businesspartner.main.referenceValue2',
			sortable: true,
			width: 100
		},
		{id: 'code', field: 'Code', name: 'Code', name$tr$: 'businesspartner.main.code', sortable: true, width: 100},
		{
			id: 'language',
			field: 'LanguageFk',
			name: 'Langauge',
			name$tr$: 'basics.customize.language',
			sortable: true,
			formatter: 'lookup',
			formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
				lookupName: 'basics.customize.language',
				att2BDisplayed: null,
				readOnly: true,
				options: {}
			}).formatterOptions,
			width: 80
		},
		{
			id: 'isnationwide',
			field: 'IsNationWide',
			name: 'Is Nationwide',
			name$tr$: 'businesspartner.main.isNationwide',
			sortable: true,
			width: 100,
			formatter: function (row, cell, value) {
				let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
				return '<div class="text-center" >' + template + '</div>';
			}
		},
		{
			id: 'avgEvaluationA',
			field: 'AvgEvaluationA',
			name: 'Avg Evaluation Group A',
			name$tr$: 'businesspartner.main.avgEvaluationA',
			sortable: true,
			formatter: function (row, cell, value) {
				return Math.round(value);
			},
			width: 100,
		},
		{
			id: 'avgEvaluationB',
			field: 'AvgEvaluationB',
			name: 'Avg Evaluation Group B',
			name$tr$: 'businesspartner.main.avgEvaluationB',
			sortable: true,
			formatter: function (row, cell, value) {
				return Math.round(value);
			},
			width: 100,
		},
		{
			id: 'avgEvaluationC',
			field: 'AvgEvaluationC',
			name: 'Avg Evaluation Group C',
			name$tr$: 'businesspartner.main.avgEvaluationC',
			sortable: true,
			formatter: function (row, cell, value) {
				return Math.round(value);
			},
			width: 100,
		},
			{
				id: 'hasframework',
				field: 'IsFrameWork',
				name: 'Has Framework Agreement',
				name$tr$: 'businesspartner.main.isframework',
				sortable: true,
				width: 100,
				formatter: function (row, cell, value) {
					let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					return '<div class="text-center" >' + template + '</div>';
				}
			},
			{
				id: 'hasMaterialCatalog',
				field: 'HasFrameworkAgreement',
				name: 'Has Material Catalog',
				name$tr$: 'businesspartner.main.HasFrameworkAgreement',
				sortable: true,
				width: 100,
				formatter: function (row, cell, value) {
					let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					return '<div class="text-center" >' + template + '</div>';
				}
			},
			{
				id: 'rubricCategory',
				field: 'RubricCategoryFk',
				name: 'Rubric Category',
				name$tr$: 'cloud.common.entityBasRubricCategoryFk',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
					lookupName: 'basics.customize.rubriccategory',
					att2BDisplayed: null,
					readOnly: true,
					options: {}
				}).formatterOptions,
				width: 80
			},
			{
				id: 'communicationChannelFk',
				field: 'BasCommunicationChannelFk',
				name: 'Communication Channel',
				name$tr$: 'basics.customize.communicationchannel',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
					lookupName: 'basics.customize.communicationchannel',
					att2BDisplayed: null,
					readOnly: true,
					options: {}
				}).formatterOptions,
				width: 80
			},
			{
				id: 'companyfk',
				field: 'CompanyFk',
				name: 'Company',
				name$tr$: 'cloud.common.entityCompany',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'company',
					displayMember: 'Code'
				},
				width: 80
			},
			{
				id: 'companyName',
				field: 'CompanyFk',
				name: 'Company Name',
				name$tr$: 'cloud.common.entityCompanyName',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'company',
					displayMember: 'CompanyName'
				},
				width: 80
			},
			{
				id: 'Responsible',
				field: 'ClerkFk',
				name: 'Responsible',
				name$tr$: 'cloud.common.entityResponsible',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'clerk',
					displayMember: 'Code'
				},
				width: 80
			},
			{
				id: 'ResponsibleName',
				field: 'ClerkFk',
				name: 'Responsible Name',
				name$tr$: 'cloud.common.entityResponsibleName',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'clerk',
					displayMember: 'Description'
				},
				width: 80
			},
			{
				id: 'salutation',
				field: 'Salutation',
				name: 'Salutation',
				name$tr$: 'basics.customize.salutation',
				sortable: true,
				width: 80
			},
			{
				id: 'countEvaluationA',
				field: 'CountEvaluationA',
				name: 'No. of Eval. A',
				name$tr$: 'businesspartner.main.countEvaluationA',
				sortable: true,
				formatter: function (row, cell, value) {
					return Math.round(value);
				},
				width: 80
			},
			{
				id: 'countEvaluationB',
				field: 'CountEvaluationB',
				name: 'No. of Eval. B',
				name$tr$: 'businesspartner.main.countEvaluationB',
				sortable: true,
				formatter: function (row, cell, value) {
					return Math.round(value);
				},
				width: 80
			},
			{
				id: 'countEvaluationC',
				field: 'CountEvaluationC',
				name: 'No. of Eval. C',
				name$tr$: 'businesspartner.main.countEvaluationC',
				sortable: true,
				formatter: function (row, cell, value) {
					return Math.round(value);
				},
				width: 80
			},
			{
				id: 'customerBranchCode',
				field: 'CustomerBranchFk',
				name$tr$: 'businesspartner.main.customerBranchCode',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'customerBranch',
					displayMember: 'Code'
				}
			},
			{
				id: 'customerBranchDesc',
				field: 'CustomerBranchFk',
				name$tr$: 'businesspartner.main.customerBranch',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'customerBranch',
					displayMember: 'Description'
				}
			},
			{
				id: 'craftCooperativeDate',
				field: 'CraftcooperativeDate',
				name: 'Craft Cooperative Date',
				name$tr$: 'businesspartner.main.craftCooperativeDate',
				sortable: true,
				formatter: 'date',
				width: 80
			},
			{
				id: 'mobile',
				field: 'Mobile',
				name: 'Mobile',
				name$tr$: 'businesspartner.main.mobileNumber',
				sortable: true,
				width: 80
			},
			{
				id: 'telephone2',
				field: 'Telephonenumber2',
				name: 'Other Telephone',
				name$tr$: 'businesspartner.main.telephoneNumber2',
				sortable: true,
				width: 80
			},
			{
				id: 'faxNumber',
				field: 'FaxNumber',
				name: 'Telefax',
				name$tr$: 'businesspartner.main.telephoneFax',
				sortable: true,
				width: 80
			},
			{
				id: 'title',
				field: 'TitleFk',
				name$tr$: 'businesspartner.main.title',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'title',
					displayMember: 'DescriptionInfo.Translated'
				},
				width: 80
			},
			{
				id: 'prcIncotermCode',
				field: 'PrcIncotermFk',
				name$tr$: 'cloud.common.entityIncoterms',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'prcincoterm',
					displayMember: 'Code'
				},
				width: 80
			},
			{
				id: 'prcIncotermDesc',
				field: 'PrcIncotermFk',
				name$tr$: 'cloud.common.entityIncotermCodeDescription',
				sortable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'prcincoterm',
					displayMember: 'DescriptionInfo.Translated'
				},
				width: 80
			},
			{
				id: 'address',
				field: 'AddressLine',
				name: 'Address',
				name$tr$: 'cloud.common.entityAddress',
				sortable: true,
				width: 80
			},
			{
				id: 'active',
				field: 'IsLive',
				name: 'Active',
				name$tr$: 'businesspartner.main.bpIsLive',
				sortable: true,
				width: 100,
				formatter: function (row, cell, value) {
					let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					return '<div class="text-center" >' + template + '</div>';
				}
			},
			{
				id: 'taxOfficeCode',
				field: 'TaxOfficeCode',
				name: 'Tax Office No.',
				name$tr$: 'businesspartner.main.taxOfficeCode',
				sortable: true,
				width: 80
			},
			{
				id: 'countryIso2Vat',
				field: 'CountryVatFk',
				name: 'Vat Country',
				name$tr$: 'businesspartner.main.vatCountryFk',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'country',
					displayMember: 'Iso2'
				},
				width: 100
			},
			{
				id: 'countryDescVat',
				field: 'CountryVatFk',
				name: 'Vat Country-Description',
				name$tr$: 'businesspartner.main.vatCountryDesc',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'country',
					displayMember: 'Description'
				},
				width: 100
			},
			{
				id: 'vatNoEu',
				field: 'VatNoEu',
				name: 'Vat No.EU',
				name$tr$: 'businesspartner.main.vatNoEu',
				sortable: true,
				width: 80
			},
			{
				id: 'insertedAt',
				field: 'Inserted',
				name: 'Inserted At',
				name$tr$: 'cloud.common.entityInsertedAt',
				editor: null,
				readonly: true,
				width: 80,
				domain: 'history',
				formatter: 'datetime'

			},
			{
				id: 'updatedAt',
				field: 'Updated',
				name: 'Updated At',
				name$tr$: 'cloud.common.entityUpdatedAt',
				domain: 'history',
				formatter: 'datetime',
				width: 80
			},
			{
				id: 'insertedBy',
				field: 'CreateUserName',
				name: 'Inserted By',
				name$tr$: 'cloud.common.entityInsertedBy',
				width: 80
			},
			{
				id: 'updatedBy',
				field: 'UpdateUserName',
				name: 'Updated By',
				name$tr$: 'cloud.common.entityUpdatedBy',
				width: 80
			},
			{
				id: 'tradeRegisterDate',
				field: 'TradeRegisterDate',
				name: 'Trade Register Date',
				name$tr$: 'businesspartner.main.tradeRegisterDate',
				sortable: true,
				width: 80,
				formatter: 'date'
			},
			{
				id: 'activeFrameworkContract',
				field: 'ActiveFrameworkContract',
				name: 'Active Framework Contract',
				name$tr$: 'businesspartner.main.activeframeworkcontract',
				sortable: true,
				width: 100,
				formatter: function (row, cell, value) {
					let template = '<input disabled="true" type="checkbox"' + (value ? ' checked="checked"' : '') + '>';
					return '<div class="text-center" >' + template + '</div>';
				}
			},
		];
	}]);


})(angular);
