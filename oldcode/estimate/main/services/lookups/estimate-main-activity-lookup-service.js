/**
 * Created by joshi on 15.04.2015.
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainActivityLookupService
	 * @function
	 *
	 * @description
	 * estimateMainActivityLookupService provides all lookup data for estimate module project activities
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainActivityLookupService', ['$http', '$q', '$injector', 'basicsLookupdataLookupDescriptorService', 'estimateMainService',
		'cloudCommonGridService', 'estimateMainActivityService',  'procurementPackageDataService', 'estimateMainCommonLookupService',
		'basicsLookupdataTreeHelper','platformGridAPI',
		function ($http, $q, $injector, basicsLookupdataLookupDescriptorService, estimateMainService, cloudCommonGridService, estimateMainActivityService,
			procurementPackageDataService, estimateMainCommonLookupService, basicsLookupdataTreeHelper,platformGridAPI) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estActivities:[],
				estActivitySchedule : [],
				estSourceActivities:[],
				estSourceActivitySchedule : [],
				isSource:false
			};

			let getProjectId = function getProjectId(){
				// use the controller's uuid to get which current module is

				if (platformGridAPI.grids.exist('681223e37d524ce0b9bfa2294e18d650') && !lookupData.isSource){
					return estimateMainService.getSelectedProjectId();
				}
				else if (platformGridAPI.grids.exist('35b7329abce3483abaffd5a437c392dc') && lookupData.isSource){
					return $injector.get('estimateMainCopySourceFilterService').getSelectedProjectId();
				}
				else if (platformGridAPI.grids.exist('067be143d76d4ad080660ef147349f1d')){
					let packageItems = procurementPackageDataService.getList();
					let projectIds = _.uniq(_.map(packageItems,'ProjectFk'));
					return projectIds;
				}
				else if (platformGridAPI.grids.exist('8fbb8f4fb42343149666a3d7c24dc1b4')){
					let selectedProject = $injector.get('projectMainService').getSelected();
					if(selectedProject){
						return selectedProject.Id;
					}else{
						return null;
					}
				}
				else if(platformGridAPI.grids.exist('021c5211c099469bb35dcf68e6aebec7')){
					let projectMainForCOStructureService = $injector.get('projectMainForCOStructureService');
					if(projectMainForCOStructureService) {
						return projectMainForCOStructureService.getSelected() ? projectMainForCOStructureService.getSelected().Id : -1;
					}
				}
				// for defect 113091 - activity value doesn't show in line item of instance module
				else if(platformGridAPI.grids.exist('efec989037bc431187bf166fc31666a0')) {
					return $injector.get('constructionSystemMainInstanceService').getSelectedProjectId();
				}else if(platformGridAPI.grids.exist('773618e488874716a5ed278aa3663865')){
					let prj =$injector.get('controllingProjectcontrolsDashboardService').getProjectInfo();
					if (prj) {
						return prj.Id;
					}
				} else if (platformGridAPI.grids.exist('b806c811989248a0bf06aa05a496ecda')) {
					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					if (qtoHeader) {
						return qtoHeader.ProjectFk;
					}
				}
				else{
					return null;
				}
			};

			let getEstActivityItems = function(){
				let projectIds = getProjectId();
				if(projectIds && _.isArray(projectIds)){
					let projectSearchValue = {};
					projectSearchValue.ProjectIds = projectIds;
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity/projectscheduleactivities', projectSearchValue);
				}
				else if(projectIds){
					return $http.get(globals.webApiBaseUrl + 'scheduling/main/activity/projectscheduleactivities?projectId='+ getProjectId());
				}
				else{
					return $q.when([]);
				}

			};

			let fetchActivities = function fetchActivities(data){
				lookupData.estActivities = lookupData.estSourceActivities = [];
				lookupData.estActivitySchedule = lookupData.estSourceActivitySchedule = [];
				if(lookupData.isSource){

					lookupData.estSourceActivities = estimateMainActivityService.addActivityVRoot(data).Activities;

					if(lookupData.estSourceActivities && lookupData.estSourceActivities.length){
						lookupData.estSourceActivities = _.sortBy(lookupData.estSourceActivities, 'Code');
					}

					angular.forEach(data, function(d){
						lookupData.estSourceActivitySchedule.push(d.Schedule);
					});

					return lookupData.estSourceActivities;

				} else {
					lookupData.estActivities = estimateMainActivityService.addActivityVRoot(data).Activities;

					if(lookupData.estActivities && lookupData.estActivities.length){
						lookupData.estActivities = _.sortBy(lookupData.estActivities, 'Code');
					}

					angular.forEach(data, function(d){
						lookupData.estActivitySchedule.push(d.Schedule);
					});

					return lookupData.estActivities;
				}

			};

			service.loadAsync = function loadAsync(){
				if(!lookupData.estActListAsyncPromise) {
					lookupData.estActListAsyncPromise = getEstActivityItems();
				}
				return lookupData.estActListAsyncPromise.then(function(response){
					lookupData.estActListAsyncPromise = null;
					return fetchActivities(response.data);
					// return (angular.copy(lookupData.estActivities));
					// return lookupData.estActivities;
				});
			};

			// get data list of the estimate activity
			service.getList = function getList() {
				if(lookupData.isSource){
					return lookupData.estSourceActivities && lookupData.estSourceActivities.length ? lookupData.estSourceActivities : [];
				} else {
					return lookupData.estActivities && lookupData.estActivities.length ? lookupData.estActivities : [];
				}
			};

			// get data list of the estimate activity async
			service.getListAsync = function getListAsync() {
				let list = service.getList();
				if(list && list.length >0){
					// return $q.when((angular.copy(list)));
					return $q.when(list);
				}
				else{
					return service.loadAsync();
				}
			};

			// get list of the estimate activity item by Id
			service.getItemById = function getItemById(value) {
				let item = {},
					list = lookupData.isSource? lookupData.estSourceActivities : lookupData.estActivities;
				if(list && list.length>0){
					let output = [];
					list = cloudCommonGridService.flatten(list, output, 'Activities');
					for (let i = 0; i < list.length; i++) {
						if ( list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item && item.Id ? item : null;
			};

			// get list of the estimate activity item by Id
			service.getActivityById = function getActivityById(value) {
				let item = service.getItemById(value),
					schedule = {};
				if(item.Id){
					// schedule = angular.copy(_.find(lookupData.estActivities, {ScheduleId : item.ScheduleFk}));
					schedule = _.find(lookupData.estActivities, {ScheduleId : item.ScheduleFk});
					if(schedule){
						schedule.Activities = [item];
					}
					return schedule;
				}
			};

			// get list of the estimate activity item by Id async
			service.getItemByIdAsync = function getItemByIdAsync(value,options) {
				lookupData.isSource = options && options.isSourceLineItem;
				if(lookupData.isSource) {

					if (lookupData.estSourceActivities.length) {
						return $q.when(service.getItemById(value));
					} else {
						if (!lookupData.estSourceActivitiesPromise) {
							lookupData.estSourceActivitiesPromise = service.getListAsync();
						}
						return lookupData.estSourceActivitiesPromise.then(function (data) {
							lookupData.estSourceActivitiesPromise = null;
							lookupData.estSourceActivities = data;
							return service.getItemById(value);
						});
					}

				} else {
					if (lookupData.estActivities.length) {
						return $q.when(service.getItemById(value));
					} else {
						if (!lookupData.estActivitiesPromise) {
							lookupData.estActivitiesPromise = service.getListAsync();
						}
						return lookupData.estActivitiesPromise.then(function (data) {
							lookupData.estActivitiesPromise = null;
							lookupData.estActivities = data;
							return service.getItemById(value);
						});
					}
				}
			};

			// get list of the estimate activity item by Id async
			service.getActivityByIdAsync = function getActivityByIdAsync(value) {
				if(lookupData.estActivities && lookupData.estActivities.length) {
					return $q.when(service.getActivityById(value));
				} else {
					if(!lookupData.estActivitiesPromise) {
						lookupData.estActivitiesPromise = service.getListAsync();
					}

					return lookupData.estActivitiesPromise.then(function(data){
						lookupData.estActivitiesPromise = null;
						lookupData.estActivities= data;
						return service.getActivityById(value);
					});
				}
			};

			service.getActSchedule = function getActSchedule (){
				return lookupData.estActivitySchedule;
			};

			service.getActScheduleAsync = function getActScheduleAsync (){
				return service.loadAsync().then(function(){
					return lookupData.estActivitySchedule;
				});
			};

			// get list of the estimate activity item by filter value
			service.getSearchList = function getSearchList(value) {
				if (value) {
					if (lookupData.estActivities && lookupData.estActivities.length > 0) {
						let filterParams = {
							'codeProp': 'Code',
							'descriptionProp': 'Description',
							'isSpecificSearch': null,
							'searchValue': value
						};
						// let activitiesCopy = angular.copy(lookupData.estActivities);
						let activitiesCopy = lookupData.estActivities;
						if(activitiesCopy && activitiesCopy.length > 0) {
							angular.forEach(activitiesCopy, function (activity) {
								activity.Id = activity.ScheduleId;
								activity.ParentActivityFk = null;
								if(activity.Activities && activity.Activities.length > 0){
									angular.forEach(activity.Activities, function(activityChild){
										activityChild.ParentActivityFk = activity.ScheduleId;
									});

								}
							});
						}
						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, activitiesCopy, 'Activities', 'ParentActivityFk', true);
						let context = {
							treeOptions:{
								parentProp : 'ParentActivityFk',
								childProp : 'Activities'
							},
							IdProperty: 'Id'
						};
						let activityTree = basicsLookupdataTreeHelper.buildTree(existItems, context);
						if(activityTree && activityTree.length > 0) {
							angular.forEach(activityTree, function(activity){
								activity.Id = 'schedule' + activity.ScheduleId;
							});
						}
						return $q.when(activityTree);
					} else {
						let searchString = '(Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%"))';
						searchString.replace(/%SEARCH%/g, value);
						if (!lookupData.searchActivitiesPromise) {
							lookupData.searchActivitiesPromise = $http.get(globals.webApiBaseUrl + 'scheduling/main/activity/searchprjscheduleactivities?projectId=' + getProjectId() + '&filterValue=' + searchString);
							return lookupData.searchActivitiesPromise.then(function (response) {
								lookupData.searchActivitiesPromise = null;
								// fetchActivities(response.data);
								let activities = estimateMainActivityService.addActivityVRoot(response.data).Activities;
								let searchList = _.filter(activities, function (item) {
									if (item) {
										if (item.Activities && item.Activities.length) {
											return item;
										}
									}
								});
								return searchList;
							});
						}
						else {
							return $q.when([]);
						}
					}
				}
			};

			// estimate look up data service call
			service.loadLookupData = function(){
				// let list = estimateMainLookupStateService.getProjectActivity();
				if(lookupData.estActivities === null || lookupData.estActivities.length === 0){
					if(lookupData.estActivities.length === 0 && !lookupData.estActivitiesPromise){
						lookupData.estActivitiesPromise = getEstActivityItems();
						lookupData.estActivitiesPromise.then(function(response){
							lookupData.estActivitiesPromise = null;
							fetchActivities(response.data);
						});
					}
				}
			};

			// General stuff
			service.reload = function(){
				service.loadLookupData();
			};

			service.clear = function (){
				lookupData.estActivities = [];
				lookupData.estActivitySchedule = [];
			};

			service.resolveStringValueCallback = function resolveStringValueCallback(options) {
				return function (value) {
					return service.getActivityByCode(value).then(function (activityItems) {
						// Return error if no activity items are found
						if (!activityItems) {
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'not found!'
							};
						}

						const lowercaseValue = value.toLowerCase();
						let filteredActivityItemId;

						// Check if activityItems is an array or a single item
						if (Array.isArray(activityItems)) {
							let filteredActivity= _.find(activityItems, activityItem =>
								activityItem.Code === value ||
								activityItem.Code.toLowerCase() === lowercaseValue
							);
							if(filteredActivity){
								filteredActivityItemId =  filteredActivity.Id;
							}
						} else {
							filteredActivityItemId =  activityItems;
						}

						// Return the result based on whether the item was found
						if (filteredActivityItemId) {
							return {
								apply: true,
								valid: true,
								value: filteredActivityItemId
							};
						} else {
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'not found!'
							};
						}
					});
				};
			};

			// get prj schedule activity item by code
			service.getActivityByCode = function getActivityByCode(value) {
				if (!value) {
					return $q.when([]); // Return an empty promise if value is falsy
				}

				// Check if lookupData.estActivities exists and has items
				if (lookupData.estActivities && lookupData.estActivities.length > 0) {
					const filterParams = {
						codeProp: 'Code',
						descriptionProp: null,
						isSpecificSearch: true,
						searchValue: value
					};

					// Clone activities to avoid modifying the original data
					const activitiesCopy = angular.copy(lookupData.estActivities);

					// Process activities
					if (activitiesCopy.length > 0) {
						angular.forEach(activitiesCopy, function (activity) {
							activity.Id = activity.ScheduleId;
							activity.ParentActivityFk = null;

							if (activity.Activities && activity.Activities.length > 0) {
								angular.forEach(activity.Activities, function (activityChild) {
									activityChild.ParentActivityFk = activity.ScheduleId;
								});
							}
						});
					}

					// Search within the activities
					const existItems = estimateMainCommonLookupService.getSearchData(
						filterParams,
						activitiesCopy,
						'Activities',
						'ParentActivityFk',
						true
					);

					return $q.when(existItems);
				} else {
					return $http.get(globals.webApiBaseUrl + 'scheduling/main/activity/searchprjscheduleactivitybycode?projectId=' + getProjectId() + '&filterValue=' + value)
					.then(function (response) {
						return response.data;
					});
				}
			};

			return service;
		}]);
})();
