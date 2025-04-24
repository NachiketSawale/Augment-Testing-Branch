/**
 * Created by baf on 04.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainCostGroupCatalogValidationService
	 * @description provides validation methods for project main costGroupCatalog entities
	 */
	angular.module(moduleName).service('projectMainCostGroupCatalogValidationService', ProjectMainCostGroupCatalogValidationService);

	ProjectMainCostGroupCatalogValidationService.$inject = ['platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainCostGroupCatalogDataService'];

	function ProjectMainCostGroupCatalogValidationService(platformValidationServiceFactory, projectMainConstantValues, projectMainCostGroupCatalogDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.costGroupCatalog, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.costGroupCatalog),
			uniques: ['Code']
		},
		self,
		projectMainCostGroupCatalogDataService);
	}
})(angular);
