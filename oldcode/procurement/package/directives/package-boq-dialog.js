/**
 * Created by chi on 6/27/2018.
 */
(function(angular, globals){
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';

	globals.lookups.packageBoqItems = function packageBoqItems($injector) {
		var procurementPackageBoqLookupService = $injector.get('procurementPackageBoqLookupService');
		var cloudCommonGridService = $injector.get('cloudCommonGridService');
		var boqMainImageProcessor = $injector.get('boqMainImageProcessor');

		return {
			lookupOptions: {
				lookupType: 'packageboqitems',
				valueMember: 'Id',
				displayMember: 'Reference',
				isClientSearch: true,
				isExactSearch: true,
				uuid: '0388e4ee65b84c319fabaf42e63ed5f6',
				columns: [
					{ id: 'ref', field: 'Reference', name: 'Reference', width: 100, formatter: 'description', name$tr$: 'boq.main.Reference' },
					{ id: 'brief', field: 'BriefInfo', name: 'Brief', width: 120, formatter: 'translation', name$tr$: 'boq.main.BriefInfo' },
					{ id: 'qtyuom', field: 'BasUomFk', name: 'Quantity', width: 120,  name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}}
				],
				title: {
					name: 'Boqs',
					name$tr$: 'estimate.main.boqContainer'
				},
				treeOptions: {
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					dataProcessor: function(dataList) {
						var output = [];
						cloudCommonGridService.flatten(dataList, output, 'BoqItems');
						for (var i = 0; i < output.length; ++i) {
							boqMainImageProcessor.processItem(output[i]);
						}
						return dataList;
					}
				},
				onDataRefresh: function($scope) {
					procurementPackageBoqLookupService.loadData($scope).then(function(data){
						$scope.refreshData(data);
					});
				},
				disableDataCaching: true
			},
			dataProvider: {
				getList: procurementPackageBoqLookupService.getListAsync,
				getItemById: procurementPackageBoqLookupService.getItemByIdAsync,
				getSearchList: procurementPackageBoqLookupService.getSearchList,
				loadData: procurementPackageBoqLookupService.loadData,
				getItemByKey: procurementPackageBoqLookupService.getItemById
			}
		};
	};

	angular.module(moduleName).directive('procurementPackageBoqDialog', procurementPackageBoqDialog);

	procurementPackageBoqDialog.$inject = ['$injector',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function procurementPackageBoqDialog($injector,
		BasicsLookupdataLookupDirectiveDefinition){
		var defaults = globals.lookups.packageBoqItems($injector);
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit',
			defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
	}
})(angular, globals);