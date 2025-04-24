/**
 * Created by Frank Baedeker on 23.04.2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainProjectValidator
	 * @description provides validation methods for project entities
	 */
	angular.module(moduleName).service('projectMainProjectNewEntityValidator', ProjectMainProjectNewEntityValidator);

	ProjectMainProjectNewEntityValidator.$inject = ['_', '$injector'];

	function ProjectMainProjectNewEntityValidator(_, $injector) {
		var self = this;

		let valService = null;

		this.AssertValidationService = function assertValidationService () {
			if(valService === null) {
				valService = $injector.get('projectMainProjectValidationService');
			}
		};

		this.setPropToNullIfZeroAndTriggerValidation = function setPropToNullIfZeroAndTriggerValidation(record, model) {
			if(record[model] === 0) {
				record[model] = null;
			}

			var valFunc = 'validate' + model;

			valService[valFunc](record, record[model], model);
		};

		this.validate = function validate (entity) {
			var fields = ['RubricCategoryFk', 'CatalogConfigTypeFk', 'ProjectGroupFk', 'ClerkFk','ProjectNo'];
			self.AssertValidationService();

			_.forEach(fields, field => self.setPropToNullIfZeroAndTriggerValidation(entity, field));
		};

	}
})(angular);
