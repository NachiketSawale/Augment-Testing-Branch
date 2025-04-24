/**
 * Created by zwz on 10/25/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	/**
	 * @ngdoc factory
	 * @name productionplanningProducttemplateProductDescriptionProcessor
	 * @function
	 * @requires platformRuntimeDataService
	 *
	 * @description
	 * a processor to process ProductDescription.
	 */
	angular.module(moduleName).factory('productionplanningProducttemplateProductDescriptionProcessor', Processor);

	Processor.$inject = ['platformRuntimeDataService'];
	function Processor(platformRuntimeDataService) {
		function processItem(item) {
			if (item) {
				var fields = [{field: 'EngTaskFk', readonly: true},{field: 'EngDrawingFk', readonly: true}, {field: 'MdcProductDescriptionFk', readonly: true}];
				platformRuntimeDataService.readonly(item, fields);
			}
		}

		return {
			processItem : processItem
		};
	}
})(angular);
