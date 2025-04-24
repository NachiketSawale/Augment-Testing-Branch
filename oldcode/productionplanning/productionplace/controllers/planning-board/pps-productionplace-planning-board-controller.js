(function () {
	'use strict';

	var moduleName = 'productionplanning.productionplace';

	angular.module(moduleName).controller('ppsProductionPlacePlanningBoardController', PlanningBoardController);

	PlanningBoardController.$inject = ['$scope', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'ppsProductionPlaceDataService', 'ppsProductionPlacePlanningBoardSupplierMappingService', 'platformPlanningBoardGridUiConfigService',
		'ppsProductionPlacePlanningBoardAssignmentService', 'ppsProductionPlacePlanningBoardAssignmentMappingService',
		'ppsProductionPlacePlanningBoardDemandService', 'ppsProductionPlacePlanningBoardDemandMappingService', 'platformDateshiftHelperService',
		'ppsVirtualDataServiceFactory',
		'ppsProductionPlacePlanningBoardClipboardService', '$translate',
		'productionplanningProductMainService', 'productionplanningPhaseDataServiceFactory', 'ppsProcessConfigurationPhaseUIPlanningBoardService','ppsProductionPlacePlanningBoardGotoBtnsExtension','basicsCommonToolbarExtensionService'];

	function PlanningBoardController($scope, planningBoardDataService, calendarUtilitiesService,
		supplierService, supplierMappingService, planningBoardGridUiConfigService,
		assignmentService, assignmentMappingService,
		demandService, demandMappingService,
		platformDateshiftHelperService, ppsVirtualDataServiceFactory, ppsProductionPlacePlanningBoardClipboardService, $translate,
		productMainService,
		phaseDataServiceFactory,
		ppsProcessConfigurationPhaseUIPlanningBoardService,
		gotoBtnsExtension,
		basicsCommonToolbarExtensionService) {

		planningBoardDataService.setPlanningBoardConfiguration({
			uuid: '3dee881400914baa92d596e210c7e4bd',
			timeScale: calendarUtilitiesService,
			registerOnMainDataServiceReload: true, // for triggering reloading (by Justyna on 17.03.2023 for ticket HP-ALM 140194-[MP] Deletion of Phases)
			supplier: {
				uuid: 'b1810df3bf3a4ef88991ecf863f6db08',
				dataService: supplierService,
				mappingService: supplierMappingService,
				uiStandardService: planningBoardGridUiConfigService.getSupplierGridConfigService('ppsProductionPlaceUIService')
			},
			assignment: {
				dataService: assignmentService,
				mappingService: assignmentMappingService,
				uiStandardService: ppsProcessConfigurationPhaseUIPlanningBoardService,
				dataServiceForDetail: phaseDataServiceFactory.getService(moduleName, productMainService)
			},
			demand: {
				uuid: '6d8e4e43773441338fa40a32a46c7cdf',
				dataService: demandService,
				mappingService: demandMappingService,
				uiStandardService: planningBoardGridUiConfigService.getDemandGridConfigService('productionplanningItemUIStandardService'),
				dragDropService: ppsProductionPlacePlanningBoardClipboardService,
				dragDropType: 'productionPhase',
				demandDependOnExternal: true, // for avoiding requesting planning board data twice(by zwz for ticket DEV-20753)
				// remark: here add option demandDependOnExternal for avoiding registerSupplierListLoaded,
				// for current planning board data service, corresponding supplier data service and main data service are the same data service(ppsProductionPlaceDataService),
				// since we have configured registerOnMainDataServiceReload, now we needn't registerSupplierListLoaded.
			},
			/*
			// DEV-32482 - this functinality was apparently causing unwanted behavior. Until the logic for this feature is
			// corrected, will be deactivated!
			toolbarConfig: {
				customTools: [
					{
						id: 'deactivateDateshiftForPhases',
						sort: 1,
						iconClass: 'tlb-icons ico-timesheet-autocreate',
						type: 'check',
						value: false, // must be dynamic
						caption: $translate.instant('productionplanning.productionplace.deactivateDateshiftForPhases'),
						fn: (toolName, data) => {
							ppsVirtualDataServiceFactory.getVirtualDataService(moduleName).isDateshiftDeactivated = assignmentService.isDateshiftDeactivated = data.value;
						}
					}
				]
			}, */
			dateShift: {
				dateShiftHelperService: platformDateshiftHelperService,
				dataService: ppsVirtualDataServiceFactory.getVirtualDataService(moduleName),
				entityName: 'PpsPhase',
				dateshiftId: 'productionplanning.phase',
				dateShiftToolConfig: { tools: [{ id: 'fullshift', value: false, hidden: true }], configId: 'productionplanning.phase' }
			},
		}, $scope);


		if(!$scope.gridId && $scope.getContainerUUID){
			$scope.gridId = $scope.getContainerUUID();
		}
		basicsCommonToolbarExtensionService.insertBefore($scope, gotoBtnsExtension.createGotoBtns(assignmentService, demandService));

		// #133472 increase OpenQuantity demand counter on delete.
		// Would prefer to implement in assginment mapping service but there is no functionality to cover this
		const onAssignmentChanged = (arg, fn) => {
			let assignments = Array.isArray(arg) ? arg : [arg];
			assignments.forEach(fn);
		};
		const onAssignmentDeleted = (e, arg) => { onAssignmentChanged(arg, demandService.decreaseDemandQuantity); };
		assignmentService.registerEntityDeleted(onAssignmentDeleted);
		$scope.$on('$destroy', function () {
			assignmentService.unregisterEntityDeleted(onAssignmentDeleted);
		});
	}
})();