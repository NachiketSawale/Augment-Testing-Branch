/**
 * Created by wui on 6/7/2017.
 */

(function(angular){
	'use strict';
	/* global globals */
	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).directive('constructionSystemCommonStackTraceDialog',['platformModalService',
		function(platformModalService){
			return {
				restrict:'EA',
				templateUrl:globals.appBaseUrl + moduleName+ '/partials/construction-system-common-description-dialog.html',
				link:function(scope, element, attrs) {

					scope.description = scope.$eval(attrs.ngModel);

					scope.showDescription = function () {
						var modalOptions = {
							headerTextKey: 'constructionsystem.common.stackTrace',
							bodyTextKey: 'constructionsystem.executionScriptOutput.description',
							showOkButton: true,
							showCancelButton: true,
							allowMultiple: true,
							iconClass: 'information',
							height: '400px',
							resizeable: true,
							scope: scope,
							templateUrl: globals.appBaseUrl + moduleName + '/templates/construction-system-common-stacktrace-dialog.html'
						};

						platformModalService.showDialog(modalOptions);
					};
				}
			};
		}
	]);
})(angular);