/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleParameterContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('estimate.main').service('estimateMainRuleParameterContainerService', EstimateMainRuleParameterContainerService);

	EstimateMainRuleParameterContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService',
		'basicsContrlcostcodesForControllingCostCodeDataServiceFactory', 'platformUIStandardExtentService'];

	function EstimateMainRuleParameterContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService,
		basicsContrlcostcodesForControllingCostCodeDataServiceFactory, platformUIStandardExtentService) {
		let self = this;


		this.getModuleInformationService = function getModuleInformationService(module) {
			let cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, containerInfoServ, additionalConfig) {
			let modConf = platformModuleInitialConfigurationService.get('Estimate.Main');

			let config = self.prepareConfig(containerUid, scope, modConf, additionalConfig);
			containerInfoServ.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, containerInfoServ, additionalConfig) {
			let modConf = platformModuleInitialConfigurationService.get('Estimate.Main');

			let config = self.prepareConfig(containerUid, scope, modConf, additionalConfig);
			containerInfoServ.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf, additionalConfig) {
			let templUid = scope.getContentValue('layout');
			// let allowCreateDelete = scope.getContentValue('allowCreateDelete');
			let templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			let modCIS = self.getModuleInformationService(templInfo.moduleName);

			let conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout));
			conf.standardConfigurationService = getConfigurationService(conf);
			if(additionalConfig){
				platformUIStandardExtentService.extend(conf.standardConfigurationService, additionalConfig);
			}
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = $injector.get('estimateMainRuleParameterDataServiceFactory');
			conf.validationServiceName = $injector.get('estimateMainRuleParameterValidationService');
			this.dataService = conf.dataServiceName;
			let infofield = _.find(conf.layout.columns, {id:'info'});
			infofield.editor = null;
			return self.addNavigatorFacility(templInfo.usedLayout, conf, modCIS);
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
})();