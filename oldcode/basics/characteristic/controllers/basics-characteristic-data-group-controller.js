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
	 * @name basicsCharacteristicDataGroupController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	angular.module(moduleName).controller('basicsCharacteristicDataGroupController',
		basicsCharacteristicDataGroupController);

	basicsCharacteristicDataGroupController.$inject = ['$scope', '$injector',
		'basicsCharacteristicDataGroupServiceFactory', '_'];

	function basicsCharacteristicDataGroupController($scope, $injector,
		basicsCharacteristicDataGroupServiceFactory, _) {

		const sectionId = $scope.getContentValue('sectionId');
		const serviceName = $scope.getContentValue('mainService');
		const parentService = $injector.get(serviceName);
		const groupService = basicsCharacteristicDataGroupServiceFactory.getService(sectionId, parentService);

		$scope.path = globals.appBaseUrl;

		$scope.dataForTheTree = [];

		$scope.treeOptions = {
			nodeChildren: 'Groups',
			dirSelectable: true,
			selectedNode: {}
			// equality: defaultEquality
		};

		$scope.onSelection = function onSelection(node) {
			groupService.setSelected(_.isArray(node) ? node[0] : node);
		};

		$scope.onNodeDblClick = function onNodeDblClick(/* node */) {
			// console.log('onNodeDblClick called: ', node);
		};

		$scope.getDisplaytext = function getDisplaytext(node) {
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

		function updateItemList() {
			$scope.dataForTheTree = groupService.getTree() || [];
			const flatList = [];
			flatten($scope.dataForTheTree, flatList, 'Groups');
			$scope.treeOptions.expandedNodes = flatList;
			// $scope.treeOptions.selectedNode =  {};
			$scope.treeOptions.selectedNode = flatList && flatList.length > 0 ? flatList[0] : {};
			$scope.onSelection($scope.treeOptions.selectedNode);
		}

		groupService.listLoaded.register(updateItemList);

		function flatten(input, output, childProp) {
			_.forEach(input, function (item) {
				output.push(item);
				if (item[childProp] && item[childProp].length > 0) {
					flatten(item[childProp], output, childProp);
				}
			});
			return output;
		}

		$scope.$on('$destroy', function () {
			groupService.listLoaded.unregister(updateItemList);
		});

		// updateItemList();

	}
})(angular);
