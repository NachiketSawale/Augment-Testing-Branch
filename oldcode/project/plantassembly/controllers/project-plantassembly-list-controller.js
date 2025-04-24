/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'project.plantassembly';

	/**
     * @ngdoc controller
     * @name projectPlantAssemblyListController
     * @function
     *
     * @description
     * Controller for the list view of project assembly
     **/
	angular.module(moduleName).controller('projectPlantAssemblyListController', projectPlantAssemblyListController);

	projectPlantAssemblyListController.$inject = ['$scope', '$translate','$injector','platformContainerControllerService','mainViewService','projectPlantAssemblyMainService','projectCommonFilterButtonService','platformGridAPI','projectPlantAssemblyValidationService'];
	function projectPlantAssemblyListController($scope,$translate, $injector,platformContainerControllerService,mainViewService, projectPlantAssemblyMainService,projectCommonFilterButtonService,platformGridAPI,projectPlantAssemblyValidationService) {
		platformContainerControllerService.initController($scope, moduleName, 'c163031647d6459288c5c43ed46cf6e8',projectPlantAssemblyValidationService);

		projectPlantAssemblyMainService.IsActived = true;

		function addFilterBtnTools(){
			projectPlantAssemblyMainService.setShowFilterBtn(true);
			let project = $injector.get('projectMainService').getSelected ();

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
						value: false,
						caption: d.Code,
						fn: function (item) {
							let jobFilterBtn= _.find( $scope.tools.items,{'id':'jobFilter'});
							let jobIds = [];
							if(jobFilterBtn.list && jobFilterBtn.list.items){
								let selectedJobs = _.filter(jobFilterBtn.list.items,{'value':true});
								jobIds =_.map(selectedJobs,'id');
							}
							projectPlantAssemblyMainService.setSelectedJobsIds(jobIds);
							projectPlantAssemblyMainService.setInitFilterMenuFlag(false);
							projectPlantAssemblyMainService.setIsManuallyFilter(true);
							projectPlantAssemblyMainService.load();
							mainViewService.customData($scope.gridId, 'JobMenuID', item);
						}
					};
					jobFilterMenu.list.items.push(configTool);
				});
			}

			let configTool = {
				id: 'BaseAssembly',
				type: 'check',
				value:false,
				caption: $translate.instant('cloud.common.baseAssembly'),
				fn: function (item) {
					if(!project){
						return;
					}
					let jobFilterBtn = _.find( $scope.tools.items,{'id':'jobFilter'});
					let jobIds = [];
					if(jobFilterBtn.list && jobFilterBtn.list.items) {
						let selectedJobs = _.filter (jobFilterBtn.list.items, {'value': true});
						jobIds = _.map (selectedJobs, 'id');
					}
					projectPlantAssemblyMainService.setSelectedJobsIds (jobIds);
					projectPlantAssemblyMainService.setInitFilterMenuFlag(false);
					projectPlantAssemblyMainService.setIsManuallyFilter(true);
					projectPlantAssemblyMainService.load();
					mainViewService.customData($scope.gridId, 'JobMenuID', item);
				}
			};
			jobFilterMenu.list.items.push(configTool);

			// version est filter button
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
						value:false,
						estHeaderIds: ids,
						jobIds :_.map(d,'LgmJobFk'),
						caption: d[0].VersionNo,
						fn: function (item, args) {
							if(!project){
								return;
							}
							projectCommonFilterButtonService.getJobIdsByEstHeader($scope,args,'versionHeader').then(function (data) {

								let jobIds = projectCommonFilterButtonService.hightLightNGetJob ($scope, data.highlightJobIds, data.cancelJobFkIds);
								projectPlantAssemblyMainService.setSelectedJobsIds (jobIds);
								projectPlantAssemblyMainService.setInitFilterMenuFlag(false);
								projectPlantAssemblyMainService.setIsManuallyFilter(true);
								projectPlantAssemblyMainService.load ();
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
				caption: $translate.instant ('cloud.common.currentEstimates'),
				fn: function (item, args) {

					if (!project) {
						return;
					}

					projectCommonFilterButtonService.getJobIdsByEstHeader($scope,args,'activeEstHeaderMenu').then(function (data) {
						let jobIds = projectCommonFilterButtonService.hightLightNGetJob ($scope, data.highlightJobIds, data.cancelJobFkIds);
						projectPlantAssemblyMainService.setSelectedJobsIds (jobIds);
						projectPlantAssemblyMainService.setInitFilterMenuFlag(false);
						projectPlantAssemblyMainService.setIsManuallyFilter(true);

						projectPlantAssemblyMainService.load ();
						mainViewService.customData ($scope.gridId, 'GroupConfigID', item);
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
						let selectedItem = projectPlantAssemblyMainService.getSelected();
						return selectedItem && selectedItem.readOnlyByJob;
					};
				}
			});
			$scope.tools.update ();
			platformGridAPI.grids.refresh ($scope.gridId);
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		projectPlantAssemblyMainService.onToolsUpdated.register(addFilterBtnTools);

		if(!projectPlantAssemblyMainService.getShowFilterBtn()) {
			projectPlantAssemblyMainService.onToolsUpdated.fire ();
		}

		function hightLightNGetJob(highlightJobIds) {
			highlightJobIds.push('BaseAssembly');
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
				projectPlantAssemblyMainService.setInitFilterMenuFlag(true);
				projectPlantAssemblyMainService.setIsManuallyFilter(false);
			}
		}
		projectPlantAssemblyMainService.hightLightNGetJob.register(hightLightNGetJob);

		$injector.get('projectMainService').registerSelectionChanged(initDefaultData);

		let dynamicUserDefinedColumnService = $injector.get('projectPlantAssemblyDynamicUserDefinedColumnService');
		dynamicUserDefinedColumnService.initReloadFn();

		function onInitialized() {
			dynamicUserDefinedColumnService.loadDynamicColumns();
		}

		platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			delete projectPlantAssemblyMainService.IsActived;
			projectPlantAssemblyMainService.onToolsUpdated.unregister(addFilterBtnTools);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			projectPlantAssemblyMainService.hightLightNGetJob.unregister(hightLightNGetJob);
			$injector.get('projectMainService').unregisterSelectionChanged(initDefaultData);

			platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			dynamicUserDefinedColumnService.onDestroy();
		});
	}
})(angular);