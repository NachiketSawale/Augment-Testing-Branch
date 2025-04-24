/**
 * Created by sandu on 28.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.group';

	angular.module(moduleName).value('usermanagementGroupStateValues', [
		{Id: 0, description$tr$: 'usermanagement.group.stateValues.waiting'},
		{Id: 1, description$tr$: 'usermanagement.group.stateValues.starting'},
		{Id: 2, description$tr$: 'usermanagement.group.stateValues.running'},
		{Id: 3, description$tr$: 'usermanagement.group.stateValues.stopped'},
		{Id: 4, description$tr$: 'usermanagement.group.stateValues.finished'},
		{Id: 5, description$tr$: 'usermanagement.group.stateValues.repetitive'}
	]);
})(angular);