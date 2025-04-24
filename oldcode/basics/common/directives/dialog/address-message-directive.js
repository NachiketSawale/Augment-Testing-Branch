(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonAddressMessageDirective',
		[
			function basicsCommonAddressMessageDirective() {
				return {
					restrict: 'A',
					scope: {
						entity: '='
					},
					template: '<span data-ng-style="getStyleByMessageType()">{{getMessage()}}</span>',
					link: function (scope/* , element, attrs, ctrls */) {
						scope.getMessage = function getMessage() {
							return scope.entity._message || '';
						};

						scope.getStyleByMessageType = function getStyleByMessageType() {
							return scope.entity._messageType === 'info' ? {color: 'green'} :
								scope.entity._messageType === 'error' ? {color: 'red'} : {};
						};
					}
				};
			}
		]);

})(angular);