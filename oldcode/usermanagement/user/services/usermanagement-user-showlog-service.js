/**
 * Created by sandu on 30.06.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'usermanagement.user';
	angular.module(moduleName).factory('usermanagementUserShowLogService', usermanagementUserShowLogService);
	usermanagementUserShowLogService.$inject = ['platformModalService'];

	function usermanagementUserShowLogService(platformModalService) {
		var service = {};
		service.showLog = function (entity) {
			var modalOptions = {
				headerTextKey: 'usermanagement.user.logContainer.showLogFileTitle',
				bodyTextKey: entity.LoggingMessage,
				showOkButton: true,
				bodyTemplateUrl: globals.appBaseUrl + 'usermanagement.user/templates/logMessageDialog.html',
				resizeable: true,
				width: '800px',
				height: '600px'
			};
			platformModalService.showDialog(modalOptions);
		};
		return service;
	}
})(angular);
