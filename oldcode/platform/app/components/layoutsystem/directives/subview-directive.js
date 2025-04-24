/*
 * $Id: subview-directive.js 614236 2020-11-23 13:29:55Z saa\mik $
 * Copyright (c) RIB Software GmbH
 */

(function (angular, Platform) {
	'use strict';

	subviewDirective.$inject = ['$templateRequest', '$rootScope', 'mainViewService'];

	function subviewDirective($templateRequest, $rootScope, mainViewService) {
		function compile() {
			return function (scope, ele, attr, ctrl, $transclude) {
				var currentScope;
				var currentEle;
				var previousEle;
				var unregister = [];

				function cleanUpLastView() {
					if (previousEle) {
						previousEle.remove();
						previousEle = null;
					}
					if (currentScope) {
						currentScope.$destroy();
						currentScope = null;
					}
					if (currentEle) {
						previousEle = currentEle;
						currentEle.remove();
						currentEle = null;
					}
				}

				function updateContent(url) {
					if (url) {
						$templateRequest(url, true)
							.then(function (response) {
								var newScope = scope.$new();
								ctrl.template = response;

								currentEle = $transclude(newScope, function (clone) {
									ele.after(clone);
									cleanUpLastView();
								});
								currentScope = newScope;
							});
					} else {
						cleanUpLastView();
						ctrl.template = null;
					}
				}

				unregister.push($rootScope.$on('permission-service:changed', function () {
					var container = mainViewService.getContainerByUuid(scope.getContainerUUID());

					if (_.get(container, 'state.update', false)) {
						updateContent(container.template);
					}
				}));

				unregister.push(scope.$on('tabchanged', function () {
					var container = mainViewService.getContainerByUuid(scope.getContainerUUID());
					$rootScope.$emit('updateRequested');
					updateContent(container.template);
				}));

				unregister.push(scope.$on('$destroy', function () {
					cleanUpLastView();

					_.over(unregister)();
					unregister = null;
				}));

				setTimeout(function () {
					updateContent(scope.getCurrentContentUrl());
				}, 0);
			};
		}

		return {
			restrict: 'A',
			priority: 400,
			terminal: true,
			transclude: 'element',
			controller: angular.noop,
			compile: compile
		};
	}

	subviewDirectiveFiller.$inject = ['$compile', '$controller', '$rootScope', 'mainViewService', 'platformContainerUiAddOnService'];

	function subviewDirectiveFiller($compile, $controller, $rootScope, mainViewService, platformContainerUiAddOnService) {
		function link(scopeRef, eleRef, attr, ctrl) {
			var ele = eleRef;
			var scope = scopeRef;
			var unregister = [];

			ele.html(ctrl.template);

			platformContainerUiAddOnService.addManagerAccessor(scope, ele, onResize);

			var linker = $compile(ele.contents());
			var ctrlName = scope.getCurrentCtrl();
			var currentCtrl;
			var contentResized = new Platform.Messenger();
			var splitter = ele.closest('.k-splitter').data('kendoSplitter');
			var paneId;

			function onResize() {
				if (ele !== null) {
					var args = {
						pane: paneId,
						width: ele.width(),
						height: ele.height()
					};
					contentResized.fire(args);
				}
			}

			if (!splitter) {
				scope.onContentResized = function (func) {
					contentResized.register(func);
				};
				paneId = ele.closest('div[sub-view-container]').attr('id');
				window.onresize = onResize;
			} else {
				scope.onContentResized = function (func) {
					contentResized.register(func);
				};
				paneId = ele.closest('div[sub-view-container]').attr('id');
				splitter.bind('resize', onResize);
			}

			if (ctrlName !== '') {
				currentCtrl = $controller(ctrlName, {'$scope': scope});
			}

			scope.getCurrentDimensions = function () {
				if (ele) {
					return {
						width: ele.width(),
						height: ele.height()
					};
				} else {
					return {
						width: null,
						height: null
					};
				}
			};

			unregister.push($rootScope.$on('before-save-entity-data', function () {
				scope.toolbarDisabled = true;
				scope.getUiAddOns().disableToolbar(null);
			}));

			unregister.push($rootScope.$on('after-save-entity-data', function () {
				scope.toolbarDisabled = false;
				scope.getUiAddOns().enableToolbar(null);
			}));

			unregister.push(scope.$on('$destroy', function () {
				currentCtrl = null;

				if (splitter) {
					splitter.unbind('resize', onResize);
					splitter = null;
				}

				if (scope.$parent.tools) {
					scope.$parent.tools.items = [];
					scope.$parent.tools.update();
				}

				_.over(unregister)();

				unregister = null;
				scope.containerAddOnManager = null;
				ele = null;
				scope = null;
			}));

			scope.getUiAddOns().getFullsizeButton();

			linker(scope);
		}

		return {
			restrict: 'A',
			priority: -400,
			require: 'subContainerView',
			link: link
		};
	}

	angular.module('platform').directive('subContainerView', subviewDirective);
	angular.module('platform').directive('subContainerView', subviewDirectiveFiller);

})(angular, Platform);