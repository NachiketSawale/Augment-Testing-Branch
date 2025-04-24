/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resource-requisition-lookup
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.reservation').directive('resourceReservationLookupDialogNew', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceReservationFilterLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator,
			resourceReservationLookupDataService) {
			var formSettings = {
				fid: 'resource.reservation.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'selectionfilter',
					rid: 'requisition',
					label: 'Requisition',
					label$tr$: 'resource.requisition.entityRequisition',
					model: 'requisitionFk',
					sortOrder: 1,
					type: 'directive',
					directive: 'resource-requisition-lookup-dialog-new',
					options: {
						showClearButton: true
					}
				},
				{
					gid: 'selectionfilter',
					rid: 'resource',
					label: 'Resource',
					label$tr$: 'resource.master.entityResource',
					type: 'directive',
					directive: 'resource-master-resource-lookup-dialog-new',
					options: {
						showClearButton: true
					},
					model: 'resourceFk',
					sortOrder: 2
				},
				{
					gid: 'selectionfilter',
					rid: 'reservedfrom',
					label: 'Reserved From',
					label$tr$: 'resource.reservation.entityReservedFrom',
					type: 'dateutc',
					model: 'reservedFrom',
					sortOrder: 3
				},
				{
					gid: 'selectionfilter',
					rid: 'reservedto',
					label: 'Reserved To',
					label$tr$: 'resource.reservation.entityReservedTo',
					type: 'dateutc',
					model: 'reservedTo',
					sortOrder: 4
				}]
			};
			var gridSettings = {
				columns: [
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true,
						width: 270
					},
					{
						id: 'resource',
						field: 'ResourceFk',
						name: 'Resource',
						name$tr$: 'resource.master.entityResource',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ResourceMasterResource',
							version: 3
						}
					},
					{
						id: 'requisition',
						field: 'RequisitionFk',
						name: 'Requisition',
						name$tr$: 'resource.requisition.entityRequisition',
						readonly: true,
						formatter: 'lookup',
						formatterOptions:{
							lookupType: 'resourceRequisition',
							version: 3
						}
					},
					{
						id: 'reservedFrom',
						field: 'ReservedFrom',
						name: 'Reserved From',
						name$tr$: 'resource.reservation.entityReservedFrom',
						formatter: 'dateutc',
						readonly: true
					},
					{
						id: 'reservedTo',
						field: 'ReservedTo',
						name: 'Reserved To',
						name$tr$: 'resource.reservation.entityReservedTo',
						formatter: 'dateutc',
						readonly: true
					}
				]
			};

			var lookupOptions = {
				lookupType: 'ResourceReservation',
				valueMember: 'Id',
				displayMember: 'Description',
				title: 'resource.reservation.lookupAssignReservation',
				filterOptions: {
					serverSide: true,
					serverKey: 'resource-reservation-filter',
					fn: function (item){
						return resourceReservationLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: '84f8012660394809a01167181df60b4e'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceReservationFilterLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
