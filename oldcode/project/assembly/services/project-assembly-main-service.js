
/* global _ globals */
(function (angular) {
	'use strict';
	let moduleName = 'project.assembly';
	let projectAssemblyModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectAssemblyMainService
	 * @function
	 *
	 * @description
	 * projectAssemblyMainService is the data service for all project Assembly related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectAssemblyModule.factory('projectAssemblyMainService', ['cloudDesktopSidebarService','$q','$http','$injector','PlatformMessenger','platformGridAPI','estimateAssembliesServiceFactory', 'projectMainService', 'projectAssemblyFilterService','platformRuntimeDataService','projectAssembliesProcessor','projectCommonFilterButtonService','platformDataServiceDataPresentExtension',

		function (cloudDesktopSidebarService,$q,$http,$injector,PlatformMessenger,platformGridAPI,estimateAssembliesServiceFactory, projectMainService, projectAssemblyFilterService,platformRuntimeDataService,projectAssembliesProcessor,projectCommonFilterButtonService,platformDataServiceDataPresentExtension) {
			let option = {
				module: projectAssemblyModule,
				isPrjAssembly: true,
				navigateAssemblyId: null,
				parent: projectMainService,
				assemblyFilterService: 'projectAssemblyFilterService',
				serviceName: 'projectAssemblyMainService',
				// structureServiceName: 'estimateAssembliesAssembliesStructureService',
				structureServiceName: 'projectAssemblyStructureService',
				resourceServiceName: 'projectAssemblyResourceService',
				resourceContainerId: '20c0401F80e546e1bf12b97c69949f5b',
				assemblyDynamicUserDefinedColumnService : 'projectAssemblyDynamicUserDefinedColumnService',
				assemblyResourceDynamicUserDefinedColumnService : 'projectAssemblyResourceDynamicUserDefinedColumnService',
				estimateAssembliesProcessor:projectAssembliesProcessor,
				httpRead: {
					initReadData: function initReadData(readData) {
						let project = projectMainService.getSelected();
						if(project) {
							let params = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(null);
							params.filter = '';
							params.Pattern = null;
							angular.extend(readData, params);
							readData.furtherFilters = [];
							if (_.isNumber(option.navigateAssemblyId)) {
								readData.PKeys = [option.navigateAssemblyId];
							}
							let filterType = projectAssemblyFilterService.getFilterFunctionType();
							let allFilterIds = projectAssemblyFilterService.getAllFilterIds();
							readData.furtherFilters = _.filter(_.map(allFilterIds, function (v, k) {
								if (_.size(v) === 0) {
									return undefined;
								}
								// type 0 - assigned;
								// -> no change needed

								// type 1 - assigned and not assigned
								if (filterType === 1) {
									v.push('null');
								}
								// type 2 - not assigned
								else if (filterType === 2) {
									v = ['null'];
								}
								let value = v.join(',');
								return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
							}), angular.isDefined);

							readData.furtherFilters.push({
								Token: 'FILTER_BY_STRUCTURE:' + 'PROJECT',
								Value: project.Id
							});

							if(jobIds && jobIds.length) {
								readData.furtherFilters.push ({
									Token: 'FILTER_BY_STRUCTURE:' + 'JOB',
									Value: jobIds.toString()
								});
							}

							if((initFilterMenuFlag && !isManuallyFilter) || jobIds === null) {
								readData.furtherFilters.push ({
									Token: 'initFilterMenuFlag',
									Value: true
								});

								readData.furtherFilters.push ({
									Token: 'FILTER_BY_STRUCTURE:' + 'JOB',
									Value: 'BaseAssembly'
								});
							}
							projectAssemblyFilterService.setFilterRequest(readData);
						}
					}
				}
			};

			let service = estimateAssembliesServiceFactory.createNewEstAssemblyListService(option);


			service.onToolsUpdated = new PlatformMessenger();
			service.hightLightNGetJob = new PlatformMessenger ();


			service.setNavigateId = function(assemblyId){
				option.navigateAssemblyId = assemblyId;
			};

			let showFilterBtn = false;
			let jobIds = [];
			let initFilterMenuFlag = true;
			let isManuallyFilter = false;

			service.setIsManuallyFilter = function setIsManuallyFilter(value){
				isManuallyFilter = value;
			};

			service.setInitFilterMenuFlag = function setInitFilterMenuFlag(value){
				initFilterMenuFlag = value;
			};


			service.getInitFilterMenuFlag = function getInitFilterMenuFlag(){
				return initFilterMenuFlag;
			};

			service.setReadOnlyByVersionJob = function setReadOnlyByVersionJob (assemblies) {
				let versionEstHeaderJobIds = projectCommonFilterButtonService.getJobFksOfVersionEstHeader ();
				_.forEach (assemblies, function (item) {

					let readOnly = versionEstHeaderJobIds.includes (item.LgmJobFk);
					item.readOnlyByJob = readOnly;
					if(readOnly) {
						let fields = [];
						_.forOwn (item, function (value, key) {
							let field = {field: key, readonly: readOnly};
							fields.push (field);
						});

						fields.push ({field: 'ColVal1', readonly: item.readOnlyByJob});
						fields.push ({field: 'ColVal2', readonly: item.readOnlyByJob});
						fields.push ({field: 'ColVal3', readonly: item.readOnlyByJob});
						fields.push ({field: 'ColVal4', readonly: item.readOnlyByJob});
						fields.push ({field: 'ColVal5', readonly: item.readOnlyByJob});

						fields.push ({field: 'Rule', readonly: item.readOnlyByJob});
						fields.push ({field: 'Param', readonly: item.readOnlyByJob});
						fields.push ({field: 'MdcCostCodeFk', readonly: item.readOnlyByJob});
						fields.push ({field: 'ParMdcMaterialFkam', readonly: item.readOnlyByJob});

						platformRuntimeDataService.readonly (item, fields);
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
				}
			};

			service.merge =  function handleUpdateDone(prjAssemblies) {
				let updateTree = function updateTree(list){
					_.forEach(list, function(oldItem){
						let updatedItem = _.find(prjAssemblies,{ Id: oldItem.Id });
						if (updatedItem){
							angular.extend(oldItem, updatedItem);
						}
						if (oldItem.HasChildren){
							updateTree(oldItem.EstResources);
						}
					});
				};

				updateTree(service.getList());
			};

			return service;

		}]);
})(angular);
