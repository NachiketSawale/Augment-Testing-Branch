
(function (angular) {

	'use strict';
	let moduleName = 'controlling.structure';

	angular.module(moduleName).directive('controllingStructureCostGroupAssignmentLookup', [
		'_', '$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'controllingStructureTransferCostgroupLookupService','controllingStructureTransferDataToBisDataService','controllingStructureCostGroupAssignmentLookupService',
		function (_, $q, $injector, BasicsLookupdataLookupDirectiveDefinition, controllingStructureTransferCostgroupLookupService,controllingStructureTransferDataToBisDataService,controllingStructureCostGroupAssignmentLookupService) {

			let defaults = {
				lookupType: 'controllingStructureCostGroupAssignmentLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				uuid: 'e0cccd14d3a343d59946213daa862148',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'description',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'IsProjectCatalog',
						field:'IsProjectCatalog',
						name: 'IsProjectCatalog',
						name$tr$: 'controlling.structure.isProjectCatalog',
						readonly: true,
						width:50,
						formatter: 'boolean'
					}
				],
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = args.selectedItem;
							let entity = args.entity;

							if (selectedItem){
								entity.Code = selectedItem.Code;
								entity.DescriptionInfo = selectedItem.DescriptionInfo;
								entity.IsProjectCatalog = selectedItem.IsProjectCatalog;
							}else{
								delete entity.Code;
								delete entity.DescriptionInfo;
								delete entity.IsProjectCatalog;
							}
						}
					}
				],
				onDataRefresh: function ($scope) {
					controllingStructureCostGroupAssignmentLookupService.reLoad().then(function (data) {
						if(data){
							let costGroupList = $injector.get('controllingStructureCostGroupAssignmentDataService').getList();
							let codes = _.map(costGroupList,'Code');
							data = _.filter(data,function(d){
								return codes.includes(d.Code) === false;
							});
						}
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				lookupTypesServiceName: 'controllingStructureCostGroupAssignmentLookup',
				dataProvider: 'controllingStructureCostGroupAssignmentLookupService'
			});
		}
	]);
})(angular);