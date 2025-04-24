/**
 * Created by chi on 3/20/2020.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).constant('basicsCommonQuantityTransferFormConstant', {
		lineItemAQ: 'LineItemAQ',
		lineItemWQ: 'LineItemWQ',
		lineItemQuantityTotal: 'LineItemQuantityTotal',
		boqWQAQ: 'BoQWQAQ'
	});
})(angular);
