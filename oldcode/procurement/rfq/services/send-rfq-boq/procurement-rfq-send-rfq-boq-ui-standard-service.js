/**
 * Created by chi on 3/2/2021.
 */

(function(angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqSendRfqBoqUIStandardService', procurementRfqSendRfqBoqUIStandardService);

	procurementRfqSendRfqBoqUIStandardService.$inject = ['procurementCommonPrcBoqUIStandardService'];

	function procurementRfqSendRfqBoqUIStandardService(procurementCommonPrcBoqUIStandardService) {
		var columns = angular.copy(procurementCommonPrcBoqUIStandardService.getStandardConfigForListView().columns);
		var additionalColumns = [
			{
				id: 'requisitionDescription',
				formatter: 'description',
				editor: 'description',
				field: 'RequisitionDescription',
				name: 'Requisition',
				name$tr$: 'procurement.rfq.sendRfqBoq.requisitionDescription',
				width: 100,
				searchable: true
			},
			{
				id: 'boqItemCount',
				formatter: 'integer',
				editor: 'integer',
				field: 'ItemCount',
				name: 'BoQ Item Count',
				name$tr$: 'procurement.rfq.sendRfqBoq.itemCount',
				searchable: true
			}
		];

		// add grouping setting
		angular.forEach(additionalColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});

		columns = columns.concat(additionalColumns);

		var rows = angular.copy(procurementCommonPrcBoqUIStandardService.getStandardConfigForDetailView().rows);
		var additionalRows = [
			{
				'rid': 'requisitionDescription',
				'gid': 'basicData',
				'label$tr$': 'procurement.rfq.sendRfqBoq.requisitionDescription',
				'label': 'Requisition',
				'type': 'description',
				'model': 'RequisitionDescription'
			},
			{
				'rid': 'boqItemCount',
				'gid': 'basicData',
				'label$tr$': 'procurement.rfq.sendRfqBoq.itemCount',
				'label': 'BoQ Item Count',
				'type': 'integer',
				'model': 'ItemCount'
			}
		];

		rows = rows.concat(additionalRows);

		return {
			getStandardConfigForListView: function () {
				return {
					columns: columns,
					addValidationAutomatically: true
				};
			},
			getStandardConfigForDetailView: function () {
				return {
					'fid': 'procurement.rfq.send.rfq.boq.detail',
					'version': '1.1.0',
					showGrouping: true,
					title$tr$: '',
					'groups': [
						{
							'gid': 'basicData',
							'header$tr$': 'cloud.common.entityProperties',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': rows
				};
			}
		};
	}

})(angular);
