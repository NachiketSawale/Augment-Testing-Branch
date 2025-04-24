/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	angular.module('awp.main').factory('awpPackageStructureLineItemInfo', [
		'$q',
		'$http',
		function ($q, $http) {

			let projectSelected = null;
			let estHeaderSelected = null;
			let estHeadersOfProject = [];

			const service = {};

			service.getProjectSelected = function () {
				return projectSelected;
			};

			service.setProjectSelected = function (value) {
				projectSelected = value;
			};

			service.getEstHeaderSelected = function () {
				return estHeaderSelected;
			};

			service.setEstHeaderSelected = function (value) {
				estHeaderSelected = value;
			};

			service.getEstHeaders = function(){
				return estHeadersOfProject;
			};

			service.setSelectedEstHeaderById = function(value){
				if(value){
					const estHeader = estHeadersOfProject.find(e => e.Id === value);
					if(estHeader){
						estHeaderSelected = estHeader;
					}
				}
			};

			service.loadEstHeaders = function (callbackFunc) {
				if (projectSelected && projectSelected.Id > 0) {
					let requestInfo = {
						projectFk: projectSelected.Id,
						filter: '',
						IsFilterActive: true
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/project/list', requestInfo).then(function (response) {
						if (response.data) {
							estHeadersOfProject = response.data.map(e => e.EstHeader);
							if (callbackFunc) {
								callbackFunc(estHeadersOfProject);
							}
						}
					});
				}else{
					return $q.when();
				}
			};

			return service;
		}]);
})(angular);