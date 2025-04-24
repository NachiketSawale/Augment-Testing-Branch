(function (angular) {
	'use strict';

	angular.module('platform').service('platformPlanningBoardDataService', PlatformPlanningBoardDataService);

	PlatformPlanningBoardDataService.$inject = ['_',
		'platformDialogService',
		'platformChartInterval',
		'PlatformMessenger',
		'platformDataServiceModificationTrackingExtension',
		'platformGridAPI',
		'basicsCommonChangeStatusService',
		'$translate',
		'basicsUnitLookupDataService',
		'globals',
		'basicsCommonDrawingUtilitiesService',
		'basicsCustomizeReservationTypeIconService',
		'platformStatusIconService',
		'platformDetailControllerService',
		'platformToolbarService',
		'platformDateshiftHelperService',
		'platformGridControllerService',
		'mainViewService',
		'$injector',
		'$timeout',
		'platformMasterDetailDialogService',
		'platformDragdropService',
		'cloudDesktopSvgIconService',
		'basicsLookupdataPopupService',
		'platformDateshiftPlanningboardHelperService',
		'platformNavBarService',
		'$compile',
		'platformDateshiftCalendarService',
		'platformModalFormConfigService',
		'$rootScope',
		'platformPlanningBoardDataServiceFactory',
		'calendarUtilitiesService',
		'$http',
	];

	function PlatformPlanningBoardDataService(_,
		platformDialogService,
		platformChartInterval,
		PlatformMessenger,
		platformDataServiceModificationTrackingExtension,
		platformGridAPI,
		basicsCommonChangeStatusService,
		$translate,
		basicsUnitLookupDataService,
		globals,
		basicsCommonDrawingUtilitiesService,
		basicsCustomizeReservationTypeIconService,
		platformStatusIconService,
		platformDetailControllerService,
		platformToolbarService,
		platformDateshiftHelperService,
		platformGridControllerService,
		mainViewService,
		$injector,
		$timeout,
		platformMasterDetailDialogService,
		platformDragdropService,
		cloudDesktopSvgIconService,
		basicsLookupdataPopupService,
		platformDateshiftPlanningboardHelperService,
		platformNavBarService,
		$compile,
		platformDateshiftCalendarService,
		platformModalFormConfigService,
		$rootScope,
		PlatformPlanningBoardDataServiceFactory,
		calendarUtilitiesService,
		$http
	) {

		let service = this;
		let dataServiceMap = new Map();
		let demandDataServiceMap = new Map();
		let supplierDataServiceMap = new Map();
		let assignmentDataServiceMap = new Map();

		service.setPlanningBoardConfiguration = (options, scope) => {
			if (!useAngularElement) {
				angularJSPlanningBoard(options, scope);
			} else {
				angularElementsPlanningBoard(options, scope)
			}
		};

		service.getPlanningBoardDataServiceByUUID = function getPlanningBoardDataServiceByUUID(uuid) {
			return dataServiceMap.get(uuid);
		};

		service.getPlanningBoardDataServiceByDemandServiceName = function getPlanningBoardDataServiceByServiceName(name) {
			const uuid = demandDataServiceMap.get(name);
			return service.getPlanningBoardDataServiceByUUID(uuid);
		};

		service.getPlanningBoardDataServiceBySupplierServiceName = function getPlanningBoardDataServiceBySupplierServiceName(name) {
			const uuid = supplierDataServiceMap.get(name);
			return service.getPlanningBoardDataServiceByUUID(uuid);
		};

		service.getPlanningBoardDataServiceByAssignmentServiceName = function getPlanningBoardDataServiceByAssignmentServiceName(name) {
			const uuid = assignmentDataServiceMap.get(name);
			return service.getPlanningBoardDataServiceByUUID(uuid);
		};

		function angularJSPlanningBoard(options, scope) {
			if (_.isUndefined(dataServiceMap.get(options.uuid))) {
				if(options.demand){
					demandDataServiceMap.set(options.demand.dataService.getServiceName(), options.uuid);
				}
				if(options.supplier) {
					supplierDataServiceMap.set(options.supplier.dataService.getServiceName(), options.uuid);
				}
				if(options.assignment) {
					assignmentDataServiceMap.set(options.assignment.dataService.getServiceName(), options.uuid);
				}
				let planningBoardDataService = new PlatformPlanningBoardDataServiceFactory(options, scope);
				dataServiceMap.set(options.uuid, planningBoardDataService);
			} else {
				let dataServiceToLoad = dataServiceMap.get(options.uuid);
				dataServiceToLoad.setPlanningBoardScopeProperties(options, scope);
				dataServiceToLoad.registerPlanningBoardEvents(options);
				dataServiceToLoad.reloadPlanningBoardCalendar();
				if(_.isFunction(dataServiceToLoad.getAssignmentConfig().mappingService.updateMaintenanceList)){
					dataServiceToLoad.getAssignmentConfig().mappingService.updateMaintenanceList();
				}
			}
		}

		function angularElementsPlanningBoard(options, scope) {
			if (_.isUndefined(dataServiceMap.get(options.uuid))) {
				if (options.demand) {
					demandDataServiceMap.set(options.demand.dataService.getServiceName(), options.uuid);
				}
				if (options.supplier) {
					supplierDataServiceMap.set(options.supplier.dataService.getServiceName(), options.uuid);
				}
				if (options.assignment) {
					assignmentDataServiceMap.set(options.assignment.dataService.getServiceName(), options.uuid);
				}

				const { servicesToPass } = prepadeDataForPBElements(scope);
				PlanningBoardDataServiceInterfaceService.setPlanningBoardConfiguration(options, servicesToPass, globals.readLastLanguageFromStorage().culture);

				let planningBoardDataService = PlanningBoardDataServiceInterfaceService.getPlanningBoardDataServiceByUUID(options.uuid);

				dataServiceMap.set(options.uuid, planningBoardDataService);
			} else {
				prepadeDataForPBElements(scope);
				let dataServiceToLoad = dataServiceMap.get(options.uuid);
				dataServiceToLoad.setPlanningBoardScopeProperties(options, scope);
				dataServiceToLoad.registerPlanningBoardEvents(options);
				dataServiceToLoad.reloadPlanningBoardCalendar();
				if (_.isFunction(dataServiceToLoad.getAssignmentConfig().mappingService.updateMaintenanceList)) {
					dataServiceToLoad.getAssignmentConfig().mappingService.updateMaintenanceList();
				}
			}

			let planningBoardElement = document.createElement('platform-planningboard-component');
			planningBoardElement.scope = scope;
			let pbElem = document.getElementsByClassName('cid_' + scope.$parent.getContainerUUID())[0].querySelector('.planningboardMain');
			pbElem.append(planningBoardElement);
		}


		function prepadeDataForPBElements(scope) {

			// create an object with all dependencies that has not yet been migrated to Angular
			const servicesToPass = {
				PlatformMessenger: PlatformMessenger,
				platformDataServiceModificationTrackingExtension: platformDataServiceModificationTrackingExtension,
				platformGridAPI: platformGridAPI,
				basicsCommonDrawingUtilitiesService: basicsCommonDrawingUtilitiesService,
				basicsCustomizeReservationTypeIconService: basicsCustomizeReservationTypeIconService,
				platformDetailControllerService: platformDetailControllerService,
				platformGridControllerService: platformGridControllerService,
				platformChartInterval: platformChartInterval,

				basicsUnitLookupDataService: basicsUnitLookupDataService,

				platformDateshiftHelperService: platformDateshiftHelperService,
				platformToolbarService: platformToolbarService,
				platformDateshiftPlanningboardHelperService: platformDateshiftPlanningboardHelperService,
				mainViewService: mainViewService,
				platformDateshiftCalendarService: platformDateshiftCalendarService,
				calendarUtilitiesService: calendarUtilitiesService,

				angularJScompile: (extScope, elem) => {
					$compile(elem)(extScope);
				},
				angularJSTimeout: $timeout,
				convertDateToMoment: (date) => {
					let result = moment(date);
					result.toUTC = function toUTC() { return moment.utc(this) };
					return result; // needed for platform specific services, eg generated input fields in dialogs
				},
				mainContainerLink: $rootScope,
				createNewngJSChildScope: (scope) => {
					return scope.$new();
				},
				containerLink: scope,

				BasicsSharedStatusIconService: platformStatusIconService,
				BasicsSharedChangeStatusService: basicsCommonChangeStatusService,
				PlatformDragDropService: platformDragdropService,
				UiCommonLookupViewService: basicsLookupdataPopupService,
				PlatformTranslateService: $translate,
				PlatformConfigurationService: globals,
				CloudDesktopSvgIconService: cloudDesktopSvgIconService,
				injector: $injector,
				ModuleNavBarService: platformNavBarService,
				UiCommonDialogService: platformMasterDetailDialogService,
				UiCommonFormDialogService: platformModalFormConfigService,
				UiCommonMessageBoxService: platformDialogService,
				PlatformHttpService: {
					get: (serviceUrl, httpOptions) => {
					return $http.get(serviceUrl, httpOptions);
				},
					post: (serviceUrl, payload, httpOptions) => {
						return $http.post(serviceUrl, payload, httpOptions);
					}
				}
			};

			// start containerLink prop on scope
			scope.uuid = scope.getContainerUUID();

			scope.registerFinalizer = (fn) => {
				scope.$on('$destroy', fn);
			}
			// end

			servicesToPass.ModuleNavBarService.getById = platformNavBarService.getActionByKey;

			servicesToPass.PlatformDragDropService.mouseEnterTarget = platformDragdropService.mouseEnter;
			servicesToPass.PlatformDragDropService.mouseLeaveTarget = platformDragdropService.mouseLeave;

			servicesToPass.BasicsSharedChangeStatusService.changeStatus = basicsCommonChangeStatusService.changeMultipleStatus;
			servicesToPass.BasicsSharedChangeStatusService.getAvailableStatusList = basicsCommonChangeStatusService.getAvailableStatusItems;

			servicesToPass.UiCommonFormDialogService.show = platformModalFormConfigService.showDialog;

			servicesToPass.UiCommonDialogService.show = platformMasterDetailDialogService.showDialog;

			return {
				servicesToPass: servicesToPass,
				scope: scope
			};
		}

	}
})(angular);
