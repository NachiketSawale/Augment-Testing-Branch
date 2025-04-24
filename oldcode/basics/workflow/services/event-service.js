/* globals angular */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc function
	 * @name eventService
	 * @methodOf basicsWorkflowEventService
	 * @description Factory function to get the workflow event service.
	 * @returns (object) the event service
	 */
	function eventService($rootScope, $http, _, basicsWorkflowDtoService, basicsWorkflowInstanceService) {
		var service = {};
		var events = [];

		/**
		 * @ngdoc function
		 * @name registerEvent
		 * @methodOf basicsWorkflowEventService
		 * @description Function to register a event which can be used to start a workflow.
		 * Every registered event can be used in the subscribed events container.
		 * @returns
		 */
		service.registerEvent = function (uuid, description, entityIdPropertyPath, contextPropertyPath) {
			events.push({uuid: uuid, description: description});
			$rootScope.$on(uuid, function (event, data) {
				var id = null;
				var json = null;
				if (data) {
					id = _.get(data, entityIdPropertyPath, data.entityId);
					json = _.get(data, contextPropertyPath, data.jsonContext);
				}

				service.startWorkflow(event.name, id, json);

			});
		};

		/**
		 * @ngdoc function
		 * @name getEvents
		 * @methodOf basicsWorkflowEventService
		 * @description Function to get all registered events. Events that a registered on server or client side.
		 * @returns (events) List of all registered events.
		 */
		service.getEvents = function () {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/events'
			}).then(function (response) {
				_.forEach(response.data, basicsWorkflowDtoService.extendObject);
				var eventsList = events.concat(response.data);
				events = _.uniqBy(eventsList, 'uuid');
				var result = events;
				return result;
			});
		};

		/**
		 * @ngdoc function
		 * @name getEvent
		 * @methodOf basicsWorkflowEventService
		 * @description Function to get a event by uuid.
		 * @returns (event) Get the event with the given uuid
		 */
		service.getEvent = function (uuid) {
			return _.find(events, {uuid: uuid});
		};

		/**
		 * @ngdoc function
		 * @name startWorkflow
		 * @methodOf basicsWorkflowEventService
		 * @description Function to start a workflow by event.
		 * @returns (workflowinstance) Instance of the started workflow.
		 */
		service.startWorkflow = function (uuid, entityId, jsonContext) {
			return basicsWorkflowInstanceService.startWorkflowByEvent(uuid, entityId, jsonContext, false);
		};

		return service;
	}

	eventService.$inject = ['$rootScope', '$http', '_', 'basicsWorkflowDtoService', 'basicsWorkflowInstanceService'];

	angular.module('basics.workflow')
		.factory('basicsWorkflowEventService', eventService);

})(angular);
