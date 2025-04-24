/**
 * Created by baf on 2019/08/07
 */

(function () {
	/*global angular*/
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCustomizeStatusRoleGridDirective
	 * @requires angular
	 * @description
	 */
	angular.module('project.main').directive('projectMainCostGroupCatalogAssignmentGridDirective', ProjectMainCostGroupCatalogAssignmentGridDirective);

	function ProjectMainCostGroupCatalogAssignmentGridDirective() {
		return {
			restrict: 'A',
			scope: { ngModel: '=' },
			templateUrl: globals.appBaseUrl + 'app/components/modaldialog/modal-form-sub-grid-template.html',
			controller: 'projectMainCostGroupCatalogAssignmentGridController'
		};
	}
})(angular);
