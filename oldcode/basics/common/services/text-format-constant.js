/**
 * Created by chi on 10/14/2020.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).constant('basicsCommonTextFormatConstant', {
		specification: 1,
		html: 2,
		hyperlink: 3,
		specificationNhtml: 11
	});
})(angular);
