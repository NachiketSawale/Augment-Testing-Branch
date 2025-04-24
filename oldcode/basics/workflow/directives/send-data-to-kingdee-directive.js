/* globals angular */
(function (angular) {
	'use strict';

	function sendData2KingdeelDirective(moment, $compile, _, $templateCache, $http, $q) {
		return {
			replace: true,
			require: 'ngModel',
			link: function (scope, ele, attrs, ngModelCtrl) {
				ngModelCtrl.$render = function () {
					var now = new Date(),
						nowDate = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate());
					scope.selectedDate = moment.utc(nowDate);

					function loadView() {
						var tempUrl = '';
						if (scope.Context.ModuleName === 'INV') {
							tempUrl = 'basics.workflow/transaction-inv-ui.html';
						} else if (scope.Context.ModuleName === 'PES') {
							tempUrl = 'basics.workflow/transaction-pes-ui.html';
						}
						var html = $templateCache.get(tempUrl);
						ele.append($compile(html)(scope));
					}

					function search() {
						if (scope.Context.CompanyId && scope.selectedDate) {
							var currentCompanyId = scope.Context.CompanyId;
							var url = globals.webApiBaseUrl;
							if (scope.Context.ModuleName === 'PES') {
								url += 'basics/company/transheader/gettransferlist';
							} else if (scope.Context.ModuleName === 'INV') {
								url += 'procurement/invoice/header/gettransferlist';
							}
							return $http.post(url, {
								PostingDate: scope.selectedDate,
								CompanyId: currentCompanyId
							}).then(function (response) {
								return response.data;
							});
						}
						return $q.when([]);
					}

					scope.search = function () {
						scope.isLoading = true;
						search().then(function (data) {
							scope.Context.TransactionHeaderInfo = data;
							scope.isLoading = false;
						});
					};

					loadView();
					scope.search();
				};
			}
		};
	}

	angular.module('basics.workflow').directive('basicsWorkflowSendDataToKingdeeDirective', ['moment', '$compile', '_', '$templateCache', '$http', '$q', sendData2KingdeelDirective]);
})(angular);
