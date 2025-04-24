/*
 * $Id: scheduling-main-container-information-service.js 634700 2021-04-29 11:25:18Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';
	var schedulingMainModule = angular.module(moduleName);

	/**
  * @ngdoc service
  * @name schedulingMainContainerInformationService
  * @function
  *
  * @description
  *
  */
	schedulingMainModule.service('schedulingMainContainerInformationService', SchedulingMainContainerInformationService);

	SchedulingMainContainerInformationService.$inject = ['_', '$injector', 'platformDragdropService', 'schedulingMainClipboardService',
		'schedulingMainProgressReportService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'platformSourceWindowGridDragService', 'schedulingMainConstantValues'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function SchedulingMainContainerInformationService(_, $injector, platformDragdropService, schedulingMainClipboardService, schedulingMainProgressReportService, platformLayoutHelperService, basicsLookupdataConfigGenerator, platformSourceWindowGridDragService, schedulingMainConstantValues) {

		var self = this;
		var dynamicConfigurations = {};
		var templInfo = {};
		var guids = schedulingMainConstantValues.uuid.container;

		/* jshint -W074 */ // There is no cyclomatic complexity - try harder J.S.Hint
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case 'da5481eabd71482dbca12c4260eec5bf': // modelMainObjectInfoListController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('36abc91df46f4129a78cc26fe79a6fdc');
					break;
				case '086b1d0b9d4e4bc6a80ffddaa668ada7': // modelMainObjectInfoDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('114f1a46eaee483d829648e7dd60a63c');
					break;
				case '13120439D96C47369C5C24A2DF29238D': // schedulingMainActivityListController
					layServ = $injector.get('schedulingMainActivityStandardConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					self.addActivityServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						bulkEditorSettings: {
							serverSideBulkProcessing: true,
							skipEntitiesToProcess: false
						},
						pinningContext: true,
						enableCopyPasteExcel: false
					};
					break;
				case '6f697738e6c64b698aa61a0713670dd6': // schedulingMainObjectBaseSimulationListController
					layServ = $injector.get('schedulingMainObjectBaseSimulationStandardConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					self.addObjectSimulationServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						bulkEditorSettings: {
							serverSideBulkProcessing: true,
							skipEntitiesToProcess: false
						},
						initCalled: false,
						columns: [],
						pinningContext: true,
						enableCopyPasteExcel: false
					};
					break;
				case '13120439D96C47369C5C24A2DF29238E': // schedulingMainActivityListControllerGantt
					layServ = $injector.get('schedulingMainActivityStandardConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					self.addActivityServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						bulkEditorSettings: {
							serverSideBulkProcessing: true,
							skipEntitiesToProcess: false
						},
						pinningContext: true,
						enableCopyPasteExcel: false
					};
					break;
				case '0B1F0E40DA664E4A8081FE8FA6111403': // schedulingMainActivityDetailController
					layServ = $injector.get('schedulingMainActivityStandardConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					self.addActivityServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case '0FCBAF8C89AC4493B58695CFA9F104E2': // schedulingMainActivityHierarchicalListControllerGantt
					layServ = $injector.get('schedulingMainActivityStandardConfigurationService');
					config = layServ.getStandardConfigForListView();
					self.addActivityServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						parentProp: 'ParentActivityFk',
						childProp: 'Activities',
						type: 'activity',
						dragDropService: schedulingMainClipboardService,
						bulkEditorSettings: {
							serverSideBulkProcessing: true,
							skipEntitiesToProcess: false
						},
						pinningContext: true,
						grouping: false, // disable grouping in Gantt-Treegrid,
						enableCopyPasteExcel: false
					};
					break;
				case 'D8FE0DF4C85241048ABEA198A699595A': // schedulingMainRelationshipListController
					layServ = $injector.get('schedulingMainRelationshipConfigurationService');
					config = layServ.getStandardConfigForListView();
					self.addRelationServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '800651ED2F844B2592E39BEA7DF6AB69': // schedulingMainRelationshipDetailController
					layServ = $injector.get('schedulingMainRelationshipConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					self.addRelationServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case 'e4a4e97657ef4068bdf1367afca01375': // schedulingMainPredecessorListController
					layServ = $injector.get('schedulingMainPredecessorConfigurationService');
					config = layServ.getStandardConfigForListView();
					self.addPredecessorServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'e65b9fddd0a7404c9cbf6c111e1dac81': // schedulingMainPredecessorDetailController
					layServ = $injector.get('schedulingMainPredecessorConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					self.addPredecessorServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case '04CBFBACB07C4FBA922A9F2B91206657': // schedulingMainProgressReportListController
					layServ = $injector.get('schedulingMainProgressReportConfigurationService');
					config = layServ.getStandardConfigForListView();
					self.addProgressReportServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false, columns: [],
						cellChangeCallBack: function cellChangeCallBack(arg) {
							var lineItem = _.find(arg.item.LineItems, {Id: arg.item.EstLineItemFk});
							if (lineItem) {
								arg.item.EstHeaderFk = lineItem.EstHeaderFk;
								arg.item.QuantityTotal = lineItem.QuantityTotal;
								arg.item.BasUomFk = lineItem.BasUomFk;
								if (arg.item.EstHeaderFk) {
									schedulingMainProgressReportService.gridRefresh();
								}
							}
						}
					};
					break;
				case '27C823EF3D0A4FE3B38D43957B5C86D6': // schedulingMainProgressReportDetailController
					layServ = $injector.get('schedulingMainProgressReportConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					self.addProgressReportServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case 'CDB0EA3D378846AB81BDE1020E62F32F': // schedulingMainClerkListController
					layServ = $injector.get('schedulingMainClerkConfigurationService');
					config = layServ.getStandardConfigForListView();
					self.addClerkServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						type: 'clerk',
						dragDropService: schedulingMainClipboardService
					};
					break;
				case '13C7FF9D5FB24B96A2274507FA453422': // schedulingMainClerkDetailController
					layServ = $injector.get('schedulingMainClerkConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					self.addClerkServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case '578F759AF73E4A6AA22089975D3889AC': // schedulingMainEventListController
					layServ = $injector.get('schedulingMainEventConfigurationService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingMainEventConfigurationService';
					config.dataServiceName = 'schedulingMainEventService';
					config.validationServiceName = 'schedulingMainEventValidationService';
					config.listConfig = {
						initCalled: false,
						// useFilter: true,
						columns: [],
						type: 'event',
						dragDropService: schedulingMainClipboardService,
						allowedDragActions: [platformDragdropService.actions.copy, platformDragdropService.actions.move]
					};
					break;

				case 'E006376F2DBA4A8D97D6BAB94F1E36E0': // schedulingMainEventDetailController
					layServ = $injector.get('schedulingMainEventConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingMainEventConfigurationService';
					config.dataServiceName = 'schedulingMainEventService';
					config.validationServiceName = 'schedulingMainEventValidationService';
					break;
				case 'F6B1110D6E2249A7BA25C8A0D9C27A82': // schedulingMainBaseLineListController
					layServ = $injector.get('schedulingMainBaselineConfigurationService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingMainBaselineConfigurationService';
					config.dataServiceName = 'schedulingMainBaselineService';
					config.validationServiceName = 'schedulingMainBaselineValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '991140E3E8864074821A60EF3D8286A6': // schedulingMainBaseLineDetailController
					layServ = $injector.get('schedulingMainBaselineConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingMainBaselineConfigurationService';
					config.dataServiceName = 'schedulingMainBaselineService';
					config.validationServiceName = 'schedulingMainBaselineValidationService';
					break;
				case 'DE783A504A284F64ABA8C473A95D0262': // schedulingMainActivityBaseLineComparisonListController
					layServ = $injector.get('schedulingMainActivityBaseLineComparisonConfigurationService');
					config = layServ.getStandardConfigForListView();
					_.forEach(config.columns, function (column) {
						column.readonly = true;
						if (column.editor) {
							column.editor = null;
							if (column.editorOptions) {
								column.editorOptions = null;
							}
						}
					});
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingMainActivityBaseLineComparisonConfigurationService';
					config.dataServiceName = 'schedulingMainActivityBaseLineComparisonService';
					config.listConfig = {initCalled: false, columns: [], readonly: true};
					break;
				case '07901A0DDC2347698EB076C09CF8160D': // schedulingMainActivityBaseLineComparisonDetailController
					layServ = $injector.get('schedulingMainActivityBaseLineComparisonConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					_.forEach(config.rows, function (row) {
						row.readonly = true;
					});
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingMainActivityBaseLineComparisonConfigurationService';
					config.dataServiceName = 'schedulingMainActivityBaseLineComparisonService';
					break;
				case '5c2a4c1d66c5438981aa934f449e1d4d': // schedulingMainLineItemProgressListController
					layServ = $injector.get('schedulingMainLineItemProgressConfigurationService');
					config = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingMainLineItemProgressConfigurationService';
					config.dataServiceName = 'schedulingMainLineItemProgressService';
					config.validationServiceName = 'schedulingMainLineItemProgressValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '7DCAA269EC3F4BAC8059B6C2AF97BAE2': // schedulingMainLineItemProgressDetailController
					layServ = $injector.get('schedulingMainEventConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingMainLineItemProgressConfigurationService';
					config.dataServiceName = 'schedulingMainLineItemProgressService';
					config.validationServiceName = 'schedulingMainLineItemProgressValidationService';
					break;
				case '4cbbc13ef72f49808cd693bdca839846': // schedulingMainActivityHierarchicalListControllerGantt
					config = self.getContainerInfoByGuid('0FCBAF8C89AC4493B58695CFA9F104E2');
					templInfo = {
						dto: 'ActivityDto',
						http: 'scheduling/main/activity/',
						endRead: 'treeforsource',
						filter: '?scheduleId=',
						filterFk: 'scheduleFk',
						presenter: 'tree',
						parentProp: 'ParentActivityFk',
						childProp: 'Activities',
						childSort: function (item1, item2) {
							return (item1.Code.localeCompare(item2.Code));
						},
						sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
						isInitialSorted: true,
						sourceDataService: 'schedulingMainService'
					};
					config.templInfo = templInfo;
					config.dataServiceName = $injector.get('schedulingMainSourceDataServiceFactory').createDataService(templInfo);
					config.validationServiceName = {};
					config.listConfig.dragDropService = platformSourceWindowGridDragService;
					config.listConfig.type = 'sourceActivity';
					break;
				case '026c24f15a944a27980437ab4dc85b58': // schedulingdMainCopyFromActivityTemplateListController
					layServ = $injector.get('schedulingTemplateContainerInformationService');
					config = layServ.getContainerInfoByGuid('AFECDE4A08404395855258B70652D04D');
					templInfo = {
						dto: 'ActivityTemplateDto',
						http: 'scheduling/template/activitytemplate/',
						endRead: 'list',
						filter: '?mainItemID=',
						filterFk: 'templateGroupFk',
						presenter: 'list',
						sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
						isInitialSorted: true,
						sourceDataService: 'schedulingTemplateActivityTemplateService'
					};
					config.templInfo = templInfo;
					config.dataServiceName = $injector.get('schedulingMainSourceDataServiceFactory').createDataService(templInfo);
					config.validationServiceName = {};
					config.listConfig.type = 'sourceTemplate';
					break;
				case 'c8f5680d634941bdaa5be432ae25c082': // schedulingEventOverviewListController
					layServ = $injector.get('schedulingMainEventOverviewConfigurationService');
					config = layServ.getStandardConfigForListView();
					self.addEventServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						useFilter: false,
						columns: [],
						type: 'eventOverview',
						dragDropService: schedulingMainClipboardService,
						allowedDragActions: [platformDragdropService.actions.copy]
					};
					break;
				case '5bbf12317b5747a798ba710de91985e7': // schedulingEventOverviewDetailController
					layServ = $injector.get('schedulingMainEventOverviewConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					self.addEventServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
				case '221f0cc18f014d608cfb9acef1de4bb5': // schedulingMainHammockListController
					layServ = $injector.get('schedulingMainHammockLayoutService');
					config = layServ.getStandardConfigForListView();
					config = self.addHammockServiceInfos(config);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						type: 'hammock',
						dragDropService: schedulingMainClipboardService,
						allowedDragActions: [platformDragdropService.actions.link]
					};
					break;
				case 'd0cfd4e89e634a4fb99c8a14c6fa057e': // schedulingMainHammockDetailController
					layServ = $injector.get('schedulingMainHammockLayoutService');
					config = layServ.getStandardConfigForDetailView();
					config = self.addHammockServiceInfos(config);
					config.ContainerType = 'Detail';
					break;
					// grouped imports from model.main
				case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
				case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
					break;
				case guids.observationList: // resourceSkillListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getObservationServiceInfo(), self.getObservationLayout);
					config.listConfig = {
						dragDropService: schedulingMainClipboardService,
						type: 'observation',
						allowedDragActions: [platformDragdropService.actions.copy]
					};
					break;
				case guids.observationDetail: // resourceSkillMainEntityNameDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getObservationServiceInfo(), self.getObservationLayout);
					break;
				case guids.baselinePredecessorList: // schedulingMainActivityBaseLineComparisonPredecessorListController
					layServ = $injector.get('schedulingMainBaselinePredecessorConfigurationService');
					config = layServ.getStandardConfigForListView();
					_.forEach(config.columns, function (column) {
						column.readonly = true;
						if (column.editor) {
							column.editor = null;
							if (column.editorOptions) {
								column.editorOptions = null;
							}
						}
					});
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingMainBaselinePredecessorConfigurationService';
					config.dataServiceName = 'schedulingMainBaselinePredecessorRelationshipDataService';
					config.listConfig = {initCalled: false, columns: [], readonly: true};
					break;
				case guids.baselinePredecessorDetail: // schedulingMainActivityBaseLineComparisonPredecessorDetailController
					layServ = $injector.get('schedulingMainBaselinePredecessorConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					_.forEach(config.rows, function (row) {
						row.readonly = true;
					});
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingMainBaselinePredecessorConfigurationService';
					config.dataServiceName = 'schedulingMainBaselinePredecessorRelationshipDataService';
					break;
				case guids.baselineSuccessorList: // schedulingMainActivityBaseLineComparisonSuccessorListController
					layServ = $injector.get('schedulingMainBaselineRelationshipConfigurationService');
					config = layServ.getStandardConfigForListView();
					_.forEach(config.columns, function (column) {
						column.readonly = true;
						if (column.editor) {
							column.editor = null;
							if (column.editorOptions) {
								column.editorOptions = null;
							}
						}
					});
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingMainBaselineRelationshipConfigurationService';
					config.dataServiceName = 'schedulingMainBaselineSuccessorRelationshipDataService';
					config.listConfig = {initCalled: false, columns: [], readonly: true};
					break;
				case guids.baselineSuccessorDetail: // schedulingMainActivityBaseLineComparisonSuccessorDetailController
					layServ = $injector.get('schedulingMainBaselineRelationshipConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					_.forEach(config.rows, function (row) {
						row.readonly = true;
					});
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingMainBaselineRelationshipConfigurationService';
					config.dataServiceName = 'schedulingMainBaselineSuccessorRelationshipDataService';
					break;
				case 'e1ff9fbf38cc451b9e9582574de353dd': // schedulingMainActivitiyyBaselineListController
					config = self.getContainerInfoByGuid('0FCBAF8C89AC4493B58695CFA9F104E2');
					templInfo = {
						dto: 'ActivityBaselineDto',
						http: 'scheduling/main/activity/',
						endRead: 'treebybaseline',
						filter: '?baselineId=',
						filterFk: 'baselineFk',
						presenter: 'tree',
						parentProp: 'ParentActivityFk',
						childProp: 'Activities',
						childSort: function (item1, item2) {
							return (item1.Code.localeCompare(item2.Code));
						},
						sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
						isInitialSorted: true,
						sourceDataService: 'schedulingMainService',
						editable: true
					};
					config.templInfo = templInfo;
					config.dataServiceName = $injector.get('schedulingMainSourceDataServiceFactory').createDataService(templInfo);
					config.validationServiceName = {};
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}

			return config;
		};

		this.addActivityServiceInfos = function addActivityServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainActivityStandardConfigurationService';
			config.dataServiceName = 'schedulingMainService';
			config.validationServiceName = 'schedulingMainActivityValidationService';
			return config;
		};
		this.addObjectSimulationServiceInfos = function addObjectSimulationServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainObjectBaseSimulationStandardConfigurationService';
			config.dataServiceName = 'schedulingMainObjectBaseSimulationDataService';
			config.validationServiceName = 'schedulingMainObjectBaseSimulationValidationService';
			return config;
		};

		this.addClerkServiceInfos = function addClerkServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainClerkConfigurationService';
			config.dataServiceName = 'schedulingMainClerkService';
			config.validationServiceName = 'schedulingMainClerkValidationService';
			return config;
		};

		this.addEventServiceInfos = function addEventServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainEventOverviewConfigurationService';
			config.dataServiceName = 'schedulingMainEventOverviewService';
			config.validationServiceName = 'schedulingMainEventValidationService';
			return config;
		};

		this.addPredecessorServiceInfos = function addPredecessorServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainPredecessorConfigurationService';
			config.dataServiceName = 'schedulingMainPredecessorRelationshipDataService';
			config.validationServiceName = 'schedulingMainPredecessorValidationService';
			return config;
		};

		this.addProgressReportServiceInfos = function addProgressReportServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainProgressReportConfigurationService';
			config.dataServiceName = 'schedulingMainProgressReportService';
			config.validationServiceName = 'schedulingMainProgressReportValidationService';
			return config;
		};

		this.addRelationServiceInfos = function addRelationServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainRelationshipConfigurationService';
			config.dataServiceName = 'schedulingMainSuccessorRelationshipDataService';
			config.validationServiceName = 'schedulingMainSuccessorValidationService';
			return config;
		};

		this.addRequisitionCreationServiceInfos = function addRequisitionCreationServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainRequisitionCreationConfigurationService';
			config.dataServiceName = 'schedulingMainRequisitionCreationService';
			return config;
		};

		this.addHammockServiceInfos = function addHammockServiceInfos(config) {
			config.standardConfigurationService = 'schedulingMainHammockLayoutService';
			config.dataServiceName = 'schedulingMainHammockDataService';
			config.validationServiceName = 'schedulingMainHammockValidationService';
			return config;
		};

		this.getHammockLayout = function getHammockLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'scheduling.main.hammock',
				['activitymemberfk', 'commenttext']);

			res.overloads = {

				activitymemberfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupActivityDataServiceFull',
					filterKey: 'self-reference-type-activity-hammock-exclude-linked',
					filter: function (item) {
						if (item) {
							return item.ScheduleFk;
						}
					},
					additionalColumns: false
				})
			};

			return res;
		};

		this.getObservationServiceInfo = function getObservationServiceInfo() {
			return {
				standardConfigurationService: 'schedulingMainObservationLayoutService',
				dataServiceName: 'schedulingMainObservationDataService',
				validationServiceName: 'schedulingMainObservationValidationService'
			};
		};

		this.getObservationLayout = function getObservationLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'scheduling.main.observation',
				['activityobservedfk', 'description', 'plannedstart', 'plannedfinish', 'plannedduration', 'actualstart', 'actualfinish', 'actualduration', 'currentstart', 'currentfinish', 'currentduration', 'schedulecode', 'scheduledescription', 'projectno', 'projectname', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['activityobservedfk'], self);
			res.addAdditionalColumns = true;

			return res;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		function getObservedActivityOverload() {
			return {
				navigator: {
					moduleName: 'scheduling.main'
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'scheduling-main-activity-dialog-lookup',
						lookupOptions: {
							showClearButton: true,
							pageOptions: {
								enabled: true,
								size: 100
							},
							defaultFilter: function (filterItem) {
								var mainServ = $injector.get('schedulingMainService');
								filterItem.projectFk = mainServ.getSelected().ProjectFk;
								filterItem.scheduleFk = mainServ.getSelected().ScheduleFk;
							}
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SchedulingActivityNew',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						showClearButton: true,
						lookupDirective: 'scheduling-main-activity-dialog-lookup',
						lookupType: 'SchedulingActivityNew',
						displayMember: 'Code',
						version: 3,
						lookupOptions: {
							showClearButton: true,
							pageOptions: {
								enabled: true,
								size: 100
							},
							defaultFilter: function (filterItem) {
								var mainServ = $injector.get('schedulingMainService');
								filterItem.projectFk = mainServ.getSelected().ProjectFk;
								filterItem.scheduleFk = mainServ.getSelected().ScheduleFk;
							}
						}
					}
				}
			};
		}

		this.getOverload = function getOverload(overload) {
			var ovl = null;

			switch (overload) {
				case 'activityobservedfk':
					ovl = getObservedActivityOverload();
					break;
			}

			return ovl;
		};
	}
})(angular);
