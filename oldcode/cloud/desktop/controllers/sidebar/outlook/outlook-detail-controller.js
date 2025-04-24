/**
 * Created by wed on 8/18/2023.
 */
(function (angular) {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopOutlookDetailController', [
		'_',
		'moment',
		'$scope',
		'cloudDesktopOutlookConstant',
		'cloudDesktopOutlookMainService',
		'cloudDesktopOutlookAttachmentService',
		'platformDragdropService',
		'PlatformMessenger',
		function (
			_,
			moment,
			$scope,
			outlookConstant,
			outlookMainService,
			outlookAttachmentService,
			platformDragdropService,
			PlatformMessenger
		) {
			$scope.displayNumber = 4;
			$scope.message = null;
			$scope.url = null;
			$scope.photoUrl = null;
			$scope.showAll = false;
			$scope.attachments = null;

			$scope.loadEmail = function (message) {
				$scope.message = {
					subject: message.subject
				};
				outlookMainService.onAsyncEventHappened.fire(true);
				outlookMainService.graphClient.api(`/me/messages/${message.id}`)
					.select('subject,body,toRecipients,flag,from,hasAttachments,importance,isRead,replyTo,sender,sentDateTime,webLink,ccRecipients,attachments')
					.expand('attachments($select=id,name,isInline,size)')
					.get()
					.then(result => {
						$scope.message = _.extend($scope.message, result, {
							sentDateTime: moment(result.sentDateTime).format('MM.DD.YYYY HH:mm')
						});
						$scope.attachments = result.attachments.filter(m => m.isInline === false);
						$scope.showAll = $scope.message.toRecipients.length <= $scope.displayNumber && $scope.message.ccRecipients.length <= $scope.displayNumber;
						const inlineDocs = result.attachments.filter(m => outlookAttachmentService.isPossibleInlineFile(m.size));
						return outlookAttachmentService.getAttachments(message.id, inlineDocs);
					})
					.then((attachments) => {
						$scope.message.body.content = $scope.message.body.content.replace(new RegExp('href=[\'"](.+?)[\'"]', 'g'), 'href="$1" target="_blank"');

						if (attachments && attachments.length) {
							$scope.message.body.content = outlookAttachmentService.processAttachments($scope.message.body.content, attachments);
						}
					})
					.then(() => {
						return outlookMainService.graphClient.api(`/users/${$scope.message.from.emailAddress.address}/photos/48x48/$value`)
							.get()
							.then(blob => {
								$scope.photoUrl = URL.createObjectURL(blob);
							})
							.catch(error => {
								console.warn(error.message);
							});
					})
					.then(() => {
						$scope.openAsURL();
					})
					.finally(() => {
						outlookMainService.onAsyncEventHappened.fire(false);
						if ($scope.message && !$scope.message.isRead) {
							return outlookMainService.graphClient.api(`/me/messages/${$scope.message.id}`).patch({
								id: $scope.message.id,
								isRead: true
							});
						}
					});
			};

			$scope.openAsURL = function () {
				$scope.url = URL.createObjectURL(new Blob([$scope.message.body.content], {type: 'text/html'}));
				angular.element('.content-scrollable').find('iframe').attr('src', $scope.url);
			};

			$scope.removeURL = function () {
				if ($scope.url) {
					URL.revokeObjectURL($scope.url);
					$scope.url = null;
				}
				if ($scope.photoUrl) {
					URL.revokeObjectURL($scope.photoUrl);
					$scope.photoUrl = null;
				}
			};

			$scope.getUserName = function () {
				if (!$scope.message || !$scope.message.from) {
					return '';
				}
				const name = $scope.message.from.emailAddress.name || $scope.message.from.emailAddress.address;
				const shortNames = name.split(/[\s\\.-]/);
				return shortNames.length > 1
					? (shortNames[0][0].toUpperCase() + shortNames[1][0].toUpperCase())
					: (shortNames[0][0].toUpperCase() + (shortNames[0][1] || '').toUpperCase());
			};

			$scope.close = function () {
				outlookMainService.onCloseViewRequest.fire();
				$scope.reset();
			};

			$scope.showMore = function () {
				$scope.showAll = true;
			};

			$scope.reset = function () {
				$scope.removeURL();
				$scope.message = null;
				$scope.attachments = null;
				$scope.showAll = false;
				angular.element('.content-scrollable').find('iframe').attr('src', 'about:blank');
			};

			$scope.onSwitchViewRequest = function (arg) {
				switch (arg.id) {
					case outlookConstant.views.id.detail:
						$scope.loadEmail(arg.data);
						break;
				}
			};

			$scope.onMouseEnterAttachment = function () {
				let ddTarget = {
					canDrop: function(){
						return true;
					},
					drop: function(){
					},
					getAllowedActions: function () {
						return [platformDragdropService.actions.copy];
					}
				};
				ddTarget._onDragStarted = new PlatformMessenger();
				ddTarget._onDragStarted.register(function(draggedData){
				});
				platformDragdropService.mouseEnter(ddTarget);
			};

			$scope.onMouseDownAttachment = function(item) {
				platformDragdropService.startDrag({
					messageId: $scope.message.id,
					sourceGrid: {
						data: [item],
						type: 'outlook',
						itemService: outlookMainService,
						attachmentService: outlookAttachmentService,
						copy: function(){ }
					},
					draggingFromDraft: false
				}, [
					platformDragdropService.actions.link
				], {
					number: [item].length,
					text: item.subject
				});
			}

			outlookMainService.onSwitchViewRequest.register($scope.onSwitchViewRequest);

			$scope.$on('$destroy', function () {
				outlookMainService.onSwitchViewRequest.unregister($scope.onSwitchViewRequest);
				$scope.reset();
			});
		}]);
})(angular);