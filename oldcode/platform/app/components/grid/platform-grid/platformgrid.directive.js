(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformGrid.directive:platformGrid.directive
	 * @description
	 * # platformGrid.directive
	 */
	angular.module('platform').directive('platformGrid', platformGrid);

	let _currentEditor;

	/* jslint latedef:false */
	platformGrid.$inject = ['$timeout', '_'];

	function platformGrid($timeout, _) {
		let _platformGridAPI;

		platformGridController.$inject = ['$scope', '$element', '$compile', '$rootScope', '$timeout', '$translate', 'platformGridAPI', '_',
			'platformGridDomainService', 'platformGridFilterService', 'platformObjectHelper', 'platformTranslateService', 'mainViewService',
			'$injector', 'platformRuntimeDataService', 'platformDomainService', 'platformPermissionService', '$log', 'platformDataValidationService', '$q',
			'$sanitize', '$', 'platformFastRecordingInputHandlerService', 'keyCodes'];

		// noinspection OverlyComplexFunctionJS
		function platformGridController($scope, $element, $compile, $rootScope, $timeout, $translate, platformGridAPI, _,
			platformGridDomainService, platformGridFilterService, platformObjectHelper, platformTranslateService, mainViewService,
			$injector, platformRuntimeDataService, platformDomainService, platformPermissionService, $log, platformDataValidationService, $q,
			$sanitize, $, platformFastRecordingInputHandlerService, keyCodes) { // jshint ignore:line
			let vm = this;
			let readonly;
			let scope = $scope;
			let element = $element;
			let unregister = [];
			let filterTimeout;

			_platformGridAPI = platformGridAPI;

			// cleanup handlers
			unregister.push(scope.$on('$destroy', () => {
				_.over(unregister)();
				clearTimeout(filterTimeout);
				unregister = null;
				// delay unset of element + scope to be available for other $destroy handlers
				$timeout(function () {
					scope = element = null;
				});
			}));

			unregister.push($rootScope.$on('permission-service:changed', () => {
				const grid = platformGridAPI.grids.element('id', scope.data.state);

				if (grid && grid.columns && grid.columns.visible) {
					readonly = grid.options.skipPermissionCheck ? false : isContainerReadonly(scope);
					const column = grid.columns.visible.find(column => !!column.editor$name);

					if (column) {
						if (readonly && column.editor) {
							const removeEditor = column => column.editor = null;

							grid.columns.visible.forEach(removeEditor);
							grid.columns.hidden.forEach(removeEditor);
							grid.columns.current.forEach(removeEditor);

							grid.instance.setColumns(grid.columns.visible);
						} else if (!readonly && !column.editor && column.editor$name) {
							const assignEditor = column => {
								column.editor = column.editor$name;
								column.editor = editor(column, grid);
							};

							grid.columns.visible.forEach(assignEditor);
							grid.columns.hidden.forEach(assignEditor);
							grid.columns.current.forEach(assignEditor);

							grid.instance.setColumns(grid.columns.visible);
						}
					}
				}
			}));

			function isContainerReadonly(scope) {
				let containerScope = scope.$parent;

				while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
					containerScope = containerScope.$parent;
				}

				return containerScope ? !platformPermissionService.hasWrite(mainViewService.getPermission(containerScope.getContainerUUID())) : false;
			}

			/**
			 * Process the column definition and create the grid
			 */
			vm.init = function (element) {
				let grid = platformGridAPI.grids.element('id', scope.data.state);

				readonly = grid.options.skipPermissionCheck ? false : isContainerReadonly(scope);

				let type;

				if (element.parents('.subview-content').length > 0) {
					type = platformGridAPI.$$containerType.subview;
				} else if (element.parents('#grid-config').length > 0) {
					type = platformGridAPI.$$containerType.configurator;
				} else {
					type = platformGridAPI.$$containerType.other;
					// if grid is not in a subview-content, then disable copy paste function
					grid.options.enableCopyPasteExcel = false;
				}

				Object.defineProperty(grid, '$$containerType', {
					writeable: false,
					value: type
				});

				// register processColumns to grid instance
				grid.processColumns = processColumns;

				// save scope in grid for editors
				grid.scope = scope;

				if (!grid) {
					if (scope.data.config) {
						platformGridAPI.grids.config(scope.data.config);
						grid = platformGridAPI.grids.element('id', scope.data.state);
					}

					if (!grid) {
						throw new Error('No Data from the controller');
					}
				}

				if (grid.domElem) {
					updateValidator(grid);
					vm.loadGrid(element);
				} else {
					element.addClass(grid.id + ' flex-element');
					element.attr('id', grid.id);

					// Think about the handling of the hidden columns.
					// Save the original column definitions or use the current solution.
					grid.columns = processColumns(grid);
					grid.domElem = element;

					platformGridAPI.grids.register(grid);
					angular.element(element).addClass(grid.options.iconClass);
				}

				platformGridAPI.grids.resize(scope.data.state);

				grid = null;
			};

			vm.filterHandling = function () {
				if (scope) {
					let grid = platformGridAPI.grids.element('id', scope.data.state);

					if (!grid) {
						return;
					}
					if (!grid.instance) {
						filterTimeout = setTimeout(function () {
							vm.filterHandling();
						}, 0);
					} else {
						const body = $('body');

						if (body.find('.filterPanel.' + scope.data.state).length < 1) { // to prevent the multiple rendering of the search panel
							body.append('<div class="' + 'filterPanel ' + scope.data.state + '" style="display: none;"><input type="text" value="' + (scope.searchString || '') + '" placeholder="' + $translate.instant('platform.searchPanelString') + '" class="filterinput form-control ' + scope.data.state + '"></div>');
						}

						$('.filterPanel.' + scope.data.state)
							.appendTo(grid.instance.getMainTopPanel())
							.show();

						let delay = (function () {
							let timer = 0;
							return function (callback, ms) {
								$timeout.cancel(timer);
								timer = $timeout(callback, ms, true);
							};
						})();

						let filterInput = $('.filterinput.' + scope.data.state);
						if (filterInput) {
							filterInput
								.keyup(function (e) {
									let ele = this;

									delay(function () {
										if(e.which === keyCodes.DOWN) {
											let grid = platformGridAPI.grids.element('id', scope.data.state);
											if (grid && grid.dataView.getRows().length > 0) {
												grid.instance.setCellFocus(0, 0, false);
											}
										} else {
											// clear on Esc
											if (e.which === keyCodes.ESC) {
												ele.value = '';
											}

											let searchString = ele.value.replace(/[:*?"<>|]/g, '');
											// Handle Parenthesis
											let specialCharacters = ['(', ')', '[', ']'];
											for (let i = 0; i < specialCharacters.length; i++) {
												searchString = searchString.replace(specialCharacters[i], '\\' + specialCharacters[i]);
											}
											scope.searchString = $sanitize(searchString);

											let filterInput = document.activeElement;
											platformGridAPI.filters.updateFilter(scope.data.state, scope.searchString, filterInput);
											platformGridAPI.grids.onColumnStateChanged(scope.data.state);
										}
									}, 500);
								});

							unregister.push(function () {
								filterInput.off('keyup');
							});
						}

						if (platformGridAPI.grids.renderHeaderRow(scope.data.state) && !angular.isUndefined(scope.columnFilters)) {
							if (scope.showFilterRow) {
								platformGridAPI.filters.generateFilterRow(grid);
							} else {
								platformGridAPI.filters.updateHeaderRowIndicatorIcon(scope.data.state);
							}
						}

						platformGridAPI.grids.itemCountChanged(scope.data.state);
						grid = null;
					}
				}
			};

			/**
			 * Unregister the grid
			 */
			vm.destroyGrid = function () {
				if (scope && scope.data && scope.data.state) {
					platformGridAPI.grids.unregister(scope.data.state);
				}
			};

			/**
			 * Detach grid from the DOM and save it in the _grids Array of the platformGridAPI
			 */
			vm.saveGrid = function () {
				let grid = platformGridAPI.grids.element('id', scope.data.state);

				if (grid) {
					let tag = angular.element.find('.' + grid.id);

					if (tag.length) {
						platformGridAPI.grids.cancelEdit(grid.id);
						grid.domElem = angular.element(tag).detach();
						grid.saved = true;
						grid.scope = null;
						grid.callbacks = null;
						grid = null;
					}
				}
			};

			/**
			 * Loads the grid from the platformGridAPI service and inject it into the DOM
			 * @return {[type]} [description]
			 */
			vm.loadGrid = function (elem) {
				let grid = platformGridAPI.grids.element('id', scope.data.state);

				elem.replaceWith($compile(grid.domElem[0])(scope.$parent));
				platformGridAPI.columns.configuration(scope.data.state, false, true);
				grid.saved = false;
			};

			/**
			 * @name format
			 * @description Creates the formatter methods for the grid
			 * @param  {string} type formatter from the column definition
			 * @return {function}         the generated function
			 */
			function format(type) {
				if (!type) {
					throw new Error('Missing argument');
				}

				/**
				 * Methods body for the tree formatter
				 */
				switch (type) {
					case 'tree':
						return treeFormatter;

					case 'indicator':
						return indicatorFormatter;

					case 'dynamic':
						return dynamicFormatter;

					default:
						return platformGridDomainService.formatter(type);
				}
			}

			/**
			 * @name treeFormatter
			 * @description formatter for tree column
			 */
			function treeFormatter(row, cell, value, columnDef, dataContext, plainText = false) {
				let grid = platformGridAPI.grids.element('id', $scope.data.state);

				if (plainText) {
					if (dataContext.description || dataContext.Description || dataContext.DescriptionInfo) {
						return dataContext.description || dataContext.Description || dataContext.DescriptionInfo.Description;
					}
				}

				let container = $('<div>');

				let toggle = $('<span>').css({
					'display': 'inline-block',
					'vertical-align': 'middle',
					'margin-left': (10 * dataContext.nodeInfo.level) + 'px'
				}).addClass('control-icons tree-toggle');

				container.append(toggle);

				for (let i = 0; i < dataContext.nodeInfo.level; i++) {
					let verticalFormatting = $('<div>').css({'margin-left': (10 * i) + 'px'})
						.addClass('verticalformat')
						.addClass('levelnode');
					if (dataContext.HasChildren || dataContext.nodeInfo.children) {
						verticalFormatting.addClass('toggle');
					}
					verticalFormatting.addClass('level' + i);

					container.append(verticalFormatting);
				}

				if (dataContext.HasChildren || dataContext.nodeInfo.children) {
					toggle.addClass('toggle');
					if (dataContext.nodeInfo.collapsed) {
						toggle.removeClass('ico-tree-expand');
						toggle.addClass('ico-tree-collapse');
					} else {
						toggle.addClass('ico-tree-expand');
						toggle.removeClass('ico-tree-collapse');
					}
				}

				let image = dataContext.image || 'ico-folder-empty';

				if (image.substring(0, 4) === 'ico-') {
					image = 'control-icons ' + image;
				}

				let iconBox = $('<i>').addClass('block-image allow-parent-event ' + image);

				container.append(iconBox);

				let descriptionText = '';
				let description = $('<span>');
				if (grid && grid.options && grid.options.treeColumnDescription) {
					_.forEach(grid.options.treeColumnDescription, function (value) {
						descriptionText = descriptionText + _.get(dataContext, value, '') + ' ';
					});

					description.text(descriptionText);
					description.css('margin-left', '5px');
					container.append(description);
				} else if (columnDef.showDescription && (dataContext.description || dataContext.Description || dataContext.DescriptionInfo)) {
					descriptionText = dataContext.description || dataContext.Description || dataContext.DescriptionInfo.Description;

					description.text(descriptionText);
					description.css('margin-left', '5px');
					container.append(description);
				}

				return container[0].innerHTML;
			}

			/**
			 * @name indicatorFormatter
			 * @description formatter for indicator column
			 */
			function indicatorFormatter() {
				let indicatorFormat = $('<div>').css({'width': '7px',
					'height': '100%',
					'position': 'absolute',
					'top': '0',
					'left': '0'})
					.addClass('indicatorFormat');

				return indicatorFormat[0].outerHTML;
			}

			/**
			 * @name dynamicFormatter
			 * @description formatter for dynamic column
			 */
			function dynamicFormatter(row, cell, value, column, item, plainText, uniqueId) { // jshint ignore: line
				let result;
				let domainOrFormatter = column.domain(item, column, false);
				if (_.isFunction(domainOrFormatter)) {
					result = domainOrFormatter(row, cell, value, column, item, plainText, uniqueId);
				} else {
					let css = platformGridDomainService.alignmentCssClass(domainOrFormatter);
					result = platformGridDomainService.formatter(domainOrFormatter)(row, cell, value, column, item, plainText, uniqueId);

					if (css && !plainText) {
						result = '<div class="' + css + '">' + result + '</div>';
					}
				}

				return result;
			}

			/**
			 * @name apply
			 * @description always call fn in next digest cycle
			 */
			function apply(fn) {
				// must always use $timeout otherwise selection/focus not set correctly
				$timeout(fn, 0);
			}

			/**
			 * @name editorMarkup
			 * @description retrieves the markup used by editors
			 */
			function editorMarkup(column, item) {
				if (!item && _.isFunction(column.domain)) {
					return null;
				} else {
					let domain = _.isFunction(column.domain) ? column.domain(item, column, true) : column.editor;
					if (domain) {
						let markup = platformGridDomainService.editorTemplate(domain);
						let placeholder = 'data-entity="entity" data-model="value" data-domain="' + domain + '" data-cssclass="grid-control"';
						let directive = column.editorOptions ? (column.editorOptions.directive || column.editorOptions.lookupDirective || 'directive-undefined') : 'directive-undefined';

						markup = markup
							.replace(/\$\$placeholder\$\$/g, placeholder)
							.replace(/\$\$directive\$\$/g, directive);

						return markup;
					}
					return null;
				}
			}

			/**
			 * @name bindToModel
			 * @description retrieves the sub property to be used for given column
			 */
			function bindToModel(column, item) {
				if (!item && _.isFunction(column.domain)) {
					return '';
				} else {
					let domain = _.isFunction(column.domain) ? column.domain(item, column, true) : column.domain;
					let info = platformGridDomainService.domainInfo(domain);

					return info && info.model ? '.' + info.model : '';
				}
			}

			// todo: unregister
			unregister.push($rootScope.$on('updateRequested', function (e, forceCommit) {
				if (_currentEditor && _currentEditor.isValueChanged() || _currentEditor && forceCommit) {
					let lock = _currentEditor && _currentEditor.grid && _currentEditor.grid.instance && _currentEditor.grid.instance.getEditorLock();

					if (lock) {
						lock.commitCurrentEdit();
					}
				}
			}));

			/**
			 * @name createDefaultEditor
			 * @description creates the default editor which handles all domain types expect of domain 'lookup'
			 */
			function createDefaultEditor(markup, grid) {
				/**
				 * @name editorCreator
				 * @description  creates an editor
				 * @param  {object} args
				 * @return {object} obj
				 */
				const editorCreator = function defaultEditorCreator(args) { // jshint ignore:line
					let input;
					let pendingValidation;
					let container;
					let scope;
					let field;
					let moduleName = mainViewService.getCurrentModuleName() || 'desktop';

					_currentEditor = this;
					this.grid = grid;

					if (_.isFunction(args.column.domain) && args.column.domain(args.item, args.column, true) === 'lookup' || false) {
						// special handling of dynamic column returning lookup domain
						createLookupEditor(null, grid).call(this, args);
					} else {
						this.init = function () {
							if (!grid.scope) {
								grid.scope = $rootScope;
							}
							scope = grid.scope.$new();
							input = angular.element(markup ? markup : editorMarkup(args.column, args.item));
							field = args.column.field + bindToModel(args.column, args.item);
							container = angular.element(args.container);
							pendingValidation = angular.element('<div class="cell-overlay"><div class="spinner-sm"></div><div class="value-placeholder"></div></div>');
							input.appendTo(args.container);

							scope.entity = args.item;
							scope.initialValue = scope.value = platformObjectHelper.getValue(args.item, field);
							scope.options = args.column.editorOptions;
							scope.config = args.column;

							const unwatch = scope.$watch('entity.' + field, function (newValue) {
								if (scope.initialValue === scope.value) {
									if (!_.isUndefined(newValue) && scope.value !== newValue) {
										scope.value = newValue;
										unwatch();
									}
								} else {
									unwatch();
								}
							});

							$compile(args.container)(scope);
						};

						this.destroy = function () {
							scope.$destroy();
							scope = null;
							$(args.container).empty();
						};

						this.getValue = function () {
							return scope.value;
						};

						this.setValue = function (val) {
							scope.value = val;
						};

						this.loadValue = function (item, setFocus) {
							scope.initialValue = scope.value = platformObjectHelper.getValue(item, field);
							scope.entity = item;

							apply(function () {
								if (scope && !scope.$$phase) {
									scope.$digest();
								}

								if (angular.isUndefined(setFocus)) {
									setFocus = true;
								}

								if (setFocus) {
									if (container[0]) {
										let elem = angular.element(container[0].childNodes[0]);

										if (elem.is(':focusable')) {
											elem.focus().select();
										} else {
											elem = elem.find(':input,:button,:checkbox,:radio,[tabindex]').filter(':visible');

											if (elem && elem.length) {
												$(elem[0]).focus().select();
											}
										}
									}
								}
							});
						};

						this.serializeValue = function () {
							return _.isUndefined(scope.value) ? null : scope.value;
						};

						this.applyValue = function (item, value) {
							// register async call state
							let deferred = $q.defer();
							let callState = platformDataValidationService.registerAsyncCallByModuleName(item, field, value, moduleName, deferred.promise);

							if (args.column.$$resolveValue) {
								return args.column.$$resolveValue(item, value, field)
									.then(function () {
										return validate();
									});
							} else {
								return validate();
							}

							function validate() {
								let result = {
									apply: true,
									valid: true
								};

								function applyValue(result) {
									if (result.apply) {
										if (field.indexOf('.') !== -1) {
											platformObjectHelper.setValue(item, field, value);
										} else {
											item[field] = value;
										}

										if (args.column.$$postApplyValue) {
											args.column.$$postApplyValue(grid, item, args.column);
										}

										apply(function () {
											$rootScope.$apply();
										});
									}

									// unregister async call state
									deferred.resolve(result);
									platformDataValidationService.cleanUpAsyncMarkerByModuleName(callState, moduleName);
								}

								if (args.column.validator) {
									result = args.column.validator ? args.column.validator(item, value, field) : true;
									let model = (result && result.model) ? result.model : field;
									result = platformRuntimeDataService.applyValidationResult(result, item, model);
								}

								if (result.valid && args.column.asyncValidator) {
									pendingValidation.appendTo(container);
									container.addClass('pending-validation');

									return args.column.asyncValidator(item, value, field, args.column.formatterOptions)
										.then(function (result) {
											let model = (result && result.model) ? result.model : field;
											result = platformRuntimeDataService.applyValidationResult(result, item, model);

											applyValue(result);

											container.removeClass('pending-validation');
											container.empty();
											if (container[0]) {
												container[0].innerHTML = args.column.formatter(0, 0, value, args.column, item);
											}

											return result;
										});
								} else {
									applyValue(result);

									return false;
								}
							}
						};

						this.isValueChanged = function () {
							// scope can be null because this function is called within an async process
							if (scope) {
								// special handling for translation properties, getValue supplies translation object where Translated is edit field
								if (args.column.domain && args.column.domain === 'translation') {
									let result = (platformObjectHelper.getValue(args.item, args.column.field)).Translated !== scope.value;

									if (result) {
										platformObjectHelper.setValue(args.item, args.column.field + '.Modified', true);
									}
									return result;
								}

								return !_.isEqual(scope.value, scope.initialValue);
							} else {
								return false;
							}
						};

						this.validate = function () {
							// returns always true to omit slick-grid's "lock" behaviour
							return {
								valid: true,
								msg: null
							};
						};

						this.init();
					}
				};

				return editorCreator;
			}

			/**
			 * @name createLookupEditor
			 * @description creates the editor which handles domain 'lookup'
			 */
			function createLookupEditor(markup, grid) {
				/**
				 * @description: Slick grid lookup editor, it will generates corresponding lookup element
				 * according to arguments('lookupDirective','lookupOptions') transfer from slick grid column definition.
				 *********************************************************************************************
				 * {
				 *	  id: 'configurationDescription', field: 'PrcHeaderEntity.ConfigurationFk',
				 *	  name: $translate.instant('procurement.requisition.REQHEADER_PRCCONFIGURATION'),
				 *	  editorOptions:	{
				 *	    lookupDirective: 'prc-req-configuration-combobox',
				 *	    lookupOptions: { showClearButton: true }
				 *	  }
				 *	}
				 *********************************************************************************************
				 */
				const editorCreator = function lookupEditor(args) { // jshint ignore:line
					let self = this;
					let scope = null;
					const column = args.column;
					const lookupOptions = _.get(column, 'editorOptions.lookupOptions', {});
					let pendingValidation;
					let container;
					const field = args.column.field + bindToModel(args.column, args.item);
					const moduleName = mainViewService.getCurrentModuleName() || 'desktop';
					let asyncLookupResolver;
					let isAsyncValidator = false;
					let isAsyncResolve = false;
					let isFastDataRecording = _.get(column, 'editorOptions.lookupOptions.isFastDataRecording', false);
					const lookupDataServiceName = isFastDataRecording ? _.get(column, 'editorOptions.lookupType') : null;
					const lookupDataService = isFastDataRecording && lookupDataServiceName ? $injector.get(lookupDataServiceName) : null;
					let resolveStringValueCallback = isFastDataRecording ? _.get(lookupDataService, 'resolveStringValue', null) : null;

					const formatterOptions = _.get(column, 'formatterOptions');
					const isSimpleLookup = _.get(formatterOptions, 'lookupSimpleLookup');
					const dataServiceName = _.get(formatterOptions, 'dataServiceName');
					const dataService = $injector.get(!_.isNil(dataServiceName) ? dataServiceName : isSimpleLookup ? 'basicsLookupdataSimpleLookupService' : 'basicsLookupdataLookupDataService');

					if(!isFastDataRecording && dataService.isSupportFastDataRecording) {
						isFastDataRecording = dataService.isSupportFastDataRecording(column);
					}

					if(isFastDataRecording && !resolveStringValueCallback) {
						resolveStringValueCallback = dataService.resolveStringValueCallback ? dataService.resolveStringValueCallback(formatterOptions) : null;
					}

					if(resolveStringValueCallback) {
						console.log('resolveStringValueCallback available:', lookupDataServiceName);
					}

					_currentEditor = this;
					this.grid = grid;

					this.init = function () {
						if (!grid.scope) {
							grid.scope = $rootScope;
						}
						scope = grid.scope.$new();
						scope.isGridEditorScope = true;

						container = angular.element(args.container);
						pendingValidation = angular.element('<div class="cell-overlay"><div class="spinner-sm"></div><div class="value-placeholder"></div></div>');

						self.show();
					};

					this.show = function () {
						// prepare scope environment for lookup directive.
						scope.initialValue = scope.value = platformObjectHelper.getValue(args.item, field);
						scope.entity = args.item;
						scope.options = $.extend({}, lookupOptions);
						scope.config = args.column;

						const unwatch = scope.$watch('entity.' + field, function (newValue) {
							if (scope.initialValue === scope.value) {
								if (!_.isUndefined(newValue) && scope.value !== newValue) {
									scope.value = newValue;
									unwatch();
								}
							} else {
								unwatch();
							}
						});

						$timeout(function () {
							if (scope) {
								scope.options.showDropdown = args.showDropdown;
								$(args.container).append($compile(markup ? markup : editorMarkup(args.column, args.item))(scope));

								$timeout(function() {
									if (self) {
										self.focus();
									}
								});
							}
						});
					};

					this.destroy = function () {
						$(args.container).empty();
						scope.$destroy();
						scope = null;
						self = null;
					};

					this.focus = function () {
						if (args.container[0]) {
							let elem = $($(args.container)[0].childNodes[0]);

							if (elem.is(':focusable')) {
								elem.focus().select();
							} else {
								elem = elem.find(':input,:button,:checkbox,:radio,[tabindex]').filter(':visible');

								if (elem && elem.length) {
									$(elem[0]).focus().select();
								}
							}
						}
					};

					this.serializeValue = function () {
						return angular.isUndefined(scope.value) ? null : scope.value;
					};

					this.applyValue = function (item, value) {
						let field = args.column.field;
						const cellNode = args.grid.getActiveCellNode();
						const deferred = $q.defer();
						const callState = platformDataValidationService.registerAsyncCallByModuleName(item, field, value, moduleName, deferred.promise);
						const initialValue = scope.initialValue;
						const applyValueInternal = (item, value, skipValidation = false) => {
							let result = {
								apply: true,
								valid: true
							};

							if (!skipValidation && args.column.validator) {
								result = args.column.validator ? (args.column.validator(item, value, field) || result) : result;
								result = platformRuntimeDataService.applyValidationResult(result, item, field);
							}

							if (!skipValidation && result.valid && args.column.asyncValidator) {
								isAsyncValidator = true;

								if (!isAsyncResolve) {
									pendingValidation.appendTo(cellNode);
									$(cellNode).addClass('pending-validation');
								}

								return args.column.asyncValidator(item, value, field, args.column.formatterOptions)
									.then(result => {
										if(_.isNil(result)) {
											result = {
												apply: true,
												valid: true
											};
										}

										result = platformRuntimeDataService.applyValidationResult(result, item, field);

										if (result.apply) {
											if (field.indexOf('.') !== -1) {
												platformObjectHelper.setValue(item, field, value);
											} else {
												item[field] = value;
											}

											if (args.column.$$postApplyValue) {
												args.column.$$postApplyValue(grid, item, args.column);
											}

											if (isAsyncValidator || isAsyncResolve) {
												$(cellNode).removeClass('pending-validation');
												container.empty();
												if (container[0]) {
													container[0].innerHTML = args.column.formatter(0, 0, value, args.column, item);
												}

												isAsyncValidator = isAsyncResolve = false;
											}

											apply(() => $rootScope.$apply());

											deferred.resolve(result);
											platformDataValidationService.cleanUpAsyncMarkerByModuleName(callState, moduleName);

											return result;
										}
									});
							} else {
								if (result.apply) {
									if (field.indexOf('.') !== -1) {
										platformObjectHelper.setValue(item, field, value);
									} else {
										item[field] = value;
									}

									if (args.column.$$postApplyValue) {
										args.column.$$postApplyValue(grid, item, args.column);
									}
								}

								deferred.resolve(result);
								platformDataValidationService.cleanUpAsyncMarkerByModuleName(callState, moduleName);

								return null;
							}
						};
						const applyResultInternal = (result) => {
							if(result.valid) {
								platformFastRecordingInputHandlerService.handleInputFound(result, item, result.value, field, moduleName);
								platformRuntimeDataService.applyValidationResult(result, item, field);
								if(initialValue !== result.value) {
									_.set(scope, 'value', result.value);

									return applyValueInternal(item, result.value);
								} else {
									return applyValueInternal(item, result.value, true);
								}
							} else {
								platformFastRecordingInputHandlerService.handleInputNotFound(result, item, result.value, field, moduleName);
								platformRuntimeDataService.applyValidationResult(result, item, field);

								return applyValueInternal(item, result.value, true);
							}
						};

						if (resolveStringValueCallback && _.isString(value)) {
							const result = resolveStringValueCallback(value, {}, item, column);

							if (platformObjectHelper.isPromise(result)) {
								asyncLookupResolver = result;
								isAsyncResolve = true;
								const asynMarker = platformFastRecordingInputHandlerService.registerAsyncEvaluationCall(result, item, value, field, moduleName);

								pendingValidation.appendTo(cellNode);
								$(cellNode).addClass('pending-validation');

								return asyncLookupResolver
									.then(result => {
										applyResultInternal(result);
									}, () => false)
									.finally(() => {
										// remove animation if necessary
										if (isAsyncValidator || isAsyncResolve) {
											$(cellNode).removeClass('pending-validation');
											container.empty();
											if (container[0]) {
												container[0].innerHTML = args.column.formatter(0, 0, platformObjectHelper.getValue(item, field), column, item);
											}
											platformFastRecordingInputHandlerService.unregisterAsyncEvaluationCall(asynMarker, item, moduleName);
										}
									});
							} else {
								applyResultInternal(result);
							}
						} else {
							apply(() => $rootScope.$apply());

							return applyValueInternal(item, value);
						}
					};

					this.loadValue = function (item) {
						$rootScope.safeApply(() => {
							scope.initialValue = scope.value = platformObjectHelper.getValue(item, args.column.field);
						});
					};

					this.isValueChanged = function () {
						if (scope) {
							if (isAsyncResolve || isAsyncValidator || asyncLookupResolver) {
								// async operation in progress
								return false;
							}

							return !_.isEqual(scope.value, scope.initialValue);
						} else {
							return false;
						}
					};

					this.validate = function () {
						return {valid: true, msg: null};
					};

					this.init();
				};

				return editorCreator;
			}

			/**
			 * @name editor
			 * @description Creates the editor methods for the grid
			 * @param  {object} column column definition
			 * @param grid
			 * @return {function}      the generated function
			 */
			function editor(column, grid) {
				if (!readonly) {
					switch (column.editor) {
						case 'lookup':
							return createLookupEditor(editorMarkup(column), grid);

						default:
							return createDefaultEditor(editorMarkup(column), grid);
					}
				} else {
					if (column.editor === 'marker') {
						return createDefaultEditor(editorMarkup(column), grid);
					}
				}

				return null;
			}

			/**
			 * @name processColumns
			 * @description
			 * # Add new Columns for the indicator and tree grid
			 * # Creates the formatter for the slickgrid
			 * # Creates the editors for the slickgrid
			 * # Handles the visible and hidden columns
			 * @param  {object} grid Grid
			 * @return {object}      visible and hidden columns
			 */
			function processColumns(grid) {
				let visible = [];
				let hidden = [];

				if (grid.options.tree && _.isUndefined(_.find(grid.columns, {id: 'tree'}))) {
					let config = {
						id: 'tree',
						name: grid.options.treeHeaderCaption ? grid.options.treeHeaderCaption : 'Structure',
						name$tr$: grid.options.treeHeaderCaption ? grid.options.treeHeaderCaption : 'platform.gridTreeHeader',
						toolTip: grid.options.treeHeaderCaption ? grid.options.treeHeaderCaption : 'Structure',
						toolTip$tr$: grid.options.treeHeaderCaption ? grid.options.treeHeaderCaption : 'platform.gridTreeHeader',
						field: 'tree',
						width: grid.options.treeWidth || 150,
						minWidth: 40,
						resizable: true,
						sortable: false,
						formatter: 'tree',
						pinned: true,
						showDescription: grid.options.showDescription,
						printable: !!grid.options.treePrintable,
						caption: grid.options.treeDescriptionColumns
					};

					platformTranslateService.translateGridConfig(config);

					if (grid.columns && grid.columns.length && (grid.columns[0].id === 'marker' || grid.columns[0].id === 'indicator')) {
						grid.columns.splice(1, 0, config);
					} else {
						grid.columns.unshift(config);
					}
				}

				if (grid.options.marker) {
					let markerConfig = _.find(grid.columns, {id: 'marker'});
					if (_.isUndefined(markerConfig)) {
						markerConfig = {
							id: 'marker',
							name: 'Filter',
							name$tr$: 'platform.gridMarkerHeader',
							toolTip: 'Filter',
							toolTip$tr$: 'platform.gridMarkerHeader',
							field: 'IsMarked',
							width: 40,
							minWidth: 40,
							resizable: true,
							sortable: false,
							formatter: 'marker',
							pinned: true,
							editor: 'marker',
							editorOptions: {
								serviceName: grid.options.marker.serviceName,
								serviceMethod: grid.options.marker.serviceMethod || 'getList',
								multiSelect: !!grid.options.marker.multiSelect,
								idProperty: grid.options.idProperty
							},
							printable: !!grid.options.markerPrintable
						};
						platformTranslateService.translateGridConfig(markerConfig);

						grid.columns.unshift(markerConfig);
					} else {
						markerConfig.editorOptions.idProperty = grid.options.idProperty;
					}
				}

				if (grid.options.indicator === true && _.isUndefined(_.find(grid.columns, {id: 'indicator'}))) {
					grid.columns.unshift(
						{
							id: 'indicator',
							name: '',
							field: 'indicator',
							width: 20,
							minWidth: 20,
							resizable: false,
							sortable: false,
							behavior: 'selectAndMove',
							formatter: 'indicator',
							cssClass: 'indicator dnd',
							pinned: true,
							printable: false
						}
					);
				}

				let indicatorColumns = _.filter(grid.columns, function (col) {
					return col.isIndicator;
				});

				_.each(indicatorColumns, function (column) {
					const index = grid.columns.indexOf(column);
					const element = grid.columns.splice(index, 1)[0];
					grid.columns.splice(1, 0, element);
				});

				let columns = grid.columns;

				_.each(columns, function (column, i, element) { // jshint ignore:line

					column.displayName = column.name;
					if (column.userLabelName || column.labelCode) {
						column.displayName = column.labelCode ? $translate.instant('$userLabel.labelId_' + column.labelCode) : column.userLabelName;
					}

					if (!column.hasOwnProperty('toolTip')) {
						column.toolTip = column.name;

						if (column.name$tr$) {
							column.toolTip$tr$ = column.name$tr$;
						}

						//TODO: "column.name$tr$param" or "column.name$tr$param$"?
						if (column.name$tr$param) {
							column.toolTip$tr$param$ = column.name$tr$param;
						}
					}

					if (column.formatter && !angular.isFunction(column.formatter)) {
						let domain = column.formatter;
						let css = platformGridDomainService.alignmentCssClass(domain);

						if (!_.isFunction(column.domain)) {
							column.domain = domain;
						}

						column.formatter$name = domain;
						column.formatter = format(domain, grid);
						column.cssClass = column.cssClass ? column.cssClass + ' ' + css : css;

						if (_.isUndefined(column.searchable)) {
							column.searchable = platformGridDomainService.isSearchable(domain);
						}

						if (column.domain === 'tree' && column.showDescription) {
							column.searchable = true;
						}

						let data = platformDomainService.loadDomain(domain);

						if (data) {
							if (!column.width) {
								column.width = data && data.defaultWidth ? data.defaultWidth : 100;
							}

							if (_.isUndefined(column.isTransient) && data.isTransient) {
								column.isTransient = true;
							}
						}

						if (platformGridDomainService.isReadonly(domain)) {
							column.editor = null;
						}
					}
					else if (!column.searchable && column.formatter && angular.isFunction(column.formatter) && column.formatterOptions) {
						column.searchable = column.formatterOptions.searchable || false;
					}

					if (column.editor && !_.isFunction(column.editor)) {
						if (platformGridDomainService.hasApplyValueCallback(column.editor)) {
							column.$$postApplyValue = platformGridDomainService.getApplyValueCallback(column.editor);
						}

						column.editor$name = column.editor;
						column.editor = editor(column, grid);
					}

					if (column.validator && !angular.isFunction(column.validator)) {
						column.validator$name = column.validator;
					}
					if (column.asyncValidator && !angular.isFunction(column.asyncValidator)) {
						column.asyncValidator$name = column.asyncValidator;
					}
					resolveValidators(column);

					if (column.exclude) {
						column.hidden = true;
					} else {
						if (column.hidden) {
							hidden.push(element[i]);
						} else {
							visible.push(element[i]);
						}
					}

					if (column.grouping) {
						if (!_.isObject(column.grouping)) {
							$log.error('grouping must be configured by using an object | column:', column);
						} else {
							column.grouping.title = column.name;
						}
					}

					if (column.editor && !column.editor$name) {
						$log.warn('A domain type must be used for editor | column:', column);
					}
				});

				/* origin: angular.copy(columns), */
				return {current: angular.copy(columns), visible: visible, hidden: hidden};
			}

			/**
			 * @name resolveValidators
			 * @description
			 * # updates names validators in given column
			 * @param column {object} column definition
			 */
			function resolveValidators(column) {
				_.each(['validator', 'asyncValidator'], function (validator) {
					let name = validator + '$name';

					if (column.hasOwnProperty(name)) {
						if (column[name].indexOf('.') !== -1) {
							let fields = column[name].split('.');
							let obj = scope.$parent[fields[0]] || $injector.get(fields[0]);

							if (obj) {
								fields.shift();
								column[validator] = platformObjectHelper.getValue(obj, fields);
							}
						} else {
							column[validator] = scope.$parent[column[name]];
						}
					}
				});
			}

			/**
			 * @name updateValidator
			 * @description
			 * # updates names validators in visible and hidden columns
			 * @param  {object} grid Grid
			 */
			function updateValidator(grid) {
				_.each(grid.columns.hidden, resolveValidators);
				_.each(grid.columns.visible, resolveValidators);
			}
		}

		function linkFn($scope, $element) {
			let timerId;
			let unregister = [];
			let scope = $scope;
			let element = $element;

			if (_platformGridAPI.grids.lazyLoad(scope.data.state)) {
				timerId = setTimeout(function () {
					scope.vm.init(element);
					scope.vm.filterHandling();
				}, 50);
			} else {
				scope.vm.init(element);
				scope.vm.filterHandling();
			}

			// save/detach grid on state change
			unregister.push(scope.$on('$stateChangeStart', function () {
				if (scope) {
					_.get(scope, 'vm.destroyGrid', _.noop)(element);
				}
			}));

			// save/detach grid when tabbed container is used
			unregister.push(scope.$on('$destroy', function () {
				clearTimeout(timerId);

				if (scope) {
					_.get(scope, 'vm.destroyGrid', _.noop)(element);
				}

				_.over(unregister)();
				unregister = null;
				// delay unset of element + scope to be available for other $destroy handlers
				$timeout(function () {
					scope = element = null;
				});
			}));
		}

		return {
			restrict: 'EA',
			replace: true,
			scope: {
				data: '='
			},
			template: '<div class="platformgrid grid-container"></div>',
			controller: platformGridController,
			controllerAs: 'vm',
			link: linkFn
		};
	}
})();
