(function () {
	'use strict';

	var moduleName = 'resource.project';

	angular.module(moduleName).controller('resourceProjectPlanningBoardController', ResourceProjectPlanningBoardController);

	ResourceProjectPlanningBoardController.$inject = ['$scope','moment', '_', 'platformPlanningBoardDataService', 'calendarUtilitiesService',
		'resourceProjectPlanningBoardResourceService', 'resourceProjectPlanningBoardRequisitionService', 'resourceProjectPlanningBoardReservationService',
		'resourceReservationPlanningBoardClipboardService', 'platformPlanningBoardGridUiConfigService', 'resourceRequisitionPlanningBoardDemandMappingService',
		'resourceReservationPlanningBoardAssignmentMappingService', 'resourceMasterPlanningBoardSupplierMappingService','resourceMasterPlanningBoardCustomConfigFactory', 'resourceCommonNavigationService'];

	function ResourceProjectPlanningBoardController($scope, moment ,_ , platformPlanningBoardDataService, calendarUtilitiesService,
		resourceProjectPlanningBoardResourceService, resourceProjectPlanningBoardRequisitionService, resourceProjectPlanningBoardReservationService,
		resourceReservationPlanningBoardClipboardService, platformPlanningBoardGridUiConfigService, resourceRequisitionPlanningBoardDemandMappingService,
		resourceReservationPlanningBoardAssignmentMappingService, resourceMasterPlanningBoardSupplierMappingService, resourceMasterPlanningBoardCustomConfigFactory, resourceCommonNavigationService) {

		platformPlanningBoardDataService.setPlanningBoardConfiguration({
			uuid: '3f8ecb61a9ee42b1af851af3b55fcd4b',
			timeScale: calendarUtilitiesService,
			supplier: {
				uuid: '6bfddd08a3a144d4beb3b431fb765ef6',
				dataService: resourceProjectPlanningBoardResourceService,
				validationService: {},
				mappingService: resourceMasterPlanningBoardSupplierMappingService,
				uiStandardService: platformPlanningBoardGridUiConfigService.getSupplierGridConfigService('resourceMasterUIStandardService'),
				customSupplierConfig: resourceMasterPlanningBoardCustomConfigFactory.getConfig({uuid: '3f8ecb61a9ee42b1af851af3b55fcd4b'}).validOnDueDateConfig(),
			},
			assignment: {
				uuid: 'bc3f07d459034d31be709c929dcf3a70',
				dataService: resourceProjectPlanningBoardReservationService,
				mappingService: resourceReservationPlanningBoardAssignmentMappingService
			},
			demand: {
				uuid: 'd700a8e02c214ea0af68a45c927ab90c',
				dataService: resourceProjectPlanningBoardRequisitionService,
				mappingService: resourceRequisitionPlanningBoardDemandMappingService,
				validationService: {},
				uiStandardService: platformPlanningBoardGridUiConfigService.getDemandGridConfigService('resourceRequisitionUIStandardService'),
				dragDropService: resourceReservationPlanningBoardClipboardService,
				dragDropType: 'resourceRequisition',
				demandDependOnExternal: false, // true
			},
			/*
			toolbarConfig: {
				customTools: resourceReservationPlanningBoardAssignmentMappingService.getCustomTools(resourceProjectPlanningBoardReservationService)
			}
			 */
			toolbarConfig: {
				customTools: function () {
					const isFullyCoveredTools = resourceReservationPlanningBoardAssignmentMappingService.getCustomTools(resourceProjectPlanningBoardReservationService);
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
					resourceProjectPlanningBoardResourceService,
					resourceProjectPlanningBoardReservationService,
					resourceProjectPlanningBoardRequisitionService
				);
			};
		}

		const supplierSelectionChangedFunc = getUpdateNavigationButtonFunc('supplier');
		const assignmentSelectionChangedFunc = getUpdateNavigationButtonFunc('assignment');
		const demandSelectionChangedFunc = getUpdateNavigationButtonFunc('demand');

		let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID('3f8ecb61a9ee42b1af851af3b55fcd4b');
		function onSettingChanged() {
			resourceProjectPlanningBoardRequisitionService.updateIsFullyCoveredSettings();
		}

		planningBoardDataService.registerOnSettingsChanged(onSettingChanged);
		resourceProjectPlanningBoardResourceService.registerSelectionChanged(supplierSelectionChangedFunc);
		resourceProjectPlanningBoardReservationService.registerSelectionChanged(assignmentSelectionChangedFunc);
		resourceProjectPlanningBoardRequisitionService.registerSelectionChanged(demandSelectionChangedFunc);

		$scope.$on('$destroy', function () {
			planningBoardDataService.unregisterOnSettingsChanged(onSettingChanged);
			resourceProjectPlanningBoardResourceService.unregisterSelectionChanged(supplierSelectionChangedFunc);
			resourceProjectPlanningBoardReservationService.unregisterSelectionChanged(assignmentSelectionChangedFunc);
			resourceProjectPlanningBoardRequisitionService.unregisterSelectionChanged(demandSelectionChangedFunc);
		});
	}
})();
