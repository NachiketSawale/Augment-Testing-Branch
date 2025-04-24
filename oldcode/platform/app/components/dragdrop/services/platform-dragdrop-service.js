/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let notifyMouseMoved = null;
	let notifyDragEnded = null;
	let updatePreferredAction = null;

	let notifyTextUpdated = null;

	/**
	 * @ngdoc service
	 * @name platform.platformDragdropService
	 * @function
	 * @requires PlatformMessenger, $translate, _
	 *
	 * @description Globally manages drag-and-drop operations for the entire application.
	 */
	angular.module('platform').factory('platformDragdropService',
		platformDragdropService);

	platformDragdropService.$inject = ['PlatformMessenger', '$translate', '_'];

	function platformDragdropService(PlatformMessenger, $translate, _) {
		const service = {};

		service.dragAreas = {
			main: {id: 'area:main'},
			sidebar: {id: 'area:sidebar'},
			header: {id: 'area:header'}
		};

		service.actions = [];
		service.actions.move = {
			id: 'action:move',
			priority: 1,
			iconClass: 'ico-drag-move'
		};
		service.actions.copy = {
			id: 'action:copy',
			priority: 2,
			iconClass: 'ico-drag-copy'
		};
		service.actions.link = {
			id: 'action:link',
			priority: 3,
			iconClass: 'ico-drag-link'
		};
		service.actions.push.apply(service.actions, _.map(Object.keys(service.actions), function (key) {
			return service.actions[key];
		}));

		/**
		 * @ngdoc function
		 * @name DragdropTarget
		 * @function
		 * @methodOf DragdropTarget
		 * @description Initializes a new instance of the `DragdropTarget` class that represents an element in the
		 *              user interface that can serve as a drag source and/or target.
		 * @param {Object} area An area identifier from @see service.dragAreas.
		 * @param {String} id A string uniquely identifying the user interface element.
		 */
		function DragdropTarget(area, id) {
			this.area = area;
			this.id = id;
			this._onDragStarted = new PlatformMessenger();
		}

		service.DragdropTarget = DragdropTarget;

		/**
		 * @ngdoc function
		 * @name canDrop
		 * @function
		 * @methodOf DragdropTarget
		 * @description Evalutes whether the currently dragged data can be dropped at the current location. The
		 *              default implementation will always return `false`.
		 * @param {Object} info An object that contains some information about the current state of the
		 *                      drag-and-drop operation.
		 * @returns {Boolean} A value that indicates whether the target is ready to accept the dragged data.
		 */
		// eslint-disable-next-line no-unused-vars
		DragdropTarget.prototype.canDrop = function (info) {
			return false;
		};

		/**
		 * @ngdoc function
		 * @name drop
		 * @function
		 * @methodOf DragdropTarget
		 * @description Drops the currently dragged data.
		 * @param {Object} info An object that contains some information about the current state of the
		 *                      drag-and-drop operation.
		 */
		// eslint-disable-next-line no-unused-vars
		DragdropTarget.prototype.drop = function (info) {
		};

		/**
		 * @ngdoc function
		 * @name getAllowedActions
		 * @function
		 * @methodOf DragdropTarget
		 * @description Returns the set of allowed actions. The default implementation always returns an array that
		 *              contains all actions.
		 * @param {Object} info An object that contains some information about the current state of the
		 *                      drag-and-drop operation.
		 * @returns {Array<Object>} The array of allowed actions.
		 */
		// eslint-disable-next-line no-unused-vars
		DragdropTarget.prototype.getAllowedActions = function (info) {
			return service.actions;
		};

		/**
		 * @ngdoc function
		 * @name registerDragStarted
		 * @function
		 * @methodOf DragdropTarget
		 * @description Registers an event handler that gets invoked when a drag-and-drop operation is started on
		 *              the dragdrop target.
		 * @param {Function} handler The event handler.
		 */
		DragdropTarget.prototype.registerDragStarted = function (handler) {
			this._onDragStarted.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterDragStarted
		 * @function
		 * @methodOf DragdropTarget
		 * @description Unregisters an event handler that got invoked when a drag-and-drop operation was started on
		 *              the dragdrop target.
		 * @param {Function} handler The event handler.
		 */
		DragdropTarget.prototype.unregisterDragStarted = function (handler) {
			this._onDragStarted.unregister(handler);
		};

		const state = {
			currentTarget: null,
			currentDragInfo: null,
			canDrop: false,
			currentText: null,
			preferredActions: {
				copy: false
			}
		};

		/**
		 * @ngdoc function
		 * @name isOnTarget
		 * @function
		 * @methodOf platformDragdropService
		 * @description Evaluates whether the cursor is currently hovering over a drag-drop-target.
		 * @returns {Boolean} A value that indicates whether the cursor is hovering over a drag-drop-target.
		 */
		service.isOnTarget = function () {
			return !!state.currentTarget;
		};

		/**
		 * @ngdoc function
		 * @name startDrag
		 * @function
		 * @methodOf platformDragdropService
		 * @description Initiates a drag-drop-operation from the drag-drop-target the cursor is currently pointing
		 *              at.
		 * @param {Object} draggedData A custom object that represents the dragged data.
		 * @param {Array<Object>} allowedActions An array of actions allowed by the drag source. If no value is
		 *                                       specified for this argument, all actions will be permissible.
		 * @param {Object} textInfo An object that specifies how to textually represent the dragged data in the
		 *                          cursor adornment.
		 */
		service.startDrag = function (draggedData, allowedActions, textInfo) {
			if (!state.currentTarget) {
				throw new Error('The mouse cursor does not appear to be hovering over any allowable source location.');
			}

			state.currentDragInfo = {
				sourceArea: state.currentTarget.area,
				sourceId: state.currentTarget.id,
				draggedData: draggedData,
				allowedActions: allowedActions || service.actions
			};

			updateDragState();

			service.setDraggedText(textInfo);

			state.currentTarget._onDragStarted.fire({
				draggedData: draggedData
			});
		};

		/**
		 * @ngdoc function
		 * @name mouseEnter
		 * @function
		 * @methodOf platformDragdropService
		 * @description Notifies the service that the cursor has entered a drop target.
		 * @param {DragdropTarget} ddTarget The target object of the element.
		 * @param {Object} mouseEvent The underlying mouse enter event.
		 */
		service.mouseEnter = function (ddTarget, mouseEvent) {
			state.currentTarget = ddTarget;
			updateCanDrop(mouseEvent);
		};

		/**
		 * @ngdoc function
		 * @name mouseLeave
		 * @function
		 * @methodOf platformDragdropService
		 * @description Notifies the service that the cursor has left a drop target.
		 * @param {Object} mouseEvent The underlying mouse leave event.
		 */
		service.mouseLeave = function (mouseEvent) {
			state.currentTarget = null;
			updateCanDrop(mouseEvent);
		};

		notifyMouseMoved = function (mouseEvent) {
			if (state.currentDragInfo && state.currentTarget) {
				updateCanDrop(mouseEvent);
			}
		};

		notifyDragEnded = function (mouseEvent) {
			if (state.currentDragInfo) {
				const canDropObject = retrieveCanDrop(mouseEvent);
				// for new possibility returning an object from canDrop
				const canDrop = canDropObject.canDrop !== undefined ? canDropObject.canDrop : canDropObject;
				if (canDrop) {
					state.currentTarget.drop({
						draggedData: state.currentDragInfo.draggedData,
						event: mouseEvent,
						action: retrieveAction(),
						sourceArea: state.currentDragInfo.sourceArea,
						sourceId: state.currentDragInfo.sourceId
					});
				}
				state.currentDragInfo = null;
				updateDragState();
			}
		};

		updatePreferredAction = function (info) {
			const oldPreferredActions = _.clone(state.preferredActions);
			_.assign(state.preferredActions, info);
			if (!_.isEqual(oldPreferredActions, state.preferredActions)) {
				updateDragState();
			}
		};

		/**
		 * @ngdoc function
		 * @name updateCanDrop
		 * @function
		 * @methodOf platformDragdropService
		 * @description Updates whether the currently dragged data can be dropped at the current location by
		 *              requesting the value from the current drop target, if the cursor is in an appropriate
		 *              position, and fires a drag state change event.
		 * @param {Object} mouseEvent The underlying mouse event.
		 */
		function updateCanDrop(mouseEvent) {
			if (state.currentDragInfo) {
				const newCanDrop = retrieveCanDrop(mouseEvent);
				let needsUpdate = false;
				// new functionality, canDrop returns back a config object with multiple return parameters
				if (newCanDrop.canDrop !== undefined) {
					if (newCanDrop.canDrop !== state.canDrop) {
						state.canDrop = !!newCanDrop.canDrop;
						needsUpdate = true;
					}
					if (newCanDrop.currentAction !== state.currentAction) {
						state.currentAction = newCanDrop.currentAction;
						needsUpdate = true;
					}
				}
				// for compatibilty with old canDrop functions from drag and drop services, that only returning a boolean
				else {
					if (newCanDrop !== state.canDrop || state.currentAction !== undefined) {
						state.canDrop = !!newCanDrop;
						state.currentAction = undefined;
						needsUpdate = true;
					}
				}
				// Updating if necessary
				if (needsUpdate) {
					updateDragState();
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name retrieveCanDrop
		 * @function
		 * @methodOf platformDragdropService
		 * @description Retrieves a value that indicates whether the current drop target accepts the currently
		 *              dragged data.
		 * @param {Object} mouseEvent The underlying mouse event.
		 * @returns {Boolean} A valuet hat indicates whether the currently dragged data can be dropped at the
		 *                    current location of the cursor.
		 */
		function retrieveCanDrop(mouseEvent) {
			if (state.currentTarget) {
				return state.currentTarget.canDrop({
					draggedData: state.currentDragInfo.draggedData,
					event: mouseEvent,
					sourceArea: state.currentDragInfo.sourceArea,
					sourceId: state.currentDragInfo.sourceId,
					currentAction: retrieveAction()
				});
			} else {
				return false;
			}
		}

		const onDragStateChanged = new PlatformMessenger();

		/**
		 * @ngdoc function
		 * @name registerDragStateChanged
		 * @function
		 * @methodOf platformDragdropService
		 * @description Registers an event handler for an event that is fired when the drag state has changed.
		 * @param {Function} handler The event handler.
		 */
		service.registerDragStateChanged = function (handler) {
			onDragStateChanged.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterDragStateChanged
		 * @function
		 * @methodOf platformDragdropService
		 * @description Unregisters an event handler for an event that is fired when the drag state has changed.
		 * @param {Function} handler The event handler.
		 */
		service.unregisterDragStateChanged = function (handler) {
			onDragStateChanged.unregister(handler);
		};

		/**
		 * @ngdoc function
		 * @name retrieveAction
		 * @function
		 * @methodOf platformDragdropService
		 * @description Retrieves the currently chosen drag action.
		 * @param {Object} info The currently chosen drag action, or `null` if no drag action applies.
		 */
		// eslint-disable-next-line no-unused-vars
		function retrieveAction(info) {
			if (state.currentAction) {
				return state.currentAction;
			}
			if (state.currentDragInfo && state.currentTarget) {
				const allowedActions = _.intersection(state.currentDragInfo.allowedActions, state.currentTarget.getAllowedActions({
					draggedData: state.currentDragInfo.draggedData
				})).sort(function (action1, action2) {
					return action1.priority - action2.priority;
				});
				if (allowedActions.length > 0) {
					if (state.preferredActions.copy && _.includes(allowedActions, service.actions.copy)) {
						return service.actions.copy;
					}
					return allowedActions[0];
				}
			}
			return null;
		}

		/**
		 * @ngdoc function
		 * @name updateDragState
		 * @function
		 * @methodOf platformDragdropService
		 * @description Fires the drag state changed event and passes an object that contains some information about
		 *              the event.
		 */
		function updateDragState() {
			const action = retrieveAction();
			onDragStateChanged.fire({
				isDragging: !!state.currentDragInfo,
				canDrop: state.canDrop && !!action,
				action: action,
				draggedData: state.currentDragInfo ? state.currentDragInfo.draggedData : null,
				sourceArea: state.currentDragInfo ? state.currentDragInfo.sourceArea : null,
				sourceId: state.currentDragInfo ? state.currentDragInfo.sourceId : null
			});
		}

		/**
		 * @ngdoc function
		 * @name setDraggedText
		 * @function
		 * @methodOf platformDragdropService
		 * @description Updates the text displayed along with the cursor while a drag-and-drop operation is in
		 *              progress.
		 * @param {Object} textInfo An object that specifies some information about the displayed text.
		 */
		service.setDraggedText = function (textInfo) {
			let text = null;
			let count = null;

			if (angular.isString(textInfo)) {
				text = textInfo;
			} else if (angular.isNumber(textInfo)) {
				count = textInfo;
			} else if (angular.isObject(textInfo)) {
				text = textInfo.text;
				count = textInfo.number;
			}

			let result;
			if (text) {
				if (angular.isNumber(count)) {
					result = $translate.instant(text, {
						count: count
					});
				} else {
					result = $translate.instant(text);
				}
			} else {
				if (angular.isNumber(count)) {
					result = $translate.instant('platform.dragdrop.items', {
						count: count
					});
				} else {
					result = $translate.instant('platform.dragdrop.anyData');
				}
			}
			notifyTextUpdated(result);
		};

		return service;
	}

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformDragdropManager
	 * @element div
	 * @restrict A
	 * @description This directive is only used once in the application for internal purposes: It manages the drag
	 *              indicator that is linked directly to the body element of the document. Like this, this directive
	 *              serves as a liaison between the dragdrop-service and the DOM.
	 */
	angular.module('platform').directive('platformDragdropManager',
		platformDragdropManager);

	platformDragdropManager.$inject = ['$timeout', 'platformDragdropService',
		'keyCodes', '$'];

	function platformDragdropManager($timeout, platformDragdropService, keyCodes, $) {
		return {
			restrict: 'A',
			scope: false,
			link: function ($scope, elem) {
				let dragIndicator;

				$timeout(function () {
					const activeModifiers = {
						copy: false
					};

					const bodyEl = elem.parents('body');
					bodyEl.on({
						mousemove: function (e) {
							if (dragIndicator) {
								dragIndicator.css({
									top: e.pageY + 5,
									left: e.pageX + 5
								});
							}
							notifyMouseMoved(e);
						},
						mouseup: function (e) {
							if (dragIndicator) {
								notifyDragEnded(e);
							}
						},
						keydown: function (e) {
							switch (e.which) {
								case keyCodes.CTRL:
									if (!activeModifiers.copy) {
										activeModifiers.copy = true;
										updatePreferredAction({
											copy: true
										});
									}
									break;
							}
						},
						keyup: function (e) {
							switch (e.which) {
								case keyCodes.CTRL:
									activeModifiers.copy = false;
									updatePreferredAction({
										copy: false
									});
									break;
							}
						}
					});
				});

				function setDragIndicatorVisibility(visibility) {
					if (visibility !== !!dragIndicator) { // jshint ignore:line
						const bodyEl = elem.parents('body');
						if (visibility) {
							dragIndicator = $('<div id="dragIndicator"><div id="operation"></div><div id="separator"></div><div id="contentArea"><div><div id="content"></div></div></div></div>');
							bodyEl.append(dragIndicator).addClass('dragging');
						} else {
							dragIndicator.remove();
							bodyEl.removeClass('dragging');
							dragIndicator = null;
						}
					}
				}

				notifyTextUpdated = function (text) {
					if (dragIndicator) {
						dragIndicator.find('#content').text(text);
					}
				};

				function dragStateChanged(info) {
					setDragIndicatorVisibility(info.isDragging);
					if (dragIndicator) {
						if (info.canDrop) {
							dragIndicator.addClass('valid');
						} else {
							dragIndicator.removeClass('valid');
						}
						dragIndicator.children('#operation').attr('class', 'control-icons ' + (info.canDrop ? info.action.iconClass : 'ico-drag-not-allowed'));
					}
				}

				platformDragdropService.registerDragStateChanged(dragStateChanged);

				$scope.$on('$destroy', function () {
					platformDragdropService.unregisterDragStateChanged(dragStateChanged);
				});
			}
		};
	}
})(angular);
