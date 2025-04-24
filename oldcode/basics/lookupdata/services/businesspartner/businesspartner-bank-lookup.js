/**
 * Created by yew on 4/13/2020.
 * Due to different columns and query conditions, so not use BusinessPartnerMainBankLookupDataService
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.lookupdata';

	globals.lookups['businesspartner.main.bank'] = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'businesspartner.main.bank',
				valueMember: 'Id',
				displayMember: 'IbanNameOrBicAccountName',
				uuid: 'b4e60277c9dd4062af9ab4d474aff322',
				columns: [
					{
						id: 'BankFk',
						field: 'BankFk',
						name: 'Bank',
						name$tr$: 'cloud.commom.entityBankName',
						formatter: 'lookup',
						width: 150,
						formatterOptions: {lookupType: 'Bank', displayMember: 'BankName'}
					},
					{
						id: 'Bic',
						field: 'BankFk',
						name: 'Bic',
						name$tr$: 'cloud.commom.entityBankBic',
						formatter: 'lookup',
						width: 100,
						formatterOptions: {lookupType: 'Bank', displayMember: 'Bic'}
					},
					{
						id: 'Street',
						field: 'BankFk',
						name: 'Street',
						name$tr$: 'cloud.commom.entityStreet',
						formatter: 'lookup',
						width: 100,
						formatterOptions: {lookupType: 'Bank', displayMember: 'Street'}
					},
					{
						id: 'City',
						field: 'BankFk',
						name: 'City',
						name$tr$: 'cloud.commom.entityCity',
						formatter: 'lookup',
						width: 100,
						formatterOptions: {lookupType: 'Bank', displayMember: 'City'}
					},
					{
						id: 'Country',
						field: 'CountryFk',
						name: 'Country',
						name$tr$: 'cloud.commom.entityCountry',
						formatter: 'lookup',
						width: 100,
						formatterOptions: {lookupType: 'Country', displayMember: 'Description'}
					},
					{
						id: 'Iban', field: 'Iban', name: 'IBAN', name$tr$: 'cloud.commom.entityBankIBan', width: 200,
						formatter: function (row, col, value) {
							var regExp = /(.{4})(?!$)/g;
							if (value) {
								return value.replace(regExp, '$1  ');
							}
							return value;
						}

					},
					{
						id: 'AccountNo',
						field: 'AccountNo',
						name: 'Account No.',
						name$tr$: 'cloud.commom.entityBankAccountNo',
						width: 120,
						formatter: function (row, col, value) {
							return value;
						}
					},
					{
						id: 'BpdBankStatusFk',
						field: 'BpdBankStatusFk',
						name: 'Bank Status',
						name$tr$: 'cloud.commom.entityState',
						formatter: 'lookup',
						width: 100,
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.bpbankstatus',
							displayMember: 'Description',
							valueMember: 'Id'
						}
					},
					{
						id: 'BankType', field: 'BankTypeFk', name: 'Bank Type', name$tr$: 'cloud.commom.entityType',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'businesspartner.bank.type',
							displayMember: 'Description',
							valueMember: 'Id'
						},
						width: 100
					}
				],
				width: 500,
				height: 200
			}
		};
	};

	angular.module(moduleName).directive('businessPartnerMainBankLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups['businesspartner.main.bank']().lookupOptions);
		}
	]);
})(angular);