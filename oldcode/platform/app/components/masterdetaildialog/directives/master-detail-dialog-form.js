/*
 * $Id: master-detail-dialog-form.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformMasterDetailDialogForm
	 * @element div
	 * @restrict A
	 * @requires $compile
	 * @description Displays a form that gets updated when the underlying form configuration is replaced.
	 */
	angular.module('platform').directive('platformMasterDetailDialogForm', ['$compile',
		function ($compile) {
			return {
				restrict: 'A',
				link: function (scope, elem) {
					scope.$watch('formOptions', function () {
						elem.empty();
						if (scope.formOptions) {
							elem.append($compile('<div data-platform-form data-form-options="formOptions" data-entity="selectedItem" class="fullheight"></div>')(scope));
						}
					});
				}
			};
		}]);
})();