/*
   Create by pet on 6/12/2018
 */
/* global , globals */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	var module = angular.module(modName);
	module.service('defectQuestionDataService', ['defectSectionDataService', 'platformDataServiceFactory','defectChecklistDataService',
		function (defectSectionDataService, dataServiceFactory, defectChecklistDataService) {

			var serviceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'defectQuestionDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'defect/main/question/'
					},
					entityRole: { leaf: { itemName: 'DfmQuestion', parentService: defectSectionDataService } },
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return defectChecklistDataService.setReadonly();
						},
						canDeleteCallBackFunc: function () {
							return defectChecklistDataService.setReadonly();
						}
					},
					transaction:{
						uid: 'defectQuestionDataService',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'DfmQuestionDto',
							moduleSubModule: 'Defect.Main'
						}
					}
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

			return serviceContainer.service;
		}]);

})(angular);
