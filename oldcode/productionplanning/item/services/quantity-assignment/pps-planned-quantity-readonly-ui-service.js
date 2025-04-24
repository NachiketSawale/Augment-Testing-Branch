/**
 * Created by zwz on 2022/9/2.
 */
(function () {
	'use strict';
	/* global angular, _ */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsPlannedQuantityReadonlyUIService', ReadonlyUIService);
	ReadonlyUIService.$inject = ['ppsPlannedQuantityUIStandardService'];

	function ReadonlyUIService(uiStandardService) {

		this.getPlannedQtyReadOnlyColumns = function getPlannedQtyReadOnlyColumns() {
			let layout = uiStandardService.getStandardConfigForListView();
			let columns = angular.copy(layout.columns);
			_.forEach(columns, function (column) {
				column.editor = null;
			});

			// "override" option domain of dynamic column 'boqestitemresfk'. The dynamic column 'boqestitemresfk' from ppsPlannedQuantityUIStandardService is specified for PPSHeader, so here we have to "override" it
			let column = _.find(columns, {id: 'boqestitemresfk'});
			if (column) {
				column.domain = function (item, column) {
					if (item.ResourceTypeFk === 1) { // BoqItem
						column.formatterOptions = {
							lookupType: 'BoqItem',
							displayMember: 'Reference'
						};
					} else if (item.ResourceTypeFk === 2) { // EstLineItem
						column.formatterOptions = {
							lookupType: 'estlineitemlookup',
							displayMember: 'Code'
						};
					} else if (item.ResourceTypeFk === 3) { // EstResource
						column.formatterOptions = {
							lookupType: 'estresource4itemassignment',
							displayMember: 'Code'
						};
					} else {
						column.formatterOptions = null;
					}
					return 'lookup';
				};
			}
			return columns;
		};

	}
})();