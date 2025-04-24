/**
 * Created by joshi on 09.07.2014.
 */
(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainTypeCombo
	 * @requires
	 * @description
	 */
	angular.module('boq.main').directive('testDrop',
		['boqMainBoqTypeService', 'boqMainDocPropertiesService',
			function (boqMainBoqTypeService, boqMainDocPropertiesService) {
				return {
					restrict: 'EA',
					scope: {
						model: '=',
						readOnly: '=',
						options: '='
					},
					template: '<dropdownctrl ng-model="model" options="options" readonly = "readOnly"  on-selection-changed="changeEvent(value)"></dropdownctrl>',
					link: function link(scope) {
						scope.changeEvent = function changeEvent(val) {
							boqMainDocPropertiesService.onSelectionChange(val);
						};
					}
				};

			}]);
})();