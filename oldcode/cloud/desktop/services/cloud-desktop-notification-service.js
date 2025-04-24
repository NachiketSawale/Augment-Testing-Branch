/**
 * Created by vignesh on 06.10.2022.
 */

/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopNotificationService
 * @priority default value
 * @description
 * Service used to build notification panel
 */

(function (angular) {
	/* global $ */
	'use strict';
	angular.module('cloud.desktop').service('cloudDesktopNotificationService', ['globals', '$http', '$filter', '$rootScope', function (globals, $http, $filter, $rootScope) {

		let module = 'basics/common/notification';
		let self = this;

		// Get notification data from db
		self.getNotificationsFromDb = function () {
			return $http({
				url: globals.webApiBaseUrl + module + '/getMyNotifications',
				method: 'GET'
			}).then(function (result) {
				self.formatNotifications(result.data);
				return result.data;
			});
		};

		self.formatNotifications = function(notifications){
			notifications.forEach((notification) => {

				// Assigning status icon to each notification based on current status
				notification.Icon = 'ico-status' + (notification.IconId < 10 ? 0 + '' + notification.IconId : notification.IconId);

				// Formatting notification date to required date format
				notification.StartedAt = $filter('date')(notification.Started, 'yyyy-MM-dd HH:mm:ss');

				notification.AdditionalReferencesEntity = notification.AdditionalReferencesEntities[0] !== undefined ? notification.AdditionalReferencesEntities[0] : { Completed: false };

				notification.IsAdditionalDetails = notification.NotificationType === 'Workflow';
			});
			return notifications;
		};

		// Service method to delete notifications
		self.deleteNotificationsFromDb = function (deletedNotificationIds) {
			let url = globals.webApiBaseUrl + module + '/removeNotifications';
			$http({
				url,
				data: deletedNotificationIds,
				method: 'POST'
			}).then(function (result) {
				if(result.data)
					$rootScope.$emit('sidebar:notificationsDeleted', deletedNotificationIds);
			});
		};

		// Service method to update notifications
		self.updateNotificationsFromDb = function (data) {
			let url = globals.webApiBaseUrl + module + '/updateNotification';
			$http({
				url,
				data,
				method: 'POST'
			}).then(function (result) {
				emitNotificationsUpdated(result.data);
			});
		};

		// Service method to save notifications
		self.saveNotificationsToDb = function (data) {
			let url = globals.webApiBaseUrl + module + '/saveNotification';
			$http({
				url,
				data,
				method: 'POST'
			}).then(function (result) {
				//emitNotificationsUpdated(result.data);
			});
		};

		self.updateNotificationViewState = function (data) {
			let url = globals.webApiBaseUrl + module + '/updateNotificationViewState';
			return $http({
				url,
				data,
				method: 'POST'
			}).then(function (result) {
				return result.data;
			});
		};

		self.getUnseenNotifications = function(){
			return $http({
				url: globals.webApiBaseUrl + module + '/getMyUnseenNotifications',
				method: 'GET'
			}).then(function (result) {
				self.formatNotifications(result.data);
				return result.data;
			});
		};

		// Notifying controller that a change has occurred and notification panel should be updated
		function emitNotificationsUpdated(notificationUpdated){
			$rootScope.$emit('sidebar:notificationUpdated', notificationUpdated);
		}

	}]);
})(angular);
