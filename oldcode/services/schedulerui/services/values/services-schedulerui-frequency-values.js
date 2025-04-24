/**
 * Created by aljami on 27.05.2022.
 */
(function (angular) {
	'use strict';
	var moduleName = 'services.schedulerui';

	angular.module(moduleName).value('servicesSchedulerUIFrequencyValues', [
		{Id: 0, description$tr$: 'services.schedulerui.frequency.none'},
		{Id: 1, description$tr$: 'services.schedulerui.frequency.minute'},
		{Id: 2, description$tr$: 'services.schedulerui.frequency.hourly'},
		{Id: 3, description$tr$: 'services.schedulerui.frequency.daily'},
		{Id: 4, description$tr$: 'services.schedulerui.frequency.weekly'},
		{Id: 5, description$tr$: 'services.schedulerui.frequency.monthly'}
	]);
})(angular);