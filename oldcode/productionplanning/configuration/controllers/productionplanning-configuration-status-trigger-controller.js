(angular => {
	'use strict';

	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).controller('ppsStatusTriggerController', ppsStatusTriggerController);

	ppsStatusTriggerController.$inject = ['$scope', '$translate', '$timeout', 'ppsStatusInheritedTriggerDataService', 'ppsStatusInheritedTriggerRuleDataService'];

	function ppsStatusTriggerController($scope, $translate, $timeout, ppsStatusInheritedTriggerDataService, ppsStatusInheritedTriggerRuleDataService) {
		const childrenNode = 'target';

		$scope.treeOptions = {
			nodeChildren: childrenNode,
			dirSelectable: true,
			selectedNode: {},
			expandedNodes: [],
		};

		ppsStatusInheritedTriggerDataService.registerListLoaded(loadData);

		function loadData() {
			$scope.data = ppsStatusInheritedTriggerDataService.getStatusTriggerData();

			const flattenData = [];
			flatten($scope.data, flattenData, childrenNode);

			$scope.treeOptions.expandedNodes = flattenData;
			$scope.treeOptions.selectedNode = flattenData[0];
			$scope.onSelection($scope.treeOptions.selectedNode);
		}
		$timeout(loadData, 0);

		$scope.onNodeDblClick = function onNodeDblClick() {};

		/*
		 this function returns the ico class for the node
		 */
		$scope.classByType = function classByType(node) {
			let result = 'ico-criterion-at';
			if (node && node.hasAnyTarget()) {
				result = 'ico-criterion-at-fo';
			}
			return result;
		};

		$scope.getDisplaytext = function(node) {
			if (!node || !node.description) {
				return 'no description';
			}
			const separator = ' ';

			return node.description.split(separator).map(i => $translate.instant(i)).join(separator);
		};

		$scope.onSelection = function onSelection(node) {
			ppsStatusInheritedTriggerRuleDataService.setSelectedTrigger(node && node.length > 0 ? node[0] : node);
		};

		function flatten(input, output, childProp) {
			var i;
			for (i = 0; i < input.length; i++) {
				output.push(input[i]);
				if (input[i][childProp] && input[i][childProp].length > 0) {
					flatten(input[i][childProp], output, childProp);
				}
			}
			return output;
		}

		$scope.$on('$destroy', function () {
			ppsStatusInheritedTriggerDataService.unregisterListLoaded(loadData);
		});
	}
})(angular);