/**
 * Created by baf on 21.01.2018.
 */
(function (angular) {
	'use strict';
	var platformModule = angular.module('platform');

	/**
	 * @ngdoc service
	 * @name projectMainForProjectExecutionContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	platformModule.service('platformDynamicContainerServiceFactory', PlatformDynamicContainerServiceFactory);

	PlatformDynamicContainerServiceFactory.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService'];

	function PlatformDynamicContainerServiceFactory(_, $injector, platformModuleInitialConfigurationService, platformTranslateService) {
		var self = this;

		this.getModuleInformationService = function getModuleInformationService(moduleName) {
			var cisName = _.camelCase(moduleName) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(moduleName, dynDataServiceFactory, containerUid, scope, moduleCIS) {
			var modConf = platformModuleInitialConfigurationService.get(moduleName);

			var config = self.prepareConfig(dynDataServiceFactory, containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(moduleName, dynDataServiceFactory, containerUid, scope, moduleCIS) {
			var modConf = platformModuleInitialConfigurationService.get(moduleName);

			var config = self.prepareConfig(dynDataServiceFactory, containerUid, scope, modConf);
			moduleCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(dynDataServiceFactory, containerUid, scope, modConf) {
			var templUid = scope.getContentValue('layout');
			var readOnly = scope.getContentValue('readOnly');
			var allowCreateDelete = scope.getContentValue('allowCreateDelete');
			var templInfo = _.find(modConf.container, function (c) {
				return c.layout === templUid;
			});
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));
			makePropertiesReadOnly(conf.layout, readOnly);
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = dynDataServiceFactory.createDataService(templInfo, allowCreateDelete);
			conf.standardConfigurationService = getConfigurationService(conf);
			conf.validationServiceName = {};
			return self.addNavigatorFacility(templInfo.usedLayout, conf, modCIS);
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				var navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (navField) {
					var fields = [];
					var field = null;
					if (conf.ContainerType === 'Detail') {
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
			_.forEach(layout.rows, function (row) {
				if (!row.label && !!row.label$tr$) {
					platformTranslateService.translateObject(row, ['label']);
				}
			});
		}

		function makePropertiesReadOnly(layout, readOnly) {
			if (readOnly) {
				if (_.isArray(layout.columns)) {
					_.forEach(layout.columns, function (column) {
						if (!_.isNil(column.editor)) {
							delete column.editor;
						}
						column.readonly = readOnly;
					});
				}
				if (_.isArray(layout.rows)) {
					_.forEach(layout.rows, function (row) {
						row.readonly = readOnly;
					});
				}
			}
		}

		function getConfigurationService(conf) {
			if (conf.ContainerType === 'Detail') {
				return {
					getStandardConfigForDetailView: function () {
						return conf.layout;
					}
				};
			}
			return {
				getStandardConfigForListView: function () {
					return conf.layout;
				}
			};
		}
	}
})(angular);