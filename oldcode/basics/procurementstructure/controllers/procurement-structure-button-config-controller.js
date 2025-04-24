(function (angular) {
	'use strict';
	let moduleName='basics.procurementstructure';
	angular.module(moduleName).factory('procurementStructureButtonConfigController',[
		'$translate','_',
		function ($translate,_) {
			let service={};
			service.initButton = initButton;
			function initButton($scope,dataService) {
				let tools = [];
				let btnConfig = {};
				btnConfig.synchronizeProcurementStructureBtn = {
					id: 'synchronize',
					caption: 'basics.procurementstructure.synchronizeCaption',
					type: 'item',
					iconClass: 'control-icons ico-copy-action1-2',
					fn: function () {
						$scope.mdcContextId = dataService.parentService().getSelected().Id;
						$scope.prcStructureDesc = dataService.parentService().parentService().getSelected().DescriptionInfo.Translated;
						$scope.prcStructureId = dataService.parentService().parentService().getSelected().Id;
						$scope.currentItem = dataService.getList();
						dataService.synchronizeProcurementStructure($scope);
					},
					disabled: function canSync() {
						if (!dataService.parentService().getSelected()) {
							return true;
						}
						return false;
					}
				};
				tools.push(btnConfig.synchronizeProcurementStructureBtn);
				return tools;
			}
			return service;
		}
	]);
})(angular);