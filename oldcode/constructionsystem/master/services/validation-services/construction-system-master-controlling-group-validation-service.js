(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterControllingGroupValidationService',
		['constructionSystemMasterControllingGroupService',
			'$translate', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService',
			function (constructionSystemMasterControllingGroupService,
				$translate, basicsLookupdataLookupDescriptorService, platformDataValidationService) {
				var service = {};

				angular.extend(service,
					{
						validateMdcControllingGroupFk: validateMdcControllingGroupFk,
						validateCode: validateCode,
						validateMdcControllingGroupDetailFk: validateMdcControllingGroupDetailFk
					});


				var onEntityCreated = function onEntityCreated(e, item) {
					service.validateCode(item, item.Code, 'Code');
					service.validateMdcControllingGroupFk(item, item.MdcControllingGroupFk, 'MdcControllingGroupFk');
					service.validateMdcControllingGroupDetailFk(item, item.MdcControllingGroupDetailFk, 'MdcControllingGroupDetailFk');
				};

				constructionSystemMasterControllingGroupService.registerEntityCreated(onEntityCreated);

				return service;

				function validateMdcControllingGroupFk(entity, value, model) {
					var result = {apply: true, valid: true};
					entity.MdcControllingGroupDetailFk = null;
					if (!value || value === 0) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					constructionSystemMasterControllingGroupService.gridRefresh();
					platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterControllingGroupService);
					return result;
				}

				function validateMdcControllingGroupDetailFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (!entity.MdcControllingGroupFk || entity.MdcControllingGroupFk === 0) {
						var mdcControllingGroupDetailList = basicsLookupdataLookupDescriptorService.getData('controllingGroupDetailLookupDataService');
						var controllingGroupDetail = _.find(mdcControllingGroupDetailList, {Id: value});
						if (controllingGroupDetail) {
							entity.MdcControllingGroupFk = controllingGroupDetail.ControllinggroupFk;
						}
						constructionSystemMasterControllingGroupService.gridRefresh();
					}
					if (!value || value === 0) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterControllingGroupService);
					return result;
				}

				function validateCode(entity, value, model) {
					var result = {apply: true, valid: true};
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterControllingGroupService);
						return result;
					} else {
						var list = constructionSystemMasterControllingGroupService.getList();

						if (Array.isArray(list)) {
							result.valid = !list.some(function (item) {
								return (item.Code === value && item.Id !== entity.Id);
							});
						}

						if (!result.valid) {
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterControllingGroupService);
						return result;
					}
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}
			}]);

})(angular);