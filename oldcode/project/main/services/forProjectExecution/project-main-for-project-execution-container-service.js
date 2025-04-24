/**
 * Created by nit on 21.01.2018.
 */
(function (angular) {
	'use strict';
	var changeMainModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainForProjectExecutionContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('projectMainForProjectExecutionContainerService', ProjectMainForProjectExecutionContainerService);

	ProjectMainForProjectExecutionContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService',
		'projectMainForProjectExecutionDataServiceFactory', 'platformUIStandardExtentService'];

	function ProjectMainForProjectExecutionContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService,
		projectMainForProjectExecutionDataServiceFactory, platformUIStandardExtentService) {
		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, projectMainCIS, additionalConfig) {
			var modConf = platformModuleInitialConfigurationService.get('Project.Main');

			var config = self.prepareConfig(containerUid, scope, modConf, additionalConfig);
			projectMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, projectMainCIS, additionalConfig) {
			var modConf = platformModuleInitialConfigurationService.get('Project.Main');

			var config = self.prepareConfig(containerUid, scope, modConf, additionalConfig);
			projectMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf, additionalConfig) {
			var templUid = scope.getContentValue('layout');
			var readOnly = scope.getContentValue('readOnly');
			var allowCreateDelete = scope.getContentValue('allowCreateDelete');
			var templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));
			conf.standardConfigurationService = getConfigurationService(conf);
			if(additionalConfig){
				platformUIStandardExtentService.extend(conf.standardConfigurationService, additionalConfig);
			}
			makeColumnsReadOnly(conf.layout, readOnly);
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = projectMainForProjectExecutionDataServiceFactory.createDataService(templInfo, allowCreateDelete);
			conf.validationServiceName = {};
			return self.addNavigatorFacility(templInfo.usedLayout, conf, modCIS);
			// return conf;
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				var navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (!_.isNil(navField)) {
					var fields = [];
					var field = null;
					if(conf.ContainerType === 'Detail') {
						fields = conf.layout.rows || [];
						field = _.find(fields, function (f) {
							return f.model === navField.field;
						});
						if (field) {
							field.navigator = navField.navigator;
						}
					} else {
						fields = conf.layout.columns || [];
						field = _.find(fields, function (f) {
							return f.field === navField.field;
						});
						if (field) {
							field.navigator = navField.navigator;
						}
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

		function getConfigurationService(conf) {
			if(conf.ContainerType === 'Detail') {
				return {
					getStandardConfigForDetailView: function() {
						return conf.layout;
					}
				};
			}
			return {
				getStandardConfigForListView: function() {
					return conf.layout;
				}
			};
		}
	}
})(angular);
