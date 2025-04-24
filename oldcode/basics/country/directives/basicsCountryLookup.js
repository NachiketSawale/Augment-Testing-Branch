(function (angular) {
	/* global $ */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialPriceConditionLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module('basics.country').directive('basicsCountryLookup', ['platformModalService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (platformModalService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'Country',
				valueMember: 'Id',
				displayMember: 'Description',
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, { controller: ['$scope', controller]});

			function controller($scope) {
				if (!$scope.lookupOptions.buttons) {
					if($scope.lookupOptions.dynamicController){
						$scope.ctrlName = $scope.lookupOptions.dynamicController;
					}
					$.extend($scope.lookupOptions);
				}
			}
		}]);

})(angular);
