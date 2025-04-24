/**
 * Created by lja on 01/05/2015.
 */
(function (angular) {
	'use strict';

	/* globals globals */

	var qtoFormulaModule = angular.module('qto.formula');

	qtoFormulaModule.factory('qtoFormulaCommentService',
		['qtoFormulaRubricCategoryDataService', 'platformDataServiceFactory',
			function (parentService, dataServiceFactory) {

				let serviceContainer ={};
				let serviceOption = {
					flatLeafItem: {
						serviceName: 'qtoFormulaCommentService',
						module: qtoFormulaModule,
						httpCreate: { route: globals.webApiBaseUrl + 'qto/formula/comment/' },
						httpRead: {route: globals.webApiBaseUrl + 'qto/formula/comment/'},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									let items = readData || [];
									let dataRead = serviceContainer.data.handleReadSucceeded(items, data);
									serviceContainer.data.listLoaded.fire();

									return dataRead;
								},
								initCreationData: function initCreationData(creationData) {
									creationData.mainItemId = parentService.getSelected().Id;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'QtoComment',
								parentService: parentService
							}
						}
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				return serviceContainer.service;
			}]);
})(angular);
