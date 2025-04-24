/**
 * Created by anl on 8/24/2021.
 */

(function (angular) {
	'use strict';
	/*globals angular, moment, _, Slick*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemUpstreamItemSplitUIService', UpstreamItemSplitUIService);

	UpstreamItemSplitUIService.$inject = [
		'$http', '$q',
		'platformTranslateService',
		'platformGridAPI',
		'productionplanningItemUIStandardService'];

	function UpstreamItemSplitUIService(
		$http, $q,
		platformTranslateService,
		platformGridAPI,
		itemUIStandardService) {

		var service = {};
		var layout = itemUIStandardService.getStandardConfigForListView();
		var itemColumns = [];

		service.GetItemGrid = function (step) {
			itemColumns = [];
			var headerField = {
				editor: 'boolean',
				field: 'Checked',
				formatter: 'boolean',
				id: 'checked',
				width: 80,
				pinned: true,
				headerChkbox: false,
				name: '*Checked',
				name$tr$: 'cloud.common.entitySelected'
			};
			var UpstreamItemQuantityField = {
				editor: step === 1 ? null : 'quantity',
				field: 'UpstreamItemQuantity',
				formatter: 'quantity',
				id: 'upstreamItemQuantity',
				width: 80,
				pinned: true,
				readonly: false,
				name: '*UpstreamItem Quantity',
				name$tr$: 'productionplanning.item.upstreamItem.upstreamItemQuantity'
			};
			itemColumns = step === 1 ? [headerField, UpstreamItemQuantityField] : [UpstreamItemQuantityField];

			var columns = angular.copy(layout.columns);
			_.forEach(columns, function (column) {
				column.editor = null;
			});

			itemColumns = itemColumns.concat(columns);

			return {
				columns: itemColumns,
				state: step === 1 ? 'cc43e1c0230e499985f944fa697ed500' : 'bea4c3a53dc24825b6aef2ed1b2dfdf1'
			};
		};

		return service;
	}
})(angular);