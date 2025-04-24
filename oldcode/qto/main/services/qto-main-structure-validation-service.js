/**
 * Created by lnt on 3/22/2018.
 */
(function (angular) {
	'use strict';


	angular.module('qto.main').factory('qtoMainStructureValidationService',
		['_', 'platformRuntimeDataService', '$injector','platformRuntimeDataService', '$translate', 'platformDataValidationService', 'qtoMainStructureDataService',
			function (_, runtimeDataService,$injector, platformRuntimeDataService, $translate, platformDataValidationService, dataService) {
				let service = {};

				service.validateDescription = function (entity, value, model) {
					let itemList = dataService.getList();
					let result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, dataService);
					let qtoMainDetailService = $injector.get('qtoMainDetailService');
					if (result.valid) {
						if (value) {
							entity[model] = value;
							let currentNumber = _.parseInt(value);

							let sheetAreaList = qtoMainDetailService.getSheetAreaList();
							if (sheetAreaList && sheetAreaList.length) {
								if (currentNumber && sheetAreaList.length && sheetAreaList.indexOf(currentNumber) <= -1) {
									result = {
										apply: false, valid: false,
										error: $translate.instant('qto.main.detail.addressOverflow')
									};
									platformRuntimeDataService.applyValidationResult(result, entity, model);
									platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
								}
							}

							if (result.valid) {
								if (currentNumber >= 0) {
									let parentItem = _.find(itemList, {'Id': entity.QtoSheetFk});
									let pageNumberDesAarry = _.split(parentItem.Description, '-');
									if (pageNumberDesAarry && pageNumberDesAarry.length === 2) {
										let stratNumber = _.parseInt(pageNumberDesAarry[0]) === 0 ? 1 : _.parseInt(pageNumberDesAarry[0]);
										let endNumber = _.parseInt(pageNumberDesAarry[1]);
										if (stratNumber > currentNumber || currentNumber > endNumber) {
											result = {
												apply: false, valid: false,
												error: $translate.instant('qto.main.sheetScope')
											};
										}
									}
								}

								if (result.valid) {
									entity.Description = dataService.leftPadZero(currentNumber, 4);
									let qtoDetails = qtoMainDetailService.getList();
									let filterDetails = _.filter(qtoDetails, {'QtoSheetFk': entity.Id});
									_.forEach(filterDetails, function (detail) {
										detail.PageNumber = _.parseInt(currentNumber);
									});
									qtoMainDetailService.markEntitiesAsModified(filterDetails);
								}

								platformRuntimeDataService.applyValidationResult(result, entity, model);
								platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							}
						}
					}
					return result;
				};

				return service;
			}
		]);
})(angular);