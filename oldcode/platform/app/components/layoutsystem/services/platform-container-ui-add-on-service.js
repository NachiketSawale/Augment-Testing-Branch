/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformContainerUiAddOnService
	 * @function
	 *
	 * @description Provides utilities for managing additional UI features that may be displayed in containers.
	 */
	angular.module('platform').factory('platformContainerUiAddOnService', platformContainerUiAddOnService);

	platformContainerUiAddOnService.$inject = ['$compile', '$timeout', 'platformObjectHelper', '_', '$'];

	function platformContainerUiAddOnService($compile, $timeout, platformObjectHelper, _, $) {
		const service = {};

		function ContainerUiAddOnManager(scope, elem, handleResize) {
			this._privateState = {
				handleResize: handleResize,
				containerScope: scope,
				addOnScope: null,
				getAddOnScope: function () {
					if (!this.addOnScope) {
						this.addOnScope = this.containerScope.$new(true);
					}
					return this.addOnScope;
				},
				elem: elem, // sub-container-view
				contentElement: elem.find('.subview-content'),
				addOns: {}
			};

			const that = this;
			let unregister = scope.$on('$destroy', function () {
				Object.keys(that._privateState.addOns).forEach(function (key) {
					if (!_.isUndefined(that._privateState.addOns[key]) && _.isFunction(that._privateState.addOns[key].finalize)) {
						that._privateState.addOns[key].finalize();
					}
				});

				unregister();
				unregister = null;
				that._privateState.containerScope = null;
				platformObjectHelper.cleanupScope(that.addOnScope, $timeout);
				that.addOnScope = null;
			});
		}

		/**
		 * @ngdoc method
		 * @name addManagerAccessor
		 * @function
		 * @methodOf platformContainerUiAddOnService
		 * @description Adds a parameterless method to a container scope that provides a UI add-on manager.
		 * @param {Scope} scope The scope of the target container controller.
		 * @param {Element} subViewContainerElem An HTML element to which the sub-container-view directive is
		 *                                       applied.
		 * @param {Function} handleResize A function that may be invoked to update the size of the client area of
		 *                                the container.
		 */
		service.addManagerAccessor = function (scope, subViewContainerElem, handleResize) {
			scope.getUiAddOns = function () {
				if (!scope.containerAddOnManager) {
					const instance = new ContainerUiAddOnManager(scope, subViewContainerElem, handleResize);
					scope.containerAddOnManager = function getUiAddOnManagerInstance() {
						return instance;
					};
				}
				return scope.containerAddOnManager();
			};
		};

		/**
		 * @ngdoc method
		 * @name getBusyOverlay
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves a small overlay that indicates the container is currently busy with an operation.
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getBusyOverlay = function () {
			const addOnScope = this._privateState.getAddOnScope();
			let info = this._privateState.addOns.busyOverlay;
			if (!info) {
				addOnScope.busyOverlayShow = false;
				addOnScope.busyOverlayInfo = null;
				this._privateState.addOns.busyOverlay = info = {
					elem: $compile('<div><div data-cloud-common-overlay data-loading="busyOverlayShow" data-info2="busyOverlayInfo"></div></div>')(addOnScope),
					controller: {
						setInfo: function (text) {
							addOnScope.$evalAsync(function () {
								addOnScope.busyOverlayInfo = text;
							});
						},
						setVisible: function (visible) {
							addOnScope.$evalAsync(function () {
								addOnScope.busyOverlayShow = !!visible;
							});
						},
						showInfo: function (text) {
							addOnScope.$evalAsync(function () {
								addOnScope.busyOverlayInfo = text;
								addOnScope.busyOverlayShow = true;
							});
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};
				this._privateState.elem.append(info.elem);
			}
			return info.controller;
		};

		/**
		 * @ngdoc method
		 * @name getWhiteboard
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves an overlay that completely covers the client area of the container and that can
		 *              display a message.
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getWhiteboard = function (options) {
			const addOnScope = this._privateState.getAddOnScope();
			let info = this._privateState.addOns.whiteboard;
			if (!info) {
				addOnScope.whiteboardShow = false;
				addOnScope.whiteboardInfo = null;
				addOnScope.whiteboardOptions = options || {};

				this._privateState.addOns.whiteboard = info = {
					elem: $compile('<div data-basics-common-white-board data-show="whiteboardShow" data-info="whiteboardInfo" data-options="whiteboardOptions"></div>')(addOnScope),
					controller: {
						setInfo: function (text) {
							addOnScope.$evalAsync(function () {
								addOnScope.whiteboardInfo = text;
							});
						},
						setVisible: function (visible) {
							addOnScope.$evalAsync(function () {
								addOnScope.whiteboardShow = !!visible;
							});
						},
						showInfo: function (text) {
							addOnScope.$evalAsync(function () {
								addOnScope.whiteboardInfo = text;
								addOnScope.whiteboardShow = true;
							});
						},
						showOptions: function (options, visible) {
							addOnScope.$evalAsync(function () {
								addOnScope.whiteboardOptions = options;
								addOnScope.whiteboardShow = visible;
							});
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};
				this._privateState.elem.append(info.elem);
			}
			return info.controller;
		};

		/**
		 * @ngdoc method
		 * @name getFloatingToolbar
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves an overlay that hovers over the client area and displays a toolbar
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getFloatingToolbar = function (options) {
			const addOnScope = this._privateState.getAddOnScope();
			let info = this._privateState.addOns.floatingToolbar;
			if (!info) {

				addOnScope.parentContainer = this._privateState.elem[0];
				addOnScope.options = options;
				this._privateState.addOns.floatingToolbar = info = {
					elem: $compile('<div data-basics-common-floating-toolbar data-container="parentContainer" data-options="options" data-items="items"></div>')(addOnScope),
					controller: {
						setItems: function (items) {
							addOnScope.$evalAsync(function () {
								addOnScope.items = items;
							});
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};
				this._privateState.elem.append(info.elem);
			}
			return info.controller;
		};

		/**
		 * @ngdoc method
		 * @name getAlarm
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves a small overlay that temporarily pops up to display a brief message.
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getAlarm = function () {
			const addOnScope = this._privateState.getAddOnScope();
			let info = this._privateState.addOns.alarm;
			if (!info) {
				addOnScope.alarmText = null;
				this._privateState.addOns.alarm = info = {
					elem: $compile('<div><div platform-alarm-overlay data-info="alarmText" data-config="alarmConfig"></div></div>')(addOnScope),
					controller: {
						show: function (text, config) {
							addOnScope.$evalAsync(function () {
								addOnScope.alarmText = text;
								addOnScope.alarmConfig = config;
							});
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};
				this._privateState.elem.append(info.elem);
			}
			return info.controller;
		};

		function handleResize(that, timeout) {
			$timeout(function () {
				that._privateState.handleResize();
				$(window).trigger('resize');
			}, _.isNumber(timeout) ? timeout : 0);
		}

		/**
		 * @ngdoc method
		 * @name disableToolbar
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @param {array} activeButtonsId Array of ids of buttons which should still stay active.
		 * @description disable all buttons in the toolbar
		 */
		ContainerUiAddOnManager.prototype.disableToolbar = function (activeButtonsId) {
			const containerScope = this._privateState.containerScope;

			if (containerScope.tools && containerScope.tools.items) {
				if (!containerScope.previousToolbarState) {
					let previousState = containerScope.tools.items.map(item => {
						return {id: item.id, disabled: item.disabled};
					});

					containerScope.previousToolbarState = previousState;

					containerScope.tools.items.forEach(function (item) {
						if (item.type !== 'divider' && item.type !== 'overflow-btn') {
							if (!activeButtonsId || (activeButtonsId && !activeButtonsId.includes(item.id))) {
								item.disabled = true;
							}
						}
					});
				}
				containerScope.tools.update();
			}
		};

		/**
		 * @ngdoc method
		 * @name enableToolbar
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description restore all buttons in the toolbar to their previous state prior to being disabled
		 */
		ContainerUiAddOnManager.prototype.enableToolbar = function () {
			const containerScope = this._privateState.containerScope;

			if (containerScope.previousToolbarState && containerScope.tools && containerScope.tools.items) {
				containerScope.tools.items.forEach(function (item) {
					if (item.type !== 'divider' && item.type !== 'overflow-btn') {
						let previous = containerScope.previousToolbarState.find(function (previousItem) {
							return previousItem.id === item.id;
						});
						item.disabled = previous ? previous.disabled : false;
					}
				});

				delete containerScope.previousToolbarState;
				containerScope.tools.update();
			}
		};

		/**
		 * @ngdoc method
		 * @name getFeedbackComponent
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves a Feedback component that can display information and provide detail progress
		 *              as an overlay
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getFeedbackComponent = function () {
			const that = this;
			const addOnScope = this._privateState.getAddOnScope();

			let info = this._privateState.addOns.feedback;
			if (!info) {
				this._privateState.addOns.feedback = info = {
					elem: $compile('<div cloud-common-overlay data-info-html="info" data-feedback-type="type" data-progress-time="progressTime" data-ico-class="icoClass" data-error="error" data-complete="complete" data-title="title" data-info2="loadingText" data-loading="isLoading"></div>')(addOnScope),
					controller: {
						show: function () {
							addOnScope.isLoading = true;
						},
						hide: function () {
							addOnScope.isLoading = false;
							addOnScope.type = null;
							addOnScope.title = null;
						},
						setOptions: function (options) {
							if (options.loadingText) {
								addOnScope.loadingText = options.loadingText;
							}
							if (options.info) {
								addOnScope.info = options.info;
							}
							if (options.title) {
								addOnScope.title = options.title;
							}
							if (options.type) {
								addOnScope.type = options.type;
							}
							if (options.icoClass) {
								addOnScope.icoClass = options.icoClass;
							}
							if(options.progressTime) {
								addOnScope.progressTime = options.progressTime;
							}
						},
						showError: function (errorMessage) {
							addOnScope.error = errorMessage;
						},
						complete: function (completeMessage) {
							addOnScope.complete = completeMessage;
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};
				this._privateState.elem.append(info.elem);
			}
			return info.controller;
		}

		/**
		 * @ngdoc method
		 * @name getStatusBar
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves a multi-panel bar that can display information and provide interaction facilities
		 *              at the lower edge of the container.
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getStatusBar = function () {
			const that = this;
			const addOnScope = this._privateState.getAddOnScope();

			addOnScope.initialFunc = function (rs) {
				if (!_.isUndefined(that._privateState)) {
					rs.detach();

					// actually not necessary anymore, because the handleResize is fired when settings for "show Statusbar" is loaded, but for price comparison probably still necessary.
					handleResize(that, 250);
				}
			};

			let info = this._privateState.addOns.statusBar;
			if (!info) {
				addOnScope.statusBarShow = false;

				this._privateState.addOns.statusBar = info = {
					elem: $compile('<div data-platform-resize-observer="initialFunc" data-ng-show="statusBarShow" data-platform-status-bar data-set-link="statusBarLink=link" class="statusbar-wrapper"></div>')(addOnScope),
					controller: {
						setVisible: function (visible) {
							addOnScope.$evalAsync(function () {
								addOnScope.statusBarShow = !!visible;
								handleResize(that);
							});
						},
						addFields: function (fields) {
							if (addOnScope.statusBarLink) {
								addOnScope.statusBarLink.addFields(fields);
							}
						},
						updateFields: function (changedFields) {
							if (addOnScope.statusBarLink) {
								addOnScope.statusBarLink.updateFields(changedFields);
							}
						},
						showFields: function (fields) {
							if (addOnScope.statusBarLink) {
								addOnScope.statusBarLink.setFields(fields);
								addOnScope.$evalAsync(function () {
									if (!addOnScope.statusBarShow) {
										addOnScope.statusBarShow = true;
									}
								});
							}
						},
						getLink: function () {
							return addOnScope.statusBarLink;
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};
				info.elem.insertAfter(this._privateState.elem);
			}
			return info.controller;
		};

		/**
		 * @ngdoc method
		 * @name getFullsizeButton
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves a button that can set the container in fullscreen mode.
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getFullsizeButton = function () {
			const that = this;
			const addOnScope = this._privateState.getAddOnScope();

			addOnScope.clickHandler = function () {
				if (!_.isUndefined(that._privateState)) {
					handleResize(that);
				}
			};

			// add this button only if splitter exists
			if (this._privateState.elem.closest('#splitter').length) {
				let info = this._privateState.addOns.fullsizeButton;
				if (!info) {
					this._privateState.addOns.fullsizeButton = info = {
						elem: $compile('<platform-fullsize-button data-fullsize-states="$parent.subviewCtrl.fullsizeStates" data-ng-hide="hide" data-on-before-resize="beforeResizeHandler" data-on-click="clickHandler"></platform-fullsize-button>')(addOnScope),
						// elem: $compile('<platform-fullsize-button data-on-click="clickHandler($event, info)"></platform-fullsize-button>')(addOnScope),
						controller: {
							setVisible: function (visible) {
								addOnScope.$evalAsync(function () {
									addOnScope.hide = _.isUndefined(visible) ? false : !visible;
								});
							}
						},
						finalize: function () {
							this.elem.remove();
						}
					};

					const subviewContainer = this._privateState.elem.closest('.subview-container');
					const subviewHeader = subviewContainer.find('.subview-header');

					subviewHeader.append(info.elem);
				}
				return info.controller;
			}

			return undefined;
		};

		/**
		 * @ngdoc method
		 * @name getToggleSwitch
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Calls a checkbox container, in the style of switch-toggle.
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getToggleSwitch = function (options) {
			const that = this;
			const addOnScope = this._privateState.getAddOnScope();
			addOnScope.changeHandler = function (scope, event) {
				options.fn.apply(this, [options, scope.ngModel, {scope: that._privateState, e: event}]);
			};

			let info = this._privateState.addOns.toogleSwitch;
			if (!info) {
				addOnScope.toggleModel = false;
				addOnScope.showSwitch = false;
				addOnScope.disabledSwitch = false;
				this._privateState.addOns.toogleSwitch = info = {
					elem: $compile('<div platform-toggle-switch data-show-switch="showSwitch" ng-model="toggleModel" data-on-change="changeHandler" data-setdisable="disabledSwitch"></div>')(addOnScope),
					controller: {
						setVisible: function (visible, modelName, disabled) {
							addOnScope.$evalAsync(function () {
								addOnScope.showSwitch = _.isUndefined(visible) ? false : visible;
								addOnScope.toggleModel = _.isUndefined(modelName) ? false : modelName;
								addOnScope.disabledSwitch = _.isUndefined(disabled) ? false : disabled;
							});
						},
						setDisabled: function (disabled) {
							addOnScope.$evalAsync(function () {
								addOnScope.disabledSwitch = _.isUndefined(disabled) ? false : disabled;
							});
						},
						setNgModel: function (modelName) {
							addOnScope.$evalAsync(function () {
								addOnScope.toggleModel = _.isUndefined(modelName) ? false : modelName;
							});
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};

				const subviewContainer = this._privateState.elem.closest('.subview-container');
				const subviewHeader = subviewContainer.find('.subview-header');

				info.elem.prependTo(subviewHeader);
			}
			return info.controller;
		};

		/**
		 * @ngdoc method
		 * @name getWhiteboard
		 * @function
		 * @methodOf ContainerUiAddOnManager
		 * @description Retrieves an overlay that completely covers the Container area
		 * @returns {Object} A "remote control" object for the add-on.
		 */
		ContainerUiAddOnManager.prototype.getContainerOverlay = function (options) {
			const addOnScope = this._privateState.getAddOnScope();
			let info = this._privateState.addOns.containerOverlay;
			if (!info) {
				addOnScope.containerOverlayShow = false;
				addOnScope.containerOverlayInfo = null;
				addOnScope.containerOverlayOptions = options || {};

				this._privateState.addOns.containerOverlay = info = {
					elem: $compile('<div data-platform-container-shortcut ng-show="containerOverlayShow" data-options="containerOverlayOptions"></div>')(addOnScope),
					controller: {
						containerOverlayShow: function (options, visible) {
							addOnScope.$evalAsync(function () {
								addOnScope.containerOverlayOptions = options;
								addOnScope.containerOverlayShow = visible;
							});
						}
					},
					finalize: function () {
						this.elem.remove();
					}
				};

				$('body').append(info.elem);
			}
			return info.controller;
		};

		return service;
	}
})(angular);
