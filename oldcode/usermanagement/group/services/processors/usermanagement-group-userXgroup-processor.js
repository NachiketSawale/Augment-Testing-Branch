/**
 * Created by sandu on 04.10.2017.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.group').service('usermanagementGroupUserXGroupProcessor', UsermanagementGroupUserXGroupProcessor);
	UsermanagementGroupUserXGroupProcessor.$inject = ['usermanagementGroupMainService','platformRuntimeDataService'];
	function UsermanagementGroupUserXGroupProcessor(usermanagementGroupMainService, platformRuntimeDataService) {
		var service = this;

		service.processItem = function processItem(usersInGroup) {
			var selectedGroup = usermanagementGroupMainService.getSelected();
			if (selectedGroup.DomainSID) {
				var fields = [{
					field: 'UserFk',
					readonly: true
				}];
				platformRuntimeDataService.readonly(usersInGroup, fields);
			}
		};
	}
})(angular);