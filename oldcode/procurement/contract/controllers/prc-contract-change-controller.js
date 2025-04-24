/**
 * Created by yew on 12/10/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,$,_ */
	angular.module(moduleName).controller('procurementContractChangeController',
		['$injector','$scope', '$translate', 'platformGridControllerService', 'procurementContractChangeDataService', 'procurementContractChangeUIStandardService', 'procurementContractHeaderDataService', 'platformGridAPI',
			function ($injector, $scope, $translate, gridControllerService, dataService, uiStandardService, parentService) {
				var contractChangeGoto = [
					{
						id: 'contractChangeGoto',
						caption: $translate.instant('cloud.common.Navigator.goTo'),
						type: 'item',
						iconClass: 'tlb-icons ico-goto',
						fn: function updateCalculation() {
							var list = parentService.allHeaderData;
							var parentHeader = parentService.getSelected();
							if(parentHeader && list && list.length > 0){
								var selectedEntity = dataService.getSelected();
								var selectedEntities = dataService.getSelectedEntities();
								var parentList = _.filter(list, function(e){return e.Id === parentHeader.Id || e.ConHeaderFk === parentHeader.Id;});
								if(selectedEntities.length > 0){
									var ids = selectedEntities.map(function(item){return item.Id;});
									parentList = _.filter(list, function(e){return $.inArray(e.Id, ids) > -1 || e.Id === selectedEntity.ConHeaderFk;});
								}
								parentService.setList(parentList);
								parentService.setSelected(parentHeader);
								parentService.clearModifications();
							}
						}
					}
				];

				var gridConfig = {
					columns: [],
					parentProp: 'ConHeaderFk',
					childProp: 'ChildItems',
					initialState: 'expanded'
				};
				gridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

				function initContainer() {
					Array.prototype.unshift.apply($scope.tools.items, contractChangeGoto);
					var notShowItem = ['d1', 't7', 't8', 't9', 't10', 't14', 'createChild'];
					$scope.tools.items = _.filter($scope.tools.items,function(e){ return notShowItem.indexOf(e.id) < 0;});
					$scope.tools.update();
				}
				initContainer();

			}]
	);
})(angular);