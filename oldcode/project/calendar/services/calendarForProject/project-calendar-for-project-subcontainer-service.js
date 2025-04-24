/**
 * Created by leo on 27.02.2019.
 */
(function (angular) {
	'use strict';
	var mainModule = angular.module('project.calendar');

	/**
	 * @ngdoc service
	 * @name projectCalendarForProjectSubContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('projectCalendarForProjectSubContainerService', ProjectCalendarForProjectSubContainerService);

	ProjectCalendarForProjectSubContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService', 'projectCalendarForProjectSubDataServiceFactory',
		'projectCalendarForProjectDataServiceFactory', 'projectCalendarValidationServiceFactory'];

	function ProjectCalendarForProjectSubContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService, projectCalendarForProjectSubDataServiceFactory,
		projectCalendarForProjectDataServiceFactory, projectCalendarValidationServiceFactory) {
		var self = this;

		var parentTemplUid = 'f3d6a5449d10497d9a09fbb7807260fb';
		var parentAllowCreateDelete = false;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, projectCalendarCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Project.Calendar');
			if (!modConf){
				modConf = platformModuleInitialConfigurationService.get('Project.Main');
			}

			var config = self.prepareConfig(containerUid, scope, modConf);
			var readOnly = scope.getContentValue('readOnly');
			makeColumnsReadOnly(config.layout, readOnly);
			projectCalendarCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, projectCalendarCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Project.Calendar');
			if (!modConf){
				modConf = platformModuleInitialConfigurationService.get('Project.Main');
			}

			var config = self.prepareConfig(containerUid, scope, modConf);
			projectCalendarCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			var parentTemplInfo = _.find(modConf.container, function(c) { return c.layout === parentTemplUid; });
			var allowCreateDelete = scope.getContentValue('allowCreateDelete');
			var parentSrv = projectCalendarForProjectDataServiceFactory.createDataService(parentTemplInfo, parentAllowCreateDelete);
			// var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function(c) { return c.layout === containerUid; });
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));

			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = projectCalendarForProjectSubDataServiceFactory.createDataService(templInfo, parentSrv, allowCreateDelete, conf.dataServiceName);
			conf.standardConfigurationService = self.createLayoutService(conf, templInfo, modCIS).service;
			conf.validationServiceName = projectCalendarValidationServiceFactory.createValidationService(templInfo, conf.dataServiceName);
			return self.addNavigatorFacility(templInfo.usedLayout, conf, modCIS);
			// return conf;
		};

		this.createLayoutService = function createLayoutService(conf, templInfo, modCIS) {
			var sc = {
				conf: self.createConfiguration(conf, templInfo, modCIS),
				service: {}
			};

			sc.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
				return sc.conf.detailLayout;
			};

			sc.service.getStandardConfigForListView = function getStandardConfigForListView() {
				return sc.conf.listLayout;
			};

			return sc;
		};

		this.createConfiguration = function createConfiguration(conf, templInfo, modCIS) {
			var confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			var detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			var gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			var layConf = {
				detailLayout: detailView,
				listLayout: gridView
			};

			return self.addNavigatorFacility(templInfo.layout, layConf, modCIS);
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				var navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (!_.isNil(navField)) {
					var fields = [];
					var field = null;
					fields = conf.detailLayout.rows || [];
					field = _.find(fields, function (f) {
						return f.model === navField.field;
					});
					if (field) {
						field.navigator = navField.navigator;
					}
					fields = conf.listLayout.columns || [];
					field = _.find(fields, function (f) {
						return f.field === navField.field;
					});
					if (field) {
						field.navigator = navField.navigator;
					}
				}
			}

			return conf;
		};

		function addAdditionalTranslations(layout) {
			_.forEach(layout.rows, function(row) {
				if(!row.label && !!row.label$tr$) {
					platformTranslateService.translateObject(row, ['label']);
				}
			});
		}

		function makeColumnsReadOnly(layout, readOnly) {
			if(readOnly) {
				_.forEach(layout.columns, function(column) {
					if(!_.isNil(column.editor)) {
						delete column.editor;
					}
					column.readonly = readOnly;
				});
			}
		}

		this.getDataServiceByUid = function getDataServiceByUid (uid, allowCreateDelete){
			var modConf = platformModuleInitialConfigurationService.get('Project.Calendar');
			if (!modConf){
				modConf = platformModuleInitialConfigurationService.get('Project.Main');
			}
			var parentTemplInfo = _.find(modConf.container, function(c) { return c.layout === parentTemplUid; });
			var parentSrv = projectCalendarForProjectDataServiceFactory.createDataService(parentTemplInfo, parentAllowCreateDelete);
			// var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function(c) { return c.layout === uid; });
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));

			conf.dataServiceName = projectCalendarForProjectSubDataServiceFactory.createDataService(templInfo, parentSrv, allowCreateDelete, conf.dataServiceName);
			return conf.dataServiceName;
		};
	}
})(angular);
