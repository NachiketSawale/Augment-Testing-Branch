(() => {
	'use strict';

	angular.module('platform').directive('platformContainerShortcut', platformContainerShortcut);

	platformContainerShortcut.$inject = ['cloudDesktopSidebarService', 'cloudDesktopSidebarPinSettingsService'];

	function platformContainerShortcut(cloudDesktopSidebarService, cloudDesktopSidebarPinSettingsService) {
		return {
			restrict: 'EA',
			scope: {
				options: '='
			},
			templateUrl: globals.appBaseUrl + 'app/components/overlay/template/container-shortcut.html',
			link: function(scope) {


				function getLetterContent(content) {
					let toReturn = _.get(content.shortcuts, content.id);

					if (!toReturn && scope.options.shortcutList.length > 0) {
						if (scope.options.shortcutList[0].character === '-') {
							scope.options.shortcutList.shift();
						}
						toReturn = scope.options.shortcutList[0].character;
						scope.options.shortcutList.shift();
					}
					return toReturn;
				}

				scope.existsLetter = function(content) {
					if(content.letter || !scope.options.isContainerShown) {
						return true;
					}
					let value = getLetterContent(content);
					if(value && value !== '-') {
						content.letter = value;
						scope.options.viewShortcutList.push({id:content.id, shortcut: content.letter});
						return true;
					}
					return false;
				};

				function getPinStatusInfo(pinStatus) {
					//if pin checked and buttonId exist --> overlay-container on sidebar-container
					if (pinStatus.active && scope.options.sidebarLastButtonId) {
						return true;
					} else {
						return false;
					}
				}

				function processForSidebarContainer() {
					let pinStatus = cloudDesktopSidebarPinSettingsService.getPinStatus();
					scope.isPinStatusActive = getPinStatusInfo(pinStatus);

					cloudDesktopSidebarService.onCloseSidebar.fire(false);
				}

				function initViews() {
					processForSidebarContainer();
				}

				function watchfn() {
					if(scope.options.hasOwnProperty('shortcutViews')) {
						initViews();
					}
				}

				scope.$watch('options', watchfn);
			}
		};
	}
})();