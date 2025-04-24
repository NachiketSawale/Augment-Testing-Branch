(function (angular) {
	'use strict';

	const moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateDynamicGridAndFormLookup', dynamicLookup);

	dynamicLookup.$inject = ['$compile', '_','$', '$templateCache', 'platformPermissionService', 'mainViewService'];

	function dynamicLookup($compile, _,$, $templateCache, platformPermissionService, mainViewService) {
		let childscope, template;

		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) { // jshint ignore:line
				let directive = null;
				let options = scope.$eval(attrs.options);
				let config = scope.$eval(attrs.config);
				let entity = scope.$eval(attrs.entity);
				let dependant = options.dependantField;
				let lookupInfo = options.lookupInfo;
				let rowOptions = null;

				function getLookupInfos(dependantValue) {
					let info = lookupInfo[dependantValue];
					if(info) {
						scope.lookupOptions = _.merge(info.lookup.options, options);
						directive = getDirective(dependantValue);
						scope.value = entity[info.column];
					}
				}

				function render(directive) {
					let replaced = template.replace(/\$\$directive\$\$/, directive);
					let newElem = angular.element(replaced);
					elem.html('');
					elem.append(newElem);
					$compile(newElem)(scope);
				}


				let unwatchEntity = scope.$watch('entity', function (newValue, oldValue) {
					if (newValue !== oldValue) {
						entity = newValue;
					}
				});

				let unwatch = scope.$watch('entity.' + dependant, function (newValue, oldValue) {
					if (options.grid) {
						if (newValue !== oldValue) {
							getLookupInfos(newValue);
							render(directive);
						}
					} else {
						changeControl(scope, elem, newValue);
					}
				});

				let dependantValue = null;
				if (entity && entity[dependant]) {
					dependantValue = entity[dependant];
				}

				if (options.grid) {

					getLookupInfos(dependantValue);
					// noinspection HtmlUnknownAttribute
					template = '<div $$directive$$ options="lookupOptions" $$placeholder$$></div>';
					let placeholder = _.reduce(attrs, function (result, value, key) {
						switch (key) {
							case 'estimateDynamicGridAndFormLookup':
							case '$attr':
							case '$$element':
							case 'lookupInfo':
								break;
							case 'readonly':
								scope.lookupOptions.readonly = (value === 'true');
								break;
							case 'ngIf':
							case 'ngModel':
							case 'ngModelOptions':
								result += (result.length ? ' ' : '') + 'data-' + _.kebabCase(key) + (value && value.length ? ('="' + value + '"') : '');
								break;
							default:
								result += (result.length ? ' ' : '') + 'data-' + key + (value && value.length ? ('="' + value + '"') : '');
								break;
						}
						return result;
					}, '');

					template = template.replace(/\$\$placeholder\$\$/, placeholder);
					let replaced = template.replace(/\$\$directive\$\$/, directive);
					let newElem = angular.element(replaced);
					elem.html('');
					elem.append(newElem);
					$compile(newElem)(scope);

				} else {
					changeControl(scope, elem, dependantValue);
				}

				function getDirective(dependant) {
					return lookupInfo[dependant].lookup.directive;
				}

				function getOptions(dependant) {
					return lookupInfo[dependant].lookup.options;
				}

				function getRowDefinition(dependant) { /* jshint -W074 */
					return {
						rid: config.rid,
						gid: config.gid,
						model: config.model,
						type: 'directive',
						directive: getDirective(dependant),
						options: getOptions(dependant),
						validator: '',
						readonly: config.readonly ? config.readonly : false
					};
				}

				/**
				 *
				 * @param scope
				 * @param cs
				 * @returns {*|Object}
				 */
				function makeChildScopewithClean(scope, cs) {
					if (cs) {
						cs.$destroy();
					}
					// noinspection JSCheckFunctionSignatures
					return scope.$new();
				}

				function getTemplate(key) {
					let template = $templateCache.get(key + '.html');
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

				function getContextHtml(scope, rows) {

					let rowContent = [];
					let detailConfig = scope.formOptions.configure;

					function isContainerReadonly() {
						let containerScope = scope.$parent;

						while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'getContainerUUID')) {
							containerScope = containerScope.$parent;
						}

						return containerScope ? !platformPermissionService.hasWrite(mainViewService.getPermission(containerScope.getContainerUUID())) : false;
					}

					angular.forEach(rows, function (row) { // jshint ignore:line

						let groupIndex = 0;
						let rowIndex = 4;
						let group;

						for (let i = 0; i < detailConfig.groups.length; i++) {
							group = detailConfig.groups[i];
							if (group.gid === row.gid) {
								groupIndex = i;
								break;
							}
						}

						if (group) {
							for (let i = 0; i < group.rows.length; i++) {
								if (group.rows[i].rid === row.rid) {
									rowIndex = i;
									if (row.options) {
										if (_.isNull(rowOptions)) {
											rowOptions = _.cloneDeep(group.rows[i].options);
										}
										group.rows[i].options = _.merge({}, rowOptions, row.options);
									}
									break;
								}
							}
						}

						let controlTemplate = getTemplate(row.type);

						let readonly = detailConfig.skipPermissionCheck ? false : isContainerReadonly() ? true : row.readonly;

						let rowBinding = 'groups[' + groupIndex + '].rows[' + rowIndex + ']';
						if (controlTemplate) {
							let directive = row.type === 'directive' ? 'data-' + row.directive : '';

							let placeholder = [
								'data-entity="entity"',
								' data-config="' + rowBinding + '"',
								' data-model="entity.' + row.model + '"',
								' class="form-control"',
								' data-ng-model="entity.' + row.model + '"',
								' data-readonly="' + (readonly || !!row.readonly) + '"',
								' data-ng-readonly="' + (readonly || !!row.readonly) + '"',
								' data-tabstop="' + !!row.tabStop + '"',
								' data-enterstop="' + !!row.enterStop + '"',
								row.options ? ' data-options="options"' : '',
								!detailConfig.dirty ? '' : ' data-dirty="true"'
							].join('');

							controlTemplate = controlTemplate
								.replace(/\$\$row\$\$/g, rowBinding)
								.replace(/\$\$directive\$\$/g, directive)
								.replace(/\$\$placeholder\$\$/g, placeholder);
						}

						rowContent.push(controlTemplate);

					});

					// must wrap <div class="">
					rowContent = '<div class="">' + rowContent.join('') + '</div>';

					return rowContent;
				}

				function changeControl(scope, element, typeValue) {

					let lookuprow;

					let rows = [];
					if (lookupInfo[typeValue]) {
						lookuprow = getRowDefinition(typeValue);
					}
					if (!lookuprow || !lookuprow.directive) {
						let template = '<div class="form-control" data-ng-readonly="true"></div>';
						let ctrlElement = angular.element(template);
						element.html('');
						element.append(ctrlElement);
						$compile(ctrlElement)(scope);
						return;
					}

					let parent = $(element);
					rows.push(lookuprow);
					let html = getContextHtml(scope, rows);
					parent.empty();
					childscope = makeChildScopewithClean(scope, childscope);
					childscope.options = rows[0].options ? rows[0].options : null;
					element.append($compile(html)(childscope));

				}

				scope.$on('$destroy', function () {
					if (unwatch) {
						unwatch();
					}
					if (unwatchEntity) {
						unwatchEntity();
					}
				});
			}
		};
	}
})(angular);