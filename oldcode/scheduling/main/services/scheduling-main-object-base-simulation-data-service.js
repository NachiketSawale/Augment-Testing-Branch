/**
 * Created by Mohit on 03.01.2023
 */
(function (angular) {
	/* global globals */
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainObjectBaseSimulationDataService
	 * @function
	 *
	 * @description
	 * schedulingMainObjectBaseSimulationDataService is the data service for all ObjectBaseSimulation related functionality.
	 */
	schedulingMainModule.factory('schedulingMainObjectBaseSimulationDataService', ['schedulingMainService','schedulingMainConstantValues','platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceFactory','platformObservableService', 'schedulingMainCurrentDatesProcessor', 'modelViewerModelSelectionService','modelViewerSelectorService',
		'modelViewerModelIdSetService','modelViewerCompositeModelObjectSelectionService', 'platformDataServiceDataProcessorExtension', '_', 'platformRuntimeDataService',
		function (schedulingMainService,schedulingMainConstantValues,platformDataServiceProcessDatesBySchemeExtension,
			platformDataServiceFactory,platformObservableService, schedulingMainCurrentDatesProcessor, modelViewerModelSelectionService,modelViewerSelectorService,
			modelViewerModelIdSetService,modelViewerCompositeModelObjectSelectionService, platformDataServiceDataProcessorExtension, _, platformRuntimeDataService) {

			let schedulingMainSimulationServiceOption = {
				flatLeafItem: {
					module: schedulingMainModule,
					serviceName: 'schedulingMainObjectBaseSimulationDataService',
					entityNameTranslationID: 'scheduling.main.objectBaseSimulationListTitle',
					httpCreate: { route: globals.webApiBaseUrl + 'scheduling/main/ojectmodelsimulation/' },
					httpRead: { route: globals.webApiBaseUrl + 'scheduling/main/ojectmodelsimulation/',
						endRead: 'listByParents',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selection = schedulingMainService.getSelectedEntities();
							delete readData.filter;
							readData.Ids = _.map(selection, 'Id');
						}
					},
					actions: { delete: false, create: 'flat' },
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
						schedulingMainConstantValues.schemes.objectSimulation), schedulingMainCurrentDatesProcessor, {processItem: processItem}],
					entityRole: { leaf: { itemName: 'ObjModelSimulation', parentService: schedulingMainService  } },
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selected = schedulingMainService.getSelected();
								creationData.PKey1 = selected.Id;

							}
						}
					}
				}
			};
			let serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainSimulationServiceOption);
			serviceContainer.service.canCreate = function canCreate() {
				return !schedulingMainService.isCurrentTransientRoot();
			};
			serviceContainer.service.updateModelSelection = platformObservableService.createObservableBoolean({
				initialValue: true
			});
			serviceContainer.service.updateModelSelection.uiHints = {
				id: 'toggleObjectSelection',
				caption$tr$: 'estimate.main.selectLineItemObjects',
				iconClass: 'tlb-icons ico-view-select'
			};

			function updateModelSelectionIfRequired() {
				if (serviceContainer.service.updateModelSelection.getValue()) {
					let selModelId = modelViewerModelSelectionService.getSelectedModelId();
					if (selModelId) {
						let selItems = serviceContainer.service.getSelectedEntities();

						if (selItems.length > 0) {
							selectAssignedObject(selItems);
						}
					}
				}
			}

			function selectAssignedObject (assignedObjects) {
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					if(assignedObjects && assignedObjects.length){
						let selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							selectedObjectIds[subModelId] = [];
						});

						selectedObjectIds = selectedObjectIds.useGlobalModelIds();

						assignedObjects.forEach(function (assignedObject) {
							if(angular.isArray(selectedObjectIds[assignedObject.MdlModelFk])){
								selectedObjectIds[assignedObject.MdlModelFk].push(assignedObject.ObjectFk);
							}
						});

						if (!selectedObjectIds.isEmpty()) {
							modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(selectedObjectIds.useSubModelIds());
						}
					}
					else {
						modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
					}
				}
			}
			serviceContainer.service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
			serviceContainer.service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);

			serviceContainer.service.takeOver = function(entities, hasToModified) {
				_.forEach(entities, function(entity){
					let loaded = serviceContainer.data.getItemById(entity.Id, serviceContainer.data);
					if (loaded) {
						loaded.PlannedDuration = entity.PlannedDuration;
						loaded.PlannedStart = entity.PlannedStart;
						loaded.PlannedFinish = entity.PlannedFinish;
						platformDataServiceDataProcessorExtension.doProcessItem(loaded, serviceContainer.data);
						if (hasToModified) {
							serviceContainer.service.markItemAsModified(loaded);
						}
					}
				});
			};

			function processItem(item){
				let activity = schedulingMainService.getSelected(item.ActivityFk);
				if (activity && activity.ProgressReportMethodFk !== schedulingMainConstantValues.progressReportMethod.ByModelObjects) {
					platformRuntimeDataService.readonly(item, [{
						field: 'ExecutionStarted',
						readonly: true
					},{
						field: 'ExecutionFinished',
						readonly: true
					},{
						field: 'ActualStart',
						readonly: true
					},{
						field: 'ActualFinish',
						readonly: true
					},{
						field: 'PerformanceDate',
						readonly: true
					},{
						field: 'PCo',
						readonly: true
					},{
						field: 'RemainingPCo',
						readonly: true
					},{
						field: 'Quantity',
						readonly: true
					},{
						field: 'RemainingQuantity',
						readonly: true
					}]);

				}
			}
			return serviceContainer.service;
		}
	]);
})(angular);