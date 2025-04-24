/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'project.material';

	/**
	 * @ngdoc controller
	 * @name projectMaterialListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of material
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMaterialListController', ProjectMaterialListController);

	ProjectMaterialListController.$inject = ['$scope','$translate', '$injector', 'projectMaterialMainService', 'platformContainerControllerService','projectCommonFilterButtonService','mainViewService','platformGridAPI'];
	function ProjectMaterialListController($scope, $translate,$injector, projectMaterialMainService, platformContainerControllerService,projectCommonFilterButtonService,mainViewService,platformGridAPI) {
		platformContainerControllerService.initController($scope, moduleName, '486bac686fa942449b4effcb8b2de308');

		function refreshLookup(){
			let jobLookupServ = $injector.get('logisticJobLookupByProjectDataService');
			if(jobLookupServ){
				jobLookupServ.resetCache({lookupType:'logisticJobLookupByProjectDataService'});
			}
		}

		function updateTools(){
			onSelectedRowsChanged();
			if($scope.tools){
				$scope.tools.update();
				platformGridAPI.grids.refresh ($scope.gridId);

			}
		}


		function addFilterBtnTools(){
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
							projectMaterialMainService.setSelectedJobsIds(jobIds);
							projectMaterialMainService.setInitFilterMenuFlag(false);
							projectMaterialMainService.setIsManuallyFilter(true);
							projectMaterialMainService.load();
							mainViewService.customData($scope.gridId, 'JobMenuID', item);
						}
					};
					jobFilterMenu.list.items.push(configTool);
				});
			}


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
								projectMaterialMainService.setSelectedJobsIds (jobIds);
								projectMaterialMainService.setInitFilterMenuFlag(false);
								projectMaterialMainService.setIsManuallyFilter(true);
								projectMaterialMainService.load ();
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
						projectMaterialMainService.setSelectedJobsIds (jobIds);
						projectMaterialMainService.setInitFilterMenuFlag(false);
						projectMaterialMainService.setIsManuallyFilter(true);
						projectMaterialMainService.load ();
						mainViewService.customData ($scope.gridId, 'GroupConfigID', item);
					});
				}
			};
			versionEstFilterMenu.list.items.push(activeEstHeaderMenu);

			$scope.addTools(tools);
		}


		function onSelectedRowsChanged(){
			_.forEach($scope.tools.items,function (d) {
				if(d.id ==='t14'){
					d.disabled = function () {
						let selectedItem = projectMaterialMainService.getSelected();
						return selectedItem && selectedItem.readOnlyByJob;
					};
				}
			});
		}

		projectMaterialMainService.registerListLoaded(refreshLookup);
		projectMaterialMainService.registerSelectionChanged(updateTools);

		projectMaterialMainService.onToolsUpdated.register(addFilterBtnTools);

		if(!projectMaterialMainService.getShowFilterBtn()) {
			projectMaterialMainService.onToolsUpdated.fire ();
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
				projectMaterialMainService.setInitFilterMenuFlag(true);
				projectMaterialMainService.setIsManuallyFilter(false);
			}
		}

		$injector.get('projectMainService').registerSelectionChanged(initDefaultData);

		projectMaterialMainService.hightLightNGetJob.register(hightLightNGetJob);

		function onCellChange(e, arg){
			var column = arg.grid.getColumns()[arg.cell];
			var item = arg.item;

			if(column && column.id === 'estimateprice') {
				projectMaterialMainService.updateEstimatePrice();
			}
		}


		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			projectMaterialMainService.unregisterListLoaded(refreshLookup);
			projectMaterialMainService.unregisterSelectionChanged(updateTools);
			projectMaterialMainService.onToolsUpdated.unregister(addFilterBtnTools);
			projectMaterialMainService.hightLightNGetJob.unregister(hightLightNGetJob);
			$injector.get('projectMainService').unregisterSelectionChanged(initDefaultData);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);
