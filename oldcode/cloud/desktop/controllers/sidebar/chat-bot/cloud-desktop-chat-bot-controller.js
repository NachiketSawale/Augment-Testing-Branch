/**
 * Created by lst on 6/28/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';
	angular.module(moduleName).controller('cloudDesktopChatBotController', ['_','$scope', '$injector', '$translate','cloudDesktopChatBotManagementService', '$timeout', 'cloudDesktopChatBotService','mainViewService',
		function (_,$scope, $injector, $translate,cloudDesktopChatBotManagementService, $timeout, cloudDesktopChatBotService, mainViewService) {
			cloudDesktopChatBotManagementService.initChatBotButton();
			function pushMessage(result) {
				var cards = cloudDesktopChatBotService.handleResult(result);
				_.each(cards,function(card){
					if(card) $scope.params.conversationLists.push(card);
				});
			}
			function textInKeyword(text, translateKeyword) {
				var keywords = $translate.instant('cloud.desktop.botChat.' + translateKeyword);
				var keywordList = keywords.toLowerCase().split(',');
				return keywordList.includes(text.trim().toLowerCase());
			}

			function textInSkip(text) {
				var keywords = $translate.instant('cloud.desktop.botChat.skip');
				var keywordList = keywords.toLowerCase().split(',');
				return keywordList.includes(text.trim().toLowerCase());
			}
			function cancelConversation() {
				var cards = [];
				cards.push({
					type: 'message', text: $translate.instant('cloud.desktop.botChat.taskCanceled')
				});
				_.each(cards,function(card){
					if(card) $scope.params.conversationLists.push(card);
				});
			}
			$scope.params = {
				inputValue: '',
				conversationLists: [],
				loading: false
			};
			$scope.methods = {
				// body methods
				blurText: function (item, editText) {
					editText = editText.target;
					var oldMsg = item.text;
					var newMsg = editText.innerText;
					if (newMsg !== '' && item.text !== newMsg) {
						$scope.params.conversationLists.push({type: 'user', text: newMsg});
						$scope.params.loading = true;
						cloudDesktopChatBotService.postMessages(newMsg).then(function (result) {
							$scope.params.loading = false;
							pushMessage(result);
						});
					}
					editText.innerText = oldMsg;
					item.edit = false;
				},
				enterEdit: function (e) {
					if (e.keyCode === 13) {
						e.target.blur();
					}
				},
				getCharLength: function (val) {
					// eslint-disable-next-line no-new-wrappers
					if(_.isNil(val)) return 0;
					var str = val.toString();
					var bytesCount = 0;
					for (var i = 0, n = str.length; i < n; i++) {
						var c = str.charCodeAt(i);
						if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
							bytesCount += 1;
						} else {
							bytesCount += 2;
						}
					}
					return bytesCount;
				},
				getName: function (context) {
					return context.split('.')[1];
				},
				formSubmit: function (inputs, index) {
					if (index !== ($scope.params.conversationLists.length - 1)) {
						return;
					}
					var context = {};
					for (var i = inputs.length - 1; i >= 0; i--) {
						var input = inputs[i];
						var name = $scope.methods.getName(input.context);
						context[name] = input.value;
					}
					context = JSON.stringify(context);
					$scope.params.loading = true;
					cloudDesktopChatBotService.postMessagesByContext(context).then(function (result) {
						$scope.params.loading = false;
						pushMessage(result);

					});
				},
				initTable: function () {
					setTimeout(function () {
						var tabs = $('.chat-bot .bodymain .conversation .table-card .table-box:not(.flex)');
						tabs.each(function (i, tab) {
							tab = $(tab);
							tab.addClass('flex');
							var head = $(tab.find('tr .th')[0]).parent();
							var height = head.height();
							tab.find('td').each(function (ind, td) {
								$(td).css('min-width', $(td).outerWidth() + 'px');
							});
							head.addClass('float');
							tab.find('table').css({'margin-top': height + 'px'});
							tab.scroll(function () {
								var sl = tab.scrollTop();
								head.css('top', sl + 'px');
							});
						});
					}, 300);
				},
				// click to edit user message
				tagMessage: function (item, e) {
					if (!item.replyToId) {
						item.edit = true;
						$timeout(function () {
							e.target.parentNode.children[1].focus();
						}, 200);
					}
				},

				// footer methods
				sendText: function () {
					var text = $scope.params.inputValue;
					if (text === '' || $scope.params.loading) {
						return false;
					}
					$scope.params.conversationLists.push({type: 'user', text: text});
					$scope.params.loading = true;
					if (textInKeyword(text, 'quitKeyword')) {
						if (cloudDesktopChatBotService.isTodoCard) {
							cloudDesktopChatBotService.isTodoCard = false;
						}
						$scope.params.loading = false;
						cancelConversation();
						cloudDesktopChatBotService.inTask = false;
					} else {
						if(textInSkip(text)) text = null;
						cloudDesktopChatBotService.postMessages(text).then(function (result) {
							$scope.params.loading = false;
							pushMessage(result);
						});
					}
					$scope.params.inputValue = '';
				},
				onKeyDown: function (e) {
					if (e.keyCode === 13 && !$scope.params.loading) {
						e.preventDefault();
						$scope.methods.sendText($scope.params.inputValue);
					}
				}
			};

			function autoScroll() {
				if ($scope.params.conversationLists.length > 0) {
					if ($scope.params.conversationLists[$scope.params.conversationLists.length - 1].type !== 'user') {
						return;
					}
					var msgEle = document.getElementById('message-list');
					var conver = document.getElementById('conversation');
					var scrollMsgNum = $scope.params.conversationLists.length - 1;
					for (var i = scrollMsgNum; i >= 0; i--) {
						if (!$scope.params.conversationLists[i].replyToId || !$scope.params.conversationLists[i].attachments) {
							scrollMsgNum = i;
							break;
						}
					}
					var lastEleHasHeight = msgEle.lastElementChild.children[0].clientHeight;
					for (var j = 0; j < msgEle.children.length; j++) {
						var nowChildren = msgEle.children[j].children[0];
						if (nowChildren && nowChildren.clientHeight > 0) {
							lastEleHasHeight = nowChildren.clientHeight;
						}
					}
					msgEle.style.paddingBottom = conver.clientHeight - lastEleHasHeight + 'px';
					conver.scrollTop = msgEle.children[scrollMsgNum].offsetTop - 30;
				}
			}

			$scope.$watch('params.conversationLists.length', function () {
				$timeout(function () {
					autoScroll();
				}, 10);
			}, true);

			// 2021-06-24
			$scope.ok = function (selectedTask) {
				if (selectedTask && selectedTask.Id === cloudDesktopChatBotService.currentAction.Id) {
					$scope.params.loading = true;
					var context = JSON.stringify(selectedTask.Context);
					cloudDesktopChatBotService.postMessagesByContext(context).then(function (result) {
						$scope.params.loading = false;
						pushMessage(result);
					});
				}
			};
			$scope.sendButtonText =  function($event,text) {
				$event.target.parentElement.hidden=true;
				$scope.params.inputValue = text;
				$scope.methods.sendText();
			};
			$scope.break = function () {
				$scope.params.loading = false;
				cloudDesktopChatBotService.inTask = false;
				cancelConversation();
			};
			// ids type should be like "1,3,4,5,6,7" string  type if navigate to multiple items
			$scope.navitation = function (module, ids) {
				var navigationItem = {
					ids: ids[0]
				};
				// make sure the mainservice is set, if not set , get module may cause an error.
				var currentModule = mainViewService.getCurrentModuleName();
				// if navigate to current module, call search method.
				if (currentModule && module === currentModule) {
					var cloudDesktopSidebarService = $injector.get('cloudDesktopSidebarService');
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				} else {
					var navService = $injector.get('platformModuleNavigationService');
					navService.navigate({ moduleName: module }, navigationItem, 'ids');
					// navService.navigate({ moduleName: module },navigationItem, 'sidebar-chatbot');
				}
			};
		}
	]);
})(angular);
