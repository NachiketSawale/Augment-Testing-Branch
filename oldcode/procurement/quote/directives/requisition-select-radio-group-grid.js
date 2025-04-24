/**
 * Created by zpa on 2016/11/15.
 */
(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 * form with radio groups and grid
	 */
	var moduleName = 'procurement.quote';

	angular.module(moduleName).directive('requisitionSelectForm',
		['$timeout', '$translate','platformTranslateService','platformGridAPI', 'procurementQuoteRequisitionDataService',
			function ($timeout, $translate, platformTranslateService, platformGridAPI, procurementQuoteRequisitionDataService) {
				/* jshint -W043 */
				var template = '<div > \
							<div data-ng-repeat="item in items"> \
								<input type="radio"  name="radioGroup" ng-value="{{item.value}}" data-ng-model="editorMode"  ng-click="onRadioGroupOptChanged(item.value)">{{item.label | translate}}\
							</div> \
							<div  >\
							      <platform-Grid data="previewGridData"></platform-Grid>\
							</div>\
						</div>';

				return {
					restrict: 'A',
					require: 'ngModel',
					scope: {
						ngModel: '=',  // list of objects (must have a unique Id member!)
						options: '='   // displayMember, selectedMember, (predicate)
					},
					template: template,
					link: link,
					controller:['$scope',function ($scope) {

						$scope.previewGridData={
							state:'B0F91870D5804749BE358015D372B8F7'
						};
						var previewGridId = 'B0F91870D5804749BE358015D372B8F7';

						function setupMappingGrid() {

							// noinspection JSCheckFunctionSignatures
							if (!platformGridAPI.grids.exist(previewGridId)) {
								var mappingGridConfig = {
									columns: [
										{
											editor: 'boolean',
											field: 'IsSelected',
											formatter: 'boolean',
											id: 'isselected',
											name: 'Is Selected',
											name$tr$: 'procurement.quote.isSelected',
											sortable: true,
											toolTip: 'Is Selected',
											toolTip$tr$: 'procurement.quote.isSelected'
										},
										{
											editor:'lookup',
											field:'ReqHeaderFk',
											formatter:'lookup',
											formatterOptions:{
												displayMember:'StatusInfo.Translated',
												imageSelector:'platformStatusIconService',
												lookupType:'reqheaderlookupview'
											},
											id:'reqheaderfk',
											name:'Status',
											name$tr$:'cloud.common.entityState',
											required:true,
											sortable: true,
											toolTip:'Status',
											toolTip$tr$:'cloud.common.entityState'
										},
										{
											field:'ReqHeaderFk',
											formatter:'lookup',
											formatterOptions:{
												displayMember:'Code',
												lookupType:'reqheaderlookupview'
											},
											id:'ReqHeaderFkCode',
											lookupDisplayColumn:true,
											name:'Code',
											name$tr$:'cloud.common.entityCode',
											width:150
										},
										{
											field:'ReqHeaderFk',
											formatter:'lookup',
											formatterOptions:{
												displayMember:'Description',
												lookupType:'reqheaderlookupview'
											},
											id:'ReqHeaderFkDescription',
											lookupDisplayColumn:true,
											name:'Description',
											name$tr$:'cloud.common.entityDescription',
											width:150
										},
										{
											field:'ReqHeaderFk',
											formatter:'lookup',
											formatterOptions:{
												displayMember:'ProjectNo',
												lookupType:'reqheaderlookupview'
											},
											id:'ReqHeaderFkProjectNo',
											lookupDisplayColumn:true,
											name:'Project No.',
											name$tr$:'cloud.common.entityProjectNo',
											width:150
										},
										{
											field:'ReqHeaderFk',
											formatter:'lookup',
											formatterOptions:{
												displayMember:'ProjectName',
												lookupType:'reqheaderlookupview'
											},
											id:'ReqHeaderFkProjectName',
											lookupDisplayColumn:true,
											name:'Project Name',
											name$tr$:'cloud.common.entityProjectName',
											width:150
										}
									],
									data: [],
									id: 'B0F91870D5804749BE358015D372B8F7',
									lazyInit: true,
									options: {
										enableDraggableGroupBy:true,
										skipPermissionCheck:true,
										tree: false,
										indicator: true,
										idProperty: 'Id',
										iconClass: ''
									}
								};
								platformGridAPI.grids.config(mappingGridConfig);
								platformTranslateService.translateGridConfig(mappingGridConfig.columns);

							}
							platformGridAPI.grids.invalidate(previewGridId);
							platformGridAPI.items.data(previewGridId, $scope.ngModel);
						}
						setupMappingGrid();

					}]
				};

				function link(scope, elem, attrs, ctrl) {

					scope.editorMode = procurementQuoteRequisitionDataService.getEditorMode();
					scope.items = [
						{
							value: 0,
							label: $translate.instant('procurement.quote.importQuote.importAll')
						},
						{
							value: 1,
							label: $translate.instant('procurement.quote.importQuote.importSelected')
						}
					];


					scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue) {
						scope.editorMode = radioValue;
						if(scope.editorMode === 0){
							procurementQuoteRequisitionDataService.importToAll(true);
						}else{
							procurementQuoteRequisitionDataService.importToAll(false);
						}
					};

					$timeout(function() {
						ctrl.$setViewValue(scope.ngModel);
						ctrl.$render();
					}, 0);

				}

			}]);
})(angular);