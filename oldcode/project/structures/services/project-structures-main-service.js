/**
 * Created by joshi on 25.10.2016.
 */
(function (angular) {
	'use strict';
	var projectStructuresMainModule = angular.module('project.structures');
	/*global globals*/

	projectStructuresMainModule.factory('projectStructuresMainService', ['platformDataServiceFactory', 'projectMainService',
		function (platformDataServiceFactory, projectMainService) {
			function canCreate(){
				return projectMainService.getIfSelectedIdElse(null) ? true : false;
			}
			function createSortCodeDataService(route) {
				var sortCodeServiceInfo = {
					flatLeafItem: {
						module: projectStructuresMainModule,
						serviceName: 'projectStructuresMainService',
						entityNameTranslationID: 'project.structures.sortCode'+route.slice(-2),
						httpCreate: { route: globals.webApiBaseUrl + 'project/structures/'+route+'/' },
						httpRead: { route: globals.webApiBaseUrl + 'project/structures/'+route+'/'},
						actions: { create: 'flat', canCreateCallBackFunc: canCreate, delete: {}, canDeleteCallBackFunc: function (){return true;} },
						entityRole: { leaf: { itemName: 'SortCode'+ route.slice(-2)+'Entities', parentService: projectMainService, parentFilter: 'projectId' } },
						presenter: {
							list: {
								isInitialSorted: true,
								sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								initCreationData: function initCreationData(creationData) {
									var selectedItem = projectMainService.getSelected();
									if (selectedItem && selectedItem.Id) {
										creationData.PKey1 = selectedItem.Id;
									}
								}
							}
						}
					} };

				var container = platformDataServiceFactory.createNewComplete(sortCodeServiceInfo);
				var service = container.service;
				return service;
			}
			return {
				createSortCodeDataService : createSortCodeDataService
			};
		}]);
})(angular);
