(function () {
	'use strict';

	var moduleName = 'resource.reservation';

	angular.module(moduleName).controller('resourceReservationPlanningBoardController', ResourceReservationPlanningBoardController);

	ResourceReservationPlanningBoardController.$inject = ['$injector', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'resourceReservationPlanningBoardResourceService', 'resourceReservationPlanningBoardRequisitionService', 'resourceReservationPlanningBoardReservationService',
		'resourceReservationPlanningBoardClipboardService', 'platformPlanningBoardGridUiConfigService', 'resourceRequisitionPlanningBoardDemandMappingService',
		'resourceReservationPlanningBoardAssignmentMappingService', '$scope','moment','_', 'resourceMasterPlanningBoardSupplierMappingService','resourceMasterPlanningBoardCustomConfigFactory', 'resourceCommonNavigationService'];

	function ResourceReservationPlanningBoardController($injector, platformPlanningBoardDataService, calendarUtilitiesService,
		resourceReservationPlanningBoardResourceService, resourceReservationPlanningBoardRequisitionService,
		resourceReservationPlanningBoardReservationService, resourceReservationPlanningBoardClipboardService,
		platformPlanningBoardGridUiConfigService, resourceRequisitionPlanningBoardDemandMappingService,
		resourceReservationPlanningBoardAssignmentMappingService, $scope, moment,_ , resourceMasterPlanningBoardSupplierMappingService, resourceMasterPlanningBoardCustomConfigFactory, resourceCommonNavigationService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: 'b1436d024b4b4ca592e58c8ea34384a7',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '1046a3bd867147feb794bdb60a805eca',
				dataService: resourceReservationPlanningBoardResourceService,
				validationService: {},
				mappingService: resourceMasterPlanningBoardSupplierMappingService,
				customSupplierConfig: resourceMasterPlanningBoardCustomConfigFactory.getConfig({uuid: 'b1436d024b4b4ca592e58c8ea34384a7'}).validOnDueDateConfig(),
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService')
			},
			assignment: {
				uuid: 'a2bc5bf53da049de906ebd77c92682c7',
				dataService: resourceReservationPlanningBoardReservationService,
				mappingService: resourceReservationPlanningBoardAssignmentMappingService
			},
			demand: {
				uuid: 'ea6bd9f8d84f4b5f8bf53917e8525888',
				dataService: resourceReservationPlanningBoardRequisitionService,
				mappingService: resourceRequisitionPlanningBoardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('resourceRequisitionUIStandardService'),
				dragDropService: resourceReservationPlanningBoardClipboardService,
				dragDropType: 'resourceRequisition'
			},
			toolbarConfig: {
				customTools: function () {
					const isFullyCoveredTools = resourceReservationPlanningBoardAssignmentMappingService.getCustomTools(resourceReservationPlanningBoardReservationService);
					const gotoDropdown = resourceCommonNavigationService.createNavigationItem();

					return new Promise((resolve, reject) => {
						const result = [
							...isFullyCoveredTools,
							gotoDropdown,
						];
						resolve(result);
					});
				}
			}

		}, $scope);

		function getUpdateNavigationButtonFunc(planningBoardSource) {
			return function () {
				resourceCommonNavigationService.updateNavigationItem(
					planningBoardSource,
					resourceReservationPlanningBoardResourceService,
					resourceReservationPlanningBoardReservationService,
					resourceReservationPlanningBoardRequisitionService
				);
			};
		}

		const supplierSelectionChangedFunc = getUpdateNavigationButtonFunc('supplier');
		const assignmentSelectionChangedFunc = getUpdateNavigationButtonFunc('assignment');
		const demandSelectionChangedFunc = getUpdateNavigationButtonFunc('demand');

		let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID('b1436d024b4b4ca592e58c8ea34384a7');
		function onSettingChanged() {
			resourceReservationPlanningBoardRequisitionService.updateIsFullyCoveredSettings();
		}

		planningBoardDataService.registerOnSettingsChanged(onSettingChanged);

		resourceReservationPlanningBoardResourceService.registerSelectionChanged(supplierSelectionChangedFunc);
		resourceReservationPlanningBoardReservationService.registerSelectionChanged(assignmentSelectionChangedFunc);
		resourceReservationPlanningBoardRequisitionService.registerSelectionChanged(demandSelectionChangedFunc);

		$scope.$on('$destroy', function () {
			planningBoardDataService.unregisterOnSettingsChanged(onSettingChanged);
			resourceReservationPlanningBoardResourceService.unregisterSelectionChanged(supplierSelectionChangedFunc);
			resourceReservationPlanningBoardReservationService.unregisterSelectionChanged(assignmentSelectionChangedFunc);
			resourceReservationPlanningBoardRequisitionService.unregisterSelectionChanged(demandSelectionChangedFunc);

		});
	}
})();
