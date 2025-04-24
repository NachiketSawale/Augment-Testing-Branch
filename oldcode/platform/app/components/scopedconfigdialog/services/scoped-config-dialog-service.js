/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformScopedConfigDialogService
	 * @function
	 *
	 * @description Displays a modal dialog box for configuring settings that are scoped to users, roles, or the system,
	 *              and that can optionally be specified to override the less prioritized settings.
	 */
	angular.module('platform').factory('platformScopedConfigDialogService',
		platformScopedConfigDialogService);

	platformScopedConfigDialogService.$inject = ['_', 'platformDialogService',
		'basicsCommonConfigLocationListService', 'platformRuntimeDataService', '$translate'];

	function platformScopedConfigDialogService(_, platformDialogService, configLocations, platformRuntimeDataService, $translate) {
		const service = {};

		/**
		 * @ngdoc function
		 * @name getValueDefinedPropertyName
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Returns the name of the property that determines, for a given model property, whether
		 *              a value is set (rather than inherited from the next fallback level).
		 * @param {String} propName The name of the model property.
		 * @returns {String} The generated property name.
		 */
		function getValueDefinedPropertyName(propName) {
			return '__rt$set_' + propName;
		}

		/**
		 * @ngdoc function
		 * @name getEditedValuePropertyName
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Returns the name of the property that stores the previously edited value of a model property
		 *              that currently inherits its value from the next fallback level.
		 * @param {String} propName The name of the model property.
		 * @returns {String} The generated property name.
		 */
		function getEditedValuePropertyName(propName) {
			return '__rt$edited_' + propName;
		}

		/**
		 * @ngdoc function
		 * @name expandForm
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Creates an expanded form configuration that may include controls for determining whether
		 *              a property value is set or inherited from the next fallback level.
		 * @param {Object} formCfg The original form configuration.
		 * @param {Boolean} isFirstConfigurableLevel Indicates whether the form configuration represents the first
		 *                                           cascading level, that is, the level that has the highest
		 *                                           priority and thus is not a fallback to any other level.
		 * @param {Boolean} isLastConfigurableLevel Indicates whether the form configuration represents the last
		 *                                          cascading level, that is, the level whose fallback is not
		 *                                          configurable in the dialog box.
		 * @param {Object} fallback An object specifying the default settings that cannot be edited in the dialog
		 *                          box.
		 * @param {Boolean} hasEditPermission Indicates whether the user has the permission to modify settings in
		 *                                    the current access scope.
		 * @returns {Object} The expanded form configuration. The resulting object has a `registerFormWatches`
		 *                   method that must be invoked to enable the watches in the form. The method returns
		 *                   a collection of parameterless destructor functions for the created watches.
		 */
		function expandForm(formCfg, isFirstConfigurableLevel, isLastConfigurableLevel, fallback, hasEditPermission) {
			const valueDefinedWatchFactory = function (scope, settings, settingsPathFromScope) {
				const that = this;
				return scope.$watch(settingsPathFromScope + '.' + this.valuePath, function (newValue) {
					platformRuntimeDataService.readonly(settings, [{field: that.field, readonly: !newValue}]);

					const editedValueProp = getEditedValuePropertyName(that.field);
					if (newValue) { // newValue === replace inherited value
						if (angular.isDefined(settings[editedValueProp])) {
							settings[that.field] = settings[editedValueProp];
						}
					} else {
						settings[editedValueProp] = settings[that.field];
						settings.__rt$inheritedSettings.passValueOn(that.field);
					}
				});
			};

			const valueChangedWatchFactory = function (scope, settings, settingsPathFromScope) {
				const that = this;
				return scope.$watch(settingsPathFromScope + '.' + this.valuePath, function () {
					settings.passValueOn(that.field);
				});
			};

			const result = _.cloneDeep(formCfg);

			let watchDescriptors = [];

			const overwriteControlToolTip = $translate.instant('platform.overwriteInherited');
			for (let rowIdx = 0; rowIdx < result.rows.length; rowIdx++) {
				const row = result.rows[rowIdx];
				if (row.model && !row.readonly) {
					if (!isLastConfigurableLevel || !angular.isUndefined(fallback[row.model])) {
						const valueDefinedProp = getValueDefinedPropertyName(row.model);
						result.rows[rowIdx] = {
							gid: row.gid,
							rid: row.rid,
							label: row.label,
							type: 'composite',
							visible: row.visible,
							sortOrder: row.sortOrder,
							composite: [{
								model: valueDefinedProp,
								type: 'boolean',
								fill: false,
								tooltip: overwriteControlToolTip
							}, row]
						};

						if (hasEditPermission) {
							watchDescriptors.push({
								valuePath: valueDefinedProp,
								field: row.model,
								createWatch: valueDefinedWatchFactory
							});
						} else {
							result.rows[rowIdx].composite[0].readonly = true;
							result.rows[rowIdx].composite[1].readonly = true;
						}
					} else {
						if (!hasEditPermission) {
							row.readonly = true;
						}
					}
					if (!isFirstConfigurableLevel) {
						watchDescriptors.push({
							valuePath: row.model,
							field: row.model,
							createWatch: valueChangedWatchFactory
						});
					}
				}
			}

			result.registerFormWatches = function (scope, settings, settingsPathFromScope) {
				const result = _.map(watchDescriptors, function (desc) {
					return desc.createWatch(scope, settings, settingsPathFromScope);
				});
				watchDescriptors = [];
				return result;
			};

			return result;
		}

		/**
		 * @ngdoc function
		 * @name createExpandedSettings
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Creates an expanded copy of a settings object for a single fallback level. The expanded copy
		 *              includes runtime data required by the internal logic of the dialog box.
		 * @param {Object} formCfg The original form configuration.
		 * @param {Object} originalSettings The unaltered settings for a single fallback level.
		 * @param {Boolean} isLastConfigurableLevel Indicates whether the form configuration represents the last
		 *                                          cascading level, that is, the level whose fallback is not
		 *                                          configurable in the dialog box.
		 * @param {Object} fallback The expanded settings object that serves as a fallback to the current fallback
		 *                          level.
		 * @returns {Object} The expanded copy of the settings object.
		 */
		function createExpandedSettings(formCfg, originalSettings, isLastConfigurableLevel, fallback) {
			const result = {};
			formCfg.rows.forEach(function (row) {
				if (row.model && !row.readonly) {
					const valueDefinedProp = getValueDefinedPropertyName(row.model);
					if (!isLastConfigurableLevel || angular.isDefined(fallback[row.model])) {
						if (angular.isDefined(originalSettings[row.model]) && (originalSettings[row.model] !== null)) {
							result[valueDefinedProp] = true;
							result[row.model] = _.cloneDeep(originalSettings[row.model]);
						} else {
							result[valueDefinedProp] = false;
							result[row.model] = fallback[row.model];
							result[getEditedValuePropertyName(row.model)] = null;
						}
					} else {
						result[valueDefinedProp] = true;
						result[row.model] = _.cloneDeep(originalSettings[row.model]);
					}
				}
			});
			return result;
		}

		/**
		 * @ngdoc function
		 * @name generateForm
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Generates the expanded form and settings objects for all fallback levels.
		 * @param {Object} formCfg The original form configuration.
		 * @param {Object} dataItem All original settings. These settings should be provided as an object with
		 *                          properties whose name match the `id` field in the objects returned by
		 *                          {@see basicsCommonConfigLocationListService.createItems}. Each of these
		 *                          properties may hold an object that stores the actual settings for the
		 *                          respective fallback level.
		 * @param {Object} fallbackDataItem An object that provides default settings that serve as a fallback for
		 *                                  the settings provided in `dataItem`. If a property is not defined in
		 *                                  this object, users will be forced to enter a value in the last fallback
		 *                                  level, as the option for inheriting a value will not be available.
		 * @param {Boolean} hasEditPermissions An object that indicates for each access scope whether the user has
		 *                                     the permission to modify settings.
		 * @returns {Object} An object that stores information about the fallback levels in two fashions: `byName`
		 *                   allows access via the `id` as returned by
		 *                   {@see basicsCommonConfigLocationListService.createItems}. `ordered` allows access via
		 *                   an array ordered from least prioritized to most prioritized fallback level. Each level
		 *                   has a `formConfiguration` and a `settings` property holding the form and the underlying
		 *                   settings object, respectively. The unconfigurable system level is included (with `id`
		 *                   `0`). Its `formConfiguration` property is `null`. The fallback level ID can also be
		 *                   retrieved from the `scopeLevel` property of each object. Furthermore, the
		 *                   `isGlobalFallback` property indicates whether the object represents the unconfigurable
		 *                   fallback level with the settings provided in `fallbackDataItem`.
		 */
		function generateForm(formCfg, dataItem, fallbackDataItem, hasEditPermissions) {
			const result = {
				byName: {},
				ordered: []
			};

			result.byName[0] = {
				scopeLevel: 0,
				isGlobalFallback: true,
				formConfiguration: null, // intentionally null; there is no form for fallback settings
				settings: _.cloneDeep(fallbackDataItem)
			};
			result.ordered.push(result.byName[0]);

			const configLevels = configLocations.createItems();
			_.sortBy(configLevels, 'priority').forEach(function (scopeLevel, index) {
				const obj = {
					scopeLevel: scopeLevel.id,
					isGlobalFallback: false,
					formConfiguration: expandForm(formCfg, index >= configLevels.length - 1, index <= 0, fallbackDataItem, hasEditPermissions[scopeLevel.id]),
					settings: createExpandedSettings(formCfg, dataItem[scopeLevel.id], index <= 0, result.ordered[result.ordered.length - 1].settings)
				};
				obj.settings.__rt$inheritedSettings = result.ordered[result.ordered.length - 1].settings;
				result.byName[scopeLevel.id] = obj;
				result.ordered.push(obj);

				result.ordered[index].settings.passValueOn = function (propName) {
					const valueDefinedProp = getValueDefinedPropertyName(propName);
					if (!result.ordered[index + 1].settings[valueDefinedProp]) {
						result.ordered[index + 1].settings[propName] = result.ordered[index].settings[propName];
					}
				};
			});

			return result;
		}

		/**
		 * @ngdoc function
		 * @name applySettings
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Writes settings from the form back into the original data item.
		 * @param {Object} formCfg The original, unaltered form configuration.
		 * @param {Object} scopedForm An object as returned by {@see generateForm}.
		 * @param {Object} dataItem The original settings object that serves as a target for the operation.
		 */
		function applySettings(formCfg, scopedForm, dataItem) {
			scopedForm.ordered.forEach(function (level) {
				if (!level.isGlobalFallback) {
					let dataItemLevel = dataItem[level.scopeLevel];
					let newDataItemLevel;
					if (dataItemLevel) {
						newDataItemLevel = false;
					} else {
						newDataItemLevel = true;
						dataItemLevel = {};
					}

					let isValueSet = false;
					formCfg.rows.forEach(function (row) {
						if (row.model && !row.readonly) {
							const valueDefinedProp = getValueDefinedPropertyName(row.model);
							if (level.settings[valueDefinedProp]) {
								isValueSet = true;
								dataItemLevel[row.model] = level.settings[row.model];
							} else {
								if (angular.isDefined(dataItemLevel[row.model])) {
									delete dataItemLevel[row.model];
								}
							}
						}
					});

					if (newDataItemLevel && isValueSet) {
						dataItem[level.scopeLevel] = dataItemLevel;
					}
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name showDialog
		 * @function
		 * @methodOf platformScopedConfigDialogService
		 * @description Shows a dialog box for access-scoped configuration settings.
		 * @param {Object} dialogOptions A configuration object for the dialog box. The most important expected
		 *                               properties are `formConfiguration`, `dataItem`, and `fallbackDataItem`.
		 *                               `formConfiguration` contains a template for the form configuration for a
		 *                               single fallback level. It will automatically be replicated and adapted to
		 *                               represent several cascading fallback levels.
		 *                               `dataItem` stores the current settings. These settings should be provided
		 *                               as an object with properties whose name match the `id` field in the objects
		 *                               returned by {@see basicsCommonConfigLocationListService.createItems}. Each
		 *                               of these properties may hold an object that stores the actual settings for
		 *                               the respective fallback level.
		 *                               `fallbackDataItem` is an object that provides default settings that serve
		 *                               as a fallback for the settings provided in `dataItem`. If a property is not
		 *                               defined in this object, users will be forced to enter a value in the last
		 *                               fallback level, as the option for inheriting a value will not be available.
		 * @returns {Promise<Object>} A promise that is resolved when the dialog box gets closed. A `success`
		 *                            property in the passed object indicates whether the dialog box was closed with
		 *                            OK. In any case, a `data` property contains an object with the settings from
		 *                            the dialog box. If the dialog box is closed with OK, that object is the same
		 *                            instance that was passed in as `dialogOptions.dataItem` (that is, the original
		 *                            object gets modified).
		 *
		 */
		service.showDialog = function (dialogOptions) {
			const actualConfig = _.assign({}, _.isObject(dialogOptions) ? dialogOptions : {});

			if (!actualConfig.formConfiguration) {
				throw new Error('No form configuration found.');
			}

			const dataItem = actualConfig.dataItem || {};
			configLocations.createItems().forEach(function (scopeLevel) {
				if (!dataItem[scopeLevel.id]) {
					dataItem[scopeLevel.id] = {};
				}
			});

			return configLocations.checkAccessRights(actualConfig.permissions).then(function (scopedPermissions) {
				const finalFormCfg = generateForm(actualConfig.formConfiguration, dataItem, actualConfig.fallbackDataItem || {}, scopedPermissions);

				const dlgConfig = _.assign({
					width: '600px',
					resizeable: false, // TODO: support resizing without destroying layout
					showOkButton: true,
					showCancelButton: true,
					registerFormWatches: function (scope, pathFromScope) {
						let unbindWatches = [];

						for (let idx = 1; idx < this.formConfiguration.ordered.length; idx++) {
							unbindWatches = unbindWatches.concat(this.formConfiguration.ordered[idx].formConfiguration.registerFormWatches(scope, this.formConfiguration.ordered[idx].settings, pathFromScope + '.formConfiguration.ordered[' + idx + '].settings'));
						}

						return function () {
							unbindWatches.forEach(function (unbindWatch) {
								unbindWatch();
							});
							unbindWatches = [];
						};
					}
				}, actualConfig, {
					formConfiguration: finalFormCfg,
					bodyTemplateUrl: globals.appBaseUrl + 'app/components/scopedconfigdialog/partials/scoped-config-dialog-body-template.html',
					bodyFlexColumn: true
				});
				return platformDialogService.showDialog(dlgConfig).then(function () {
					applySettings(actualConfig.formConfiguration, finalFormCfg, dataItem);

					if (_.isFunction(actualConfig.handleOK)) {
						actualConfig.handleOK(dataItem);
					}

					return {
						success: true,
						data: dataItem
					};
				}, function () {
					const dummyItem = {};
					applySettings(actualConfig.formConfiguration, finalFormCfg, dummyItem);

					if (_.isFunction(actualConfig.handleCancel)) {
						actualConfig.handleCancel(dummyItem);
					}

					return {
						success: false,
						data: dummyItem
					};
				});
			});
		};

		return service;
	}
})(angular);
