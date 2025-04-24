/**
 * Created by sandu on 29.06.2016.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.user').service('usermanagementUserLogModifyProcessor', UsermanagementUserLogModifyProcessor);
	UsermanagementUserLogModifyProcessor.$inject = ['usermanagementUserShowLogService'];

	function UsermanagementUserLogModifyProcessor(usermanagementUserShowLogService) {
		var service = this;
		this.provideActionSpecification = function provideActionSpecification(actionList) {
			actionList.push({
				toolTip: 'Show log file - ',
				icon: 'control-icons ico-filetype-log',
				callbackFn: usermanagementUserShowLogService.showLog,
				readonly: false
			});
		};
		service.processItem = function processItem(log) {
			if (log.Log) {
				log.Log.actionList = [];
				service.provideActionSpecification(log.Log.actionList);
			}
		};
	}
})(angular);
