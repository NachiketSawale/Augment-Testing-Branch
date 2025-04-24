/**
 * Created by joshi on 17.10.2018.
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainPrcPackageStatusLookupService
	 * @function
	 *
	 * @description
	 * estimateMainPrcPackageStatusLookupService provides lookup data for estimate package status
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainPrcPackageStatusLookupService', ['$http', '$q', '$injector','platformGridAPI',
		function ($http, $q, $injector,platformGridAPI) {

			// Object presenting the service
			let service = {};
			let lookupData = {
				estPrcPackage : [],
				estPrcPackageStatus : [],
				PrcPackagePromise : null,
				PrcPackageStatusPromise : null
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
				let changeItem = _.find(lookupData.estPrcPackage, {Id : value});
				if(!changeItem || !changeItem.PackageStatusFk){return;}
				let list = lookupData.estPrcPackageStatus;
				let statusItem = list && list.length ? _.find(list, {Id:changeItem.PackageStatusFk}) : null;
				return statusItem;
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getItemById(value);
			};

			service.getChangeStatusList = function getChangeStatusList() {
				if(lookupData.estPrcPackageStatus && lookupData.estPrcPackageStatus.length) {
					return $q.when(lookupData.estPrcPackageStatus);
				}else{
					if(!lookupData.PrcPackageStatusPromise){
						lookupData.PrcPackageStatusPromise = $injector.get('basicsLookupdataLookupDescriptorService').loadData(['PackageStatus']);
						let list = $injector.get('basicsLookupdataLookupDescriptorService').getData('PackageStatus');
						lookupData.estPrcPackageStatus = angular.isObject(list) && _.size(list) ?  _.values(list) : [];
					}
					if(lookupData.estPrcPackageStatus && lookupData.estPrcPackageStatus.length){
						lookupData.PrcPackageStatusPromise = null;
					}
					return lookupData.estPrcPackageStatus;
				}
			};

			// get list of the estimate boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				return service.loadLookupData().then(function(){
					return service.getItemById(value);
				});
			};

			// estimate look up data service call
			service.loadLookupData = function loadLookupData(){
				let projectId = getProjectId();
				if(!projectId){return  $q.when([]);}
				if(lookupData.estPrcPackage && lookupData.estPrcPackage.length) {
					return $q.when(service.getChangeStatusList());
				}else{
					if(!lookupData.PrcPackagePromise){
						lookupData.PrcPackagePromise = $http.get(globals.webApiBaseUrl + 'procurement/package/package/lookup?projectId='+projectId);
					}
					return lookupData.PrcPackagePromise.then(function(response){
						lookupData.estPrcPackage = response.data;
						lookupData.PrcPackagePromise = null;
						return $q.when(service.getChangeStatusList());
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

			return service;
		}]);
})();
