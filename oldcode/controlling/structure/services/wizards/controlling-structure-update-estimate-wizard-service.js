/**
 * Created by janas on 04.07.2018.
 * Original by joshi, moved from wizard service to this separate file (see 502207)
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('controllingStructureUpdateEstimateWizardService',
		['globals', '_', '$injector', '$http', '$translate', 'projectMainForCOStructureService', 'controllingStructureMainService',
			function (globals, _, $injector, $http, $translate, projectMainForCOStructureService, controllingStructureMainService) {

				var service = {};
				service.updateEstimate = function updateEstimate() {
					var title = 'controlling.structure.spreadUpdateEstimate';
					var platformTranslateService = $injector.get('platformTranslateService');
					var platformSidebarWizardConfigService = $injector.get('platformSidebarWizardConfigService');
					var platformModalFormConfigService = $injector.get('platformModalFormConfigService');

					var generateBudgetConfig = {
						title: $translate.instant(title),
						dataItem: {
							selectedLevel: 'SelectedItems',
							IsUpdEstimate : true,
							IsUpdEstCost:true,
							IsSplitBudget : true
						},
						formConfiguration: {
							fid: 'controlling.structure.spreadUpdateBudget',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selecteditem']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'UpdEstimateCost',
									label$tr$: 'controlling.structure.updItemEstimateCost',
									type: 'boolean',
									model: 'IsUpdEstCost',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'SpreadBudget',
									label$tr$: 'controlling.structure.spreadBudget',
									type: 'boolean',
									model: 'IsSplitBudget',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'UpdateEstimate',
									label$tr$: 'controlling.structure.updateEstimate',
									type: 'boolean',
									model: 'IsUpdEstimate',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'SelectedItem',
									label: 'Update Estimate',
									label$tr$: 'controlling.structure.updateEstimate',
									type: 'radio',
									model: 'selectedLevel',
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'generateBudgetConfig',
										items: [
											{Id: 1, Description: $translate.instant('controlling.structure.selectedItems'), Value : 'SelectedItems'},
											{Id: 2, Description: $translate.instant('controlling.structure.allItems'), Value : 'AllItems'}
										]},
									sortOrder: 1
								}]
						},
						handleOK: function handleOK(result) {
							if (!result || !result.ok || !result.data) {return;}
							if (result.data.selectedLevel === 'SelectedItems' && controllingStructureMainService.getIfSelectedIdElse() <= 0) {
								return;
							}
							var prjEntity = projectMainForCOStructureService.getSelected();
							var postData = {
								'ProjectFk': prjEntity ? prjEntity.Id : 0,
								'SelectedLevel': result.data.selectedLevel,
								'SelectedItemId': controllingStructureMainService.getIfSelectedIdElse(null),
								'CntrStructureIds': _.map(controllingStructureMainService.getSelectedEntities(), 'Id'),
								'IsSplitBudget':result.data.IsSplitBudget,
								'IsUpdateEstCost': result.data.IsUpdEstCost,
								'IsUpdateEstimate': result.data.IsUpdEstimate
							};
							function updateEstimate() {
								$http.post(globals.webApiBaseUrl + 'controlling/structure/spreadupdateestimate', postData)
									.then(function (response) {
										controllingStructureMainService.load().then(function(){
											controllingStructureMainService.setSelected({}).then(function(){
												var list = controllingStructureMainService.getList();
												var selected = _.find(list, {Id:postData.SelectedItemId});
												controllingStructureMainService.setSelected(selected);
												controllingStructureMainService.onRowExpand.fire(controllingStructureMainService.findParentRoot(selected));
											});
										});
										if(response && response.data && response.data.length){
											var cols = [{
												id: 'code',
												name$tr$: 'cloud.common.entityCode',
												formatter: 'code',
												field: 'Code',
												width: 100
											}, {
												id: 'desc',
												name$tr$: 'cloud.common.entityDescription',
												formatter: 'translation',
												field: 'DescriptionInfo',
												width: 200
											},
											{
												id: 'budget',
												name$tr$: 'controlling.structure.budget',
												formatter: 'decimal',
												field: 'Budget',
												width: 200
											}];
											return $injector.get('platformGridDialogService').showDialog({
												columns: cols,
												items:response.data,
												idProperty: 'Id',
												tree: true,
												childrenProperty: 'ControllingUnitChildren',
												headerText$tr$: 'controlling.structure.updateEstimateSummaryTitle',
												topDescription:getSuccessfullMessage(response),
												isReadOnly: true
											}).then(function () {
												return {
													success: true
												};
											});

										}else{
											if(postData.IsSplitBudget && postData.IsUpdateEstCost && postData.IsUpdateEstimate ){
												return $injector.get('platformModalService').showMsgBox('controlling.structure.spreadUpdateBudgetErr', 'controlling.structure.updateEstimateBudgetHeader', 'info');
											}else if(!postData.IsSplitBudget && postData.IsUpdateEstCost && postData.IsUpdateEstimate ){
												return $injector.get('platformModalService').showMsgBox('controlling.structure.spreadUpdateBudgetErr', 'controlling.structure.updateEstimateBudgetHeader', 'info');
											}
										}
									},
									function (/* error */) {
									});
							}
							projectMainForCOStructureService.updateAndExecute(updateEstimate);

							function getSuccessfullMessage(response) {
								if(response.data.length>1) {
									return $translate.instant('controlling.structure.multiUpdateEstimateUnitAssigned', {
										count: response.data.length
									});
								}
								else if(response.data.length===1){
									return $translate.instant('controlling.structure.oneUpdateEstimateUnitAssigned', {
										count: response.data.length
									});
								}
							}
						}
					};
					platformTranslateService.translateFormConfig(generateBudgetConfig.formConfiguration);
					generateBudgetConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(generateBudgetConfig);
				};

				return service;

			}]);
})();
