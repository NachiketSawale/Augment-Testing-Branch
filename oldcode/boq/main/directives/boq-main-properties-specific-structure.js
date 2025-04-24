/**
 * Created by joshi on 20.08.2014.
 */
(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainSpecificStructure
	 * @description handle edit structure function on Button click event
	 */
	angular.module('boq.main').directive('boqMainSpecificStructure', ['boqMainDocPropertiesService', function (boqMainDocPropertiesService) {

		return {
			restrict: 'A',
			scope: {
				ngModel: '='
			},
			templateUrl: window.location.pathname + '/boq.main/templates/boq-properties-specific-structure.html',
			link: function link(scope/* , element, attrs */) {
				function setEditVal() {
					boqMainDocPropertiesService.setBoqStructureIsAlreadyInUse(false); // Marking this structure as editable leads to the creation of a new strucure that cannot be in use
					boqMainDocPropertiesService.setSpecificStrFlag(true);
					boqMainDocPropertiesService.getSelectedDocProp().BoqTypeId = null;
					boqMainDocPropertiesService.setEditVal(true);
					scope.ngModel = boqMainDocPropertiesService.getEditVal();
				}

				scope.onChkEditStructure = function (/* val */) {
					setEditVal();
				};
				scope.onBtnEditStructure = function (/* val */) {
					setEditVal();
				};
			}
		};

	}]);
})();
