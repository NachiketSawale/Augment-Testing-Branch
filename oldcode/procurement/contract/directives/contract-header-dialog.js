(function (angular,globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	globals.lookups['ConHeaderView'] = function () {// jshint ignore:line
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'ConHeaderView',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '32deafa53c5d4477a94dcdd9affb93a2',
				searchInterval:1200,
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
						id: 'status', field: 'ConStatusFk', name: 'Status', name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ConStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
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
				pageOptions: {
					enabled: true
				}
			}
		};
	};

	globals.lookups['ConHeader'] = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'ConHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				columns: []
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:prcConHeaderLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Header lookup.
	 *
	 */
	angular.module('procurement.contract').directive('prcConHeaderDialog', ['globals','BasicsLookupdataLookupDirectiveDefinition','moment',
		function (globals,BasicsLookupdataLookupDirectiveDefinition,moment) {

			var providerInfo = globals.lookups['ConHeaderView']();// jshint ignore:line
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions,{
				processData: function (dataList) {
					_.forEach(dataList,function(item){
						item.DateOrdered=moment.utc(item.DateOrdered);
					});
					return dataList;
				}
			});
		}
	]);
})(angular,globals);