(function (angular) {
	'use strict';
	var modelName = 'procurement.common';

	angular.module(modelName).constant('procurementModuleConstant', {
		package: {
			moduleName: 'procurement.package'
		},
		requisition: {
			moduleName: 'procurement.requisition'
		},
		contract:{
			moduleName: 'procurement.contract'
		},
		invoice:{
			moduleName: 'procurement.invoice'
		},
		rfq:{
			moduleName: 'procurement.rfq'
		},
		quote:{
			moduleName: 'procurement.quote'
		},
		pes:{
			moduleName: 'procurement.pes'
		},
		priceComparison:{
			moduleName: 'procurement.pricecomparison'
		}
	});
})(angular);