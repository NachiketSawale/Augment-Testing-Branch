(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';

	angular.module(moduleName).factory('productionplanningPpsMaterialSummarizedLayout', MaterialSummarizedLayout);
	MaterialSummarizedLayout.$inject = ['basicsLookupdataConfigGenerator', '$translate'];

	function MaterialSummarizedLayout(basicsLookupdataConfigGenerator, $translate) {

		let summarizedMode = [
			{Id: 1, Description: $translate.instant('productionplanning.ppsmaterial.summarized.merge')},
			{Id: 2, Description: $translate.instant('productionplanning.ppsmaterial.summarized.group')}
		];

		return {
			'fid': 'productionplanning.ppsmaterial.productionplanningPpsMaterialSummarizedLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: ['materialsumfk', 'summarizemode', 'remark', 'userflag1', 'userflag2']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				}],
			overloads: {
				materialsumfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'ppsmaterialLookupDataService',
					cacheEnable: true,
					filterKey: 'pps-material-usedId-filter'
				}),
				summarizemode: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							items: summarizedMode,
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							items: summarizedMode,
							displayMember: 'Description',
							valueMember: 'Id'
						}
					}
				}
			}
		};
	}
})(angular);