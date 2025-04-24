/**
 * Created by balkanci on 02.06.2015.
 */
(function () {

	'use strict';
	var companyModule = angular.module('basics.company');

	companyModule.factory('basicsCompanyRubricCategoryIndexService', ['globals', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsCompanyNumberImageProcessor','basicsCompanyMainService','platformDataServiceSelectionExtension',

		function (globals, platformDataServiceFactory, ServiceDataProcessArraysExtension, basicsCompanyNumberImageProcessor, mainService, platformDataServiceSelectionExtension) {

			var rubricCategoryIndexOption = {
				hierarchicalNodeItem: {
					module: companyModule,
					serviceName: 'basicsCompanyRubricCategoryIndexService',
					entityNameTranslationID: 'basics.company.entityCategoryIndex',
					httpRead: { route: globals.webApiBaseUrl + 'basics/rubriccategoryindex/', endRead: 'tree' },
					dataProcessor: [new ServiceDataProcessArraysExtension(['Children']), basicsCompanyNumberImageProcessor],
					presenter: {
						tree: {
							parentProp: 'ParentId', childProp: 'Children'
						}
					},
					actions: {delete: false, create: false},
					entityRole: {
						node: {
							itemName: 'RubricCategoryIndex',
							parentService: mainService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(rubricCategoryIndexOption);
			serviceContainer.data.doNotLoadOnSelectionChange = true;
			serviceContainer.data.doNotDeselctOnClearContent = true;
			serviceContainer.data.clearContent = function clearListContent() {
			};
			var service = serviceContainer.service;

			service.setSelected = function setSelectedRCI(item) {
				return platformDataServiceSelectionExtension.doSelect(item, serviceContainer.data);
			};

			service.deselect = function deselectRCI() {
				return platformDataServiceSelectionExtension.deselect(serviceContainer.data);
			};

			service.load();

			return service;
		}]);
})();

