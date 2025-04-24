/**
 * Created by benny on 03.05.2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';
	angular.module(moduleName).factory('schedulingLookupScheduleDataProcessor', [

		function () {

			var service = {};
			
			function generateStyle(item) {
				var cssClass = '';
				if (item.IsBold) {
					cssClass += ' cm-strong ';
				}
				if(item.IsMarked){
					cssClass += ' cm-negative ';
				}
				//apply the css class to cell Code and DescriptionInfo
				var fieldsWithStyle = ['Code', 'DescriptionInfo'];
				
				item.__rt$data = item.__rt$data || {};
				item.__rt$data.cellCss = item.__rt$data.cellCss || {};
				
				_.each(fieldsWithStyle, function (field) {
					item.__rt$data.cellCss[field] = item.__rt$data.cellCss[field] || '';
					item.__rt$data.cellCss[field] += cssClass;
				});
			}
			
			service.processItem = function processItem(item) {
				return generateStyle(item);
			};
			
			return service;

		}]);
})(angular);


