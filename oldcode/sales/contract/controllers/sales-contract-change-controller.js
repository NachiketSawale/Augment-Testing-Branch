/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractChangeController',
		['_', '$injector','$scope', '$translate', 'platformGridControllerService', 'salesContractTranslationService', 'salesContractChangeDataService',
			'salesContractService','salesContractConfigurationService',
			function (_, $injector, $scope, $translate, gridControllerService, translationService, dataService,
				parentService, uiStandardService) {

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
								var parentList = _.filter(list, function(e){return e.Id === parentHeader.Id || e.OrdHeaderFk === parentHeader.Id;});
								if(selectedEntities.length > 0){
									var ids = selectedEntities.map(function(item){return item.Id;});
									parentList = _.filter(list, function(e){return _.includes(ids, e.Id) || e.Id === selectedEntity.OrdHeaderFk;});
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
					parentProp: 'OrdHeaderFk',
					childProp: 'ChildItems'
				};

				gridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);

				function initContainer() {
					Array.prototype.unshift.apply($scope.tools.items, contractChangeGoto);
					var notShowItem = ['d1', 't7', 't8', 't9', 't10', 'createChild'];
					$scope.tools.items = _.filter($scope.tools.items,function(e){ return notShowItem.indexOf(e.id) < 0;});
					$scope.tools.update();
				}
				initContainer();
			}]
	);
})(angular);
