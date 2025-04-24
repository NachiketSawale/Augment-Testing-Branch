/**
 * Created by bh on 14.11.2014.
 */
(function () {
	/* global _, globals */

	'use strict';

	let moduleName='qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainStructureImageProcessor
	 * @function
	 *
	 * @description
	 * The qtoMainStructureImageProcessor adds path to images
	 */
	angular.module(moduleName).factory('qtoMainStructureImageProcessor', ['$injector', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', function ($injector, lookupDescriptorService, platformRuntimeDataService) {

		let service = {};

		service.processItem = function processItem(item) {
			let isReadonly = false;
			let readonlyColByStutes = [];

			// qtoheader status is readonly
			let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
			let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
			if (qtoStatusItem) {
				isReadonly = qtoStatusItem.IsReadOnly;
			}

			// set by qto adrress config
			if (!isReadonly) {
				let sheetAreaList = $injector.get('qtoMainDetailService').getSheetAreaList();
				if (sheetAreaList && sheetAreaList.length) {
					if (item.PageNumber && !item.From && !item.To && sheetAreaList.indexOf(item.PageNumber) <= -1) {
						isReadonly = true;
					}
				}
			}

			// set by qtosheet status
			if (!isReadonly) {
				let qtoSheetStatus = service.getItemSheetStatus(item);
				if (qtoSheetStatus && (qtoSheetStatus.IsReadOnly || (!qtoSheetStatus.IsCoreData && !globals.portal) || (!qtoSheetStatus.IsCoreDataExt && globals.portal))) {
					isReadonly = true;
				}
			}

			// set as readonly
			if (isReadonly) {
				_.forOwn(item, function (value, key) {
					readonlyColByStutes.push({field: key, readonly: true});
				});

				if (readonlyColByStutes.length > 0){
					platformRuntimeDataService.readonly(item, readonlyColByStutes);
				}
			} else if (!item.PageNumber) {
				// set no pagenumber assignment item as readonly
				platformRuntimeDataService.readonly(item, [{field: 'Description', readonly: true}]);
			}
		};

		service.getItemSheetStatus = function (item) {
			let sheetStatuses = lookupDescriptorService.getData('QtoSheetStatus');
			return _.find(sheetStatuses, {Id: item.QtoSheetStatusFk});
		};

		return service;

	}]);
})();