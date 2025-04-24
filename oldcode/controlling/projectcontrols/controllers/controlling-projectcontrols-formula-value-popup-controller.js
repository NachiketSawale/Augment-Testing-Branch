
(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'controlling.projectcontrols';

	const module = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingProjectcontrolsFormulaValuePopupController
	 */
	module.controller('controllingProjectcontrolsFormulaValuePopupController', [
		'$scope', 'controllingProjectControlsConfigService', 'platformGridControllerService', 'platformGridAPI', 'controllingProjectcontrolsDashboardService', '$popupInstance', 'keyCodes', '$injector',
		function ($scope, controllingProjectControlsConfigService, platformGridControllerService, platformGridAPI, theService, $popupInstance, keyCodes, $injector) {

			$scope.gridId = '9d96d9d0db5d414f9e9a41462d691cab';
			$scope.getContainerUUID = function () {
				return $scope.gridId;
			};

			let scope = $scope;
			while (!_.isString(scope.field)) {
				scope = $scope.$parent;
			}
			$scope.selectedField = scope.field;
			$scope.isReadOnly = $scope.$eval(scope.readOnly);

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.gridColums = [{
				id: 'period',
				field: 'Period',
				name$tr$: 'controlling.projectcontrols.period',
				width: 100
			}];

			let config = controllingProjectControlsConfigService.getFormulaConfig($scope.selectedField);
			if(config){
				$scope.data = theService.getSACValueList(theService.getSelected(), config.Id);
				$scope.gridColums.push({
					id: config.Code.trim(),
					field: 'Value',
					description: config.DescriptionInfo,
					name: config.DescriptionInfo ? ( config.DescriptionInfo.Translated ? config.DescriptionInfo.Translated : config.DescriptionInfo.Description ) : config.Code.trim(),
					width: 100,
					formatter: 'money',
					editor: 'money',
					readonly: false
				});
			}

			// scope variables/ functions
			$scope.path = globals.appBaseUrl;

			// init grid if not already done....
			const gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
			if (!gridInstance) {
				const grid = {
					data: $scope.data,
					columns: $scope.gridColums,
					id: $scope.gridId,
					options: {tree: false, indicator: true}
				};
				platformGridAPI.grids.config(grid);
			}

			if (_.isFunction($scope.onContentResized)) {
				$scope.onContentResized(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			$popupInstance.onResizeStop.register(function () {
				platformGridAPI.grids.resize($scope.gridId);
			});

			if (platformGridAPI.grids.exist($scope.gridId)) {
				const options = platformGridAPI.grids.getOptions($scope.gridId);
				options.editorLock = new TranslateEditorLock();
				options.skipPermissionCheck = true;

				platformGridAPI.events.register($scope.gridId, 'onKeyDown', onKeyDown);
			}

			function onKeyDown(event) {
				const prevent = function () {
					event.preventDefault();
					event.stopPropagation();
				};

				switch (event.keyCode) {
					case keyCodes.ESCAPE: {
						prevent();
						if (_.isFunction($scope.focusOnElement)) {
							$scope.focusOnElement();
						}
						$scope.$destroy();
						break;
					}
				}
			}

			function onCellChange(e, arg) {
				let field = $scope.selectedField;
				let selectedVersion = theService.getHistoryVersions(),
					sacItem = arg.item,
					selectedDashboardItem = theService.getSelected(),
					inField = field + '_IN_RP',
					toField = field + '_TO_RP';

				if(sacItem.Period === selectedVersion.datePeriod){
					selectedDashboardItem[field] = selectedDashboardItem[inField] = sacItem.Value;
				}

				let toFieldValue = 0;
				if(_.isArray($scope.data)){
					_.forEach($scope.data,function(item){
						toFieldValue += (_.isNumber(_.toNumber(item.Value)) ? _.toNumber(item.Value) * 100 : 0);
					});
				}
				selectedDashboardItem[toField] = toFieldValue / 100;

				theService.markSACItemAsModified(selectedDashboardItem, sacItem);
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onKeyDown', onKeyDown);
				platformGridAPI.grids.unregister($scope.gridId);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				if ($scope.$close) {
					$scope.$close();
				}
			});

			function TranslateEditorLock() {
				let activeEditController = null;

				/***
				 * Returns true if a specified edit controller is active (has the edit lock).
				 * If the parameter is not specified, returns true if any edit controller is active.
				 * @method isActive
				 * @param editController
				 * @return {Boolean}
				 */
				this.isActive = function (editController) {
					return (editController ? activeEditController === editController : activeEditController !== null);
				};

				/***
				 * Sets the specified edit controller as the active edit controller (acquire edit lock).
				 * If another edit controller is already active, and exception will be thrown.
				 * @method activate
				 * @param editController edit controller acquiring the lock
				 */
				this.activate = function (editController) {
					if (editController === activeEditController) { // already activated?
						return;
					}
					if (activeEditController !== null) {
						throw 'SlickGrid.EditorLock.activate: an editController is still active, can\'t activate another editController';
					}
					if (!editController.commitCurrentEdit) {
						throw 'SlickGrid.EditorLock.activate: editController must implement .commitCurrentEdit()';
					}
					if (!editController.cancelCurrentEdit) {
						throw 'SlickGrid.EditorLock.activate: editController must implement .cancelCurrentEdit()';
					}
					activeEditController = editController;
				};

				/***
				 * Unsets the specified edit controller as the active edit controller (release edit lock).
				 * If the specified edit controller is not the active one, an exception will be thrown.
				 * @method deactivate
				 * @param editController edit controller releasing the lock
				 */
				this.deactivate = function (editController) {
					if (activeEditController !== editController) {
						throw 'SlickGrid.EditorLock.deactivate: specified editController is not the currently active one';
					}
					activeEditController = null;
				};

				/***
				 * Attempts to commit the current edit by calling "commitCurrentEdit" method on the active edit
				 * controller and returns whether the commit attempt was successful (commit may fail due to validation
				 * errors, etc.).  Edit controller's "commitCurrentEdit" must return true if the commit has succeeded
				 * and false otherwise.  If no edit controller is active, returns true.
				 * @method commitCurrentEdit
				 * @return {Boolean}
				 */
				this.commitCurrentEdit = function () {
					return (activeEditController ? activeEditController.commitCurrentEdit() : true);
				};

				/***
				 * Attempts to cancel the current edit by calling "cancelCurrentEdit" method on the active edit
				 * controller and returns whether the edit was successfully cancelled.  If no edit controller is
				 * active, returns true.
				 * @method cancelCurrentEdit
				 * @return {Boolean}
				 */
				this.cancelCurrentEdit = function cancelCurrentEdit() {
					return (activeEditController ? activeEditController.cancelCurrentEdit() : true);
				};
			}

		}
	]);

})(angular);