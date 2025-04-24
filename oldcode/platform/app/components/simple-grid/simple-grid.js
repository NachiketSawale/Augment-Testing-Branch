(function () {
	'use strict';

	angular.module('platform').directive('platformSimpleGrid', platformSimpleGrid);

	platformSimpleGrid.$inject = ['platformTranslateService'];

	function platformSimpleGrid(platformTranslateService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				options: '='
			},
			templateUrl: globals.appBaseUrl + 'app/components/simple-grid/simple-grid-template.html',
			link: function (scope, elem, attrs, ngModelCtrl) {

				ngModelCtrl.$formatters.push(function (value) {

					/*
						two types of data handling:
						1.) An array for displaying the cells:
							data = [{id: 1, name='testname'}, {id: 2, name='testname2'}]
						2.) An object in which the data for the table-cells. And as an extension of a key for the radio-buttons
						    in the table. This key is for inserting the ng-model for the radio-buttons.
						    For the 'evaluation' of the selected radio-button is this necessary. Example:
						    data = { items: [{id: 1, name='testname'}, {id: 2, name='testname2'}], radioModel= '' }

					 */

					// this is only to check whether the model is an array
					scope.isModelAnArray = _.isArray(value);

					return {
						items: scope.isModelAnArray ? value : value.items,
						data: value
					};
				});

				ngModelCtrl.$render = function () {
					scope.data = ngModelCtrl.$viewValue.data;
					scope.items = ngModelCtrl.$viewValue.items;

					initDefaultSortColumn();

					// translated keys in the list with the suffix $tr$
					platformTranslateService.translateObject(scope.options, undefined, {recursive: true});
				};

				/*
					set defaultvalue for sorting.
					exist the key 'defaultSortColumnField' in options then set this.  Otherwise take from first item in options.columns
				 */
				function initDefaultSortColumn() {
					scope.sortedColumn = scope.options.defaultSortColumnField ? scope.options.defaultSortColumnField : scope.options.columns[0].field;
					scope.sortingDesc = false;
				}

				scope.sortColumn = function (event, item) {
					if (item.sortable) {

						// find from parent <th> the child element <i> for add icon css-classs
						var indicatorElement = angular.element(event.target).closest('th').children('.sort-indicator');

						// first, remove css form element .sort-indecator. then add css in target-item for desc or asc
						angular.element('.sort-indicator').removeClass('ico-sort-desc ico-sort-asc');

						// sortingDesc: variable for sorting. false: up or true: down
						scope.sortingDesc = scope.sortedColumn === item.field ? !scope.sortingDesc : false;

						// sortedColumn: Specifies which column of the table is sorted. The field is passed in JSON-Object
						scope.sortedColumn = item.field;

						// add css classes for die indicator icons
						indicatorElement.addClass(scope.sortingDesc ? 'ico-sort-desc' : 'ico-sort-asc');
					}
				};
			}
		};
	}
})();