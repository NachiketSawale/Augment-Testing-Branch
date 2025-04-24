/**
 * Created by aljami on 27.05.2022.
 */
(function (angular) {
	'use strict';
	var moduleName = 'services.schedulerui';

	angular.module(moduleName).value('servicesSchedulerUILogLevelValues', [
		{Id: -1, description$tr$: 'services.schedulerui.logLevel.all'},
		{Id:  0, description$tr$: 'services.schedulerui.logLevel.off'},
		{Id:  1, description$tr$: 'services.schedulerui.logLevel.error'},
		{Id:  2, description$tr$: 'services.schedulerui.logLevel.warning'},
		{Id:  3, description$tr$: 'services.schedulerui.logLevel.info'},
		{Id:  4, description$tr$: 'services.schedulerui.logLevel.debug'}
	]);
})(angular);