/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function(angular) {
	'use strict';

	angular.module('estimate.main').controller('estimateMainCxProjectLookupController', ['$scope', '$injector',
		function ($scope, $injector) {

			let list = [];
			if(!!$scope.Context.iTWOcxSessions && !!$scope.Context.iTWOcxSessions.PrjUserList){
				_.forEach($scope.Context.iTWOcxSessions.PrjUserList, function (item) {
					list.push({ProjectName: item.ProjectName});
				});
			}

			$scope.$watch('Context.iTWOcxSessions', function (newValue, oldValue) {
				if(newValue === oldValue){return;}
				if(!!$scope.Context.iTWOcxSessions && !!$scope.Context.iTWOcxSessions.PrjUserList){
					_.forEach($scope.Context.iTWOcxSessions.PrjUserList, function (item) {
						if(!_.find(list,{ProjectName: item.ProjectName})){
							list.push({ProjectName: item.ProjectName});
						}
					});

					let projectInfo = $injector.get('estimateMainService').getSelectedProjectInfo();
					if(projectInfo){
						let matchProjectNo = '';
						_.forEach(list, function (item) {
							if(item.ProjectName === projectInfo.ProjectNo || item.ProjectName === projectInfo.ProjectName){
								matchProjectNo = item.ProjectName;
							}
						});

						if(matchProjectNo){
							$scope.Entity.CxProject = matchProjectNo;
							$scope.Context.iTWOcxCredential.CxProject = matchProjectNo;
						}
					}
				}
			});


			$scope.selections = {valueMember:'ProjectName', displayMember:'ProjectName',items: list };

			$scope.Entity = {
				CxProject: $scope.Context.iTWOcxCredential.CxProject || (list.length > 0 ? list[0].ProjectName: ''),
			};


			// function onSelectedChanged() {
			//     $scope.Context.iTWOcxCredential.CxProject = $scope.Entity.CxProject;
			// }

		}]);

})(angular);
