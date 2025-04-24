/**
 * Created by joshi on 18.04.2016.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainUpp2CostCodeDetailUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Upp2costcode Detail UI Config for dialog.
	 */
	angular.module(moduleName).factory('estimateMainUpp2CostCodeDetailUIConfigService', ['platformTranslateService',
		function (platformTranslateService) {
			let service = {};

			let gridColumns = [
				{
					id: 'code',
					field: 'Code',
					name: 'CostCode',
					name$tr$: 'estimate.main.mdcCostCodeFk',
					width: 90,
					formatter: function (row, cell, value, columnDef, dataContext) {
						if(!dataContext.LineType){
							return value || dataContext[columnDef.field];
						}

						return '<div class="cm-em">' + value +'</div>';
					},
					searchable: true
				},
				{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter:'translation',
					width: 100
				},
				{
					id: 'uppId1',
					field: 'UppId1',
					name: 'URP1',
					name$tr$: 'estimate.main.estUppId1',
					width: 60,
					toolTip: 'UrpId1',
					editor: 'boolean',
					formatter: 'boolean'
				},
				{
					id: 'uppId2',
					field: 'UppId2',
					name: 'URP2',
					name$tr$: 'estimate.main.estUppId2',
					width: 60,
					toolTip: 'UrpId2',
					editor: 'boolean',
					formatter: 'boolean'
				},
				{
					id: 'uppId3',
					field: 'UppId3',
					name: 'URP3',
					name$tr$: 'estimate.main.estUppId3',
					width: 60,
					toolTip: 'UrpId3',
					editor: 'boolean',
					formatter: 'boolean'
				},
				{
					id: 'uppId4',
					field: 'UppId4',
					name: 'URP4',
					name$tr$: 'estimate.main.estUppId4',
					width: 60,
					toolTip: 'UrpId4',
					editor: 'boolean',
					formatter: 'boolean'
				},
				{
					id: 'uppId5',
					field: 'UppId5',
					name: 'URP5',
					name$tr$: 'estimate.main.estUppId5',
					width: 60,
					toolTip: 'UrpId5',
					editor: 'boolean',
					formatter: 'boolean'
				},
				{
					id: 'uppId6',
					field: 'UppId6',
					name: 'URP6',
					name$tr$: 'estimate.main.estUppId6',
					width: 60,
					toolTip: 'UrpId6',
					editor: 'boolean',
					formatter: 'boolean'
				},
				{
					id: 'furtherDescription',
					field: 'Description2Info',
					name: 'Further Description',
					name$tr$: 'basics.costcodes.description2',
					formatter:'translation',
					width: 100
				}

			];

			platformTranslateService.translateGridConfig(gridColumns);

			service.getStandardConfigForListView = function(){
				return{
					columns : gridColumns
				};
			};

			return service;

		}
	]);

})(angular);
