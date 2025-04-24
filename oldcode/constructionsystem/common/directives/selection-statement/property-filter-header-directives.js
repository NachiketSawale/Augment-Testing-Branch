(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.common';

	// <div cloud-Desktop-Criteria-Ops-Combobox data-ng-model="criteria.selectedOperatorId"></div>
	/**
	 * implementation with select2 dropdownbox
	 */
	angular.module(modulename).directive('propertyFilterHeaderDirective',
		[
			function () {
				return {
					restrict: 'A',
					scope: true,
					template: function (elem, attrs) {
						var template = '<div data-dropdown-select2 data-nosearch' +
							' data-model="@@model@@" data-options="@@dropboxOptions@@" ' +
							' data-change="onValueChange()"></div>';
						template = template.replace('@@model@@', attrs.model);
						template = template.replace('@@dropboxOptions@@', attrs.dropboxOptions);
						return template;
					},
					compile: function () {
						return {
							pre: preLink
						};
					}
				};

				function preLink(scope) { // jshint ignore:line
					scope.onValueChange=function () {
						scope.$parent.searchOptions &&
						scope.$parent.searchOptions.onSaveAsSelectionStatement &&
						scope.$parent.searchOptions.onSaveAsSelectionStatement();
					};
				}
			}
		]
	);

})(angular);