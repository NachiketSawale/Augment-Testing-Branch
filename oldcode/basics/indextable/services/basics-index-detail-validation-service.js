/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name basicsIndexDetailValidationService
     * @description provides validation methods for site instances
     */
	let moduleName = 'basics.indextable';
	angular.module(moduleName).factory('basicsIndexDetailValidationService', [
		'$http', '$q', '_', 'platformDataValidationService','basicsIndexDetailService', 'platformObjectHelper', 'platformRuntimeDataService', 'moment',
		function ($http, $q, _, platformDataValidationService, basicsIndexDetailService, platformObjectHelper, platformRuntimeDataService, moment) {
			let service = {};

			service.validateQuantity = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, basicsIndexDetailService);
			};

			service.validateDate = function (entity, value, model) {
				let result =  platformDataValidationService.validateMandatory(entity, value, model, service, basicsIndexDetailService);

				if (result.valid){
					let itemList = basicsIndexDetailService.getList();
					result = validateIsUniqueDate(entity, value, model, itemList, service, basicsIndexDetailService);
				}
				return result;
			};

			return service;

			function validateIsUniqueDate(entity, value, model, itemList, validationService, dataService) {

				let res = isValueUniqueDate(itemList, model, value, entity.Id, {object: model.toLowerCase()});

				// Apply validation when it is created from create button
				platformRuntimeDataService.applyValidationResult(res, entity, model);

				return platformDataValidationService.finishValidation(res, entity, value, model, validationService, dataService);
			}

			function isValueUniqueDate(itemList, model, value, id, errorParam) {
				let valueDate = moment.utc(value);
				let valueDateYear = valueDate.format('YYYY');
				let valueDateMonth = valueDate.format('MM');
				let valueDateDay = valueDate.format('DD');

				let item = _.find(itemList, function (item) {
					let itemDate = moment.utc(platformObjectHelper.getValue(item, model));
					let itemDateYear = itemDate.format('YYYY');
					let itemDateMonth = itemDate.format('MM');
					let itemDateDay = itemDate.format('DD');

					return (itemDateYear === valueDateYear && itemDateMonth === valueDateMonth && itemDateDay === valueDateDay) && item.Id !== id;
				});

				if (item) {
					return platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || {object: model.toLowerCase()});
				}

				return platformDataValidationService.createSuccessObject();
			}
		}

	]);
})(angular);

