(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).controller('productionplanningEngineeringPlanningBoardController', planningBoardController);

	planningBoardController.$inject = ['$scope',
		'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'productionplanningEngineeringResourceService',
		'productionplanningEngineeringRequisitionService',
		'productionplanningEngineeringReservationService',
		'productionplanningEngineeringPlanningBoardRequisitionClipboardService',
		'resourceMasterPlanningBoardSupplierMappingService',
		'resourceReservationPlanningBoardAssignmentMappingService',
		'resourceRequisitionPlanningBoardDemandMappingService'];

	function planningBoardController($scope, platformPlanningBoardDataService, calendarUtilitiesService,
									 resourceService,
									 requisitionService,
									 reservationService,
									 planningBoardRequisitionClipboardService,
									 resourceMasterPlanningBoardSupplierMappingService,
									 resourceReservationPlanningBoardAssignmentMappingService,
									 resourceRequisitionPlanningBoardDemandMappingService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration(
			{
				uuid: '51440d12f85e490ba2b8b6e9b8969e7f',
				timeScale: calendarUtilitiesService,
				supplier: {
					uuid: 'e86c43921f1b454eaad9b353fbb0678d',
					dataService: resourceService,
					mappingService: resourceMasterPlanningBoardSupplierMappingService,
					validationService: {},
					uiStandardService: {
						getStandardConfigForListView: function getStandardConfigForListView() {
							return {
								addValidationAutomatically: true,
								columns: [{
									id: 'code',
									formatter: 'code',
									grouping: {
										aggregateCollapsed: true,
										aggregators: [],
										getter: 'Code',
										title: 'Code'
									},
									field: 'Code',
									name: 'Code',
									name$tr$: 'cloud.common.entityCode',
									tooltip: 'Code',
									tooltip$tr$: 'cloud.common.entityCode',
									sortable: true,
									searchable: true
								}, {
									id: 'description',
									formatter: 'translation',
									field: 'DescriptionInfo',
									grouping: {
										aggregateCollapsed: true,
										aggregators: [],
										getter: 'Description',
										title: 'Description'
									},
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									tooltip: 'Description',
									tooltip$tr$: 'cloud.common.entityDescription',
									sortable: true,
									searchable: true
								}]
							};
						}
					}
				},
				assignment: {
					dataService: reservationService,
					mappingService: resourceReservationPlanningBoardAssignmentMappingService
				},
				demand:{
					uuid: 'e68bb97a4d134aadaf4a53ea0c198bc8',
					dataService: requisitionService,
					validationService: {},
					uiStandardService: {
						getStandardConfigForListView: function getStandardConfigForListView() {
							return {
								addValidationAutomatically: true,
								columns: [{
									id: 'description',
									formatter: 'description',
									field: 'Description',
									grouping: {
										aggregateCollapsed: true,
										aggregators: [],
										getter: 'Description',
										title: 'Description'
									},
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									tooltip: 'Description',
									tooltip$tr$: 'cloud.common.entityDescription',
									sortable: true,
									searchable: true
								}, {
									id: 'requestedfrom',
									formatter: 'dateutc',
									field: 'RequestedFrom',
									grouping: {
										aggregateCollapsed: true,
										aggregators: [],
										getter: 'RequestedFrom',
										title: 'From'
									},
									name: 'From',
									name$tr$: 'resource.requisition.entityRequestedFrom',
									tooltip: 'From',
									tooltip$tr$: 'resource.requisition.entityRequestedFrom',
									sortable: true,
									searchable: true
								}, {
									id: 'requestedto',
									formatter: 'dateutc',
									field: 'RequestedTo',
									grouping: {
										aggregateCollapsed: true,
										aggregators: [],
										getter: 'RequestedTo',
										title: 'To'
									},
									name: 'To',
									name$tr$: 'resource.requisition.entityRequestedTo',
									tooltip: 'To',
									tooltip$tr$: 'resource.requisition.entityRequestedTo',
									sortable: true,
									searchable: true
								}]
							};
						}
					},
					dragDropService: planningBoardRequisitionClipboardService,
					dragDropType: 'resourceRequisition',
					mappingService: resourceRequisitionPlanningBoardDemandMappingService
				}
			}, $scope);

	}
})();
