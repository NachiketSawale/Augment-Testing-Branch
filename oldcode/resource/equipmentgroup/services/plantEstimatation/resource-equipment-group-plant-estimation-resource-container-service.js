/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const plantGroupModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantEstimationResourceContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	plantGroupModule.service('resourceEquipmentGroupPlantEstimationResourceContainerService', ResourceEquipmentGroupPlantEstimationResourceContainerService);

	ResourceEquipmentGroupPlantEstimationResourceContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService',
		'projectCommonLayoutOverloadService', 'resourceEquipmentGroupPlantEstimationResourceDataService', 'estimateAssembliesResourceValidationService'];

	function ResourceEquipmentGroupPlantEstimationResourceContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService,
		projectCommonLayoutOverloadService, resourceEquipmentGroupPlantEstimationResourceDataService, estimateAssembliesResourceValidationService) {
		let self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			let cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, plantGroupCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.EquipmentGroup');

			let config = self.prepareConfig(containerUid, scope, modConf);
			plantGroupCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, plantGroupCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.EquipmentGroup');

			let config = self.prepareConfig(containerUid, scope, modConf);
			plantGroupCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			let options = {isPlantAssembly:true,
				assemblyResourceDynamicConfigServiceName:'resourceEquipmentGroupResourceDynamicConfigurationService',
				assemblyResourceDataServiceName:'resourceEquipmentGroupPlantEstimationResourceDataService',
				assemblyResourceValidationServiceName:'resourceEquipmentGroupEstimateResourceValidationService'};

			let templUid = scope.getContentValue('layout');
			let templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			let modCIS = self.getModuleInformationService(templInfo.moduleName);
			let conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout, options));
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = resourceEquipmentGroupPlantEstimationResourceDataService;
			conf.standardConfigurationService = getConfigurationService(conf);
			conf.validationServiceName = estimateAssembliesResourceValidationService;
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
})(angular);
