/**
 * Created by chd on 12/9/2021.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.meeting';

	angular.module(moduleName).factory('basicsMeetingValidationService', ['$http', 'platformRuntimeDataService', 'platformDataValidationService', '$translate', 'basicsLookupdataLookupDataService',
		function ($http, platformRuntimeDataService, platformDataValidationService, $translate, basicsLookupdataLookupDataService) {

			return function (dataService) {

				let service = {};

				service.validateCode = function (entity, value) {
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', dataService.getList(), service, dataService);
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, field) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);
					let url = globals.webApiBaseUrl + 'basics/meeting/isuniquecode?code=' + value;
					asyncMarker.myPromise = $http.get(url).then(function (response) {
						let res = {};
						if (response.data) {
							res = {apply: true, valid: true, error: ''};
						} else {
							res.valid = false;
							res.apply = true;
							res.error = 'The Code should be unique';
							res.error$tr$ = 'basics.meeting.uniqCode';
						}
						platformDataValidationService.finishAsyncValidation(res, entity, value, field, asyncMarker, service, dataService);

						return res;
					});

					return asyncMarker.myPromise;
				};

				service.validateStartTime = function (entity, value, model) {
					let result = {
						apply: true,
						valid: true
					};
					if (value !== null && entity.FinishTime) {
						if (value > entity.FinishTime) {
							result.apply = false;
							result.valid = false;
							result.error = $translate.instant('cloud.common.Error_EndDateTooEarlier');
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							let resultOfValidFinishTime = {
								apply: true,
								valid: false
							};
							platformDataValidationService.finishValidation(resultOfValidFinishTime, entity, entity.FinishTime, 'FinishTime', service, dataService);
							return result;
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'FinishTime');
					platformDataValidationService.finishValidation(true, entity, entity.StartTime, 'FinishTime', service, dataService);
					return result;
				};

				service.validateFinishTime = function (entity, value, model) {
					let result = {
						apply: true,
						valid: true
					};
					if (value !== null && entity.StartTime) {
						if (entity.StartTime > value) {
							result.apply = false;
							result.valid = false;
							result.error = $translate.instant('cloud.common.Error_EndDateTooEarlier');
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							let resultOfValidStartTime = {
								apply: true,
								valid: false
							};
							platformDataValidationService.finishValidation(resultOfValidStartTime, entity, entity.StartTime, 'StartTime', service, dataService);
							return result;
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'StartTime');
					platformDataValidationService.finishValidation(true, entity, entity.StartTime, 'StartTime', service, dataService);
					return result;
				};

				// validate RfqHeaderFk
				service.validateRfqHeaderFk = function validateRfqHeaderFk(entity, value) {
					if (!value) {
						return true;
					}

					if (entity.RfqHeaderFk !== value) {
						if (!entity || !value) {
							return true;
						}

						// Sets ProjectFk
						basicsLookupdataLookupDataService.getItemByKey('RfqHeaderLookup', value).then(function (item) {
							entity.ProjectFk = item.ProjectFk;
						});
					}
					return true;
				};

				// validate QtnHeaderFk
				service.validateQtnHeaderFk = function validateQtnHeaderFk(entity, value) {
					if (!value) {
						return true;
					}

					if (entity.QtnHeaderFk !== value) {
						if (!entity || !value) {
							return true;
						}

						// Sets ProjectFk
						basicsLookupdataLookupDataService.getItemByKey('Quote', value).then(function (item) {
							entity.ProjectFk = item.ProjectFk;
						});
					}
					return true;
				};

				// validate CheckListFk
				service.validateCheckListFk = function validateCheckListFk(entity, value) {
					if (!value) {
						return true;
					}

					if (entity.CheckListFk !== value) {
						if (!entity || !value) {
							return true;
						}

						// Sets ProjectFk
						basicsLookupdataLookupDataService.getItemByKey('CheckList', value).then(function (item) {
							entity.ProjectFk = item.PrjProjectFk;
						});
					}
					return true;
				};

				// validate BidHeaderFk
				service.validateBidHeaderFk = function validateBidHeaderFk(entity, value) {
					if (!value) {
						return true;
					}

					if (entity.BidHeaderFk !== value) {
						if (!entity || !value) {
							return true;
						}

						// Sets ProjectFk
						basicsLookupdataLookupDataService.getItemByKey('SalesBid', value).then(function (item) {
							entity.ProjectFk = item.ProjectFk;
						});
					}
					return true;
				};

				// validate DefectFk
				service.validateDefectFk = function validateDefectFk(entity, value) {
					if (!value) {
						return true;
					}

					if (entity.DefectFk !== value) {
						if (!entity || !value) {
							return true;
						}

						// Sets ProjectFk
						basicsLookupdataLookupDataService.getItemByKey('referenceDefectLookup', value).then(function (item) {
							entity.ProjectFk = item.PrjProjectFk;
						});
					}
					return true;
				};

				// validate PrjInfoRequestFk
				service.validatePrjInfoRequestFk = function validatePrjInfoRequestFk(entity, value) {
					if (!value) {
						return true;
					}

					if (entity.PrjInfoRequestFk !== value) {
						if (!entity || !value) {
							return true;
						}

						// Sets ProjectFk
						basicsLookupdataLookupDataService.getItemByKey('ProjectInfoRequest', value).then(function (item) {
							entity.ProjectFk = item.ProjectFk;
						});
					}
					return true;
				};

				return service;
			};
		}
	]);
})(angular);
