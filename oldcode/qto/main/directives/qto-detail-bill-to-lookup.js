(function () {

	'use strict';

	angular.module('qto.main').directive('qtoDetailBillToLookup', ['_', '$q', 'moment', 'qtoDetailBillToLookupDataService','qtoMainDetailService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, $q, moment, dataService,qtoMainDetailService, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 2,
				lookupType: 'qtoDetailBillToLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '3B11EE3589E34A45BA8BDC92F132E0B0',
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
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'qtoDetailBillToLookupHandler',

					getList: function getList(option,scope) {
						let ordHeaderFk = scope.entity ? scope.entity.OrdHeaderFk : 0;
						return dataService.getBillToList(ordHeaderFk).then(function (data) {
							return data;
						});
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value/* , options, scope */) {
						return dataService.getItemById(value);
					},

					getSearchList: function getSearchList( searchString, displayMember, scope ) {
						let ordHeaderFk = scope.entity?scope.entity.OrdHeaderFk:0;
						return dataService.getBillToList(ordHeaderFk).then(function (data) {
							return data;
						});
					}
				}
			});
		}
	]);

})();
