/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _  globals*/
	'use strict';

	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc controller
	 * @name projectCostCodesJobRateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of costcodes job rate.
	 **/
	angular.module(moduleName).controller('projectCostCodesJobRateListController', ProjectCostCodesJobRateListController);

	ProjectCostCodesJobRateListController.$inject = ['$scope','$translate', '$injector', 'platformGridAPI', 'platformContainerControllerService','projectCostCodesJobRateMainService','mainViewService','projectCommonFilterButtonService'];
	function ProjectCostCodesJobRateListController($scope,$translate, $injector, platformGridAPI, platformContainerControllerService,projectCostCodesJobRateMainService,mainViewService,projectCommonFilterButtonService) {

		let projectCostCodesJobRateDynamicConfigurationService = $injector.get('projectCostCodesJobRateDynamicConfigurationService');
		function setDynamicColumnsLayoutToGrid(){
			projectCostCodesJobRateDynamicConfigurationService.applyToScope($scope);
		}
		projectCostCodesJobRateDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

		let projectCostCodesJobRateDynamicUserDefinedColumnService = $injector.get('projectCostCodesJobRateDynamicUserDefinedColumnService');
		projectCostCodesJobRateDynamicUserDefinedColumnService.loadDynamicColumns();
		projectCostCodesJobRateDynamicUserDefinedColumnService.initReloadFn();

		function onInitialized() {
			projectCostCodesJobRateDynamicUserDefinedColumnService.loadDynamicColumns();
		}

		platformContainerControllerService.initController($scope, moduleName, 'efbb019d03b541538ff24ef67dc683dc');

		platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);



		function addFilterBtnTools(){
			let tools = angular.copy(projectCommonFilterButtonService.getFilterToolbar());
			let jobFilterMenu = _.find(tools, function (tool) {
				return tool.id === 'jobFilter';
			});

			jobFilterMenu.list.items =[];
			let jobs = projectCommonFilterButtonService.getJobs();
			if(jobs && jobs.length){
				_.each(jobs,function (d) {
					let configTool = {
						id: d.Id,
						type: 'check',
						value:false,
						caption: d.Code,
						fn: function (item,args) {
							let selectedPrjCostCode = $injector.get('projectCostCodesMainService').getSelected();
							if(!selectedPrjCostCode){
								return;
							}

							let jobFilterBtn= _.find( $scope.tools.items,{'id':'jobFilter'});
							let jobIds = [];
							if(jobFilterBtn.list && jobFilterBtn.list.items) {
								let selectedJobs = _.filter (jobFilterBtn.list.items, {'value': true});
								jobIds = _.map(selectedJobs, 'id');
							}

							projectCostCodesJobRateMainService.setSelectedJobsIds(jobIds);
							projectCostCodesJobRateMainService.setInitFilterMenuFlag(false);
							projectCostCodesJobRateMainService.setIsManuallyFilter(true);

							projectCostCodesJobRateMainService.load();
							mainViewService.customData($scope.gridId, 'JobMenuID', item);
						}
					};
					jobFilterMenu.list.items.push(configTool);
				});
			}


			//version est filter button
			let versionEstFilterMenu = _.find(tools, function (tool) {
				return tool.id === 'versionFilter';
			});
			versionEstFilterMenu.list.items =[];

			let versionEstHeader = projectCommonFilterButtonService.getVersionEstHeader();
			if(versionEstHeader && versionEstHeader.length){

				versionEstHeader = _.groupBy(versionEstHeader,'VersionNo');

				_.each(versionEstHeader,function (d) {
					let ids =  d.length>1 ? _.map(d,'Id'):[d[0].Id];
					let configTool = {
						id: d[0].Id,
						type: 'check',
						value: false,
						estHeaderIds: ids,
						jobIds :_.map(d,'LgmJobFk'),
						caption: d[0].VersionNo,
						fn: function (item, args) {

							let selectedPrjCostCode = $injector.get('projectCostCodesMainService').getSelected();
							if(!selectedPrjCostCode){
								return;
							}
							projectCommonFilterButtonService.getJobIdsByEstHeader($scope,args,'versionHeader').then(function (data) {

								let jobIds = projectCommonFilterButtonService.hightLightNGetJob ($scope,data.highlightJobIds,data.cancelJobFkIds);
								projectCostCodesJobRateMainService.setSelectedJobsIds (jobIds);
								projectCostCodesJobRateMainService.setInitFilterMenuFlag(false);
								projectCostCodesJobRateMainService.setIsManuallyFilter(true);

								projectCostCodesJobRateMainService.load ();
								mainViewService.customData ($scope.gridId, 'VersionEstMenuID', item);
							});
						}
					};
					versionEstFilterMenu.list.items.push(configTool);
				});
			}


			let activeEstHeaderMenu = {
				id: 'activeEstHeaderMenu',
				type: 'check',
				value: false,
				caption: $translate.instant('cloud.common.currentEstimates'),
				fn: function (item,args) {

					let selectedPrjCostCode = $injector.get('projectCostCodesMainService').getSelected();
					if(!selectedPrjCostCode){
						return;
					}

					projectCommonFilterButtonService.getJobIdsByEstHeader($scope,args,'activeEstHeaderMenu').then(function (data) {
						let jobIds = projectCommonFilterButtonService.hightLightNGetJob ($scope,data.highlightJobIds,data.cancelJobFkIds);
						projectCostCodesJobRateMainService.setSelectedJobsIds (jobIds);
						projectCostCodesJobRateMainService.setInitFilterMenuFlag(false);

						projectCostCodesJobRateMainService.setIsManuallyFilter(true);
						projectCostCodesJobRateMainService.load();
						mainViewService.customData ($scope.gridId,'GroupConfigID', item);
					});
				}
			};
			versionEstFilterMenu.list.items.push(activeEstHeaderMenu);

			$scope.addTools(tools);
		}

		function onSelectedRowsChanged(){
			_.forEach($scope.tools.items,function (d) {
				if(d.id ==='delete' || d.id ==='t14'){
					d.disabled = function () {
						let selectedItem = projectCostCodesJobRateMainService.getSelectedEntities()[0];
						return selectedItem && selectedItem.readOnlyByJob;
					};
				}
			});

			$scope.tools.update();
			platformGridAPI.grids.refresh ($scope.gridId);
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		projectCostCodesJobRateMainService.onToolsUpdated.register(addFilterBtnTools);

		if(!projectCostCodesJobRateMainService.getShowFilterBtn()) {
			projectCostCodesJobRateMainService.onToolsUpdated.fire();
		}

		function hightLightNGetJob(highlightJobIds) {
			projectCommonFilterButtonService.hightLightNGetJob ($scope, highlightJobIds, []);

			_.forEach($scope.tools.items,function (d) {
				if(d.id ==='versionFilter'){
					_.forEach(d.list.items,function (f) {
						if(f.id ==='activeEstHeaderMenu'){
							f.value = true;
						}
					});
				}
			});

			mainViewService.customData ($scope.gridId, 'VersionEstMenuID', 'activeEstHeaderMenu');
		}

		function initDefaultData() {
			if (platformGridAPI.grids.exist ($scope.gridId)) {
				projectCostCodesJobRateMainService.setInitFilterMenuFlag(true);
				projectCostCodesJobRateMainService.setIsManuallyFilter(false);
			}
		}

		projectCostCodesJobRateMainService.hightLightNGetJob.register(hightLightNGetJob);
		$injector.get('projectCostCodesMainService').registerSelectionChanged(initDefaultData);
		$injector.get('projectMainService').registerRefreshRequested(projectCostCodesJobRateMainService.clearCostCodeJobRateCacheData);
		$scope.$on('$destroy', function () {
			projectCostCodesJobRateDynamicUserDefinedColumnService.onDestroy();
			platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			projectCostCodesJobRateMainService.onToolsUpdated.unregister(addFilterBtnTools);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			projectCostCodesJobRateMainService.hightLightNGetJob.unregister(hightLightNGetJob);
			$injector.get('projectCostCodesMainService').unregisterSelectionChanged(initDefaultData);
			$injector.get('projectMainService').unregisterRefreshRequested(projectCostCodesJobRateMainService.clearCostCodeJobRateCacheData);
		});
	}

})(angular);