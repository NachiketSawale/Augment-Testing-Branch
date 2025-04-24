
(function (angular) {
	/* global angular  _*/

	'use strict';

	var moduleName = 'project.assembly';

	/**
	 * @ngdoc controller
	 * @name projectAssemblyListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project assembly
	 **/
	angular.module(moduleName).controller('projectAssemblyListController', ProjectAssemblyListController);

	ProjectAssemblyListController.$inject = ['$scope', '$translate','$injector','mainViewService', 'estimateAssembliesAssembliesListControllerFactory', 'projectAssemblyMainService', 'projectAssemblyValidationService', 'projectAssemblyResourceService', 'projectAssemblyFilterService','projectCommonFilterButtonService','platformGridAPI'];
	function ProjectAssemblyListController($scope,$translate, $injector,mainViewService, estimateAssembliesAssembliesListControllerFactory, projectAssemblyMainService, projectAssemblyValidationService, projectAssemblyResourceService, projectAssemblyFilterService,projectCommonFilterButtonService,platformGridAPI) {

		estimateAssembliesAssembliesListControllerFactory.initAssembliesListController($scope, moduleName, projectAssemblyMainService, projectAssemblyValidationService, projectAssemblyResourceService,
			projectAssemblyFilterService,'51f9aff42521497898d64673050588f4', true);


		projectAssemblyMainService.IsActived = true;

		function addFilterBtnTools(){
			projectAssemblyMainService.setShowFilterBtn(true);
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
						value:false,
						caption: d.Code,
						fn: function (item,args) {
							let jobFilterBtn = _.find( $scope.tools.items,{'id':'jobFilter'});
							let jobIds = [];
							if(jobFilterBtn.list && jobFilterBtn.list.items) {
								let selectedJobs = _.filter (jobFilterBtn.list.items, {'value': true});
								jobIds = _.map (selectedJobs, 'id');
							}
							projectAssemblyMainService.setSelectedJobsIds(jobIds);
							projectAssemblyMainService.setInitFilterMenuFlag(false);
							projectAssemblyMainService.setIsManuallyFilter(true);
							projectAssemblyMainService.load();
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
				fn: function (item,args) {
					if(!project){
						return;
					}
					
					let jobFilterBtn = _.find( $scope.tools.items,{'id':'jobFilter'});
					let jobIds = [];
					if(jobFilterBtn.list && jobFilterBtn.list.items) {
						let selectedJobs = _.filter (jobFilterBtn.list.items, {'value': true});
						jobIds = _.map (selectedJobs, 'id');
					}
					projectAssemblyMainService.setSelectedJobsIds (jobIds);
					projectAssemblyMainService.setInitFilterMenuFlag(false);
					projectAssemblyMainService.setIsManuallyFilter(true);
					projectAssemblyMainService.load();
					mainViewService.customData($scope.gridId, 'JobMenuID', item);
				}
			};
			jobFilterMenu.list.items.push(configTool);

			//version est filter button
			let versionEstFilterMenu = _.find(tools, function (tool) {
				return tool.id === 'versionFilter';
			});
			versionEstFilterMenu.list.items =[];

			let versionEstHeader = projectCommonFilterButtonService.getVersionEstHeader();
			if(versionEstHeader && versionEstHeader.length){

				versionEstHeader = _.groupBy(versionEstHeader,'VersionNo');

				_.each(versionEstHeader,function (d) {
					let estHeaderIds =  d.length>1 ? _.map(d,'Id'):[d[0].Id];
					let configTool = {
						id: d[0].Id,
						type: 'check',
						value:false,
						estHeaderIds: estHeaderIds,
						jobIds :_.map(d,'LgmJobFk'),
						caption: d[0].VersionNo,
						fn: function (item, args) {
							if(!project){
								return;
							}
							projectCommonFilterButtonService.getJobIdsByEstHeader($scope,args,'versionHeader').then(function (data) {

								let jobIds = projectCommonFilterButtonService.hightLightNGetJob ($scope,data.highlightJobIds,data.cancelJobFkIds);
								projectAssemblyMainService.setSelectedJobsIds (jobIds);
								projectAssemblyMainService.setInitFilterMenuFlag(false);
								projectAssemblyMainService.setIsManuallyFilter(true);

								projectAssemblyMainService.load ();
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
				value:false,
				caption: $translate.instant('cloud.common.currentEstimates'),
				fn: function (item,args) {

					if(!project){
						return;
					}

					projectCommonFilterButtonService.getJobIdsByEstHeader($scope,args,'activeEstHeaderMenu').then(function (data) {
						if(args.value){
							data.highlightJobIds.push('BaseAssembly');
						}else{
							data.cancelJobFkIds.push('BaseAssembly');
						}
						let jobIds = projectCommonFilterButtonService.hightLightNGetJob ($scope,data.highlightJobIds,data.cancelJobFkIds);
						projectAssemblyMainService.setSelectedJobsIds (jobIds);
						projectAssemblyMainService.setInitFilterMenuFlag(false);
						projectAssemblyMainService.setIsManuallyFilter(true);

						projectAssemblyMainService.load();
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
						let selectedItem = projectAssemblyMainService.getSelected();
						return selectedItem && selectedItem.readOnlyByJob;
					};
				}
			});
			$scope.tools.update ();
			platformGridAPI.grids.refresh ($scope.gridId);
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		projectAssemblyMainService.onToolsUpdated.register(addFilterBtnTools);

		if(!projectAssemblyMainService.getShowFilterBtn()) {
			projectAssemblyMainService.onToolsUpdated.fire ();
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
				projectAssemblyMainService.setInitFilterMenuFlag(true);
				projectAssemblyMainService.setIsManuallyFilter(false);
			}
		}
		projectAssemblyMainService.hightLightNGetJob.register(hightLightNGetJob);

		$injector.get('projectMainService').registerSelectionChanged(initDefaultData);

		$scope.$on('$destroy', function () {
			delete projectAssemblyMainService.IsActived;
			projectAssemblyMainService.onToolsUpdated.unregister(addFilterBtnTools);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			projectAssemblyMainService.hightLightNGetJob.unregister(hightLightNGetJob);
			$injector.get('projectMainService').unregisterSelectionChanged(initDefaultData);
		});

	}
})(angular);
