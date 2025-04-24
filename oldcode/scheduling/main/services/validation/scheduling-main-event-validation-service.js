/**
 * Created by baf on 26.01.2015.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainEventValidationService
	 * @description provides validation methods for event instances
	 */
	angular.module('scheduling.main').service('schedulingMainEventValidationService', SchedulingMainEventValidationService);

	SchedulingMainEventValidationService.$inject = ['_', '$http', '$timeout', 'platformDataValidationService', 'schedulingMainEventProcessor', 'schedulingMainService',
		'schedulingMainEventService', 'platformDataServiceProcessDatesBySchemeExtension'];

	function SchedulingMainEventValidationService(_, $http, $timeout, platformDataValidationService, schedulingMainEventProcessor, schedulingMainService, schedulingMainEventService, platformDataServiceProcessDatesBySchemeExtension) {
		var self = this;

		this.validateIsFixedDate = function validateIsFixedDate(entity, value) {
			schedulingMainEventProcessor.processItemWithValue(entity, value);

			return true;
		};

		this.asyncValidateEventTypeFk = function asyncValidateDate(entity, value, model) {
			return self.doAsyncValidation(entity, value, model);
		};

		this.asyncValidateDate = function asyncValidateDate(entity, value, model) {
			return self.doAsyncValidation(entity, value, model);
		};

		this.asyncValidatePlacedBefore = function asyncValidatePlacedBefore(entity, value, model) {
			return self.doAsyncValidation(entity, value, model);
		};

		this.asyncValidateDistanceTo = function asyncValidateDistanceTo(entity, value, model) {
			return self.doAsyncValidation(entity, value, model);
		};

		this.asyncValidateEventFk = function asyncValidateEventFk(entity, value, model) {
			return self.doAsyncValidation(entity, value, model);
		};

		this.doAsyncValidation = function doAsyncValidation(entity, value, model) {
			var cpy = _.cloneDeep(entity);
			cpy[model] = value;

			// Prepare the payload for validation
			var toValidate = {
				MainItemId: entity.ActivityFk,
				EventsToSave: [cpy],
				Activities: [schedulingMainService.getItemById(entity.ActivityFk)]
			};

			// Fetch connected event if available
			var connectedEve = null;
			if (!_.isNil(cpy.EventFk)) {
				connectedEve = schedulingMainEventService.getItemById(cpy.EventFk);
				if (connectedEve !== null) {
					toValidate.EventsToSave.push(connectedEve);
				}
			}

			// Handle event type change
			if (model === 'EventTypeFk') {
				toValidate.EventTypeFkChanged = true;
			}

			// Register async call marker
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, schedulingMainEventService);

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/main/event/validate', toValidate)
				.then(function (result) {
					// Safely handle the array of updated events
					const eventsToSave = result.data || [];
					if (Array.isArray(eventsToSave)) {
						eventsToSave.forEach(function (updatedEvent) {
							// Find and update the corresponding event in the service
							const targetEvent = schedulingMainEventService.getItemById(updatedEvent.Id);
							if (targetEvent) {
								targetEvent.Date = updatedEvent.Date;
								targetEvent.DistanceTo = updatedEvent.DistanceTo;
								targetEvent.IsFixedDate = updatedEvent.IsFixedDate;

								platformDataServiceProcessDatesBySchemeExtension.parseString(targetEvent, 'Date', 'dateutc');
							}
						});
					}
					// Trigger recalculation and updates
					$timeout(function calculateNewValuesOfActivities() {
						schedulingMainEventService.updateEvents(eventsToSave, true);
					});

					return platformDataValidationService.finishAsyncValidation(
						true, entity, value, model, asyncMarker, self, schedulingMainEventService
					);
				});

			return asyncMarker.myPromise;
		};
	}

})(angular);
