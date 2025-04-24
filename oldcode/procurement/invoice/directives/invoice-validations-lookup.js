/**
 * Created by lvy on 12/26/2018.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */
	var moduleName = 'procurement.invoice';
	angular.module(moduleName).directive('procurementInvoiceValidationsMessageLookup',['platformModalService',
		function(platformModalService){
			return {
				restrict:'EA',
				templateUrl:globals.appBaseUrl + moduleName + '/partials/invoice-validations-message-lookup.html',
				link:function(scope, element, attrs){

					scope.message = scope.$eval(attrs.ngModel);

					scope.showMessage  = function(){
						var modalOptions = {
							headerTextKey: 'procurement.invoice.message',
							bodyTextKey: 'procurement.invoice.message',
							showOkButton: true,
							showCancelButton: true,
							allowMultiple: true,
							iconClass: 'information',
							height: '400px',
							resizeable: true,
							scope: scope,
							templateUrl: globals.appBaseUrl + moduleName + '/partials/invoice-validations-message-dialog.html',
							headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
							print: function(){
								var printView = '<table>' +
                                    '<thead><tr><th style="font-size: 1.4em;">Description Information</th></tr></thead>'+
                                    '<tbody><tr><td style="font-size: 1.3em;">'+formatString(scope.message)+ '</td></tr></tbody>'+
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

	angular.module(moduleName).filter('procurementInvoiceValidationsMessageFilter',[function(){
		var maxLength = 80;

		return function (input) {
			var output = '';

			if (angular.isString(input)) {
				output = input.trim();
			}

			if (output.length > maxLength) {
				// if value is long text, make sub string for better performance.
				output = output.trim().substring(0, maxLength) + '...';
			}

			if (output.startsWith('<')) {
				output = '...';
			}

			// conflict with html tag
			return output.replace(/</gm, '[').replace(/>/gm, ']');
		};
	}]);
})(angular);