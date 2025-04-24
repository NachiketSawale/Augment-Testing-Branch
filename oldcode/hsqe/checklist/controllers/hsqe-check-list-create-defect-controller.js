/**
 * Created by alm on 3/3/2021.
 */
(function(angular){
	/* global globals */

	'use strict';
	var moduleName = 'hsqe.checklist';
	angular.module(moduleName).controller('checkListCreateDefectController',['$scope','$state','cloudDesktopSidebarService',function($scope,$state,cloudDesktopSidebarService){
		$scope.modalOptions.title = 'Go To Defect';
		var defectIds = [];
		$scope.goTo = function(){
			var url = globals.defaultState + '.' + 'defect.main'.replace('.', '');
			$state.go(url).then(function () {
				cloudDesktopSidebarService.filterSearchFromPKeys(defectIds);
				defectIds = [];
			});
			$scope.$close(false);
		};
		$scope.modalOptions.ok = function(){
			defectIds = [];
			$scope.$close({ok:true});
		};
		defectIds=$scope.modalOptions.navIds;
	}]);

})(angular);
