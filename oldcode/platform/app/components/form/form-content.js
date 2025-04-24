/*
 * $Id: form-content.js 606179 2020-10-09 07:56:41Z alisch $
 * Copyright (c) RIB Software GmbH
 */

/**
 * @ngdoc directive
 * @name platform:platformFormContent
 * @element div
 * @restrict A
 * @priority default value
 * @scope child scope
 * @description
 * Creates markup of form content for given configuration
 */
(function () {
	'use strict';

	angular.module('platform').directive('platformFormContent', platformFormContent);

	platformFormContent.$inject = ['$templateCache', '$compile', '$sanitize', '_', '$timeout', 'platformRuntimeDataService', 'platformTranslateService', 'platformModuleNavigationService', 'platformPermissionService', 'mainViewService', 'platformFormConfigService', '$translate'];

	function platformFormContent($templateCache, $compile, $sanitize, _, $timeout, platformRuntimeDataService, platformTranslateService, platformModuleNavigationService, platformPermissionService, mainViewService, platformFormConfigService, $translate) { // jshint ignore:line

		function configure(scope, elem, detailConfig) {
			var content = [];

			function isContainerReadonly() {
				var containerScope = scope.$parent;

				while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
					containerScope = containerScope.$parent;
				}

				return containerScope ? !platformPermissionService.hasWrite(mainViewService.getPermission(containerScope.getContainerUUID())) : false;
			}

			function evaluate(scope, expression) {
				var value = scope.$eval(expression);

				while (!value && scope.$parent) {
					value = scope.$eval(expression);
					scope = scope.$parent;
				}

				return value;
			}

			function getTemplate(key) {
				var template = $templateCache.get(key + '.html');
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

			function getRowsByGroupId(gid) {
				return detailConfig.rows.filter(function (row) {
					return row.gid === gid;
				});
			}

			scope.groups = _.sortBy(detailConfig.groups, function (group) {
				return group.sortOrder;
			});

			var readonly = detailConfig.skipPermissionCheck ? false : isContainerReadonly();

			// ??? !scope.entity ??? not used anymore ???
			if (scope.entity) {
				scope.globalDisabled = true;
			}

			if (_.isString(detailConfig.validator)) {
				detailConfig.validator = evaluate(scope, detailConfig.validator);
			}

			if (_.isString(detailConfig.asyncValidator)) {
				detailConfig.asyncValidator = evaluate(scope, detailConfig.asyncValidator);
			}

			if (_.isString(detailConfig.dirty)) {
				detailConfig.dirty = evaluate(scope, detailConfig.dirty);
			}

			if (_.isString(detailConfig.change)) {
				detailConfig.change = evaluate(scope, detailConfig.change);
			}

			angular.forEach(scope.groups, function (group, groupIndex) {
				if (group.visible) {
					var template = getTemplate('form-group');

					if (!detailConfig.showGrouping) {
						template = '<div class="platform-form-group">$$rows$$</div>';
					} else {
						let groupDescription = group.groupDescription || '';
						groupDescription = _.isString(groupDescription) ? $sanitize(groupDescription) : groupDescription;  // pevent xss attack for labels

						template = template
							.replace(/\$\$group\$\$/g, 'groups[' + groupIndex + ']')
							.replace(/\$\$groupDescription\$\$/g, groupDescription);
					}

					group.rows = _.sortBy(getRowsByGroupId(group.gid, scope.formOptions), function (group) {
						return group.sortOrder;
					});

					var rowContent = [];

					angular.forEach(group.rows, (function processRow(row, rowIndex, collection, inComposite) { // jshint ignore:line
						if (row.visible || inComposite) {
							var label = row.labelCode ? $translate.instant('$userLabel.labelId_' + row.labelCode) : (row.userlabel ? row.userlabel : row.label);
							label = _.isString(label) ? $sanitize(label) : label;  // rei@28.10.21. pevent xss attack for labels
							if (!_.isUndefined(label) && _.isEmpty(label)) {
								label = '&nbsp;'; // this creates a empty label column. So the form will not be destroyed.
							}

							// var toolTipTitle = row.toolTip;
							var toolTipCaption = row.toolTip;
							// toolTipTitle = _.isString(toolTipTitle) ? $sanitize(toolTipTitle) : toolTipTitle;
							toolTipCaption = _.isString(toolTipCaption) ? $sanitize(toolTipCaption) : toolTipCaption;
							var toolTip = label && toolTipCaption ? `custom-tooltip="{'title':'${label}', 'caption':'${toolTipCaption}'}"` : ''; //, 'width':300

							var rowTemplate, colTemplate;

							if (!inComposite) {
								rowTemplate = _.isUndefined(label) ? getTemplate('form-row-unlabeled') : getTemplate('form-row');
								colTemplate = row.navigator ? getTemplate('form-col-grouped') : getTemplate('form-col');
							}

							var controlTemplate = getTemplate(row.type);
							var rowBinding = 'groups[' + groupIndex + '].rows[' + rowIndex + ']';
							var isDomainTemplate = controlTemplate.indexOf('data-domain-control') !== -1 || controlTemplate.indexOf('data-dynamic-domain-control') !== -1;
							// using the same css-class as require-field in grid
							var image = row.required ? '<span class="required-cell"></span>' : '';
							var navigator = row.navigator && (row.navigator.force || !platformModuleNavigationService.isCurrentState(row.navigator.moduleName)) ? getTemplate('navigator') : '';

							if (!inComposite) {
								rowTemplate = rowTemplate
									.replace(/\$\$label\$\$/g, label)
									.replace(/\$\$image\$\$/g, image)
									.replace(/\$\$toolTip\$\$/g, toolTip);
							}

							if (controlTemplate) {
								var directive = row.type === 'directive' ? 'data-' + row.directive : '';

								// used for navigation-button(styling)
								var isCompositeDirective = directive ? directive.indexOf('composite') !== -1 : false;

								if (_.isString(row.validator)) {
									row.validator = evaluate(scope, row.validator);
								}

								if (!row.validator) {
									row.validator = detailConfig.validator;
								}

								if (_.isString(row.asyncValidator)) {
									row.asyncValidator = evaluate(scope, row.asyncValidator);
								}

								if (!row.asyncValidator) {
									row.asyncValidator = detailConfig.asyncValidator;
								}

								if (!row.change) {
									row.change = _.noop;
								}

								if (_.isString(row.change)) {
									row.change = evaluate(scope, row.change);
								}

								row.rt$readonly = function () {
									return !scope.entity || platformRuntimeDataService.isReadonly(scope.entity, row.model);
								};

								row.rt$hasError = function () {
									return scope.entity && platformRuntimeDataService.hasError(scope.entity, row.model);
								};

								row.rt$errorText = function () {
									return platformRuntimeDataService.getErrorText(scope.entity, row.model);
								};

								row.rt$change = function () {
									if (detailConfig.dirty) {
										detailConfig.dirty(scope.entity, row.model, row);
									}

									if (detailConfig.change) {
										detailConfig.change(scope.entity, row.model, row);
									}

									if (row.change) {
										row.change(scope.entity, row.model, row);
									}
								};

								row.rt$placeholder = function () {
									return row.rt$readonly() ? '' : row.placeholder(scope.entity);
								};

								row.rt$colorInfo = function () {
									return platformRuntimeDataService.colorInfo(scope.entity, row.model);
								};

								row.rt$hideContent = function () {
									return platformRuntimeDataService.isHideContent(scope.entity, row.model);
								};

								var directiveAttributes = '';
								if (_.isObject(row.directiveOptions)) {
									Object.keys(row.directiveOptions).forEach(function (propName) {
										var kebabPropName = _.kebabCase(propName);
										directiveAttributes += ' data-' + kebabPropName + '="' + row.directiveOptions[propName] + '"';
									});
								}

								var placeholder = [
									'data-entity="entity"',
									' data-config="' + rowBinding + '"',
									' data-model="entity.' + row.model + '"',
									isDomainTemplate ? '' : ' data-ng-model="entity.' + row.model + '"',
									isDomainTemplate ? '' : ' data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0}}"',
									' data-readonly="' + (readonly || !!row.readonly) + '"',
									' data-tabstop="' + !!row.tabStop + '"',
									' data-enterstop="' + !!row.enterStop + '"',
									!detailConfig.dirty ? '' : ' data-dirty="true"',
									directiveAttributes,
									row.uom ? ' data-uom="' + row.uom + '"' : '',
									row.fraction ? ' data-fraction="' + row.fraction + '"' : ''
								].join('');

								navigator = navigator.replace(/\$\$placeholder\$\$/g, placeholder);

								controlTemplate = controlTemplate
									.replace(/\$\$row\$\$/g, rowBinding)
									.replace(/\$\$directive\$\$/g, directive)
									.replace(/\$\$placeholder\$\$/g, placeholder);

								if (!inComposite) {

									if (isCompositeDirective && navigator !== '') {
										colTemplate = getTemplate('form-col-composite-grouped');

										var mainControlTemplate = $('<div>').html(controlTemplate);
										mainControlTemplate.children().append(navigator);

										colTemplate = colTemplate
											.replace(/%%control%%/g, mainControlTemplate.html())
											.replace(/\$\$cssClass\$\$/g, navigator !== '' ? 'navigation-form-col' : '');
									} else {
										colTemplate = colTemplate
											.replace(/%%control%%/g, controlTemplate)
											.replace(/%%navigator%%/g, navigator);
									}

									rowTemplate = rowTemplate
										.replace(/\$\$col\$\$/, colTemplate)
										.replace(/YYrowYY/g, rowBinding)
										.replace(/\$\$cssClass\$\$/g, row.cssClass ? row.cssClass : '');

								}

								if (row.type === 'composite') {
									angular.forEach(row.composite, function (item, itemIdx, itemArray) {
										processRow(item, itemIdx, itemArray, true);
									});
								}
							}

							if (!inComposite) {
								rowContent.push(rowTemplate);
							}
						}
					}));

					template = template.replace(/\$\$rows\$\$/g, rowContent.join(''));

					content.push(template);
				}
			});

			content = angular.element(content.join(''));

			elem.append($compile(content)(scope));
			scope.$emit('form-rendered');
		}

		return {
			restrict: 'A',
			scope: true,
			compile: function () {
				return {
					pre: function (scope, elem) {
						scope.unregister = [];

						// configures the form
						configure(scope, elem, scope.formOptions.configure);

						function getElementInFormContainer(activeElem) {
							return activeElem.closest('.platform-form-row') && activeElem.closest('.platform-form-row').nextElementSibling && activeElem.closest('.platform-form-row').nextElementSibling.querySelector('button, input');
						}

						function setFocusOnNExtElement() {
							//The focus element should be as close as possible, so that the UI jumps not so much.
							//Solution for CTRL+S
							let activeElem = document.activeElement;
							if (activeElem.nextElementSibling && activeElem.nextElementSibling.querySelector('button')) {
								activeElem.nextElementSibling.querySelector('button').focus();
							} else if (getElementInFormContainer(activeElem)) {
								activeElem.closest('.platform-form-row').nextElementSibling.querySelector('button, input').focus();
							} else {
								elem.find('button').first().focus();
							}
						}

						scope.unregister.push(scope.$on('form-config-updated', function () {
							elem.empty();
							configure(scope, elem, scope.formOptions.configure);
							$timeout(function () {
								scope.$emit('form-config-updated-rendered');
							});
						}));

						scope.unregister.push(scope.$on('commit-form-all-edits', function () {
							setFocusOnNExtElement();
							$timeout(function () {
								scope.$applyAsync();
							}, 0);
						}));
					},
					post: function (scope, elem) {
						var newCreatedScope = null;

						function createynamicReadonlyConfigWatch() {
							scope.unregister.push(scope.$watch('formOptions.configure', function (newValue, oldValue) {
								if (scope.formOptions && newValue !== oldValue) {
									if (newCreatedScope) {
										newCreatedScope.$destroy();
									}
									elem.empty();
									var options = _.cloneDeep(scope.formOptions);
									newCreatedScope = scope.$new(false);
									newCreatedScope.formOptions = options;
									platformFormConfigService.initialize(newCreatedScope.formOptions, newCreatedScope.formOptions.configure);
									configure(newCreatedScope, elem, newCreatedScope.formOptions.configure);
									checkItemsWithNavigatorButton();
									$timeout(function () {
										scope.$emit('form-config-updated-rendered');
									});
								}
							}));

						}

						if (scope.formOptions.isDynamicReadonlyConfig) {
							createynamicReadonlyConfigWatch(scope);
						}
						checkItemsWithNavigatorButton();

						scope.unregister.push(scope.$on('form-config-updated', function () {
							checkItemsWithNavigatorButton();
							$timeout(function () {
								scope.$emit('form-config-updated-rendered');
							});
						}));

						function checkItemsWithNavigatorButton() {
							$timeout(function () {

								elem.find('[data-basics-lookupdata-lookup-composite], [data-platform-composite-input]').find('[navigator-button], .navigator-button').each(function () {
									var lastElementInContainer = angular.element(this).parent().children().last();

									if (lastElementInContainer.hasClass('composite-last-item')) {
										lastElementInContainer.append(angular.element(this));
									}
								});
							}, 0);
						}

						function translationChanged() {
							platformTranslateService.translateFormConfig(scope.formOptions.configure);

							$timeout(function () {
								scope.$emit('form-config-updated');
							});
						}

						platformTranslateService.translationChanged.register(translationChanged);

						scope.unregister.push(scope.$on('$destroy', function () {
							platformTranslateService.translationChanged.unregister(translationChanged);

							_.over(scope.unregister)();
							scope.unregister = null;
						}));
					}
				};
			}
		};
	}
})();
