/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	angular.module('model.project').directive('modelProjectExpiryJobExecution', ['_', '$http',
		'platformTranslateService', 'servicesSchedulerUIFrequencyValues', 'platformDialogService',
		function (_, $http, platformTranslateService, servicesSchedulerUIFrequencyValues, platformDialogService) {
			return {
				restrict: 'A',
				template: '<div class="input-group">' +
					'<div data-domain-control data-domain="select" data-options="dropdownOptions" data-entity="entity" data-model="model"></div>' +
					'<button class="btn btn-default" data-ng-click="runOnce()" data-ng-bind="\'model.project.expiry.runOnce\' | translate" title="{{\'model.project.expiry.runOnceHint\' | translate}}"></button>' +
					'</div>',
				scope: {
					entity: '<',
					model: '='
				},
				compile: function () {
					return {
						pre: function (scope) {
							scope.runOnce = function () {
								return $http.post(globals.webApiBaseUrl + 'model/project/model/expiry/runonce').then(function () {
									return platformDialogService.showMsgBox('model.project.expiry.jobRequested', 'cloud.desktop.infoDialogHeader', 'info');
								});
							};

							var frequencyValues = _.cloneDeep(servicesSchedulerUIFrequencyValues);
							platformTranslateService.translateObject(frequencyValues, ['description']);

							scope.dropdownOptions = {
								displayMember: 'description',
								valueMember: 'Id',
								items: frequencyValues
							};
						}
					};
				}
			};
		}]);

})(angular);
