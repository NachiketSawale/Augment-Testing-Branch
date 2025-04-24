(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/* jshint -W072*/ //many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialPriceConditionController', [
		'$scope',
		'$translate',
		'$timeout',
		'$injector',
		'platformGridControllerService',
		'basicsPriceConditionStandardConfigurationService',
		'basicsMaterialPriceConditionValidationService',
		'platformGridAPI',
		'platformModalService',
		function ($scope,
		          $translate,
		          $timeout,
		          $injector,
		          platformGridControllerService,
		          gridColumns,
		          validationService,
		          platformGridAPI,
		          platformModalService) {

			$scope.options = $scope.options || {};

			$scope.isLoaded = true;

			//var UUID = '20BAEE86684C46F4AFB48B166E2E3447';

			var gridConfig = {
					initCalled: false,
					columns: []
					//uuid: UUID
				},
				dataService = $scope.options.dataService || $scope.getContentValue('dataService'),
				getService = $scope.getContentValue('getService');

			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}

			if(angular.isFunction(dataService)){
				dataService = dataService.call(this);
			}

			if(getService){
				dataService = dataService.getService();
			}

			validationService = validationService(dataService);

			//dataService.updateOnCommit = true;

			dataService.gridRefresh();

			// var dataState = dataService.copyDataState();

			$scope.service = dataService;

			// $scope.onContentResized = function () {
			// 	$timeout(function () {
			// 		platformGridAPI.grids.resize($scope.getContainerUUID());
			// 	});
			// };

			$scope.parentItem = $scope.options.selectedParentItem || dataService.getParentItem();
			$scope.config = {
				rt$readonly: readonlyEnhance
			};

			function readonlyEnhance() {
				let resultReadonly=readonly();
				let resultItemTypeEdit=canItemTypeEdit();
				let resultFinal=resultReadonly||resultItemTypeEdit
				return resultFinal;
			}

			function canItemTypeEdit() {
				var parentSelectedItem;
				var isReadonly = false;
				var itemName = dataService.getParentService().getItemName();
				if(itemName ==='PrcItem'){
					parentSelectedItem = dataService.getParentService().getSelected();
				}else if(itemName ==='PrcItemScopeDetail'){
					parentSelectedItem = dataService.getParentService().parentService().parentService().getSelected();
				}else if(itemName==='Item') {
					parentSelectedItem = dataService.getParentService().getSelected();
				}
				if(!_.isNil(parentSelectedItem)) {
					let itemTypeFk = parentSelectedItem.BasItemTypeFk;
					if(itemTypeFk === 7){
						let itemList = dataService.getList();
						_.forEach(itemList,(item)=>{
							dataService.readonlyFieldsByItemType(item,itemTypeFk);
						});
						isReadonly = true;
					}
				}
				return isReadonly;
			}

			function updateTools(itemTypeFk){
				var enable = false;
				if(dataService.getParentService().getItemName()==='Item'){
					if(itemTypeFk ===7){
						$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('input').attr('disabled','disabled');
						$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('button').attr('disabled','disabled');
					}
					var tools = $scope.tools;
					if (tools) {
						_.forEach($scope.tools.items, (item) => {
							if (item.id === 'create' || item.id === 'delete') {
								if (itemTypeFk === 7) {
									item.disabled = true;
								} else {
									item.disabled = false;
								}
							}
						});
						$scope.tools.update();
					}
				}else {
					enable = dataService.getParentService().getReadOnly();
					if (enable) {
						dataService.canCreate();
					} else {
						var tools = $scope.tools;
						if (tools) {
							_.forEach($scope.tools.items, (item) => {
								if (item.id === 'create' || item.id === 'delete') {
									if (itemTypeFk === 7) {
										item.disabled = true;
									} else {
										item.disabled = false;
									}
								}
							});
							$scope.tools.update();
						}
					}
				}
			}


			$scope.value = $scope.parentItem.PrcPriceConditionFk;


			if(dataService.getParentService().getItemName()==='PrcItemScopeDetail'){
				dataService.getParentService().parentService().parentService().registerSelectionChanged(onParentItemChanged);
				dataService.getParentService().parentService().registerSelectionChanged(onParentItemChanged);
				dataService.getParentService().registerSelectionChanged(onParentItemChanged);
			}else{
				dataService.getParentService().registerSelectionChanged(onParentItemChanged);
			}

			function onParentItemChanged() {
				$scope.parentItem=[];
				var parentSelectedItem = dataService.getParentService().getSelected();
				if(dataService.getParentService().getItemName()==='PrcItemScopeDetail'){
					if(!_.isNil(parentSelectedItem)){
						$scope.parentItem = dataService.getParentService().parentService().parentService().getSelected();
					}else{
						updateTools(7);
					}
				}else if(dataService.getParentService().getItemName()==='Item'){
					$scope.parentItem = dataService.getParentItem();
					dataService.readBasItemTypeFk($scope.parentItem).then((item)=>{
						if(!_.isNil(item.data)){
							if(item.data.BasItemTypeFk === 7){
								dataService.canEdit = false;
								updateTools(item.data.BasItemTypeFk);
							}else{
								dataService.canEdit = true;
								$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('input').removeAttr('disabled');
								$($('.cid_fb2e7177d6c041d384f8b3009351840d').find('[data-ng-model="parentItem.PrcPriceConditionFk"]')).find('button').removeAttr('disabled');
							}
						}
					});
				}else {
					$scope.parentItem = dataService.getParentItem();
				}
				if($scope.parentItem) {
					if ($scope.parentItem.hasOwnProperty('BasItemTypeFk')) {
						let itemTypeFk = $scope.parentItem.BasItemTypeFk;
						updateTools(itemTypeFk);
					}
					$scope.value = $scope.parentItem.PrcPriceConditionFk;
				}
			}

			function ItemTypeChange() {
				$scope.parentItem =[];
				if(dataService.getParentService().getItemName() ==='PrcItem'){
					$scope.parentItem = dataService.getParentService().getSelected();
				}else if(dataService.getParentService().getItemName() ==='PrcItemScopeDetail'){
					$scope.parentItem =dataService.getParentService().parentService().parentService().getSelected();
				}
				if(!_.isNil($scope.parentItem)) {
					let itemTypeFk = $scope.parentItem.BasItemTypeFk;
					updateTools(itemTypeFk);
					let itemList = dataService.getList();
					_.forEach(itemList,(item)=>{
						dataService.readonlyFieldsByItemType(item,itemTypeFk);
					});
				}
			}
			if(dataService.getItemName()==='PrcItemScopeDetailPc' || dataService.getItemName()==='PriceCondition' || dataService.getItemName()==='PesItemPriceCondition') {
				dataService.updateToolsEvent.register(ItemTypeChange);
			}

			platformGridControllerService.initListController(
				$scope,
				angular.copy(gridColumns),
				dataService,
				validationService,
				gridConfig
			);

			$scope.createItem = function createItem() {
				$scope.service.isLoading = true;

				dataService.canCreate().then(function (response) {
					if (response.data) {
						dataService.createItem().then(function () {
							if (dataService.hasEmptyType) {
								$scope.hasEmptyType = dataService.hasEmptyType();
							}
						});
					}
					else {
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

			// $scope.isDiabledDelete = function () {
			// 	return !dataService.hasSelection();
			// };

			function recalculate() {
				$scope.service.isLoading = false;
				dataService.recalculate(dataService.parentService().getSelected(), $scope.parentItem.PrcPriceConditionFk);
			}

			$scope.priceConditionChanged = function () {
				unwatchEntityAction();
				dataService.reload($scope.parentItem, $scope.parentItem.PrcPriceConditionFk).finally(watchEntityAction);
				$scope.parentItem.PrcPriceconditionFk = $scope.parentItem.PrcPriceConditionFk;
			};

			// $scope.onOK = function () {
			// 	//platformGridAPI.grids.commitEdit($scope.gridId);
			// 	//dataService.updateOnCommit = false;
			// 	dataService.recalculate($scope.parentItem, $scope.parentItem.PrcPriceConditionFk).then(function () {
			// 		$scope.$close(true, $scope.parentItem.PrcPriceConditionFk);
			// 	});
			// };

			// $scope.onCancel = function () {
			// 	//platformGridAPI.grids.commitEdit($scope.gridId);
			// 	dataService.restoreDataState(dataState);
			// 	$scope.$close(false);
			// };

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

			$scope.$on('$destroy', function () {
				//platformGridAPI.grids.unregister($scope.getContainerUUID());
				// dataService.updateOnCommit = false;
				$scope.isLoaded = false;
				unwatchEntityAction();
				dataService.getParentService().unregisterSelectionChanged(onParentItemChanged);
			});

			////////////////
			function readonly(){
				var selected = dataService.getParentItem();
				if(angular.isFunction(dataService.getReadOnly)){
					return !(((selected && angular.isDefined(selected.Id))) && !dataService.getReadOnly());
				}else {
					return !(selected && angular.isDefined(selected.Id));
				}
			}
		}
	]);
})(angular);