(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterItemPreviewCustomizeController', [
		'$scope',
		function ($scope) {
			const allItems = $scope.options.attributes;
			const emptyOption = {key: '', selected: false};
			$scope.onSelectedChanged = onSelectedChanged;
			$scope.removeOption = removeOption;
			$scope.dialog.click = click;
			$scope.selectedOptions = [];
			$scope.itemOptions = {
				displayMember: 'name',
				valueMember: 'key',
				showDragZone: true,
				showSearchfield: true,
				displayedItems: [],
				watchItems: true,
				items: allItems
			};

			initSelectedOptions();
			updateWaitingOptions();

			function removeOption(removedOption) {
				_.remove($scope.selectedOptions, function(option) {
					return removedOption.key === option.key;
				});
				updateSelectionList();
			}

			function onSelectedChanged() {
				updateSelectionList();
			}

			function initSelectedOptions() {
				$scope.selectedOptions = allItems.filter(function (attr) {
					return attr.selected;
				}).map(function(attr) {
					return {key: attr.key, name: attr.name, selected: attr.selected};
				}).concat([_.clone(emptyOption)]);
			}

			function updateSelectionList() {
				$scope.selectedOptions.forEach(function (attribute) {
					attribute.selected = attribute.key !== emptyOption.key;
				});
				if (_.last($scope.selectedOptions).key !== emptyOption.key) {
					$scope.selectedOptions.push(_.clone(emptyOption));
				}
				updateWaitingOptions();
			}

			function updateWaitingOptions() {
				const selectedKeys = $scope.selectedOptions.map(function (attribute) {
					return attribute.key;
				});
				$scope.itemOptions.displayedItems = allItems.filter(function (attr) {
					return !_.includes(selectedKeys, attr.key);
				}).sort(function (optionA, optionB) {
					return optionA.name.toLowerCase().localeCompare(optionB.name.toLowerCase());
				});
			}

			function click(button) {
				if (button.id.toLowerCase() === 'save' && _.isFunction(button.fn)) {
					reorderItems();
					button.fn(allItems);
				}
				$scope.$close({});
			}

			function reorderItems() {
				const selectedKeys = $scope.selectedOptions.map(function (attribute) {
					return attribute.key;
				});

				allItems.forEach(function (item) {
					item.selected = _.includes(selectedKeys, item.key);
				});

				$scope.selectedOptions.map(function (attribute) {
					return attribute.key;
				}).forEach(function (key, index) {
					const item = _.find(allItems, {key: key});
					const itemIndex = _.findIndex(allItems, {key: key});
					if (item) {
						allItems.splice(itemIndex, 1);
						allItems.splice(index, 0, item);
					}
				});
			}

			const unregisterWatch = $scope.$watch('selectedOptions', function (newSelectedOptions) {
				const emptyOptionIndex = newSelectedOptions.findIndex(function (option) {
					return option.key === emptyOption.key;
				});
				const emptyOptionIsNotLastOption = emptyOptionIndex !== -1 && emptyOptionIndex !== (newSelectedOptions.length - 1)
				if (emptyOptionIsNotLastOption) {
					$scope.selectedOptions.splice(emptyOptionIndex, 1);
					$scope.selectedOptions.push(_.clone(emptyOption));
				}
			}, true);

			$scope.$on('$destroy', function () {
				unregisterWatch();
			});
		}
	]);

})(angular);