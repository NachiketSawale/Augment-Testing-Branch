/**
 * Created by spr on 2016-09-06.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	const module = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsCommonTranslatePopupController
	 * @description
	 * Controller used for @link Translation popup
	 */
	module.controller('basicsCommonTranslatePopupController', [
		'$scope', '$controller', 'cloudCommonLanguageService', 'cloudCommonLanguageGridConfig', 'platformGridAPI', '$popupInstance', 'basicsCommonTranslatePopupService', 'keyCodes', '_',
		function ($scope, $controller, cloudCommonLanguageService, cloudCommonLanguageGridConfig, platformGridAPI, $popupInstance, basicsCommonTranslatePopupService, keyCodes, _) {

			const gridId = '46fb5ca087f143489d00df22a3a07e84';
			$scope.getContainerUUID = function () {
				return gridId;
			};

			let scope = $scope;
			while (!_.isString(scope.field)) {
				scope = $scope.$parent;
			}
			$scope.selectedField = scope.field;
			$scope.isReadOnly = $scope.$eval(scope.readOnly);

			angular.extend(this, $controller('cloudCommonLanguageGridController', {$scope: $scope}));

			$popupInstance.onResizeStop.register(function () {
				platformGridAPI.grids.resize(gridId);
			});

			if (platformGridAPI.grids.exist(gridId)) {
				const options = platformGridAPI.grids.getOptions(gridId);
				options.editorLock = new TranslateEditorLock();
				options.skipPermissionCheck = true;

				platformGridAPI.events.register(gridId, 'onKeyDown', onKeyDown);
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

			// cloudCommonLanguageService.onLanguageItemChanged.register(dialogConfigurationChanged);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(gridId, 'onKeyDown', onKeyDown);
				platformGridAPI.grids.unregister(gridId);
				// cloudCommonLanguageService.onLanguageItemChanged.unregister(dialogConfigurationChanged);
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