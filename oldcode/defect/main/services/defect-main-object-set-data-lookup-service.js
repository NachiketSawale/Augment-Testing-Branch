/**
 * Created by jim on 5/16/2017.
 */
/* global , globals */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	var basicsDefectModule = angular.module(moduleName);

	basicsDefectModule.factory('defectMainObjectSetDataLookupService', ['_','$q','$http','cloudDesktopPinningContextService',
		'defectMainHeaderDataService',
		function (_,$q,$http,cloudDesktopPinningContextService,defectMainHeaderDataService) {
			var service = {};
			service.getList = function () {
				var defectEntity=defectMainHeaderDataService.getSelected();
				var projectId=null;
				if(!!defectEntity&&!!defectEntity.PrjProjectFk){
					projectId=defectEntity.PrjProjectFk;
				}
				if(!_.isNil(projectId)){
					return $http.get(globals.webApiBaseUrl + 'model/main/objectset/getObjectSetByProjectId?projectId='+projectId).then(function (response) {
						return response.data;
					});
				}else{
					return $q.when([]);
				}
			};

			//
			service.getItemByKey = function (objectSetKey) {
				var deffered = $q.defer();
				var arrayTemp=(objectSetKey+'').split('_');
				if(!!arrayTemp&&arrayTemp.length===2&&arrayTemp[0]!==''&&arrayTemp[1]!==''){
					var projectId=arrayTemp[0];
					var objectSetId=arrayTemp[1];
					$http.get(globals.webApiBaseUrl + 'model/main/objectset/list?mainItemId='+projectId).then(function (response) {
						deffered.resolve(_.find(response.data, function (item) {
							return item.Id.toString()===objectSetId;
						}));
					});
				}else{
					deffered.resolve({});
				}
				return deffered.promise;
			};

			service.getDisplayItem = function (/* value */) {
				return $q.when({});
			};

			service.getSearchList = function (value) {
				var defectEntity=defectMainHeaderDataService.getSelected();
				var projectId=null;
				if(!!defectEntity&&!!defectEntity.PrjProjectFk){
					projectId=defectEntity.PrjProjectFk;
				}
				if(!_.isNil(projectId)){
					return $http.get(globals.webApiBaseUrl + 'model/main/objectset/getObjectSetByProjectId?projectId='+projectId).then(function (response) {
						return _.filter(response.data, function (item) {
							return ((!!item.Name)&& ((item.Name+'').toLowerCase().indexOf((value+'').toLowerCase())!==-1))||
								((!!item.Remark)&& ((item.Remark+'').toLowerCase().indexOf((value+'').toLowerCase())!==-1));
						});
					});
				}else{
					return $q.when([]);
				}
			};

			return service;
		}]);
})(angular);
