/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainPropertyWizardService
	 * @function
	 *
	 * @description Provides wizards for automatically handling model object properties.
	 */
	angular.module('model.main').factory('modelMainPropertyWizardService', ['_', 'platformWizardDialogService', '$http',
		'modelViewerModelSelectionService', '$translate', '$timeout', 'modelAdministrationPropertyKeyDataService',
		'platformSidebarWizardCommonTasksService', 'modelViewerCompositeModelObjectSelectionService',
		function (_, platformWizardDialogService, $http, modelViewerModelSelectionService, $translate, $timeout,
		          modelAdministrationPropertyKeyDataService, platformSidebarWizardCommonTasksService,
		          modelViewerCompositeModelObjectSelectionService) {
			var service = {};

			/**
			 * @ngdoc method
			 * @name checkSelection
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Checks whether a model is selected and otherwise displays a message.
			 * @returns {Boolean} A value that indicates whether there is any selection.
			 */
			function checkSelection() {
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					return true;
				} else {
					platformSidebarWizardCommonTasksService.showErrorNoSelection('model.main.propUoMWizard.assignmentError', $translate.instant('model.main.noModelSelected'));
					return false;
				}
			}

			/**
			 * @ngdoc method
			 * @name formatExemplaryList
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Formats a list of example items from a given set of items.
			 * @param {Array} items The complete set of items.
			 * @returns {String} A string that indicates some examples of items from the list.
			 * @throws {Error} There are no items in the list.
			 */
			function formatExemplaryList(items) {
				if (items.length <= 0) {
					throw new Error('The list is empty.');
				}

				var maxItems = 3;

				var result = items[0];
				for (var idx = 1; (idx < items.length) && (idx < maxItems); idx++) {
					result = $translate.instant('model.main.propUoMWizard.listItem', {
						list: result,
						item: items[idx]
					});
				}
				if (items.length > maxItems) {
					result = $translate.instant('model.main.propUoMWizard.moreListItems', {
						list: result
					});
				}
				return result;
			}

			/**
			 * @ngdoc method
			 * @name createPropertyKeySourceForm
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Creates the form for selecting the property key source.
			 * @returns {Object} The form configuration.
			 */
			function createPropertyKeySourceForm() {
				return {
					fid: 'model.main.propertyWizard.propKeySource',
					version: '1.0.0',
					showGrouping: true,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'source',
						header$tr$: 'model.main.propUoMWizard.propKeySourceHeader',
						isOpen: true
					}, {
						gid: 'settings',
						header$tr$: 'model.main.propUoMWizard.propKeyRestrictionHeader',
						isOpen: true
					}],
					rows: [{
						gid: 'source',
						rid: 'propKeySourceMode',
						type: 'radio',
						label$tr$: 'model.main.propUoMWizard.propKeySet',
						model: 'propKeySourceMode',
						visible: true,
						sortOrder: 1,
						options: {
							valueMember: 'value',
							labelMember: 'label',
							disabledMember: 'disabled',
							groupName: 'propKeySourceGroup',
							items: [{
								value: 'm',
								label$tr$: 'model.main.propUoMWizard.propKeySourceModel'
							}, {
								value: 'e',
								label$tr$: 'model.main.propUoMWizard.propKeySourceMeshes',
								disabled: _.every(modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds(), function (modelIds) {
									return modelIds.length <= 0;
								})
							}, {
								value: 'k',
								label$tr$: 'model.main.propUoMWizard.propKeySourceKeyList',
								disabled: !modelAdministrationPropertyKeyDataService.hasSelection()
							}]
						}
					}, {
						gid: 'settings',
						rid: 'ignoreAssigned',
						type: 'boolean',
						label$tr$: 'model.main.propUoMWizard.ignoreAssigned',
						model: 'ignoreAssigned',
						visible: true,
						sortOrder: 10
					}, {
						gid: 'settings',
						rid: 'ignoreEmpty',
						type: 'boolean',
						label$tr$: 'model.main.propUoMWizard.ignoreEmptyUoM',
						model: 'ignoreEmpty',
						visible: true,
						sortOrder: 20
					}]
				};
			}

			/**
			 * @ngdoc method
			 * @name createPropertyKeysForm
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Creates the form for selecting property keys from a list.
			 * @returns {Object} The form configuration.
			 */
			function createPropertyKeysForm() {
				return {
					fid: 'model.main.propertyWizard.propKeys',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'propKeys',
						type: 'directive',
						directive: 'model-main-property-keys-checklist',
						model: 'eligiblePropKeys'
					}]
				};
			}

			/**
			 * @ngdoc method
			 * @name createUoMAssignmentModeForm
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Creates the form for selecting the granularity of UoM assignment for a given UoM.
			 * @param {Number} uomIndex The zero-based index of the UoM among all found UoMs.
			 * @param {String} modelPrefix The prefix string prepended to all model properties.
			 * @param {Boolean} multipleTypes Indicates whether the UoM is associated with multiple types.
			 * @param {Array<String>} types The list of type names the UoM is associated with.
			 * @param {Boolean} multiplePropKeys Indicates whether the UoM is associated with multiple property keys.
			 * @param {Array<String>} propKeys The list of property key names the UoM is associated with.
			 * @returns {Object} The form configuration.
			 */
			function createUoMAssignmentModeForm(uomIndex, modelPrefix, multipleTypes, types, multiplePropKeys, propKeys) {
				var result = {
					fid: 'model.main.propertyWizard.uom' + uomIndex,
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'uomAssignmentMode',
						type: 'radio',
						model: modelPrefix + 'uomAssignmentMode',
						visible: true,
						sortOrder: 1,
						options: {
							valueMember: 'value',
							labelMember: 'label',
							groupName: 'uomAssignmentModeGroup' + uomIndex,
							items: []
						}
					}]
				};

				if (multipleTypes) {
					result.rows[0].options.items.push({
						value: 't',
						label: $translate.instant('model.main.propUoMWizard.distinguishType', {
							typeList: $translate.instant('model.main.propUoMWizard.typeList', {
								count: types.length,
								list: formatExemplaryList(types)
							})
						})
					});
				}
				if (multiplePropKeys) {
					result.rows[0].options.items.push({
						value: 'k',
						label: $translate.instant('model.main.propUoMWizard.distinguishKey', {
							keyList: $translate.instant('model.main.propUoMWizard.keyList', {
								count: propKeys.length,
								list: formatExemplaryList(propKeys)
							})
						})
					});
				}
				result.rows[0].options.items.push({
					value: 'n',
					label$tr$: 'model.main.propUoMWizard.distinguishNone'
				}, {
					value: '-',
					label$tr$: 'model.main.propUoMWizard.skipUoM'
				});

				return result;
			}

			/**
			 * @ngdoc method
			 * @name createPlainUoMAssignmentForm
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Creates the form for selecting a single UoM FK.
			 * @param {Number} uomIndex The zero-based index of the UoM among all found UoMs.
			 * @param {String} modelPrefix The prefix string prepended to all model properties.
			 * @returns {Object} The form configuration.
			 */
			function createPlainUoMAssignmentForm(uomIndex, modelPrefix) {
				return {
					fid: 'model.main.propertyWizard.uom' + uomIndex + '-assignment',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'uom',
						label$tr$: 'model.main.propUoMWizard.uom',
						type: 'directive',
						directive: 'basics-lookupdata-uom-combobox',
						model: modelPrefix + 'uomId[0]',
						visible: true,
						sortOrder: 1
					}]
				};
			}

			/**
			 * @ngdoc method
			 * @name createMappedUoMAssignmentSteps
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Creates wizard step definitions for the assignment of UoMs that are mapped to groups.
			 * @param {String} uom The human-readable name of the uom.
			 * @param {Number} uomIndex The zero-based index of the UoM among all found UoMs.
			 * @param {String} modelPrefix The prefix string prepended to all model properties.
			 * @param {Array<Object>} keys Objects that represent groups that the UoMs are mapped to. Each object is
			 *                             expected to have a `name` and an `id` property.
			 * @param {String} mappingMode `k` if UoMs are mapped to property keys, `t` if UoMs are mapped to value
			 *                             types.
			 * @returns {Array<Object>} The step definitions.
			 */
			function createMappedUoMAssignmentSteps(uom, uomIndex, modelPrefix, keys, mappingMode) {
				var stepData = _.chunk(keys, 5);
				return _.map(stepData, function (step, stepIndex, steps) {
					return {
						id: 'uom-' + uomIndex + '-assignment' + stepIndex,
						title: $translate.instant('model.main.propUoMWizard.chunkedUomAssignTitle', {
							uom: uom,
							chunkNumber: stepIndex + 1,
							chunkCount: steps.length
						}),
						form: {
							fid: 'model.main.propertyWizard.uom' + uomIndex + '-assignment' + stepIndex,
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'default'
							}],
							rows: _.map(step, function (item) {
								var uomLabel;
								switch (mappingMode) {
									case 'k':
										uomLabel = 'model.main.propUoMWizard.propKeyUom';
										break;
									case 't':
										uomLabel = 'model.main.propUoMWizard.valueTypeUom';
										break;
								}

								return {
									gid: 'default',
									rid: 'uom',
									label: $translate.instant(uomLabel, {
										itemName: item.name
									}),
									type: 'directive',
									directive: 'basics-lookupdata-uom-combobox',
									model: modelPrefix + 'uomId[' + item.id + ']',
									visible: true,
									sortOrder: 1
								};
							})
						}
					};
				});
			}

			/**
			 * @ngdoc method
			 * @name createUoMSteps
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Creates wizard step definitions for a given UoM text.
			 * @param {Object} uomInfo An object that stores some information about the UoM.
			 * @param {Number} uomIndex The zero-based index of the UoM among all found UoMs.
			 * @param {Object} model The model object that stores all data configured in the wizard.
			 * @param {String} modelPrefix The prefix string prepended to all model properties.
			 * @returns {Array<Object>} The step definitions.
			 */
			function createUoMSteps(uomInfo, uomIndex, model, modelPrefix) {
				var multipleTypes = uomInfo.types.length > 1;
				var multiplePropKeys = multipleTypes || _.some(uomInfo.types, function (vt) {
					return vt.keys.length > 1;
				});

				var result = [];

				result.push({
					id: 'uom-' + uomIndex,
					title: $translate.instant('model.main.propUoMWizard.uomTitle', {
						uom: uomInfo.uom
					}),
					form: createUoMAssignmentModeForm(uomIndex, modelPrefix, multipleTypes, _.map(uomInfo.types, function (vt) {
						return vt.code;
					}), multiplePropKeys, _.flatten(_.map(uomInfo.types, function (vt) {
						return _.map(vt.keys, function (vt) {
							return vt.name;
						});
					}))),
					watches: [{
						expression: modelPrefix + 'uomAssignmentMode',
						fn: function (info) {
							for (var idx = info.wizard.steps.length - 1; idx >= 0; idx--) {
								var stepId = info.wizard.steps[idx].id;
								if (stepId) {
									if (stepId.startsWith('uom-' + uomIndex + '-')) {
										info.wizard.steps.splice(idx, 1);
									}
								}
							}

							if (!model[info.newValue]) {
								model[info.newValue] = {};
							}

							var currentStepIndex = info.scope.getCurrentStepNumber() - 1;
							var newSteps = [];
							switch (info.newValue) {
								case 't': // TODO: use localized type description instead of code
									newSteps = createMappedUoMAssignmentSteps(uomInfo.uom, uomIndex, modelPrefix + info.newValue + '.', _.map(uomInfo.types, function (vt) {
										return {
											id: vt.id,
											name: vt.code
										};
									}), 't');
									break;
								case 'k':
									newSteps = createMappedUoMAssignmentSteps(uomInfo.uom, uomIndex, modelPrefix + info.newValue + '.', _.map(_.flatten(_.map(uomInfo.types, function (vt) {
										return vt.keys;
									})), function (pk) {
										return {
											id: pk.id,
											name: pk.name
										};
									}), 'k');
									break;
								case 'n':
									newSteps.push({
										id: 'uom-' + uomIndex + '-assignment',
										title: $translate.instant('model.main.propUoMWizard.uomAssignTitle', {
											uom: uomInfo.uom
										}),
										form: createPlainUoMAssignmentForm(uomIndex, modelPrefix + info.newValue + '.')
									});
									break;
							}
							if (newSteps.length > 0) {
								platformWizardDialogService.translateWizardSteps(newSteps);
								info.wizard.steps.splice.apply(info.wizard.steps, [currentStepIndex + 1, 0].concat(newSteps));
							}
						}
					}]
				});
				model.uomAssignmentMode = '-';

				return result;
			}

			/**
			 * @ngdoc method
			 * @name assignPropertyUoMs
			 * @function
			 * @methodOf modelMainPropertyWizardService
			 * @description Display a wizard that allows users to bulk-assign foreign keys to UoMs based upon textual
			 *              UoMs found in model object property values.
			 * @returns {Object} A wizard result object, or `undefined` if no model is selected.
			 */
			service.assignPropertyUoMs = function () {
				if (!checkSelection()) {
					return;
				}

				function updatePropKeySourceMode(info) {
					var ids = null;
					var idText = null;
					switch (info.newValue) {
						case 'e':
							idText = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().useGlobalModelIds().toCompressedString();
							break;
						case 'k':
							if (modelAdministrationPropertyKeyDataService.hasSelection()) {
								ids = [ modelAdministrationPropertyKeyDataService.getSelected().Id ];
							} else {
								ids = [];
							}
							break;
					}

					var propKeyStep = info.wizard.steps[1];
					propKeyStep.loadingMessage = $translate.instant('model.main.propUoMWizard.loadingPropKeyList');
					propKeyStep.disallowNext = true;

					$http.post(globals.webApiBaseUrl + 'model/main/object2property/modelpropertykeys', {
						mode: info.newValue,
						modelId: modelId,
						ids: ids,
						idText: idText,
						ignoreAssignedUoM: obj.ignoreAssigned,
						ignoreEmptyUoM: obj.ignoreEmpty
					}).then(function (response) {
						if (angular.isArray(response.data)) {
							obj.eligiblePropKeys = _.map(response.data, function (item) {
								return {
									id: item.Id,
									name: item.PropertyName,
									isIncluded: true
								};
							});
						} else {
							obj.eligiblePropKeys = null;
						}
						info.scope.$evalAsync(function () {
							propKeyStep.loadingMessage = null;
							propKeyStep.disallowNext = false;
						});
					});// TODO: handle error?
				}

				var modelId = modelViewerModelSelectionService.getSelectedModelId();

				var obj = {
					propKeySourceMode: 'm',
					ignoreAssigned: true,
					ignoreEmpty: true
				};
				var wzConfig = {
					title$tr$: 'model.main.propUoMWizard.assignPropUoMTitle',
					steps: [{
						id: 'propKeySourceStep',
						title$tr$: 'model.main.propUoMWizard.propKeySourceMode',
						topDescription$tr$: 'model.main.propUoMWizard.dataSourceDesc',
						form: createPropertyKeySourceForm(),
						watches: [{
							expression: 'propKeySourceMode',
							fn: updatePropKeySourceMode
						}, {
							expression: 'ignoreAssigned',
							fn: function (info) {
								updatePropKeySourceMode({
									wizard: info.wizard,
									scope: info.scope,
									newValue: obj.propKeySourceMode
								});
							}
						}, {
							expression: 'ignoreEmpty',
							fn: function (info) {
								updatePropKeySourceMode({
									wizard: info.wizard,
									scope: info.scope,
									newValue: obj.propKeySourceMode
								});
							}
						}]
					}, {
						title$tr$: 'model.main.propUoMWizard.propKeys',
						topDescription$tr$: 'model.main.propUoMWizard.propKeysDesc',
						form: createPropertyKeysForm(),
						disallowNext: true
					}, {
						id: 'loadUoMListStep',
						title$tr$: 'model.main.propUoMWizard.loadUoMListTitle',
						loadingMessage$tr$: 'model.main.propUoMWizard.loadingUoMList',
						disallowBack: true,
						canFinish: false
					}],
					onChangeStep: function (info) {
						switch (info.step.id) {
							case 'propKeySourceStep':
								updatePropKeySourceMode({
									newValue: obj.propKeySourceMode,
									wizard: info.wizard,
									scope: info.scope
								});
								break;
							case 'loadUoMListStep':
								$http.post(globals.webApiBaseUrl + 'model/main/property/getpropertyuoms', {
									modelId: modelId,
									keyIds: _.map(_.filter(obj.eligiblePropKeys, function (item) {
										return item.isIncluded;
									}), function (item) {
										return item.id;
									}),
									ignoreAssigned: obj.ignoreAssigned,
									ignoreEmpty: obj.ignoreEmpty
								}).then(function (response) {
									if (angular.isArray(response.data)) {
										var newSteps = [];
										obj.uom = [];
										response.data.forEach(function (uomInfo, uomIndex) {
											var uomModel = obj.uom[uomIndex] = {
												uom: uomInfo.uom
											};
											newSteps.push.apply(newSteps, createUoMSteps(uomInfo, uomIndex, uomModel, 'uom[' + uomIndex + '].'));
										});

										newSteps.push({
											title$tr$: 'model.main.propUoMWizard.completion',
											message$tr$: newSteps.length > 0 ? 'model.main.propUoMWizard.configuredUoMs' : 'model.main.propUoMWizard.noUoMs',
											canFinish: true
										});
										newSteps[0].disallowBack = true;

										platformWizardDialogService.translateWizardSteps(newSteps);
										wzConfig.steps.push.apply(wzConfig.steps, newSteps);
										$timeout(function () {
											info.commands.goToNext();
										});
									}
								});// TODO: handle error?
								break;
						}
					}
				};
				platformWizardDialogService.translateWizardConfig(wzConfig);
				return platformWizardDialogService.showDialog(wzConfig, obj).then(function (data) {
					if (data.success) {
						var changes = {
							modelId: modelId,
							keys: _.map(_.filter(data.data.eligiblePropKeys, function (epk) {
								return epk.isIncluded;
							}), function (epk) {
								return epk.id;
							}),
							uom: [],
							ignoreAssigned: obj.ignoreAssigned
						};
						data.data.uom.forEach(function (uom) {
							if (uom.uomAssignmentMode !== '-') {
								if (uom[uom.uomAssignmentMode]) {
									var assignedData = uom[uom.uomAssignmentMode].uomId;
									if (angular.isObject(assignedData)) {
										var uomObj = {
											uom: uom.uom,
											mode: uom.uomAssignmentMode,
											uomIds: []
										};
										Object.getOwnPropertyNames(assignedData).forEach(function (item) {
											uomObj.uomIds.push({
												destId: parseInt(item, 10),
												uomId: assignedData[item]
											});
										});
										changes.uom.push(uomObj);
									}
								}
							}
						});
						$http.post(globals.webApiBaseUrl + 'model/main/property/assignpropertyuoms', changes);
					}
				});
			};

			return service;
		}]);
})(angular);
