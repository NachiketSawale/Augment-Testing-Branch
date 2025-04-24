/**
 * Created by chi on 1/8/2019.
 */
(function(angular){
	'use strict';

	var moduleName = 'project.main';

	angular.module(moduleName).constant('projectMainUpdatePriceFromCatalogPriceListSourceOption', {
		'None': 0,
		'OnlyBase': 1,
		'OnlyOneVersion': 2,
		'Mixed': 3
	});
})(angular);