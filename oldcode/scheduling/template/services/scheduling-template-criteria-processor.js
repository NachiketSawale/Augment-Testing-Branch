/**
 * Created by benny on 26.01.2017.
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesWicItemProcessor
	 * @function
	 *
	 * @description
	 * The estimateAssembliesWicItemProcessor is the service set assembly wic item readonly or editable.
	 */
	var moduleName = 'scheduling.template';

	angular.module(moduleName).service('schedulingTemplateCriteriaProcessor', SchedulingTemplateCriteriaProcessor);

	SchedulingTemplateCriteriaProcessor.$inject = ['platformRuntimeDataService'];

	function SchedulingTemplateCriteriaProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(entity) {
			setPropertyReadOnly(entity, 'HeaderWicFk', !(entity && !!entity.CategoryWicFk));
			setPropertyReadOnly(entity, 'CatalogWicFk', !(entity && !!entity.CategoryWicFk));
			setPropertyReadOnly(entity, 'ItemWicFk', !(entity && !!entity.HeaderWicFk));
		};

		this.processItemAfterCategoryChange = function processItem(entity, value) {
			setPropertyReadOnly(entity, 'HeaderWicFk', !(entity && !!value));
			setPropertyReadOnly(entity, 'CatalogWicFk', !(entity && !!value));
			setPropertyReadOnly(entity, 'ItemWicFk', !(entity && !!entity.HeaderWicFk));
		};

		this.processItemAfterHeaderChange = function processItem(entity, value) {
			setPropertyReadOnly(entity, 'ItemWicFk', !(entity && !!value));
		};

		function setPropertyReadOnly(entity, model, flag) {
			var fields = [
				{field: model, readonly: flag}
			];
			platformRuntimeDataService.readonly(entity, fields);
		}
	}
})(angular);
