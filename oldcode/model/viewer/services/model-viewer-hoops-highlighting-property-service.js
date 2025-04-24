/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsHighlightingPropertyService
	 * @function
	 *
	 * @description Stores information about the mesh properties that are changed based upon object states and settings
	 *              from highlighting schemes. The classes provided by this service constitute a uniform layer for each
	 *              of these properties and encapsulate the actual calls for changing the property values.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsHighlightingPropertyService', ['_',
		'modelViewerHoopsUtilitiesService', 'modelViewerHoopsRuntimeDataService',
		'basicsCommonConfigLocationListService', 'modelViewerSelectabilityService',
		function (_, modelViewerHoopsUtilitiesService, modelViewerHoopsRuntimeDataService,
		          basicsCommonConfigLocationListService, modelViewerSelectabilityService) {
			var service = {};

			// PropertyInfo ----------------------------------------------------------------

			function PropertyInfo() {
			}

			PropertyInfo.prototype.getGlobalValueNames = function () {
				return [];
			};

			PropertyInfo.prototype.getValueFromHlItem = function () {
				throw new Error('A subclass must implement this method.');
			};

			PropertyInfo.prototype.getGlobalValue = function (globalValueName) {
				throw new Error('A subclass must implement this method for global value ' + globalValueName + '.');
			};

			PropertyInfo.prototype.mergeValues = function () {
				throw new Error('A subclass must implement this method.');
			};

			PropertyInfo.prototype.getEffectiveValue = function (hlItems, contextInfo) {
				var that = this;
				return this.mergeValues(_.map(hlItems, function (hlData) {
					return _.isNil(hlData.hlItem) ? null : that.getValueFromHlItem(hlData, contextInfo);
				}), contextInfo);
			};

			PropertyInfo.prototype.getEffectiveGlobalValue = function (globalValueName, hlSchemes, contextInfo) {
				var that = this;
				return this.mergeValues(_.map(hlSchemes, function (hlScheme) {
					return that.getGlobalValue(globalValueName, hlScheme, contextInfo);
				}), contextInfo);
			};

			PropertyInfo.prototype.getPropertyName = function () {
				throw new Error('A subclass must implement this method.');
			};

			PropertyInfo.prototype.requiresViewerIds = function () {
				return false;
			};

			PropertyInfo.prototype.retrieveDefaultValues = function () {
				return null;
			};

			PropertyInfo.prototype.areValuesEqual = function (v1, v2) {
				return v1 === v2;
			};

			PropertyInfo.prototype.assignValues = function () {
			};

			PropertyInfo.prototype.assignGlobalValues = function () {
			};

			// ColorPropertyInfo ----------------------------------------------------------------

			function ColorPropertyInfo() {
				PropertyInfo.call(this);
				this._globalValueNames = ['bgColor', 'selColor'];
			}
			ColorPropertyInfo.prototype = Object.create(PropertyInfo.prototype);
			ColorPropertyInfo.prototype.constructor = ColorPropertyInfo;

			ColorPropertyInfo.prototype.getGlobalValueNames = function () {
				return this._globalValueNames;
			};

			ColorPropertyInfo.prototype.getValueFromHlItem = function (hlData) {
				if (hlData.hlItem.useObjectColor) {
					if (_.isObject(hlData.hints.color)) {
						return modelViewerHoopsUtilitiesService.rgbColorToViewerColor(hlData.hints.color);
					}
				}

				if (_.isNil(hlData.hlItem.viewerColor)) {
					if (_.isObject(hlData.hlItem.color)) {
						hlData.hlItem.viewerColor = modelViewerHoopsUtilitiesService.rgbColorToViewerColor(hlData.hlItem.color);
					}
				}
				return hlData.hlItem.viewerColor;
			};

			ColorPropertyInfo.prototype.getGlobalValue = function (globalValueName, hlScheme, contextInfo) {
				function getViewerColor(name) {
					var viewerColorName = 'viewer' + name.charAt(0).toUpperCase() + name.substr(1);
					if (_.isNil(hlScheme[viewerColorName])) {
						if (_.isObject(hlScheme[name])) {
							hlScheme[viewerColorName] = modelViewerHoopsUtilitiesService.rgbColorToViewerColor(hlScheme[name]);
						}
					}
					return hlScheme[viewerColorName];
				}

				switch (globalValueName) {
					case 'bgColor':
					case 'selColor':
						return getViewerColor(globalValueName);
					default:
						return PropertyInfo.prototype.getGlobalValue.call(globalValueName, hlScheme, contextInfo);
				}
			};

			ColorPropertyInfo.prototype.mergeValues = function (values, contextInfo) {
				for (var i = values.length - 1; i >= 0; i--) {
					if (!_.isNil(values[i])) {
						return values[i];
					}
				}
				return modelViewerHoopsUtilitiesService.rgbColorToViewerColor(contextInfo.defaultValue);
			};

			ColorPropertyInfo.prototype.getPropertyName = function () {
				return 'color';
			};

			ColorPropertyInfo.prototype.requiresViewerIds = function () {
				return true;
			};

			ColorPropertyInfo.prototype.retrieveDefaultValues = function (hwv) {
				return modelViewerHoopsRuntimeDataService.getDefaultColors(hwv);
			};

			ColorPropertyInfo.prototype.areValuesEqual = function (v1, v2) {
				if (_.isNil(v1)) {
					return _.isNil(v2);
				} else {
					if (_.isNil(v2)) {
						return false;
					}
				}

				if (_.isArray(v1)) {
					if (_.isArray(v2) && (v1.length === v2.length)) {
						for (var i = 0; i < v1.length; i++) {
							if (!v1[i].equals(v2[i])) {
								return false;
							}
						}
						return true;
					} else {
						return false;
					}
				} else {
					return v1.equals(v2);
				}
			};

			ColorPropertyInfo.prototype.assignValues = function (changeInfo) {
				return changeInfo.viewer.model.setNodesColors(changeInfo.changesByViewerId, true);
			};

			ColorPropertyInfo.prototype.assignGlobalValues = function (changeInfo) {
				switch (changeInfo.globalValueName) {
					case 'bgColor':
						if (_.isArray(changeInfo.globalChanges.bgColor)) {
							return changeInfo.viewer.view.setBackgroundColor(changeInfo.globalChanges.bgColor[0], changeInfo.globalChanges.bgColor[1]);
						} else if (_.isObject(changeInfo.globalChanges.bgColor)) {
							return changeInfo.viewer.view.setBackgroundColor(changeInfo.globalChanges.bgColor, changeInfo.globalChanges.bgColor);
						}
						break;
					case 'selColor':
						if (_.isObject(changeInfo.globalChanges.selColor)) {
							return changeInfo.viewer.selectionManager.setNodeSelectionColor(changeInfo.globalChanges.selColor);
						}
						break;
				}
			};

			// TransparencyPropertyInfo ----------------------------------------------------------------

			function TransparencyPropertyInfo() {
				PropertyInfo.call(this);
			}
			TransparencyPropertyInfo.prototype = Object.create(PropertyInfo.prototype);
			TransparencyPropertyInfo.prototype.constructor = TransparencyPropertyInfo;

			TransparencyPropertyInfo.prototype.getValueFromHlItem = function (hlData) {
				return hlData.hlItem.transparency;
			};

			TransparencyPropertyInfo.prototype.mergeValues = function (values, contextInfo) {
				var current = contextInfo.defaultValue;
				for (var i = values.length - 1; i >= 0; i--) {
					if (!_.isNil(values[i])) {
						current *= values[i];
					}
				}
				return current;
			};

			TransparencyPropertyInfo.prototype.getPropertyName = function () {
				return 'transparency';
			};

			TransparencyPropertyInfo.prototype.requiresViewerIds = function () {
				return true;
			};

			TransparencyPropertyInfo.prototype.retrieveDefaultValues = function (hwv) {
				return modelViewerHoopsRuntimeDataService.getDefaultTransparencies(hwv);
			};

			TransparencyPropertyInfo.prototype.areValuesEqual = function (v1, v2) {
				return v1 === v2;
			};

			TransparencyPropertyInfo.prototype.assignValues = function (changeInfo) {
				return changeInfo.viewer.model.setNodesOpacities(changeInfo.changesByViewerId);
			};

			// VisibilityPropertyInfo ----------------------------------------------------------------

			function VisibilityPropertyInfo() {
				PropertyInfo.call(this);
			}
			VisibilityPropertyInfo.prototype = Object.create(PropertyInfo.prototype);
			VisibilityPropertyInfo.prototype.constructor = VisibilityPropertyInfo;

			VisibilityPropertyInfo.prototype.getValueFromHlItem = function (hlData, contextInfo) {
				switch (hlData.hlItem.visibility) {
					case 'h':
						return false;
					case 'v':
						return true;
					default:
						return (function getDefaultModelVisibility () {
							var result = true;
							_.orderBy(basicsCommonConfigLocationListService.createItems(), ['priority'], ['desc']).some(function (sl) {
								var showModel = _.get(contextInfo, 'displaySettings.' + sl.id + '.showModel');
								if (!_.isNil(showModel)) {
									result = !!showModel;
									return true;
								}
							});
							return result;
						})();
				}
			};

			VisibilityPropertyInfo.prototype.mergeValues = function (values, contextInfo) {
				var explicitlyRequested = false;
				for (var i = values.length - 1; i >= 0; i--) {
					if (!_.isNil(values[i])) {
						if (!values[i]) {
							return false;
						}
						explicitlyRequested = true;
					}
				}
				return explicitlyRequested || contextInfo.defaultValue;
			};

			VisibilityPropertyInfo.prototype.getPropertyName = function () {
				return 'visibility';
			};

			VisibilityPropertyInfo.prototype.requiresViewerIds = function () {
				return true;
			};

			VisibilityPropertyInfo.prototype.retrieveDefaultValues = function (hwv) {
				return modelViewerHoopsRuntimeDataService.getDefaultVisibilities(hwv);
			};

			VisibilityPropertyInfo.prototype.areValuesEqual = function (v1, v2) {
				return v1 === v2;
			};

			VisibilityPropertyInfo.prototype.assignValues = function (changeInfo) {
				return changeInfo.viewer.model.setNodesVisibilities(changeInfo.changesByViewerId);
			};

			// SelectabilityPropertyInfo ----------------------------------------------------------------

			function SelectabilityPropertyInfo() {
				PropertyInfo.call(this);
			}
			SelectabilityPropertyInfo.prototype = Object.create(PropertyInfo.prototype);
			SelectabilityPropertyInfo.prototype.constructor = SelectabilityPropertyInfo;

			SelectabilityPropertyInfo.prototype.getValueFromHlItem = function (hlData) {
				return hlData.hlItem.selectable;
			};

			SelectabilityPropertyInfo.prototype.mergeValues = function (values) {
				return values.every(function (v) {
					return _.isNil(v) || v;
				});
			};

			SelectabilityPropertyInfo.prototype.getPropertyName = function () {
				return 'selectability';
			};

			SelectabilityPropertyInfo.prototype.areValuesEqual = function (v1, v2) {
				return v1 === v2;
			};

			SelectabilityPropertyInfo.prototype.assignValues = function (changeInfo) {
				modelViewerSelectabilityService.getSelectabilityInfo(changeInfo.viewer).updateSelectabilityInfo(changeInfo.changesByMeshId);
			};

			// common ----------------------------------------------------------------

			service.getPropertyInfos = function () {
				return [
					new ColorPropertyInfo(),
					new TransparencyPropertyInfo(),
					new VisibilityPropertyInfo(),
					new SelectabilityPropertyInfo()
				];
			};

			return service;
		}]);
})(angular);
