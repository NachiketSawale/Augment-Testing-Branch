(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name procurementCommonPrcItemFormController
	 * @require $scope, procurementCommonPrcItemDataService, lookupDataService, procurementRequisitionHeaderDataService,
	 *          modelViewerStandardFilterService
	 * @description controller for item detail
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementCommonPrcItemFormController',
		['$scope', '$injector', 'procurementContextService', 'procurementCommonPrcItemDataService',
			'platformDetailControllerService', 'procurementCommonPrcItemValidationService',
			'procurementCommonItemUIStandardService', 'platformTranslateService',
			'modelViewerStandardFilterService', 'basicsCommonMandatoryProcessor',
			function ($scope, $injector, moduleContext, dataServiceFactory, platformDetailControllerService,
				validationService, itemDetailFormConfig, platformTranslateService,
				modelViewerStandardFilterService, basicsCommonMandatoryProcessor) {

				var mainService = moduleContext.getMainService();
				var dataService = dataServiceFactory.getService(mainService);

				validationService = validationService(dataService);
				if (mainService) {
					moduleContext.getItemDataContainer().data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'PrcItemDto',
						moduleSubModule: 'Procurement.Common',
						validationService: validationService,
						mustValidateFields: ['PrcStructureFk', 'BasUomFk', 'BasItemType2Fk']
					});
				}
				itemDetailFormConfig.isDynamicReadonlyConfig = true;
				platformDetailControllerService.initDetailController($scope, dataService, validationService, itemDetailFormConfig, platformTranslateService);

				// remove add and delete when module readonly
				if (moduleContext.getModuleReadOnly()) {
					$scope.formContainerOptions.onAddItem = false;
					$scope.formContainerOptions.onDeleteItem = false;
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService);

				/* $scope.formOptions.configure.dirty = function dirty(entity, field, options) {
					if(dataService.costGroupService && options && options.costGroupCatId){
						dataService.costGroupService.createCostGroup2Save(entity, {costGroupCatId : options.costGroupCatId, field : options.model});
					}
				}; */

				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
						scope: $scope,
						dataService: dataService,
						validationService: validationService,
						formConfiguration: itemDetailFormConfig,
						costGroupName: 'basicData'
					});
				}

				dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);
				dataService.registerSelectionChanged(setCopyMainCallOffItemTool);

				$scope.$on('$destroy', function () {
					dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
					dataService.unregisterSelectionChanged(setCopyMainCallOffItemTool);
				});

				/* refresh the columns configuration when controller is created */
				if (dataService.costGroupCatalogs) {
					costGroupLoaded(dataService.costGroupCatalogs);
				}

				function setCopyMainCallOffItemTool() {
					if (mainService && mainService.name === 'procurement.contract' && $scope.tools && $scope.tools.items) {
						moduleContext.addToolCopyMainCallOffItem($scope, dataService);
					}
				}

				setCopyMainCallOffItemTool();
			}]);
})(angular);