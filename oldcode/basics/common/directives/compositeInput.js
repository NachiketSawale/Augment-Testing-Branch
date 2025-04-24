/**
 * Created by chi on 8/13/2015. Implemented by lnb.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:prcConReferenceComposite
	 * @element div
	 * @restrict A
	 * @description
	 * Header composite.
	 *
	 */
	angular.module('basics.common').directive('platformCompositeInput', ['$templateCache', '$compile', '_', '$timeout', 'platformRuntimeDataService', 'platformTranslateService', '$translate',
		function ($templateCache, $compile, _, $timeout, platformRuntimeDataService, platformTranslateService, $translate) {// jshint ignore:line
			return {
				restrict: 'A',
				link: function (scope, elem, attrs) {

					// configures the form
					function configure(compositeConfig) {
						const detailConfig = scope.formOptions.configure;

						function evaluate(scope, expression) {
							let value = scope.$eval(expression);

							while (!value && scope.$parent) {
								value = scope.$eval(expression);
								scope = scope.$parent;
							}

							return value;
						}

						function getTemplate(key) {
							let template = $templateCache.get(key + '.html');
							// As long as both the old and the new controls live in the application just make an additional check
							// to make sure with don't have the control template. this can be removed as soon as the application
							// uses only the new controls
							if (!template) {
								template = $templateCache.get(key + 'ctrl.html');
							}

							if (!template) {
								template = $templateCache.get('domain.html').replace('$$domain$$', key);
							}

							if (!template) {
								throw new Error('Template ' + key + ' not found');
							}

							return template;
						}

						if (_.isString(compositeConfig.validator)) {
							compositeConfig.validator = evaluate(scope, compositeConfig.validator);
						}

						if (_.isString(compositeConfig.asyncValidator)) {
							compositeConfig.asyncValidator = evaluate(scope, compositeConfig.asyncValidator);
						}

						/* if (_.isString(detailConfig.dirty)) {
							compositeConfig.dirty = evaluate(scope, detailConfig.dirty);
						}

						if (_.isString(detailConfig.change)) {
							compositeConfig.change = evaluate(scope, detailConfig.change);
						} */

						const rowContent = [];

						/* jshint -W074 */
						angular.forEach(compositeConfig.options.rows, function (row, rowIndex) {
							row.visible = angular.isDefined(row.visible) ? row.visible : true;
							row.validate = angular.isUndefined(row.validate) ? true : row.validate;

							if (_.isString(detailConfig.dirty)) {
								row.dirty = evaluate(scope, row.dirty);
							}

							if (_.isString(detailConfig.change)) {
								row.change = evaluate(scope, row.change);
							}

							if (row.visible) {
								const rowCss = row.cssLayout + (rowIndex === compositeConfig.options.rows.length - 1 ? ' composite-last-item flex-box' : '');
								let rowTemplate = '<div class=" ' + rowCss + '" style="margin-top: 0;"><label class="platform-form-label" style="padding-right:5px;text-align:right;">{{::$$row$$.userlabel || $$row$$.label}}</label>$$control$$</div>';
								let controlTemplate = getTemplate(row.type);
								const rowBinding = attrs.config + '.options.rows[' + rowIndex + ']'; // different form form
								const isDomainTemplate = controlTemplate.indexOf('data-domain-control') !== -1;
								let label = row.userlabel || row.label;
								const image = row.required ? '<span class="required-cell"></span>' : '';
								if (row.label$tr$) {
									label = $translate.instant(row.label$tr$);
								}
								if (!_.isNil(label)) {
									rowTemplate = rowTemplate.replace('{{::$$row$$.userlabel || $$row$$.label}}', label);
								}
								rowTemplate = rowTemplate
									// .replace(/\$\$label\$\$/g, label)
									.replace(/\$\$image\$\$/g, image);

								if (controlTemplate) {
									const directive = row.type === 'directive' ? 'data-' + row.directive : '';

									if (_.isString(row.validator) && row.validate !== false) {
										row.validator = evaluate(scope, row.validator);
									}

									if (!row.validator && row.validate !== false) {
										row.validator = compositeConfig.validator;
									}

									if (!row.validator && row.validate !== false) {
										row.validator = detailConfig.validator;
									}

									if (_.isString(row.asyncValidator && row.validate !== false)) {
										row.asyncValidator = evaluate(scope, row.asyncValidator);
									}

									if (!row.asyncValidator && row.validate !== false) {
										row.asyncValidator = compositeConfig.asyncValidator;
									}

									if (!row.asyncValidator && row.validate !== false) {
										row.asyncValidator = detailConfig.asyncValidator;
									}

									if (_.isString(row.change)) {
										row.change = evaluate(scope, row.change);
									}

									if (!row.change) {
										row.change = detailConfig.change;
									}

									row.rt$readonly = function () {
										return !scope.entity || !Object.getOwnPropertyNames(scope.entity).length || platformRuntimeDataService.isReadonly(scope.entity, row.model);
									};

									row.rt$hasError = function () {
										return scope.entity && scope.entity.__rt$data && scope.entity.__rt$data.errors && scope.entity.__rt$data.errors[row.model];
									};

									row.rt$errorText = function () {
										const error = scope.entity.__rt$data && scope.entity.__rt$data.errors && scope.entity.__rt$data.errors[row.model];

										if (error) {
											if (error.error$tr$) {
												platformTranslateService.translateObject(error, 'error');
											}

											return error.error;
										}

										return '';
									};

									row.rt$change = function () {
										if (detailConfig.dirty) {
											detailConfig.dirty(scope.entity, row.model, row);
										}

										if (row.change) {
											row.change(scope.entity, row.model);
										}
									};

									if ((controlTemplate.indexOf('data-options') < 0 ||
											controlTemplate.indexOf('data-control-options') < 0) &&
										row.options) {
										controlTemplate = controlTemplate.replace(/\$\$placeholder\$\$/g, ' data-options="$$$$row$$$$.options" $$$$placeholder$$$$');
									}

									const placeholder = [
										'data-entity="entity"',
										' data-config="' + rowBinding + '"',
										' data-model="entity.' + row.model + '"',
										isDomainTemplate ? '' : ' data-ng-model="entity.' + row.model + '"',
										isDomainTemplate ? '' : ' data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0}}"',
										' data-readonly="' + (attrs.readonly || !!row.readonly) + '"',
										' data-tabstop="' + !!row.tabStop + '"',
										' data-enterstop="' + !!row.enterStop + '"',
										!detailConfig.dirty ? '' : ' data-dirty="true"'
									].join('');

									controlTemplate = controlTemplate
										.replace(/\$\$row\$\$/g, rowBinding)
										.replace(/\$\$directive\$\$/g, directive)
										.replace(/\$\$placeholder\$\$/g, placeholder)
										// TODO LNB:Solve the editor not diplay in stretch
										.replace(/class="platform-form-col"/g, 'class="lg-12 md-12 xs-12 sm-12" style="padding-right:0"');

									rowTemplate = rowTemplate.replace(/\$\$control\$\$/g, controlTemplate);
								}
								rowContent.push(rowTemplate);
							}
						});

						const template = rowContent.join('');
						const content = $compile(template)(scope);
						elem.append(content);
					}

					configure(scope.$eval(attrs.config));
				}

			};
		}]);
})(angular);