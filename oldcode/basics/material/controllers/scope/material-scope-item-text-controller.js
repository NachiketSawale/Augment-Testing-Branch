/**
 * Created by wui on 10/17/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialScopeItemTextController', [
		'$scope',
		'$sce',
		'$injector',
		'platformGridControllerService',
		'basicsMaterialScopeItemTextValidationService',
		'basicsMaterialItemTextUIStandardService',
		'platformGridAPI',
		/* jshint -W072*/ //many parameters because of dependency injection
		function ($scope,
			$sce,
			$injector,
			gridControllerService,
			validationService,
			uiStandardService,
			platformGridAPI) {
			var dataService = $scope.getContentValue('dataService');
			var getService = $scope.getContentValue('getService');
			var uiService = $scope.getContentValue('uiService');

			if(_.isNil(uiService)){
				uiService = uiStandardService;
			}
			else {
				uiService = $injector.get(uiService);
			}

			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}
			else{
				throw new Error('dataService is missing');
			}

			if(angular.isFunction(dataService)){
				dataService = dataService.call(this);
			}

			if(getService){
				dataService = dataService.getService();
			}

			var gridConfig = {initCalled: false, columns: []},
				parentService = dataService.parentService();

			validationService = validationService(dataService);
			gridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);


			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.currentItem = dataService.getSelected();
			//update changes to currentItem
			var selectedChanged = function selectedChanged(e, item) {
				$scope.currentItem = item;
				if (!item || !item.Id) {
					if (dataService.parentService().getItemName() === 'PrcItemScopeDetail') {
						let prcItemSelected = dataService.parentService().parentService().parentService().getSelected();
						if (!_.isNil(prcItemSelected)) {
							if(!_.isNil(dataService.parentService().getSelected())) {
								$scope.rt$readonly = prcItemSelected.BasItemTypeFk === 7 ? true : false;
								updateTools(prcItemSelected.BasItemTypeFk);
							}else{
								updateTools(7);
							}
						}
					}
					$scope.currentItem = {ContentString: '', PlainText: ''};
				}
				if (angular.isFunction(dataService.getModuleState)) {
					$scope.rt$readonly = !(dataService.getSelected() && dataService.getModuleState());
				}
				else {
					$scope.rt$readonly = !dataService.getSelected();
				}

				if(dataService.parentService().getItemName()==='PrcItemScopeDetail') {
					let prcItemSelected = dataService.parentService().parentService().parentService().getSelected();
					if (!_.isNil(prcItemSelected)) {
						if(!_.isNil(dataService.parentService().getSelected())) {
							$scope.rt$readonly = prcItemSelected.BasItemTypeFk === 7 ? true : false;
							updateTools(prcItemSelected.BasItemTypeFk);
							var textAreaElement = $('#ui-layout-east').find('.ql-editor');
							angular.element(textAreaElement).prop('contentEditable', prcItemSelected.BasItemTypeFk===7 ? false : true);
							let itemList = dataService.getList();
							_.forEach(itemList,(item)=>{
								dataService.readonlyFieldsByItemType(item,prcItemSelected.BasItemTypeFk,dataService.getItemName());
							});
						}
					}
				}

				// $scope.$root.safeApply();
			};

			$scope.onPropertyChanged = function onPropertyChanged() {
				dataService.markCurrentItemAsModified();
			};
			if(dataService.parentService().getItemName()==='PrcItemScopeDetail'){
				dataService.parentService().parentService().parentService().registerSelectionChanged(onParentItemChanged);
				dataService.parentService().parentService().registerSelectionChanged(onParentItemChanged);
				dataService.parentService().registerSelectionChanged(onParentItemChanged);
			}

			function onParentItemChanged() {
				$scope.parentItem=[];
				var parentSelectedItem = dataService.parentService().getSelected();
				if(dataService.parentService().getItemName()==='PrcItemScopeDetail'){
					if(!_.isNil(parentSelectedItem)){
						$scope.parentItem = dataService.parentService().parentService().parentService().getSelected();
						let itemTypeFk = $scope.parentItem.BasItemTypeFk;
						$scope.rt$readonly =$scope.parentItem.BasItemTypeFk === 7 ? true : false;
						var textAreaElement = $('#ui-layout-east').find('.ql-editor');
						angular.element(textAreaElement).prop('contentEditable', $scope.parentItem.BasItemTypeFk===7 ? false : true);
						updateTools(itemTypeFk);
						let itemList = dataService.getList();
						_.forEach(itemList,(item)=>{
							dataService.readonlyFieldsByItemType(item,itemTypeFk,dataService.getItemName());
						});
					}
				}
			}

			if(dataService.parentService().getItemName()==='PrcItemScopeDetail') {
				dataService.updateToolsEvent.register(ItemTypeChange);
			}

			function ItemTypeChange() {
				$scope.parentItem =[];
				var parentSelectedItem = dataService.parentService().getSelected();
				if(dataService.parentService().getItemName() ==='PrcItemScopeDetail'){
					if(!_.isNil(parentSelectedItem)) {
						$scope.parentItem = dataService.parentService().parentService().parentService().getSelected();
						let itemTypeFk = $scope.parentItem.BasItemTypeFk;
						$scope.rt$readonly =$scope.parentItem.BasItemTypeFk === 7 ? true : false;
						var textAreaElement = $('#ui-layout-east').find('.ql-editor');
						angular.element(textAreaElement).prop('contentEditable', $scope.parentItem.BasItemTypeFk===7 ? false : true);
						updateTools(itemTypeFk);
						let itemList = dataService.getList();
						_.forEach(itemList,(item)=>{
							dataService.readonlyFieldsByItemType(item,itemTypeFk,dataService.getItemName());
						});
					}
				}
			}

			function updateTools(itemTypeFk){
				var tools = $scope.tools;
				if(tools) {
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

			selectedChanged(null, $scope.currentItem);

			//inactive current editor, then the current row can be selected.
			$scope.commitEdit = function commitEdit() {
				platformGridAPI.grids.commitEdit($scope.gridId);
			};

			dataService.registerSelectionChanged(selectedChanged);
			parentService.registerSelectionChanged(selectedChanged);

			if (angular.isFunction(dataService.getModuleState)) {
				$scope.rt$readonly = !(dataService.getSelected() && dataService.getModuleState());
			}
			else {
				$scope.rt$readonly = !dataService.getSelected();
			}


			dataService.filterRegistered = false;

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(selectedChanged);
				parentService.unregisterSelectionChanged(selectedChanged);
			});
		}
	]);

})(angular);