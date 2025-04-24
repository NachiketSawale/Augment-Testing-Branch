// clv
(function(angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQuoteUpdateBoqPriceFromWicWizard', procurementQuoteUpdateBoqPriceFromWicWizard);

	procurementQuoteUpdateBoqPriceFromWicWizard.$inject = ['$http', 'platformModalService', 'procurementContextService', 'procurementQuoteHeaderDataService'];

	function procurementQuoteUpdateBoqPriceFromWicWizard($http, platformModalService, procurementContextService, procurementQuoteHeaderDataService){

		return {
			updateBoqPriceFromWicWizard: updateBoqPriceFromWicWizard
		};

		// /
		function updateBoqPriceFromWicWizard(){

			// check whether there has WICNo. if yes, will update, otherwise, abort it.
			// it have should not need a wizard controller. wizard service will be needed.
			var qtnSelected = procurementQuoteHeaderDataService.getSelected();
			var boxTitle = 'cloud.common.updateBoqPriceFromWicTitle';
			if(!qtnSelected){
				// abort

				platformModalService.showMsgBox('procurement.quote.selectedQuote', boxTitle,'info');
				return;
			}
			// get wicNo.
			getWicBoqByQtn().then(function(response){

				if(response?.data){

					return platformModalService.showYesNoDialog('procurement.quote.updateItContinue', boxTitle).then(function(yesOrNo){

						if(yesOrNo?.yes){

							updatePriceOfBoqFromWic().then(function(res){
								if(res?.data){
									platformModalService.showMsgBox('procurement.common.updateSuccessfully', boxTitle,'info');
									var mainService = procurementContextService.getMainService();
									if(mainService && angular.isFunction(mainService.load)){
										// use load to refresh records. Currently, boq`s change will not have influence on qtn_header.
										return mainService.load();
									}
									procurementQuoteHeaderDataService.refresh();
								}
							});
						}
					});
				}

				platformModalService.showMsgBox('procurement.quote.boqHasNoWicNo', boxTitle,'info');
			});
		}

		function getWicBoqByQtn(){

			var qtnSelected = procurementQuoteHeaderDataService.getSelected();
			return $http.get(globals.webApiBaseUrl +  'procurement/quote/header/wizard/updateboqpricefromwic/getwicboqbyqtn?qtnHeaderFk=' + qtnSelected.Id);
		}

		function updatePriceOfBoqFromWic(){

			var qtnSelected = procurementQuoteHeaderDataService.getSelected();
			return $http.get(globals.webApiBaseUrl + 'procurement/quote/header/wizard/updateboqpricefromwic/updateboqpricefromwic?qtnHeaderFk=' + qtnSelected.Id);
		}

	}

})(angular);