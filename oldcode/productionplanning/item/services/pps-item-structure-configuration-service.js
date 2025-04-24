/**
 * Created by zwz on 7/4/2019.
 */
(function () {
	'use strict';
	var moduleName = 'productionplanning.item';
	/**
	 * @ngdoc service
	 * @name productionplanningItemStructureConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard configuration  for PPS Item Structure container
	 */
	angular.module(moduleName).factory('productionplanningItemStructureConfigurationService', ConfigurationService);

	ConfigurationService.$inject = [
		'basicsLookupdataConfigGenerator',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'platformSchemaService',
		'ppsCommonCustomColumnsServiceFactory',
		'productionplanningItemTranslationService',
		'productionplanningItemLayout'];

	function ConfigurationService(basicsLookupdataConfigGenerator,
								  platformUIStandardConfigService,
								  platformUIStandardExtentService,
								  platformSchemaService,
								  customColumnsServiceFactory,
								  translationService,
								  itemLayout) {

		var customColumnsService = customColumnsServiceFactory.getService(moduleName);

		function isDateTimeColumn(columnSelection) {
			// columnSelection: 0~5 maps columns PLANNEDSTART, PLANNEDFINISH, EARLIESTSTART, LATESTSTART, EARLIESTFINISH and LATESTFINISH
			return columnSelection >= 0 && columnSelection <= 5;
		}

		function isQtyColumn(columnSelection) {
			// columnSelection: 6 maps  column Quantity
			return columnSelection === 6;
		}

		function getLayout() {
			var layout = _.cloneDeep(itemLayout);

			_.each(customColumnsService.clerkRoleSlots,function (item) {
				if(layout.overloads[item.FieldName]){
					layout.overloads[item.FieldName].grid.editorOptions.lookupOptions.additionalColumns = false;
				}
			});

			_.each(['lgmjobfk', 'prjlocationfk'], function (field) {
				if (layout.overloads[field]) {
					layout.overloads[field].grid.editorOptions.lookupOptions.additionalColumns = false;
				}
			});
			return layout;
		}

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item' });
		var schemaProperties = _.cloneDeep(dtoSchema.properties);
		//var schemaProperties = dtoSchema.properties;

		_.merge(schemaProperties, customColumnsService.attributes);

		var dic = {
			0: 'PlannedStart',
			1: 'PlannedFinish',
			2: 'EarliestStart',
			3: 'LatestStart',
			4: 'EarliestFinish',
			5: 'LatestFinish'
		};
		_.each(customColumnsService.eventTypeSlots,function (item) {
			if (schemaProperties[item.FieldName] && isDateTimeColumn(item.ColumnSelection)) {
				schemaProperties[item.FieldName].grouping = 'ProductionPlanning.Item.'+ dic[item.ColumnSelection];
			}
			// add domain property "quantity" for custom quantity columns, that will be use in filter container
			else if (schemaProperties[item.FieldName] && isQtyColumn(item.ColumnSelection)) {
				schemaProperties[item.FieldName].domain = 'quantity';
			}
		});

		schemaProperties.InsertedAt.grouping = 'Inserted';
		schemaProperties.InsertedBy.grouping = 'WhoIsr';
		schemaProperties.UpdatedAt.grouping = 'Updated';
		schemaProperties.UpdatedBy.grouping = 'WhoUpd';

		_.each(customColumnsService.clerkRoleSlots,function (item) {
			if(schemaProperties[item.FieldName]){
				schemaProperties[item.FieldName].grouping = 'ProductionPlanning.Item.ClerkFk';
			}
		});

		function ItemUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ItemUIStandardService.prototype = Object.create(BaseService.prototype);
		ItemUIStandardService.prototype.constructor = ItemUIStandardService;

		var uiServ = new BaseService(getLayout(), schemaProperties, translationService);
		// remove grouping properties of custom quantity columns
		var listConfig = uiServ.getStandardConfigForListView();
		var eventTypeQtySlots = _.filter(customColumnsService.eventTypeSlots, function (item) {
			return isQtyColumn(item.ColumnSelection);
		});
		var qtyFields = _.map(eventTypeQtySlots, function (e) {
			return e.FieldName.toLowerCase();
		});
		_.each(listConfig.columns, function (column) {
			if( _.findIndex(qtyFields,function(o){ return o === column.id.toLowerCase(); }) > -1 ){
				//console.log(column);
				column.grouping = undefined;
			}
		});

		return uiServ;
	}
})();