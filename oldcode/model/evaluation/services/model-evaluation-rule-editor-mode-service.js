/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const modelEvaluationModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationRuleEditorModeService
	 * @function
	 *
	 * @description
	 * Manages the available editing modes for rule editors.
	 */
	modelEvaluationModule.factory('modelEvaluationRuleEditorModeService',
		modelEvaluationRuleEditorModeService);

	modelEvaluationRuleEditorModeService.$inject = ['_', 'PlatformMessenger', '$compile', '$q',
		'$translate', 'modelEvaluationEnhancedRuleEditorService', 'platformIconBasisService'];

	function modelEvaluationRuleEditorModeService(_, PlatformMessenger, $compile, $q,
		$translate, modelEvaluationEnhancedRuleEditorService, platformIconBasisService) {

		const service = {};

		const invalidId = '::invalid::';

		const state = {
			modes: [],
			defaultMode: null,
			getDefaultModeId: function () {
				return this.defaultMode ? this.defaultMode.id : invalidId;
			}
		};
		state.modes.byId = {};

		service.registerMode = function (options) {
			if (!options) {
				throw new Error('No options object specified while registering a rule editor mode.');
			}
			if (!options.id) {
				throw new Error('No rule editor mode ID specified.');
			}
			if (!options.html) {
				throw new Error('No html code set.');
			}

			const actualOptions = _.assign({
				isDefault: false,
				iconClass: 'ico-rule-editor-none'
			}, options);

			const mode = {
				id: actualOptions.id,
				createEditor: function (info) {
					const internalEditorData = {
						valueChanged: new PlatformMessenger()
					};

					const internalInfo = _.assign({
						fireValueChanged: function () {
							internalEditorData.valueChanged.fire();
						}
					}, info);

					return (actualOptions.prepareMode ? $q.when(actualOptions.prepareMode(internalInfo)) : $q.when()).then(function (editorInstanceData) {
						const htmlCode = _.isFunction(actualOptions.html) ? actualOptions.html(internalInfo) : actualOptions.html;

						internalEditorData.editorInstanceData = editorInstanceData;
						const internalEditorInfo = _.assign({
							editorInstanceData: editorInstanceData
						}, internalInfo);

						return {
							element: $compile(htmlCode)(info.scope),
							registerValueChanged: function (handler) {
								internalEditorData.valueChanged.register(handler);
							},
							unregisterValueChanged: function (handler) {
								internalEditorData.valueChanged.unregister(handler);
							},
							destroy: function () {
								if (_.isFunction(actualOptions.finalizeMode)) {
									actualOptions.finalizeMode(internalEditorInfo);
								}
							},
							updateSelection: function (editable) {
								if (_.isFunction(actualOptions.updateSelection)) {
									actualOptions.updateSelection(_.assign({
										editable: editable
									}, internalEditorInfo));
								}
							}
						};
					});
				},
				compileElement: function (info) {
					const valueChanged = new PlatformMessenger();

					const internalInfo = _.assign({
						fireValueChanged: function () {
							valueChanged.fire();
						}
					}, info);

					return (actualOptions.prepareMode ? $q.when(actualOptions.prepareMode(internalInfo)) : $q.when()).then(function () {
						const htmlCode = _.isFunction(actualOptions.html) ? actualOptions.html(internalInfo) : actualOptions.html;
						return {
							element: $compile(htmlCode)(info.scope),
							registerValueChanged: function (handler) {
								valueChanged.register(handler);
							},
							unregisterValueChanged: function (handler) {
								valueChanged.unregister(handler);
							}
						};
					});
				},
				cleanEntity: function (entity) {
					if (actualOptions.cleanEntity) {
						actualOptions.cleanEntity(entity);
					}
				},
				entityUsesMode: function (entity) {
					if (actualOptions.entityUsesMode) {
						return actualOptions.entityUsesMode(entity);
					}
				},
				isDefault: actualOptions.isDefault,
				iconClass: actualOptions.iconClass,
				name$tr$: actualOptions.name$tr$,
				name: actualOptions.name,
				getCustomToolItems: function (info) {
					return options.getCustomToolItems ? options.getCustomToolItems(info) : [];
				}
			};

			state.modes.push(mode);
			state.modes.byId[mode.id] = mode;
			if (actualOptions.isDefault) {
				state.defaultMode = mode;
			}
		};

		service.getModeById = function (id) {
			return state.modes.byId[id];
		};

		service.cleanEntity = function (entity, modeId) {
			state.modes.forEach(function (m) {
				if (m.id !== modeId) {
					m.cleanEntity(entity);
				}
			});
		};

		service.determineMode = function (entity) {
			const modeCertainties = _.orderBy(_.filter(_.map(state.modes, function (m) {
				return {
					modeId: m.id,
					certainty: m.entityUsesMode(entity)
				};
			}), function (mInfo) {
				return mInfo.certainty > 0;
			}), 'certainty');

			if (modeCertainties.length > 0) {
				return modeCertainties[modeCertainties.length - 1].modeId;
			} else {
				return state.getDefaultModeId();
			}
		};

		service.generateToolItem = function (config, info) {
			const actualConfig = _.assign({
				id: 'ruleEditorMode',
				customCommandsId: 'customRuleEditorCommands'
			}, config || {});

			const valueChanged = new PlatformMessenger();

			const toggleItems = _.map(state.modes, function (mode) {
				return {
					id: actualConfig.id + '/' + mode.id,
					value: mode.id,
					type: 'radio',
					iconClass: 'tlb-icons ' + mode.iconClass,
					caption: mode.name$tr$ ? $translate.instant(mode.name$tr$) : mode.name,
					fn: function () {
						valueChanged.fire(mode.id);
					},
					disabled: false
				};
			});

			const menuItem = {
				id: actualConfig.id,
				type: 'sublist',
				list: {
					cssClass: 'radio-group',
					showTitles: true,
					activeValue: state.getDefaultModeId(),
					items: toggleItems
				}
			};

			const customCommandsGroupItem = {
				id: actualConfig.customCommandsId,
				type: 'sublist',
				list: {
					showTitles: true,
					items: []
				}
			};
			valueChanged.register(function updateCustomToolItems(newModeId) {
				const newMode = _.find(state.modes, function (m) {
					return m.id === newModeId;
				});

				customCommandsGroupItem.list.items = newMode.getCustomToolItems(info);
			});

			return {
				menuItems: [customCommandsGroupItem, menuItem],
				getSelection: function () {
					return menuItem.list.activeValue === invalidId ? null : menuItem.list.activeValue;
				},
				setSelection: function (modeId) {
					const newMode = _.find(state.modes, function (m) {
						return m.id === modeId;
					});

					menuItem.list.activeValue = newMode ? newMode.id : state.getDefaultModeId();
					valueChanged.fire(this.getSelection());
				},
				registerValueChanged: function (handler) {
					valueChanged.register(handler);
				},
				unregisterValueChanged: function (handler) {
					valueChanged.unregister(handler);
				},
				setEnabled: function (enabled) {
					toggleItems.forEach(function (item) {
						item.disabled = !enabled;
					});
				}
			};
		};

		service.createIconDefinitions = function () {
			return _.map(state.modes, function (m) {
				return platformIconBasisService.createCssIconWithId(m.id, m.name$tr$, 'tlb-icons ' + m.iconClass);
			});
		};

		[{
			id: 'catchAll',
			iconClass: 'ico-rule-editor-catchall',
			html: '<div data-ng-bind="catchAllText"></div>',
			isDefault: true,
			name$tr$: 'model.evaluation.catchAllRule',
			prepareMode: function (info) {
				info.scope.catchAllText = $translate.instant('model.evaluation.catchAllDesc');
			}
		}, modelEvaluationEnhancedRuleEditorService.getDefinition()
		].forEach(function (modeOptions) {
			service.registerMode(modeOptions);
		});

		return service;
	}
})(angular);
