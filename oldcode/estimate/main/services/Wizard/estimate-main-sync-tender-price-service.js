(function(angular){
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainSyncTenderPriceService', ['$translate', '$http', 'platformModalService', 'cloudDesktopPinningContextService', 'estimateMainService',
		function($translate, $http, platformModalService, cloudDesktopPinningContextService, estimateMainService){
			let service = {};

			service.showDialog = function showDialog() {
				let project = cloudDesktopPinningContextService.getPinningItem('project.main');
				let estHeader = cloudDesktopPinningContextService.getPinningItem('estimate.main');
				if(!project || project.id <=0 || !estHeader || estHeader.id < 0){
					platformModalService.showMsgBox($translate.instant('estimate.main.pinPrjOrEst'), $translate.instant('estimate.main.noProjectOrEstimatePinned'));
					return;
				}

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-copy-tender-price-dialog.html',
					backdrop: false,
					windowClass: 'form-modal-dialog',
					width: 600
				}).then(function (result) {
					if (result && result.isOk && result.data) {
						let postData = {
							'EstHeaderId': parseInt(estimateMainService.getSelectedEstHeaderId()),
							'ProjectId': estimateMainService.getSelectedProjectId(),
							'CopyTenderPriceToLineItem' : result.data.copyTenderPriceToLineItem,
							'CopyTenderPriceToBoqItem': result.data.copyTenderPriceToBoqItem,
							'CopyAQQuantityToBoqItem': result.data.copyAQQuantityToBoqItem,
							'NotCheckFixedPriceFlag': result.data.notCheckFixedPriceFlag
						};

						if(!result.data.copyTenderPriceToLineItem && !result.data.copyTenderPriceToBoqItem){
							return;
						}

						estimateMainService.update().then(function(){
							$http.post(globals.webApiBaseUrl + 'estimate/main/priceadjustment/copyTenderPrice', postData).then(function(copyTenderPriceResult){
								if(copyTenderPriceResult && copyTenderPriceResult.data && copyTenderPriceResult.data.AffectedLineItemCount){
									estimateMainService.refresh();
								}
							});
						}
						);
					}
				}
				);
			};

			return service;
		}]);
})(angular);