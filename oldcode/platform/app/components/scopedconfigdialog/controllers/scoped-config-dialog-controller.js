/*
 * $Id: scoped-config-dialog-controller.js 525832 2018-12-11 16:22:59Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name platform.controller:platformScopedConfigDialogController
	 * @requires _, $scope, basicsCommonConfigLocationListService
	 * @description Controller for the contents of the access-scoped configuration dialog provided by
	 *              {@see platformScopedConfigDialogService}.
	 */
	angular.module('platform').controller('platformScopedConfigDialogController', ['_', '$scope',
		'basicsCommonConfigLocationListService',
		function (_, $scope, configLocations) {
			var unbindHandlers = [];

			var dlgData = $scope.$parent.dialog.modalOptions;

			$scope.settings = {};
			$scope.tabs = _.map(_.sortBy(configLocations.createItems(), 'priority'), function (item) {
				var result = {
					title: item.title,
					scopeLevel: item.id,
					disabled: false,
					formOptions: {
						configure: dlgData.formConfiguration.byName[item.id].formConfiguration,
						showButtons: [],
						validationMethod: function () {
						}
					},
					settings: dlgData.formConfiguration.byName[item.id].settings
				};
				$scope.settings[item.id] = result.settings;

				unbindHandlers.push(dlgData.registerFormWatches($scope.$parent, 'dialog.modalOptions'));

				result.formContainerOptions = {
					formOptions: result.formOptions,
					setTools: function () {
					}
				};
				return result;
			});
			$scope.tabs[$scope.tabs.length - 1].active = true;

			$scope.$on('$destroy', function () {
				unbindHandlers.forEach(function (handler) {
					if (handler) {
						handler();
					}
				});
				unbindHandlers = [];
			});
		}
	]);
})();
