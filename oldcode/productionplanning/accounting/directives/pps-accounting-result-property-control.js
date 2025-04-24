/**
 * Created by anl on 8/1/2019.
 */

(function (angular) {
	'use strict';
	let moduleName = 'productionplanning.accounting';

	angular.module(moduleName).directive('productionplanningAccountingResultPropertyControl',
		['$injector', '_', '$compile', 'transportplanningPackagePkgTypeFormControlChangeService', 'basicsLookupdataConfigGenerator',
			'productionplanningAccountingResultDataService',
			function ($injector, _, $compile, controlChangeService, basicsLookupdataConfigGenerator,
				resultService) {

				let directive = {};
				let childscope;
				directive.restrict = 'A';
				directive.scope = true; // will not affect parentScope,

				directive.link = function (scope, element, attrs) {
					let options = scope.$eval(attrs.options);
					let characteristicLookupDetailConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'ppsCommonCharacteristicSimpleLookupDataService',
						filter: function (entity) {
							return Number('6' + entity.PpsEntityFk);
						}
					}).detail;

					let unwatchPpsEntityFk = null,
						unwatchEntity = null;

					unwatchEntity = scope.$watch('entity', function (/*newValue, oldValue*/) {
						if (!unwatchPpsEntityFk) {
							unwatchPpsEntityFk = scope.$watch('entity.PpsEntityFk', function (newValue, oldValue) {
								if (newValue !== oldValue) {
									changeControl(scope, element, newValue);
								}
							});
						}
					});

					//init
					let ppsEntityFk = 14;
					if (scope.entity) { //entity is already selected.
						ppsEntityFk = scope.entity.PpsEntityFk;
					}
					changeControl(scope, element, ppsEntityFk);

					scope.$on('$destroy', function () {
						unwatchEntity();
						if (unwatchPpsEntityFk) {
							unwatchPpsEntityFk();
						}
					});

					function getRowDefinition(ppsEntityFk) { /* jshint -W074 */
						let rowDefinition;
						let propertyRow = {};
						let characRow = {};
						if (ppsEntityFk === 14) {
							propertyRow = {
								rid: options.rid,
								gid: 'updatePropertyGroup',
								model: options.model,
								type: 'select',
								options: {
									items: resultService.getPropertySelections(),
									valueMember: 'Id',
									displayMember: 'Description'
								}
							};
						} else {
							characRow = {
								rid: options.rid,
								gid: 'updatePropertyGroup',
								model: options.model,
								type: 'directive',
								directive: characteristicLookupDetailConfig.options.lookupDirective,
								options: characteristicLookupDetailConfig.options.lookupOptions
							};
						}

						switch (ppsEntityFk) {
							case 14:
								rowDefinition = propertyRow;
								break;
							case 1:
								rowDefinition = characRow;
								break;
							case 2:
								rowDefinition = characRow;
								break;
						}

						return rowDefinition;
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
						//noinspection JSCheckFunctionSignatures
						return scope.$new();
					}

					function changeControl(scope, element, ppsEntityFk) {
						/* jshint -W074 */
						let lookupRow = getRowDefinition(ppsEntityFk);
						if (!lookupRow) {
							let template = '<div class="form-control" data-ng-readonly="true"></div>';
							let ctrlElement = angular.element(template);
							element.html('');
							element.append(ctrlElement);
							$compile(ctrlElement)(scope);
							return;
						}

						let parent = $(element);
						let html = controlChangeService.getContextHtml(scope, [lookupRow]);
						parent.empty();
						childscope = makeChildScopewithClean(scope, childscope);
						childscope.options = lookupRow.options ? lookupRow.options : null;
						element.append($compile(html)(childscope));

					}
				};
				return directive;
			}]);
})(angular);