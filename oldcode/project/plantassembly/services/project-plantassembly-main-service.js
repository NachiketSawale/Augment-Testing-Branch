/**
 * $Id:$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global  _ */

	let moduleName = 'project.plantassembly';
	let projectPlantAssemblyModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name projectPlantAssemblyMainService
     * @function
     *
     * @description
     * projectPlantAssemblyMainService is the data service for all project Plant Assembly related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectPlantAssemblyModule.factory('projectPlantAssemblyMainService', ['$http','$injector', '$q', '$log', 'projectMainService', 'platformDataServiceFactory', 'cloudCommonGridService', 'projectPlantAssemblyProcessor','PlatformMessenger','platformRuntimeDataService','projectAssembliesProcessor','estimateAssembliesServiceFactory',

		function ($http,$injector, $q, $log, projectMainService, platformDataServiceFactory, cloudCommonGridService, projectPlantAssemblyProcessor,PlatformMessenger,platformRuntimeDataService,projectAssembliesProcessor,estimateAssembliesServiceFactory) {

			let option = {
				module: projectPlantAssemblyModule,
				isPrjPlantAssembly: true,
				navigateAssemblyId: null,
				parent: projectMainService,
				assemblyFilterService: 'projectAssemblyFilterService',
				serviceName: 'projectPlantAssemblyMainService',
				resourceServiceName: 'projectPlantAssemblyResourceService',
				resourceContainerId: 'bedc9497ca84537ae6c8cabbb0b8faeb',
				estimateAssembliesProcessor:projectPlantAssemblyProcessor,
				assemblyDynamicUserDefinedColumnService: 'projectPlantAssemblyDynamicUserDefinedColumnService',
				assemblyResourceDynamicUserDefinedColumnService: 'projectPlantAssemblyResourceDynamicUserDefinedColumnService',
				httpRead: {
					initReadData: function initReadData(readData) {
						let selectedItem = projectMainService.getSelected();
						if (selectedItem && selectedItem.Id > 0) {
							readData.ProjectId  = selectedItem.Id;
						}
						readData.ProjectContextId = readData.ProjectId;
						readData.furtherFilters =  [{Token: 'FILTER_BY_STRUCTURE:PROJECT', Value: readData.ProjectId},
							{Token:'PROJECT_PLANT_ASSEMBLY', Value: true}];
						if(jobIds && jobIds.length) {
							readData.furtherFilters.push ({
								Token: 'FILTER_BY_STRUCTURE:' + 'JOB',
								Value: jobIds.toString()
							});
						}

						if(initFilterMenuFlag && !isManuallyFilter) {
							readData.furtherFilters.push ({
								Token: 'initFilterMenuFlag',
								Value: true
							});

							readData.furtherFilters.push ({
								Token: 'FILTER_BY_STRUCTURE:' + 'JOB',
								Value: 'BaseAssembly'
							});
						}

						$injector.get('projectPlantAssemblyFilterService').setFilterRequest(readData);
					}
				}
			};
			/* jshint -W003 */ // 'serviceContainer' was used before it was defined
			let service = estimateAssembliesServiceFactory.createNewEstAssemblyListService(option);

			service.onToolsUpdated = new PlatformMessenger();

			service.hightLightNGetJob = new PlatformMessenger ();

			let showFilterBtn = false;
			let jobIds = [];
			let initFilterMenuFlag = true;
			let isManuallyFilter = false;
			let selectedItemId = null;

			service.setIsManuallyFilter = function setIsManuallyFilter(value){
				isManuallyFilter = value;
			};

			service.setInitFilterMenuFlag = function setInitFilterMenuFlag(value){
				initFilterMenuFlag = value;
			};

			service.getInitFilterMenuFlag = function getInitFilterMenuFlag(){
				return initFilterMenuFlag;
			};

			service.setReadOnlyByVersionJob = function setReadOnlyByVersionJob (plantAssemblies){
				let versionEstHeaderJobIds = $injector.get ('projectCommonFilterButtonService').getJobFksOfVersionEstHeader();
				_.forEach (plantAssemblies, function (plantAssembly) {

					let readOnly = versionEstHeaderJobIds.includes (plantAssembly.LgmJobFk);
					plantAssembly.readOnlyByJob = readOnly;
					if(readOnly) {
						let fields = [];
						_.forOwn(plantAssembly, function (value, key) {
							let field = {field: key, readonly: readOnly};
							fields.push(field);
						});

						fields.push ({field: 'Rule', readonly: plantAssembly.readOnlyByJob});
						fields.push ({field: 'Param', readonly: plantAssembly.readOnlyByJob});
						fields.push ({field: 'MdcCostCodeFk', readonly: plantAssembly.readOnlyByJob});

						platformRuntimeDataService.readonly(plantAssembly, fields);
					}
				});
			};

			service.setSelectedJobsIds = function setSelectedJobsIds(ids){
				jobIds = _.filter(ids,function(d){
					return d;
				});
				jobIds = _.uniqBy(jobIds);
				jobIds = _.orderBy(jobIds);
			};

			service.setShowFilterBtn = function setShowFilterBtn(value){
				showFilterBtn = value;
			};

			service.getShowFilterBtn = function getShowFilterBtn() {
				return showFilterBtn;
			};

			service.loadFilterMenu = function (highlightJobIds) {
				return $injector.get ('projectCommonFilterButtonService').initFilterMenu (service,highlightJobIds);
			};

			service.clear = function clear() {
				jobIds = null;
				showFilterBtn = false;
			};

			let refresh = service.refresh;

			service.refresh = function() {
				if (refresh && angular.isFunction(refresh)) {
					refresh();
				} else {
					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
					modTrackServ.clearModificationsInRoot(projectMainService);
					service.load();
				}
			};

			service.merge =  function handleUpdateDone(prjPlantAssemblies) {
				let updateTree = function updateTree(list){
					_.forEach(list, function(oldItem){
						let updatedItem = _.find(prjPlantAssemblies,{ Id: oldItem.Id });
						if (updatedItem){
							angular.extend(oldItem, updatedItem);
						}
						if (oldItem.HasChildren){
							updateTree(oldItem.EstResources);
						}
					});
				};

				updateTree(service.getList());

				let mainItem = service.getSelected();				
				if(mainItem && mainItem.Id){
					let updatedItem = _.find(prjPlantAssemblies,{ Id: mainItem.Id });
					if (updatedItem && updatedItem.EstResources && updatedItem.EstResources.length){
						$injector.get('projectPlantAssemblyResourceService').handleUpdateDone(updatedItem.EstResources);
					}
				}				
				service.gridRefresh();				
			};

			service.navigateTo = function navigateTo(item) {
				if (_.isObject(item) && _.isFunction(service.parentService().showTargetContainer)) {
					let targetContainer = 'project.main.plantassembly.list';
					let success = service.parentService().showTargetContainer(targetContainer);
					if (success) {
						selectedItemId = item.Id;
						if (service.parentService().getIfSelectedIdElse(null)) {
							service.load();
						}
						else {
							service.parentService().load();
						}
					}
				}
			}

			return service;

		}]);
})(angular);
