/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global _ */

	/**
	 * @ngdoc service
	 * @name estimateMainJobDataService
	 * @function
	 * @description
	 * estimateMainJobDataService is the data service for get the jobfk
	 */

	angular.module('estimate.main').factory('estimateMainJobDataService', ['$injector',
		function ($injector) {

			let service = {},
				resourceJobFk;

			angular.extend(service, {
				getJobFk: getJobFk,
				getJobFkWhenMoveAssembly: getJobFk,
				getJobFkWhenCopyAssembly: getJobFkWhenCopyAssembly
			});

			return service;

			// get the job fk from resource to line item
			function getJobFk() {
				resourceJobFk = 0;
				let resourceList =  $injector.get('estimateMainResourceService').getList();
				let resourceSelected = $injector.get('estimateMainResourceService').getSelected();
				getResourceLgmJobFk(resourceSelected, resourceList);
				if(resourceJobFk > 0){
					return resourceJobFk;
				}

				let selectEstLineItem = $injector.get('estimateMainService').getSelected();
				if(selectEstLineItem && selectEstLineItem.LgmJobFk && selectEstLineItem.LgmJobFk - 0 !== 0){
					return selectEstLineItem.LgmJobFk;
				}
			}

			// get the job fk from resource parent
			function  getResourceLgmJobFk(resourceSelected, resourceList){
				if(resourceSelected && resourceSelected.LgmJobFk && resourceSelected.LgmJobFk - 0 !== 0){
					resourceJobFk = resourceSelected.LgmJobFk;
				}

				if(resourceSelected && resourceSelected.EstResourceFk){
					let resourceParent = _.find(resourceList, {Id: resourceSelected.EstResourceFk});
					getResourceLgmJobFk(resourceParent, resourceList);
				}
			}

			// (drag + Ctrl) related assemblies to estimate resource
			function getJobFkWhenCopyAssembly(){
				resourceJobFk = 0;
				let resourceList =  $injector.get('estimateMainResourceService').getList();
				let resourceSelected = $injector.get('estimateMainResourceService').getSelected();

				// Copy > we take the parent as current selected.
				if(resourceSelected && resourceSelected.EstResourceFk){
					resourceSelected = _.find(resourceList, {Id: resourceSelected.EstResourceFk});
				}else{
					resourceSelected = null;
				}

				getResourceLgmJobFk(resourceSelected, resourceList);

				if(resourceJobFk > 0){
					return resourceJobFk;
				}
				// else
				let selectEstLineItem = $injector.get('estimateMainService').getSelected();
				if(selectEstLineItem && selectEstLineItem.LgmJobFk && selectEstLineItem.LgmJobFk - 0 !== 0){
					return selectEstLineItem.LgmJobFk;
				}
			}
		}]);
})(angular);
