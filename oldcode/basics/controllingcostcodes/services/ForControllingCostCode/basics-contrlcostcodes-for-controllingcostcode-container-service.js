/**
 * Created by winjit.deshkar on 23.01.2023.
 */

(function (angular) {
	'use strict';
	let changeMainModule = angular.module('basics.controllingcostcodes');

	/**
	 * @ngdoc service
	 * @name basicsContrlCostcodesForControllingcostcodeContainerService
	 * @function
	 *
	 * @description
	 *
	 */

	changeMainModule.service('basicsContrlCostcodesForControllingcostcodeContainerService', BasicsContrlCostcodesForControllingcostcodeContainerService);

	BasicsContrlCostcodesForControllingcostcodeContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService',
		'basicsContrlcostcodesForControllingCostCodeDataServiceFactory', 'platformUIStandardExtentService'];

	function BasicsContrlCostcodesForControllingcostcodeContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService,
		basicsContrlcostcodesForControllingCostCodeDataServiceFactory, platformUIStandardExtentService) {
		let self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			let cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, containerInfoServ, additionalConfig) {
			let modConf = platformModuleInitialConfigurationService.get('Basics.ControllingCostCodes');

			let config = self.prepareConfig(containerUid, scope, modConf, additionalConfig);
			containerInfoServ.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, containerInfoServ, additionalConfig) {
			let modConf = platformModuleInitialConfigurationService.get('Basics.ControllingCostCodes');

			let config = self.prepareConfig(containerUid, scope, modConf, additionalConfig);
			containerInfoServ.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf, additionalConfig) {
			let templUid = scope.getContentValue('layout');
			let readOnly = scope.getContentValue('readOnly');
			let allowCreateDelete = scope.getContentValue('allowCreateDelete');
			let templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			let modCIS = self.getModuleInformationService(templInfo.moduleName);

			let conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));
			conf.standardConfigurationService = getConfigurationService(conf);
			if(additionalConfig){
				platformUIStandardExtentService.extend(conf.standardConfigurationService, additionalConfig);
			}
			makeColumnsReadOnly(conf.layout, readOnly);
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = basicsContrlcostcodesForControllingCostCodeDataServiceFactory.createDataService(templInfo, allowCreateDelete);
			conf.validationServiceName = {};
			return self.addNavigatorFacility(templInfo.usedLayout, conf, modCIS);
			// return conf;
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				let navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (!_.isNil(navField)) {
					let fields = [];
					let field = null;
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