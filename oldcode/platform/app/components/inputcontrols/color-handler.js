/*
 * $Id: color-handler.js 617454 2020-12-16 16:03:13Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformColorHandler', handler);

	handler.$inject = ['_', 'platformRuntimeDataService'];

	function handler(_, platformRuntimeDataService) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) { // jshint ignore:line
				const inGrid = !_.isUndefined(attrs.grid);
				const config = !inGrid && attrs.config ? scope.$eval(attrs.config) : scope;

				function isEmpty(value) {
					return _.isNil(value) || !_.isNumber(value);
				}

				config.rt$callbacks = {
					clearColor: () => {
						_.set(scope, attrs.ngModel, null);
					},
					showOverlay: () => {
						return isEmpty(ctrl.$modelValue);
					},
					isDeleteBtnDisabled: () => {
						return isEmpty(ctrl.$modelValue) || platformRuntimeDataService.isReadonly(scope[attrs.entity], attrs.domain);
					}
				};

			}
		};
	}
})(angular);
