(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	// eslint-disable-next-line no-unused-vars
	globals.lookups.reqHeaderLookupView = function reqHeaderLookupView($injector) {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'reqheaderlookupview',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'b554e83b841c4941a3cb97f4c462f4d7',
				layoutOptions: {
					uiStandardServiceName: 'procurementRequisitionHeaderUIStandardService',
					schemas: [
						{
							typeName: 'ReqHeaderDto',
							moduleSubModule: 'Procurement.Requisition'
						}
					],
					processColumns: function (columns) {
						columns.push({
							id: 'companyName',
							field: 'CompanyName',
							name: 'Company Name',
							name$tr$: 'cloud.common.entityCompanyName',
							width: 180
						}, {
							id: 'companyCode',
							field: 'CompanyCode',
							name: 'Company Code',
							name$tr$: 'cloud.common.entityCompanyCode',
							width: 100
						});

						columns = columns.filter(function (item){
							return item.id !== 'projectfkprojectname';
						});

						return columns;
					}
				},
				title: {name: 'Assign Basis Requisition', name$tr$: 'procurement.common.reqHeaderUpdateInfo'}
			}
		};
	};

	angular.module('procurement.common').directive('procurementRequisitionLookupDialog', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.reqHeaderLookupView($injector).lookupOptions);

		}
	]);

})(angular, globals);