/**
 * Created by mov on 9/30/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.structure';
	/**
     * @ngdoc directive
     * @name controllingStructureTransferCostGroupLookup
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description ComboBox to select the cost group catalogs Type
     */

	angular.module(moduleName).directive('controllingStructureTransferCostGroupLookup', [
		'_', '$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'controllingStructureTransferCostgroupLookupService','controllingStructureTransferDataToBisDataService',
		function (_, $q, $injector, BasicsLookupdataLookupDirectiveDefinition, controllingStructureTransferCostgroupLookupService,controllingStructureTransferDataToBisDataService) {

			var defaults = {
				lookupType: 'controllingStrCostGroupCatalog',
				valueMember: 'Code',
				displayMember: 'Code',
				uuid: 'eed7eb8af4b3472284a1cc43bc85f89a',
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
							var selectedItem = args.selectedItem;
							var entity = args.entity;

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
					controllingStructureTransferCostgroupLookupService.reLoad().then(function (data) {
						if(data){
							var costGroupList = controllingStructureTransferDataToBisDataService.getList();
							var codes = _.map(costGroupList,'Code');
							data = _.filter(data,function(d){
								return codes.includes(d.Code) === false;
							});
						}
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				lookupTypesServiceName: 'controllingStrCostGroupCatalog',
				dataProvider: 'controllingStructureTransferCostgroupLookupService'
			});
		}
	]);
})(angular);