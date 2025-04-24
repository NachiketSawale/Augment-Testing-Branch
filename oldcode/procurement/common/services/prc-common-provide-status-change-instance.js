/**
 * Created by sfi on 11/24/2015.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	angular.module('procurement.common').factory('procurementCommonItemStatusChangeService',
		['basicsCommonChangeStatusService','$http','procurementContextService','procurementCommonTotalDataService',
			// eslint-disable-next-line no-unused-vars
			function (basicsCommonChangeStatusService,$http,moduleContext,procurementCommonTotalDataService) {
				function providePrcItemStatusChangeInstance(mainService, procurementCommonPrcItemDataService,prcItemParentService,id) {
					var config = {};
					config.mainService = mainService;
					config.getDataService = function () {
						return procurementCommonPrcItemDataService.getService(prcItemParentService || mainService);
					};
					config.statusName = 'prcitem';
					config.codeField = 'Itemno';
					config.descField = 'Description1';
					config.statusField = 'PrcItemstatusFk';
					config.statusDisplayField = 'DescriptionInfo.Translated';
					config.title = 'procurement.common.wizard.change.ftatus.for.item';
					config.statusLookupType = 'prcitemstatus';
					config.updateUrl = 'requisition/requisition/wizard/changestatusforitem';
					config.hasFinishFn=true;
					config.id = id || 1234; // Temperory default Id here
					// FOR MULTI
					config.finishHandleSuccess=function(change){
						if(change){
							recalculateTotal();
						}
					};
					// FOR ONE ITEM
					config.handleSuccess=function handleSuccess(result){
						if (result.changed === true) {
							recalculateTotal().then(function(response){
								var result = _.isObject(response) ? response.data : false;
								if (result) {
									var mainItem = mainService.getSelected();
									mainService.refresh().then(function () {
										// Here we need to return a promise,so we use setSelected function
										mainService.setSelected({}).then(function () {
											var newEntity = mainService.getItemById(mainItem.Id);
											mainService.setSelected(newEntity);
										}
										);
									});
								}
							});
						}
					};
					function recalculateTotal(){
						var moduleName = moduleContext.getModuleName();
						var headerEntity = mainService.getSelected();
						var url = globals.webApiBaseUrl + 'procurement/common/headertotals/recalculate';
						url += '?headerId=' + headerEntity.Id;
						url += '&moduleName=' + moduleName;
						return $http.get(url);
					}

					return basicsCommonChangeStatusService.provideStatusChangeInstance(config);
				}
				return {
					providePrcItemStatusChangeInstance: providePrcItemStatusChangeInstance
				};
			}]);
})(angular);
