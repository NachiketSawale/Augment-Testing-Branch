/**
 * Created by baf on 26.10.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name logisticJobPlantAllocationFilterConfigurationService
	 * @function
	 *
	 * @description
	 * The basicsCustomizeStatusTransitionService shows the transition dialog for a state entity type
	 */

	angular.module(moduleName).service('logisticJobPlantAllocationFilterConfigurationService', LogisticJobPlantAllocationFilterConfigurationService);

	LogisticJobPlantAllocationFilterConfigurationService.$inject = ['_','$translate', 'platformGridAPI', 'platformModalFormConfigService',
		'platformTranslateService', 'logisticJobPlantAllocationFilterItemDataService'];

	function LogisticJobPlantAllocationFilterConfigurationService(_, $translate, platformGridAPI, platformModalFormConfigService,
		platformTranslateService, logisticJobPlantAllocationFilterItemDataService) {

		let self = this;

		this.editJobPlantAllocationFilterConfiguration = function editJobPlantAllocationFilterConfiguration(config) {
			// logisticJobPlantAllocationFilterItemDataService.displayFilterItems(config.FilterItems);
			return self.showJobPlantAllocationFilterConfiguration(config);
		};

		this.showJobPlantAllocationFilterConfiguration = function showJobPlantAllocationFilterConfiguration(config) {
			var formConfig = self.prepareConfig();
			return platformModalFormConfigService.showDialog({
				title: $translate.instant('basics.customize.projectcatalogconfiguration'),
				dataItem: config,
				dialogOptions: {
					width: '50%'
				},
				formConfiguration: formConfig,
				resizeable: true,
				handleOK: function handleOK() {
					platformGridAPI.grids.commitAllEdits();
					config.FilterItems = logisticJobPlantAllocationFilterItemDataService.provideFilterItems();
					self.modified = 0;
				},
				handleCancel: function handleCancel() {
					self.modified = 0;
				}
			});
		};

		function getGroups() {
			return [{
				gid: 'configuration',
				header: 'Configuration',
				header$tr$: 'basics.customize.configurationfk',
				isOpen: true,
				visible: true,
				sortOrder: 1
			},{
				gid: 'filteritemgroup',
				header: 'Filter Plant Group',
				header$tr$: 'logistic.job.filteritemgroup',
				isOpen: true,
				visible: true,
				sortOrder: 2
			},{
				gid: 'filteritemtype',
				header: 'Filter Plant Type',
				header$tr$: 'logistic.job.filteritemtype',
				isOpen: true,
				visible: true,
				sortOrder: 3
			},{
				gid: 'filteritemkind',
				header: 'Filter Plant Kind',
				header$tr$: 'logistic.job.filteritemkind',
				isOpen: true,
				visible: true,
				sortOrder: 4
			},{
				gid: 'filteritemwot',
				header: 'Filter Work Operation Type',
				header$tr$: 'logistic.job.filteritemwot',
				isOpen: true,
				visible: true,
				sortOrder: 5
			}];
		}

		function getRows() {
			return [{
				gid: 'configuration',
				rid: 'applyfilter',
				label$tr$: 'logistic.job.applyfilter',
				type: 'boolean',
				model: 'ApplyFilter',
				readonly: false,
				sortOrder: 1
			}, {
				gid: 'configuration',
				rid: 'searchpattern',
				label$tr$: 'logistic.job.plantSearchPattern',
				type: 'description',
				model: 'SearchPattern',
				readonly: false,
				sortOrder: 2
			}, {
				gid: 'filteritemgroup',
				rid: 'filteritemgroup',
				type: 'directive',
				directive: 'logistic-job-plant-allocation-filter-item-group-grid-directive',
				readonly: false,
				maxlength: 2000,
				rows: 10,
				visible: true,
				sortOrder: 1
			}, {
				gid: 'filteritemtype',
				rid: 'filteritemtype',
				type: 'directive',
				directive: 'logistic-job-plant-allocation-filter-item-type-grid-directive',
				readonly: false,
				maxlength: 2000,
				rows: 10,
				visible: true,
				sortOrder: 1
			}, {
				gid: 'filteritemkind',
				rid: 'filteritemkind',
				type: 'directive',
				directive: 'logistic-job-plant-allocation-filter-item-kind-grid-directive',
				readonly: false,
				maxlength: 2000,
				rows: 10,
				visible: true,
				sortOrder: 1
			}, {
				gid: 'filteritemwot',
				rid: 'filteritemwot',
				type: 'directive',
				directive: 'logistic-job-plant-allocation-filter-item-wot-grid-directive',
				readonly: false,
				maxlength: 2000,
				rows: 10,
				visible: true,
				sortOrder: 1
			}];
		}

		this.prepareConfig = function prepareConfig() {
			var formConfig = {
				fid: 'logistic.job.plantallocationfilterconfig',
				version: '1.0.0',
				showGrouping: true,
				change: 'change',
				groups: getGroups(),
				rows: getRows()
			};

			platformTranslateService.translateFormConfig(formConfig);

			return formConfig;
		};
	}
})(angular);
