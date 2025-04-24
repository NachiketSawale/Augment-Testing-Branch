/**
 * Created by aljami on 27.05.2022.
 */
(function (angular) {
	'use strict';
	var moduleName = 'services.schedulerui';

	angular.module(moduleName).value('servicesSchedulerUIPriorityValues', [
		{Id: 0, description$tr$: 'services.schedulerui.priority.highest'},
		{Id: 1, description$tr$: 'services.schedulerui.priority.high'},
		{Id: 2, description$tr$: 'services.schedulerui.priority.normal'},
		{Id: 3, description$tr$: 'services.schedulerui.priority.low'},
		{Id: 4, description$tr$: 'services.schedulerui.priority.lowest'}
	]);
})(angular);