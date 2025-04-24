(function (angular) {
	'use strict';

	/* globals globals */

	var qtoFormulaModule = angular.module('qto.formula');

	/* jshint -W072 */
	qtoFormulaModule.factory('qtoFormulaRubricCategoryDataService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
			function (platformDataServiceFactory, basicsLookupdataLookupDescriptorService) {

				let serviceContainer ={};
				let qtoFormulaRubricCategoryMainServiceOptions = {
					flatRootItem: {
						module: qtoFormulaModule,
						serviceName: 'qtoFormulaRubricCategoryDataService',
						entityNameTranslationID: 'qto.formula.gridViewTitle',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'qto/formula/header/'
						},

						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData || {});
									let dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
									serviceContainer.service.goToFirst();
									return dataRead;
								}
							}
						},

						entityRole: {
							root: {
								itemName: 'RubricCategory',
								moduleName: 'cloud.desktop.moduleDisplayNameQTOFormula',
								addToLastObject: false
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(qtoFormulaRubricCategoryMainServiceOptions);

				return serviceContainer.service;
			}]);
})(angular);