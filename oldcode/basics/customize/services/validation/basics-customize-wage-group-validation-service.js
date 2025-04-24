/**
 * Created by anl on 4/13/2017.
 * Drastically improved by baf on 2018-02-14
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeWageGroupValidationService', BasicsCustomizeWageGroupValidationService);

	BasicsCustomizeWageGroupValidationService.$inject = ['basicsCustomizeWageGroupProcessor'];

	function BasicsCustomizeWageGroupValidationService(basicsCustomizeWageGroupProcessor) {
		const self = this;

		this.validateWageRateTypeFk = function validateWageRateTypeFk(entity, value, model) {
			entity.WageRateTypeFk = value;
			basicsCustomizeWageGroupProcessor.processItem(entity);

			return true;
		};
	}
})(angular);
