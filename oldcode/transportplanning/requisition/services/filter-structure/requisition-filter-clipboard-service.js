/**
 * Created by anl on 7/16/2018.
 */


(function (angular) {
	'use strict';

	/*global angular */
	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('transportplanningRequisitionFilterClipBoardService', FilterClipBoardService);

	FilterClipBoardService.$inject = ['$injector'];

	function FilterClipBoardService($injector) {

		function canDrag(type){
			if(type === 'site-leadingStructure')
			{
				return canDragSite();
			}
			else{
				return true;
			}
		}

		function canDragSite(){
			var siteService = $injector.get('transportplanningRequisitionSiteFilterDataService');
			var selectedSite = siteService.getSelected();
			return selectedSite.Isdisp;
		}

		/* jshint -W098 */
		function doCanPaste(source, type, itemOnDragEnd) { // jshint ignore:line
			return false;
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) { // jshint ignore:line
		}

		return {
			//make filters can be dragged
			canDrag: canDrag,
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);