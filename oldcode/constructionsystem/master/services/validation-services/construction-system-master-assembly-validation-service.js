/**
 * Created by xsi on 2015-12-21.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterAssemblyValidationService',
		['_', '$translate', 'estimateMainAssemblycatTemplateService', 'estimateMainAssemblyTemplateService',
			'basicsLookupdataLookupDescriptorService', '$http', '$q', 'constructionSystemMasterAssemblyService','platformDataValidationService',
			function (_, $translate, estimateMainAssemblycatTemplateService, estimateMainAssemblyTemplateService,
				basicsLookupdataLookupDescriptorService, $http, $q, constructionSystemMasterAssemblyService,platformDataValidationService) {

				var service = {
					validateEstLineItemFk: function (currentItem, value, model) {
						var result = {apply: true, valid: true};
						if (validationFk(value)) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}else{
							// estimateMainAssemblyTemplateService.getList() may be empty, get data from look up.
							// var estLineItem1 = _.find(estimateMainAssemblyTemplateService.getList(), {Id: value});
							var estLineItem = _.find(basicsLookupdataLookupDescriptorService.getData('estassemblyfk'), {Id: value});
							currentItem.EstAssemblyCatFk = estLineItem.EstAssemblyCatFk;
							currentItem.EstHeaderFk = estLineItem.EstHeaderFk;
							basicsLookupdataLookupDescriptorService.updateData('estassemblycat',
								_.filter(estimateMainAssemblycatTemplateService.getList(), {Id: estLineItem.EstAssemblyCatFk}));
						}
						platformDataValidationService.finishValidation(result, currentItem, value, model, service, constructionSystemMasterAssemblyService);
						return result;
					}
				};
				angular.extend(service,
					{
						validateCode: validateCode
					});

				var onEntityCreated = function onEntityCreated(e, item) {
					service.validateCode(item, item.Code, 'Code');
					service.validateEstLineItemFk(item, item.EstLineItemFk, 'EstLineItemFk');
				};

				constructionSystemMasterAssemblyService.registerEntityCreated(onEntityCreated);

				return service;

				function validateCode(entity, value, model) {
					var result = {apply: true, valid: true};
					if (validationFk(value)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					} else {
						var list = constructionSystemMasterAssemblyService.getList();

						if (Array.isArray(list)) {
							result.valid = !list.some(function (item) {
								return (item.Code === value && item.Id !== entity.Id);
							});
						}

						if (!result.valid) {
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: model});
						}
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, constructionSystemMasterAssemblyService);
					return result;
				}

				function validationFk(value) {
					return (angular.isUndefined(value) || value === null || value === '' || value === -1 || value === 0);
				}
			}]);

})(angular);