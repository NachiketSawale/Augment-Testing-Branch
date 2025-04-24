(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('qto.main').factory('qtoMainFormControlChangeService',
		['$templateCache', '$compile', '_', '$timeout', 'platformRuntimeDataService', 'platformTranslateService', '$translate',
			function ($templateCache, $compile, _, $timeout, platformRuntimeDataService, platformTranslateService, $translate) {
				var service = {};

				function getTemplate(key) {
					var template = $templateCache.get(key + '.html');
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

				function evaluate(scope, expression) {
					var value = scope.$eval(expression);

					while (!value && scope.$parent) {
						value = scope.$eval(expression);
						scope = scope.$parent;
					}

					return value;
				}

				service.getContextHtml = function (scope, rows, groupIndex, validationService) {

					_.forEach(rows, function (row) {
						var syncName = 'validate' + row.model;
						var asyncName = 'asyncValidate' + row.model;

						if (validationService[syncName]) {
							row.validator = validationService[syncName];
						}

						if (validationService[asyncName]) {
							row.asyncValidator = validationService[asyncName];
						}
					});

					var rowContent = [];
					var detailConfig = scope.formOptions.configure;

					var rid = detailConfig.groups[groupIndex].gid;

					var rowLength = _.where(detailConfig.rows, {gid: rid}).length;
					var beginRowIndex = rowLength;
					detailConfig.groups[groupIndex].rows.length = rowLength;
					detailConfig.groups[groupIndex].rows = detailConfig.groups[groupIndex].rows.concat(rows);


					angular.forEach(rows, function (row, rowIndex) { // jshint ignore:line

						var rowTemplate = getTemplate('form-row');
						var controlTemplate = getTemplate(row.type);
						rowIndex += beginRowIndex;
						var rowBinding = 'groups[' + groupIndex + '].rows[' + rowIndex + ']';
						var isDomainTemplate = controlTemplate.indexOf('data-domain-control') !== -1;

						if (controlTemplate) {
							var directive = row.type === 'directive' ? 'data-' + row.directive : '';

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
								var error = scope.entity.__rt$data && scope.entity.__rt$data.errors && scope.entity.__rt$data.errors[row.model];

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
									detailConfig.dirty(scope.entity, row.model,row);
								}

								if (row.change) {
									row.change(scope.entity, row.model);
								}
							};

							var placeholder = [
								'data-entity="entity"',
								' data-config="' + rowBinding + '"',
								' data-model="entity.' + row.model + '"',
								isDomainTemplate ? '' : ' data-ng-model="entity.' + row.model + '"',
								isDomainTemplate ? '' : ' data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0}}"',
								' data-readonly="' + !!row.readonly + '"',
								' data-tabstop="' + !!row.tabStop + '"',
								' data-enterstop="' + !!row.enterStop + '"',
								!detailConfig.dirty ? '' : ' data-dirty="true"'
							].join('');

							controlTemplate = controlTemplate
								.replace(/\$\$row\$\$/g, rowBinding)
								.replace(/\$\$directive\$\$/g, directive)
								.replace(/\$\$placeholder\$\$/g, placeholder);

							var value = $translate.instant(row.label$tr$);
							rowTemplate = rowTemplate.replace(/\$\$control\$\$/g, controlTemplate);
							rowTemplate = rowTemplate.replace('{{::$$row$$.userlabel || $$row$$.label}}', value);
						}

						rowContent.push(rowTemplate);

					});
					rowContent = angular.element(rowContent.join(''));

					return rowContent;
				};
				return service;
			}]);
})(angular);