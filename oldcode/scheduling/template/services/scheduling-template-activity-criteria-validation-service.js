/**
 * Created by baf on 2017/10/06
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityCriteriaValidationService
	 * @description provides validation methods for ActivityTemplateEvent instances
	 */
	angular.module('scheduling.template').service('schedulingTemplateActivityCriteriaValidationService', SchedulingTemplateActivityCriteriaValidationService);

	SchedulingTemplateActivityCriteriaValidationService.$inject = ['schedulingTemplateCriteriaProcessor', 'boqHeaderLookupDataService'];

	function SchedulingTemplateActivityCriteriaValidationService(schedulingTemplateCriteriaProcessor, boqHeaderLookupDataService) {
		this.validateCategoryWicFk = function validateCategoryWicFk(entity, value) {
			entity.CatalogWicFk = null;
			entity.HeaderWicFk = null;
			entity.ItemWicFk = null;
			schedulingTemplateCriteriaProcessor.processItemAfterCategoryChange(entity, value);
			return true;
		};

		this.validateCatalogWicFk = function validateCatalogWicFk(entity, value) {
			entity.ItemWicFk = null;
			entity.HeaderWicFk = null;
			if(value) {
				var sel = boqHeaderLookupDataService.getItemById(value, {
					lookupType: 'boqHeaderLookupDataService'
				});
				entity.HeaderWicFk = sel.BoqHeaderFk;
			}

			schedulingTemplateCriteriaProcessor.processItemAfterHeaderChange(entity, value);
			return true;
		};
	}

})(angular);
