/**
 * Created by clv on 10/8/2018.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQuoteCopyNewBoqItemWizardService', copyNewBoqItemWizardsService);
	copyNewBoqItemWizardsService.$inject = [
		'$http',
		'globals',
		'platformGridAPI',
		'platformRuntimeDataService', '_',
		'procurementQuoteHeaderDataService'
	];

	function copyNewBoqItemWizardsService(
		$http,
		globals,
		platformGridAPI,
		platformRuntimeDataService,
		_,
		quoteHeaderDataService
	) {
		function getData(gridId, data) {
			data = data || [];
			if (data.length > 0) {
				data.forEach(function (item) {
					item.Selected = false;
				});
			}
			platformGridAPI.grids.invalidate(gridId);
			platformGridAPI.items.data(gridId, data); // todo livia
		}

		function doCopy(copyOptions, list, callback) {
			return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/wizard/copynewboqitem/copy', {
				RfqHeaderFk: copyOptions.RfqHeaderFk,// it exists in quoteHeader
				QtnHeaderFk: copyOptions.Id,
				NewBoqItems: list
			}).then(function (response) {
				if (response && response.data === true && _.isFunction(callback)) {
					callback();
				}
			});
		}

		function loadHeader() {
			const quote = quoteHeaderDataService.getSelected();
			if (quote) {
				quoteHeaderDataService.filterRecordsForRfqId = quote.RfqHeaderFk;
			}
			quoteHeaderDataService.refresh();
		}

		return {
			getData: getData,
			doCopy: doCopy,
			loadHeader: loadHeader
		};
	}
})(angular);