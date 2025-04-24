(function (angular) {
	'use strict';
	/* globals angular, _ */
	var moduleName = 'productionplanning.engineering';
	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringTaskProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningEngineeringTaskProcessor is the service to process fields.
	 *
	 */
	angular.module(moduleName).factory('productionplanningEngineeringTaskProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsCommonCustomColumnsServiceFactory',
		'ppsEntityConstant',
		'productionplanningEngineeringTaskStatusLookupService',
		'basicsCompanyNumberGenerationInfoService',
		'ppsCommonCodGeneratorConstantValue'];

	function processor(platformRuntimeDataService, customColumnsServiceFactory,
		ppsEntityConstant,
		engTaskStatusLookupService,
					   basicsCompanyNumberGenerationInfoService,
					   ppsCommonCodGeneratorConstantValue) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item.Version > 0) {
				service.setColumnsReadOnly(item, ['EngHeaderFk'], true);
				service.setColumnsReadOnly(item, ['Code'], false);
			}
			if(item.Version === 0){
				var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(item.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.EngineeringTask);
				if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsEngineeringTaskNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
				{
					item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsEngineeringTaskNumberInfoService').provideNumberDefaultText(categoryId);
					service.setColumnsReadOnly(item, ['Code'], true);
				}
			}
			service.setColumnsReadOnly(item, ['EngDrawingFk'], item.HasProductDescriptions);
			service.setColumnsReadOnly(item, ['EngDrawingFk'], item.HasEvent);
			// remark: if an engineering task has productDescriptions but without a valid EngDrawingFk value, its EngDrawingFk also should be readonly until all of its productDescriptions have been removed.

			processCustomColumns(item);
			processBackgroundcolor(item);
			processItemForLogging(item);

			// If engTask is part of an event sequence of a PU, set field PrjLocationFk readonly(#113967)
			service.setColumnsReadOnly(item, ['PrjLocationFk'], item.IsPartOfEventSequence);

		};

		service.processItemAfterUpdating = function (item) {
			service.setColumnsReadOnly(item, ['EngHeaderFk'], true);
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			fields.push({field: 'DateshiftMode', readonly: item.Version > 0});
			platformRuntimeDataService.readonly(item, fields);
		};

		function processCustomColumns(item) {
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			// set eventtype slot columns for HP-ALM #102939 by pep on 2019/8/29
			customColumnsService.updateDateTimeFields(item);
			if (_.isArray(item.ReadonlyCustomColumns)) {
				service.setColumnsReadOnly(item, item.ReadonlyCustomColumns, true);
			}

			// if an engtask doesn't has a linked pu, for those specified dynamic clerk slot columns(slot column that shows on engtask, and source from pu), set them readonly.(HP-ALM #126667 by zwz 2021/12/9)
			if (_.isNil(item.PPSItemFk) || item.PPSItemFk === 0) {
				const task2PuSlotFields = _.filter(customColumnsService.clerkRoleSlots, function (slot) {
					return slot.PpsEntityRefFk === ppsEntityConstant.PPSItem;
				}).map(function (slot) {
					return slot.FieldName;
				});
				service.setColumnsReadOnly(item, task2PuSlotFields, true);
			}
		}

		function processBackgroundcolor(item){
			// for HP-ALM #107907 Engineering Task Status: Background color per status and status color column by lav on 2020/3/9
			var statusList = engTaskStatusLookupService.getList();
			var status = _.find(statusList, {Id: item.EngTaskStatusFk});
			if (status) {
				item.Backgroundcolor = status.Backgroundcolor;
			}
		}

		function processItemForLogging(item){
			//add getType() method for logging functionality of EngTask Event(HP-ALM #103587 by zov on 2020/1/16)
			item.getType = function () {
				return item.EventTypeFk;
			};
		}

		return service;
	}
})(angular);
