(function (angular) {
	'use strict';

	angular.module('basics.common').factory('BasicsCommonLanguageDialogGridDirectiveService', ['globals',
		function (globals) {
			return function BasicsCommonLanguageDialogGridDirectiveService(options) {
				const self = this;

				self.restrict = 'A';
				self.scope = {
					entity: '=',
					ngModel: '=',
					options: '='
				};
				self.templateUrl = globals.appBaseUrl + 'basics.common/partials/language-dialog-grid.html';
				self.controller = options.controller;
			};
		}
	]);
})(angular);