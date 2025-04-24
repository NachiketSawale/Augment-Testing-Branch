/**
 * Created by chi on 3/16/2017.
 */
(function(angular)
{
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).directive('constructionSystemMainInstanceStatus', ['$compile', 'constructionSystemMainInstanceProgressService',
		function($compile, constructionSystemMainInstanceProgressService) {
			return {
				restrict: 'A',
				link: linkFn
			};

			// /////////////////////////////
			function linkFn(scope, elem) {

				/**
			 * @description get image html to display and value.
			 */
				scope.displayImageHtml = function () {
					if (scope && scope.entity) {
						return constructionSystemMainInstanceProgressService.formatter(null, null, scope.entity.Status, scope.entity);
					}
					return '';
				};

				var template ='<div class="input-group lookup-container form-control">'+
				'<div class="input-group-content" tabindex="-1" data-ng-bind-html="displayImageHtml()" data-ng-readonly="true"></div>'+
				'</div>';

				$compile($(template).appendTo(elem))(scope);
			}
		}]);
})(angular);