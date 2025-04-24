(function () {
	'use strict';
	var modName = 'resource.common';
	var module = angular.module(modName);

	module.service('resourceCommonPlantJobLocationToolService', ResourceCommonPlantJobLocationToolService);

	ResourceCommonPlantJobLocationToolService.$inject = ['_', '$translate', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator',
		'resourceWotLookupConfigGenerator', '$injector'];

	function ResourceCommonPlantJobLocationToolService(_, $translate, platformModalFormConfigService, basicsLookupdataConfigGenerator,
		resourceWotLookupConfigGenerator, $injector) {
		var self = this;
		var configurations = {};

		function getValues(configuration) {
			return configuration.values;
		}

		function isForJob(configuration) {
			return !!configuration && !!configuration.options && configuration.options.isForJob === true;
		}

		function getPlantTypeConfig(order) {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.planttype', 'Description', {
				gid: 'baseGroup',
				rid: 'plantType',
				model: 'PlantType',
				label: $translate.instant('basics.customize.planttype'),
				label$tr$: 'basics.customize.planttype',
				sortOrder: order
			});
		}

		function getWorkOperationTypeConfig(order, forJob) {
			var base = {
				gid: 'baseGroup',
				rid: 'workOperationType',
				model: 'WorkOperationType',
				label: $translate.instant('resource.wot.entityWorkOperationType'),
				label$tr$: 'resource.wot.entityWorkOperationType',
				sortOrder: order,
				required: false
			};

			if (forJob) {
				return basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'resourceWorkOperationTypeLookupDataService',
					showClearButton: true
				},
				base);
			}

			var res = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true, 'plantId');

			base.directive = res.detail.directive;
			base.type = res.detail.type;
			base.options = res.detail.options;

			return base;
		}

		function getIncludeNegativeQuantitiesConfig(order) {
			return {
				gid: 'baseGroup',
				rid: 'includeNegativeQuantities',
				model: 'IncludeNegativeQuantities',
				label: $translate.instant('resource.common.includeNegativeQuantities'),
				label$tr$: 'resource.common.includeNegativeQuantities',
				type: 'boolean',
				sortOrder: order
			};
		}

		function getToDateConfig(order) {
			return {
				gid: 'baseGroup',
				rid: 'toDate',
				model: 'ToDate',
				label: $translate.instant('resource.equipment.toDate'),
				label$tr$: 'resource.equipment.toDate',
				type: 'dateutc',
				sortOrder: order
			};
		}

		function getFromDateConfig(order) {
			return {
				gid: 'baseGroup',
				rid: 'fromDate',
				model: 'FromDate',
				label: $translate.instant('resource.equipment.fromDate'),
				label$tr$: 'resource.equipment.fromDate',
				type: 'dateutc',
				sortOrder: order
			};
		}

		function createModalConfiguration(config) {
			var conf = {
				dialogOptions: {height: '500px', width: '650px'},
				title: $translate.instant(config.configuration.title),
				dataItem: getValues(config),
				formConfiguration: {
					fid: config.configuration.name,
					version: '1.0.0',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: []
					}],
					rows: []
				},
				handleOK: function handleOK() {
					return config.configuration.service.loadSubItemList();
				}
			};

			var forJob = isForJob(config.configuration);
			var order = 1;
			if (forJob) {
				conf.formConfiguration.rows.push(getPlantTypeConfig(order));
				order = order + 1;
			}
			conf.formConfiguration.rows.push(getWorkOperationTypeConfig(order, forJob));
			order = order + 1;
			conf.formConfiguration.rows.push(getFromDateConfig(order));
			order = order + 1;
			conf.formConfiguration.rows.push(getToDateConfig(order));
			order = order + 1;
			conf.formConfiguration.rows.push(getIncludeNegativeQuantitiesConfig(order));
			// order = order +1;

			return conf;
		}


		function isForJobCard(configuration){
			return !!configuration.options.isForJobCard;
		}

		this.initializeReadData = function initializeReadData(readData, configuration, selected) {

			/**
			 * #defect(103474): the service is running before the controller could set the configuration object
			 */
			var isEmptyConfObject = _.isEmpty(configurations);
			if (isEmptyConfObject) {
				var filterConfig = $injector.get('resourceEquipmentPlantLocationDataService').getConfiguration();
				this.getFilterConfig(filterConfig);
			}
			var values = getValues(configurations[configuration.name]);

			if (isForJob(configuration)) {
				readData.Job = selected.Id;
				readData.PlantType = values.plantType;
			} else if(isForJobCard(configuration)) {
				readData.Plant = selected.PlantFk || -1;
			}else{
				readData.Plant = selected.Id;
			}

			readData.WorkOperationType = values.WorkOperationType;
			readData.FromDate = values.FromDate;
			readData.ToDate = values.ToDate;
			readData.IncludeNegativeQuantities = values.IncludeNegativeQuantities;

		};

		function showFilterDialog(configuration) {
			var modalConfiguration = createModalConfiguration(configuration);

			platformModalFormConfigService.showDialog(modalConfiguration);
		}

		function getFilterData(conf) {
			return {
				isForPlant: !!conf.isForPlant,
				isForJobCard: !!conf.isForJobCard,
				isForJob: !!conf.isForJob,
				PlantType: null,
				WorkOperationType: null,
				IncludeNegativeQuantities: true,
				FromDate: null,
				ToDate: null
			};
		}

		this.showFilterSettings = function showFilterSettings(usageName) {
			var conf = configurations[usageName];

			if (conf.values.isForPlant && !!conf.configuration.parentService) {
				var sel = conf.configuration.parentService.getSelected();
				if (!_.isNil(sel)) {
					conf.values.plantId = sel.Id;
				}
			}
			showFilterDialog(conf);
		};

		this.getFilterConfig = function getFilterConfig(usage) {
			if (_.isNil(configurations[usage.name])) {
				configurations[usage.name] = {
					configuration: usage,
					values: getFilterData(usage.options)
				};
			}

			return {
				id: 'showToDateSettings',
				caption: $translate.instant(usage.title),
				type: 'item',
				iconClass: 'tlb-icons ico-filter',
				fn: function showPlantLocationFilterSettings() {
					self.showFilterSettings(usage.name);
				}
			};
		};
	}
})();
