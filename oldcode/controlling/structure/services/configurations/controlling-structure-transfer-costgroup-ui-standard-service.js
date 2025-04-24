/**
 * Created by mov on 9/30/2019.
 */

(function () {


	'use strict';

	var moduleName = 'controlling.structure';

	/**
     * @ngdoc value
     * @name controllingStructureTransferCostGroupUiStandardService
     * @function
     *
     * @description
     * Returns the controlling structure transfer columns and column settings.
     **/
	angular.module(moduleName).value('controllingStructureTransferCostGroupUiStandardService', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'classification',
						field: 'Classification',
						name: 'Classification',
						name$tr$: 'controlling.structure.costGroupClassification',
						width: 150
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Cost Group Catalog',
						name$tr$: 'controlling.structure.costGroupCatalog',
						// readonly: true
						width: 120,
						// readonly: false
						editor: 'lookup',
						editorOptions:{
							directive: 'controlling-structure-transfer-cost-group-lookup',
							lookupOptions:{
								showClearButton: true,
								filterKey: 'controlling-structure-cost-group-catalog-selection-filter',
								displayMember: 'Code',
								valueMember: 'Code'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType:'controllingStrCostGroupCatalog',
							displayMember: 'Code',
							dataServiceName: 'controllingStructureTransferCostgroupLookupService'
						}
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						formatter: 'translation',
						name: 'Description',
						name$tr$: 'controlling.structure.costGroupCatalogsDesc',
						readonly: true,
						width: 250
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
				]
			};
		},
		getHistoryStandardConfigListView:function(){
			return {
				columns: [
					{
						id: 'historydate',
						formatter: 'dateutc',
						field: 'HistoryDate',
						name: 'Date',
						name$tr$: 'controlling.structure.historydate',
						width: 150
					},
					{
						id: 'ribhistoryid',
						field: 'RibHistoryId',
						name: 'History Version',
						name$tr$: 'controlling.structure.ribhistoryid',
						width: 150
					},
					{
						id: 'historydescription',
						field: 'HistoryDescription',
						name: 'Description',
						name$tr$: 'controlling.structure.historydescription',
						width: 150
					},
					{
						id: 'historyremark',
						field: 'HistoryRemark',
						name: 'Remark',
						name$tr$: 'controlling.structure.historyremark',
						width: 150
					},
					{
						id: 'ribprjversion',
						field: 'RibPrjVersion',
						name: 'Project Version',
						name$tr$: 'controlling.structure.ribprjversion',
						width: 150
					},{
						id: 'ribcompanyid',
						field: 'RibCompanyId',
						name: 'Company',
						name$tr$: 'controlling.structure.ribcompanyid',
						width: 150
					},
					{
						id: 'reportlog',
						field: 'ReportLog',
						name: 'Report Log',
						name$tr$: 'controlling.structure.reportLog',
						width: 400
					}

				]
			};
		}
	});

})();
