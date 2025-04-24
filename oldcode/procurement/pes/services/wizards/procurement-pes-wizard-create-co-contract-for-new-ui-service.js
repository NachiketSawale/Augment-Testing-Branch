/**
 * Created by chi on 4/19/2019.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	angular.module(moduleName).factory('procurementPesWizardCreateCOContractForNewUIService', procurementPesWizardCreateCOContractForNewUIService);

	procurementPesWizardCreateCOContractForNewUIService.$inject = [];

	function procurementPesWizardCreateCOContractForNewUIService() {
		var columns = [
			{
				id: 'materialCode',
				field: 'MdcMaterialFk',
				name: 'Material Code',
				width: 100,
				name$tr$: 'basics.common.entityMaterialCode',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'MaterialRecord',
					displayMember: 'Code'
				}
			},
			{
				id: 'materialDescription',
				field: 'Description1',
				width: 120,
				name: 'Material Description',
				name$tr$: 'basics.common.entityMaterialDescription',
				formatter: 'description'
			},
			{
				id: 'boqReference',
				field: 'BoqReference',
				width: 100,
				name: 'BoQ Reference No.',
				name$tr$: 'procurement.pes.boqReference',
				formatter: 'description'
			},
			{
				id: 'boqBrief',
				field: 'BoqBrief',
				width: 140,
				name: 'BoQ Outline Specification',
				name$tr$: 'procurement.pes.boqBrief',
				formatter: 'description'
			},
			{
				id: 'quantityDelivered',
				field: 'QuantityDelivered',
				name: 'Delivered Quantity',
				name$tr$: 'procurement.pes.entityQuantityDelivered',
				width: 120,
				formatter: 'quantity'
			},
			{
				id: 'quantityContracted',
				field: 'QuantityContracted',
				name: 'Contracted Quantity',
				name$tr$: 'procurement.pes.entityQuantityContracted',
				width: 120,
				formatter: 'quantity'
			},
			{
				id: 'variance',
				field: 'Variance',
				name: 'Variance',
				name$tr$: 'procurement.common.variance',
				width: 80,
				formatter: 'quantity'
			},
			{
				id: 'uom',
				field: 'UomFK',
				name: 'Uom',
				name$tr$: 'cloud.common.entityUoM',
				width: 100,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				}
			}
		];

		return {
			getStandardConfigForListView: getStandardConfigForListView
		};
		function getStandardConfigForListView() {
			return {
				fid: 'procurement.pes.create.co.contract.for.new',
				version: '1.0.0',
				columns: columns,
				addValidationAutomatically: true
			};
		}

	}

})(angular);