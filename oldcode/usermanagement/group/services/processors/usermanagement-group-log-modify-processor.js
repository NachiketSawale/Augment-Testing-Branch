/**
 * Created by sandu on 30.06.2016.
 */
(function (angular) {
	'use strict';
	angular.module('usermanagement.group').service('usermanagementGroupLogModifyProcessor', UsermanagementGroupLogModifyProcessor);
	UsermanagementGroupLogModifyProcessor.$inject = ['usermanagementGroupShowLogService'];
	function UsermanagementGroupLogModifyProcessor(usermanagementGroupShowLogService) {
		var service = this;
		this.provideActionSpecification = function provideActionSpecification(actionList){
			actionList.push({
				toolTip: 'Show log file - ',
				icon: 'control-icons ico-filetype-log',
				callbackFn: usermanagementGroupShowLogService.showLog,
				readonly: false
			});
		};
		service.processItem = function processItem(log) {
			if(log.Log){
				log.Log.actionList = [];
				service.provideActionSpecification(log.Log.actionList);
			}
		};
	}
})(angular);