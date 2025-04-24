(function (angular) {
	'use strict';

	angular.module('basics.clerk').directive('basicClerkRoleLookup',
		['_', '$translate', '$http', '$q', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
			function (_, $translate, $http, $q, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService) {
				var defaults = {
					lookupType: 'basicclerkrolelookup',
					dialogUuid: '9d74444343594f0eb9624f5c6bc69680',
					uuid: 'fcf7c08d2afd4ccca277a648d8347b25',
					valueMember: 'Id',
					displayMember: 'Description'
				};

				function getRoles(data, roles, clerks) {
					var roleList = [];
					_.forEach(data, function (item) {
						var currRole = _.find(roleList, {Id: item.ClerkRoleFk});
						if (!currRole) {
							var roleMes = _.find(roles, {Id: item.ClerkRoleFk});
							var clerkMes = _.find(clerks, {Id: item.ClerkFk});
							var role = {
								Id: item.ClerkRoleFk,
								Description: roleMes.DescriptionInfo.Translated,
								role: roleMes,
								clerks:[clerkMes]
							};
							roleList.push(role);
						} else {
							var clerkMessage = _.find(clerks, {Id: item.ClerkFk});
							if (!_.find(currRole.clerks, {Id: item.ClerkFk})) {
								currRole.clerks.push(clerkMessage);
							}
						}
					});
					basicsLookupdataLookupDescriptorService.addData('basicclerkrolelookup', roleList);
					return roleList;
				}
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					controller:['$scope',function($scope){
						$scope.$watch(function(){
							return $scope.$$childTail.keys;
						},function(newValue,oldValue){
							if (newValue.length === 0 && oldValue.length > 0){
								$scope.$$childTail.clearValue();
							}
						});
					}],
					dataProvider: {
						getSearchList: function (searchRequest) {
							var rootUrl = globals.webApiBaseUrl;
							searchRequest = searchRequest.substring(1, searchRequest.length - 1);
							var paramObjs = JSON.parse(searchRequest);

							if (paramObjs.isProject) {
								var projectId = paramObjs.projectId || -1;
								return $http.get(rootUrl + 'project/main/project2clerk/getClerkRole?mainItemId=' + projectId).then(function (response) {
									var data = response.data;
									return getRoles(data.Dtos, data.Roles, data.Clerks);
								});
							} else {
								var companyId = paramObjs.companyId || -1;
								return $http.get(rootUrl + 'basics/company/basclerk/getClerkRole?mainItemId=' + companyId).then(function (response) {
									var data = response.data;
									return getRoles(data.Dtos, data.Roles, data.Clerks);
								});
							}
						},
						getItemByKey: function (key, options) {
							var cache = options.dataView.dataCache.data;
							var defer = $q.defer();
							if (!cache || cache.length <= 0) {
								return basicsLookupdataLookupDataService.getList('clerkrole').then(function (roles) {
									return _.find(roles, {Id: key});
								});
							} else {
								var item = _.find(cache, {Id: key});
								defer.resolve(item || null);
								return defer.promise;
							}
						}
					}
				});
			}
		]);
})(angular);
