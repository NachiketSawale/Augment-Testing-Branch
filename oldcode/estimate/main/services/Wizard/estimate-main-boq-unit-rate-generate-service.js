
(function () {
	'use strict';
	let moduleName ='estimate.main';
	angular.module(moduleName).factory('estimateMainBoqUnitRateGenerateService', ['globals', 'PlatformMessenger', '$http','_', '$injector', '$translate', 'platformModalService','estimateMainService','dialogUserSettingService','estimateMainBoqService',
		function (globals, PlatformMessenger, $http,_, $injector, $translate, platformModalService,estimateMainService,dialogUserSettingService,estimateMainBoqService) {

			let service = {};
			let initDataItem = {};

			function refreshEstimate(response){
				estimateMainService.registerListLoaded(service.changeLineItemsFromOptionalGrid);
				let lastSelected = angular.copy(estimateMainService.getSelected());

				if (response.data && response.data.LineItemUDPs) {
					// load user defined column and attach data into lineitems
					let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
					estimateMainDynamicUserDefinedColumnService.attachUpdatedValueToColumn(response.data.LineItems, response.data.LineItemUDPs, false);
				}

				estimateMainService.addList(response.data.LineItems);
				estimateMainService.fireListLoaded();
				lastSelected = response.data.LineItems && response.data.LineItems.length > 0 ? _.find(response.data.LineItems, {Id: lastSelected.Id}) || lastSelected : lastSelected;
				estimateMainService.updateItemSelection(lastSelected).then(function(){
					let estimateMainSidebarWizardService = $injector.get('estimateMainSidebarWizardService');
					estimateMainSidebarWizardService.onCalculationDone.fire();
				});
			}

			service.showDialog = function showDialog() {
				let headerText = $translate.instant ('estimate.main.options');

				platformModalService.showDialog ({
					id:'3c0c658bbb954c5d83eefadea7f43f14',
					headerText: $translate.instant (headerText),
					dataItem: initDataItem,
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-boq-unit-rate-generate.html',
					backdrop: false,
					resizeable: true,
					width: '900px',
					uuid: 'e281dcd64f1d445d9ed357c03d44cb8e'

				}).then (function (result) {
					if (result && result.ok && result.data) {
						service.generateBoqUnitRate(result.data);
					}
				}
				);
			};
			service.generateBoqUnitRate = function generateBoqUnitRate(data) {
				let postData = {
					'CopyPriceIndex' : data.PriceColumns && data.PriceColumns.length > 0 ? (_.filter(data.PriceColumns, {'checked': true})).map(function (item){return item.Id;}) : [],
				};
				if(data.CopyLineItemRete){
					postData.CopyPriceIndex.push(0);
				}
				let HighlightAssignments = dialogUserSettingService.getCustomConfig ('3c0c658bbb954c5d83eefadea7f43f14', 'HighlightAssignments');
				let boqSelected = estimateMainBoqService.getSelected();
				if(HighlightAssignments === 2 && boqSelected && boqSelected.BoqHeaderFk){
					postData.boqHeaderFks =[boqSelected.BoqHeaderFk];
				}
				postData.ProjectId = estimateMainService.getSelectedProjectId();
				postData.EstHeaderFk = estimateMainService.getSelectedEstHeaderId();
				postData.UpdateFpBoqUnitRate = data.UpdateFpBoqUnitRate;

				return estimateMainService.update().then(function (response) {
					if(!response || response.status === 409) { return; }

					if (postData.ProjectId > 0) {
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/generateBoqUnitRate', postData)
							.then(function (response) {

								if (response.data && response.data.LineItems) {
									estimateMainService.clear();

									refreshEstimate(response);
								}
								estimateMainService.onBoqItesmUpdated.fire();

							});
					}
				});
			};

			return service;

		}]);
})();
