/**
 * Created by leo on 16.10.2017.
 */
(function (angular) {
	'use strict';
	angular.module('resource.reservation').directive('resourceReservationSearchDialog', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator',
		function (BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator) {

			var defaults = {
				lookupType: 'resourceReservation',
				valueMember: 'Id', // Dto property
				displayMember: 'Description', // Dto property
				columns: [      // slick grid columns
					{id: 'resource', field: 'ResourceFk', name: 'Resource',
						name$tr$: 'resource.reservation.entityResource',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceResourceLookupDataService',
							cacheEnable: true}).grid.formatterOptions},
					{id: 'reservationStatus', field: 'ReservationStatusFk',
						name: 'ReservationStatusFk',
						name$tr$: 'basics.customize.resreservationstatus',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resreservationstatus').grid.formatterOptions},
					{id: 'requisitionFk', field: 'RequisitionFk', name: 'RequisitionFk',
						name$tr$: 'resource.requisition.entityRequisition',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceRequisitionLookupDataService',
							cacheEnable: true}).grid.formatterOptions},
					{id: 'reservedFrom', field: 'ReservedFrom', name: 'Reserved From',
						name$tr$: 'resource.requisition.entityReservedFrom'},
					{id: 'reservedTo', field: 'ReserveTo', name: 'Reserved To',
						name$tr$: 'resource.requisition.entityReservedTo'},
					{id: 'quantitiy', field: 'Quantity', name: 'Quantity',
						name$tr$: 'cloud.common.entityQuantity'},
					{id: 'uomFk', field: 'UomFk', name: 'UomFk',
						name$tr$: 'cloud.common.entityUoM',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true}).grid.formatterOptions}
				],
				uuid: '57f527281d3d4547892cd73c3acc11b7'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: 'resourceReservationLookupDataService'
			});
		}]);
})(angular);
