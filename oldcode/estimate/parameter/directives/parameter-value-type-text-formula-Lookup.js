/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName='estimate.parameter';
	angular.module(moduleName).directive('parameterValueTypeTextFormulaLookup',
		['_', '$q','$injector','BasicsLookupdataLookupDirectiveDefinition','estimateMainParameterValueLookupService',
			function (_, $q,$injector,BasicsLookupdataLookupDirectiveDefinition,estimateMainParameterValueLookupService) {
				let defaults = {
					lookupType: 'ParamValueTypeTextFormulaLookup',
					valueMember: 'Id',
					autoComplete: true,
					isExactSearch: false,
					displayMember: 'DescriptionInfo.translation',
					idProperty:'Id',
					uuid: '78AB01921897409B8EB3FC98ACD16EFD',
					columns: [
						{ id: 'description', field: 'DescriptionInfo', name: 'Description',  width: 120, toolTip: 'Description', formatter: 'translation', name$tr$: 'estimate.parameter.description' },
						{ id: 'value', field: 'Value', name: 'Value',  width: 120, toolTip: 'Value', formatter: 'comment', name$tr$: 'estimate.parameter.value' },
						{ id: 'valuedetail', field: 'ValueDetail', name: 'ValueDetail',  width: 120, toolTip: 'ValueDetail', formatter: 'comment', name$tr$: 'estimate.parameter.valueDetail' }
					],
					//  inputSearchMembers: ['ValueDetail', 'Description','Value'],
					onDataRefresh: function ($scope) {

						estimateMainParameterValueLookupService.forceReload().then(function (respone) {
							let selectItem = null;

							let isAssembly = $injector.get('estimateAssembliesService').getIsAssembly();

							let isFromWicBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqWic();

							let isFromProjectBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqProject();

							let isEstimate = $injector.get('estimateMainService').getIsEstimate();

							let isParam = $injector.get('estimateParamDataService').getIsParam();

							let fromModule = $injector.get('estimateParamDataService').getModule();
							if(fromModule && fromModule.toLowerCase()==='project')  // this case is for project parameter container
							{
								selectItem =  $injector.get('estimateParameterPrjParamService').getSelected();
							}else {

								// param dialog window
								if (isFromProjectBoq) {
									selectItem = $injector.get('boqMainDetailsParamListDataService').getSelected();

								}  if (isFromWicBoq) {
									selectItem = $injector.get('boqMainDetailsParamListDataService').getSelected();

								}  if (isAssembly) {
									selectItem = $injector.get('estimateAssembliesDetailsParamListDataService').getSelected();

								}  if (isEstimate) {
									selectItem =  $injector.get('estimateMainDetailsParamListDataService').getSelected();

								}

								// end param dialog window


								if (isParam) { // this case is for open paramter code windonw on project Boq/ wic Boq/ Assembly /EstLineItem  grid list
									selectItem = $injector.get('estimateParamDataService').getSelectParam();
								}
							}
							if (respone && respone.data) {
								let data = _.filter(respone.data, function (item) {
									if (selectItem.Code === item.Code) {
										item.Value = item.ValueDetail;
										return true;
									}
								});
								estimateMainParameterValueLookupService.setLookupData(respone.data);
								$scope.refreshData(data);
							}
						});
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								let selectedDataItem = this.entity;
								let dataList = [];
								if (args.selectedItem !== null) {

									selectedDataItem.ParameterText = selectedDataItem.ParameterText ? selectedDataItem.ParameterText + '+'+ args.selectedItem.DescriptionInfo.Description :''+args.selectedItem.DescriptionInfo.Description;
									selectedDataItem.ValueDetail =  selectedDataItem.ValueDetail ? selectedDataItem.ValueDetail + '+'+ args.selectedItem.Value :''+args.selectedItem.Value;

									let ParameterComplexInputgroupLookupService = $injector.get('estimateParameterComplexInputgroupLookupService');

									let isAssembly = $injector.get('estimateAssembliesService').getIsAssembly();

									let isFromWicBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqWic();

									let isFromProjectBoq = $injector.get('boqRuleComplexLookupService').isNavFromBoqProject();

									let isParam = $injector.get('estimateParamDataService').getIsParam();  // means the param lookup window in Boq,Assembly,EstlineItem grid list

									let isEstimate = $injector.get('estimateMainService').getIsEstimate();


									let fromModule = $injector.get('estimateParamDataService').getModule();
									let selectItem = null;
									if(fromModule && fromModule.toLowerCase()==='project')  // this case is for project parameter container
									{
										$injector.get('estimateParameterPrjParamService').gridRefresh();
										selectItem =  $injector.get('estimateParameterPrjParamService').getSelected();
										$injector.get('estimateParameterPrjParamService').markItemAsModified(selectItem);

									}else {
										if (isParam) {  // this case is for open paramter code windonw on project Boq/ wic Boq/ Assembly /EstLineItem  grid list
											dataList = ParameterComplexInputgroupLookupService.dataService.getList();
											ParameterComplexInputgroupLookupService.dataService.updateData(dataList);

											selectItem = $injector.get('estimateParamDataService').getSelectParam();

											let option =  ParameterComplexInputgroupLookupService.dataService.getformatterOptions();
											let mainEntity =ParameterComplexInputgroupLookupService.dataService.getMainEntity();

											let estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
											$injector.get('estimateParamUpdateService').markParamAsModified(selectItem, mainEntity, option.itemServiceName, option.itemName, estimateParameterFormatterService.getLookupList(option.itemName));


										} else {
											// param dialog window
											if (isAssembly) {
												$injector.get('estimateAssembliesDetailsParamListDataService').gridRefresh();

											}  if (isFromWicBoq || isFromProjectBoq) {
												$injector.get('boqMainDetailsParamListDataService').gridRefresh();
											}  if (isEstimate) {
												$injector.get('estimateMainDetailsParamListDataService').gridRefresh();

												$injector.get('estimateMainLineitemParamertersService').gridRefresh();
											}
										}
									}

									if(selectedDataItem.isLineItemParamContainerParam){
										$injector.get('estimateMainLineitemParamertersService').markItemAsModified(selectedDataItem);
									}
								}

							}
						}
					]
				};
				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: {
						getList: function (config, scope) {
							return estimateMainParameterValueLookupService.getListAsync(scope.entity);
						},
						getItemByKey: function (value) {
							return estimateMainParameterValueLookupService.getItemByKey(value);
						},
						getSearchList: function () {
							return estimateMainParameterValueLookupService.getSearchList();
						},
						getDisplayItem: function (value) {
							return estimateMainParameterValueLookupService.getItemByIdAsync(value);
						}
					}
				});
			}]);

})(angular);
