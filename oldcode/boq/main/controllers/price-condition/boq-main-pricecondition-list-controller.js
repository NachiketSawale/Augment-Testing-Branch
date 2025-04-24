/**
 * Created by xia on 5/17/2019.
 */
(function () {

	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainPriceconditionListController', BoqMainPriceconditionListController);

	BoqMainPriceconditionListController.$inject = ['$rootScope', '$scope', '$injector', '$translate', 'platformModalService', 'platformGridControllerService', 'boqMainPriceconditionUIStandardService', 'basicsMaterialPriceConditionValidationService'];

	function BoqMainPriceconditionListController($rootScope, $scope, $injector, $translate, platformModalService, platformGridControllerService, boqMainPriceconditionUIStandardService, basicsMaterialPriceConditionValidationService) {

		$scope.options = $scope.options || {};
		$scope.isLoaded = true;

		var gridConfig = {
				initCalled: false,
				columns: []
				// uuid: UUID
			},
			dataService = $scope.options.dataService || $scope.getContentValue('dataService'),
			getService = $scope.getContentValue('getService');

		if (angular.isString(dataService)) {
			dataService = $injector.get(dataService);
		}

		if (angular.isFunction(dataService)) {
			dataService = dataService.call(this);
		}

		if (getService) {
			dataService = dataService.getService();
		}

		$injector.get('boqMainChangeService').setCurrentBoqPriceConditionService(dataService);

		var validationService = basicsMaterialPriceConditionValidationService(dataService);

		dataService.gridRefresh();

		$scope.service = dataService;

		$scope.parentItem = $scope.options.selectedParentItem || dataService.getParentItem();
		$scope.config = {
			rt$readonly: readonly
		};

		$scope.value = $scope.parentItem.PrcPriceConditionFk;

		dataService.getParentService().registerSelectionChanged(onParentItemChanged);
		dataService.getParentService().registerEntityCreated(onParentEntityCreated);

		function onParentItemChanged() {
			setValue(dataService.getParentItem());
		}

		function onParentEntityCreated(arg, entity){
			setValue(entity);
		}

		function setValue(parentEntity){
			$scope.parentItem = parentEntity;
			$scope.value = $scope.parentItem.PrcPriceConditionFk;
		}

		platformGridControllerService.initListController(
			$scope,
			angular.copy(boqMainPriceconditionUIStandardService),
			dataService,
			validationService,
			gridConfig
		);

		$injector.get('boqMainOenService').tryDisableContainer($scope, dataService.getParentService(), true);

		$scope.createItem = function createItem() {
			$scope.service.isLoading = true;

			dataService.canCreate().then(function (response) {
				if (response.data) {
					dataService.createItem().then(function () {
						if (dataService.hasEmptyType) {
							$scope.hasEmptyType = dataService.hasEmptyType();
						}
					});
				} else {
					$scope.service.isLoading = false;
					var message = $translate.instant('basics.material.warning.priceConditionTypeWarningMsg') || 'All pre-defined price condition line types have been listed thus cannot add new record.';
					var title = $translate.instant('basics.material.warning.warningTitle') || 'Warning';
					platformModalService.showMsgBox(message, title, 'warning');
				}
			});
		};

		$scope.deleteItem = function deleteItem() {
			if (dataService.hasSelection()) {
				dataService.deleteItem(dataService.getSelected());

				if (dataService.hasEmptyType) {
					$scope.hasEmptyType = dataService.hasEmptyType();
				}
			}
		};

		function recalculate() {
			$scope.service.isLoading = false;
			dataService.recalculate(dataService.parentService().getSelected(), $scope.parentItem.PrcPriceConditionFk);
		}

		$scope.priceConditionChanged = function () {
			$injector.get('basicsMaterialPriceConditionDataServiceNew').boqPriceConditionItemChanged($scope.parentItem.PrcPriceConditionFk).then(()=>{
				$scope.parentItem.PrcPriceconditionFk = $scope.parentItem.PrcPriceConditionFk;
			});
		};

		$scope.lookupOptions = {
			showClearButton: true
		};

		function watchEntityAction() {
			if($scope.isLoaded) {
				dataService.registerEntityCreated(recalculate);
				dataService.registerEntityDeleted(recalculate);
			}
		}

		function unwatchEntityAction() {
			dataService.unregisterEntityCreated(recalculate);
			dataService.unregisterEntityDeleted(recalculate);
		}

		watchEntityAction();

		dataService.watchEntityAction = watchEntityAction;
		dataService.unwatchEntityAction = unwatchEntityAction;


		// region For Bulk Edit Price Condition Prepare Handling

		let parentService = dataService.getParentService();
		let headService = parentService.getHeaderService();
		let doPrepareUpdateCall = headService.doPrepareUpdateCall;
		let unregisterUpdateEvent = null;

		/**
		 * Bulk update boq price conditions prepare handling
		 * @param isDestroy
		 */
		function doPrepareBulkUpdateCall (isDestroy) {
			if(isDestroy) {
				// unregister update done event and clear the event
				if (unregisterUpdateEvent) {
					unregisterUpdateEvent();
					unregisterUpdateEvent = null;
				}
				// restore the original prepare update call
				headService.doPrepareUpdateCall = doPrepareUpdateCall;
				return;
			}
			/**
			 * Prepare update call for bulk update
			 * @param updateData
			 */
			headService.doPrepareUpdateCall = function (updateData) {
				// call the original prepare update call
				if (doPrepareUpdateCall) {
					doPrepareUpdateCall(updateData);
				}
				// check if has bulk edit price condition update
				if (updateData.hasBulkEditPriceConditionUpdate) {
					var parentData = dataService.getParentDataContainer();
					if (parentData) {
						// closed the update on boq container selection changing before bulk update
						parentData.data.supportUpdateOnSelectionChanging = false;
					}
					if (!unregisterUpdateEvent) {
						// register update done event before bulk update
						unregisterUpdateEvent = $rootScope.$on('updateDone', () => {
							// reload the price condition data after update
							dataService.load().then(function () {
								// open the update on boq container selection changing after bulk update
								if (parentData) {
									parentData.data.supportUpdateOnSelectionChanging = true;
								}
								if (unregisterUpdateEvent) {
									unregisterUpdateEvent();
									unregisterUpdateEvent = null;
								}
							});
						});
					}
					dataService.clearCache();
				}
			};
		}
		doPrepareBulkUpdateCall();
		// endregion

		$scope.$on('$destroy', function () {
			$scope.isLoaded = false;
			unwatchEntityAction();
			dataService.getParentService().unregisterSelectionChanged(onParentItemChanged);
			doPrepareBulkUpdateCall(true);
		});

		// //////////////
		function readonly() {
			var selected = dataService.getParentItem();
			if (angular.isFunction(dataService.getReadOnly)) {
				return !(((selected && angular.isDefined(selected.Id))) && !dataService.getReadOnly());
			} else {
				return !(selected && angular.isDefined(selected.Id));
			}
		}
	}
})();