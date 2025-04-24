/**
 * Created by clv on 12/3/2018.
 */

(function (angular) {

	'use strict';
	const moduleName = 'procurement.quote';
	angular.module(moduleName).factory('procurementQuoteCopyMaterialNewItemWizardService', copyNewItemWizardsService);

	copyNewItemWizardsService.$inject = [
		'$http',
		'globals',
		'platformGridAPI',
		'_',
		'procurementQuoteHeaderDataService'
	];

	function copyNewItemWizardsService(
		$http,
		globals,
		platformGridAPI, _,
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
			const dataObj = {
				RfqHeaderFk: copyOptions.RfqHeaderFk,
				NewItemResponseEntities: list
			};

			return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/wizard/copynewmaterialitem/copy', dataObj).then(function (response) {
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