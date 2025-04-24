/**
 * Created by wui on 2/4/2015.
 * @description show popup window service.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	// default popup options.
	angular.module(moduleName).constant('basicsLookupdataPopupDefaultOptions', {
		// element, popup window will open under this element.
		focusedElement: null,
		// element, stop closing popup window if event 'click' occurs in this element and its content.
		relatedTarget: null,
		// string, popup content template.
		template: '',
		// string, popup content template url.
		templateUrl: '',
		// function, angular controller for template.
		controller: null,
		// string, optional, alias of controller in scope.
		controllerAs: '',
		// function, optional, prepare necessary data before compile template.
		resolve: null,
		// decimal, optional, popup window width.
		width: 0,
		// decimal, optional, popup window height.
		height: 0,
		// decimal value, default 0, popup window min-width.
		minWidth: 0,
		// decimal, optional, popup window max width.
		maxWidth: 0,
		// decimal value, default 0, popup window min-height
		minHeight: 0,
		// decimal, optional, popup window max height.
		maxHeight: 0,
		// string, optional, template.
		footerTemplate: '',
		//  string, optional, template url.
		footerTemplateUrl: '',
		// function, optional, callback after stop resizing.
		resizeStop: null,
		// function, optional, callback to clear external resource after closing popup window.
		clear: null,
		// boolean, optional, default false, if it is true, then resize feature and footer will be disabled,
		// popup window will be similar to standard combo popup window
		plainMode: false,
		// boolean, optional, default false, if it is true, service will save popup window size to local storage after resize
		// window, then next time open window it will have size the same as last time resize.
		showLastSize: false,
		// allow opening multi popup window.
		multiPopup: false,
		// popup level
		level: 0,
		// popup alignment
		align: null,
		showActionButtons: false,
		okAction: null
	});

	/* jshint -W072 */ // this function has too many parameters.
	angular.module(moduleName).factory('basicsLookupdataPopupService', [
		'_', '$q',
		'$rootScope',
		'$templateCache',
		'$controller',
		'$compile',
		'$http',
		'$injector',
		'PlatformMessenger',
		'basicsLookupdataLookupViewService',
		'basicsLookupdataPopupDefaultOptions',
		'$translate',
		function (_, $q,
			$rootScope,
			$templateCache,
			$controller,
			$compile,
			$http,
			$injector,
			PlatformMessenger,
			basicsLookupdataLookupViewService,
			basicsLookupdataPopupDefaultOptions,
			$translate) {

			// the popup instances opened
			var popups = [];

			return {
				showPopup: showPopup,
				hidePopup: hidePopup,
				getToggleHelper: getToggleHelper,
				toggleLevelPopup: toggleLevelPopup,
				buildGridPopupOptions: buildGridPopupOptions,
				buildListPopupOptions: buildListPopupOptions,
				getOpenPopupInstances: getOpenPopupInstances
			};

			function getOpenPopupInstances() {
				return popups;
			}

			/**
			 * @description show popup window.
			 */
			function showPopup(options) {
				var settings = $.extend({}, basicsLookupdataPopupDefaultOptions, options);
				var popupOpenedDeferred = $q.defer();
				var popupResultDeferred = $q.defer();
				var popupClosedDeferred = $q.defer();
				var popupOKDeferred = $q.defer();

				var parentScope = settings.scope || $rootScope;
				var focusedElement = settings.focusedElement;
				var popupObject = null;

				// verify options
				if (!settings.template && !settings.templateUrl) {
					throw new Error('One of template or templateUrl options is required.');
				}

				if(!settings.focusedElement) {
					throw new Error('focusedElement options is required.');
				}

				settings.resolve = settings.resolve || {};

				// close popup, resolve popupResultDeferred promise with result.
				var close = function (result) {
					var success = false;
					if (popupObject) {
						popupResultDeferred.resolve(result);
						popupObject.close();
						success = true;
					}
					return success;
				};

				var popupInstance = {
					level: settings.level,
					align: null,
					element: null,
					// close popup window and transfer result.
					close: close,
					// is popup window closed.
					isClosed: false,
					// promise to result from popup window, fired after popup closed.
					result: popupResultDeferred.promise,
					// promise to popup window opened, fired when popup opened.
					opened: popupOpenedDeferred.promise,
					// promise to popup window closed, fired when popup closed.
					closed: popupClosedDeferred.promise,
					// promise to popup window if clicked ok-button in popup-footer.
					okClicked: popupOKDeferred.promise,
					// it is fired after stop resizing popup window.
					onResizeStop: new PlatformMessenger(),
					helper: getToggleHelper(),
					showChild: function (childOptions) {
						childOptions.level = this.level + 1;
						childOptions.align = this.align;
						return this.helper.show(childOptions);
					},
					hideChild: function () {
						this.helper.hide();
					}
				};

				var templateAndResolvePromise =
						$q.all([getTemplatePromise(settings), getFooterTemplatePromise(settings)].concat(getResolvePromises(settings.resolve)));

				var unbindCloseFn = bindCloseFn();

				// bind close method to parent scope.
				function bindCloseFn() {
					parentScope.$close = close;
					return function () {
						parentScope.$close = null;
						delete parentScope.$close;
					};
				}

				// remove popup instance from popups
				function removePopup() {
					popups = popups.filter(function (item) {
						return item !== popupInstance;
					});
				}

				popups.push(popupInstance);

				templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
					var ctrlInstance, ctrlLocals = {};
					var resolveIter = 2;
					var popupScope = parentScope.$new();
					var template = tplAndVars[0];
					var footerTemplate = tplAndVars[1];
					var content = angular.element(template);
					var context = $.extend({}, settings, {
						resizeStop: function (e, args) {
							popupInstance.onResizeStop.fire(e, args);
							if (settings.showLastSize) {
								basicsLookupdataLookupViewService.saveSize(settings.uuid, args.size);
							}
						},
						clear: function () {
							popupClosedDeferred.resolve();
							popupObject = null;
							unbindCloseFn();
							removePopup();
							popupScope.$destroy();
							popupInstance.isClosed = true;
						},
						okAction: function () {
							popupOKDeferred.resolve();
						}
					});

					if (settings.showLastSize) {
						basicsLookupdataLookupViewService.restoreSize(settings.uuid, context);
					}

					if (footerTemplate) {
						context.footer = angular.element(footerTemplate);
					}

					//add Action Buttons labels
					if(settings.showActionButtons) {
						context.okLabel = $translate.instant('platform.okBtn');
						context.cancelLabel = $translate.instant('platform.cancelBtn');
					}

					// add popup template to dom first, so it can access popup container element through template element in controller.
					popupObject = focusedElement.popup(content, context);
					// popup element alignment
					popupInstance.align = popupObject.align;
					popupInstance.element = popupObject.element;

					// initialize controller instance.
					if (settings.controller) {
						ctrlLocals.$scope = popupScope;
						ctrlLocals.$element = content;
						ctrlLocals.$popupInstance = popupInstance;
						ctrlLocals.$popupContext = context;
						angular.forEach(settings.resolve, function (value, key) {
							ctrlLocals[key] = tplAndVars[resolveIter++];
						});
						ctrlInstance = $controller(settings.controller, ctrlLocals);
					}

					// set controller instance alias to popup scope.
					if (settings.controllerAs) {
						popupScope[settings.controllerAs] = ctrlInstance;
					}

					// compile and link popup template
					$compile(popupObject.element)(popupScope);

					// resolve popupOpened promise.
					popupOpenedDeferred.resolve(popupObject);
				});

				return popupInstance;
			}

			/**
			 * @description get template.
			 */
			function getTemplatePromise(options) {
				return options.template ? $q.when(options.template) :
					$http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
						{cache: $templateCache}).then(function (result) {
						return result.data;
					});
			}

			/**
			 * @description get footer template.
			 */
			function getFooterTemplatePromise(options) {
				if (!options.footerTemplate && !options.footerTemplateUrl) {
					var deferred = $q.defer();
					deferred.resolve('');
					return deferred.promise;
				}
				else {
					return options.footerTemplate ? $q.when(options.footerTemplate) :
						$http.get(angular.isFunction(options.footerTemplateUrl) ? (options.footerTemplateUrl)() : options.footerTemplateUrl,
							{cache: $templateCache}).then(function (result) {
							return result.data;
						});
				}
			}

			/**
			 * @description get resolve data.
			 */
			function getResolvePromises(resolves) {
				var promisesArr = [];
				angular.forEach(resolves, function (value) {
					if (angular.isFunction(value) || angular.isArray(value)) {
						promisesArr.push($q.when($injector.invoke(value)));
					}
				});
				return promisesArr;
			}

			/**
			 * @description get toggle popup helper.
			 * @param options
			 * @returns {{toggle: basicsLookupdataPopupService.toggle, show: basicsLookupdataPopupService.show, hide: basicsLookupdataPopupService.hide}}
			 */
			function getToggleHelper() {
				var popup;

				return {
					toggle: function (options) {
						if (!popup || popup.isClosed) {
							popup = showPopup(options);
						}
						else {
							popup.close();
							popup = null;
						}
						return popup;
					},
					show: function (options) {
						if (!popup || popup.isClosed) {
							popup = showPopup(options);
						}
						return popup;
					},
					hide: function () {
						if (popup && !popup.isClosed) {
							popup.close();
							popup = null;
						}
						return popup;
					}
				};
			}

			/**
			 * close popup by optional level
			 * @param level
			 */
			function hidePopup(level) {
				if (level) {
					var tempArr = [];
					popups.forEach(function (item) {
						if (item.level < level) {
							tempArr.push(item);
						}
						else {
							item.close();
						}
					});
					popups = tempArr;
				}
				else {
					popups.forEach(function (item) {
						item.close();
					});
					popups = [];
				}
			}

			/**
			 * toggle level popup
			 * @param options
			 * @returns {*}
			 */
			function toggleLevelPopup(options) {
				if (_.isNil(options.level)) {
					options.level = 0;
				}

				var instance,
					sameLevelPopups = popups.filter(function (item) {
						return item.level === options.level;
					});

				if (sameLevelPopups.length) {
					hidePopup(options.level);
				}
				else {
					var parentPopups = popups.filter(function (item) {
						return item.level === options.level - 1;
					});

					if (parentPopups.length) {
						var parent = parentPopups[0];
						hidePopup(options.level);
						instance = parent.showChild(options);
					} else {
						instance = showPopup(options);
					}
				}

				return instance;
			}

			/**
			 * merge default options with custom options for grid popup.
			 * @param options
             * @returns {*}
             */
			function buildGridPopupOptions(options) {
				var defaults = {
					width: 300,
					height: 300,
					template: $templateCache.get('grid-popup-lookup.html'),
					footerTemplate: $templateCache.get('lookup-popup-footer.html'),
					controller: 'basicsLookupdataGridViewController',
					showLastSize: true,
					dataView: new basicsLookupdataLookupViewService.LookupDataView()
				};

				return _.mergeWith(defaults, options);
			}

			function buildListPopupOptions(options) {
				var defaults = {
					width: 200,
					height: 300,
					template: $templateCache.get('list-view.html'),
					footerTemplate: $templateCache.get('lookup-popup-footer.html'),
					controller: 'basicsLookupdataListViewController',
					showLastSize: true,
					dataView: new basicsLookupdataLookupViewService.LookupDataView()
				};

				return _.mergeWith(defaults, options);
			}
		}
	]);

})(angular);
