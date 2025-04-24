/**
 * Created by sandu on 26.10.2015.
 */
(function (angular) {
	'use strict';

	angular.module('usermanagement.user').value('usermanagementUserStateValues', [
		{Id: 1, description$tr$: 'usermanagement.user.stateEnabled'},
		{Id: 2, description$tr$: 'usermanagement.user.stateDisabled'},
		{Id: 3, description$tr$: 'usermanagement.user.stateMarkedForDeletion'}
	]);
})(angular);
