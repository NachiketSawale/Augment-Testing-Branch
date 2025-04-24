/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'basics.characteristic';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicPopupGroupController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree in code popup
	 */
	angular.module(moduleName).controller('basicsCharacteristicPopupGroupController',
		basicsCharacteristicPopupGroupController);

	basicsCharacteristicPopupGroupController.$inject = ['$scope', '_',
		'basicsCharacteristicPopupGroupService'];

	function basicsCharacteristicPopupGroupController($scope, _,
		basicsCharacteristicPopupGroupService) {

		$scope.path = globals.appBaseUrl;

		// $scope.dataForTheTree = basicsCharacteristicPopupGroupService.getList();
		$scope.$watch(function () {
			return basicsCharacteristicPopupGroupService.loadCompleted;
		}, function (newVal) {
			if (newVal) {
				$scope.dataForTheTree = basicsCharacteristicPopupGroupService.getList();
			}
		});

		$scope.treeOptions = {
			nodeChildren: 'Groups',
			dirSelectable: true,
			selectedNode: {}
			// equality: defaultEquality
		};

		$scope.onSelection = function onSelection(node) {
			basicsCharacteristicPopupGroupService.setSelected(_.isArray(node) ? node[0] : node);
		};

		$scope.onNodeDblClick = function onNodeDblClick(/* node */) {
			// console.log('onNodeDblClick called: ', node);
		};

		$scope.getDisplaytext = function getDisplaytext(node) {
			// return node.DescriptionInfo.Description;
			return node.DescriptionInfo.Translated;
		};

		/*
		 this function returns the ico class for the node
		 */
		$scope.classByType = function classByType(node) {
			let result = 'ico-criterion-at';
			if (node && node.HasChildren) {
				result = 'ico-criterion-at-fo';
			}
			return result;
		};

		$scope.$on('$destroy', function () {
			basicsCharacteristicPopupGroupService.setSelected(null);
		});

	}
})(angular);
