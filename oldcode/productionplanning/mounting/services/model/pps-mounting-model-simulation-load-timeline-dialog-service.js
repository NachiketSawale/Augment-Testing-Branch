(function () {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsMountingModelSimulationLoadTimelineDialogService', ['_', '$q',
		'modelViewerModelSelectionService', 'schedulingScheduleProjectScheduleLookupDataService',
		'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService',
		'$http', 'projectMainProjectSelectionService', 'PlatformMessenger', '$translate',
		'modelSimulationTimelineRequestService', 'platformDataServiceProcessDatesBySchemeExtension',
		function (_, $q, modelViewerModelSelectionService, schedulingScheduleProjectScheduleLookupDataService,
					 basicsLookupdataConfigGenerator, platformTranslateService, platformModalFormConfigService, $http,
					 projectMainProjectSelectionService, PlatformMessenger, $translate,
					 modelSimulationTimelineRequestService, platformDataServiceProcessDatesBySchemeExtension) {
			var service = {};

			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'RequisitionDto',
				moduleSubModule: 'ProductionPlanning.Mounting'
			});

			service.showDialog = function () {
				var selModel = modelViewerModelSelectionService.getSelectedModel();
				var loadSettings = {
					model: selModel ? selModel.info.getNiceName() : '',
					requisitions: [],
					selectedRequisitions: [],
					dateKind: 'c'
				};

				var prjId = projectMainProjectSelectionService.getSelectedProjectId();
				return $http.get(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/list?ProjectFk=' + prjId).then(function (response) {
					response.data.Main.forEach(function (req){
						dateProcessor.processItem(req);
					});
					loadSettings.requisitions = response.data.Main;
					var loadDialogConfig = {
						title: $translate.instant('model.simulation.loadTimelineTitle'),
						width: '80%',
						//resizeable: true,
						dataItem: loadSettings,
						formConfiguration: {
							fid: 'model.simulation.loadTimeline',
							showGrouping: false,
							groups: [
								{
									gid: 'dataSource',
									isOpen: true,
									sortOrder: 100
								}
							],
							rows: [
								{
									gid: 'dataSource',
									rid: 'name',
									label$tr$: 'model.simulation.timelineName',
									type: 'description',
									model: 'name',
									placeholder: $translate.instant('model.simulation.autoValueHint'),
									sortOrder: 50
								}, {
									gid: 'dataSource',
									rid: 'requisition',
									label$tr$: 'productionplanning.mounting.requisition.listTitle',
									type: 'directive',
									directive: 'pps-mnt-model-simulation-event-source-selector',
									options: {
										gridId: 'af67d175cbea44009fa8539886410dff',
										uiSrv: 'productionplanningMoungtingRequisitionUIStandardService',
										dataProp: 'requisitions',
										selectedItemsProp: 'selectedRequisitions'
									},
									sortOrder: 100
								}, {
									gid: 'dataSource',
									rid: 'model',
									label$tr$: 'model.simulation.model',
									type: 'description',
									readonly: true,
									model: 'model',
									visible: true,
									sortOrder: 200
								}
							]
						},
						dialogOptions: {
							disableOkButton: function () {
								return loadSettings.selectedRequisitions.length <= 0;
							}
						}
					};

					platformTranslateService.translateFormConfig(loadDialogConfig.formConfiguration);
					return platformModalFormConfigService.showDialog(loadDialogConfig).then(function (result) {
						if (result.ok) {
							return {
								success: true,
								request: _.assign(new modelSimulationTimelineRequestService.TimelineRequest(), {
									RequisitionIds: loadSettings.selectedRequisitions.map(function (req) {
										return req.Id;
									}),
									Name: loadSettings.name
								})
							};
						} else {
							return {
								success: false
							};
						}
					});
				});
			};

			return service;
		}]);
})();
