/**
 * Created by zwz on 7/25/2022.
 */

(function (angular) {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.product';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	// CuttingProduct Layout
	angular.module(moduleName).value('productionplanningProductCuttingProductLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningProductCuttingProductLayout', Layout);
	Layout.$inject = [];

	function Layout() {
		let attributeArray = ['productcode', 'productdescription', 'productproductiondate', 'productlengthinfo', 'productwidthinfo', 'productheightinfo', 'scrpproductcode', 'scrpproductdescription', 'scrpproductlengthinfo', 'scrpproductwidthinfo', 'scrpproductheightinfo', 'keepremaininglength', 'keepremainingwidth','order'];
		let overloadsObj = {};
		_.each(attributeArray, (att) => {
			overloadsObj[att] = {readonly: true};
		});
		return {
			fid: 'productionplanning.product.cuttingProductLayout',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: attributeArray
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: overloadsObj
		};
	}

})(angular);
