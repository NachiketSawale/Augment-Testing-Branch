/**
 * Created by wed on 7/26/2023.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopOutlookInboxController', [
		'_',
		'$scope',
		'$timeout',
		'$window',
		'$translate',
		'moment',
		'platformDomainService',
		'cloudDesktopOutlookConstant',
		'cloudDesktopOutlookMainService',
		'basicsLookupdataPopupService',
		function (
			_,
			$scope,
			$timeout,
			$window,
			$translate,
			moment,
			platformDomainService,
			outlookConstant,
			outlookMainService,
			popupService
		) {
			const pageSize = 100;
			const noEmailTip = $translate.instant('cloud.desktop.outlook.noEmailTip');

			$scope.mails = [];
			$scope.mailFolders = [];
			$scope.profile = null;
			$scope.option = {
				loadedTotal: 0,
				parentFolderId: $scope.selectedFolderId,
				orderBy: 'receivedDateTime desc'
			};
			$scope.orderbyIcon = 'ico-evaluation-max';
			$scope.selectOptions = {
				items: [{
					Name: $translate.instant('cloud.desktop.outlook.oneMonth'),
					Id: 1
				}, {
					Name: $translate.instant('cloud.desktop.outlook.oneWeek'),
					Id: 2
				}, {
					Name: $translate.instant('cloud.desktop.outlook.halfYear'),
					Id: 3
				}, {
					Name: $translate.instant('cloud.desktop.outlook.oneYear'),
					Id: 4
				}],
				displayMember: 'Name',
				valueMember: 'Id'
			};
			$scope.entity = {
				Name: $translate.instant('cloud.desktop.outlook.oneMonth'),
				Id: 1
			};
			$scope.orderByField = {
				field: 'receivedDateTime',
				description: $translate.instant('cloud.desktop.outlook.date')
			};
			$scope.orderDirection = 'desc';
			$scope.noEmailTip = '';
			$scope.sortMenuGroups = [
				{
					name: 'Filter',
					children: [
						{
							field: 'all',
							description: $translate.instant('cloud.desktop.outlook.allEmail')
						},
						{
							field: 'unread',
							description: $translate.instant('cloud.desktop.outlook.unReadEmail')
						}
					]
				},
				{
					name: 'Arrange By',
					children: [
						{
							field: 'receivedDateTime',
							description: $translate.instant('cloud.desktop.outlook.date')
						},
						{
							field: 'from.emailAddress.name',
							description: $translate.instant('cloud.desktop.outlook.from')
						},
						{
							field: 'toRecipients[0].emailAddress.name',
							description: $translate.instant('cloud.desktop.outlook.to')
						}
					]
				}
			];
			$scope.isShowMore = false;
			$scope.isUnread = false;

			const onToolbarItemClick = function (arg) {
				if ($scope[arg.id] && _.isFunction($scope[arg.id])) {
					$scope[arg.id]();
				}
			};

			const asyncExecute = function (asyncFn) {
				outlookMainService.onAsyncEventHappened.fire(true);
				return asyncFn().finally(() => {
					outlookMainService.onAsyncEventHappened.fire(false);
				});
			};

			const getMails = function (option) {
				let defaultFields = 'parentFolderId,sender,subject,bodyPreview,receivedDateTime,isRead,hasAttachments,isDraft,webLink,toRecipients,from,toRecipients';
				let defaultOrderBy = 'receivedDateTime desc';

				let url;
				let role = '/me';
				if (option.parentFolderId) {
					url = role + '/mailFolders/' + option.parentFolderId + '/messages';
				} else {
					let inboxFolder = _.find($scope.mailFolders, folder => folder.name === 'Inbox');
					if (inboxFolder) {
						$scope.selectedFolderId = inboxFolder.id;
						$scope.option.parentFolderId = inboxFolder.id;
						url = role + '/mailFolders/' + inboxFolder.id + '/messages';
					} else {
						url = role + '/messages';
					}
				}
				let fields = option.fields ? option.fields : defaultFields;
				let orderBy = option.orderBy ? option.orderBy : defaultOrderBy;

				let promise = outlookMainService.graphClient.api(url);

				let filterStr = '';
				if (option.filterOption && option.filterOption.filterDate) {
					filterStr += 'receivedDateTime gt ' + option.filterOption.filterDate;
				}
				if (option.filterOption && option.filterOption.filterUnRead) {
					filterStr = filterStr === '' ? 'isRead eq false' : filterStr + ' and ' + 'isRead eq false';
				}
				if (filterStr) {
					promise = promise.filter(filterStr);
				}
				return promise
					.select(fields)
					.orderby(orderBy)
					.skip(option.loadedTotal)
					.top(pageSize)
					.get();
			};

			const addInboxMailFolder = function () {
				let url = '/me/mailFolders/inbox';
				return outlookMainService.graphClient
					.api(url)
					.get();
			};

			const addDraftsMailFolder = function () {
				let url = '/me/mailFolders/drafts';
				return outlookMainService.graphClient
					.api(url)
					.get();
			};

			const onSelectedAccountChanged = function (account) {
				$scope.profile = account.profile;
				if (account.mailbox) {
					let inboxFolder = _.find($scope.mailFolders, folder => folder.name === account.folder.name);
					if (inboxFolder) {
						$scope.selectedFolderId = inboxFolder.id;
						$scope.option.parentFolderId = inboxFolder.id;
					}
					$scope.refresh();
				}
			};

			$scope.initialize = function () {
				let filterDate = getFilterDate(30);
				angular.merge($scope.option, {
					filterOption: {
						filterDate: filterDate
					}
				});
				addInboxMailFolder().then((inboxFolder) => {
					inboxFolder.name = outlookConstant.folders.inbox.name;
					$scope.mailFolders.push(inboxFolder);

					addDraftsMailFolder().then(draftsFolder=>{
						draftsFolder.name = outlookConstant.folders.drafts.name;
						$scope.mailFolders.push(draftsFolder);

						let account = outlookMainService.getSelectedAccount();
						let inboxFolder = _.find($scope.mailFolders, folder => folder.name === account.folder.name);
						if (inboxFolder) {
							$scope.selectedFolderId = inboxFolder.id;
							$scope.option.parentFolderId = inboxFolder.id;
						}
						$scope.refresh();
					});
				});
			};

			$scope.getReceivedDate = function (item) {
				return moment(item['receivedDateTime']).format('L');
			};

			$scope.viewMore = function () {
				asyncExecute(() => {
					return getMails($scope.option).then(result => {
						$scope.$apply(() => {
							$scope.mails = $scope.mails.concat(result.value);
							$scope.option.loadedTotal += result.value.length;
							reSort();
							if (result.value.length > 0) {
								if (result.value < pageSize) {
									$scope.isShowMore = false;
								} else {
									$scope.isShowMore = true;
								}
							} else {
								$scope.isShowMore = false;
							}
						});
					});
				});
			};

			$scope.refresh = function () {
				asyncExecute(() => {
					$scope.option.loadedTotal = 0;
					return getMails($scope.option).then(result => {
						$scope.$apply(() => {
							$scope.mails = result.value;
							$scope.option.loadedTotal = result.value.length;
							reSort();
							if (result.value.length > 0) {
								if (result.value.length < pageSize){
									$scope.isShowMore = false;
								}
								else {
									$scope.isShowMore = true;
								}
							} else {
								$scope.noEmailTip = noEmailTip;
								$scope.isShowMore = false;
							}
						});
					});
				});
			};

			$scope.onFilterChanged = function () {
				let selectedOption = $scope.entity;
				let filterDate = '';
				switch (selectedOption.Id) {
					case 1:
						filterDate = getFilterDate(30);
						break;
					case 2:
						filterDate = getFilterDate(7);
						break;
					case 3:
						filterDate = getFilterDate(180);
						break;
					case 4:
						filterDate = getFilterDate(365);
						break;
				}
				if (filterDate) {
					asyncExecute(() => {
						angular.merge($scope.option, {
							filterOption: {
								filterDate: filterDate
							}
						});
						$scope.option.loadedTotal = 0;
						return getMails($scope.option).then(result => {
							$scope.$apply(() => {
								if (result.value.length > 0) {
									$scope.mails = result.value;
									$scope.option.loadedTotal = result.value.length;
									reSort();
									if (result.value.length < pageSize) {
										$scope.isShowMore = false;
									} else {
										$scope.isShowMore = true;
									}
								} else {
									$scope.noEmailTip = noEmailTip;
									$scope.isShowMore = false;
								}
							});
						});
					});
				}
			};

			$scope.openInOutlook = function (item) {
				item.isRead = true;
				$window.open(item['webLink'], '_blank');
			};

			$scope.openInSidebar = function (item) {
				if (item['isDraft']) {
					return;
				}

				item.isRead = true;
				outlookMainService.onSwitchViewRequest.fire({
					id: outlookConstant.views.id.detail,
					data: item
				});
			};

			$scope.editInSidebar = function (item) {
				outlookMainService.onSwitchViewRequest.fire({
					id: outlookConstant.views.id.sendBox,
					data: item
				});
			};

			$scope.popupSortMenu = function (evt) {
				popupService.showPopup({
					scope: $scope,
					multiPopup: false,
					plainMode: true,
					hasDefaultWidth: false,
					focusedElement: angular.element(evt.target),
					template: [
						'<ul class="dropdown-menu_">',
						'  <li data-ng-repeat="group in sortMenuGroups">',
						'     <ul>',
						'        <li>',
						'           <button class="title" disabled data-ng-bind="group.name"></button>',
						'        </li>',
						'        <li class="flex-box" data-ng-repeat="child in group.children">',
						'           <button data-ng-click="sortBy(child)" data-ng-bind="child.description"></button>',
						'        </li>',
						'     </ul>',
						'  </li>',
						'</ul>'
					].join('')
				});
			};

			$scope.changeOrderBy = function () {
				let originDirection = $scope.orderDirection;
				$scope.orderDirection = originDirection === 'desc' ? 'asc' : 'desc';
				$scope.orderbyIcon = originDirection === 'desc' ? 'ico-evaluation-min' : 'ico-evaluation-max';
				reSort();
			};

			$scope.sortBy = function (item) {
				if (_.includes(['all', 'unread'], item.field)) {
					if ('all' === item.field) {
						$scope.isUnread = false;
						angular.merge($scope.option, {
							filterOption: {
								filterUnRead: false
							}
						});
					} else if ('unread' === item.field) {
						$scope.isUnread = true;
						angular.merge($scope.option, {
							filterOption: {
								filterUnRead: true
							}
						});
					}
					popupService.hidePopup(0);
					$scope.refresh();
				} else {
					$scope.orderByField = item;
					$scope.mails = _.orderBy($scope.mails, item.field, $scope.orderDirection);
					popupService.hidePopup(0);
				}
			};

			$scope.getOrderDirectionTip = function (){
				let tip = '';
				if ($scope.orderByField.field === 'receivedDateTime'){
					tip = $scope.orderDirection === 'desc'? $translate.instant('cloud.desktop.outlook.newestOnTop'):$translate.instant('cloud.desktop.outlook.oldestOnTop');
				}
				else {
					tip = $scope.orderDirection === 'desc'? $translate.instant('cloud.desktop.outlook.zToaOnTop'):$translate.instant('cloud.desktop.outlook.aTozOnTop');
				}
				return tip;
			};

			function reSort() {
				if ($scope.orderByField && $scope.orderDirection) {
					$scope.mails = _.orderBy($scope.mails, $scope.orderByField.field, $scope.orderDirection);
				}
			}

			function onDraftRequest(result) {
				switch (result.action) {
					case outlookConstant.actions.draft.send:
					case outlookConstant.actions.draft.create: {
						$timeout(()=>{
							$scope.refresh();
						}, 500);
						break;
					}
					case outlookConstant.actions.draft.delete: {
						$scope.$apply(() => {
							_.remove($scope.mails, item => item.id === result.data.id);
						});
						break;
					}
				}
			}

			outlookMainService.onToolbarItemClick.register(onToolbarItemClick);
			outlookMainService.onSelectedAccountChanged.register(onSelectedAccountChanged);
			outlookMainService.onDraftRequest.register(onDraftRequest);

			$scope.$on('$destroy', function () {
				outlookMainService.onToolbarItemClick.unregister(onToolbarItemClick);
				outlookMainService.onSelectedAccountChanged.unregister(onSelectedAccountChanged);
				outlookMainService.onDraftRequest.unregister(onDraftRequest);
			});

			function getFilterDate(days) {
				let date = Date.now();
				date = date.valueOf();
				date = date - days * 24 * 60 * 60 * 1000;
				date = new Date(date);
				return moment.utc(date).format('YYYY-MM-DD');
			}

			$scope.initialize();
		}
	]);
})(angular);