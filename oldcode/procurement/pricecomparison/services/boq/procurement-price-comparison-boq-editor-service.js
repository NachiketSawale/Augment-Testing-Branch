(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonBoqEditorService
	 * @function
	 * @requires $compile
	 *
	 * @description
	 * #  dynamicly initialize editor for cell of dynamic column in boq comparison container.
	 */
	/* jshint -W072 */
	/* jshint -W074 */
	angular.module(moduleName).factory('procurementPriceComparisonBoqEditorService', [
		'$compile', '$rootScope', 'platformGridDomainService', 'platformObjectHelper', 'platformRuntimeDataService', '$timeout', 'procurementPriceComparisonBoqCompareRows',
		function ($compile, $rootScope, platformGridDomainService, platformObjectHelper, platformRuntimeDataService, $timeout, boqCompareRows) {
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

					markup = markup.replace(/\$\$placeholder\$\$/g, placeholder).replace(/\$\$directive\$\$/g, directive);

					//  "<div data-domain-control data-model="value" domain="money" data-entity="entity" data-cssclass="grid-control"></div>"
					return markup;
				}
			}

			/**
			 * @name apply
			 * @description if '$apply' is running, delay to next digest cycle
			 */
			function apply(fn) {
				var phase = $rootScope.$$phase;
				if (phase === '$apply' || phase === '$digest') {
					$timeout(fn);
				} else {
					fn();
				}
			}

			/**
			 * @name createDefaultEditor
			 * @description creates the default editor which handles all domain types expect of domain 'lookup'
			 */
			function createDefaultEditor(markup, args) {
				/**
				 * @name editorCreator
				 * @description  creates an editor
				 * @param  {object} args
				 * @return {object} obj
				 */
				var EditorCreator = function (args) { // jshint ignore:line
					var input;
					var pendingValidation;
					var container;
					var scope;

					this.init = function () {
						// noinspection JSCheckFunctionSignatures
						scope = $rootScope.$new(); // jshint ignore:line
						input = angular.element(markup || editorMarkup(args.column, args.item));
						container = angular.element(args.container);
						pendingValidation = angular.element('<div class="cell-overlay"><div class="spinner-sm"></div><div class="value-placeholder"></div></div>');
						input.appendTo(args.container);

						scope.entity = args.item;
						scope.value = platformObjectHelper.getValue(args.item, args.column.field);
						scope.options = args.column.editorOptions;

						$compile(args.container)(scope);
					};

					this.destroy = function () {
						input.remove();
						scope.$destroy();
					};

					this.getValue = function () {
						return scope.value;
					};

					this.setValue = function (val) {
						scope.value = val;
					};

					this.loadValue = function (item) {
						if (args.column.field.indexOf('.') !== -1) {
							scope.value = platformObjectHelper.getValue(item, args.column.field);
						} else {
							scope.value = item[args.column.field];
						}

						scope.entity = item;

						apply(function () {
							scope.$digest();
							angular.element(container[0].childNodes[0]).focus().select();
						});
					};

					this.serializeValue = function () {
						return _.isUndefined(scope.value) ? null : scope.value;
					};

					this.applyValue = function (item, value) {
						var field = args.column.field;
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

							args.column.asyncValidator(item, value, field)
								.then(function (result) {
									result = platformRuntimeDataService.applyValidationResult(result, item, field);

									if (result.apply) {
										if (field.indexOf('.') !== -1) {
											platformObjectHelper.setValue(item, field, value);
										} else {
											item[field] = value;
										}
									}

									container.removeClass('pending-validation');
									container.empty();
									container[0].innerHTML = args.column.formatter(0, 0, value, args.column, item);
								});
						} else {
							if (result.apply) {
								if (field.indexOf('.') !== -1) {
									platformObjectHelper.setValue(item, field, value);
								} else {
									item[field] = value;
								}
							}
						}
					};

					this.isValueChanged = function () {
						if (args.column.domain && args.column.domain === 'translation' && _.isObject(scope.value)) {
							return scope.value.Modified || false;
						}

						return platformObjectHelper.getValue(args.item, args.column.field) !== scope.value;
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

				return new EditorCreator(args);
			}

			/**
			 *
			 * @param args , has the following fields:
			 * column
			 * container
			 * grid
			 * gridPosition
			 * item
			 * position
			 * cancelChanges()
			 * commitChanges()
			 *
			 * # dynamicly set 'domain' and return editor for for cell of dynamic column in boq comparison container.
			 */
			function createEditor(args) {
				switch (args.item && args.item.rowType) {
					case boqCompareRows.cost:
					case boqCompareRows.unitRateFrom:
					case boqCompareRows.unitRateTo:
					case boqCompareRows.urBreakdown1:
					case boqCompareRows.urBreakdown2:
					case boqCompareRows.urBreakdown3:
					case boqCompareRows.urBreakdown4:
					case boqCompareRows.urBreakdown5:
					case boqCompareRows.urBreakdown6:
					case boqCompareRows.price:
					case boqCompareRows.discount:
					case boqCompareRows.discountPercentIT:
					case boqCompareRows.discountedPrice:
					case boqCompareRows.discountedUnitPrice:
					case boqCompareRows.finalPrice:
						args.column.domain = function () {
							return 'money';
						};
						break;
					case boqCompareRows.rank:
						args.column.domain = function () {
							return 'integer';
						};
						break;
					case boqCompareRows.discountPercent:
					case boqCompareRows.percentage:
						args.column.domain = function () {
							return 'percent';
						};
						break;
				}

				return createDefaultEditor(editorMarkup(args.column, args.item), args);
			}

			// set cell editable or readonly.
			function onCellEditable(args) {
				var editable = false;
				if (args.item && args.item.rowType && !(args.item.rowType === boqCompareRows.rank || args.item.rowType === boqCompareRows.percentage)) {
					editable = true;
				}
				return editable;
			}

			return {
				createEditor: createEditor,
				onCellEditable: onCellEditable
			};
		}
	]);
})(angular);
