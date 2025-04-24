/**
 * Created by wed on 7/26/2023.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopOutlookMainController', [
		'_',
		'globals',
		'$scope',
		'$timeout',
		'$translate',
		'cloudDesktopSidebarService',
		'cloudDesktopOutlookConstant',
		'cloudDesktopOutlookMainService',
		function (
			_,
			globals,
			$scope,
			$timeout,
			$translate,
			sidebarService,
			outlookConstant,
			outlookMainService
		) {
			$scope.initializing = false;
			$scope.isAuthenticated = false;
			$scope.selectedAccount = null;
			$scope.profile = null;
			$scope.isLoading = false;
			$scope.toolbars = [];
			$scope.showMailboxContainer = false;
			$scope.showMailboxMenu = false;
			$scope.lastView = null;
			$scope.currentView = null;

			$scope.views = {
				login: {
					id: outlookConstant.views.id.login,
					toolbars: [],
					ready: true,
					visible: true,
					showMailboxContainer: false
				},
				sendBox: {
					id: outlookConstant.views.id.sendBox,
					toolbars: [
						{
							id: outlookConstant.toolbars.id.attachReport,
							cssClass: 'control-icons ico-doc',
							title: 'cloud.desktop.outlook.attachReport'
						},
						{
							id: outlookConstant.toolbars.id.attachFile,
							cssClass: 'tlb-icons ico-attachment',
							title: 'cloud.desktop.outlook.attachFile'
						}
					],
					ready: true,
					visible: false,
					showMailboxContainer: false
				},
				mailbox: {
					id: outlookConstant.views.id.mailbox,
					toolbars: [
						{
							id: outlookConstant.toolbars.id.new,
							cssClass: 'tlb-icons ico-add',
							title: 'cloud.desktop.outlook.new',
							hide: function () {
								return !$scope.selectedAccount || $scope.selectedAccount.folder.name === outlookConstant.folders.drafts.name;
							}
						},
						{
							id: outlookConstant.toolbars.id.refresh,
							cssClass: 'tlb-icons ico-refresh',
							title: 'cloud.desktop.outlook.refresh'
						}
					],
					ready: false,
					visible: false,
					showMailboxContainer: true
				},
				detail: {
					id: outlookConstant.views.id.detail,
					toolbars: [],
					ready: true,
					visible: false,
					showMailboxContainer: false
				}
			};

			$scope.viewList = [
				$scope.views.login,
				$scope.views.sendBox,
				$scope.views.mailbox,
				$scope.views.detail
			];

			$scope.mailbox = {
				treeOptions: {
					clickHeaderFn: function (id, evt) {
						let treeItem = _.find($scope.mailbox.treeItems, {id: id});
						treeItem.expanded = !treeItem.expanded;
						treeItem.tabs.items.forEach(item => item.Isvisible = treeItem.expanded);
						evt.stopPropagation();
					},
					clickTabFn: function (id, evt, tabId) {
						let treeItem = _.find($scope.mailbox.treeItems, {id: id});
						let tabItem = _.find(treeItem.tabs.items, {Id: tabId});
						$scope.setSelectedAccount(treeItem.mailbox.mail, {
							name: tabItem.folder,
							displayName: tabItem.Description
						}, treeItem.mailbox.isShared);
						$scope.switchView($scope.views.mailbox);
					},
					collapseFn: function (id) {
						let treeItem = _.find($scope.mailbox.treeItems, {id: id});
						treeItem.expanded = false;
						treeItem.tabs.items.forEach(item => item.Isvisible = false);
					},
					expandFn: function (id) {
						let treeItem = _.find($scope.mailbox.treeItems, {id: id});
						treeItem.expanded = true;
						treeItem.tabs.items.forEach(item => item.Isvisible = true);
					},
					valueMember: 'id'
				},
				treeItems: []
			};

			const outlook = sidebarService.getSidebarIds().outlook;
			const checkAsync = outlookMainService.isShowInSidebar();

			const asyncExecute = function (asyncFn) {
				outlookMainService.onAsyncEventHappened.fire(true);
				return asyncFn().finally(() => {
					outlookMainService.onAsyncEventHappened.fire(false);
				});
			};

			$scope.initialize = function () {
				if (!$scope.isAuthenticated && !$scope.initializing) {
					$scope.initializing = true;
					outlookMainService.msalClient.isAuthenticated()
						.then(r => {
							if (!r.isAuthenticated) {
								return r;
							}
							return asyncExecute(() => {
								return outlookMainService.readProfile()
									.then((profile) => {
										$scope.profile = profile;
										$scope.addMailboxMenuItem(profile.mail, false);
										outlookMainService.setProfileSync(profile);
									})
									.then(() => {
										return outlookMainService.getSettings($scope.profile.mail);
									})
									.then(settings => {
										const folder = settings ? settings.Folder : outlookConstant.folders.inbox.name;
										const folderDisplayName = folder === outlookConstant.folders.inbox.name
											? $translate.instant(outlookConstant.folders.inbox.displayName)
											: $translate.instant(outlookConstant.folders.drafts.displayName);
										$scope.switchView($scope.views.mailbox);
										$scope.setSelectedAccount($scope.profile.mail, {
											name: folder,
											displayName: folderDisplayName
										}, false);
									})
									.finally(() => {
										$scope.isAuthenticated = r.isAuthenticated;
									});
							});
						})
						.catch(() => {
							$scope.$apply(() => {
								$scope.isAuthenticated = false;
								$scope.loginAccount = null;
							});
						})
						.finally(() => {
							$scope.initializing = false;
						});
				}
			};

			$scope.switchView = function (view) {
				$scope.viewList.forEach(v => {
					v.visible = false;
				});
				view.ready = view.visible = true;
				$scope.toolbars = view.toolbars;

				if ($scope.currentView) {
					$scope.lastView = $scope.currentView;
				}
				$scope.currentView = view;
				$scope.showMailboxContainer = view.showMailboxContainer;
			};

			$scope.hideMailboxMenu = function () {
				$scope.showMailboxMenu = false;
			};

			$scope.setSelectedAccount = function (mail, folder, isShared) {
				outlookMainService.setSelectedAccount({
					mail: mail
				}, folder, isShared, !isShared ? $scope.profile : {
					displayName: mail
				});
			};

			$scope.addMailboxMenuItem = function (mail, isShared, cssClass) {
				const length = $scope.mailbox.treeItems.length;
				$scope.mailbox.treeItems.push({
					id: 'menu-' + length,
					Description: mail,
					cssClass: cssClass ? cssClass : 'ico-document-folder',
					disabled: false,
					expanded: true,
					hasChildren: true,
					mailbox: {
						mail: mail,
						isShared: isShared,
					},
					tabs: {
						items: [
							{
								Id: 'menu-' + length + 'inbox',
								Description: $translate.instant(outlookConstant.folders.inbox.displayName),
								folder: outlookConstant.folders.inbox.name,
								Isvisible: true
							},
							{
								Id: 'menu-' + length + 'draft',
								Description: $translate.instant(outlookConstant.folders.drafts.displayName),
								folder: outlookConstant.folders.drafts.name,
								Isvisible: true
							}
						]
					}
				});
			};

			$scope.onSelectedAccountChanged = function (account) {
				if ($scope.selectedAccount) {
					outlookMainService.saveSettings($scope.selectedAccount.mailbox.mail, {
						Folder: account.folder.name
					});
				}
				$scope.selectedAccount = account;
			};

			$scope.onOpenSidebar = function (cmd) {
				if (cmd === sidebarService.getSidebarIdAsId(sidebarService.getSidebarIds().outlook)) {
					$scope.initialize();
				}
			};

			$scope.toolbarClick = function (id) {
				outlookMainService.onToolbarItemClick.fire({id: id});
			};

			$scope.toggleMailboxMenu = function (evt) {
				$scope.showMailboxMenu = !$scope.showMailboxMenu;
				evt.stopPropagation();
				evt.preventDefault();
			};

			$scope.onLoginSuccess = function () {
				$scope.initialize();
			};

			$scope.onAsyncEventHappened = function (isRunning) {
				$timeout(() => {
					$scope.isLoading = isRunning;
				});
			};

			$scope.onToolbarItemClick = function (arg) {
				switch (arg.id) {
					case outlookConstant.toolbars.id.new:
						$scope.switchView($scope.views.sendBox);
						break;
				}
			};

			$scope.onCloseViewRequest = function () {
				$scope.switchView($scope.lastView);
			};

			$scope.onSwitchViewRequest = function (arg) {
				switch (arg.id) {
					case outlookConstant.views.id.detail:
						$scope.switchView($scope.views.detail);
						break;
					case outlookConstant.views.id.sendBox:
						$scope.switchView($scope.views.sendBox);
						break;
				}
			};

			outlookMainService.onLoginSuccess.register($scope.onLoginSuccess);
			outlookMainService.onSwitchViewRequest.register($scope.onSwitchViewRequest);
			outlookMainService.onCloseViewRequest.register($scope.onCloseViewRequest);
			outlookMainService.onToolbarItemClick.register($scope.onToolbarItemClick);
			outlookMainService.onSelectedAccountChanged.register($scope.onSelectedAccountChanged);
			outlookMainService.onAsyncEventHappened.register($scope.onAsyncEventHappened);
			sidebarService.onOpenSidebar.register($scope.onOpenSidebar);

			checkAsync.then(isShow => {
				sidebarService.showHideButtons([{sidebarId: outlook, active: isShow}]);
				return isShow && (sidebarService.commandBarDeclaration.currentButton === '#' + outlook) && $scope.initialize();
			});

			$scope.$on('$destroy', function () {
				outlookMainService.onLoginSuccess.unregister($scope.onLoginSuccess);
				outlookMainService.onSwitchViewRequest.unregister($scope.onSwitchViewRequest);
				outlookMainService.onCloseViewRequest.unregister($scope.onCloseViewRequest);
				outlookMainService.onToolbarItemClick.unregister($scope.onToolbarItemClick);
				outlookMainService.onSelectedAccountChanged.unregister($scope.onSelectedAccountChanged);
				outlookMainService.onAsyncEventHappened.unregister($scope.onAsyncEventHappened);
				sidebarService.onOpenSidebar.unregister($scope.onOpenSidebar);
			});
		}
	]);
})(angular);