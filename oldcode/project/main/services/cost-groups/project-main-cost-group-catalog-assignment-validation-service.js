/**
 * Created by baf on 2019-08-08
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	//projectMainCostGroupCatalogAssignmentDataService
	angular.module(moduleName).service('projectMainCostGroupCatalogAssignmentValidationService', ProjectMainCostGroupCatalogAssignmentValidationService);

	ProjectMainCostGroupCatalogAssignmentValidationService.$inject = ['_', 'platformRuntimeDataService', 'platformDataValidationService', 'projectMainCostGroupCatalogAssignmentDataService'];

	function ProjectMainCostGroupCatalogAssignmentValidationService(_, platformRuntimeDataService, platformDataValidationService, projectMainCostGroupCatalogAssignmentDataService) {
		var self = this;

		this.hasNoUniquenessIssues = function hasNoUniquenessIssues()
		{
			return true;
		};

		this.hasNoDuplicatedCatalogCodes = function hasNoDuplicatedCatalogCodes() {
			let hasDuplicatedCatalogCodes = false;

			var items = _.filter(projectMainCostGroupCatalogAssignmentDataService.getAssignments(), function(assignment) {
				return assignment.IsProjectCatalog;
			});

			_.forEach(items, function(item) {
				if(platformRuntimeDataService.hasError(item, 'Code')) {
					hasDuplicatedCatalogCodes = true;
				}
			});

			return !hasDuplicatedCatalogCodes;
		};

		this.validateCode = function validateCode(entity, value, model)
		{
			var items = _.filter(projectMainCostGroupCatalogAssignmentDataService.getAssignments(), function(assignment) {
				return assignment.IsProjectCatalog;
			});
			var result = platformDataValidationService.isValueUnique(items, model, value, entity.Id,{object: model.toLowerCase()});

			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return result;
		};
	}
})(angular);