(function () {
	'use strict';

	angular.module('project.main').factory('projectBillToSettingService', [
		'$http',
		'$translate',
		'platformRuntimeDataService',
		function (
			$http,
			$translate,
			platformRuntimeDataService
		) {
			let service = {};
			service.initBillToSetting = function initBillToSetting(scope, dataService, parentService)
			{
				scope.quantityItemBase = $translate.instant('project.main.quantityItemBase');
				scope.percentageBased = $translate.instant('project.main.percentageBased');
				scope.currentItem = scope.currentItem || {};
				scope.QuantityItemBaseReadOnly = true;
				scope.currentItem.quantityItemBase = false;
				scope.PercentageBasedReadOnly = true;
				scope.currentItem.percentage = false;

				function updateBillToSettingLoaded() {
					if(parentService != null){
						let parentSelected  = parentService.getSelectedEntities()[0];
						if(parentSelected != null){
							scope.currentItem.quantityItemBase = !parentSelected.IsPercentageBased;
							scope.currentItem.percentage = parentSelected.IsPercentageBased;
							let dataList = dataService.getList();
							if(dataList.length > 0){
								let allItemsHaveVersionGreaterThanZero = dataList.every(item => item.Version > 0);
								if (allItemsHaveVersionGreaterThanZero) {
									scope.QuantityItemBaseReadOnly = true;
									scope.PercentageBasedReadOnly = true;
								}
							} else {
								scope.QuantityItemBaseReadOnly = false;
								scope.PercentageBasedReadOnly = false;
							}
						}
					}
				}

				scope.handleExclusiveCheckboxChange = function(changedItem) {
					if (changedItem === 'quantityItemBase') {
						if (scope.currentItem.quantityItemBase) {
							scope.currentItem.percentage = false;
						}else{
							scope.currentItem.quantityItemBase = true;
						}
					} else if (changedItem === 'percentageBased') {
						if (scope.currentItem.percentage) {
							scope.currentItem.quantityItemBase = false;
						}else{
							scope.currentItem.percentage = true;
						}
					}
				};

				scope.handleQuantityItemBaseChange = function(isChecked, changedItem){
					scope.handleExclusiveCheckboxChange(changedItem);
					let parentSelected  = parentService.getSelectedEntities()[0];
					let dataSelected = dataService.getSelected();
					if(parentSelected != null){
						parentSelected.IsPercentageBased = !isChecked;

						if(isChecked === true){
							platformRuntimeDataService.readonly(dataSelected, [
								{field: 'QuantityPortion', readonly:true}
							]);
						}else{
							platformRuntimeDataService.readonly(dataSelected, [
								{field: 'QuantityPortion', readonly:false}
							]);
						}
						dataService.fireItemModified(dataSelected);
						dataService.gridRefresh();
						parentService.markItemAsModified(parentSelected);
					}
				};

				scope.handlePercentageBasedChange = function(isChecked, changedItem){
					scope.handleExclusiveCheckboxChange(changedItem);
					let parentSelected  = parentService.getSelectedEntities()[0];
					let dataSelected = dataService.getSelected();
					if(parentSelected != null){
						parentSelected.IsPercentageBased = isChecked;
					}
					if(isChecked === true){
						platformRuntimeDataService.readonly(dataSelected, [
							{field: 'QuantityPortion', readonly:false}
						]);
					}else{
						platformRuntimeDataService.readonly(dataSelected, [
							{field: 'QuantityPortion', readonly:true}
						]);
					}
					dataService.fireItemModified(dataSelected);
					dataService.gridRefresh();
					parentService.markItemAsModified(parentSelected);
				};

				dataService.registerListLoaded(updateBillToSettingLoaded);
				scope.$on('$destroy', function () {
					dataService.unregisterListLoaded(updateBillToSettingLoaded);
				});

			}
			return service;
		}
	]);
})();