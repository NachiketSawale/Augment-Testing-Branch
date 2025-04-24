/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerInputHelpService
	 * @function
	 *
	 * @description Dynamically assembles brief instructions on different forms of input.
	 */
	angular.module('model.viewer').factory('modelViewerInputHelpService', ['_', '$translate', 'keyCodes',
		function (_, $translate, keyCodes) {
			var service = {};

			service.mouseButtons = {
				LEFT: 1,
				MIDDLE: 2,
				RIGHT: 3
			};

			service.dragDirection = {
				HORIZONTAL: 1,
				VERTICAL: 2
			};

			/**
			 * @ngdoc method
			 * @name localizeMouseButton
			 * @method
			 * @methodOf modelViewerInputHelpService
			 * @description Provides a localized description of a given mouse button, optionally related to a drag-drop
			 *              operation.
			 * @param {any} button The mouse button. This must be one of the values from the {@see mouseButtons}
			 *                     enumeration.
			 * @param {any} dragDirection Optionally, a drag direction. If specified, this must be one of the values
			 *                            from the {@see dragDirection} enumeration.
			 * @returns {String} The localized description.
			 * @throws {Error} `button` or `dragDirection` are unsupported.
			 */
			function localizeMouseButton(button, dragDirection) {
				var suffix;
				if (dragDirection) {
					switch (dragDirection) {
						case service.dragDirection.HORIZONTAL:
							suffix = 'DragH';
							break;
						case service.dragDirection.VERTICAL:
							suffix = 'DragV';
							break;
						default:
							throw new Error('Unsupported drag direction: ' + dragDirection);
					}
				} else {
					suffix = 'Click';
				}

				switch (button) {
					case service.mouseButtons.LEFT:
						return $translate.instant('model.viewer.inputHelp.mouseButtonLeft' + suffix);
					case service.mouseButtons.MIDDLE:
						return $translate.instant('model.viewer.inputHelp.mouseButtonMiddle' + suffix);
					case service.mouseButtons.RIGHT:
						return $translate.instant('model.viewer.inputHelp.mouseButtonRight' + suffix);
					default:
						throw new Error('Unsupported mouse button: ' + button);
				}
			}

			/**
			 * @ngdoc method
			 * @name localizeKey
			 * @method
			 * @methodOf modelViewerInputHelpService
			 * @description Provides a localized description of a given keyboard key.
			 * @param {any} keyCode The key. This must be one of the values from the {@see keyCodes} enumeration.
			 * @returns {String} The localized description.
			 * @throws {Error} `keyCode` is unsupported.
			 */
			function localizeKey(keyCode) { // jshint ignore:line
				switch (keyCode) {
					case keyCodes.SHIFT:
						return $translate.instant('model.viewer.inputHelp.shiftKey');
					case keyCodes.CTRL:
						return $translate.instant('model.viewer.inputHelp.ctrlKey');
					case keyCodes.ALT:
						return $translate.instant('model.viewer.inputHelp.altKey');
					case keyCodes.SPACE:
						return $translate.instant('model.viewer.inputHelp.spaceKey');
					case keyCodes.PAGE_UP:
						return $translate.instant('model.viewer.inputHelp.pageUpKey');
					case keyCodes.PAGE_DOWN:
						return $translate.instant('model.viewer.inputHelp.pageDownKey');
					case keyCodes.LEFT:
						return $translate.instant('model.viewer.inputHelp.arrowLeftKey');
					case keyCodes.UP:
						return $translate.instant('model.viewer.inputHelp.arrowUpKey');
					case keyCodes.RIGHT:
						return $translate.instant('model.viewer.inputHelp.arrowRightKey');
					case keyCodes.DOWN:
						return $translate.instant('model.viewer.inputHelp.arrowDownKey');
					case keyCodes.KEY_0:
						return '0';
					case keyCodes.KEY_1:
						return '1';
					case keyCodes.KEY_2:
						return '2';
					case keyCodes.KEY_3:
						return '3';
					case keyCodes.KEY_4:
						return '4';
					case keyCodes.KEY_5:
						return '5';
					case keyCodes.KEY_6:
						return '6';
					case keyCodes.KEY_7:
						return '7';
					case keyCodes.KEY_8:
						return '8';
					case keyCodes.KEY_9:
						return '9';
					case keyCodes.KEY_A:
						return 'A';
					case keyCodes.KEY_B:
						return 'B';
					case keyCodes.KEY_C:
						return 'C';
					case keyCodes.KEY_D:
						return 'D';
					case keyCodes.KEY_E:
						return 'E';
					case keyCodes.KEY_F:
						return 'F';
					case keyCodes.KEY_G:
						return 'G';
					case keyCodes.KEY_H:
						return 'H';
					case keyCodes.KEY_I:
						return 'I';
					case keyCodes.KEY_J:
						return 'J';
					case keyCodes.KEY_K:
						return 'K';
					case keyCodes.KEY_L:
						return 'L';
					case keyCodes.KEY_M:
						return 'M';
					case keyCodes.KEY_N:
						return 'N';
					case keyCodes.KEY_O:
						return 'O';
					case keyCodes.KEY_P:
						return 'P';
					case keyCodes.KEY_Q:
						return 'Q';
					case keyCodes.KEY_R:
						return 'R';
					case keyCodes.KEY_S:
						return 'S';
					case keyCodes.KEY_T:
						return 'T';
					case keyCodes.KEY_U:
						return 'U';
					case keyCodes.KEY_V:
						return 'V';
					case keyCodes.KEY_W:
						return 'W';
					case keyCodes.KEY_X:
						return 'X';
					case keyCodes.KEY_Y:
						return 'Y';
					case keyCodes.KEY_Z:
						return 'Z';
					default:
						throw new Error('Unsupported key: ' + keyCode);
				}
			}

			/**
			 * @ngdoc method
			 * @name ActionBase
			 * @method
			 * @methodOf ActionBase
			 * @description Instantiates a new action. This is the base class for actions. An action enables a feature
			 *              that is documented by an {@see InputFeature} instance.
			 */
			function ActionBase() {
			}

			/**
			 * @ngdoc method
			 * @name equals
			 * @method
			 * @methodOf ActionBase
			 * @description Checks whether the current action equals another action object.
			 * @param {ActionBase} other The other object.
			 * @returns {Boolean} A value that indicates whether `other` is equal to the current instance.
			 */
			ActionBase.prototype.equals = function (other) {
				if (!other) {
					return false;
				}

				var keys = Object.keys(this);
				for (var idx = 0; idx < keys.length; idx++) {
					if (this[keys[idx]] !== other[keys[idx]]) {
						return false;
					}
				}
				return true;
			};

			/**
			 * @ngdoc method
			 * @name KeyAction
			 * @method
			 * @methodOf KeyAction
			 * @description Initializes a new keyboard action. A keyboard action represents a key press that invokes
			 *              a certain feature.
			 * @param {any} keyCode The key code. This must be one of the values from the {@see keyCodes} enumeration.
			 */
			service.KeyAction = function (keyCode) {
				this.type = 'key';
				this.key = keyCode;
			};
			service.KeyAction.prototype = Object.create(ActionBase.prototype);
			service.KeyAction.prototype.constructor = service.KeyAction;

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf KeyAction
			 * @description Generates a localized representation of the action.
			 * @returns {String} The localized representation.
			 */
			service.KeyAction.prototype.toLocalizedString = function () {
				return localizeKey(this.key);
			};

			/**
			 * @ngdoc method
			 * @name ModifierKeyAction
			 * @method
			 * @methodOf ModifierKeyAction
			 * @description Initializes a new modifier key action. A modifier key action represents a modifier key that
			 *              can be pressed to enable a certain feature whose effect is useful to other features.
			 * @param {any} keyCode The key code. This must be one of the values from the {@see keyCodes} enumeration.
			 */
			service.ModifierKeyAction = function (keyCode) {
				this.type = 'modifierkey';
				this.key = keyCode;
			};
			service.ModifierKeyAction.prototype = Object.create(ActionBase.prototype);
			service.ModifierKeyAction.prototype.constructor = service.ModifierKeyAction;

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf ModifierKeyAction
			 * @description Generates a localized representation of the action.
			 * @returns {String} The localized representation.
			 */
			service.ModifierKeyAction.prototype.toLocalizedString = function () {
				return $translate.instant('model.viewer.inputHelp.modifierActionPattern', {
					modifier: localizeKey(this.key)
				});
			};

			/**
			 * @ngdoc method
			 * @name MouseButtonClickAction
			 * @method
			 * @methodOf MouseButtonClickAction
			 * @description Initializes a mouse button click action. A mouse button click action represents a single
			 *              click of a mouse button that invokes a feature.
			 * @param {any} button The button. This must be one of the values from the {@see mouseButtons} enumeration.
			 */
			service.MouseButtonClickAction = function (button) {
				this.type = 'mousebuttonclick';
				this.button = button;
			};
			service.MouseButtonClickAction.prototype = Object.create(ActionBase.prototype);
			service.MouseButtonClickAction.prototype.constructor = service.MouseButtonClickAction;

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf MouseButtonClickAction
			 * @description Generates a localized representation of the action.
			 * @returns {String} The localized representation.
			 */
			service.MouseButtonClickAction.prototype.toLocalizedString = function () {
				return localizeMouseButton(this.button, null);
			};

			/**
			 * @ngdoc method
			 * @name MouseButtonDragAction
			 * @method
			 * @methodOf MouseButtonDragAction
			 * @description Initializes a mouse button drag action. A mouse button drag action represents a drag-drop
			 *              operation with a mouse button that invokes a feature.
			 * @param {any} button The button. This must be one of the values from the {@see mouseButtons} enumeration.
			 * @param {any} dragDirection The drag direction. This must be one of the values from the
			 *                            {@see dragDirections} enumeration.
			 */
			service.MouseButtonDragAction = function (button, dragDirection) {
				this.type = 'mousebuttondrag';
				this.button = button;
				this.direction = dragDirection;
			};
			service.MouseButtonDragAction.prototype = Object.create(ActionBase.prototype);
			service.MouseButtonDragAction.prototype.constructor = service.MouseButtonDragAction;

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf MouseButtonDragAction
			 * @description Generates a localized representation of the action.
			 * @returns {String} The localized representation.
			 */
			service.MouseButtonDragAction.prototype.toLocalizedString = function () {
				return localizeMouseButton(this.button, this.direction);
			};

			/**
			 * @ngdoc method
			 * @name MouseWheelAction
			 * @method
			 * @methodOf MouseWheelAction
			 * @description Initializes a new mouse wheel action. A mouse wheel action represents a movement of the
			 *              mousewheel that can invoke a feature.
			 */
			service.MouseWheelAction = function () {
				this.type = 'mousewheel';
			};
			service.MouseWheelAction.prototype = Object.create(ActionBase.prototype);
			service.MouseWheelAction.prototype.constructor = service.MouseWheelAction;

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf MouseWheelAction
			 * @description Generates a localized representation of the action.
			 * @returns {String} The localized representation.
			 */
			service.MouseWheelAction.prototype.toLocalizedString = function () {
				return $translate.instant('model.viewer.inputHelp.mouseWheel');
			};

			/**
			 * @ngdoc method
			 * @name InputComboSet
			 * @method
			 * @methodOf InputComboSet
			 * @description Initializes a new input combo set. An input combo set stores one or more actions along with
			 *              an optional set of modifiers that can be used to invoke (different facets of) a feature.
			 * @param {Array<ActionBase>} alternativeActions The set of alternative actions.
			 * @param {Array<any>} modifiers Optionally, a set of modifier keys. These must be values from the
			 *                               {@see keyCodes} enumeration.
			 */
			function InputComboSet(alternativeActions, modifiers) {
				this.alternativeActions = alternativeActions;
				this.modifiers = modifiers || [];
			}

			service.InputComboSet = InputComboSet;

			/**
			 * @ngdoc method
			 * @name overlapsWith
			 * @method
			 * @methodOf InputComboSet
			 * @description Checks whether the current input combo set has any overlaps with another one. Normally,
			 *              only features accessible by means of the input combo set with the highest priority are
			 *              displayed if several overlapping input combo sets are eligible.
			 * @param {InputComboSet} inputComboSet The other input combo set.
			 * @returns {Boolean} A value that indicates whether there are any overlaps.
			 */
			InputComboSet.prototype.overlapsWith = function (inputComboSet) {
				if (_.xor(inputComboSet.modifiers, this.modifiers).length === 0) {
					var result = false;
					this.alternativeActions.forEach(function (inputAction) {
						inputComboSet.alternativeActions.forEach(function (otherInputAction) {
							if (inputAction.equals(otherInputAction)) {
								result = true;
							}
						});
					});
					return result;
				}
				return false;
			};

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf InputComboSet
			 * @description Generates a localized representation of the input combo set.
			 * @returns {String} The localized representation.
			 */
			InputComboSet.prototype.toLocalizedString = function () {
				var remainingActions = this.alternativeActions.slice();
				var condensedActions = [];

				commonActionGroups.forEach(function (cag) {
					if (cag.tryApply(remainingActions)) {
						condensedActions.push(cag);
					}
				});

				condensedActions = condensedActions.concat(remainingActions);
				var result = '';
				condensedActions.forEach(function (action) {
					var actionText = action.toLocalizedString();
					if (result === '') {
						result = actionText;
					} else {
						result = $translate.instant('model.viewer.inputHelp.alternativePattern', {
							list: result,
							alternative: actionText
						});
					}
				});

				this.modifiers.forEach(function (modifierKey) {
					result = $translate.instant('model.viewer.inputHelp.modifierPattern', {
						modifier: localizeKey(modifierKey),
						commandInput: result
					});
				});

				return result;
			};

			/**
			 * @ngdoc method
			 * @name CommonActionGroup
			 * @method
			 * @methodOf CommonActionGroup
			 * @description Initializes a new common action group. A common action group combines actions that often
			 *              occur together (as means of accessing the same feature), in order to display only a group
			 *              title that encompasses the actions instead of listing the actions individually.
			 * @param {Array<ActionBase>} actions The actions.
			 * @param {String} nameKey The translation key for the group title.
			 */
			function CommonActionGroup(actions, nameKey) {
				this.type = 'commonactiongroup';
				this.actions = actions.slice();
				this.nameKey = nameKey;
			}

			/**
			 * @ngdoc method
			 * @name tryApply
			 * @method
			 * @methodOf CommonActionGroup
			 * @description Attempts to apply the common action group to a set of actions.
			 * @param {Array<ActionBase>} availableActions The actions. If the group can be applied to this list (that
			 *                                             is, if all actions constituting the group are found in this
			 *                                             array), the respective actions will be removed from this
			 *                                             array instance.
			 * @returns {Boolean} A value that indicates whether the group could be applied.
			 */
			CommonActionGroup.prototype.tryApply = function (availableActions) {
				var foundIndices = [];
				for (var i = 0; i < this.actions.length; i++) {
					for (var j = 0; j < availableActions.length; j++) {
						if (this.actions[i].equals(availableActions[j])) {
							foundIndices.push(j);
							break;
						}
					}
				}
				if (foundIndices.length === this.actions.length) {
					foundIndices.sort();
					_.forEachRight(foundIndices, function (idx) {
						availableActions.splice(idx, 1);
					});
					return true;
				} else {
					return false;
				}
			};

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf CommonActionGroup
			 * @description Generates a localized representation of the common action group.
			 * @returns {String} The localized representation.
			 */
			CommonActionGroup.prototype.toLocalizedString = function () {
				return $translate.instant(this.nameKey);
			};

			var commonActionGroups = [
				new CommonActionGroup([
					new service.KeyAction(keyCodes.UP),
					new service.KeyAction(keyCodes.DOWN),
					new service.KeyAction(keyCodes.LEFT),
					new service.KeyAction(keyCodes.RIGHT)
				], 'model.viewer.inputHelp.arrowKeys'),
				new CommonActionGroup([
					new service.KeyAction(keyCodes.UP),
					new service.KeyAction(keyCodes.DOWN)
				], 'model.viewer.inputHelp.arrowKeysUpDown'),
				new CommonActionGroup([
					new service.KeyAction(keyCodes.LEFT),
					new service.KeyAction(keyCodes.RIGHT)
				], 'model.viewer.inputHelp.arrowKeysLeftRight'),
				new CommonActionGroup([
					new service.KeyAction(keyCodes.PAGE_UP),
					new service.KeyAction(keyCodes.PAGE_DOWN)
				], 'model.viewer.inputHelp.pageUpDown'),
				new CommonActionGroup([
					new service.MouseButtonDragAction(service.mouseButtons.LEFT, service.dragDirection.HORIZONTAL),
					new service.MouseButtonDragAction(service.mouseButtons.LEFT, service.dragDirection.VERTICAL)
				], 'model.viewer.inputHelp.mouseButtonLeftDrag'),
				new CommonActionGroup([
					new service.MouseButtonDragAction(service.mouseButtons.MIDDLE, service.dragDirection.HORIZONTAL),
					new service.MouseButtonDragAction(service.mouseButtons.MIDDLE, service.dragDirection.VERTICAL)
				], 'model.viewer.inputHelp.mouseButtonMiddleDrag'),
				new CommonActionGroup([
					new service.MouseButtonDragAction(service.mouseButtons.RIGHT, service.dragDirection.HORIZONTAL),
					new service.MouseButtonDragAction(service.mouseButtons.RIGHT, service.dragDirection.VERTICAL)
				], 'model.viewer.inputHelp.mouseButtonRightDrag')
			];

			/**
			 * @ngdoc method
			 * @name InputFeature
			 * @method
			 * @methodOf InputFeature
			 * @description Initializes a new input feature. An input feature represents functionality that can be
			 *              documented in one translatable text. One feature may encompass several separate functions
			 *              or options that can be accessible by means of different keys, buttons, or other input
			 *              elements. The feature merely expresses that these functions belong together and are similar
			 *              enough so as to not be documented separately.
			 * @param {Number} priority A priority for the feature. This is relevant in case input combos overlap.
			 * @param {String} descriptionKey The translation key for the feature documentation text.
			 * @param {Array<InputComboSet>} inputCombos An array of possible ways for the user to activate the feature.
			 */
			function InputFeature(priority, descriptionKey, inputCombos) {
				this.priority = priority;
				this.descriptionKey = descriptionKey;
				this.inputCombos = inputCombos;
			}

			service.InputFeature = InputFeature;

			/**
			 * @ngdoc method
			 * @name isShadowed
			 * @method
			 * @methodOf InputFeature
			 * @description Checks whether the feature is shadowed by any other in a list of features.
			 * @param {Array<InputFeature>} confirmedFeatures The list of features that might shadow the current
			 *                                                feature.
			 * @returns {Boolean} A value that indicates whether the current feature is shadowed by any of the other
			 *                    features.
			 */
			InputFeature.prototype.isShadowed = function (confirmedFeatures) {
				var that = this;
				return _.some(confirmedFeatures, function (otherFeature) {
					return _.some(that.inputCombos, function (ownInputCombo) {
						return _.some(otherFeature.inputCombos, function (otherInputCombo) {
							return ownInputCombo.overlapsWith(otherInputCombo);
						});
					});
				});
			};

			/**
			 * @ngdoc method
			 * @name toLocalizedString
			 * @method
			 * @methodOf InputFeature
			 * @description Generates a localized representation of the input feature, which includes the actions
			 *              available to access the feature, as well as the feature documentation text.
			 * @returns {String} The localized representation.
			 */
			InputFeature.prototype.toLocalizedString = function () {
				var inputText = '';

				this.inputCombos.forEach(function (inputCombo) {
					var comboText = inputCombo.toLocalizedString();
					if (inputText === '') {
						inputText = comboText;
					} else {
						inputText = $translate.instant('model.viewer.inputHelp.alternativePattern', {
							list: inputText,
							alternative: comboText
						});
					}
				});

				return $translate.instant('model.viewer.inputHelp.inputRulePattern', {
					input: inputText,
					effect: $translate.instant(this.descriptionKey)
				});
			};

			/**
			 * @ngdoc method
			 * @name retrieveInputFeatures
			 * @method
			 * @methodOf modelViewerInputHelpService
			 * @description Filters a list of input features such that no shadowed features are included.
			 * @param {Array<InputFeature>} allFeatures The original list of features.
			 * @returns {Array<InputFeature>} The resulting list of features.
			 */
			service.retrieveInputFeatures = function (allFeatures) {
				var sortedFeatures = _.sortBy(allFeatures || [], 'priority');
				var result = [];
				_.forEachRight(sortedFeatures, function (inputFeature) {
					if (!inputFeature.isShadowed(result)) {
						result.push(inputFeature);
					}
				});
				return result;
			};

			return service;
		}]);
})(angular);
