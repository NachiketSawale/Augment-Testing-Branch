(function (angular) {
	'use strict';
	/* global angular, _ */
	let moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemDailyProductionLayout', DailyProductionLayout);
	DailyProductionLayout.$inject = ['cloudCommonGridService', 'basicsLookupdataConfigGenerator'];

	function DailyProductionLayout(cloudCommonGridService, basicsLookupdataConfigGenerator) {

		return {
			'fid': 'productionplanning.item.dailyProductionLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['plannedstart', 'description', 'isassigned', 'fullycovered', 'supplier', 'planqty', 'realqty', 'difference','uomfk']
				}
			],
			'overloads': {
				supplier: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								selectableCallback: function (dataItem, entity, settings) {
									if(dataItem.SiteTypeFk === 8) {
										let flatData = [];
										flatData = cloudCommonGridService.flatten([dataItem], flatData, 'ChildItems');
										return !_.find(flatData, {Id: entity.SiteFk});
									}
									return false;
								}
							},
							directive: 'basics-site-site-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showclearButton: true},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				},
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					showClearButton: true
				}),
			}
		};
	}
})(angular);
