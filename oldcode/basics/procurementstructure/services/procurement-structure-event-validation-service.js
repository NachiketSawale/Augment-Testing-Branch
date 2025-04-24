(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W074 */
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructureEventValidationService',
		['validationService', 'platformDataValidationService', 'basicsProcurementEventService',
			'platformRuntimeDataService', '$translate',
			function (validationService, platformDataValidationService, dataService, platformRuntimeDataService, $translate) {
				var service = validationService.create('structureEvent', 'basics/procurementstructure/event/schema');

				service.validatePrcSystemEventTypeStartFk = function (entity, value) {
					var isReadOnly = true;
					if (value === null) {
						isReadOnly = false;
					}
					entity.PrcEventTypeStartFk = null;
					dataService.updateReadOnly(entity, 'PrcEventTypeStartFk', isReadOnly);
					return {
						apply: true,
						error: '',
						valid: true
					};
				};

				service.validatePrcEventTypeStartFk = function (entity, value) {
					var isReadOnly = true;
					if (value === null) {
						isReadOnly = false;
					}
					entity.PrcSystemEventTypeStartFk = null;
					dataService.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', isReadOnly);
					return {
						apply: true,
						error: '',
						valid: true
					};
				};

				service.validatePrcSystemEventTypeEndFk = function (entity, value) {
					var isReadOnly = true;
					if (value === null) {
						isReadOnly = false;
					}
					entity.PrcEventTypeEndFk = null;
					dataService.updateReadOnly(entity, 'PrcEventTypeEndFk', isReadOnly);
					return {
						apply: true,
						error: '',
						valid: true
					};
				};

				service.validatePrcEventTypeEndFk = function (entity, value) {
					var isReadOnly = true;
					if (value === null) {
						isReadOnly = false;
					}
					entity.PrcSystemEventTypeEndFk = null;
					dataService.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', isReadOnly);
					return {
						apply: true,
						error: '',
						valid: true
					};
				};

				service.validatePrcEventTypeFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.apply) {
						result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, true);
						if (!result.apply) {
							result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.eventTypeUniqueError');
						}
					}

					entity.PrcEventTypeFk = value;

					dataService.eventTypeRelatedReadOnlyAndValue(entity, value);
					service.validateStartNoOfDays(entity,entity.StartNoOfDays, 'StartNoOfDays');
					service.validateStartBasis(entity,entity.StartBasis, 'StartBasis');

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.validateSorting = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.apply) {
						result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Sorting, true);
						if (!result.apply) {
							result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.eventTypeUniqueError');
						}
					}

					return result;
				};

				service.validateStartNoOfDays = function (entity, value, model) {

					var result = platformDataValidationService.isMandatory(value, model);

					if(dataService.eventTypeRelatedIsMandatory(entity))
					{
						result = platformDataValidationService.createSuccessObject();
					}

					if (!result.apply) {
						result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.filedNullErrorMessage',
							{field: '' + $translate.instant('basics.procurementstructure.startNoOfDays') + ''});
					} else {
						entity.StartNoOfDays = value;
					}

					dataService.gridRefresh();
					return result;
				};

				service.validateEndNoOfDays = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (!result.apply) {
						result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.filedNullErrorMessage',
							{field: '' + $translate.instant('basics.procurementstructure.endNoOfDays') + ''});
					} else {
						entity.EndNoOfDays = value;
					}
					dataService.gridRefresh();
					return result;
				};


				service.validateStartBasis = function (entity, value, model) {
					value = value === 0 ? null : value;

					switch (value) {
						case 1:
						case 2:
							entity.PrcSystemEventTypeStartFk = null;
							entity.PrcEventTypeStartFk = null;
							dataService.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', true);
							dataService.updateReadOnly(entity, 'PrcEventTypeStartFk', true);
							break;
						case 3:
						case 4:
							entity.PrcEventTypeStartFk = null;
							dataService.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', false);
							dataService.updateReadOnly(entity, 'PrcEventTypeStartFk', true);
							break;
						case 5:
						case 6:
						case 7:
						case 8:
							entity.PrcSystemEventTypeStartFk = null;
							dataService.updateReadOnly(entity, 'PrcEventTypeStartFk', false);
							dataService.updateReadOnly(entity, 'PrcSystemEventTypeStartFk', true);
							break;
					}
					dataService.updateReadOnly(entity, 'AddLeadTimeToStart', value === 1);
					var result = platformDataValidationService.isMandatory(value, model);

					if (!result.apply) {
						result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.filedNullErrorMessage',
							{field: '' + $translate.instant('basics.procurementstructure.startBasis') + ''});
					}

					handleError(result, entity, model);
					dataService.gridRefresh();
					return result;
				};

				service.validateEndBasis = function (entity, value, model) {
					value = value === 0 ? null : value;

					switch (value) {
						case 1:
						case 2:
							entity.PrcSystemEventTypeEndFk = null;
							entity.PrcEventTypeEndFk = null;
							dataService.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', true);
							dataService.updateReadOnly(entity, 'PrcEventTypeEndFk', true);
							break;
						case 3:
						case 4:
							entity.PrcEventTypeEndFk = null;
							dataService.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', false);
							dataService.updateReadOnly(entity, 'PrcEventTypeEndFk', true);
							break;
						case 5:
						case 6:
						case 7:
						case 8:
							entity.PrcSystemEventTypeEndFk = null;
							dataService.updateReadOnly(entity, 'PrcSystemEventTypeEndFk', true);
							dataService.updateReadOnly(entity, 'PrcEventTypeEndFk', false);
							break;
					}
					dataService.updateReadOnly(entity, 'AddLeadTimeToEnd', value === 1);
					var result = platformDataValidationService.isMandatory(value, model);
					if (!result.apply) {
						result.error = result.error$tr$ = $translate.instant('basics.procurementstructure.filedNullErrorMessage',
							{field: '' + $translate.instant('basics.procurementstructure.endBasis') + ''});
					}
					return result;
				};

				function onEntityCreated(e, entity) {
					var result = service.validatePrcEventTypeFk(entity, entity.PrcEventTypeFk, 'PrcEventTypeFk');
					platformRuntimeDataService.applyValidationResult(result, entity, 'PrcEventTypeFk');

					result = service.validateStartBasis(entity, entity.StartBasis, 'StartBasis');
					platformRuntimeDataService.applyValidationResult(result, entity, 'StartBasis');

					result = service.validateEndBasis(entity, entity.EndBasis, 'EndBasis');
					platformRuntimeDataService.applyValidationResult(result, entity, 'EndBasis');

					dataService.gridRefresh();
				}

				dataService.registerEntityCreated(onEntityCreated);

				function handleError(result, entity, model) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					} else {
						removeError(entity, model);
					}
				}

				function removeError(entity, field) {
					if (entity.__rt$data && entity.__rt$data.errors && entity.__rt$data.errors[field]) {
						entity.__rt$data.errors[field] = null;
					}
				}

				return service;
			}
		]);
})(angular);
