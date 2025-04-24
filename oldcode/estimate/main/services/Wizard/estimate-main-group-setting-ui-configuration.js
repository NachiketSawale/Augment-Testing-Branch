(function () {
	'use strict';


	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstTotalsConfigDetailUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('estimateMainGroupSettingUIConfigurationService', [
		'platformTranslateService',
		function ( platformTranslateService) {

			let service = {};

			let gridColumns = [
				{
					id: 'sorting',
					field: 'Sorting',
					name: 'Sorting',
					name$tr$: 'cloud.common.entitySorting',
					toolTip: 'Sorting',
					editor: 'integer',
					formatter: 'integer'
				},
				{
					id: 'groupStructure',
					field: 'GroupStructureId',
					name: 'Group Structure',
					name$tr$: 'estimate.main.uploadEstimateToBenchmark.groupStructure',
					editor: 'lookup',
					editorOptions: {
						directive: 'estimate-wizard-generate-structure-lookup',
						lookupOptions: {
							events: [
								{
									name: 'onSelectedItemChanged',
									handler: function (e, args) {
										let selectedDataItem = args.entity;
										if (args.selectedItem !== null) {
											selectedDataItem.GroupStructureId = args.selectedItem.Id;
											selectedDataItem.StructureName = args.selectedItem.StructureName;
											selectedDataItem.RootItemId = args.selectedItem.RootItemId;
											selectedDataItem.Id = args.selectedItem.Id;
											selectedDataItem.EstStructureId =  args.selectedItem.EstStructureId;
										}
									}
								}
							],
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'EstimateGenerate4LeadingSource',
						displayMember: 'Desc',
						dataServiceName: 'estimateWizardGenerateSourceLookupService'
					},
					width: 200
				},
				{
					id: 'structureName',
					field: 'StructureName',
					name: 'Structure Name',
					name$tr$: 'estimate.main.uploadEstimateToBenchmark.structureName',
					toolTip: 'StructureName',
					editor: 'description',
					readonly :true,
					formatter: 'description'
				}
			];

			platformTranslateService.translateGridConfig(gridColumns);

			service.getStandardConfigForListView = function(){
				return{
					addValidationAutomatically: true,
					columns : gridColumns
				};
			};

			return service;
		}]);
})();
