/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

((angular) => {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformGridDialogBody
	 * @element div
	 * @restrict A
	 * @description Displays the body of a grid dialog.
	 */
	angular.module('platform').directive('platformGridDialogBody', platformGridDialogBody);

	platformGridDialogBody.$inject = [];

	function platformGridDialogBody() {
		let defaultGridId = 'b5fe997599fc4954bc2efec14579b6e1';

		controller.$inject = ['$scope', '$timeout', 'platformGridAPI', '_'];

		function controller($scope, $timeout, platformGridAPI, _) {
			let gridId = _.get($scope, 'dialog.modalOptions.gridId', defaultGridId);

			$scope.gridId = gridId;
			$scope.gridData = {
				state: gridId
			};

			let dlgData = $scope.dialog.modalOptions.dataItem;

			$scope.gridConfig = {
				columns: _.get(dlgData, 'cfg.columns'),
				id: gridId,
				tools: _.get(dlgData, 'cfg.tools'),
				options: {
					indicator: dlgData.cfg.indicator,
					tree: !!dlgData.cfg.tree,
					childProp: dlgData.cfg.childrenProperty,
					idProperty: dlgData.cfg.idProperty,
					multiSelect: dlgData.cfg.allowMultiSelect
				}
			};
		}

		return {
			controller: controller,
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'app/components/griddialog/partials/grid-dialog-body-template.html'
		};
	}
})(angular);
