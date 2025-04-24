(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'controlling.common';

	/**
	 * @ngdoc service
	 * @name ControllingCommonPrjChangeStatusLookupServiceFactory
	 * @function
	 *
	 * @description
	 * controllingCommonPrjChangeStatusLookupServiceFactory provides lookup data for controlling project change status
	 */
	angular.module(moduleName).factory('controllingCommonPrjChangeStatusLookupServiceFactory', ['$http', '$q', '$injector','platformGridAPI',
		function ($http, $q, $injector,platformGridAPI) {
			let factory = {};

			factory.createPrjChangeStatusLookupService = function (mainService) {
				let service = {};
				let lookupData = {
					estPrjChange : [],
					estPrjChangeStatus : [],
					prjChangePromise : null,
					prjChangeStatusPromise : null
				};

				let getProjectId = function getProjectId(){
					if(mainService.getServiceName() === 'controllingProjectcontrolsDashboardService'){
						return mainService.getProjectInfo() ? mainService.getProjectInfo().Id : -1;
					}else if(_.isFunction(mainService.getSelected)){
						return mainService.getSelected() ? mainService.getSelected().Id : -1;
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

				service.getItemByIdAsync = function getItemByIdAsync(value) {
					return service.loadLookupData().then(function(){
						return service.getItemById(value);
					});
				};

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
			}


			return factory;
		}]);
})();
