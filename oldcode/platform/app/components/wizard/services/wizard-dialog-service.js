/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformWizardDialogService
	 * @function
	 *
	 * @description Displays a dialog box that shows content in various subsequent steps.
	 */
	angular.module('platform').factory('platformWizardDialogService', ['_', 'platformDialogService',
		'platformTranslateService', '$translate',
		function (_, platformDialogService, platformTranslateService, $translate) {
			const service = {};

			let nextWizardId = 1;

			/**
			 * @ngdoc function
			 * @name showDialog
			 * @function
			 * @methodOf platformWizardDialogService
			 * @description Shows a wizard dialog.
			 * @param {Object} wizardConfig An object containing a definition of the content of the wizard.
			 * @param {Object} entity The object being edited in the wizard.
			 * @return {Promise<Object>} A promise that will be resolved when the dialog box has closed. The object
			 *                           will have a boolean `success` property and a `data` property.
			 */
			service.showDialog = function (wizardConfig, entity) {
				const dlgConfig = _.assign({
					width: '60%',
					minWidth: '700px',
					bodyMarginLarge: true,
					resizeable: true
				}, wizardConfig, {
					templateUrl: globals.appBaseUrl + 'app/components/wizard/partials/wizard-dialog-template.html',
					value: {
						wizard: wizardConfig,
						entity: entity,
						wizardName: 'wzdlg' + nextWizardId++
					}
				});

				return platformDialogService.showDialog(dlgConfig).then(function (result) {
					return {
						success: !!result,
						data: entity
					};
				});
			};

			/**
			 * @ngdoc function
			 * @name translateWizardConfig
			 * @function
			 * @methodOf platformWizardDialogService
			 * @description Translates any localizeable properties of a wizard configuration object.
			 * @param {Object} wizardConfig An object containing a definition of the content of a wizard.
			 */
			service.translateWizardConfig = function (wizardConfig) {
				platformTranslateService.translateObject(wizardConfig, 'title');
				service.translateWizardSteps(wizardConfig.steps);
			};

			/**
			 * @ngdoc function
			 * @name translateWizardSteps
			 * @function
			 * @methodOf platformWizardDialogService
			 * @description Translates any localizeable properties of a set of wizard step definitions.
			 * @param {Array<Object>} steps An array of wizard step definitions.
			 */
			service.translateWizardSteps = function (steps) {
				steps.forEach(function (step) {
					platformTranslateService.translateObject(step, ['title', 'loadingMessage', 'message', 'topDescription', 'bottomDescription']);
					if (step.form) {
						platformTranslateService.translateFormConfig(step.form);
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name createListStep
			 * @function
			 * @methodOf platformWizardDialogService
			 * @description Creates a wizard step that consists of a list (by using the
			 *              {@see platformWizardSelectionList} directive).
			 * @param {String|Object} titleOrConfig The (translated) step title, or an object with all configuration
			 *                                      settings for the step.
			 * @param {String} topDescription The (translated) step description shown on top of the step.
			 * @param {String} model The name of the property that serves as the model for the list.
			 * @param {String} stepId Optionally, an ID to identify the step.
			 * @return {Object} The step definition that can directly be appended to a wizard. By default,
			 *                  `disallowNext` is set to `true`.
			 */
			service.createListStep = function (titleOrConfig, topDescription, model, stepId) {
				const stepConfig = _.isString(titleOrConfig) ? {
					title: titleOrConfig,
					topDescription: topDescription,
					model: model,
					stepId: stepId,
					requireSelection: true,
					suppressFilter: false
				} : (_.isObject(titleOrConfig) ? _.clone(titleOrConfig) : null);

				if (!_.isObject(stepConfig)) {
					throw new Error('No step configuration found.');
				}

				if (!_.isInteger(stepConfig.height)) {
					stepConfig.height = 250;
				}

				const result = {
					title: stepConfig.title,
					topDescription: stepConfig.topDescription,
					height: stepConfig.height,
					form: {
						fid: 'platform.wizard.list',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'list',
							type: 'directive',
							directive: 'platform-wizard-selection-list',
							model: stepConfig.model,
							sortOrder: 20,
							cssClass: 'form-grid-container'
						}]
					},
					disallowNext: Boolean(stepConfig.requireSelection),
					topButtons: _.isArray(stepConfig.topButtons) ? stepConfig.topButtons : null
				};
				if (stepConfig.suppressFilter !== true) {
					if (stepConfig.useSearchButton === true && !_.isNil(stepConfig.searchDirective)) {
						result.form.rows.push(
							{
								gid: 'default',
								rid: 'filter',
								type: 'directive',
								model: stepConfig.model + '.__filterText',
								directive: stepConfig.searchDirective,
								sortOrder: 1
							}
						);
					} else {
						result.form.rows.push({
							gid: 'default',
							rid: 'filter',
							type: 'description',
							model: stepConfig.model + '.__filterText',
							placeholder: $translate.instant('platform.wizard.listFilter'),
							sortOrder: 10
						});
					}
				}
				result.watches = [{
					expression: stepConfig.model + '.__filterText',
					fn: function (info) {
						let filterText = _.get(info.model, stepConfig.model + '.__filterText');
						if (filterText) {
							filterText = filterText.toLowerCase();
							if (!_.get(info.model, stepConfig.model + '.__unfilteredItems')) {
								_.set(info.model, stepConfig.model + '.__unfilteredItems', _.get(info.model, stepConfig.model + '.items').slice(0));
							}

							const customItemFilter = angular.isFunction(_.get(info.model, stepConfig.model + '.filterItem')) ? _.get(info.model, stepConfig.model + '.filterItem') : null;

							const items = _.filter(_.get(info.model, stepConfig.model + '.__unfilteredItems'), function (item) {
								if (customItemFilter) {
									return customItemFilter(item, filterText);
								} else {
									let isMatch = false;
									const props = Object.keys(item);
									for (let i = 0; i < props.length; i++) {
										const propValue = item[props[i]];
										if (angular.isString(propValue) || angular.isNumber(propValue)) {
											if ((propValue + '').toLowerCase().includes(filterText)) {
												isMatch = true;
												break;
											}
										}
									}
									return isMatch;
								}
							});
							_.set(info.model, stepConfig.model + '.items', items);

						} else {
							if (_.get(info.model, stepConfig.model + '.__unfilteredItems')) {
								_.set(info.model, stepConfig.model + '.items', _.get(info.model, stepConfig.model + '.__unfilteredItems'));
							}
						}
					}
				}];

				if (stepConfig.requireSelection) {
					result.watches.push({
						expression: stepConfig.model + '.selectedId',
						fn: function (info) {
							if (_.get(info.model, stepConfig.model + '.selectionListConfig.multiSelect')) {
								result.disallowNext = _.isEmpty(info.newValue) || (_.isFunction(stepConfig.acceptsId) ? !stepConfig.acceptsId(info.newValue) : false);
							} else {
								result.disallowNext = !info.newValue || (_.isFunction(stepConfig.acceptsId) ? !stepConfig.acceptsId(info.newValue) : false);
							}
						}
					});
				}

				if (stepConfig.stepId) {
					result.id = stepConfig.stepId;
				}
				return result;
			};

			/**
			 * @ngdoc function
			 * @name insertWizard
			 * @function
			 * @methodOf platformWizardDialogService
			 * @description Inserts the pages from one wizard into another wizard.
			 * @param {Object} subWizard The wizard to insert.
			 * @param {Object} mainWizard The destination wizard into which `subWizard` will be inserted.
			 * @param {String | Number} at Optionally, an insertion point. This can be a zero-based index at which to
			 *                             insert `subWizard`, or a step ID *in front of* which `subWizard` will be
			 *                             inserted. If this argument is not specified, `subWizard` will be appended
			 *                             to the end of `mainWizard`.
			 * @throws {Error} if `at` is defined, not a number, and does not denote a step in `mainWizard`.
			 */
			service.insertWizard = function (subWizard, mainWizard, at) {
				function integrateEvent(eventName) {
					if (subWizard[eventName]) {
						if (!angular.isArray(mainWizard[eventName])) {
							if (mainWizard[eventName]) {
								mainWizard[eventName] = [mainWizard[eventName]];
							} else {
								mainWizard[eventName] = [];
							}
						}
						mainWizard[eventName] = mainWizard[eventName].concat(subWizard[eventName]);
					}
				}

				let insertionIndex;
				if (angular.isNumber(at)) {
					insertionIndex = at;
				} else if (!_.isNil(at)) {
					insertionIndex = _.findIndex(mainWizard.steps, function (step) {
						return step.id === at;
					});
					if (insertionIndex < 0) {
						throw new Error('Step ID not found: ' + at);
					}
				} else {
					insertionIndex = mainWizard.steps.length;
				}

				if (!mainWizard.steps) {
					mainWizard.steps = [];
				}
				mainWizard.steps.splice.apply(mainWizard.steps, [insertionIndex, 0].concat(subWizard.steps));

				if (subWizard.watches) {
					if (!mainWizard.watches) {
						mainWizard.watches = [];
					}
					mainWizard.watches = mainWizard.watches.concat(subWizard.watches);
				}

				integrateEvent('onChangeStep');
				integrateEvent('onStepChanging');
			};

			/**
			 * @ngdoc function
			 * @name removeSteps
			 * @function
			 * @methodOf platformWizardDialogService
			 * @description Removes wizard steps by their ID.
			 * @param {Object} wizard A wizard configuration object.
			 * @param {...String} stepId Step identifiers to remove.
			 */
			service.removeSteps = function (wizard) {
				for (let i = 1; i < arguments.length; i++) {
					const stepIdx = _.findIndex(wizard.steps, {id: arguments[i]});
					if (stepIdx >= 0) {
						wizard.steps.splice(stepIdx, 1);
					}
				}
			};

			return service;
		}]);
})(angular);
