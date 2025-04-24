/**
 * Created by zwz on 09/30/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).constant('trsLgmRecordTypes', {
		Resource: 1,
		//Plant: 2,
		Material: 3,
		//SundryService: 4,
		//CostCode: 5,
		FabricatedProduct: 6 // for PPS Product
	});
})(angular);

