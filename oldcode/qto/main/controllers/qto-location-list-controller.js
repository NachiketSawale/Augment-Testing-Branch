(function () {
	'use strict';

	var moduleName = 'qto.main';
	/**
	 * @ngdoc controller
	 * @name projectMainProjectListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of locations
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('qtoLocationListController',
		['$scope', '$injector', 'platformGridControllerService', 'qtoMainLocationDataService', 'qtoMainLocationUIStandardService',
			'qtoLocationValidationService', 'platformGridAPI', 'qtoMainClipboardService', 'qtoMainHeaderDataService',
			function ($scope, $injector, gridControllerService, dataService, qtoLocationListColumns,
				qtoLocationValidationService, platformGridAPI, qtoMainClipboardService, qtoMainHeaderDataService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
					parentProp: 'LocationParentFk',
					childProp: 'Locations',
					type: 'Locations',
					dragDropService: qtoMainClipboardService
				};

				let isReadonly = false;

				myGridConfig = angular.extend(dataService.getGridConfig(), myGridConfig);

				let onBeforeEditCell = function () {
					return !isReadonly;
				};

				qtoMainHeaderDataService.registerSelectionChanged(selectionChangedCallBack);

				function selectionChangedCallBack(e, selectItem) {
					readOnlyBySystemOption();

					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
					let btnStatus = false;
					if (qtoStatusItem) {
						btnStatus = qtoStatusItem.IsReadOnly;
					}
					updateTools(selectItem, btnStatus);
				}

				function readOnlyBySystemOption() {
					dataService.getLocationReadonlySystemOption().then(
						function (data) {
							isReadonly = !!data;
							dataService.canCreate = dataService.canDelete = dataService.canCreateChild = function () {
								return !isReadonly;
							};
							platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
							platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
						});
				}

				function updateTools(selectItem, btnStatus){
					if (btnStatus) {
						updateTools(true);
						$scope.tools.update();
						dataService.canDelete = function () {
							return false;
						};
					}
					else {
						if(selectItem){
							dataService.canDelete = function () {
								return true;
							};
						}
						else {
							dataService.canDelete = function () {
								return false;
							};
						}
					}
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
					qtoMainHeaderDataService.unregisterSelectionChanged(selectionChangedCallBack);
				});

				gridControllerService.initListController($scope, qtoLocationListColumns, dataService, qtoLocationValidationService, myGridConfig);
			}
		]);
})();