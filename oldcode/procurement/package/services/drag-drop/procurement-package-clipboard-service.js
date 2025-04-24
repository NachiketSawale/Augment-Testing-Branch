/**
 * Created by chi on 12/3/2018.
 */
(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageClipboardService', procurementPackageClipboardService);

	procurementPackageClipboardService.$inject = ['$injector'];

	function procurementPackageClipboardService($injector) {
		var service = {};

		service.setClipboardMode = setClipboardMode;
		service.canDrag = canDrag;
		service.doCanPaste = doCanPaste;
		service.copy = copy;
		service.doPaste = doPaste;

		return service;

		// //////////////////////////////

		function setClipboardMode(/* cut */) {

		}

		function canDrag(/* type */) {
			return false;
		}

		function doCanPaste(obj, type, item/* , itemService */) {
			if (item) {
				if (type === 'itemAssignment' && obj.type === 'boqitem' && obj.data && obj.data.length > 0) {
					return _.filter(obj.data, function (boqitem) {
						return boqitem.BoqLineTypeFk === 0;
					}).length > 0;
				}
			}
			return false;
		}

		function copy(/* items, type, itemService */) {
		}

		function doPaste(obj, item, type/* , callback */) {
			if (item && obj) {
				if (type === 'itemAssignment' && obj.type === 'boqitem' && obj.data && obj.data.length > 0) {
					var boqLookupService = $injector.get('procurementPackageBoqLookupService');
					boqLookupService.getListAsync(null, {entity: item})
						.then(function(){
							var itemAssignService = $injector.get('procurementPackageItemAssignmentDataService');
							var itemAssignValidationService = $injector.get('procurementPackageItemAssignmentValidationService')(itemAssignService.name, itemAssignService);
							var validBoqItem = _.find(obj.data, {'BoqLineTypeFk': 0});
							var result = itemAssignValidationService.validateBoqItemFk(item, validBoqItem.Id, 'BoqItemFk');
							if (result && result.apply) {
								item.BoqItemFk = validBoqItem.Id;
							}
							itemAssignService.gridRefresh();
						});
				}
			}
		}
	}

})(angular);