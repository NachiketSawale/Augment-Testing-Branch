(function (angular) {

	'use strict';
	/* jshint -W074 */
	angular.module('procurement.common').factory('procurementCommonPaymentScheduleFormatterProcessor',
		['moment',function (moment) {
			return {
				processItem: function processItem(item) {
					if (item.Id < 0) {
						return item;
					}
					if(item.DatePayment)
					{
						item.DatePayment = moment.utc(item.DatePayment);
					}
					if(item.DateRequest)
					{
						item.DateRequest = moment.utc(item.DateRequest);
					}
					if(item.DatePosted)
					{
						item.DatePosted = moment.utc(item.DatePosted);
					}
				},
				revertProcessItem: function revertProcessItem(item) {
					if (item.Id < 0) {
						return item;
					}
					if(item.DatePayment)
					{
						item.DatePayment = item.DatePayment.utc().format();
					}
					if(item.DateRequest)
					{
						item.DateRequest = item.DateRequest.utc().format();
					}
					if(item.DatePosted)
					{
						item.DatePosted = item.DatePosted.utc().format();
					}
				}
			};
		}]);

})(angular);