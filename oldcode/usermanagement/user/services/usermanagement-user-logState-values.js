/**
 * Created by sandu on 28.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.user';

	angular.module(moduleName).value('usermanagementUserLogStateValues', [
		{Id: 0, description$tr$: 'usermanagement.user.stateValues.waiting'},
		{Id: 1, description$tr$: 'usermanagement.user.stateValues.starting'},
		{Id: 2, description$tr$: 'usermanagement.user.stateValues.running'},
		{Id: 3, description$tr$: 'usermanagement.user.stateValues.stopped'},
		{Id: 4, description$tr$: 'usermanagement.user.stateValues.finished'},
		{Id: 5, description$tr$: 'usermanagement.user.stateValues.repetitive'}
	]);
})(angular);