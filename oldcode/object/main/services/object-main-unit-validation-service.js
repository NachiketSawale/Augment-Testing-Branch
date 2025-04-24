(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name objectMainUnitValidationService
	 * @description provides validation methods for object header instances
	 */
	var moduleName = 'object.main';
	angular.module(moduleName).service('objectMainUnitValidationService', ObjectMainUnitValidationService);

	ObjectMainUnitValidationService.$inject = ['$q', '$http', '$injector', '$translate', 'platformDataValidationService', 'objectMainUnitService', 'platformRuntimeDataService', 'basicsCompanyNumberGenerationInfoService'];

	function ObjectMainUnitValidationService($q, $http, $injector, $translate, platformDataValidationService, objectMainUnitService, platformRuntimeDataService, basicsCompanyNumberGenerationInfoService) {
		var self = this;

		self.validateCode = function (entity, value, model) {
			var items = objectMainUnitService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, self, objectMainUnitService);
		};

		self.asyncValidateIsParkingSpace = function (entity, value) {
			var resultk = {apply: true, valid: true};

			if (entity.IsParkingSpace === true && value === false) {
				var url = globals.webApiBaseUrl + 'object/main/unit/isunit2objunitbyproject?unitId=' + entity.Id;

				return $http.get(url).then(function (result) {
						if (result.data === true) {// true:unit2objunit has value
							//resultk.valid = false;
							resultk.apply = false;
							//resultk.error = 'Error: Is parking space is in a relationship'; //.error = $translate.instant('object.main.isParkingSpaceError');
							platformRuntimeDataService.readonly(entity, [{ field: 'IsParkingSpace', readonly: true}]);
							return resultk;
						}
						else {
							return resultk;
						}
					},
					function (/*error*/) {
						return true;
					});
			}

			return $q.when(true);
		};

		self.asyncValidateUnitTypeFk = function asyncValidateUnitTypeFk(entity, value, model) {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/objectunitsubtype/list').then(function (response) {
				let res = _.find(response.data, {UnittypeFk: value, IsDefault: true});
				if (!_.isNil(res)) {
					objectMainUnitService.getSelected().UnitSubTypeFk = res.Id;
				} else {
					objectMainUnitService.getSelected().UnitTypeSpecFk = null;
				}
				objectMainUnitService.fireItemModified(entity);
				objectMainUnitService.gridRefresh();
				return $http.post(globals.webApiBaseUrl + 'basics/customize/objectunittypespec/list').then(function (response) {
					let res = _.find(response.data, {UnittypeFk: value, IsDefault: true});
					if (!_.isNil(res)) {
						objectMainUnitService.getSelected().UnitTypeSpecFk = res.Id;
					} else {
						objectMainUnitService.getSelected().UnitTypeSpecFk = null;
					}
					objectMainUnitService.fireItemModified(entity);
					objectMainUnitService.gridRefresh();
					return platformDataValidationService.finishValidation({valid: true}, entity, value, model, self, objectMainUnitService);
				});
			});
		};

		self.validateUnitSubTypeFk = function validateUnitSubTypeFk(entity, value, model) {
			var items = objectMainUnitService.getList();
			return platformDataValidationService.validateMandatory(entity, value, model, self, objectMainUnitService);
		};

		self.validateUnitTypeSpecFk = function validateUnitTypeSpecFk(entity, value, model) {
			var items = objectMainUnitService.getList();
			return platformDataValidationService.validateMandatory(entity, value, model, self, objectMainUnitService);
		};

		self.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value, model) {
				if (entity.RubricCategoryFk !== value || entity.Version === 0) {
					let infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('objectMainUnitNumberInfoService', value);
					if (infoService.hasToGenerateForRubricCategory(value)) {
						entity.Code = infoService.provideNumberDefaultText(value, entity.Code);
						self.validateAdditionalCode(entity,null,'Code',true);
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
					} else {
						entity.Code = '';
						self.validateAdditionalCode(entity,null,'Code',true);
						platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
					}

					return platformDataValidationService.finishValidation(!_.isNil(value), entity, value, model, self, objectMainUnitService);
				}
		};

		self.validateAdditionalCode = function (entity, value, model,isExternalCall) {
			if(isExternalCall) {
				if (!_.isNil(entity.Code) && entity.Code !== '') {
					return removeMandatory(entity, model);
				}
				else {
					return addMandatory(entity, model);
				}
			}
		};

		function removeMandatory(entity, model){
			var result = {apply: true, valid: false};
			result.apply = true;
			result.valid = true;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, true, model, self, objectMainUnitService);
			return result;
		}

		function addMandatory(entity, model) {
			var result = {apply: true, valid: false};
			result.apply = true;
			result.valid = false;
			result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', { fieldName: model });
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, false, model, self, objectMainUnitService);
			return result;
		}

	}

})(angular);
