(function (angular) {
	/* global _, globals*/
	'use strict';

	angular.module('project.common').factory('projectCommonFilterButtonService', [
		'$http','$q','$injector',
		function ($http, $q, $injector) {

			let service = {

			};

			let jobs = [];
			let allEstHeader = [];
			let versionEstHeader = [];
			let jobFksOfVersionEstHeader = [];

			service.getJobFksOfVersionEstHeader = function getJobFksOfVersionEstHeader () {
				return jobFksOfVersionEstHeader;
			};

			service.prepareJobFilter = function prepareJobFilter(){
				let project = $injector.get('projectMainService').getSelected ();
				if(!project){
					return  $q.when([]);
				}
				return $http.get(globals.webApiBaseUrl + 'logistic/job/ownedByProject?projectFk=' + project.Id).then (function (response) {
					jobs = response.data;
					return $q.when(response.data);
				});

			};

			service.prepareVersionEstHeaderFilter = function prepareVersionEstHeaderFilter(){
				let project = $injector.get('projectMainService').getSelected();
				if(!project){
					return  $q.when([]);
				}

				let param = {
					filter: '',
					projectFk: project.Id
				};

				return $http.post (globals.webApiBaseUrl + 'estimate/project/list', param).then (function (response) {
					if (response && response.data && response.data.length > 0) {

						allEstHeader = _.map(response.data,'EstHeader');

						versionEstHeader = _.filter(allEstHeader, function (item) {
							return item.EstHeaderVersionFk && !item.IsActive;
						});
						versionEstHeader = _.orderBy (versionEstHeader, 'VersionNo');
					}
					return $q.when(allEstHeader);
				});
			};

			service.prepareJobFksOfVersionEstHeader = function (){
				let project = $injector.get ('projectMainService').getSelected ();
				let param = {
					projectFks :[project.Id],
					estHeaderIds:[]
				};

				return $http.post (globals.webApiBaseUrl + 'estimate/main/header/GetJobIdsByEstHeaderIds', param).then (function (response) {
					jobFksOfVersionEstHeader = response && response.data ? response.data.versionJobIds :[];
					return $q.when(jobFksOfVersionEstHeader);
				});
			};


			let loadDataPromise  = null;
			service.initFilterMenu = function initFilterMenu(dataService,highlightJobIds) {
				let project = $injector.get ('projectMainService').getSelected ();
				if (!project) {
					return $q.when(true);
				}
				if(jobs.length && allEstHeader.length){
					if(!dataService.getShowFilterBtn()) {
						dataService.onToolsUpdated.fire();
						dataService.setShowFilterBtn(true);
					}
					if( dataService.getInitFilterMenuFlag && _.isFunction(dataService.getInitFilterMenuFlag)&& dataService.getInitFilterMenuFlag() ) {
						dataService.hightLightNGetJob.fire(highlightJobIds);

						dataService.setInitFilterMenuFlag(false);
					}
					return $q.when(true);
				}

				dataService.clear();

				if(!loadDataPromise){
					loadDataPromise = service.prepareFilterButtonData();
				}
				return loadDataPromise.then(function () {
					loadDataPromise  = null;
					dataService.onToolsUpdated.fire();
					dataService.setShowFilterBtn(true);

					if( dataService.getInitFilterMenuFlag && _.isFunction(dataService.getInitFilterMenuFlag) && dataService.getInitFilterMenuFlag() ) {
						dataService.hightLightNGetJob.fire(highlightJobIds);

					   dataService.setInitFilterMenuFlag(false);
					}

					return $q.when(true);
				});
			};

			service.prepareFilterButtonData = function prepareFilterButtonData() {
				let arrPromise =[];
				arrPromise.push(service.prepareJobFilter());
				arrPromise.push(service.prepareVersionEstHeaderFilter());
				arrPromise.push(service.prepareJobFksOfVersionEstHeader());
				return $q.all(arrPromise);
			};

			let tools = [{
				id: 'jobFilter',
				caption: 'cloud.common.jobFilter',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-filter-based-job',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: []
				}
			},{
				id: 'versionFilter',
				caption: 'cloud.common.versionFilter',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-filter-based-estimate',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: []
				}
			}];


			service.getFilterToolbar = function () {
				return tools;
			};

			service.updateTools = function () {
				service.onToolsUpdated.fire();
			};

			service.getJobs = function getJobs(){
				return jobs;
			};
			service.getVersionEstHeader = function getVersionEstHeader(){
				return versionEstHeader;
			};
			service.getAllEstHeader = function (){
				return allEstHeader;
			};


			service.hightLightNGetJob = function (scope,highlightJobIds,cancelJobFkIds) {
				let jobFilterBtn= _.find( scope.tools.items,{'id':'jobFilter'});
				if(jobFilterBtn.list && jobFilterBtn.list.items) {

					_.each (cancelJobFkIds, function (jobId) {
						let matchJob = _.find (jobFilterBtn.list.items, {'id': jobId});
						if (matchJob) {
							matchJob.value = false;
						}
					});

					_.each (highlightJobIds, function (jobId) {
						let matchJob = _.find (jobFilterBtn.list.items, {'id': jobId});
						if (matchJob) {
							matchJob.value = true;
						}
					});

				}


				// job filter button
				let jobIds  =[];
				jobFilterBtn= _.find( scope.tools.items,{'id':'jobFilter'});
				if(jobFilterBtn.list && jobFilterBtn.list.items) {
					let selectedJobs = _.filter (jobFilterBtn.list.items, {'value': true});
					let _jobIds = _.map (selectedJobs, 'id');
					jobIds = jobIds.concat(_jobIds);
				}

				jobIds = jobIds.concat(highlightJobIds);
				jobIds=_.uniqBy(jobIds);
				return jobIds;
			};


			service.getJobIdsByEstHeader = function (scope,args,type) {
				let estHeaderIds = [];

				if(!scope.tool){
					scope.updateTools();
				}

				if(type ==='versionHeader') {
					estHeaderIds = args.estHeaderIds;
				}else if(type ==='activeEstHeaderMenu'){
					let versionFilterBtn = _.find (scope.tools.items, {'id': 'versionFilter'});
					let activeEstHeaderMenu = _.find (versionFilterBtn.list.items, {'id': 'activeEstHeaderMenu'});
					let _estHeaders = _.filter (allEstHeader, function (item) {
						return !item.EstHeaderVersionFk && item.IsActive && !item.IsGCOrder;
					});


					if(activeEstHeaderMenu ){
						estHeaderIds = _.map (_estHeaders, 'Id');
					}
				}

				let param = {
					estHeaderIds:estHeaderIds
				};

				return $http.post (globals.webApiBaseUrl + 'estimate/main/header/GetJobIdsByEstHeaderIds', param).then (function (response) {

					let jobDatas  = response && response.data ? response.data : {};

					if(!args.value){
						jobDatas.cancelJobFkIds = jobDatas.estHeaderJobIds;
					}else{
						jobDatas.highlightJobIds = jobDatas.estHeaderJobIds;
					}
					return jobDatas;
				});

			};

			service.clear = function () {
				jobs = [];
				versionEstHeader = [];
				allEstHeader = [];

				$injector.get ('projectCostCodesJobRateMainService').clear ();
				$injector.get ('projectAssemblyMainService').clear ();
				$injector.get ('projectMaterialMainService').clear ();
				$injector.get ('projectCostCodesJobRateMainService').onToolsUpdated.fire ();
			};
			return service;
		}
	]);
})(angular);