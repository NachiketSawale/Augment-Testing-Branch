/**
 * Created by joshi on 02.07.2018.
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainPrjChangeStatusLookupService
	 * @function
	 *
	 * @description
	 * estimateMainPrjChangeStatusLookupService provides lookup data for estimate project change status
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainPrjChangeStatusLookupService', ['$http', '$q', '$injector','platformGridAPI',
		function ($http, $q, $injector,platformGridAPI) {

			// Object presenting the service
			let service = {};
			let lookupData = {
				estPrjChange : [],
				estPrjChangeStatus : [],
				prjChangePromise : null,
				prjChangeStatusPromise : null
			};
			let getProjectId = function getProjectId(){
				if(platformGridAPI.grids.exist('021c5211c099469bb35dcf68e6aebec7')){
					let projectMainForCOStructureService = $injector.get('projectMainForCOStructureService');
					if(projectMainForCOStructureService) {
						return projectMainForCOStructureService.getSelected() ? projectMainForCOStructureService.getSelected().Id : -1;
					}
				}else{
					return $injector.get('estimateMainService').getSelectedProjectId();
				}
			};

			service.getItemById = function getItemById(value) {
				let changeItem = _.find(lookupData.estPrjChange, {Id : value});
				if(!changeItem || !changeItem.ChangeStatusFk){return;}
				let list = lookupData.estPrjChangeStatus;
				let statusItem = list && list.length ? _.find(list, {Id:changeItem.ChangeStatusFk}) : null;
				return statusItem;
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getItemById(value);
			};

			service.getChangeStatusList = function getChangeStatusList() {
				if(lookupData.estPrjChangeStatus && lookupData.estPrjChangeStatus.length) {
					return $q.when(lookupData.estPrjChangeStatus);
				}else{
					if(!lookupData.prjChangeStatusPromise){
						lookupData.prjChangeStatusPromise = $injector.get('basicsLookupdataSimpleLookupService').getList({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.projectchangestatus',
							filter: {
								field: 'RubricCategoryFk',
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
							}
						});
					}
					return lookupData.prjChangeStatusPromise.then(function (result) {
						lookupData.estPrjChangeStatus = result;
						return result;
					});
				}
			};

			// get list of the estimate boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				return service.loadLookupData().then(function(){
					return service.getItemById(value);
				});
			};

			// estimate look up data service call
			service.loadLookupData = function loadLookupData() {
				let projectId = getProjectId();
				if (!projectId) {
					return $q.when([]);
				}
				if (lookupData.estPrjChange && lookupData.estPrjChange.length) {
					return service.getChangeStatusList();
				} else {
					if (!lookupData.prjChangePromise) {
						lookupData.prjChangePromise = $http.get(globals.webApiBaseUrl + 'change/main/byProject?projectId=' + projectId);
					}
					return lookupData.prjChangePromise.then(function (response) {
						lookupData.estPrjChange = response.data;
						lookupData.prjChangePromise = null;
						return service.getChangeStatusList();
					});
				}
			};

			// General stuff
			service.reload = function(){
				service.loadLookupData();
			};

			// General stuff
			service.load = function(){
				service.loadLookupData();
			};

			// General stuff
			service.clear = function(){
				lookupData = {};
			};

			service.appendNewChange = function (newPrjChange){
				if(lookupData.estPrjChange && lookupData.estPrjChange.length > 0 && _.find(lookupData.estPrjChange, {Id: newPrjChange.Id})){
					return;
				}
				lookupData.estPrjChange = lookupData.estPrjChange || [];
				lookupData.estPrjChange.push(newPrjChange);
			};

			return service;
		}]);
})();
