

(function (angular) {
	'use strict';
	/**
	@ngdoc controller
	 * @name cloudDesktopNotificationController
	 * @function
	 *
	 * @description
	 * Controller for the Notification sidebar view.
	 */
	angular.module('cloud.desktop').controller('cloudDesktopNotificationController', ['_', '$scope', 'cloudDesktopNotificationService', '$translate', '$templateCache', 'platformTranslateService',
		'$rootScope', 'cloudDesktopSidebarService', 'reportingPlatformService', '$sce', 'basicsWorkflowClientActionService',
		function (_, $scope, cloudDesktopNotificationService, $translate, $templateCache, platformTranslateService, $rootScope, cloudDesktopSidebarService, reportingPlatformService, $sce, basicsWorkflowClientActionService) {

			let self = this;
			self.headline = $translate.instant('cloud.desktop.sidebarNotification.panelTitle');

			self.showingGroupBy = false;
			self.showSort = false;
			self.showFilter = false;

			// Contains all notifications available
			$scope.allNotifications = [];

			// Contains all the notifications from the current selected tab
			$scope.selectedNotifications = [];

			self.groupTemplate = $templateCache.get('cloud.desktop/groupItem.html');
			self.itemTemplate = $templateCache.get('cloud.desktop/itemTemplate.html');

			// Available tabs
			self.steps = [];


			// Available grouping options
			self.grouping = {
				options: {
					items: [
						{
							value: '',
							displayMember: 'cloud.desktop.template.grouping.noGrouping'
						},
						{
							value: 'StartedAt',
							displayMember: 'cloud.desktop.template.grouping.startDate',
							headerValue: 'StartedAt'
						},
						{
							value: 'NotificationStatus',
							displayMember: 'cloud.desktop.template.grouping.status',
							headerValue: 'NotificationStatus'
						},
						{
							value: 'CurrentAction',
							displayMember: 'cloud.desktop.template.grouping.action',
							headerValue: 'CurrentAction'
						},
						{
							value: 'NotificationType',
							displayMember: 'cloud.desktop.template.grouping.type',
							headerValue: 'NotificationType'
						}
					],
					valueMember: 'value'
				}
			};

			// Available sorting options
			self.sorting = {
				options: {
					items: [
						{
							value: '',
							desc: false,
							displayMember: 'cloud.desktop.template.sorting.noSorting'
						},
						{
							value: 'StartedAtAsc',
							property: 'StartedAt',
							desc: false,
							displayMember: 'cloud.desktop.template.sorting.startDate.asc'
						},
						{
							value: 'StartedAtDesc',
							property: 'StartedAt',
							desc: true,
							displayMember: 'cloud.desktop.template.sorting.startDate.desc'
						},
						{
							value: 'StatusAsc',
							property: 'NotificationStatus',
							desc: false,
							displayMember: 'cloud.desktop.template.sorting.status.asc'
						},
						{
							value: 'StatusDesc',
							property: 'NotificationStatus',
							desc: true,
							displayMember: 'cloud.desktop.template.sorting.status.desc'
						}
					],
					valueMember: 'value'
				}

			};

			function translateOptions(options) {
				_.each(options.items, function (item) {
					item.displayMember = platformTranslateService.instant(item.displayMember, null, true);
				});
			}

			// Translating display data for grouping and sorting options
			translateOptions(self.sorting.options);
			translateOptions(self.grouping.options);

			// Default values for grouping, sorting and selected tab
			const defaultGroup = 'currentaction';
			const defaultSort = '';
			const defaultTabIndex = 0;
			const notificationSidebarCmdId = '#sidebar-notification';

			function isSidebarOpen() {
				return cloudDesktopSidebarService.scope.sidebarOptions.lastButtonId === notificationSidebarCmdId;
			}

			let unseenNotificationsAvailable = false;

			self.listConfig = {};
			self.listConfig.isGrouped = true;
			self.listConfig.currentTab = '';
			self.showSettings = false;

			self.tabOptions = {
				initialTabIndex: 0
			};

			let groupSettings = {
				getInitialGrouping: function () {
					let notificationOptions = localStorage.getItem('notificationOptions');
					if (notificationOptions !== null) {
						notificationOptions = JSON.parse(notificationOptions);
						if (notificationOptions.initialGroup !== undefined) {
							return notificationOptions.initialGroup;
						}
					}
					return defaultGroup;
				},
				setInitialGrouping: function (initialGroup) {
					let notificationOptions = {};

					if (localStorage.getItem('notificationOptions') !== null) {
						notificationOptions = JSON.parse(localStorage.getItem('notificationOptions'));
					}

					notificationOptions.initialGroup = initialGroup;
					localStorage.setItem('notificationOptions', JSON.stringify(notificationOptions));
				}
			};

			let sortSettings = {
				getInitialSorting: function () {
					let notificationOptions = localStorage.getItem('notificationOptions');
					if (notificationOptions !== null) {
						notificationOptions = JSON.parse(notificationOptions);
						if (notificationOptions.initialSort !== undefined) {
							return notificationOptions.initialSort;
						}
					}
					return defaultSort;
				},
				setInitialSorting: function (initialSort) {
					let notificationOptions = {};

					if (localStorage.getItem('notificationOptions') !== null) {
						notificationOptions = JSON.parse(localStorage.getItem('notificationOptions'));
					}

					notificationOptions.initialSort = initialSort;
					localStorage.setItem('notificationOptions', JSON.stringify(notificationOptions));
				}
			};

			let tabSettings = {
				getInitialTab: function () {
					let notificationOptions = localStorage.getItem('notificationOptions');
					if (notificationOptions !== null) {
						notificationOptions = JSON.parse(notificationOptions);
						if (notificationOptions.initialTab !== undefined) {
							return notificationOptions.initialTab;
						}
					}
					return defaultTabIndex;
				},
				setInitialTab: function (initialTab) {

					let notificationOptions = {};
					if (localStorage.getItem('notificationOptions') !== null) {
						notificationOptions = JSON.parse(localStorage.getItem('notificationOptions'));
					}

					notificationOptions.initialTab = initialTab;
					localStorage.setItem('notificationOptions', JSON.stringify(notificationOptions));
				}
			};

			let settingsLoaded = false;
			function loadDefaultSettings() {
				settingsLoaded = true;
				self.steps = [{
					title: getTranslatedValue('cloud.desktop.sidebarNotification.tabs.all'),
					index: 0
				}, {
					title: getTranslatedValue('cloud.desktop.sidebarNotification.tabs.report'),
					index: 1
				}, {
					title: getTranslatedValue('cloud.desktop.sidebarNotification.tabs.workflow'),
					index: 2
				}, {
					title: getTranslatedValue('cloud.desktop.sidebarNotification.tabs.import'),
					index: 3
				}, {
					title: getTranslatedValue('cloud.desktop.sidebarNotification.tabs.scheduler'),
					index: 4
				}];

				let initialGroupValue = groupSettings.getInitialGrouping();
				let initialSortValue = sortSettings.getInitialSorting();
				let initialTabValue = tabSettings.getInitialTab();

				// Load grouping and sorting settings
				self.listConfig.group = self.grouping.options.items.filter(item => item.value.toLowerCase() === initialGroupValue.toLowerCase())[0];
				self.listConfig.sort = self.sorting.options.items.filter(item => item.value.toLowerCase() === initialSortValue.toLowerCase())[0];

				// Load default tab
				self.listConfig.currentTab = self.steps.filter(step => step.index === initialTabValue)[0].title;
				self.tabOptions.initialTabIndex = initialTabValue;
			}

			// load all notifications from api
			function loadNotifications() {
				cloudDesktopNotificationService.getNotificationsFromDb().then(function (notifications) {
					if (notifications !== undefined) {
						$scope.allNotifications = notifications;
						prepareData();
						updateNotificationViewCount();
					}
				});
			}

			function appendUnseenNotifcations() {
				cloudDesktopNotificationService.getUnseenNotifications().then(function (notifications) {
					if (notifications !== undefined) {
						$scope.allNotifications.filter(notification => notification.IsUnseen).forEach(notification => notification.IsUnseen = false);

						let notificationIdIndexArr = $scope.allNotifications.map(function(x) {return x.Id; });
						// Replace existing notifications or add new notifications
						notifications.forEach(notification => {
							let notificationIndex = notificationIdIndexArr.indexOf(notification.Id);
							if (notificationIndex >= 0) {
								$scope.allNotifications[notificationIndex] = notification;
							}
							else {
								$scope.allNotifications.push(notification);
							}
						});

						prepareData();
						updateNotificationViewCount();
					}
				});
			}

			// Method called on click of tab
			$scope.changeTab = function (selectedStep) {
				self.listConfig.currentTab = selectedStep.title;
				tabSettings.setInitialTab(selectedStep.index);
				prepareData();
			};

			// Method to group data based on selected predicate
			self.selectGroup = function () {
				prepareData();
				groupSettings.setInitialGrouping(self.listConfig.group.value);
			};

			// Method to sort data based on selected predicate
			self.selectSort = function () {
				prepareData();
				sortSettings.setInitialSorting(self.listConfig.sort.value);
			};

			// Method to refresh data on screen
			self.refresh = function () {
				$scope.allNotifications.length > 0 ? appendUnseenNotifcations() : loadNotifications();
			};

			// Method to remove notifications from UI
			function removeNotification(Id) {

				// Service deletes the notification that matches the passed Id. If undefined is passed, all notifications are deleted.
				let notificationIdsToDelete = [];
				if (Id === undefined) {
					notificationIdsToDelete = $scope.allNotifications.map(notification => { return notification.Id; });
				}
				else {
					notificationIdsToDelete.push(Id);
				}
				cloudDesktopNotificationService.deleteNotificationsFromDb(notificationIdsToDelete);
			}
			self.removeNotification = removeNotification;

			function prepareData() {
				let data = prepareTabData();
				$scope.selectedNotifications = groupData(sortData(data, self.listConfig), self.listConfig);
			}

			function setNotificationAlert(isUnseenNotificationAvailable) {
				$rootScope.$emit('sidebar:unseenNotificationsCountChanged', isUnseenNotificationAvailable);
			}

			// Function used to group notification data
			function groupData(data, groupConfig) {
				if (groupConfig && groupConfig.group && groupConfig.group.value) {
					if (groupConfig.group.value.toLowerCase().includes('started')) {
						data.forEach(notification => {
							notification[groupConfig.group.value] = notification[groupConfig.group.value].split(' ')[0];
						});
					}

					data = _.groupBy(data, groupConfig.group.value);
					let tempResult = [];
					let groups = _.keys(data);
					for (let i = 0; i < groups.length; i++) {
						let header = _.get(data[groups[i]][0], groupConfig.group.headerValue, '');
						tempResult.push(new Group(groups[i], header, data[groups[i]], checkGroupVisibility(groupConfig, groups[i])));
					}
					data = tempResult;
					self.listConfig.isGrouped = true;
				}
				else {
					self.listConfig.isGrouped = false;
				}
				return data;
			}

			// Function used to sort notification data
			function sortData(data, listConfig) {
				if (listConfig && listConfig.sort && listConfig.sort.value) {
					listConfig.isSorted = true;
					data = _.sortBy(data, [listConfig.sort.property, 'IsUnseen']);
					if (listConfig.sort.desc) {
						data = data.reverse();
					}
				}
				return data;
			}

			function prepareTabData() {
				if (self.listConfig && self.listConfig.currentTab && $scope.allNotifications !== undefined) {
					return $scope.allNotifications.filter(notification => notification.NotificationType.toLowerCase() === self.listConfig.currentTab.toLowerCase() || self.listConfig.currentTab.toLowerCase() === 'all');
				}
			}


			// Check if group should be shown
			function checkGroupVisibility(listConfig, key) {
				let isGroupVisible = true;
				// eslint-disable-next-line no-prototype-builtins
				if (listConfig.groupStatus && listConfig.groupStatus.hasOwnProperty(key)) {
					isGroupVisible = listConfig.groupStatus[key];
				}

				return isGroupVisible;
			}

			class Group {
				constructor(key, name, children, visible) {
					let group = this;
					group.key = key;
					group.name = name;
					group.childs = children;
					group.visible = visible;
					group.icoClass = function () {
						return group.visible ? 'ico-up' : 'ico-down';
					};
					group.count = children.length;
				}
			}

			// Event called on manual refresh of notifications
			let notificationsUpdatedEvent = $rootScope.$on('sidebar:notificationUpdated', function (event, notificationsUpdated) {
				if (notificationsUpdated) {
					loadNotifications();
				}
			});

			// Event called on delete of notification(s)
			let notificationsDeletedEvent = $rootScope.$on('sidebar:notificationsDeleted', function (event, notificationsDeleted) {
				if (notificationsDeleted) {
					$scope.allNotifications = $scope.allNotifications.filter(notification => !notificationsDeleted.includes(notification.Id));
					prepareData();
				}
			});

			// Event called on auto refresh of notifications
			let notificationsAutoRefreshEvent = $rootScope.$on('sidebar:notificationsAutoRefreshEvent', function (event, unseenNotificationsCount) {

				// If notification panel is open and unseen notifications are available, get new unseen notifications. else update notification icon.
				unseenNotificationsAvailable = unseenNotificationsCount > 0;
				if (isSidebarOpen() && unseenNotificationsAvailable) {
					appendUnseenNotifcations();
				}
				else {
					setNotificationAlert(unseenNotificationsAvailable);
				}
			});

			// Loading notifications on open of sidebar
			cloudDesktopSidebarService.onOpenSidebar.register(function (cmdId) {
				//load default settings the first time sidebar is opened.
				!settingsLoaded && loadDefaultSettings();

				if (cmdId === notificationSidebarCmdId) {
					if ($scope.allNotifications.length === 0) {
						loadNotifications();
					}
					else if (unseenNotificationsAvailable) {
						appendUnseenNotifcations();
					}
					setNotificationAlert(false);
				}
			});

			// Set all notifications to seen in front end on closing of notification panel
			cloudDesktopSidebarService.onClosingSidebar.register(function (cmdId) {
				if (cmdId === notificationSidebarCmdId) {
					$scope.allNotifications.filter(notification => notification.IsUnseen).forEach(notification => notification.IsUnseen = false);
					unseenNotificationsAvailable = false;
				}
			});

			// Loading notifications if the sidebar is already open and page is loaded
			if (isSidebarOpen()) {

				//load default settings if the side bar is already open.
				!settingsLoaded && loadDefaultSettings();

				loadNotifications();
			}

			// Updating notifications as seen
			function updateNotificationViewCount() {
				let unseenNotificationIds = $scope.allNotifications.filter(notification => notification.IsUnseen).map(x => x.Id);
				if (unseenNotificationIds.length > 0) {
					cloudDesktopNotificationService.updateNotificationViewState(unseenNotificationIds).then(function (result) {
						if (result) {
							unseenNotificationsAvailable = false;
						}
					});
				}
			}

			self.functionsInAccordion = {
				removeNotification: removeNotification,
				showReport: showReport,
				showAdditionalDetails: showAdditionalDetails,
				getTranslatedValue : getTranslatedValue
			};

			function showReport(notificationId) {
				let notification = $scope.allNotifications.filter(notification => notification.Id === notificationId)[0];
				if (notification !== null) {
					if (notification.AdditionalReferencesEntity !== null) {
						let reportObj = {
							Name: notification.AdditionalReferencesEntity.Uuid,
							Description: notification.Name,
							FileExtension: notification.AdditionalReferencesEntity.FileExtension,
							ClientUrl: notification.AdditionalReferencesEntity.ClientUrl
						};
						reportingPlatformService.show(reportObj);
					}
				}
			}

			function showAdditionalDetails(notificationId) {
				let notification = $scope.allNotifications.filter(notification => notification.Id === notificationId)[0];
				if (notification !== null && notification !== undefined) {
					return prepareAdditionalDetailsHTML(notification.AdditionalReferencesEntities);
				}
			}

			function prepareAdditionalDetailsHTML(additionalDetails) {
				let headers = Array.from(new Set(additionalDetails.map(additionalDetail => additionalDetail.Header).filter(header => header !== null)));
				let additionalDetailsHTML = '';
				if (headers.length > 0) {
					additionalDetailsHTML = `<div class="additional-details"> <span style="font-size:16px">${getTranslatedValue('cloud.desktop.sidebarNotification.additionalDetailsHeaders.additionDetailsTitle')}</span>`;
					headers.forEach(header => {
						let headerItem = `<div class='additional-detail-header'>${header}</div>`;
						let detailsItem = '<div class="additional-detail-content">';
						let details = additionalDetails.filter(additionalDetail => additionalDetail.Header === header);

						let detailsArr = [];
						details.forEach(detail => {
							detailsArr.push(detail.UserDefinedText);
						});
						detailsItem += detailsArr.join(', ');
						detailsItem += '</div>';
						additionalDetailsHTML += headerItem + detailsItem;
					});
					additionalDetailsHTML += '</div>';
				}

				return $sce.trustAsHtml(additionalDetailsHTML);
			}

			function getTranslatedValue(key){
				return $translate.instant(key);
			}

			$scope.$on('$destroy', function () {
				notificationsUpdatedEvent();
				notificationsDeletedEvent();
				notificationsAutoRefreshEvent();
			});

		}])
		.constant('additionalReferenceHeadersConstants', {
			GenericWizardBidderHeader: 'cloud.desktop.sidebarNotification.additionalDetailsHeaders.GenericWizardBidderHeader'
		});

})(angular);
