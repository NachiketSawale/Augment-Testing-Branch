/**
 * Created by ltn on 1/16/2017.
 */
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.conHeader2Material = function conHeader2Material() {
		return {
			lookupOptions: {
				// please don't add a version there temporarily
				version:3,
				lookupType: 'ConHeader2material',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '7C63986A5F474AAEB9A93FEBE4249622',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityReferenceCode' },
					{ id: 'desc', field: 'Description', name: 'Description', width: 100, name$tr$: 'cloud.common.entityDescription' },
					{
						id: 'status', field: 'ConStatusFk', name: 'Status', name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ConStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						width: 100,
						searchable:false
					},
					{
						id: 'dateOrdered', field: 'DateOrdered', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDate',
						formatter: 'dateutc'
					},
					{
						id: 'BPName1', field: 'BpName1', name: 'BPName1', width: 150, name$tr$: 'cloud.common.entityBusinessPartnerName1'
					},
					{
						id: 'BPName2', field: 'BpName2', name: 'BPName2', width: 150, name$tr$: 'cloud.common.entityBusinessPartnerName2'
					},
					{
						id: 'supplierCode', field: 'SupplierCode', name: 'supplierCode', width: 150, name$tr$: 'cloud.common.entitySupplierCode'
					},
					{
						id: 'projectNo', field: 'ProjectNo', name: 'projectNo', width: 100, name$tr$: 'cloud.common.entityProjectNo'
					},
					{
						id: 'projectName', field: 'ProjectName', name: 'projectName', width: 150, name$tr$: 'cloud.common.entityProjectName'
					}
				],
				title: { name: 'Assign Contract', name$tr$: 'cloud.common.dialogTitleContract' },
				width: 500,
				height: 200
			}
		};
	};

	/**
     * @ngdoc directive
     * @name procurement.requisition.directive:prcConHeader2materialLookup
     * @element div
     * @restrict A
     * @description
     * Header lookup.
     *
     */
	angular.module('procurement.contract').directive('procurementContractToMaterialLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.conHeader2Material().lookupOptions);
		}
	]);
})(angular, globals);
























