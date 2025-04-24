/**
 * Created by anl on 4/13/2017.
 * Drastically improved by baf on 2018-02-14
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeLogisticJobValidationService', BasicsCustomizeLogisticJobValidationService);

	BasicsCustomizeLogisticJobValidationService.$inject = ['basicsCustomizeLogisticJobTypeProcessor', 'basicsCustomizeInstanceDataService', 'platformDataValidationService'];

	function BasicsCustomizeLogisticJobValidationService(basicsCustomizeLogisticJobTypeProcessor, basicsCustomizeInstanceDataService, platformDataValidationService) {
		this.validateIsJointVenture = function validateIsJointVenture(entity, value) {
			entity.IsJointVenture = value;
			basicsCustomizeLogisticJobTypeProcessor.processItem(entity);
			return true;
		};

		this.validateRubricCategoryFk = function validateRubricCategoryFk (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, this, basicsCustomizeInstanceDataService);
		};

	}
})(angular);
