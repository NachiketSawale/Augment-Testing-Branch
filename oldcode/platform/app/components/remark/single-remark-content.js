/*
 * $Id: form-content.js 370095 2016-05-10 13:34:42Z kh $
 * Copyright (c) RIB Software GmbH
 */

/**
 * @ngdoc directive
 * @name platform:platformSingleRemarkContent
 * @element div
 * @restrict A
 * @priority default value
 * @scope child scope
 * @description
 * Creates markup of single remark content for given configuration
 */
(function () {
	'use strict';

	angular.module('platform').directive('platformSingleRemarkContent', PlatformSingleRemarkContent);

	PlatformSingleRemarkContent.$inject = ['$templateCache', '$compile', '_', '$timeout', 'platformRuntimeDataService', 'platformTranslateService', 'platformPermissionService', 'mainViewService'];

	function PlatformSingleRemarkContent($templateCache, $compile, _, $timeout, platformRuntimeDataService, platformTranslateService, platformPermissionService, mainViewService) { // jshint ignore:line
		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem) {

				// configures the form
				function configure(remarkConfig) {
					function isContainerReadonly() {
						var containerScope = scope.$parent;

						while (containerScope && !containerScope.hasOwnProperty('getContainerUUID')) {
							containerScope = containerScope.$parent;
						}

						return containerScope ? !platformPermissionService.hasWrite(mainViewService.getPermission(containerScope.getContainerUUID())) : false;
					}

					function evaluate(scope, expression) {
						// Used for validation
						var value = scope.$eval(expression);

						while (!value && scope.$parent) {
							value = scope.$eval(expression);
							scope = scope.$parent;
						}

						return value;
					}

					function processRemark(remark) {
						var readonly = isContainerReadonly();

						// $templateCache.get('single-remark-content.html');
						var remarkTemplate = '<div class="filler"><div data-domain-control data-domain="remark" $$placeholder$$></div><div class="invalid-cell invalid-form" data-ng-if="binding.rt$hasError()" data-ng-bind="binding.rt$errorText()"></div></div>';
						var remarkBinding = remark;

						if (remarkTemplate) {
							if (_.isString(remark.validator)) {
								remark.validator = evaluate(scope, remark.validator);
							}

							if (!remark.validator) {
								remark.validator = remarkConfig.validator;
							}

							if (_.isString(remark.asyncValidator)) {
								remark.asyncValidator = evaluate(scope, remark.asyncValidator);
							}

							if (!remark.asyncValidator) {
								remark.asyncValidator = remarkConfig.asyncValidator;
							}

							if (_.isString(remark.change)) {
								remark.change = evaluate(scope, remark.change);
							}

							if (!remark.change) {
								remark.change = remarkConfig.change;
							}

							remark.rt$readonly = function () {
								return !scope.currentEntity || !Object.getOwnPropertyNames(scope.currentEntity).length || platformRuntimeDataService.isReadonly(scope.currentEntity, remark.model);
							};

							remark.rt$hasError = function () {
								return scope.currentEntity && scope.currentEntity.__rt$data && scope.currentEntity.__rt$data.errors && scope.currentEntity.__rt$data.errors[remark.model];
							};

							remark.rt$errorText = function () {
								var error = scope.currentEntity.__rt$data && scope.currentEntity.__rt$data.errors && scope.currentEntity.__rt$data.errors[remark.model];

								if (error) {
									if (error.error$tr$) {
										platformTranslateService.translateObject(error, 'error');
									}

									return error.error;
								}

								return '';
							};

							remark.rt$change = function () {
								if (remarkConfig.dirty) {
									remarkConfig.dirty(scope.currentEntity, remark.model, remark);
								}

								if (remark.change) {
									remark.change(scope.currentEntity, remark.model, remark);
								}
							};

							remark.rt$placeholder = function () {
								return remark.rt$readonly() ? '' : remark.placeholder(scope.currentEntity);
							};

							var placeholder = [
								'data-entity="entity"',
								' data-config="binding"',
								' data-model="currentEntity.' + remark.model + '"',
								' data-readonly="' + (readonly || !!remark.readonly) + '"',
								' class="filler noresize"',
								!remarkConfig.dirty ? '' : ' data-dirty="true"'
							].join('');

							remarkTemplate = remarkTemplate
								.replace(/\$\$placeholder\$\$/g, placeholder);
						}

						scope.binding = remarkBinding;

						return remarkTemplate;
					}

					if (scope.currentEntity) {
						scope.globalDisabled = true;
					}

					if (_.isString(remarkConfig.dirty)) {
						remarkConfig.dirty = evaluate(scope, remarkConfig.dirty);
					}

					if (_.isString(remarkConfig.change)) {
						remarkConfig.change = evaluate(scope, remarkConfig.change);
					}

					var remarkTemplate = processRemark(remarkConfig.remark);

					elem.append($compile(remarkTemplate)(scope));
					scope.$emit('form-rendered');
				}

				configure(scope.remarkContainerOptions.configure);

				scope.$on('form-config-updated', function () {
					elem.empty();
					configure(scope.remarkContainerOptions.configure);
					$timeout(function () {
						scope.$emit('form-config-updated-rendered');
					});
				});
			}
		};
	}
})();
