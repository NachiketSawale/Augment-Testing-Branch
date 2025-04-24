/**
 * Created by waldrop on 10/10/2019.
 */

(function () {
	'use strict';
	/* global  globals, _ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainLineitemLocationLookupService
	 * @function
	 *
	 * @description
	 * estimateMainLocationLookupService provides all lookup data for estimate module project locations
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionsystemMainLineitemLocationLookupService', [
		'$http', '$q', 'basicsLookupdataLookupDescriptorService', 'constructionSystemMainInstanceService',
		'cloudCommonGridService', 'estimateMainCommonLookupService',
		'basicsLookupdataTreeHelper','platformGridAPI',
		function ( $http, $q, basicsLookupdataLookupDescriptorService, constructionSystemMainInstanceService,
			cloudCommonGridService, estimateMainCommonLookupService,
			basicsLookupdataTreeHelper,platformGridAPI) {

			// Object presenting the service
			var service = {};

			var lookupData = {
				estLocations:[]
			};

			var getProjectId = function getProjectId(){
				// use the controller's uuid to get which current module is
				if(platformGridAPI.grids.exist('c17ce6c31f454e18a2bc84de91f72f48')){
					var projectInfo =  constructionSystemMainInstanceService.getSelectedProjectInfo();
					if(projectInfo.ProjectId) {
						return projectInfo.ProjectId;
					}else{
						return null;
					}
				}
				else{
					return null;
				}
			};

			var getEstLocationItems = function(){
				var projectId = getProjectId();
				if(projectId){
					return $http.get(globals.webApiBaseUrl + 'project/location/tree?projectId='+ projectId);
				}
				else{
					return $q.when([]);
				}

			};

			// get project location from database
			service.loadAsync = function loadAsync(){
				if(!lookupData.estLocationListAsyncPromise) {
					lookupData.estLocationListAsyncPromise = getEstLocationItems();
				}
				return lookupData.estLocationListAsyncPromise.then(function(response){
					lookupData.estLocationListAsyncPromise = null;
					lookupData.estLocations = _.uniq(response.data, 'Id');
					return lookupData.estLocations;
				});
			};

			// get data list of the estimate location
			service.getList = function getList() {
				var result = lookupData.estLocations && lookupData.estLocations.length ? lookupData.estLocations : [];
				return result;
			};

			// get data list of the estimate location async
			service.getListAsync = function getListAsync() {
				var list = service.getList();
				if(list && list.length >0){
					return $q.when(list);
				}
				else{
					return service.loadAsync();
				}
			};

			// get list of the estimate location item by Id
			service.getItemById = function getItemById(value) {
				var item = {},
					list = lookupData.estLocations;
				if(list && list.length>0){
					var output = [];
					list = cloudCommonGridService.flatten(list, output, 'Locations');
					for (var i = 0; i < list.length; i++) {
						if ( list[i].Id === value) {
							item = list[i];
							break;
						}
					}
				}
				return item && item.Id ? item : null;
			};

			// get list of the estimate location item by Id async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
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
			};

			// get list of the estimate location item by filter value
			service.getSearchList = function getSearchList(value) {
				if (value) {
					var filterParams = {
						'codeProp': 'Code',
						'descriptionProp': null,
						'isSpecificSearch': null,
						'searchValue': value
					};

					if (lookupData.estLocations && lookupData.estLocations.length > 0) {
						var locationsCopy = lookupData.estLocations;
						var existItems = estimateMainCommonLookupService.getSearchData(filterParams, locationsCopy, 'Locations', 'LocationParentFk', true);
						return $q.when(existItems);
					} else {
						var projectId = getProjectId();
						if(!projectId){
							return $q.when([]);
						}
						if (!lookupData.searchLocationsPromise) {
							var searchString = '(Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%"))';
							var filterValue = searchString.replace(/%SEARCH%/g, '');
							lookupData.searchLocationsPromise = $http.get(globals.webApiBaseUrl + 'project/location/getlocationsearchlist?projectId=' + projectId + '&filterValue=' + filterValue);
						}
						return lookupData.searchLocationsPromise.then(function (response) {
							lookupData.searchLocationsPromise = null;
							var context = {
								treeOptions:{
									parentProp : 'LocationParentFk',
									childProp : 'Locations'
								},
								IdProperty: 'Id'
							};
							var locationTree = basicsLookupdataTreeHelper.buildTree(response.data, context);
							lookupData.estLocations = locationTree;
							var existItems = estimateMainCommonLookupService.getSearchData(filterParams, locationTree, 'Locations', 'LocationParentFk', true);
							return _.uniq(existItems);
						});
					}
				}
				else {
					return $q.when([]);
				}
			};

			service.clear = function (){
				lookupData.estLocations = [];
			};

			return service;
		}]);
})();
