/**
 * Created by sandu on 03.06.2016.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.group').factory('usermanagementGroupParseSynchronizeDateProcessor', usermanagementGroupParseSynchronizeDateProcessor);
	usermanagementGroupParseSynchronizeDateProcessor.$inject = ['moment','platformRuntimeDataService'];
	function usermanagementGroupParseSynchronizeDateProcessor(moment, platformRuntimeDataService) {
		var service = {};
		service.processItem = function (group) {
			if (group.SynchronizeDate) {
				group.SynchronizeDate = moment.utc(group.SynchronizeDate);//format not finished
			}
			if (group.DomainSID) {
				var fields = [{
					field: 'Name',
					readonly: true
				}];
				platformRuntimeDataService.readonly(group, fields);
			}
		};
		return service;
	}
})(angular);