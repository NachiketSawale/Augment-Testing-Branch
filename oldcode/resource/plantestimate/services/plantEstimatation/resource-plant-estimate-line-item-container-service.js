/**
 * $Id: resource-equipment-plant-estimation-line-item-container-service.js 21615 2021-12-08 15:47:48Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const plantEstimateModule = angular.module('resource.plantestimate');

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateLineItemContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	plantEstimateModule.service('resourcePlantEstimateLineItemContainerService', ResourcePlantEstimateLineItemContainerService);

	ResourcePlantEstimateLineItemContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'platformTranslateService',
		'projectCommonLayoutOverloadService', 'resourcePlantEstimateLineItemDataService', 'resourcePlantEstimateAssemblyValidationService'];

	function ResourcePlantEstimateLineItemContainerService(_, $injector, platformModuleInitialConfigurationService, platformTranslateService,
		projectCommonLayoutOverloadService, resourcePlantEstimateLineItemDataService, resourcePlantEstimateAssemblyValidationService) {
		let self = this;

		let containerUid;

		this.getModuleInformationService = function getModuleInformationService(module) {
			let cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, resourcePlantMainCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Plantestimate');

			let config = self.prepareConfig(containerUid, scope, modConf);
			resourcePlantMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, resourcePlantMainCIS) {
			let modConf = platformModuleInitialConfigurationService.get('Resource.Plantestimate');

			let config = self.prepareConfig(containerUid, scope, modConf);
			resourcePlantMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			let options = {isPlantAssembly:true,
				assemblyConfigExtendServiceName:'resourcePlantEstimateConfigurationExtendService',
				assemblyResourceDataServiceName: 'resourcePlantEstimateResourceDataService',
				assemblyDataServiceName:'resourcePlantEstimateLineItemDataService',
				assemblyValidationServiceName:'resourcePlantEstimateAssemblyValidationService',
				assemblyResourceDynamicConfigServiceName:'resourcePlantEstimateResourceDynamicConfigurationService'};
			let templUid = scope.getContentValue('layout');
			let templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });
			let modCIS = self.getModuleInformationService(templInfo.moduleName);

			let conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templInfo.usedLayout, options));
			changeColumnLookupOverload(templInfo, conf);
			addAdditionalTranslations(conf.layout);
			conf.dataServiceName = resourcePlantEstimateLineItemDataService;
			conf.standardConfigurationService = getConfigurationService(conf);
			conf.validationServiceName = resourcePlantEstimateAssemblyValidationService;
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

		this.getContainerUid = function (){
			return containerUid;
		};

		function addAdditionalTranslations(layout) {
			_.forEach(layout.rows, function(row) {
				if(!row.label && !!row.label$tr$) {
					platformTranslateService.translateObject(row, ['label']);
				}
			});
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
