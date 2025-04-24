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
	 * @name basicsCharacteristicPopupCodeController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCharacteristicPopupCodeController',
		basicsCharacteristicPopupCodeController);

	basicsCharacteristicPopupCodeController.$inject = [
		'$scope',
		'$timeout',
		'$injector',
		'basicsCharacteristicCodeLookupService',
		'platformGridAPI',
		'basicsCharacteristicPopupGroupService',
		'cloudCommonGridService',
		'_'];

	function basicsCharacteristicPopupCodeController($scope,
		$timeout,
		$injector,
		basicsCharacteristicCodeLookupService,
		platformGridAPI,
		basicsCharacteristicPopupGroupService,
		cloudCommonGridService,
		_) {

		const settings = {
			columns: [
				// { id: 'id', field: 'Id', name: 'Id', width: 100, readonly: true },
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					editor: null,
					readonly: true,
					width: 100,
					formatter: 'code'
				},
				{
					id: 'description',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					editor: null,
					formatter: 'description',
					readonly: true,
					width: 120
				}
			]
		};

		// not longer used (section id must be passed by basicsCharacteristicCodeLookupService!
		// $scope.getControllerParams = function(sectionId)
		// {
		// // $scope.sectionId = sectionId;
		// };

		const _sectionId = basicsCharacteristicCodeLookupService.sectionId;
		const _removeUsed = basicsCharacteristicCodeLookupService.removeUsed;
		const _characteristicDataService = basicsCharacteristicCodeLookupService.characteristicDataService;

		// scope variables/ functions
		$scope.path = globals.appBaseUrl;
		$scope.error = {};
		$scope.gridId = '7375236d952b4aa3aba4258d63f17576';
		// $scope.entity;

		$scope.gridCodeData = {
			state: $scope.gridId
		};

		$scope.gridTriggersSelectionChange = true;

		if (!settings.isTranslated) {
			// platformTranslateService.translateGridConfig(settings.columns);
			settings.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			const gridConfig = {
				columns: angular.copy(settings.columns),
				data: [],   // basicsCharacteristicCodeLookupService.getList(),
				id: $scope.gridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id',
					iconClass: ''
				}
			};

			// if (gridConfig.iconClass) {
			// gridConfig.options.iconClass = gridConfig.iconClass;
			// }

			platformGridAPI.grids.config(gridConfig);
		}

		// const onGroupChanged = function (selectedGroupEntity) {
		//
		// $timeout(function () {
		// const filteredList = [];
		// if (selectedGroupEntity) {
		// const arr = [];  // id's to show
		// // list without used codes!
		// // const sectionId = basicsCharacteristicCodeLookupService.sectionId;
		// const list = basicsCharacteristicCodeLookupService.getListForLookup($scope.sectionId);
		// // show only characteristics of the selected group
		// getFilter(selectedGroupEntity, arr);
		// filteredList = _.filter(list, function (item) {
		// return arr.indexOf(item.CharacteristicGroupFk) >= 0;
		// });
		// }
		// platformGridAPI.grids.invalidate($scope.gridId);
		// platformGridAPI.items.data($scope.gridId, filteredList);
		// }, 0);
		// };
		// basicsCharacteristicPopupGroupService.onSelectedItemChanged.register(onGroupChanged);

		const onGroupChanged = function (selectedGroupEntity) {

			$timeout(function () {
				let filteredList = [];
				platformGridAPI.grids.invalidate($scope.gridId);
				if (selectedGroupEntity) {
					const arr = [];  // id's to show
					basicsCharacteristicCodeLookupService.getListForLookup(_sectionId, _removeUsed, _characteristicDataService).then(function (data) {  // list without used codes!
						// show only characteristics of the selected group
						getFilter(selectedGroupEntity, arr);
						filteredList = _.filter(data, function (item) {
							return arr.indexOf(item.CharacteristicGroupFk) >= 0;
						});
						platformGridAPI.items.data($scope.gridId, filteredList);
					});
				} else {
					platformGridAPI.items.data($scope.gridId, filteredList);
				}
			}, 0);
		};
		basicsCharacteristicPopupGroupService.onSelectedItemChanged.register(onGroupChanged);

		// recursively get all id's of the current node and all sub-nodes
		function getFilter(item, arr) {

			arr.push(item.Id);
			const len = item.Groups ? item.Groups.length : 0;
			for (let i = 0; i < len; i++) {
				getFilter(item.Groups[i], arr);
			}
		}

		// selected code id (popup close parameter)
		// basicsCharacteristicCodeLookupService.selectedId = null;

		// grid row changed
		function onSelectedRowsChanged(e, args) {

			const items = args.rows.map(function (row) {
				return args.grid.getDataItem(row);
			});

			const selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});

			$scope.gridTriggersSelectionChange = false;
			$scope.entity = _.isArray(selected) ? selected[0] : selected;
			$scope.entities = items || [];
			// basicsCharacteristicCodeLookupService.selectedId = $scope.entity ? $scope.entity.Id : null;  // update current selected id
			$scope.modalOptions.value.selectedId = $scope.entity ? $scope.entity.Id : null;
			$scope.modalOptions.value.selectedIds = _.map($scope.entities, 'Id');

			$scope.gridTriggersSelectionChange = true;
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		function onRefresh() {
			// Refresh discrete value cache data here
			$injector.get('basicsCharacteristicDataDiscreteValueLookupService').getList({
				lookupType: 'basicsCharacteristicDataDiscreteValueLookupService',
				disableDataCaching: true
			});

			basicsCharacteristicCodeLookupService.refresh(_sectionId).then(function () {
				const selectedGroupEntity = basicsCharacteristicPopupGroupService.getSelected();
				let filteredList = [];

				basicsCharacteristicPopupGroupService.setSelected(null);
				basicsCharacteristicPopupGroupService.loadData(_sectionId).then(function () {
					platformGridAPI.grids.invalidate($scope.gridId);

					const groups = [];
					cloudCommonGridService.flatten(basicsCharacteristicPopupGroupService.getList(), groups, 'Groups');

					const newSelectedGroupEntity = selectedGroupEntity ? _.find(groups, {Id: selectedGroupEntity.Id}) : null;
					if (newSelectedGroupEntity) {
						basicsCharacteristicPopupGroupService.setSelected(newSelectedGroupEntity);
						const data = basicsCharacteristicCodeLookupService.getList();
						let characteristicIds2Remove = [];
						if (_removeUsed && _characteristicDataService) {
							const listData = _characteristicDataService.getUnfilteredList ? _characteristicDataService.getUnfilteredList() : _characteristicDataService.getList();
							if (listData) {
								characteristicIds2Remove = _.map(_.filter(listData, function (item) {
									return item.IsReadonly === false && item.CharacteristicGroupFk === newSelectedGroupEntity.CharacteristicGroupFk;
								}), 'CharacteristicFk');
							}
						}
						filteredList = _.filter(data, function (item) {
							return item.CharacteristicGroupFk === newSelectedGroupEntity.CharacteristicGroupFk && item.IsReadonly === false && characteristicIds2Remove.indexOf(item.Id) === -1;
						});

						platformGridAPI.items.data($scope.gridId, filteredList);
					} else {
						platformGridAPI.items.data($scope.gridId, filteredList);
					}
				});
			});
		}

		function init() {
			angular.extend($scope.modalOptions, {
				refresh: onRefresh
			});
		}

		init();

		$scope.$on('$destroy', function () {

			basicsCharacteristicPopupGroupService.onSelectedItemChanged.unregister(onGroupChanged);

			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
		});
	}
})(angular);
