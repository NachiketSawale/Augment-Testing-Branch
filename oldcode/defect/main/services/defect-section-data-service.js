/**
   Create by pet on 6/12/2018
 */
/* global , globals */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	var module = angular.module(modName);
	module.service('defectSectionDataService', ['defectChecklistDataService', 'platformDataServiceFactory',
		function (defectChecklistDataService, dataServiceFactory) {

			var serviceOption = {
				flatNodeItem: {
					module: module,
					serviceName: 'defectSectionDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'defect/main/section/'
					},
					entityRole:{
						node: {
							itemName: 'DfmSection',
							parentService: defectChecklistDataService,
							doesRequireLoadAlways: true
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return defectChecklistDataService.setReadonly();
						},
						canDeleteCallBackFunc: function () {
							return defectChecklistDataService.setReadonly();
						}
					}
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

			return serviceContainer.service;
		}]);

})(angular);
