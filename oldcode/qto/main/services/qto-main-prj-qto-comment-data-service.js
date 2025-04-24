
(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('qto.main');
	
	module.factory('prjQtoCommentDataService', ['qtoMainHeaderDataService', '$injector', 'platformDataServiceFactory', function (parentService, $injector, dataServiceFactory) {
		let serviceContainer = {};
		let serviceOption = {
			flatLeafItem: {
				serviceName: 'prjQtoCommentDataService',
				module: module,
				httpCreate: {route: globals.webApiBaseUrl + 'qto/formula/comment/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'qto/formula/comment/',
					endRead: 'getPrjQtoComment',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let qtoHeader = parentService.getSelected();
						readData.projectFk = qtoHeader ? qtoHeader.ProjectFk : -1;
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							let items = readData || [];
							let dataRead = serviceContainer.data.handleReadSucceeded(items, data);
							serviceContainer.data.listLoaded.fire();

							// set version qto as readonly
							let isBackup = parentService.getSelected().IsBackup;
							$injector.get('qtoMainCommonService').setContainerReadOnly(isBackup, '335c3fbe0adc4db0a00f64d7fba9e532');

							return dataRead;
						},
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = parentService.getSelected().BasRubricCategoryFk;
							creationData.projectFk = parentService.getSelected().ProjectFk;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PrjQtoComment',
						parentService: parentService
					}
				}
			}
		};
		serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
		return serviceContainer.service;
	}]);
})(angular);
