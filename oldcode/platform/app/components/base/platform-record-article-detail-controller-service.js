/**
 * Created by leo on 05.06.2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'platform';

	/**
	 * @ngdoc controller
	 * @name PlatformRecordArticleDetailControllerService
	 * @function
	 *
	 * @description
	 * Controller for the detail view of record for type entities.
	 **/
	angular.module(moduleName).service('platformRecordArticleDetailControllerService', PlatformRecordArticleDetailControllerService);

	PlatformRecordArticleDetailControllerService.$inject = ['_', '$injector', 'platformDetailControllerService', 'platformTranslateService'];

	function PlatformRecordArticleDetailControllerService(_, $injector, platformDetailControllerService, platformTranslateService) {

		function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		}

		function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				var navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (navField) {
					var fields = [];
					var field = null;
					fields = conf.layout.rows || [];
					field = _.find(fields, function (f) {
						return f.model === navField.field;
					});
					if (field) {
						field.navigator = navField.navigator;
					}
				}
			}

			return conf;
		}

		function createLayoutService(conf) {
			var sc = {
				conf: createConfiguration(conf),
				service: {
					isDynamicReadonlyConfig: true,
					isBtnSettingHide: true
				}
			};

			sc.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
				return sc.conf.detailLayout;
			};

			sc.service.getStandardConfigForListView = function getStandardConfigForListView() {
				return sc.conf.listLayout;
			};

			return sc;
		}

		function createConfiguration(conf) {
			var confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			var detailView = _.cloneDeep(confServ.getStandardConfigForDetailView(conf.moduleName));
			var gridView = _.cloneDeep(confServ.getStandardConfigForListView(conf.moduleName));
			return {
				detailLayout: detailView,
				listLayout: gridView
			};
		}

		function addAdditionalTranslationsAndSetReadonly(layout) {
			if (layout) {
				_.forEach(layout.rows, function (row) {
					if (!row.label && !!row.label$tr$) {
						platformTranslateService.translateObject(row, ['label']);
					}
					row.readonly = true;
					row.required = false;
					// row.navigator = false;
				});
			}
		}

		function prepareConfig(configDefinition) {
			var conf = {};
			var modCIS = null;
			if (configDefinition.containerUid) {
				modCIS = getModuleInformationService(configDefinition.origModuleName);
				conf = _.cloneDeep(modCIS.getContainerInfoByGuid(configDefinition.containerUid));
			} else {
				conf.standardConfigurationService = configDefinition.configService;
			}
			conf.moduleName = configDefinition.moduleName; // special use in procurment.common
			conf.standardConfigurationService = createLayoutService(conf).service;
			addAdditionalTranslationsAndSetReadonly(conf.standardConfigurationService.getStandardConfigForDetailView());
			return addNavigatorFacility(configDefinition.containerUid, conf, modCIS);
		}

		this.getConfiguration = function getConfigurations(configDefinitions) {
			var configurations = [];

			configurations = configDefinitions.map(function (value) {
				var conf = prepareConfig(value);
				conf.options = value.options;
				return conf;
			});
			return configurations;
		};

		this.initController = function initController($scope, dependField, artField, configDefinitions, indexStandardConfig, dataService, parentDataService, translationService) {

			var configuration;
			var oldConfig = null;
			var oldItem = {};
			var dependantField = dependField;
			var articleField = artField;
			var configurations = this.getConfiguration(configDefinitions);

			function setSelection(e, item) {
				if (item && oldItem !== item) {
					if (dependantField) {
						if (oldItem[dependantField] !== item[dependantField]) {
							oldConfig = configuration;
							configuration = configurations[item[dependantField]];
						}
					}
					dataService.setSelected(item[articleField], configuration.options);
					oldItem = _.cloneDeep(item);
				} else if (!item) {
					dataService.setSelected(null, configuration.options);
					oldItem = {};
				}
			}

			function defineContainer() {
				if (configuration && !oldConfig || configuration && oldConfig && configuration.options.dto !== oldConfig.options.dto) {
					$scope.changeConfig(dataService, configuration.standardConfigurationService);
				}
			}

			function setNewConfiguration(e, value) {
				var item = parentDataService.getSelected();
				if (item) {
					if (item[dependantField] !== value) {
						configuration = configurations[value];
						$scope.changeConfig(dataService, configuration.standardConfigurationService);
					}
				}
			}

			function setNewArticle(e, value) {
				var item = parentDataService.getSelected();
				if (item) {
					if (value !== item[articleField]) {
						dataService.setSelected(value, configuration.options);
						oldItem = _.cloneDeep(item);
					}
				}
			}

			configuration = configurations[indexStandardConfig];
			var sel = parentDataService.getSelected();
			if (sel) {
				setSelection(null, sel);
			}

			platformDetailControllerService.initDetailController($scope, dataService, {}, configuration.standardConfigurationService, translationService);

			parentDataService.registerSelectionChanged(setSelection);
			if (parentDataService.registerArticleChanged) {
				parentDataService.registerArticleChanged(setNewArticle);
			}
			if (parentDataService.registerTypeChanged) {
				parentDataService.registerTypeChanged(setNewConfiguration);
			}
			dataService.registerSelectionChanged(defineContainer);

			$scope.$on('$destroy', function () {
				parentDataService.unregisterSelectionChanged(setSelection);
				if (parentDataService.unregisterArticleChanged) {
					parentDataService.unregisterArticleChanged(setNewArticle);
				}
				if (parentDataService.unregisterTypeChanged) {
					parentDataService.unregisterTypeChanged(setNewConfiguration);
				}
				dataService.unregisterSelectionChanged(defineContainer);
			});
		};
	}
})(angular);
