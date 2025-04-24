(function (angular) {
	'use strict';

	var moduleName = 'basics.billingschema';

	angular.module(moduleName).controller('basicsBillingSchemaDetailDeepCopyDialogController',
		['$scope', '$translate','platformGridAPI','platformTranslateService',
			'platformGridControllerService', '$injector','basicsBillingSchemaService','$timeout','platformRuntimeDataService',
			'basicsBillingSchemaBillingSchemaDetailService','basicsBillingSchemaRubricCategoryService',
			function ($scope, $translate,platformGridAPI,platformTranslateService,
					  gridControllerService,$injector,basicsBillingSchemaService,$timeout,platformRuntimeDataService,
					  basicsBillingSchemaBillingSchemaDetailService,basicsBillingSchemaRubricCategoryService) {

				$scope.options = $scope.$parent.$parent.$parent.options;
				$scope.gridId = $scope.options.Id || 'billing.schema.detail.deep.copy';
				$scope.gridData = {state: $scope.gridId};

				function initSourctText(){
					var selectedBillingSchema = basicsBillingSchemaService.getSelected();
					var souceBillingSchemaText;
					var SouceRubricCategoryText;
					if(basicsBillingSchemaService.isSelection(selectedBillingSchema)){
						souceBillingSchemaText = ''+ selectedBillingSchema.Sorting + ' - '+ selectedBillingSchema.Description;
					}

					var selectedRubricCategoryItem = basicsBillingSchemaRubricCategoryService.getSelected();
					if(basicsBillingSchemaService.isSelection(selectedRubricCategoryItem)){
						SouceRubricCategoryText = selectedRubricCategoryItem.DescriptionInfo.Translated;
					}

					var rubricCategorTree = basicsBillingSchemaRubricCategoryService.getTree();

					var rubric = rubricCategorTree.find(function(item){
						return item.Id ===  selectedRubricCategoryItem.ParentFk;
					});

					var rubricText = rubric.DescriptionInfo.Translated || '';

					var sourceBillingSchemaInfo = {
						SourceBillingSchemaLabel:'Source Billing Schema : ',
						SourceRubricCategoryLabel:'Source Rubric Category : ',
						SourceBillingSchemaText: souceBillingSchemaText,
						SourceRubricCategoryText:rubricText + ' - '+ SouceRubricCategoryText
					};

					$scope.sourceBillingSchemaInfo = sourceBillingSchemaInfo;
				}

				var settings = {columns:[]};
				var gridColumns = $injector.get('basicsBillingSchemaStandardConfigurationService');
				settings = gridColumns.getStandardConfigForListView();

				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}

				var data = basicsBillingSchemaService.getList();
				var displayData = angular.copy(data);
				var selectedBillingSchema = basicsBillingSchemaService.getSelected();
				_.remove(displayData,function(item){
					return item.Id === selectedBillingSchema.Id;
				});

				$scope.isOkDisabled = function(){

					var checkedItem = _.filter(displayData,function(item){
						return item.IsChecked === true;}
					);

					if(checkedItem && checkedItem.length > 1){
						return true;
					}

					if(checkedItem !== null && checkedItem !== undefined && checkedItem[0]){
						return false;
					}

					return true;
				};

				function init(){
					initSourctText();
					clearCheck();

					var selectedRubricCategoryItem = basicsBillingSchemaRubricCategoryService.getSelected();
					var availableBillingSchemaIdsPromise = basicsBillingSchemaBillingSchemaDetailService.getAvailableBillingSchemaForDeepCopy(selectedRubricCategoryItem.RubricCategoryId);

					availableBillingSchemaIdsPromise.then(function(availableBillingSchemaIds){
						var filteredItems = _.filter(displayData,function(item){
							return _.includes(availableBillingSchemaIds,item.Id);
						});
						_.forEach(filteredItems,function(entity){
							platformRuntimeDataService.readonly(entity, [{ field: 'IsChecked', readonly: true }]);
						});

						_.forEach(displayData,function(item){
							ProcessReadonly(item);
						});
						platformGridAPI.items.data($scope.gridId,displayData);
						refreshGrid();
					});
				}

				function clearCheck(){
					_.forEach(displayData,function(item){
						item.IsChecked = false;
					});
				}

				function validateCheck(checkedItem){
					if(checkedItem === null || checkedItem.length > 1){
						var message = 'Only support check one target billing schema to deep copy.';
						basicsBillingSchemaBillingSchemaDetailService.showMessage(message);
						return false;
					}
					return true;
				}

				function getCheckedItem(){
					var checkedItem = _.filter(displayData,function(item){
						return item.IsChecked === true;}
					);
					return checkedItem;
				}

				function validateCheckBox(item, value, field){
					var result = {apply: true, valid: true};

					_.map(displayData,function(entity){
						if(entity.IsChecked === true){
							entity.IsChecked = false;
						}
					});
					//result.valid = false;
					//result.error = $translate.instant('Only support check one item.');
					item[field] = value;
					platformRuntimeDataService.applyValidationResult(result, item, field);
					refreshGrid();

					return result;
				}

				function ProcessReadonly(item){
					var fields = settings.columns.map(function(column){
						return {field:column.field,readonly:true};
					});
					platformRuntimeDataService.readonly(item, fields);
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var tempColumns = angular.copy(settings.columns);
					tempColumns.unshift({
						id: 'IsChecked',
						field: 'IsChecked',
						name : 'Check',
						name$tr$: 'Check',
						formatter: 'boolean',
						editor: 'boolean',
						width: 60,
						validator: validateCheckBox,
						headerChkbox: false
					});

					var grid = {
						columns: angular.copy(tempColumns),
						data: [],
						id: $scope.gridId,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: 'ico-warning',
							skipPermissionCheck: true,
							collapsed : false
						}
					};

					platformGridAPI.grids.config(grid);
				}

				function refreshGrid(){
					$timeout(function () {
						platformGridAPI.grids.invalidate($scope.gridId);
						platformGridAPI.grids.resize($scope.gridId);
						platformGridAPI.grids.refresh($scope.gridId);
					}, 0);
				}

				angular.extend($scope.options,{
					onOK: function(){
						var checkedItem = getCheckedItem();
						var isValid = validateCheck(checkedItem);

						if(!isValid){
							return false;
						}

						$scope.$close({
							yes:true,
							targetBillingSchemaId:checkedItem[0].Id
						});
					},
					onCancel: function(){
						$scope.$close();
					}
				});

				init();

			}]);
})(angular);