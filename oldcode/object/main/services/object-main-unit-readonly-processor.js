/**
 * Created by Baedeker on 28.07.2014.
 */

(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitReadonlyProcessor
	 * @function
	 *
	 * @description
	 * This service controls changeability of object unit properties
	 */
	angular.module(moduleName).service('objectMainUnitReadonlyProcessor', ObjectMainUnitReadonlyProcessor);

	ObjectMainUnitReadonlyProcessor.$inject = ['platformRuntimeDataService', 'basicsCompanyNumberGenerationInfoService'];

	function ObjectMainUnitReadonlyProcessor(platformRuntimeDataService, basicsCompanyNumberGenerationInfoService) {
		var self = this;

		this.processItem = function processItem(unit) {
			platformRuntimeDataService.readonly(unit, [{ field: 'IsParkingSpace', readonly: self.isParkingSpaceReadonly(unit) }]);
			// if (unit.Version > 0) {
			// 	platformRuntimeDataService.readonly(unit, [{ field: 'UnitTypeFk', readonly: true }]);
			// }
				if (unit.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('objectMainUnitNumberInfoService').hasToGenerateForRubricCategory(unit.RubricCategoryFk)) {
					unit.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('objectMainUnitNumberInfoService').provideNumberDefaultText(unit.RubricCategoryFk, unit.Code);
					fields.push({field: 'Code', readonly: true});

					platformRuntimeDataService.readonly(unit, fields);
				}
		};

		this.isParkingSpaceReadonly = function isParkingSpaceReadonly(unit) {
			return (unit.IsParkingSpace && unit.IsAssignedParkingSpace) || (!unit.IsParkingSpace && unit.HasParkingSpaceAssigned);
		};
	}

})(angular);
