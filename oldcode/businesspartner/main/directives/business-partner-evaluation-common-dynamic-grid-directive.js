/**
 * Created by chi on 5/15/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).directive('businessPartnerEvaluationCommonDynamicGridDirective', businessPartnerEvaluationCommonDynamicGridDirective);

	angular.module(moduleName).directive('businessPartnerEvaluationCommonDynamicGridDirective', businessPartnerEvaluationCommonDynamicGridDirectiveFiller);
	//
	businessPartnerEvaluationCommonDynamicGridDirective.$inject = ['globals', '$templateRequest', '$rootScope', 'businessPartnerEvaluationCommonDynamicGridService'];

	function businessPartnerEvaluationCommonDynamicGridDirective(globals, $templateRequest, $rootScope, businessPartnerEvaluationCommonDynamicGridService) {

		return {
			restrict: 'A',
			priority: 100,
			transclude: 'element',
			controller: angular.noop,
			scope: {
				options: '='
			},
			compile: function () {
				return function (scope, ele, attr, ctrl, $transclude) {
					var currentScope,
						currentEle;
					var tempOptions = getOptions(scope);

					var name = tempOptions.name;
					var url = tempOptions.hasRead ? tempOptions.url : tempOptions.denyTemplate;

					businessPartnerEvaluationCommonDynamicGridService.registerEvent($rootScope, name, 'dynamic-grid-permission:changed', onDynamicGridPermissionChanged);

					scope.$on('$destroy', function () {
						cleanUpLastView();
						businessPartnerEvaluationCommonDynamicGridService.unregisterEvent(name, 'dynamic-grid-permission:changed');
					});

					setTimeout(function () {
						var tempOptions = getOptions(scope);
						updateContent(tempOptions);
					}, 0);

					// //////////////////////////////////
					function cleanUpLastView() {
						if (currentScope) {
							currentScope.$destroy();
							currentScope = null;
						}
						if (currentEle) {
							currentEle.remove();
							currentEle = null;
						}
					}

					function updateContent(opt) {
						if (!opt) {
							return;
						}

						var options = angular.copy(opt || tempOptions);
						url = options.hasRead ? options.url : options.denyTemplate;
						options.controller = ctrl.controller = options.hasRead ? options.controller : options.denyController;

						var template = businessPartnerEvaluationCommonDynamicGridService.getTemplate(opt.name);
						if (!template) {
							$templateRequest(url, true)
								.then(function (response) {
									var newScope = scope.$new();
									ctrl.template = response;
									businessPartnerEvaluationCommonDynamicGridService.storeTemplate(opt.name, response);
									newScope.options = options;
									currentEle = $transclude(newScope, function (clone) {
										ele.after(clone);
										if (currentScope) {
											currentScope.isUpdateGrid = true;
										}
										cleanUpLastView();
									});
									currentScope = newScope;
								});
						} else {
							var newScope = scope.$new();
							ctrl.template = template;
							newScope.options = options;
							currentEle = $transclude(newScope, function (clone) {
								ele.after(clone);
								if (currentScope) {
									currentScope.isUpdateGrid = true;
								}
								cleanUpLastView();
							});
							currentScope = newScope;
						}
					}

					function onDynamicGridPermissionChanged(e, args) {
						args = args || {};
						updateContent(args[name]);
					}
				};

				// ///////////
				function getOptions(scope) {
					var tempOptions = null;
					if (angular.isFunction(scope.options)) {
						tempOptions = scope.options();
					} else {
						tempOptions = scope.options;
					}
					return tempOptions;
				}
			}
		};
	}

	businessPartnerEvaluationCommonDynamicGridDirectiveFiller.$inject = ['$compile', '$controller'];

	function businessPartnerEvaluationCommonDynamicGridDirectiveFiller($compile, $controller) {
		return {
			restrict: 'A',
			priority: -100,
			require: 'businessPartnerEvaluationCommonDynamicGridDirective',
			link: function (scope, ele, attr, ctrl) {
				ele.html(ctrl.template);
				var linker = $compile(ele.contents());
				var ctrlName = ctrl.controller;
				// eslint-disable-next-line no-unused-vars
				var currentCtrl = null;
				if (ctrlName) {
					// eslint-disable-next-line no-unused-vars
					currentCtrl = $controller(ctrlName, {'$scope': scope});
				}

				scope.$on('$destroy', function () {
					currentCtrl = null;
				});

				linker(scope);
			}
		};
	}

	angular.module(moduleName).factory('businessPartnerEvaluationCommonDynamicGridService', businessPartnerEvaluationCommonDynamicGridService);

	function businessPartnerEvaluationCommonDynamicGridService() {
		var unregisterCache = {};
		var templateCache = {};
		var cache = {};
		var service = {};
		service.registerEvent = registerEvent;
		service.unregisterEvent = unregisterEvent;
		service.storeTemplate = storeTemplate;
		service.getTemplate = getTemplate;
		service.isNew = function isNew(name) {
			if (!cache[name]) {
				cache[name] = 1;
				return true;
			}
			return false;
		};
		service.clear = function clear() {
			cache = {};
		};
		return service;

		// //////////////////////////

		function registerEvent(rootScope, name, eventName, eventFn) {
			var key = getKey(name, eventName);
			doUnregister(key);
			unregisterCache[key] = rootScope.$on(eventName, eventFn);
		}

		function unregisterEvent(name, eventName) {
			var key = getKey(name, eventName);
			doUnregister(key);
		}

		function doUnregister(key) {
			if (unregisterCache[key]) {
				var unregister = unregisterCache[key];
				unregister();
				unregister = null;
				delete unregisterCache[key];
			}
		}

		function getKey(name, eventName) {
			return name + '_' + eventName;
		}

		function storeTemplate(name, template) {
			if (!templateCache[name]) {
				templateCache[name] = template;
			}
		}

		function getTemplate(name) {
			return templateCache[name];
		}
	}
})(angular);