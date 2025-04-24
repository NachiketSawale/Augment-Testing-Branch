/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLocationLookupService
	 * @function
	 *
	 * @description
	 * estimateMainLocationLookupService provides all lookup data for estimate module project locations
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainLocationLookupService', ['$injector','$http', '$q', 'basicsLookupdataLookupDescriptorService', 'estimateMainService',
		'cloudCommonGridService', 'estimateMainCommonLookupService',
		'basicsLookupdataTreeHelper','platformGridAPI',
		function ($injector,$http, $q, basicsLookupdataLookupDescriptorService, estimateMainService,
			cloudCommonGridService, estimateMainCommonLookupService,
			basicsLookupdataTreeHelper,platformGridAPI) {

			// Object presenting the service
			let service = {};

			let lookupData = {
				estLocations:[],
				estSourceLocations:[],
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
				else if(platformGridAPI.grids.exist('b46b9e121808466da59c0b2959f09960')){
					return estimateMainService.getSelectedProjectId();
				}
				else{
					return null;
				}
			};

			let getEstLocationItems = function(){
				let projectId = getProjectId();
				if(_.isArray(projectId)) {
					let projectSearchValue = {};
					projectSearchValue.ProjectIds = projectId;
					return $http.post(globals.webApiBaseUrl + 'project/location/treebyprojectids' , projectSearchValue);
				}
				else if(projectId){
					return $http.get(globals.webApiBaseUrl + 'project/location/tree?projectId='+ projectId);
				}
				else{
					return $q.when([]);
				}

			};

			// get project location from database
			service.loadAsync = function loadAsync(isCopyExcel){
				if(!lookupData.estLocationListAsyncPromise) {
					lookupData.estLocationListAsyncPromise = getEstLocationItems();
				}

				return lookupData.estLocationListAsyncPromise.then(function(response){
					lookupData.estLocationListAsyncPromise = null;

					if(lookupData.isSource && !isCopyExcel){
						lookupData.estSourceLocations = _.uniq(response.data, 'Id');
						return lookupData.estSourceLocations;
					} else {
						lookupData.estLocations = _.uniq(response.data, 'Id');
						return lookupData.estLocations;
					}
				});
			};

			// get data list of the estimate location
			service.getList = function getList(isCopyExcel) {
				if(lookupData.isSource && !isCopyExcel){
					return lookupData.estSourceLocations && lookupData.estSourceLocations.length ? lookupData.estSourceLocations : [];
				} else {
					return lookupData.estLocations && lookupData.estLocations.length ? lookupData.estLocations : [];
				}

			};

			// get data list of the estimate location async
			service.getListAsync = function getListAsync() {
				let list = service.getList();
				if(list && list.length >0){
					return $q.when(list);
				}
				else{
					return service.loadAsync();
				}
			};

			// get list of the estimate location item by Id
			service.getItemById = function getItemById(value) {
				let item = {},
					list = lookupData.isSource ? lookupData.estSourceLocations : lookupData.estLocations;
				if(list && list.length>0){
					let output = [];
					list = cloudCommonGridService.flatten(list, output, 'Locations');
					for (let i = 0; i < list.length; i++) {
						if ( list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item && item.Id ? item : null;
			};

			// get list of the estimate location item by Id async
			service.getItemByIdAsync = function getItemByIdAsync(value,options) {
				lookupData.isSource = options && options.isSourceLineItem;
				if(lookupData.isSource){
					if(lookupData.estSourceLocations.length) {
						return $q.when(service.getItemById(value));
					} else {
						if(!lookupData.estSourceLocationsListAsyncPromise) {
							lookupData.estSourceLocationsListAsyncPromise = service.getListAsync();
						}
						return lookupData.estSourceLocationsListAsyncPromise.then(function(data){
							lookupData.estSourceLocationsListAsyncPromise = null;
							lookupData.estSourceLocations= data;
							return service.getItemById(value);
						});
					}
				} else {
					if(lookupData.estLocations.length) {
						return $q.when(service.getItemById(value));
					} else {
						if(!lookupData.estLocationListAsyncPromise) {
							lookupData.estLocationListAsyncPromise = service.getListAsync();
						}
						return lookupData.estLocationListAsyncPromise.then(function(data){
							lookupData.estLocationListAsyncPromise = null;
							lookupData.estLocations= data;
							return service.getItemById(value);
						});
					}
				}

			};

			// get list of the estimate location item by filter value
			service.getSearchList = function getSearchList(value) {
				if (value) {
					let filterParams = {
						'codeProp': 'Code',
						'descriptionProp': null,
						'isSpecificSearch': null,
						'searchValue': value
					};

					if (lookupData.estLocations && lookupData.estLocations.length > 0) {
						let locationsCopy = lookupData.estLocations;
						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, locationsCopy, 'Locations', 'LocationParentFk', true);
						return $q.when(existItems);
					} else {
						let projectId = getProjectId();
						if(!projectId){
							return $q.when([]);
						}
						if (!lookupData.searchLocationsPromise) {
							let searchString = '(Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%"))';
							let filterValue = searchString.replace(/%SEARCH%/g, '');
							lookupData.searchLocationsPromise = $http.get(globals.webApiBaseUrl + 'project/location/getlocationsearchlist?projectId=' + projectId + '&filterValue=' + filterValue);
						}
						return lookupData.searchLocationsPromise.then(function (response) {
							lookupData.searchLocationsPromise = null;
							let context = {
								treeOptions:{
									parentProp : 'LocationParentFk',
									childProp : 'Locations'
								},
								IdProperty: 'Id'
							};
							let locationTree = basicsLookupdataTreeHelper.buildTree(response.data, context);
							lookupData.estLocations = locationTree;
							let existItems = estimateMainCommonLookupService.getSearchData(filterParams, locationTree, 'Locations', 'LocationParentFk', true);
							return _.uniq(existItems);
						});
					}
				}
				else {
					return $q.when([]);
				}
			};

			service.resolveStringValueCallback = function resolveStringValueCallback(options) {
				return function (value) {
					return service.getLocationByCode(value).then(function (locations) {
						if (!locations) {
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'Not found!'
							};
						}
						const lowercaseValue = value.toLowerCase();

						let filteredLocations;

						// Check if locations is an array or a single item
						if (Array.isArray(locations)) {
							filteredLocations = _.find(locations, location =>
								location.Code === value ||
								location.Code.toLowerCase() === lowercaseValue
							);
						} else {
							filteredLocations = (locations.Code === value ||
								locations.Code.toLowerCase() === lowercaseValue) ? locations : null;
						}

						// Return the result based on whether the item was found
						if (filteredLocations) {
							return {
								apply: true,
								valid: true,
								value: filteredLocations.Id
							};
						} else {
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'Not found!'
							};
						}

					});

				};
			};

			service.getLocationByCode = function getLocationByCode(value) {
				if (!value) {
					return $q.when([]); // Return an empty promise if value is falsy
				}

				// Check if lookupData.estLocations exists and has items
				if (lookupData.estLocations && lookupData.estLocations.length > 0) {
					const filterParams = {
						codeProp: 'Code',
						descriptionProp: null,
						isSpecificSearch: true,
						searchValue: value
					};

					// Clone locations to avoid modifying the original data
					const locationCopy = angular.copy(lookupData.estLocations);

					// Search within the locations
					const existItems = estimateMainCommonLookupService.getSearchData(
						filterParams,
						locationCopy,
						'Locations',
						'LocationParentFk',
						true
					);

					return $q.when(existItems);
				} else {
					// Fallback to HTTP request if lookupData.estLocations is not available
					const searchString = `(Code = ("${value}"))`;

					return $http.get(globals.webApiBaseUrl + 'project/location/getlocationsearchlist?projectId=' + getProjectId() + '&filterValue=' + searchString).then(function (response) {
						return response.data;
					});
				}
			};

			service.clear = function (){
				lookupData.estLocations = [];
			};

			return service;
		}]);
})();
