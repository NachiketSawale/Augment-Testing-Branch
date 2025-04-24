/**
 * Created by welss on 23.03.2023.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingMainCurrentDatesProcessor
	 * @function
	 *
	 * @description
	 * The schedulingMainCurrentDatesProcessor set the current date properties to planned or actual dates
	 */

	angular.module('scheduling.main').service('schedulingMainCurrentDatesProcessor', SchedulingMainCurrentDatesProcessor);

	function SchedulingMainCurrentDatesProcessor() {

		this.processItem = function processItem(item) {
			if(item.ActualStart){
				item.CurrentStart = item.ActualStart;
			}else{
				item.CurrentStart = item.PlannedStart;
			}
			if(item.ActualFinish){
				item.CurrentFinish = item.ActualFinish;
			}else{
				item.CurrentFinish = item.PlannedFinish;
			}
			if(item.ActualDuration){
				item.CurrentDuration = item.ActualDuration;
			}else{
				item.CurrentDuration = item.PlannedDuration;
			}
		};
	}

})(angular);