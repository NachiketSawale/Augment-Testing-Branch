/**
 * Created by sandu on 30.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.group';
	angular.module(moduleName).factory('usermanagementGroupShowLogService', usermanagementGroupShowLogService);
	usermanagementGroupShowLogService.$inject = ['platformModalService'];
	function usermanagementGroupShowLogService(platformModalService) {
		var service = {};
		service.showLog = function (entity) {
			var modalOptions = {
				headerTextKey: 'usermanagement.group.logContainer.showLogFileTitle',
				bodyTextKey: entity.LoggingMessage,
				showOkButton: true,
				bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.group/templates/logMessageDialog.html',
				resizeable: true,
				width: '800px',
				height: '600px'
			};
			platformModalService.showDialog(modalOptions);
		};
		return service;
	}
})(angular);