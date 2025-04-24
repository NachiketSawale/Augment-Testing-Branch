/* globals angular */
(function (angular) {
	'use strict';

	function BasicsWorkflowTriggerService($http, $q, globals, _, basicsWorkflowInstanceService) {

		function getWorkflowsForEntity(entityId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/template/triggeredbyentity',
				params: {entityId: entityId}
			}).then(
				function (response) {
					return response.data;
				}
			);
		}

		function responseFn(response) {
			var toolbarItems = [];
			var fn = converterFactory(toolbarItems);
			_.forEach(response, fn);
			return toolbarItems;
		}

		function converterFactory(itemList) {
			return function (item) {
				itemList.push(
					{
						id: item.TriggerKey,
						caption: item.TriggerDesc,
						type: 'item',
						iconClass: 'tlb-icons ico-workflow-run ' + item.TriggerKey,
						fn: function () {
							basicsWorkflowInstanceService.startWorkflow(item.Id /*toDo determine getIdFn, this could never been working*/);
						}
					});
			};
		}

		/**
		 * @ngdoc function
		 * @name getTriggerItemsForToolbar
		 * @methodOf basics.workflow.services.basicsWorkflowTriggerService
		 * @description Returns a list of toolbar buttons, which executes workflows. The workflows
		 * which are included in this list, are definied in the designer with a trigger property.
		 * @param {( int )} entityId Filter property for the workflows.
		 */
		this.getTriggerItemsForToolbar = function (entityId, getIdFn) {
			if (entityId !== undefined && entityId !== null && angular.isFunction(getIdFn)) {
				return getWorkflowsForEntity(entityId)
					.then(responseFn);
			} else {
				$q.when();
			}
		};
	}

	BasicsWorkflowTriggerService.$inject = ['$http', '$q', 'globals', '_', 'basicsWorkflowInstanceService'];

	angular.module('basics.workflow')
		.service('basicsWorkflowTriggerService', BasicsWorkflowTriggerService);
})(angular);
