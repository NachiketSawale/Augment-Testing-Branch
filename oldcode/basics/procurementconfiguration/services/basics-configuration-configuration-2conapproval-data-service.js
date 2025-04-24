/**
 * Created by lvy on 9/23/2020.
 */
(function () {
	'use strict';
	/* global globals */

	var modName = 'basics.procurementconfiguration';

	angular.module(modName).factory('basPrcConfig2ConApprovalDataService', ['$q',
		'platformDataServiceFactory',
		'basicsProcurementConfigurationDataService',
		'basicsProcurementConfigurationRubricCategoryService',
		function($q,
			dataServiceFactory,
			parentService,
			rubricCategoryService
		) {
			var service;

			var serviceOption = {
				flatLeafItem: {
					serviceName: 'basPrcConfig2ConApprovalDataService',
					entityNameTranslationID: 'basics.procurementconfiguration.conApprovalGridTitle',
					module: angular.module(modName),
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2conapproval/',
						usePostForRead: true,
						endRead: 'listByParent',
						initReadData: function initReadData(readData) {
							var sel = parentService.getSelected();
							readData.PKey1 = sel.Id;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data){
								return data.handleReadSucceeded((readData && readData.length) ? readData : [], data);
							},
							initCreationData: function initCreationData(creationData) {
								creationData.PKey1 = parentService.getSelected().Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'PrcConfig2ConApproval',
							parentService: parentService,
							doesRequireLoadAlways: true
						}
					}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			var basReadData = serviceContainer.data.doReadData;
			serviceContainer.data.doReadData = function doReadData() {
				var rubricCategory = rubricCategoryService.getSelected();
				if ((rubricCategory && rubricCategory.RubricFk !== null && rubricCategory.RubricFk/-1 === 26) ||
					(rubricCategory && rubricCategory.RubricFk === undefined && rubricCategory.Id/-1 === 26)) {
					return basReadData(serviceContainer.data);
				} else {
					return $q.when([]);
				}
			};

			var canCreate = serviceContainer.service.canCreate;
			serviceContainer.service.canCreate = function () {
				var rubricCategory = rubricCategoryService.getSelected();
				if ((rubricCategory && rubricCategory.RubricFk !== null && rubricCategory.RubricFk/-1 === 26) ||
					(rubricCategory && rubricCategory.RubricFk === undefined && rubricCategory.Id/-1 === 26)) {
					return canCreate();
				}
				return false;
			};
			var canDelete = serviceContainer.service.canDelete;
			serviceContainer.service.canDelete = function () {
				var rubricCategory = rubricCategoryService.getSelected();
				if ((rubricCategory && rubricCategory.RubricFk !== null && rubricCategory.RubricFk/-1 === 26) ||
					(rubricCategory && rubricCategory.RubricFk === undefined && rubricCategory.Id/-1 === 26)) {
					return canDelete();
				}
				return false;
			};


			return service;
		}
	]);
})();