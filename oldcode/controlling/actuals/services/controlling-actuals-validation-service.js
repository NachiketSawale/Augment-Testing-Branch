/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.actuals';

	/**
	 * @ngdoc service
	 * @name controllingActualsValidationService
	 * @function
	 *
	 * @description
	 * This service provides validation methods of controlling-actuals
	 */
	angular.module(moduleName).factory('controllingActualsValidationService', ['moment', '_', 'platformDataValidationService',
		'platformRuntimeDataService', '$translate', 'controllingActualsCostHeaderListService','basicsLookupdataLookupDescriptorService',
		function (moment, _, platformDataValidationService, platformRuntimeDataService, $translate, dataService, basicsLookupdataLookupDescriptorService) {
			let service = {};

			service.validateCode = function (entity, newCode) {
				let fieldErrorTr = {fieldName: $translate.instant('cloud.common.entityCode')};
				let result = platformDataValidationService.isMandatory(newCode, 'Code', fieldErrorTr);
				if (!result.valid) {
					return platformDataValidationService.finishValidation(result, entity, newCode, 'Code', service, dataService);
				}

				let item = _.find(dataService.getList(), function (item) {
					return _.get(item, 'Code') === newCode && item.Id !== entity.Id;
				});

				let res = item ? platformDataValidationService.createErrorObject('controlling.actuals.errorCodeMustBeUniquePrjContext') : platformDataValidationService.createSuccessObject();

				return platformDataValidationService.finishValidation(res, entity, newCode, 'Code', service, dataService);
			};

			service.validateCompanyYearFk = function validateCompanyYearFk(entity, value) {
				let result;
				let fieldErrorTr = {fieldName: 'Company Year Service'};

				let checkValue = value === -1 ? null : value;
				result = platformDataValidationService.isMandatory(checkValue, 'CompanyYearFk', fieldErrorTr);

				if(result.valid){
					result = checkRepeated(entity, value, 'CompanyYearFk');
				}

				service.validateCompanyPeriodFk(entity, null);

				return platformDataValidationService.finishValidation(result, entity, checkValue, 'CompanyYearFk', service, dataService);
			};

			service.validateCompanyPeriodFk = function validateCompanyPeriodFk(entity, value) {
				let result;
				let fieldErrorTr = {fieldName: 'Trading Period'};

				let checkValue = value === -1 ? null : value;
				result = platformDataValidationService.isMandatory(checkValue, 'CompanyPeriodFk', fieldErrorTr);

				if(result.valid){
					result = checkRepeated(entity, value, 'CompanyPeriodFk');
					handleCompanyPeriodDate(entity, value);
				}

				return platformDataValidationService.finishValidation(result, entity, checkValue, 'CompanyPeriodFk', service, dataService);
			};

			service.validateValueTypeFk = function (entity, value){
				let result = checkRepeated(entity, value, 'ValueTypeFk');
				return platformDataValidationService.finishValidation(result, entity, value, 'ValueTypeFk', service, dataService);
			};

			service.validateProjectFk = function (entity, value){
				let result = checkRepeated(entity, value, 'ProjectFk');
				return platformDataValidationService.finishValidation(result, entity, value, 'ProjectFk', service, dataService);
			};

			function checkRepeated(entity, value, field){
				entity[field] = value;
				dataService.addRepeatCheckKey(entity);

				let item = _.find(dataService.getList(), function (item) {
					return _.get(item, 'RepeatCheckKey') === entity.RepeatCheckKey && item.Id !== entity.Id;
				});

				if(item){
					return platformDataValidationService.createErrorObject('controlling.actuals.errorHeadRepeatRecordKey', {object: field.toLowerCase()});
				}

				clearRepeatError(entity, field);
				return platformDataValidationService.createSuccessObject();
			}

			function clearRepeatError(entity, field){
				if(entity.__rt$data && entity.__rt$data.errors){
					let columns = ['CompanyYearFk', 'CompanyPeriodFk', 'ValueTypeFk', 'ProjectFk'];
					_.forEach(columns, function (column){
						if(column !== field) {
							if(entity.__rt$data.errors[column] && entity.__rt$data.errors[column].error$tr$ === 'controlling.actuals.errorHeadRepeatRecordKey'){
								delete entity.__rt$data.errors[column];
								platformDataValidationService.finishValidation(true, entity, null, column, service, dataService);
							}
						}
					});
				}
			}

			function handleCompanyPeriodDate(entity, value) {
				let item = basicsLookupdataLookupDescriptorService.getLookupItem('CompanyPeriodCache', value);
				entity.CompanyPeriod = item;
				let startMoment = moment(item.StartDate);
				let endMoment = moment(item.EndDate);
				entity.CompanyPeriodFkStartDate = moment.utc(startMoment, 'L', false);
				entity.CompanyPeriodFkEndDate = moment.utc(endMoment, 'L', false);
			}

			return service;
		}
	]);
})(angular);