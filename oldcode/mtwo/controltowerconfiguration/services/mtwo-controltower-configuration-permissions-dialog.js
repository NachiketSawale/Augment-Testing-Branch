/**
 * Created by waldrop on 9/23/2019
 */

(function (angular) {

	'use strict';
	/* globals globals */
	var moduleName = 'mtwo.controltowerconfiguration';

	/**
	 * @ngdoc service
	 * @name mtwoControltowerContainerInformationService
	 * @description provides information on container used in mtwo controltower module
	 */
	angular.module(moduleName).service('mtwoControlTowerConfigurationPermissionsDialog', MtwoControlTowerConfigurationPermissionsDialog);

	MtwoControlTowerConfigurationPermissionsDialog.$inject = [
		'platformTranslateService',
		'platformDialogService',
		'platformGridAPI',
		'$timeout',
		'cloudDesktopModuleService',
		'$q',
		'_'];

	function MtwoControlTowerConfigurationPermissionsDialog(
		platformTranslateService,
		platformDialogService,
		platformGridAPI,
		$timeout,
		cloudDesktopModuleService,
		$q,
		_) {

		var dataService = createDataService();

		platformTranslateService.registerModule('mtwo.controltowerconfiguration');

		return {
			showDialog: function (structures, dialogOptions) {
				dialogOptions = dialogOptions || {};

				var showOptions = {
				/*	headerText: getTitle(dialogOptions),*/
					width: '600px',
					height: '600px',
					templateUrl: globals.appBaseUrl + '/mtwo.controltowerconfiguration/templates/mtwo-controltower-configuration-select-modules-template.html',
					backdrop: false,
					structures: structures,
					resizeable: true,
					controller: dialogController(structures, dialogOptions, dataService)
				};
				return platformDialogService.showDialog(showOptions);
			}
		};

		function getGridConfig(scope) {
			var gridColumns = [
				{
					id: 'IsSelected',
					field: 'IsSelected',
					name: 'Selected',
					formatter: 'boolean',
					cssClass: 'cell-center',
					editor: 'boolean',
					width: 80
				},
				{id: 'Description', field: 'Description', name: 'Description', width: 200}
			];


			return {
				id: scope.gridId,
				columns: platformTranslateService.translateGridConfig(angular.copy(gridColumns)),
				data: [],
				options: {
					indicator: true,
					iconClass: 'controls-icons',
					idProperty: 'Id',
					tree: false
				},
				lazyInit: true
			};
		}

		function createDataService() {
			var $cacheData = [],$targetTree = [];

			//var url = globals.webApiBaseUrl + 'usermanagement/main/right/treeComplete';
			return {

				search: function (entity,filter) {
					var defer = $q.defer();
					cloudDesktopModuleService.getModules().then(function (response) {
						var result=response;
						if(filter &&response &&response.length>0)
						{
							result=[];
							for (var i = 0; i < response.length; i++) {
								var item = response[i];
								if (item.displayName.toLowerCase().indexOf(filter.toLowerCase())!==-1) {
									result.push(item);
								}
							}
						}
						$cacheData = processItem(result);
						defer.resolve($cacheData);
					});
					return defer.promise;
				},
				getResult: function getResult() {
					var checkItems = [];
					var itemResult = function (entity) {
						if (Object.prototype.hasOwnProperty.call(entity, 'IsSelected') && entity.IsSelected !== false) {
							checkItems.push(entity);
						}

					};
					$cacheData.forEach(itemResult);
					return checkItems;
				},
				getTree: function () {
					return $cacheData;
				},
				getList: function (filter) {
					return toList($cacheData, filter);
				}

			};

			function processItem(data) {


				return _.map(data, function (mu) {

					return {
						Id: mu.id,
						Description: mu.displayName
					};
				});

			}

			function toList(items, filter) {
				var result = [];
				filter = filter || function () {
					return true;
				};
				items = items || [];
				for (var i = 0; i < items.length; i++) {
					if (filter(items[i])) {
						result.push(items[i]);
					}
					result.push.apply(result, toList(items[i], filter));
				}
				return result;
			}
		}

		function dialogController(entities, option, dataService) {

			return ['$scope', 'keyCodes', function ($scope, keyCodes) {

				$scope.gridId = option.Id || 'structure.selected';
				$scope.gridData = {state: $scope.gridId};
				$scope.title = 'Select Modules';

				$scope.buttons = [
					{
						context$tr$: 'cloud.common.ok', execute: function () {
							$scope.$close({isOk: true, data: dataService.getResult()});
						}
					},
					{
						context$tr$: 'cloud.common.cancel', execute: function () {
							$scope.$close({isOk: false, isCancel: true});
						}
					}
				];

				$scope.search = function (filter, event) {
					if (!event || event.keyCode === keyCodes.ENTER) {
						dataService.search(angular.copy(entities), filter).then(function () {
							platformGridAPI.items.data($scope.gridId, dataService.getTree());
						/*	if (filter) {
								platformGridAPI.rows.expandAllNodes($scope.gridId);
							}*/
						});
					}
				};

				$scope.onBeforeEditCell = function onBeforeEditCell(e, arg) { // can not select item whose 'IsLive' is false.
					return !arg.item.IsLive;
				};

				$scope.onCellChange = function onCellChange(e, arg) {
					if (arg.grid.getColumns()[arg.cell].id === 'IsSelected') {
						/* dataService.setChild(arg.item, arg.item.IsSelected);
						dataService.setParent(arg.item, arg.item.IsSelected); */
						platformGridAPI.items.data($scope.gridId, dataService.getTree());
					}
				};

				$scope.onRenderCompleted = function onRenderCompleted() {
					var items = dataService.getList(function (item) {
						return item.IsSelected === null;
					});
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					var cell = grid.instance.getColumnIndex('IsSelected');

					angular.forEach(items, function setIndeterminate(item) {
						var row = grid.dataView.getRowById(item.Id);
						var element = grid.instance.getCellNode(row, cell);
						if ((row || row === 0) && element) {
							element.find('input').attr('checked', false).prop('indeterminate', true);
						}
					});
				};

				platformGridAPI.grids.config(getGridConfig($scope));
				$timeout(function () {
					platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', $scope.onBeforeEditCell);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', $scope.onCellChange);
					platformGridAPI.grids.element('id', $scope.gridId).instance.onRenderCompleted.subscribe($scope.onRenderCompleted);
				}, 500);
				$scope.$on('$destroy', function () {
					platformGridAPI.grids.element('id', $scope.gridId).instance.onRenderCompleted.unsubscribe($scope.onRenderCompleted);
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', $scope.onBeforeEditCell);
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', $scope.onCellChange);
					platformGridAPI.grids.unregister($scope.gridId);
				});

				setTimeout(function () {
					$scope.search();
				}, 0);
			}];
		}
	}

})(angular);
