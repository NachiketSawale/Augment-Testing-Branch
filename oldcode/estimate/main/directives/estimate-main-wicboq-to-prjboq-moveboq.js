/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc directive
     * @name estimateMainWicboqToPrjboqMoveboq
     * @requires $q
     * @description moveing wic boq to another wic boq
     */

	angular.module(moduleName).directive('estimateMainWicboqToPrjboqMoveboq', [
		'platformModalService',
		function(platformModalService){
			return {
				restrict:'EA',
				templateUrl: globals.appBaseUrl + moduleName+ '/templates/wizard/generate-project-boq/estimate-main-wicboq-moveing.html',
				link:function(scope) {

					scope.value = scope.entity.Reference;

					scope.showWicTreeToMove = function () {
						let modalOptions = {
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/generate-project-boq/estimate-main-wicboq-moveing-dialog.html',
							iconClass: 'ico-info',
							resizeable: true,
							width: '530px',
							height: '600px'
						};

						platformModalService.showDialog(modalOptions);

					};
				}
			};
		}
	]);

})(angular);
