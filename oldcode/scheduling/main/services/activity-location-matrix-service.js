/**
 * Created by baf on 17.11.2015
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityValidationService
	 * @description provides validation methods for activities
	 */

	angular.module(moduleName).service('schedulingMainActivityLocationMatrixService', SchedulingMainActivityLocationMatrixService);

	SchedulingMainActivityLocationMatrixService.$inject = ['_', 'platformMatrixDataServiceFactory', 'schedulingMainService', 'projectLocationMainService', 'basicsCommonMatrixConfigMainService'];

	function SchedulingMainActivityLocationMatrixService(_, platformMatrixDataServiceFactory, schedulingMainService, projectLocationMainService, basicsCommonMatrixConfigurationDataService) {
		var self = this;
		self.version = 1;
		self.usingController = null;
		self.config = null;

		self.createMainActivityLocationMatrixService = function createMainActivityLocationMatrixService(config) {
			self.disConnect();
			self.config = config || self.config;
			return self.getContentService(self.config).then(function (contentService) {
				var configService = self.getConfigService();
				var horizontalService = self.getHorizontalService(projectLocationMainService);

				var activityMatrixService = {
					version: self.version,
					parentProp: 'ParentActivityFk',
					childrenProp: 'Activities'
				};
				++self.version;

				activityMatrixService = angular.extend(self, activityMatrixService, platformMatrixDataServiceFactory.createMatrixCompleteService(horizontalService, schedulingMainService, schedulingMainService, contentService, configService, basicsCommonMatrixConfigurationDataService));
				return activityMatrixService;
			});
		};

		self.enrichFieldInformation = function enrichFieldInformation(fieldList) {
			_.each(fieldList,
				/* jshint -W074 */ // ignore cyclomatic complexity warning
				function (field) {
					switch (field.Field) {
						case 'AllowModify':
							field.sumType = {all: true};
							break;
						case 'PlannedStart':
							field.sumType = {min: true};
							break;
						case 'PlannedFinish':
							field.sumType = {max: true};
							break;
						case 'PlannedDuration':
							field.sumType = {sum: true};
							break;
						case 'ActualStart':
							field.sumType = {min: true};
							break;
						case 'ActualFinish':
							field.sumType = {max: true};
							break;
						case 'ExecutionStarted':
							field.sumType = {one: true};
							break;
						case 'ExecutionFinished':
							field.sumType = {all: true};
							break;
						case 'EarliestStart':
							field.sumType = {min: true};
							break;
						case 'LatestStart':
							field.sumType = {min: true};
							break;
						case 'EarliestFinish':
							field.sumType = {max: true};
							break;
						case 'LatestFinish':
							field.sumType = {max: true};
							break;
						case 'IsCritical':
							field.sumType = {all: true};
							break;
						case 'IsLive':
							field.sumType = {all: true};
							break;
						case 'ActualDuration':
							field.sumType = {sum: true};
							break;
						case 'CurrentStart':
							field.sumType = {min: true};
							break;
						case 'CurrentFinish':
							field.sumType = {max: true};
							break;
						case 'CurrentDuration':
							field.sumType = {sum: true};
							break;
						default:
							field.sumType = {first: true};
							break;
					}
				});
		};

		self.getContentService = function getContentService(config) {
			return platformMatrixDataServiceFactory.getContentService(config, self).then(function (service) {
				self.setInitFieldFunc(service);
				self.setGetCellDataEntityFunc(service);
				return service;
			});
		};

		self.setInitFieldFunc = function setInitFieldFunc(service) {
			var content = service.contentDefinition;

			service.initField = function initField(cellData) {
				var data = {};

				_.forEach(platformMatrixDataServiceFactory.fields, function (field) {
					if (content[field]) {
						data[field] = {
							model: _.get(cellData, content[field].model)
						};
					}
					if (content[field].doesDependOn) {
						data[field][content[field].doesDependOn] = cellData[content[field].doesDependOn];
					}
				});

				return data;
			};
		};

		self.setGetCellDataEntityFunc = function setGetCellDataEntityFunc(service) {
			service.getCellDataEntity = function initField(rowData) {
				return rowData.dataSource;
			};
		};

		self.getConfigService = function getConfigService() {
			return {
				usesRootLeafForColumns: true,
				usesRootLeafForRows: true,
				createEmptyHorizontalRoot: function createEmptyHorizontalRoot() {
					var horiRoot = {Id: -1, Code: 'Flat Locations', HasChildren: false};
					horiRoot[self.config.horizontalChildren] = [];

					return horiRoot;
				},
				createEmptyVerticalRoot: function createEmptyVerticalRoot() {
					var vertRoot = {
						Id: -1,
						Code: 'Flat Activities',
						Activities: [],
						HasChildren: false,
						image: 'ico-task-summary'
					};

					return vertRoot;
				}
			};
		};

		self.getHorizontalService = function getHorizontalService() {
			var horizontalService = {
				tree: [],
				loadedCallBack: null,
				loadedCallParam: null
			};

			horizontalService.getTree = function getHorizontalServiceTree() {
				return horizontalService.tree;
			};

			horizontalService.registerListLoaded = function registerHorizontalServiceListLoaded(callBack, callParam) {
				horizontalService.loadedCallBack = callBack;
				horizontalService.loadedCallParam = callParam;
			};

			horizontalService.unregisterListLoaded = function unregisterHorizontalServiceListLoaded() {
				horizontalService.loadedCallBack = null;
				horizontalService.loadedCallParam = null;
			};

			horizontalService.loadColumns = function loadHorizontalServiceList() {
				return projectLocationMainService.getLocationStructure(schedulingMainService.getSelectedProjectId()).then(function (res) {
					horizontalService.tree = res.data;
					if (horizontalService.loadedCallBack) {
						horizontalService.loadedCallBack(horizontalService.loadedCallParam);
					}
				});
			};

			return horizontalService;
		};

		self.onLoaded = function () {
			if (self.usingController) {
				self.usingController.reinitializeMatrix();
			}
		};

		self.onLoadStarted = function onLoadStarted() {
			if (self.usingController) {
				self.usingController.setLoading();
			}
		};

		self.reload = function () {
			schedulingMainService.load();
		};

		self.connect = function connectController(contr) {
			self.usingController = contr;
			schedulingMainService.registerListLoaded(self.onLoaded);
			schedulingMainService.registerListLoadStarted(self.onLoadStarted);
		};

		self.disConnect = function disConnectController() {
			schedulingMainService.unregisterListLoaded(self.onLoaded);
			schedulingMainService.unregisterListLoadStarted(self.onLoadStarted);
			self.usingController = null;
		};
	}
})(angular);
