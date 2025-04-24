/**
 * Created by aljami on 25.03.2022.
 */
(function (angular) {
	'use strict';
	var moduleName = 'services.schedulerui';

	angular.module(moduleName).value('servicesSchedulerUIJobStateValues', [
		{Id: 0, description$tr$: 'services.schedulerui.stateValues.waiting', iconClass: 'status-icons ico-status42'},
		{Id: 1, description$tr$: 'services.schedulerui.stateValues.starting', iconClass: 'status-icons ico-status21'},
		{Id: 2, description$tr$: 'services.schedulerui.stateValues.running', iconClass: 'status-icons ico-status11'},
		{Id: 3, description$tr$: 'services.schedulerui.stateValues.stopped', iconClass: 'status-icons ico-status197'},
		{Id: 4, description$tr$: 'services.schedulerui.stateValues.finished', iconClass: 'status-icons ico-status02'},
		{Id: 5, description$tr$: 'services.schedulerui.stateValues.repetitive', iconClass: 'status-icons ico-status41'},
		{Id: 6, description$tr$: 'services.schedulerui.stateValues.stopping', iconClass: 'status-icons ico-status198'},
		{Id: 7, description$tr$: 'services.schedulerui.stateValues.historized', iconClass: 'status-icons ico-status49'},
		{Id: 8, description$tr$: 'services.schedulerui.stateValues.aborted', iconClass: 'status-icons ico-status01'}
	]);
})(angular);