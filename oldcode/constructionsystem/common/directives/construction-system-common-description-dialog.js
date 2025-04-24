/**
 * Created by chk on 10/17/2016.
 */
(function(angular){
	'use strict';
	/* global globals */
	/* jshint -W072 */
	var moduleName = 'constructionsystem.common';
	angular.module(moduleName).directive('constructionSystemCommonDescriptionDialog',['platformModalService',
		function(platformModalService){
			return {
				restrict:'EA',
				templateUrl:globals.appBaseUrl + moduleName+ '/partials/construction-system-common-description-dialog.html',
				link:function(scope, element, attrs){

					scope.description = scope.$eval(attrs.ngModel);

					scope.showDescription  = function(){
						var modalOptions = {
							headerTextKey: 'constructionsystem.executionScriptOutput.description',
							bodyTextKey: 'constructionsystem.executionScriptOutput.description',
							showOkButton: true,
							showCancelButton: true,
							allowMultiple: true,
							iconClass:'information',
							height: '400px',
							resizeable: true,
							scope:scope,
							templateUrl: globals.appBaseUrl + moduleName+'/partials/construction-system-common-dialog.html',
							print: function(){
								var printView = '<table>' +
									'<thead><tr><th style="font-size: 1.4em;">Description Information</th></tr></thead>'+
									'<tbody><tr><td style="font-size: 1.3em;">'+formatString(scope.description)+ '</td></tr></tbody>'+
									'</table>';
								var path = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
								var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
								var newWindow = window.open(path + 'reporting.platform/templates/print_template.html', 'print_window', strWindowFeatures);
								var body = newWindow.document.querySelector('body');
								body.innerHTML = printView;
								angular.element(newWindow).ready(function(){
									setTimeout(function(){
										var body = newWindow.document.querySelector('body');
										body.innerHTML = printView;
									},500);
								});
							}
						};

						platformModalService.showDialog(modalOptions);
					};
				}
			};
			function formatString(str){

				return str.replace(/\n+/g,'<br/>').replace(/\s/g, '&nbsp;');
			}
		}
	]);
})(angular);