(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name objectMainUnit2ObjUnitValidationService
	 * @description provides validation methods for object header instances
	 */
	var moduleName='object.main';
	angular.module(moduleName).service('objectMainUnit2ObjUnitValidationService', ObjectMainUnit2ObjUnitValidationService);

	ObjectMainUnit2ObjUnitValidationService.$inject = ['$q','$http','objectMainUnitService','platformDataValidationService','objectMainUnit2ObjUnitService', 'allProjectParkingSpaceObjectUnitDataService'];

	function ObjectMainUnit2ObjUnitValidationService($q, $http, objectMainUnitService, platformDataValidationService, objectMainUnit2ObjUnitService, allProjectParkingSpaceObjectUnitDataService) {
		var self = this;

		self.validateUnitParkingSpaceFk = function (entity, value, model) {
			if(value) {
				if(entity.UnitParkingSpaceFk) {
					allProjectParkingSpaceObjectUnitDataService.markAsUnassignedParkingSpace(entity.UnitParkingSpaceFk);
				}
				allProjectParkingSpaceObjectUnitDataService.markAsAssignedParkingSpace(value);
			}

			return platformDataValidationService.validateMandatory(entity, value, model, self, objectMainUnit2ObjUnitService);
		};
	}

})(angular);
