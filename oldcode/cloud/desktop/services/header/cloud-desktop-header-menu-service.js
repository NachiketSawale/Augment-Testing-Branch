(() => {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopHeaderMenuService', cloudDesktopHeaderMenuService);

	cloudDesktopHeaderMenuService.$inject = ['$timeout','platformDialogService', 'platformContextService', 'basicsDocuService', 'timekeepingRecordingReportClockingService', '$rootScope', '$http', '$window','timekeepingEmployeePlanningAbsenceDialogService'];

	function cloudDesktopHeaderMenuService($timeout,platformDialogService, platformContextService, basicsDocuService, timekeepingRecordingReportClockingService, $rootScope, $http, $window,timekeepingEmployeePlanningAbsenceDialogService) {
		let culture = platformContextService.getLanguage();

		let headerMenuItems = {
			whatsnew: {
				link: globals.baseUrl + 'documentation/news/whatsnew/' + culture + '/index.html',
				webApiLink: 'news:whatsnew&returnHtml=true',
				caption: 'cloud.desktop.header.whatsnew',
				type: 'dialog',
			},
			announcements: {
				link: globals.baseUrl + 'documentation/news/announcements/' + culture + '/index.html',
				webApiLink: 'news:announcements&returnHtml=true',
				caption: 'cloud.desktop.header.announcements',
				type: 'dialog',
			},
			knownissue: {
				link: globals.baseUrl + 'documentation/news/knownissue/' + culture + '/index.html',
				webApiLink: 'news:knownissue&returnHtml=true',
				caption: 'cloud.desktop.header.knownIssues',
				type: 'dialog',
			},
			releasenotes: {
				link: globals.baseUrl + 'documentation/news/ReleaseNotes/' + culture + '/index.html',
				webApiLink: 'news:releasenotes&returnHtml=true',
				caption: 'cloud.desktop.header.relaeaseNotes',
				type: 'dialog',
			},
			performance: {
				link: globals.baseUrl + 'documentation/system/performance/' + culture + '/index.html',
				webApiLink: 'system:performance',
				type: 'window',
			},
		};

		function openDialogForDocus(itemObject, docuHTMLMarkup) {
			let doc = new DOMParser().parseFromString(docuHTMLMarkup, 'text/html');

			//remove font-size inline-style
			angular
				.element(doc.body)
				.find('*[style*="font-size"], *[style*="font-family"]')
				.each(function () {
					angular.element(this).css('font-size', '');
					angular.element(this).css('font-family', '');
				});

			const div = document.createElement('div');
			div.appendChild(doc.body.children[0]);

			let dialogOption = {
				headerText$tr$: itemObject.caption,
				bodyTemplate: div,
				windowClass: 'header-info-dialog',
				width: '900px',
				height: 'max',
				resizeable: true,
			};

			platformDialogService.showDialog(dialogOption);
		}

		function openWindowForDocus(itemObject) {
			$window.open(itemObject.link, '_blank');
		}

		function isChangePasswordAllowed(scope) {
			return scope.headerInfo.userInfo.ExplicitAccess;
		}

		function showDocus(itemObject) {
			$http.get(globals.webApiBaseUrl + 'basics/common/resource/uri?id=documentation:' + itemObject.webApiLink).then(function (response) {
				if (response.data) {
					if (itemObject.type === 'dialog') {
						openDialogForDocus(itemObject, response.data);
					} else if (itemObject.type === 'window') {
						openWindowForDocus(itemObject);
					}
				}
			});
		}

		function openInitial() {}

		function getOptionsNotifications() {
			return [
				{
					caption$tr$: headerMenuItems.whatsnew.caption,
					id: 'whatsnew',
					type: 'item',
					cssClass: 'ui-header-whatsnew',
					fn: function (/* event, info */) {
						let templateUrl = globals.baseUrl + 'documentation/news/whatsnew/' + culture + '/index.html';
						showDocus(headerMenuItems.whatsnew);
					},
				},
				{
					caption$tr$: headerMenuItems.announcements.caption,
					id: 'announcements',
					type: 'item',
					cssClass: 'ui-header-announcements',
					fn: function (/* event, info */) {
						let templateUrl = globals.baseUrl + 'documentation/news/announcements/' + culture + '/index.html';
						showDocus(headerMenuItems.announcements);
					},
				},
				{
					caption$tr$: headerMenuItems.releasenotes.caption,
					id: 'release',
					type: 'item',
					cssClass: 'ui-header-release',
					fn: function (/* event, info */) {
						let templateUrl = globals.baseUrl + 'documentation/news/ReleaseNotes/' + culture + '/index.html';
						showDocus(headerMenuItems.releasenotes);
					},
				},
				{
					caption$tr$: headerMenuItems.knownissue.caption,
					id: 'issues',
					type: 'item',
					cssClass: 'ui-header-issues',
					fn: function (/* event, info */) {
						let templateUrl = globals.baseUrl + 'documentation/news/knownissue/' + culture + '/index.html';
						showDocus(headerMenuItems.knownissue);
					},
				},
			];
		}

		function getOptionsHelp(scope, existsModuleVideo) {
			let toReturn = [
				{
					id: 'mdocu',
					caption$tr$: scope.isDesktopActive ? 'cloud.desktop.navBarProductDocuDesc' : 'cloud.desktop.navBarModuleDocuDesc',
					type: 'item',
					cssClass: 'ui-header-mdocu',
					fn: function () {
						if (scope.isDesktopActive) {
							scope.showDocu();
						} else {
							basicsDocuService.showDocu(scope.currentModule);
						}
					},
				},
				{
					id: 'shortkeyId',
					caption$tr$: 'cloud.desktop.KeyboardShortcutsOverview',
					subCaption: '(Alt + K)',
					type: 'item',
					cssClass: 'ui-header-shortkey',
					fn: function () {
						scope.showKeyboardShortcut();
					},
				},
				{
					id: 'dividerLast',
					type: 'divider',
				},
				{
					id: 'perId',
					caption$tr$: 'cloud.desktop.header.performanceIssues',
					type: 'item',
					cssClass: 'ui-header-per',
					fn: function () {
						basicsDocuService.showDocu('performance');
					},
				},
				{
					id: 'dividerLast',
					type: 'divider',
				},
				{
					id: 'aboutId',
					caption$tr$: 'cloud.desktop.mainMenuAbout',
					type: 'item',
					cssClass: 'ui-header-about',
					fn: function () {
						scope.showAboutDialog();
					},
				},
			];

			if (existsModuleVideo) {
				/**
				 * Use the docuService to show the video of the current module.
				 */
				toReturn.splice(1, 0, {
					id: 'mVideo',
					caption$tr$: 'cloud.desktop.navBarModuleVideoDesc',
					type: 'item',
					cssClass: 'ui-header-video',
					fn: function () {
						basicsDocuService.showVideo(scope.currentModule);
					},
				});
			}

			return toReturn;
		}

		function getOptionsProfile(scope, urlProfile, connectToEmployee) {
			let toReturn = [
				{
					id: 'companyId',
					caption$tr$: 'cloud.desktop.mainMenuCompany',
					type: 'item',
					cssClass: 'ui-header-company',
					fn: function () {
						scope.showCompanySelectionDialog();
					},
				},
				{
					id: 'externalId',
					caption$tr$: 'cloud.desktop.externalSystemCredential.dialogTitle',
					disabled: globals.portal,
					type: 'item',
					cssClass: 'ui-header-external',
					fn: function () {
						scope.showExternalSystemCredentialsDialog();
					},
				},
				{
					id: 'dividerExternals',
					type: 'divider',
				},
				{
					id: 'absenceId',
					caption$tr$: 'cloud.desktop.clerkProxy.absence',
					disabled: globals.portal,
					type: 'item',
					cssClass: 'ui-header-absence',
					fn: function () {
						scope.showClerkProxyDialog();
					},
				},
				{
					id: 'dividerAbsence',
					type: 'divider',
				},
				{
					id: 'settingsId',
					caption$tr$: 'cloud.desktop.mainMenuSettings',
					disabled: !scope.isDesktopActive,
					type: 'item',
					cssClass: 'ui-header-settings',
					fn: function () {
						scope.showSettingsDialog();
					},
				},
				{
					id: 'dividerSetings',
					type: 'divider',
				},
				{
					id: 'logoutId',
					caption$tr$: 'cloud.desktop.mainMenuLogout',
					type: 'item',
					cssClass: 'ui-header-logout',
					fn: function () {
						scope.onLogout();
					},
				},
			];

			if (connectToEmployee.isConnected) {
				toReturn.splice(3, 0, {
					id: 'clockingId',
					caption$tr$: 'cloud.desktop.timekeeping.clocking',
					type: 'item',
					cssClass: 'ui-header-clocking',
					fn: function () {
						timekeepingRecordingReportClockingService.clockingTimes();
					},
				});
				toReturn.splice(3, 0, {
					id: 'absenceId',
					caption$tr$: 'cloud.desktop.timekeeping.absenceForEmployee',
					type: 'item',
					cssClass: 'ui-header-clocking',
					fn: function () {
						timekeepingEmployeePlanningAbsenceDialogService.planningAbsence(connectToEmployee.employee);
					}
				});
			}

			if (isChangePasswordAllowed(scope)) {
				toReturn.unshift({
					id: 'pwId',
					caption$tr$: 'cloud.desktop.mainMenuChangePassword',
					type: 'item',
					cssClass: 'ui-header-pw',
					fn: function () {
						scope.onChangePassword();
					},
				});
			}

			if (urlProfile && urlProfile !== '') {
				toReturn.unshift({
					id: 'profileId',
					caption$tr$: 'cloud.desktop.mainMenuProfile',
					type: 'item',
					cssClass: 'ui-header-profile',
					fn: function () {
						$window.open(urlProfile, '_blank');
					},
				});
			}
			return toReturn;
		}

		function checkModuleVideo() {
			let _toReturn;
			return basicsDocuService.hasVideo($rootScope.currentModule).then(function (res) {
				if (res.data === true) {
					_toReturn = true;
				} else {
					_toReturn = false;
				}
				return _toReturn;
			});
		}

		function checkUserConnectToEmployee() {
			return timekeepingRecordingReportClockingService.checkUserConnectToEmployee(platformContextService.getCurrentUserId()).then(function (res) {
				return res;
			});
		}

		let service = {
			getOptionsHelp: getOptionsHelp,
			getOptionsNotifications: getOptionsNotifications,
			getOptionsProfile: getOptionsProfile,
			checkModuleVideo: checkModuleVideo,
			checkUserConnectToEmployee: checkUserConnectToEmployee,
		};

		return service;
	}
})();
