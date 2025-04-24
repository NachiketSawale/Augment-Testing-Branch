/**
 * Created by baf on 29.12.2016.
 */
(function (angular) {
	'use strict';
	var changeMainModule = angular.module('object.main');

	/**
	 * @ngdoc service
	 * @name objectMainAffectedByObjectContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('objectMainAffectedByObjectContainerService', ObjectMainAffectedByObjectContainerService);

    ObjectMainAffectedByObjectContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService', 'objectMainAffectedByObjectDataServiceFactory'];

	function ObjectMainAffectedByObjectContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService, objectMainAffectedByObjectDataServiceFactory) {
		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Object.Main');

			var config = self.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Object.Main');

			var config = self.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = objectMainAffectedByObjectDataServiceFactory.createDataService(templInfo);
			conf.standardConfigurationService = getConfigurationService(conf);
			conf.validationServiceName = {};
			return self.addNavigatorFacility(templInfo.usedLayout, conf, modCIS);
			// return conf;
		};

		this.getService = function getService(templUid){
       //     var templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				var navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (navField !== null) {
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