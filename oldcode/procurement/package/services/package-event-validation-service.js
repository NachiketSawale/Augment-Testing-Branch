/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	/* global _,moment */
	'use strict';

	angular.module('procurement.package').factory('procurementPackageEventValidationService',
		['$timeout', 'platformDataValidationService', 'platformPropertyChangedUtil', 'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService', '$injector',
			/* jshint -W072 */
			function ($timeout, platformDataValidationService, platformPropertyChangedUtil, lookupDescriptorService,
				platformRuntimeDataService, $injector) {

				function constructor(dataService, parentService) {

					var service = {}, result;

					function updateCurentItem(entity) {
						entity.StartRelevant = entity.StartActual ? entity.StartActual : entity.StartOverwrite ? entity.StartOverwrite : entity.StartCalculated ? entity.StartCalculated : null;
						entity.EndRelevant = entity.EndActual ? entity.EndActual : entity.EndOverwrite ? entity.EndOverwrite : entity.EndCalculated ? entity.EndCalculated : null;

						entity.StartActualBool = !!entity.StartActual;
						entity.EndActualBool = !!entity.EndActual;
					}

					function updateParentItem(entity/* , model, value */) {
						var eventType = _.find(lookupDescriptorService.getData('PrcEventType'), {Id: entity.PrcEventTypeFk});
						/** @namespace eventType.IsMainEvent */
						if (!eventType.IsMainEvent) {
							return;
						}
						entity.PrcEventTypeDto = eventType;
						if (parentService) {
							parentService.firePrcEventProperChanged(entity);
						}
					}

					// eslint-disable-next-line no-unused-vars
					var res = null;

					service.validatePrcEventTypeFk = function (entity, value, model) {
						result = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), model, value, entity.Id, {object: 'event type'});
						if (result.valid) {
							var eventType = _.find(lookupDescriptorService.getData('PrcEventType'), {Id: value});
							var originEventType = _.find(lookupDescriptorService.getData('PrcEventType'), {Id: entity.PrcEventTypeFk});
							if (eventType) {
								// to set PrcEventTypeDto according PrcEventTypeFk
								entity.PrcEventTypeDto = eventType;
								// //set selected package's StartRelevant null when HasStartDate is null
								if (!entity.PrcEventTypeDto.HasStartDate) {
									entity.StartOverwrite = null;
									entity.StartRelevant = entity.PrcEventTypeDto.startactual;
								}
								updateCurentItem(entity);
								dataService.updateReadOnly(entity, 'StartOverwrite');

								// update parent item
								var sameAsSelectedCount = _.filter(dataService.getList(), function (item) {
									return item.PrcEventTypeFk === entity.PrcEventTypeFk;
								}).length;// sum the same item with Entity.PrcEventTypeFk
								if (parentService) {
									if (sameAsSelectedCount < 2) {
										parentService.firePrcEventProperChanged(entity, originEventType);
									} else {
										parentService.firePrcEventProperChanged(entity, null);
									}
								}

							}
						}
						res = platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					};

					service.validateStartOverwrite = function (entity, value, model) {
						result = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), 'PrcEventTypeFk', entity.PrcEventTypeFk, entity.Id, {object: 'event type'});
						// eslint-disable-next-line no-prototype-builtins
						if (result.hasOwnProperty('valid') && !result.valid) {
							return result;
						}
						result = platformDataValidationService.validatePeriod(value, entity.EndOverwrite, entity, model, service, dataService, 'EndOverwrite');
						// eslint-disable-next-line no-prototype-builtins
						if (result.hasOwnProperty('valid') && !result.valid) {
							return result;
						}
						entity.StartOverwrite = value;
						autoUpdateChainedEventsStart(entity);
						updateCurentItem(entity);
						updateParentItem(entity, model, value);
						return result;

					};

					service.validateEndOverwrite = function (entity, value, model) {
						result = platformDataValidationService.isUniqueAndMandatory(dataService.getList(), 'PrcEventTypeFk', entity.PrcEventTypeFk, entity.Id, {object: 'event type'});
						// eslint-disable-next-line no-prototype-builtins
						if (result.hasOwnProperty('valid') && !result.valid) {
							return result;
						}
						result = platformDataValidationService.validatePeriod(entity.StartOverwrite, value, entity, model, service, dataService, 'StartOverwrite');
						// eslint-disable-next-line no-prototype-builtins
						if (result.hasOwnProperty('valid') && !result.valid) {
							return result;
						}
						entity.EndOverwrite = value;
						autoUpdateChainedEventsEnd(entity);
						updateCurentItem(entity);
						updateParentItem(entity, model, value);
						return result;
					};

					function systemOptionIsAutoUpdateChainedEvents() {
						var systemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
						if (!systemoptionLookupDataService) {
							return false;
						}
						var systemOptions = systemoptionLookupDataService.getList();
						if (systemOptions && systemOptions.length > 0) {
							var item = _.find(systemOptions, {Id: 10069});
							if (item) {
								return item.ParameterValue === '1' || item.ParameterValue === 'true';
							}
						}
						return false;
					}

					function whilePrcEventsTyoe(list, id, ventsTypeList, isStart) {
						var itemId = angular.copy(id);
						if (isStart) {
							while (_.find(list, {PrcEventTypeFk: itemId}) && _.find(list, {PrcEventTypeFk: itemId}).PrcEventTypeStartFk) {
								itemId = _.find(list, {PrcEventTypeFk: itemId}).PrcEventTypeStartFk;
							}
							while (_.find(list, {PrcEventTypeStartFk: itemId}) && ventsTypeList.indexOf(itemId) === -1) {
								var startEventType = _.find(list, {PrcEventTypeStartFk: itemId});
								ventsTypeList.push(itemId);
								itemId = startEventType.PrcEventTypeFk;
							}
							if (_.find(list, {PrcEventTypeFk: itemId})) {
								ventsTypeList.push(itemId);
							}
						} else {
							while (_.find(list, {PrcEventTypeFk: itemId}) && _.find(list, {PrcEventTypeFk: itemId}).PrcEventTypeEndFk) {
								itemId = _.find(list, {PrcEventTypeFk: itemId}).PrcEventTypeEndFk;
							}
							while (_.find(list, {PrcEventTypeEndFk: itemId}) && ventsTypeList.indexOf(itemId) === -1) {
								var endEventType = _.find(list, {PrcEventTypeEndFk: itemId});
								ventsTypeList.push(itemId);
								itemId = endEventType.PrcEventTypeFk;
							}
							if (_.find(list, {PrcEventTypeFk: itemId})) {
								ventsTypeList.push(itemId);
							}
						}
					}

					function IsBeforePrcEventsType(entity, eventItem, isStart) {
						var outList = [];
						whilePrcEventsTyoe(dataService.procurementStructureEventList, entity.PrcEventTypeFk, outList, isStart);
						return outList.length > 0 && outList.indexOf(eventItem.PrcEventTypeFk) > -1;
					}

					function autoUpdateChainedEventsStart(entity) {
						if (systemOptionIsAutoUpdateChainedEvents() && entity.StartOverwrite) {
							var currentDate = new Date(entity.StartCalculated);
							var gapDay = (currentDate - new Date(entity.StartOverwrite)) / 1000 / 60 / 60 / 24;
							_.filter(dataService.getList(), function (eventItem) {
								if (eventItem.StartCalculated && new Date(eventItem.StartCalculated) > currentDate && IsBeforePrcEventsType(entity, eventItem, true)) {
									var eventDate = new Date(eventItem.StartCalculated);
									eventDate.setDate(eventDate.getDate() - gapDay);
									if (eventItem.EndOverwrite && moment.utc(eventDate) > eventItem.EndOverwrite) {
										eventItem.StartOverwrite = eventItem.EndOverwrite;
									} else {
										eventItem.StartOverwrite = moment.utc(eventDate);
									}
									dataService.markItemAsModified(eventItem);
								}
							});
							dataService.markItemAsModified(entity);
						}
					}

					function autoUpdateChainedEventsEnd(entity) {
						if (systemOptionIsAutoUpdateChainedEvents() && entity.EndOverwrite) {
							var currentDate = new Date(entity.EndCalculated);
							var gapDay = (currentDate - new Date(entity.EndOverwrite)) / 1000 / 60 / 60 / 24;
							_.filter(dataService.getList(), function (eventItem) {
								if (eventItem.EndCalculated && new Date(eventItem.EndCalculated) > currentDate && IsBeforePrcEventsType(entity, eventItem, false)) {
									var eventDate = new Date(eventItem.EndCalculated);
									eventDate.setDate(eventDate.getDate() - gapDay);
									if (eventItem.StartOverwrite && moment.utc(eventDate) < eventItem.StartOverwrite) {
										eventItem.EndOverwrite = eventItem.StartOverwrite;
									} else {
										eventItem.EndOverwrite = moment.utc(eventDate);
									}
									dataService.markItemAsModified(eventItem);
								}
							});
							dataService.markItemAsModified(entity);
						}
					}

					return service;
				}

				var validationServiceCache = {};

				function getProcurementEventValidationService(option) {
					var moduleName = option.moduleName;
					// eslint-disable-next-line no-prototype-builtins
					if (!validationServiceCache.hasOwnProperty(moduleName)) {
						validationServiceCache[moduleName] = constructor.apply(null, [option.service, option.parentService]);
					}
					return validationServiceCache[moduleName];
				}

				return {
					getProcurementEventValidationService: getProcurementEventValidationService
				};

			}
		]);
})(angular);
