/**
 * Created by lvy on 5/9/2018.
 */
(function(angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,$ */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('constructionSystemMainInstanceHeaderParameterFormController', constructionSystemMainInstanceParameterFormController);
	constructionSystemMainInstanceParameterFormController.$inject = [
		'$scope',
		'platformDetailControllerService',
		'constructionSystemMainInstanceHeaderParameterService',
		'constructionSystemMainInstanceHeaderParameterUIConfigService',
		'basicsLookupdataLookupDescriptorService',
		'constructionSystemMainInstanceHeaderParameterFormatterProcessor'];
	function constructionSystemMainInstanceParameterFormController(
		$scope,
		platformDetailControllerService,
		dataService,
		detailUIConfigService,
		basicsLookupdataLookupDescriptorService,
		formatterProcessor) {
		platformDetailControllerService.initDetailController($scope, dataService, {}, detailUIConfigService, {});

		var refreshToolItems = {
			id: 'refresh',
			caption: 'platform.formContainer.refresh',
			type: 'item',
			iconClass: 'tlb-icons ico-refresh',
			fn: function() {
				refreshViewerPage();
			},
			disabled: true
		};
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools'
		});
		$scope.formContainerOptions.customButtons = [refreshToolItems];
		// fix null reference error.
		if($scope.tools && _.isFunction($scope.tools.update)){
			$scope.tools.update();
		}
		function refreshViewerPage() {
			var selectItem = dataService.getSelected();
			var refreshBtn = _.find($scope.formContainerOptions.customButtons, {id: 'refresh'});
			refreshBtn.disabled = true;
			if (selectItem === null || selectItem === undefined) { return; }
			dataService.confirmRefreshNew().then(function(result) {
				if(result.yes){
					dataService.refresh(selectItem.CosGlobalParamFk,true).then(function(data) {
						dataService.setDescriptionForParameterValue(data.data.cosglobalparamvalue);
						dataService.setCosParameterTypeFkAndIslookup(data.data);
						basicsLookupdataLookupDescriptorService.attachData(data.data || {});
						var lists = [];
						$.each(dataService.getList(), function(i, v) {
							lists[i] = v;
						});
						if(data.data.dtos.length === 0) {
							var itemIndex = _.findIndex(lists, {Id: selectItem.Id});
							lists.splice(itemIndex, 1);
							dataService.setList(lists);
							if (lists.length === 0) {
								$scope.currentItem = null;
							}
							else {
								dataService.setSelected(lists[0]);
								dataService.removeModified(lists[0]);
							}
						}
						else {
							// eslint-disable-next-line no-redeclare
							var itemIndex = _.findIndex(lists, {Id: data.data.dtos[0].Id});
							lists[itemIndex] = data.data.dtos[0];
							angular.forEach(lists, function(e) {
								formatterProcessor.processItem(e);
							});
							$scope.currentItem = null;
							dataService.setList(lists);
							dataService.setSelected(data.data.dtos[0]);
							dataService.removeModified(data.data.dtos[0]);
						}
						refreshBtn.disabled = false;
						$scope.tools.update();
					}, function() {
						refreshBtn.disabled = false;
						$scope.tools.update();
					});
				}else{
					refreshBtn.disabled = false;
					$scope.tools.update();
				}
			});
		}
		dataService.registerSelectionChanged(function(){
			var refreshBtn = _.find($scope.formContainerOptions.customButtons, {id: 'refresh'});
			if (dataService.getSelected()) {
				refreshBtn.disabled = false;
			}
			else {
				refreshBtn.disabled = true;
			}
			// fix null reference error.
			if($scope.tools && _.isFunction($scope.tools.update)){
				$scope.tools.update();
			}
		});
	}
})(angular);