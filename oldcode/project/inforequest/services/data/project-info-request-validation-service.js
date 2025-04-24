/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestValidationService
	 * @description provides validation methods for information request entities
	 */
	module.service('projectInfoRequestValidationService', ProjectInfoRequestValidationService);
	ProjectInfoRequestValidationService.$inject = ['$injector', 'platformRuntimeDataService', 'platformDataValidationService', 'projectInfoRequestDataService', 'modelViewerModelSelectionService'];

	function ProjectInfoRequestValidationService($injector, platformRuntimeDataService, platformDataValidationService, projectInfoRequestDataService, modelViewerModelSelectionService) {
		this.validateCode = function validateCode(entity, value, model) {
			var items = projectInfoRequestDataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, this, projectInfoRequestDataService);
		};

		this.validateObjectSetFk = function validateObjectSet(entity) {
			if(!entity.ModelFk){
				entity.ModelFk = modelViewerModelSelectionService.getSelectedModelId();
			}
		};

		this.validateRubricCategoryFk = function validateRubricCategoryFk (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, this, projectInfoRequestDataService);
		};

		this.asyncValidateBusinesspartnerFk = function asyncValidateBusinesspartnerFk(entity, value, model) {
			return $injector.get('basicsLookupdataLookupDataService').getList('Subsidiary').then(function (data) {
				let mainSubsidiary = _.find(data, {IsMainAddress: true, BusinessPartnerFk: value});
				entity.SubsidiaryFk = mainSubsidiary ? mainSubsidiary.Id : null;

				projectInfoRequestDataService.fireItemModified(entity);

				return platformDataValidationService.finishValidation({
					apply: true,
					valid: true
				}, entity, value, model, this, projectInfoRequestDataService);
			});
		};

	}

})(angular);
