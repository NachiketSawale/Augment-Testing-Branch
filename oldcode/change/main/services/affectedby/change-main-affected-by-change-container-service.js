/**
 * Created by baf on 29.12.2016.
 */
(function (angular) {
	'use strict';
	var changeMainModule = angular.module('change.main');

	/**
	 * @ngdoc service
	 * @name changeMainAffectedByChangeContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('changeMainAffectedByChangeContainerService', ChangeMainAffectedByChangeContainerService);

	ChangeMainAffectedByChangeContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService',
		'projectCommonLayoutOverloadService', 'changeMainAffectedByChangeDataServiceFactory'];

	function ChangeMainAffectedByChangeContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService,
		projectCommonLayoutOverloadService, changeMainAffectedByChangeDataServiceFactory) {
		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Change.Main');

			var config = self.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Change.Main');

			var config = self.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			var templUid = scope.getContentValue('layout');
			var readOnly = scope.getContentValue('readOnly');
			var allowCreateDelete = scope.getContentValue('allowCreateDelete');
			var templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));
			changeColumnLookupOverload(templInfo, conf);
			makeColumnsReadOnly(conf.layout, readOnly);
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = changeMainAffectedByChangeDataServiceFactory.createDataService(templInfo, allowCreateDelete);
			conf.standardConfigurationService = getConfigurationService(conf);
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

		function takeOverLookupConfig(colDef, ovl) {
			colDef.editor = ovl.editor;
			colDef.editorOptions = ovl.editorOptions;
			colDef.formatter = ovl.formatter;
			colDef.formatterOptions = ovl.formatterOptions;
		}

		function changeColumnLookupOverload(templInfo, conf) {
			if(templInfo.dto === 'EstLineItemDto') {
				let ovl = null;
				let colDef = _.find(conf.layout.columns, function(col) {
					return col.id === 'psdactivityfk';
				});

				if(!_.isNil(colDef)) {
					ovl = projectCommonLayoutOverloadService.getScheduleActivityLookupOverload();
					takeOverLookupConfig(colDef, ovl.grid);
					colDef.navigator = {
						moduleName: 'scheduling.main',
						targetIdProperty: 'PsdActivityFk'
					};
				}

				colDef = _.find(conf.layout.columns, function(col) {
					return col.id === 'psdactivityschedule';
				});

				if(!_.isNil(colDef)) {
					ovl = projectCommonLayoutOverloadService.getScheduleLookupOverload();
					takeOverLookupConfig(colDef, ovl.grid);
					colDef.field = 'ScheduleFk';
				}
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
