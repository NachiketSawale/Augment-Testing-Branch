/*
 * $Id: construction-system-master-object-filter-definition-directives.js 440062 2017-06-08 08:57:35Z lst $
 * Copyright (c) RIB Software AG
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var modulename = 'constructionsystem.common';

	/**
	 *
	 * @param key
	 * @returns {*}
	 */
	function getTemplate(templateCache, key) {
		var template = templateCache.get(key + '.html');
		if (!template) {
			throw new Error('Template ' + key + ' not found');
		}
		return template;
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
		return scope.$new();
	}

	/**
	 * Filter Value directive
	 */
	angular.module(modulename).directive('cosCommonObjectFilterFilterValueList',
		['$templateCache', 'basicsCommonConfigLocationListService',

			function () {  // jshint ignore:line
				return {
					restrict: 'EA',
					scope: false, // true,
					template: function (elem, attrs) {
						var myTemplate = '<div data-dropdown-select2-tags data-on-changed="onValueListChanged" data-info="criterion.FilterValuelist" multiple nosearch data-model="@@model@@" data-options="dropboxOptions"@@attributes@@></div>';

						function makeTemplate(template, attrs) {
							var attrList = [
								!attrs.readonly ? '' : ' data-ng-readonly="' + attrs.readonly + '" ',
								!attrs.entity ? '' : ' data-entity="' + attrs.entity + '" ',
								!attrs.class ? '' : ' class="' + attrs.class + '" ',
								!attrs.style ? '' : ' style="' + attrs.style + '" ',
								!attrs.placeholder ? '' : ' placeholder="' + attrs.placeholder + '"'
							];
							template = template
								.replace('@@model@@', attrs.model)
								.replace('@@attributes@@', attrList.join(''));
							return template;
						}

						return makeTemplate(myTemplate, attrs);
					},
					compile: function () {
						return {
							pre: preLink
							// post: postLink
						};
					}
				};

				// we must set scope in prelink function because the directive dropdownSelect2Tags link function called before cloudDesktopFilterValueList link function
				function preLink(scope) { // jshint ignore:line
					scope.dropboxOptions = {
						items: scope.criterion.valueListDataSource,
						valueMember: 'id',
						displayMember: 'description'
					};

					/**
					 * @description sets the filterdef modified flag as soon as the list is changed
					 * @param scopeParam
					 */
					scope.onValueListChanged = function () { // jshint ignore:line
						if (scope.criterion && scope.criterion.filterDef && !scope.criterion.filterDef.modified) {
							scope.criterion.filterDef.modified = true;
							scope.$apply(); // we must force an apply otherewise digest will not start.... "Save" button remains disabled
						}
					};

				}
			}]);

	/**
	 * Filter Value directive
	 */
	angular.module(modulename).directive('cosCommonObjectFilterFilterValue',
		['$templateCache', '$compile', '$timeout', 'basicsCommonConfigLocationListService',
			function () {  // jshint ignore:line
				return {
					restrict: 'EA',
					template: function (elem, attrs) {
						var myTemplate = '<div data-ng-switch="criterion.valueCtlType">' +
							'<div data-domain-control data-ng-switch-when="string" data-domain="{{domain}}" data-model="@@model@@" class="form-control" data-placeholder="<enter string>" data-change="onChanged()"></div>' +
							'<div data-domain-control data-ng-switch-when="numeric" data-domain="{{domain}}" data-model="@@model@@" class="form-control" data-placeholder="<enter number>" data-change="onChanged()"></div>' +
							'<div data-domain-control data-ng-switch-when="date" data-domain="datetime" data-model="@@model@@" class="form-control" data-placeholder="<enter date>" data-change="onChanged()"></div>' +
							'</div>';

						function makeTemplateReplaceAll(template, attrs) {
							myTemplate = template.replace(/@@model@@/g, attrs.model);
							return myTemplate;
						}

						return makeTemplateReplaceAll(myTemplate, attrs);
					},

					scope: false,
					compile: function () {
						return {
							pre: preLink
							// post: undefined //postLink
						};
					}

				};
				/**
				 *
				 * @param scope
				 * @param elem
				 * @param attrs
				 */
				// eslint-disable-next-line no-unused-vars
				function preLink(scope, elem, attrs) { // jshint ignore:line

					function processControlType() { // jshint ignore:line

						var uiType = scope.criterion.valueUiControlType;
						scope.criterion.valueCtlType = undefined;

						if (!uiType) {
							return;
						}
						var typeDomain = uiType.split('.');
						var uictrltype = typeDomain[0];
						scope.domain = typeDomain[1] || 'integer';
						console.log('cloudDesktopFilterValue type:', uictrltype, ' domain:', scope.domain);
						// reset domain from description to remark. defect#93741
						if(scope.domain === 'description'){
							scope.domain = 'comment';
						}

						switch (uictrltype) {
							case 'stringCtrl':
								scope.criterion.valueCtlType = 'string';
								break;
							case 'numCtrl':
								scope.criterion.valueCtlType = 'numeric';
								break;
							case 'dateCtrl':
								scope.criterion.valueCtlType = 'date';
								break;
						}

						scope.onChanged = function () {
							if (scope.criterion && scope.criterion.filterDef) {
								scope.criterion.filterDef.modified = true;
							}

							scope.searchOptions &&
							scope.searchOptions.onSaveAsSelectionStatement &&
							scope.searchOptions.onSaveAsSelectionStatement();// jshint ignore:line
						};

						// clean previous created elements with jquery, only the  children
						// $(elem[0]).children().children().remove(); // remove old values....
					}

					processControlType();

				}
			}]);


	/**
	 * Filter Criterion directive
	 */
	angular.module(modulename).directive('cosCommonObjectFilterCriterion',
		['$templateCache',
			function ($templateCache) {
				return {
					restrict: 'A',
					scope: false, // true,
					template: function () {
						return getTemplate($templateCache, 'cos-common-object-filterdef-criterion');
					},
					link: function (scope) { // jshint ignore:line

						scope.$watch('criterion.visible', function (newV) { // remark: see Criterion.visible in efilter-service.js
							if (newV === false) {
								scope.criterion.visible = true;
							}
						});

					},
					controller: ['$scope', function ($scope/* , $element */) {
						/****/
						$scope.onCriterionDelete = function onCriteriaDelete() {
							// console.log('$scope.onCriterionDelete called ', $scope.criterion.dto, $scope.criterion);
							$scope.criterion.parent.deleteCriterion($scope.criterion);
							$scope.criterion.parent.filterDef.modified = true; // set filterDefinition is modified

							$scope.searchOptions &&
							$scope.searchOptions.onSaveAsSelectionStatement &&
							$scope.searchOptions.onSaveAsSelectionStatement();// jshint ignore:line
						};
					}]
				};
			}]
	);

	/**
	 * Filter Criterian directive
	 */
	angular.module(modulename).directive('cosCommonObjectFilterCriteria',
		['$templateCache', '$compile',
			function ($templateCache, $compile) {
				return {
					restrict: 'A',
					scope: false, // true,
					link: function (scope, elem/* , attr */) {
						var childscope;


						function processCriteria() {
							var content = [];
							var criteriaHeaderTmpl = getTemplate($templateCache, 'cos-common-object-filterdef-criteria-header');

							content.push('<ul>'); // start criteria
							content.push(criteriaHeaderTmpl);

							// need css-classes for styling
							function getCssClassForLastCriterionElement() {
								var criterionLastElement = '';
								if ((scope.criteria.parent) && (scope.criteria.parent.criteria.length > 0 )) {
									_.forEach(scope.criteria.parent.criteria, function (item) {
										if (item === scope.criteria) {
											criterionLastElement = 'last';
										}
									});
								}
								return criterionLastElement;
							}

							var criterionLastElement = getCssClassForLastCriterionElement();

							// make crierion
							content.push('<li class="' + criterionLastElement + '" ng-repeat="criterion in criteria.criterion track by $id(criterion)" >' +
								'<div data-cos-common-object-filter-criterion ></div>' + '</li>');

							// make crieria
							content.push('<li ng-repeat="criteria in criteria.criteria track by $id(criteria)" >' +
								'<div data-cos-common-object-filter-criteria ></div>' + '</li>');

							content.push('</ul>'); // end criteria

							//  join templates together
							var theContent = content.join('');

							elem.empty();
							childscope = makeChildScopewithClean(scope, childscope);
							elem.append($compile(theContent)(childscope));

						}

						processCriteria();

					},
					controller: ['$scope', function ($scope/* , $element */) {
						/****/
						$scope.onCriteriaNew = function onCriteriaNew() {
							// eslint-disable-next-line no-unused-vars
							var newCrita = $scope.criteria.createNewCriteria($scope);// jshint ignore:line
							$scope.criteria.filterDef.modified = true; // set filterDefinition is modified
						};

						/****/
						$scope.onCriterionNew = function onCriterionNew() {
							// eslint-disable-next-line no-unused-vars
							var newCrion = $scope.criteria.createNewCriterion($scope); // jshint ignore:line
							$scope.criteria.filterDef.modified = true; // set filterDefinition is modified
						};

						/****/
						$scope.onCriteriaDelete = function onCriteriaDelete() {
							if ($scope.criteria.parent) {
								$scope.criteria.parent.deleteCriteria($scope.criteria);
								$scope.criteria.parent.filterDef.modified = true; // set filterDefinition is modified
							} else {
								$scope.criteria.deleteAllSubCriteriaCriterion();
								$scope.criteria.filterDef.modified = true; // set filterDefinition is modified
							}

							$scope.searchOptions &&
							$scope.searchOptions.onSaveAsSelectionStatement &&
							$scope.searchOptions.onSaveAsSelectionStatement();// jshint ignore:line
						};
					}]
				};
			}]);

	/**
	 * Filter FilterDefinition directive
	 */
	angular.module(modulename).directive('cosCommonObjectFilterFilterDefinition',
		['$templateCache', '$compile', 'cloudDesktopSidebarSearchSchemaGraphService',
			'constructionsystemCommonFilterServiceCache',
			function ($templateCache, $compile, cloudDesktopSidebarSearchSchemaGraphService,
				// eslint-disable-next-line no-mixed-spaces-and-tabs
					  constructionsystemCommonFilterServiceCache) {

				return {
					restrict: 'A',
					replace: true,
					scope: true,
					link: function (scope, elem, attr) {
						// console.log('cloudDesktopFilterDefinition', scope.enhancedFilterOptions);

						var currentFilterDef;
						var childscope;

						/**
						 * @param filterDef
						 */
						function processFilterDefinition(filterDef) {
							if (_.isEmpty(filterDef)) {
								currentFilterDef = filterDef;
								return;
							}
							if (filterDef.isEqual(currentFilterDef)) {
								return;
							}
							// console.log('(>>>) processFilterDefinition new: ' + filterDef.getInfo, ' old: ', currentFilterDef ? currentFilterDef.getInfo : currentFilterDef);

							currentFilterDef = filterDef;
							var filterDefTmpl = getTemplate($templateCache, 'cos-common-object-filterdef-outer');
							scope.criteria = filterDef.criteria || {};
							scope.getGraphProvider = function () {
								var enhancedFilterService = constructionsystemCommonFilterServiceCache.getService('constructionsystemCommonEnhancedFilterService', scope.parentServiceName);
								return new cloudDesktopSidebarSearchSchemaGraphService.SidebarSearchSchemaGraphProvider({
									rootDisplayName: enhancedFilterService.rootDisplayName,
									filterColumns: enhancedFilterService.filterRootPropertyList
								});
							};

							elem.empty();
							childscope = makeChildScopewithClean(scope, childscope);
							elem.append($compile(filterDefTmpl)(childscope));

						}

						/**
						 * * @type {function()|*}
						 */
						scope.$watch(function () {
							return scope.$eval(attr.options).currentFilterDef; // scope.enhancedFilterOptions.currentFilterDef;
						}, function (filterDef) {
							processFilterDefinition(filterDef);
						});
					}
				};
			}]);

})();
