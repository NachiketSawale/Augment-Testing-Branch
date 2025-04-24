/**
 * Created by welss on 23.03.2015.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingMainEventProcessor
	 * @function
	 *
	 * @description
	 * The schedulingMainEventProcessor set the event properties read only if it is fixed date
	 */

	angular.module('scheduling.main').service('schedulingMainEventProcessor', SchedulingMainEventProcessor);


	SchedulingMainEventProcessor.$inject = ['platformRuntimeDataService'];

	function SchedulingMainEventProcessor(platformRuntimeDataService) {
		var self = this;

		this.processItem = function processItem(event) {
			self.processItemWithValue(event, event.IsFixedDate);
		};

		this.processItemWithValue = function processItemWithValue(event, value) {
			var fields = [
				{ field: 'Date', readonly: !value },
				{ field: 'DistanceTo', readonly: value }
			];

			platformRuntimeDataService.readonly(event, fields);
		};
	}

})(angular);