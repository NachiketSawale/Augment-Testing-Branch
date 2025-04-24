/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	const moduleName = 'basics.characteristic';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicDataController
	 * @function
	 *
	 * @description
	 * controller for a characteristic data grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCharacteristicDataController',
		basicsCharacteristicDataController);

	basicsCharacteristicDataController.$inject = ['$scope', '$q', '$injector', '$timeout',
		'basicsCharacteristicDataUIServiceFactory',
		'platformGridControllerService',
		'platformGridAPI',
		'basicsCharacteristicCodeLookupService',
		'basicsCharacteristicDataServiceFactory',
		'basicsCharacteristicTypeHelperService',
		'basicsCharacteristicDataGroupServiceFactory',
		'basicsCharacteristicPopupGroupService',
		'basicsCharacteristicDataValidationService',
		'_'];

	function basicsCharacteristicDataController($scope, $q, $injector, $timeout,
		basicsCharacteristicDataUIServiceFactory,
		platformGridControllerService,
		platformGridAPI,
		basicsCharacteristicCodeLookupService,
		basicsCharacteristicDataServiceFactory,
		basicsCharacteristicTypeHelperService,
		basicsCharacteristicDataGroupServiceFactory,
		basicsCharacteristicPopupGroupService,
		validationService,
		_) {

		const myGridConfig = {
			initCalled: false,
			columns: [],
			cellChangeCallBack: function (arg) {
				fireCharacteristicItemChange(arg);
			}
			// sortOptions:
			// {
			// initialSortColumn: {
			// field: 'characteristicfk',
			// id: 'characteristicfk'
			// },
			// isAsc: true
			// }
		};

		$scope.gridId = $scope.getContainerUUID();

		// get environment from the module-container.json file
		const serviceName = $scope.getContentValue('mainService');
		const sectionId = Number($scope.getContentValue('sectionId'));
		const parentField = $scope.getContentValue('parentField');
		const containerId = $scope.getContentValue('id');
		const pKey1Field = $scope.getContentValue('pKey1Field');
		const pKey2Field = $scope.getContentValue('pKey2Field');
		const pKey3Field = $scope.getContentValue('pKey3Field');
		// const uuid = $scope.getContentValue('uuid');

		const parentService = $injector.get(serviceName);
		const dataService = basicsCharacteristicDataServiceFactory.getService(parentService, sectionId, parentField, pKey1Field, pKey2Field, pKey3Field);
		const groupService = basicsCharacteristicDataGroupServiceFactory.getService(sectionId, parentService); // controller must have his own service instance!

		const layoutParams = {};
		layoutParams.removeUsedCodes = true;
		layoutParams.characteristicDataService = dataService;
		const uiService = basicsCharacteristicDataUIServiceFactory.getService(sectionId, layoutParams, parentService);

		// setup controller
		platformGridControllerService.initListController($scope, uiService, dataService, validationService, myGridConfig);

		// selected characteristic data item (needed for watching!)
		$scope.selectedItem = null;

		const onParentEntityChanged = function () {
			refreshGroupTree();
		};
		parentService.registerSelectionChanged(onParentEntityChanged);

		// // update characteristics too
		// const onUpdateRequested = function onUpdateRequested(updateData) {
		// const oldMainItemId = dataService.getMainItemId();
		// dataService.update(updateData)
		// .then(function (data) {
		// const newMainItemId = data ? data.MainItemId : -1;
		// if (oldMainItemId === newMainItemId) { // do not twice refresh when row was changed!
		// refreshGroupTree();
		// }
		// }
		// );
		// };
		// platformModuleDataExtensionService.registerUpdateDataExtensionEvent(onUpdateRequested);

		// when the characteristic cell change
		function fireCharacteristicItemChange(arg) {
			if (arg.item.CharacteristicFk > 0) {
				const col = arg.grid.getColumns()[arg.cell].field;

				let isValueChange = false;
				if (col === 'ValueText') {
					isValueChange = true;
				} else {
					if (arg.item.CharacteristicEntity && arg.item.CharacteristicEntity.Id !== arg.item.CharacteristicFk) {
						arg.item.OldCharacteristicEntity = arg.item.CharacteristicEntity;
					}
				}
				arg.item.isValueChange = isValueChange;
				dataService.fireItemValueUpdate(arg.item);
			}
		}

		const onUpdateDone = function onUpdateDone() {
			refreshGroupTree();
		};
		dataService.updateDone.register(onUpdateDone);

		// update group selection tree
		function refreshGroupTree() {
			const contextId = dataService.getMainItemId();
			const mainEntity = parentService.getSelected() || {};
			const pKeysQueryString = dataService.combinePKeysToQueryString(mainEntity);
			groupService.loadData(contextId, pKeysQueryString);
		}

		// subscriber of characteristic data item selection changed event
		function selectedItemChanged() {
			$timeout(function () {
				$scope.selectedItem = dataService.getSelected();
			}, 0, false);
		}

		dataService.registerSelectionChanged(selectedItemChanged);

		// subscriber of group treeview selection changed event
		function groupChanged() {
			// fixed #146838, should get the unfiltered datas otherwise if the container has datas then not need reload data from database
			var datas = dataService.getUnfilteredList();
			$timeout(function () {
				// show only nodes with data
				const arr = [];  // id's to show
				const selectedGroup = groupService.getSelected();
				if (selectedGroup && selectedGroup.hasOwnProperty('Id')) {
					getFilter(selectedGroup, arr);
				}
				dataService.enableItemFilter(true); // turn on group filter
				let parentItem = dataService.parentService && dataService.parentService() ? dataService.parentService().getSelected() : null;
				if (!_.isEmpty(selectedGroup) && _.isEmpty(datas)) {
					dataService.load().then(() => {
						dataService.setItemFilter(function (item) {
							return item.CharacteristicGroupFk === 0 || arr.indexOf(item.CharacteristicGroupFk) !== -1; // include always new items!
						});
					});
				} else {
					dataService.setItemFilter(function (item) {
						return (item.CharacteristicGroupFk === 0 || arr.indexOf(item.CharacteristicGroupFk) !== -1) && (!parentItem || parentItem.Id === item.ObjectFk); // include always new items!
					});
				}
			}, 0, false);
		}

		groupService.selectionChanged.register(groupChanged);

		// recursively get all id's of the current node and all sub-nodes
		function getFilter(item, arr) {

			arr.push(item.Id);
			if (item.Groups) {
				for (let i = 0; i < item.Groups.length; i++) {
					getFilter(item.Groups[i], arr);
				}
			}
		}

		// does not give the modified item?
		// function onItemModified(action, entity) {
		// const gridInstance = platformGridAPI.grids.element('id', $scope.gridId).instance;
		// if (!gridInstance || !gridInstance.getActiveCell()) {
		// return;
		// }
		// }
		// mainService.registerItemModified(onItemModified);

		// watch changes of the current characteristic data item
		$scope.$watch('selectedItem', function (newVal, oldVal) {

			// ignore initial call
			if (angular.isUndefined(newVal) || newVal === null || angular.isUndefined(oldVal) || oldVal === null) {
				return;
			}

			// ignore row changes!
			if (newVal.hasOwnProperty('Id') && oldVal.hasOwnProperty('Id') && newVal.Id === oldVal.Id) {
				// get the associated characteristic entity
				const characteristic = basicsCharacteristicCodeLookupService.getItemById(newVal.CharacteristicFk);
				if (characteristic) {

					// characteristic changed?
					if (newVal.CharacteristicFk !== oldVal.CharacteristicFk) {
						// update characteristic data
						$scope.selectedItem.CharacteristicTypeFk = characteristic.CharacteristicTypeFk;
						$scope.selectedItem.Description = characteristic.DescriptionInfo.Description;
						$scope.selectedItem.CharacteristicGroupFk = characteristic.CharacteristicGroupFk;
						$scope.selectedItem.IsReadonly = characteristic.IsReadonly;
						// set default value
						// $scope.selectedItem.ValueText = basicsCharacteristicTypeHelperService.getDefaultValue(characteristic);
						// basicsCharacteristicTypeHelperService.getDefaultValueAsync(characteristic).then(function (value) {
						// $scope.selectedItem.ValueText = value;
						// // refresh grid
						// platformGridAPI.grids.invalidate($scope.gridId);   //  first must call invalidate???
						// platformGridAPI.grids.refresh($scope.gridId);
						// });

						const promises = [];

						promises.push(
							basicsCharacteristicTypeHelperService.getDefaultValueAsync(characteristic).then(function (value) {
								$scope.selectedItem.ValueText = value;
							})
						);

						promises.push(dataService.createChained(characteristic.Id).then(function (count) {
							if (count > 0) {
								refreshGroupTree();
							}
						}));

						$q.all(promises).then(function () {
							platformGridAPI.grids.invalidate($scope.gridId);   //  first must call invalidate???
							platformGridAPI.grids.refresh($scope.gridId);
						});
					}
				}
				// dispatch input
				// basicsCharacteristicTypeHelperService.dispatchValue($scope.selectedItem, $scope.selectedItem.CharacteristicTypeFk);
			}
		}, true);

		const init = function () {
			// load lookup data
			const promiseGroup = basicsCharacteristicPopupGroupService.loadData(sectionId);
			const promiseCode = basicsCharacteristicCodeLookupService.loadData(sectionId);

			dataService.containerId = containerId;

			$q.all([promiseGroup, promiseCode]).then(function () {
				refreshGroupTree();
			});

			// Set uuid to service data
			dataService.setContainerUUID($scope.gridId);
		};
		init();

		const deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't14';
		});
		$scope.tools.items.splice(deleteBtnIdx, 1);


		if (_.isFunction(parentService.setCharacteristicGridReadOnly)) {
			parentService.setCharacteristicGridReadOnly($scope, dataService);
		}

		$scope.$on('$destroy', function () {
			dataService.containerId = null;
			dataService.unregisterSelectionChanged(selectedItemChanged);
			dataService.updateDone.unregister(onUpdateDone);
			groupService.selectionChanged.unregister(groupChanged);
			// platformModuleDataExtensionService.unregisterUpdateDataExtensionEvent(onUpdateRequested);
			parentService.unregisterSelectionChanged(onParentEntityChanged);
		});
	}
})(angular);
