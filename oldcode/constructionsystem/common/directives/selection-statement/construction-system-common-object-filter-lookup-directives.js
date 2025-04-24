(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,$ */

	var modulename = 'constructionsystem.common';

	// <div cloud-Desktop-Criteria-Ops-Combobox data-ng-model="criteria.selectedOperatorId"></div>
	/**
	 * implementation with select2 dropdownbox
	 */
	angular.module(modulename).directive('cosCommonObjectFilterCriteriaOpsCombobox',
		['constructionsystemCommonFilterServiceCache',
			function (filterServiceCache) {
				return {
					restrict: 'A',
					scope: true,
					template: function (elem, attrs) {
						var template = '<div data-dropdown-select2 data-info="criteria.OpsCombobox" ' +
							'data-nosearch data-model="@@model@@" data-options="dropboxOptions" ' +
							'data-change="onValueChange()"></div>';
						template = template.replace('@@model@@', attrs.model);
						return template;
					},
					compile: function () {
						return {
							pre: preLink
						};
					}
				};

				function preLink(scope) { // jshint ignore:line

					var eFilterService = filterServiceCache.getService('constructionsystemCommonEnhancedFilterService', scope.$parent.parentServiceName);

					scope.onValueChange=function () {
						scope.$parent.searchOptions &&
						scope.$parent.searchOptions.onSaveAsSelectionStatement &&
						scope.$parent.searchOptions.onSaveAsSelectionStatement();
					};

					scope.dropboxOptions = {
						items: eFilterService.getCriteriaOperators(),
						valueMember: 'id', displayMember: 'uiDisplayName'
					};
				}
			}
		]
	);
	// <div cloud-Desktop-Criterion-Ops-Combobox data-ng-model="criterion.selectedOperatorId" data-entity="criterion" data-disabled="criterion.operatorDisabled">
	// </div>
	/**
	 * implementation with select2 dropdownbox
	 */
	angular.module(modulename).directive('cosCommonObjectFilterCriterionOpsCombobox',
		[function () {
			return {
				restrict: 'A',
				scope: true,
				template: function (elem, attrs) {
					var template = '<div data-dropdown-select2 data-info="criterion.OpsCombobox" data-nosearch data-model="@@model@@" data-options="dropboxOptions"> </div>';
					var theModel = attrs.model;
					template = template.replace('@@model@@', theModel);
					return template;
				},
				compile: function () {
					return {
						pre: preLink
					};
				}
			};

			function preLink(scope) { // jshint ignore:line

				var ops = [];

				/**
				 * @param newValue
				 * @param oldValue
				 */
				function refreshOps() { // jshint ignore:line
					ops.length = 0;
					_.forEach(scope.criterion.operatorsListSimple, function (i) {
						ops.push(i);
					});
				}

				scope.$watchCollection('criterion.operatorsListSimple',
					refreshOps);

				/**
				 * @type {{items: Array, valueMember: string, displayMember: string, getItemList: Function, getItemByKey: Function}}
				 */
				scope.dropboxOptions = {
					items: ops,
					valueMember: 'id', displayMember: 'uiDisplayName'
				};
			}
		}
		]
	);

	/**
	 * @ directive diretive for displaying the datamodel as a tree.
	 */
	angular.module(modulename).directive('cosCommonObjectFilterFilterPropertyLookup',
		['$q', '$timeout', '$templateCache', 'constructionsystemCommonFilterServiceCache', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, $timeout, $templateCache, filterServiceCache, BasicsLookupdataLookupDirectiveDefinition) {


				var eFilterService = null;

				/**
				 * @function getTemplate
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

				var propertyTree = getTemplate($templateCache, 'cos-common-object-filterdef-propertytree');

				var defaults = {
					lookupType: 'filterPropertyLookup',
					valueMember: 'id', displayMember: 'name',
					disableDataCaching: true,
					disableInput: true,
					width: 283, height: 500,
					//  formatter function for the editfield of the dropdown box
					formatter: function (value, node) {
						return (node || {}).nameWithPath;
					},

					popupOptions: {
						template: propertyTree, // '' --option
						// controllerAs: '', --option
						// resolve: null --option
						// templateUrl: window.location.pathname + '/cloud.desktop/templates/test.html',
						controller: ['$scope', controller],
						width: 283, height: 500
					}
				};


				return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
					controller: ['$scope', function ($scope) {
						eFilterService = filterServiceCache.getService('constructionsystemCommonEnhancedFilterService', $scope.$parent.parentServiceName);
					}],
					dataProvider: {
						myUniqueIdentifier: 'eFilterPropertyLookupDataHandler',
						getItemByKey: function (value) {
							return eFilterService.getPropertybyId(value);
						},
						getList: function (options, scope, getSearchListSettings) {
							return eFilterService.getList(options, scope, getSearchListSettings);
						}
					}
				});


				/**
				 * @description
				 * This equality function just checks for different id
				 * @param a
				 * @param b
				 * @returns {boolean}
				 */
				function defaultEquality(a, b) {
					if (a === undefined || b === undefined) {
						return false;
					}
					return angular.equals(a.id, b.id);
				}

				/**
				 * @param $scope
				 * @param $popupInstance
				 * @param $popupContext
				 * @param cloudDesktopCompanyService
				 */
				function controller($scope) { // jshint ignore:line

					$scope.dataForTheTree = eFilterService.filterRootPropertyList;
					// $scope.theSelectedNode = {};
					$scope.treeOptions = {
						nodeChildren: 'childProperties',
						dirSelectable: true,
						// criterion: $scope.entity,
						equality: defaultEquality
					};

					var criterion = $scope.entity;
					$scope.treeOptions.expandedNodes = criterion.expandedProperties;
					$scope.treeOptions.selectedNode = criterion.selectedProperty;

					// jump to middle of opened popup
					$timeout(function () {
						var p = angular.element('.popup-content'); // scrollbar dom object
						var s = angular.element('.tree-selected'); // selected item has tree-selected class set
						var pOff = (p.offset() || {top: 0}).top;
						var sOff = (s.offset() || {top: 0}).top;
						var off = (sOff - pOff - (p.height() || 0) / 2) * (pOff < sOff ? 1 : -1);
						$(p).scrollTop(off);
					}, 0);

					/**
					 * @param node
					 * @returns {Window.name|*}
					 */
					$scope.getDisplaytext = function getDisplaytext(node) {
						return (node || {}).name;
					};

					/**
					 * @param node
					 * @returns {Window.name|*}
					 */
					$scope.getTitletext = function getTitletext(node) {
						return (node || {}).nameWithPath;
					};

					/**
					 * @param node
					 * @returns {*}
					 */
					$scope.classByType = function classByType(node) {
						return node.image;
					};

					/*
					 */
					$scope.onNodeDblClick = function onNodeDblClick(node) {
						console.log('onNodeDblClick called: ', node);
						if (node) {
							_.noop();
						}
					};

					/**
					 * @param node
					 */
					$scope.onSelection = function onSelection(node) {
						if (node && node.isSelectable) {
							$scope.$close({isOk: true, value: node});
						}
					};
				}
			}]);

})(angular);