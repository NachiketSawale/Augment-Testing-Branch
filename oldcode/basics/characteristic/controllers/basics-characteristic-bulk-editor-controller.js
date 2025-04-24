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
	angular.module(moduleName).controller('basicsCharacteristicBulkEditorController',
		basicsCharacteristicBulkEditorController);

	basicsCharacteristicBulkEditorController.$inject = [
		'$scope',
		'$q',
		'$timeout',
		'platformGridAPI',
		'basicsCharacteristicCodeLookupService',
		'platformSchemaService',
		'platformUIConfigInitService',
		'basicsCharacteristicDataLayoutServiceFactory',
		'basicsCharacteristicDataTranslationService',
		'basicsCharacteristicBulkEditorService',
		'basicsLookupdataLookupFilterService',
		'basicsCharacteristicTypeHelperService',
		'$translate',
		'_'];

	function basicsCharacteristicBulkEditorController($scope,
		$q,
		$timeout,
		platformGridAPI,
		basicsCharacteristicCodeLookupService,
		platformSchemaService,
		platformUIConfigInitService,
		layoutServiceFactory,
		translationService,
		basicsCharacteristicBulkEditorService,
		basicsLookupdataLookupFilterService,
		basicsCharacteristicTypeHelperService,
		$translate,
		_) {

		$scope.isBusy = false;
		$scope.busyInfo = '';

		function busyStatusChanged(newStatus) {
			$scope.isBusy = newStatus;
		}

		basicsCharacteristicBulkEditorService.busyStatusChanged.register(busyStatusChanged);

		const _params = $scope.$parent.modalOptions.params;
		const _sectionId = _params.sectionId;
		$scope.selectedItem = null; // selected characteristic data item (needed for watching!)

		$scope.gridId = _params.gridId;

		const layoutParams = {};
		layoutParams.serviceId = 'basicsCharacteristicBulkEditorLayoutService';
		layoutParams.sectionId = _sectionId;
		layoutParams.removeUsedCodes = true;
		layoutParams.discreteValueLookupFilter = 'basicsCharacteristicBulkEditorDiscreteValueLookupFilter';
		layoutParams.characteristicDataService = basicsCharacteristicBulkEditorService;
		const layoutService = layoutServiceFactory.getService(_sectionId, layoutParams);

		const domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'CharacteristicDataDto',
			moduleSubModule: 'Basics.Characteristic'
		});
		const config = platformUIConfigInitService.provideConfigForListView(layoutService.getLayout(), domainSchema.properties, translationService);

		const _userInput = {};
		_userInput.data = [];

		$scope.recordsAffected = _params.objectFks.length;
		$scope.recordsAffectedMsg = _params.objectFks.length + ' ' + $translate.instant('basics.characteristic.recordsAffectedMsg');

		$scope.gridData = {
			state: $scope.gridId
		};

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			const grid = {
				data: _userInput.data,
				columns: angular.copy(config.columns),
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					iconClass: '',
					// idProperty: 'ID'
					enableDraggableGroupBy: false
				},
				lazyInit: true,
				enableConfigSave: false
			};
			platformGridAPI.grids.config(grid);
		}
		const refreshGrid = function () {
			platformGridAPI.items.data($scope.gridId, _userInput.data);
		};

		$scope.createItem = function () {
			_userInput.data.push({
				Id: _userInput.data.length + 1,
				CharacteristicFk: 0,
				Description: ''
			});
			refreshGrid();
		};

		$scope.deleteItem = function () {
			const selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
			if (selectedItems) {
				const allItems = basicsCharacteristicBulkEditorService.getList();
				angular.forEach(selectedItems, function (item) {
					// allItems.splice(_.indexOf(selectedItems, _.find(selectedItems, function(o) { return o.Id === item.Id; } )));
					const index = allItems.findIndex(function (o) {
						return o.Id === item.Id;
					});
					allItems.splice(index, 1);
				});
				refreshGrid();
			}
		};

		// Define standard toolbar Icons and their function on the scope
		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't1',
					sort: 0,
					caption: 'cloud.common.taskBarNewRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-new',
					fn: $scope.createItem,
					disabled: false
				},
				{
					id: 't2',
					sort: 10,
					caption: 'cloud.common.taskBarDeleteRecord',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-delete',
					fn: $scope.deleteItem,
					disabled: function () {
						return false;
					}
				}
			]
		};

		const filters = [
			{
				key: 'basicsCharacteristicBulkEditorDiscreteValueLookupFilter',
				serverSide: false,
				fn: function (item) {

					const selectedEntities = platformGridAPI.rows.selection({gridId: $scope.gridId});
					const selectedItem = _.isArray(selectedEntities) ? selectedEntities[0] : selectedEntities;

					return selectedItem && selectedItem.CharacteristicFk === item.CharacteristicFk;
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		function onSelectedRowsChanged() {

			const selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
			if (selectedItems && selectedItems.length > 0) {
				$scope.selectedItem = selectedItems[0];
			}
		}

		// watch changes of the current characteristic data item
		$scope.$watch('selectedItem', function (newVal, oldVal) {

			// ignore initial call
			if (!newVal) {
				return;
			}

			// ignore row changes and unchanged characteristics
			if (oldVal === null || (newVal.Id === oldVal.Id && newVal.CharacteristicFk !== oldVal.CharacteristicFk)) {

				// get the associated characteristic entity
				basicsCharacteristicTypeHelperService.mergeCharacteristic($scope.selectedItem, newVal.CharacteristicFk);
				// refresh grid
				platformGridAPI.grids.invalidate($scope.gridId);   //  first must call invalidate???
				platformGridAPI.grids.refresh($scope.gridId);
			}

		}, true);

		const init = function () {
			// load lookup data
			// const promiseGroup = basicsCharacteristicPopupGroupService.loadData(sectionId);
			// const promiseCode = basicsCharacteristicCodeLookupService.loadData(sectionId);
			//
			// $q.all([promiseGroup, promiseCode]).then(function () {
			// refreshGroupTree();
			// });
		};
		init();

		$scope.canStart = function () {
			const list = basicsCharacteristicBulkEditorService.getList();
			return list && list.length > 0;
		};

		$scope.okClicked = function () {
			platformGridAPI.grids.commitAllEdits();
			_params.values = _userInput.data;
			basicsCharacteristicBulkEditorService.setCharacteristics(_params).then(function () {
				return $timeout(function () {
					basicsCharacteristicBulkEditorService.showSuccessMessage();
					$scope.close(true);
					if(_params.parentService && _params.parentService.refreshSelectedEntities){
						_params.parentService.refreshSelectedEntities();
					}
				}, 0);
			});
		};

		$scope.close = function (success) {
			$scope.$parent.$close(success || false);
		};

		$scope.$on('$destroy', function () {
			// groupService.selectionChanged.unregister(groupChanged);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		});

		$scope.modalOptions.headerText = $translate.instant('basics.characteristic.title.bulkEditorPopup');

	}
})(angular);
