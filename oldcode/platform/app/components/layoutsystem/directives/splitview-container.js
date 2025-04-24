/*
 * $Id: splitview-container.js 2023-03-13 13:29:55Z rib\ong $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	splitContainerView.$inject = ['$rootScope', 'mainViewService', '$templateCache', 'platformManualGridService'];
	splitContainerController.$inject = ['_', '$scope', 'platformToolbarService', 'cloudDesktopHotKeyService', '$translate'];

	angular.module('platform').directive('splitContainerView', splitContainerView);

	function splitContainerController(_, $scope, platformToolbarService, cloudDesktopHotKeyService, $translate) {
		let scope = $scope;

		scope.setTools = function (tools, cached) {
			// refactoring of tool items to get the correct order.
			// Should be moved into the controllers, when all containers use a base controller.
			tools.items = platformToolbarService.getTools(scope.id, tools.items, cached);
			tools.version = Math.random();
			tools.refreshVersion = Math.random();
			tools.update = function () {
				platformToolbarService.ensureOverflowButton(tools.items);
				tools.version += 1;
			};
			tools.refresh = function () {
				tools.refreshVersion += 1;
			};
			scope.tools = tools;
		};

		scope.unregisterToolbarShortcuts = function unregisterToolbarShortcuts() {
			if(scope.tools && scope.tools.items) {
				scope.tools.items.forEach(function(item) {
					if(cloudDesktopHotKeyService.hasHotKey(item.id) && item.fn) {
						// console.log(scope.getContainerUUID() + ' - Unregister hotkey: ' + item.id);
						cloudDesktopHotKeyService.unregister(item.id, item.fn);
						cloudDesktopHotKeyService.resetDescription(item.id);
					}
				});
			}
		};

		scope.registerToolbarShortcuts = function registerToolbarShortcuts() {
			if(scope.tools && scope.tools.items) {
				scope.tools.items.forEach(function(item) {
					if(cloudDesktopHotKeyService.hasHotKey(item.id) && item.fn) {
						// console.log(scope.getContainerUUID() + ' - Register hotkey: ' + item.id);
						cloudDesktopHotKeyService.register(item.id, item.fn, item.isDisabled, item.isDisplayed);
						cloudDesktopHotKeyService.setDescription(item.id, $translate.instant(item.caption));
					}
				});
			}
		};

		scope.hideHeader = function() {
			return false;
		};

		scope.setTitle = function (title) {
			scope.title = title;
		};

		scope.$on('$destroy', function () {
			if (scope.tools) {
				scope.tools.items = [];
				scope.tools.update();
			}
			scope = null;
		});
	}

	function splitContainerView($rootScope, mainViewService, $templateCache, platformManualGridService) {
		function link(scope, $element, attrs, ctrl, $transclude) {
			if(attrs.id) {
				let ele = $element;
				let contentResized = new Platform.Messenger();

				scope.onContentResized = function (func) {
					contentResized.register(func);
				};

				$rootScope.$on('splitContainer.resize', function (e, jobId) {
					if(jobId.includes(attrs.id)) {
						let args = {
							pane: attrs.id,
							width: ele.width(),
							height: ele.height()
						};
						contentResized.fire(args);

						platformManualGridService.resizeGridContainer(ele.find('.platformgrid'));
					}
				});

				scope.id = attrs.id;

				$transclude(scope, function (clone) {
					let content = ele.find('.subview-content');
					if(content) {
						content.append(clone);
					}
				});
			}
			else {
				console.log('Please define an id for the splitviewcontainer');
			}
		}
		return {
			template: $templateCache.get('splitview-container'),
			restrict: 'A',
			scope: true,
			transclude: true,
			controller: splitContainerController,
			controllerAs: 'splitViewCtrl',
			link: link
		};
	}
})(angular);