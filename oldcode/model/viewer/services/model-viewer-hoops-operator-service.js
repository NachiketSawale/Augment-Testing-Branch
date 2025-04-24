/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsOperatorService
	 * @function
	 *
	 * @description Provides [custom operators](http://rib-tst-cloud01/preview2/documentation/build/viewer-web-client-custom-operators.html)
	 *              for the Hoops 3D Viewer. The service provides names of the operators, as well as factory
	 *              functions for instantiating the operators for a given viewer with a given viewer settings object.
	 *              Optionally, the constructor functions also accept a method for focusing the viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsOperatorService', ['_', 'keyCodes', 'Communicator',
		'modelViewerHoopsOperatorCameraService', 'modelViewerHoopsOperatorManipulationService', '$translate',
		'modelViewerInputHelpService', 'modelViewerHoopsOperatorUtilitiesService',
		function (_, keyCodes, Communicator, modelViewerHoopsOperatorCameraService,
		          modelViewerHoopsOperatorManipulationService, $translate, modelViewerInputHelpService,
		          modelViewerHoopsOperatorUtilitiesService) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name zoomIn
			 * @function
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Zooms a viewer in.
			 * @param {Communicator.WebViewer} viewer The viewer.
			 * @param {Number} zoomDelta The relative zoom level.
			 * @param {Communicator.Point2} viewportCoords Optionally, a point in the viewport to zoom in on. If no
			 *                                             value is provided for this parameter, the camera will zoom
			 *                                             in on the center of the viewport.
			 */
			service.zoomIn = modelViewerHoopsOperatorUtilitiesService.zoomIn;

			/**
			 * @ngdoc function
			 * @name zoomOut
			 * @function
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Zooms a viewer out.
			 * @param {Communicator.WebViewer} viewer The viewer.
			 * @param {Number} zoomDelta The relative zoom level.
			 * @param {Communicator.Point2} viewportCoords Optionally, a point in the viewport to zoom out from. If no
			 *                                             value is provided for this parameter, the camera will zoom
			 *                                             out from the center of the viewport.
			 */
			service.zoomOut = modelViewerHoopsOperatorUtilitiesService.zoomOut;

			var operatorServices = [modelViewerHoopsOperatorCameraService, modelViewerHoopsOperatorManipulationService];

			service.operatorNames = Array.prototype.concat.apply([], _.map(operatorServices, function (svc) {
				return svc.operatorNames;
			}));

			/**
			 * @ngdoc method
			 * @name registerAll
			 * @method
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Registers all known custom operators with a given viewer.
			 * @param {Communicator.WebViewer} viewer The viewer.
			 * @param {Object} viewerSettings A reference to the viewer settings instance.
			 * @param {Function} focusViewer A function that assigns input focus to the viewer.
			 * @returns {Object} An object with one property per operator name, indicating the HOOPS viewer handle of
			 *                   the operator.
			 */
			service.registerAll = function (viewer, viewerSettings, focusViewer, viewRecord) {
				var idMap = {};
				for (var i = 0; i < this.operatorNames.length; i++) {
					var opName = this.operatorNames[i];
					var op = this.operators[opName](viewer, viewerSettings, focusViewer, viewRecord);
					op.id = viewer.operatorManager.registerCustomOperator(op);
					idMap[opName] = op;
				}
				return idMap;
			};
			service.operators = _.assign.apply(service, [{}].concat(_.map(operatorServices, function (svc) {
				return svc.operators;
			})));

			/**
			 * @ngdoc method
			 * @name getOperatorsHelpText
			 * @method
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Assembles a textual description of input features of a set of operators.
			 * @param {Array<OperatorBase>} operators An array of operators. Fals-y elements will be ignored.
			 * @returns {String} The resulting help text.
			 */
			service.getOperatorsHelpText = function (operators) {
				var features = [];
				operators.forEach(function (op) {
					if (op) {
						features = features.concat(op.getInputFeatures());
					}
				});
				features = modelViewerInputHelpService.retrieveInputFeatures(features);

				var result = '';
				features.forEach(function (feature) {
					if (result !== '') {
						result += '§§';
					}
					result += feature.toLocalizedString();
				});
				return result;
			};

			/**
			 * @ngdoc method
			 * @name createMenu
			 * @method
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Creates a set of radio buttons for selecting operators.
			 * @param {Object} viewerContainer An object that contains a `viewer` function, a `viewerSettings` property,
			 *                                 an `operators` function, and a parameterless `focusViewer` method.
			 * @param {Function} sceneToolButtonDisabled A parameterless function that returns a value indicating
			 *                                           whether scene-related tool buttons should be disabled.
			 * @param {Function} saveSettings A parameterless function that saves the settings of the 3D display.
			 * @param {Array<Object>} opDescriptors An array with descriptors of the operators.
			 * @param {String} The ID of the menu.
			 * @param {String} activateOperatorIndex The index of the operator on the operator stack to set.
			 * @param {String} setOperatorInfoName The name of a method in `viewerContainer` that receives a help string
			 *                                     to display with some information on allowed input to the operator.
			 * @param {String} settingName The name of the property in the viewer settings object that stores the
			 *                             selected operator name.
			 * @param {String} toolsProperty The property name in `viewerContainer` that will receive the information on
			 *                               operator-specific tools.
			 * @returns {Object} A toolbar item with an additional `selectOperator` method that can be used to
			 *                   activate an operator by its button ID.
			 */
			function createMenu(viewerContainer, sceneToolButtonDisabled, saveSettings, opDescriptors, menuId, activateOperatorIndex, setOperatorInfoName, settingName, toolsProperty) {
				var result = {
					id: menuId,
					cssClass: 'menu-' + menuId,
					iconClass: '',
					type: 'dropdown-btn',
					caption: 'model.viewer.operatorMenu.' + menuId,
					list: {
						cssClass: 'dropdown-menu-right radio-group',
						showTitles: true,
						showImages: true
					}
				};

				var saveChangedOperator = true;

				function activateBuiltInOperator(id, button) {
					viewerContainer.viewer().operatorManager.set(Communicator.OperatorId[button.operatorId], activateOperatorIndex);
					viewerContainer[setOperatorInfoName](null);
					viewerContainer.focusViewer();
					if (settingName) {
						viewerContainer.viewerSettings[settingName] = button.value;
						if (saveChangedOperator) {
							saveSettings();
						}
					}
				}

				function activateCustomOperator(id, button) {
					var operators = viewerContainer.operators();
					var op = operators[button.operatorId];
					if (op) {
						viewerContainer.viewer().operatorManager.set(op.id, activateOperatorIndex);
						viewerContainer[setOperatorInfoName](op);
						if (settingName) {
							viewerContainer.viewerSettings[settingName] = button.value;
							if (saveChangedOperator) {
								saveSettings();
							}
						}
						if (toolsProperty) {
							var tools = op.getContextTools();
							viewerContainer[toolsProperty] = {
								available: angular.isArray(tools) && (tools.length > 0),
								items: {
									showImages: true,
									showTitles: true,
									cssClass: 'tools',
									items: tools
								}
							};
						}
					} else {
						//viewerContainer.viewer().operatorManager.clear(); // TODO: decide what to do here
						viewerContainer[setOperatorInfoName]('');
						if (toolsProperty) {
							viewerContainer[toolsProperty] = {
								available: false
							};
						}
					}
					viewerContainer.focusViewer();
				}

				function updateButtonVisibility(selectedButton) {
					result.list.items.forEach(function (item) {
						if (item.isTemporarilyVisible) {
							item.hideItem = selectedButton !== item;
						}
					});
				}

				result.selectOperator = function (operatorId) {
					var btn = _.find(result.list.items, {
						value: operatorId
					});
					if (btn) {
						updateButtonVisibility(btn);

						saveChangedOperator = false;
						try {
							btn.fn(btn.id, btn);
							result.list.activeValue = operatorId;
						} finally {
							saveChangedOperator = true;
						}
						return true;
					} else {
						return false;
					}
				};

				result.getActiveOperatorDef = function () {
					return _.find(result.list.items, {
						value: result.list.activeValue
					});
				};

				result.list.items = _.map(opDescriptors, function (item) {
					var iconClass = 'tlb-icons ico-' + item.icon;
					return {
						id: item.optionId + 'Operator',
						value: item.optionId,
						operatorId: item.operatorId + 'Operator',
						caption: 'model.viewer.operator.' + item.operatorId + '.name',
						type: 'radio',
						iconClass: iconClass,
						fn: function (id, button) {
							updateButtonVisibility(button);

							(item.isBuiltIn ? activateBuiltInOperator : activateCustomOperator)(id, button);

							result.iconClass = iconClass;
							if (_.isFunction(_.get(viewerContainer, 'tools.update'))) {
								viewerContainer.tools.update();
							}
						},
						disabled: sceneToolButtonDisabled,
						isTemporarilyVisible: item.isTemporarilyVisible
					};
				});

				return result;
			}

			/**
			 * @ngdoc method
			 * @name createManipulationOperatorMenu
			 * @method
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Creates a set of radio buttons for selecting operators.
			 * @param {Object} viewerContainer An object that contains a `viewer`, a `viewerSettings`, an `operators`
			 *                                 property, and a parameterless `focusViewer` method.
			 * @param {Function} sceneToolButtonDisabled A parameterless function that returns a value indicating
			 *                                           whether scene-related tool buttons should be disabled.
			 * @param {Function} saveSettings A parameterless function that saves the settings of the 3D display.
			 * @returns {Object} A toolbar item with an additional `selectOperator` method that can be used to
			 *                   activate an operator by its button ID.
			 */
			service.createManipulationOperatorMenu = function (viewerContainer, sceneToolButtonDisabled, saveSettings) {
				return createMenu(viewerContainer, sceneToolButtonDisabled, saveSettings, modelViewerHoopsOperatorManipulationService.menuDescriptors, 'manipOperators', 1, 'updateManipulationOperatorInfo', null, 'contextTools');
			};

			/**
			 * @ngdoc method
			 * @name createCameraOperatorMenu
			 * @method
			 * @methodOf modelViewerHoopsOperatorService
			 * @description Creates a set of radio buttons for selecting operators.
			 * @param {Object} viewerContainer An object that contains a `viewer`, a `viewerSettings`, an `operators`
			 *                                 property, and a parameterless `focusViewer` method.
			 * @param {Function} sceneToolButtonDisabled A parameterless function that returns a value indicating
			 *                                           whether scene-related tool buttons should be disabled.
			 * @param {Function} saveSettings A parameterless function that saves the settings of the 3D display.
			 * @returns {Object} A toolbar item with an additional `selectOperator` method that can be used to
			 *                   activate an operator by its button ID.
			 */
			service.createCameraOperatorMenu = function (viewerContainer, sceneToolButtonDisabled, saveSettings) {
				return createMenu(viewerContainer, sceneToolButtonDisabled, saveSettings, modelViewerHoopsOperatorCameraService.menuDescriptors, 'camOperators', 0, 'updateCameraOperatorInfo', 'camOperator', null);
			};

			service.createCameraOperatorScsMenu = function (viewerContainer, sceneToolButtonDisabled, saveSettings) {
				return createMenu(viewerContainer, sceneToolButtonDisabled, saveSettings, modelViewerHoopsOperatorCameraService.scsMenuDescriptors, 'camOperators', 0, 'updateCameraOperatorInfo', 'camOperator', null);
			};

			return service;
		}]);
})(angular);
