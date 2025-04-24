/**
 * Created by anl on 5/8/2018.
 */


(function (angular) {
	'use strict';

	/*global angular */
	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).service('productionplanningActivityAdditionalFilterClipBoardService', AdditionalFilterClipBoardService);

	AdditionalFilterClipBoardService.$inject = [];

	function AdditionalFilterClipBoardService() {

		function doCanPaste(source, type, itemOnDragEnd) { // jshint ignore:line
			return false;
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) { // jshint ignore:line
		}

		return {
			//make filters can be dragged
			canDrag: function(){
				return true;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);