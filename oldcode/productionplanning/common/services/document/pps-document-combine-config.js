
(function () {
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	angModule.constant('ppsCommonDocumentCombineConfig', {

		'productionplanning.item': {
			moduleName: 'productionplanning.item',
			title: 'productionplanning.item.entityItem',
			parentService: 'productionplanningItemDataService',
			columnConfig: {
				documentField: 'EngDrawingFk',
				dataField: 'EngDrawingDefFk',
				readOnly: false
			},
			subModules: [{
				service: 'productionplanningItemSubItemDataService',
				title: 'productionplanning.item.upstreamItem.entity',
				columnConfig: {
					documentField: 'ProductDescriptionFk',
					dataField: 'ProductDescriptionFk',
					readOnly: false,
				},
				handleCreateSucceedCallback: (newData, parentSelected) => {
					//newData.EngDrawingFk = parentSelected.EngDrawingDefFk;
				}
			}]
		}
	});
})();