(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name oneDriveGrid.directive:oneDriveGrid.directive
	 * @description
	 * # oneDriveGrid.directive
	 */
	var moduleName = 'cloud.desktop';
	angular.module(moduleName).directive('cloudDesktopOneDriveGrid', platformGrid);

	var _currentEditor;
	var _registerUpdateRequested;

	/* jslint latedef:false */
	function platformGrid() {
		var _platformGridAPI;

		return {
			restrict: 'EA',
			replace: true,
			scope: {
				data: '='
			},
			template: '<div class="platformgrid grid-container"></div>',
			controller: ['$scope', '$element', '$compile', '$rootScope', '$timeout', '$translate', 'platformGridAPI',
				'_', 'platformGridDomainService', 'platformObjectHelper', 'platformTranslateService', 'mainViewService',
				'$injector', 'platformRuntimeDataService', 'platformDomainService', 'platformPermissionService', '$log', PlatformGridController],
			controllerAs: 'vm',
			link: linkFn
		};

		function PlatformGridController($scope, $element, $compile, $rootScope, $timeout, $translate, platformGridAPI, _,
		                                platformGridDomainService, platformObjectHelper, platformTranslateService,
		                                mainViewService, $injector, platformRuntimeDataService,
		                                platformDomainService, platformPermissionService, $log) { // jshint ignore:line
			var vm = this;
			var readonly;

			_platformGridAPI = platformGridAPI;

			function isContainerReadonly(scope) {
				var containerScope = scope.$parent;

				while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
					containerScope = containerScope.$parent;
				}

				return containerScope ? !platformPermissionService.hasWrite(mainViewService.getPermission(containerScope.getContainerUUID())) : false;
			}

			/**
			 * Process the column definition and create the grid
			 */
			vm.init = function (element) {
				var grid = platformGridAPI.grids.element('id', $scope.data.state);

				readonly = grid.options.skipPermissionCheck ? false : isContainerReadonly($scope);

				var type;

				if (element.parents('.subview-content').length > 0) {
					type = platformGridAPI.$$containerType.subview;
				} else if (element.parents('#grid-config').length > 0) {
					type = platformGridAPI.$$containerType.configurator;
				} else {
					type = platformGridAPI.$$containerType.other;
				}

				Object.defineProperty(grid, '$$containerType', {
					writeable: false,
					value: type
				});

				// register processColumns to grid instance
				grid.processColumns = processColumns;

				// save scope in grid for editors
				grid.scope = $scope;

				if (!grid) {
					if ($scope.data.config) {
						platformGridAPI.grids.config($scope.data.config);
						grid = platformGridAPI.grids.element('id', $scope.data.state);
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
					grid.domElem = $element;

					platformGridAPI.grids.register(grid);
					angular.element(element).addClass(grid.options.iconClass);
				}

				if ($scope.data.config && $scope.data.config.gridDataPath) {
					$scope.$watchCollection('data.' + $scope.data.config.gridDataPath, function (newValue) {
						if (newValue) {
							platformGridAPI.items.data($scope.data.state, newValue);
						}
					});
				}

				platformGridAPI.grids.resize($scope.data.state);

				grid = null;
			};

			vm.filterHandling = function () {

				var grid = platformGridAPI.grids.element('id', $scope.data.state);

				if (!grid) {
					return;
				}
				if (!grid.instance) {
					$timeout(function () {
						vm.filterHandling();
					}, 0, true);
				} else {
					$('body')
						.append('<div class="' +
							'filterPanel ' + $scope.data.state + '" style="display: none;"><input type="text" placeholder="' + $translate.instant('platform.searchPanelString') + '" class="filterinput form-control ' + $scope.data.state + '"></div>');

					$('.filterPanel.' + $scope.data.state)
						.appendTo(grid.instance.getMainTopPanel())
						.show();

					var delay = (function () {
						var timer = 0;
						return function (callback, ms) {
							$timeout.cancel(timer);
							timer = $timeout(callback, ms, true);
						};
					})();

					$('.filterinput.' + $scope.data.state).keyup(function (e) {
						var ele = this;
						delay(function () {
							platformGridAPI.grids.cancelEdit($scope.data.state);
							// clear on Esc
							if (e.which === 27) {
								ele.value = '';
							}
							platformGridAPI.filters.updateFilter($scope.data.state, ele.value, ele);
						}, 250);
					});

					grid = null;
				}
			};

			/**
			 * Unregister the grid
			 */
			vm.destroyGrid = function () {
				if ($scope.data && $scope.data.state) {
					platformGridAPI.grids.unregister($scope.data.state);
				}
			};

			/**
			 * Detach grid from the DOM and save it in the _grids Array of the platformGridAPI
			 */
			vm.saveGrid = function () {
				var grid = platformGridAPI.grids.element('id', $scope.data.state);

				if (grid) {
					var tag = angular.element.find('.' + grid.id);

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
				var grid = platformGridAPI.grids.element('id', $scope.data.state);

				elem.replaceWith($compile(grid.domElem[0])($scope.$parent));
				platformGridAPI.columns.configuration($scope.data.state, false, true);
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
			function treeFormatter(row, cell, value, columnDef, dataContext) {
				var container = $('<div>'); // .addClass('spanContainer');
				var spacer = $('<span>').css({'display': 'inline-block', 'height': '12px'})
					.css('width', function () {
						return (15 * dataContext.nodeInfo.level) + 'px';
					});

				var toggle = $('<span>').css({
					'display': 'inline-block',
					'vertical-align': 'middle'
				}).addClass('control-icons tree-toggle');

				container.append(spacer);
				container.append(toggle);

				if (dataContext.nodeInfo.children) {
					toggle.addClass('toggle');
					if (dataContext.nodeInfo.collapsed) {
						toggle.removeClass('ico-tree-expand');
						toggle.addClass('ico-tree-collapse');
					} else {
						toggle.addClass('ico-tree-expand');
						toggle.removeClass('ico-tree-collapse');
					}
				}

				var image = dataContext.image || 'ico-folder-empty';

				if (image.substring(0, 4) === 'ico-') {
					image = 'control-icons ' + image;
				}

				var iconBox = $('<i>').addClass('block-image ' + image);

				container.append(iconBox);

				if (columnDef.showDescription && (dataContext.description || dataContext.Description || dataContext.DescriptionInfo)) {
					var descriptionText = dataContext.description || dataContext.Description || dataContext.DescriptionInfo.Description;
					var description = $('<span>');
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
			function indicatorFormatter(row, cell, value) {
				return value || ' ';
			}

			/**
			 * @name indicatorFormatter
			 * @description formatter for indicator column
			 */
			function dynamicFormatter(row, cell, value, column, item, plainText, uniqueId) { // jshint ignore: line
				var result;
				var domainOrFormatter = column.domain(item, column, false);
				if (_.isFunction(domainOrFormatter)) {
					result = domainOrFormatter(row, cell, value, column, item, plainText, uniqueId);
				} else {
					var css = platformGridDomainService.alignmentCssClass(domainOrFormatter);
					result = platformGridDomainService.formatter(domainOrFormatter)(row, cell, value, column, item, plainText, uniqueId);

					if (css) {
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
					var domain = _.isFunction(column.domain) ? column.domain(item, column, true) : column.editor;
					var markup = platformGridDomainService.editorTemplate(domain);
					var placeholder = 'data-entity="entity" data-model="value" data-domain="' + domain + '" data-cssclass="grid-control"';
					var directive = column.editorOptions ? (column.editorOptions.directive || column.editorOptions.lookupDirective || 'directive-undefined') : 'directive-undefined';

					markup = markup
						.replace(/\$\$placeholder\$\$/g, placeholder)
						.replace(/\$\$directive\$\$/g, directive);

					return markup;
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
					var domain = _.isFunction(column.domain) ? column.domain(item, column, true) : column.domain;
					var info = platformGridDomainService.domainInfo(domain);

					return info && info.model ? '.' + info.model : '';
				}
			}

			if (!_registerUpdateRequested) {
				_registerUpdateRequested = true;

				$rootScope.$on('updateRequested', function (e, forceCommit) {
					if (_currentEditor && _currentEditor.isValueChanged() || _currentEditor && forceCommit) {
						var lock = _currentEditor && _currentEditor.grid && _currentEditor.grid.instance && _currentEditor.grid.instance.getEditorLock();

						if (lock) {
							lock.commitCurrentEdit();
						}
					}
				});
			}

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
				var editorCreator = function (args) { // jshint ignore:line
					var input;
					var pendingValidation;
					var container;
					var scope;
					var field;

					_currentEditor = this;
					this.grid = grid;

					this.init = function () {
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

						var unwatch = scope.$watch('entity.' + field, function (newValue) {
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

					this.loadValue = function (item) {
						scope.initialValue = scope.value = platformObjectHelper.getValue(item, field);
						scope.entity = item;

						apply(function () {
							if (scope && !scope.$$phase) {
								scope.$digest();
							}

							var elem = angular.element(container[0].childNodes[0]);

							if (elem.is(':focusable')) {
								elem.focus().select();
							} else {
								elem = elem.find(':input,:button,:checkbox,:radio,[tabindex]').filter(':visible');

								if (elem && elem.length) {
									$(elem[0]).focus().select();
								}
							}
						});
					};

					this.serializeValue = function () {
						return _.isUndefined(scope.value) ? null : scope.value;
					};

					this.applyValue = function (item, value) {
						var isAsync = false;
						var result = {
							apply: true,
							valid: true
						};

						if (args.column.validator) {
							result = args.column.validator ? args.column.validator(item, value, field) : true;
							result = platformRuntimeDataService.applyValidationResult(result, item, field);
						}

						if (result.valid && args.column.asyncValidator) {
							pendingValidation.appendTo(container);
							container.addClass('pending-validation');

							isAsync = args.column.asyncValidator(item, value, field, args.column.formatterOptions)
								.then(function (result) {
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

										apply(function () {
											$rootScope.$apply();
										});
									}

									container.removeClass('pending-validation');
									container.empty();
									container[0].innerHTML = args.column.formatter(0, 0, value, args.column, item);

									return result;
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

								apply(function () {
									$rootScope.$apply();
								});
							}
						}

						return isAsync;
					};

					this.isValueChanged = function () {
						// scope can be null because this function is called within a async process
						if (scope) {
							// special handling for translation properties, getValue supplies translation object where Translated is edit field
							if (args.column.domain && args.column.domain === 'translation') {
								var result = (platformObjectHelper.getValue(args.item, args.column.field)).Translated !== scope.value;

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
				 * eg. {
				 *		id: 'configurationDescription', field: 'PrcHeaderEntity.ConfigurationFk',
				 *			name: $translate.instant('procurement.requisition.REQHEADER_PRCCONFIGURATION'),
				 *			editorOptions:
				 *			{
				 *				lookupDirective: 'prc-req-configuration-combobox',
				 *				lookupOptions: { showClearButton: true }
				 *			}
				 *		}
				 *********************************************************************************************
				 */
				var editorCreator = function lookupEditor(args) { // jshint ignore:line
					var self = this;
					var scope = null;
					var column = args.column;
					var editorOptions = column.editorOptions;
					var lookupOptions = editorOptions.lookupOptions;
					var pendingValidation;
					var container;
					var field = args.column.field + bindToModel(args.column, args.item);

					_currentEditor = this;
					this.grid = grid;

					this.init = function () {
						scope = grid.scope.$new();

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

						var unwatch = scope.$watch('entity.' + field, function (newValue) {
							if (scope.initialValue === scope.value) {
								if (!_.isUndefined(newValue) && scope.value !== newValue) {
									scope.value = newValue;
									unwatch();
								}
							} else {
								unwatch();
							}
						});

						var toPromise = $timeout(function () {
							if (scope) {
								$(args.container).append($compile(markup ? markup : editorMarkup(args.column, args.item))(scope));
								self.focus();
							}
							$timeout.cancel(toPromise);
						}, 0);
					};

					this.destroy = function () {
						$(args.container).empty();
						scope.$destroy();
						scope = null;
						self = null;
					};

					this.focus = function () {
						var elem = $($(args.container)[0].childNodes[0]);

						if (elem.is(':focusable')) {
							elem.focus().select();
						} else {
							elem = elem.find(':input,:button,:checkbox,:radio,[tabindex]').filter(':visible');

							if (elem && elem.length) {
								$(elem[0]).focus().select();
							}
						}
					};

					this.serializeValue = function () {
						return angular.isUndefined(scope.value) ? null : scope.value;
					};

					this.applyValue = function (item, value) {
						var field = args.column.field;
						var isAsync = false;
						var result = {
							apply: true,
							valid: true
						};

						if (args.column.validator) {
							result = args.column.validator ? args.column.validator(item, value, field) : true;
							result = platformRuntimeDataService.applyValidationResult(result, item, field);
						}

						if (result.valid && args.column.asyncValidator) {
							var cellNode = args.grid.getActiveCellNode();
							pendingValidation.appendTo(cellNode);
							$(cellNode).addClass('pending-validation');

							isAsync = args.column.asyncValidator(item, value, field, args.column.formatterOptions)
								.then(function (result) {
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
									}

									$(cellNode).removeClass('pending-validation');
									container.empty();
									container[0].innerHTML = args.column.formatter(0, 0, value, args.column, item);

									return result;
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
						}

						return isAsync;
					};

					this.loadValue = function (item) {
						var setValue = function () {
							scope.initialValue = scope.value = platformObjectHelper.getValue(item, args.column.field);
						};

						$rootScope.safeApply(setValue);
					};

					this.isValueChanged = function () {
						if (scope) {
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
				var visible = [];
				var hidden = [];

				if (grid.options.tree && _.isUndefined(_.find(grid.columns, {id: 'tree'}))) {
					var config = {
						id: 'tree',
						name: 'Structure',
						name$tr$: 'platform.gridTreeHeader',
						toolTip: 'Structure',
						toolTip$tr$: 'platform.gridTreeHeader',
						field: 'tree',
						width: 150,
						minWidth: 40,
						resizable: true,
						sortable: false,
						formatter: 'tree',
						pinned: true,
						showDescription: grid.options.showDescription
					};

					platformTranslateService.translateGridConfig(config);

					if (grid.columns && grid.columns.length && grid.columns[0].id === 'marker') {
						grid.columns.splice(1, 0, config);
					} else {
						grid.columns.unshift(config);
					}

				}

				if (grid.options.marker && _.isUndefined(_.find(grid.columns, {id: 'marker'}))) {
					var markerConfig = {
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
							multiSelect: !!grid.options.marker.multiSelect
						}
					};

					platformTranslateService.translateGridConfig(markerConfig);

					grid.columns.unshift(markerConfig);
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
							pinned: true
						}
					);
				}

				var columns = grid.columns;

				_.each(columns, function (column, i, element) { // jshint ignore:line

					column.displayName = column.name; // added due to the implementation of userLabel alm#137553, 137554

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
						var domain = column.formatter;
						var css = platformGridDomainService.alignmentCssClass(domain);

						if (!_.isFunction(column.domain)) {
							column.domain = domain;
						}

						column.formatter$name = domain;
						column.formatter = format(domain, grid);
						column.cssClass = column.cssClass ? column.cssClass + ' ' + css : css;

						if (_.isUndefined(column.searchable)) {
							column.searchable = platformGridDomainService.isSearchable(domain);
						}

						var data = platformDomainService.loadDomain(domain);

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

					if (column.grouping && !_.isObject(column.grouping)) {
						$log.error('grouping must be configured by using an object | column:', column);
					}

					// if (!column.formatter$name) {
					//	$log.warn('A domain type must be used for formatter | column:', column);
					// }

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
					var name = validator + '$name';

					if (column.hasOwnProperty(name)) {
						if (column[name].indexOf('.') !== -1) {
							var fields = column[name].split('.');
							var obj = $scope.$parent[fields[0]] || $injector.get(fields[0]);

							if (obj) {
								fields.shift();
								column[validator] = platformObjectHelper.getValue(obj, fields);
							}
						} else {
							column[validator] = $scope.$parent[column[name]];
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

		function linkFn(scope, element) {
			var timerId;

			if (_platformGridAPI.grids.lazyLoad(scope.data.state)) {
				timerId = setTimeout(function () {
					scope.vm.init(element);
					scope.vm.filterHandling();
				}, 50);
			} else {
				scope.vm.init(element);
				scope.vm.filterHandling();
			}

			// !!!important. do not destory when state change.
			// // save/detach grid on state change
			// scope.$on('$stateChangeStart', function () {
			// 	scope.vm.destroyGrid(element);
			// });

			// save/detach grid when tabbed container is used
			scope.$on('$destroy', function () {
				clearTimeout(timerId);
				scope.vm.destroyGrid(element);
			});
		}
	}
})();
