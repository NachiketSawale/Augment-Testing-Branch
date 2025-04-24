/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */
(function (angular) {
	/** global angular, globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainSelStatementLoggingDialog
	 * @requires $q
	 * @description display a control which contains description and button to show more information
	 */

	angular.module(moduleName).directive('estimateMainSelStatementLoggingDialog', [
		'platformModalService', '$filter',
		function(platformModalService, $filter){
			return {
				restrict:'EA',
				templateUrl: globals.appBaseUrl + moduleName+ '/templates/selection-statement/line-item-selection-statement-logging-description.html',
				link:function(scope, element, attrs) {

					let loggingMessageToProcess = scope.$eval(attrs.ngModel);

					let parseDate = Date.parse(scope.entity.StartTime);
					if (_.isNaN(parseDate)){
						scope.hideButtonDialog = true;
					}else{
						scope.startTime = parseDate;
						scope.hideButtonDialog = false;
					}

					scope.showLoggingMessage = function () {
						let data = {};
						data.selStatement = scope.entity;
						data.isShowSingleExecutionInfo = true;
						data.startTime = _.isNaN(parseDate) ? '' : $filter('date')(parseDate, 'medium');
						data.loggingMessage = loggingMessageToProcess || '';

						let modalOptions = {
							headerTextKey: 'estimate.main.lineItemSelStatement.loggingMessage',
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/selection-statement/line-item-selection-statement-result-report.html',
							iconClass: 'ico-info',
							dataItems: data || {}
						};

						platformModalService.showDialog(modalOptions);

					};
				}
			};
		}
	]);

})(angular);
