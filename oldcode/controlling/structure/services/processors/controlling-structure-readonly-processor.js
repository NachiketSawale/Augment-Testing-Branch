/**
 * Created by janas on 17.09.2015.
 */


(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name controllingStructureReadonlyProcessor
	 * @function
	 *
	 * @description
	 * The controllingStructureReadonlyProcessor checks and sets which fields of controlling units are readonly or not.
	 */

	angular.module('controlling.structure').factory('controllingStructureReadonlyProcessor', [
		'_', '$injector', 'platformRuntimeDataService', 'platformContextService', 'controllingStructureContextService',
		function (_, $injector, platformRuntimeDataService, platformContextService, controllingStructureContextService) {

			var service = {};

			service.processItem = function processItem(curUnit) {

				// not login or parent company? => make items entirely readonly!
				var context = platformContextService.getContext();
				// default only login company (e.g. profit center)
				var allowedCompanyIds = [context.signedInClientId, context.clientId];
				// TODO: (#137032) detailed verification + documentation needed + simply can + maybe add sys opt for different behaviours
				// logged into client and not profit center?
				// if (context.clientId === context.signedInClientId) { // check removed via #137032
				var subCompanyIds = controllingStructureContextService.getSubCompanyIds(context.clientId);
				allowedCompanyIds = allowedCompanyIds.concat(subCompanyIds);
				// }
				var isEntityReadOnly = !_.includes(allowedCompanyIds, curUnit.CompanyFk);
				platformRuntimeDataService.readonly(curUnit, isEntityReadOnly);

				var readonlyFields = [];

				// planned start / planned end / planned duration readonly for nodes with children
				if (curUnit.HasChildren) {
					readonlyFields.push(
						{field: 'PlannedStart', readonly: true},
						{field: 'PlannedEnd', readonly: true},
						{field: 'ContrFormulaPropDefFk', readonly: true},
						{field: 'PlannedDuration', readonly: true}
					);
				}

				// set readonly flag initially for stock/plant management (see also validation)
				// show lookups only when corresponing flags are set to true (#82834)
				if (!curUnit.IsStockmanagement) {
					readonlyFields.push({field: 'StockFk', readonly: true});
				}
				if (!curUnit.IsPlantmanagement) {
					readonlyFields.push({field: 'EtmPlantFk', readonly: true});
				}
				readonlyFields.push({field: 'IsFixedBudget', readonly: !curUnit.IsPlanningElement});
				readonlyFields.push({field: 'Budget', readonly: !(curUnit.IsPlanningElement && curUnit.IsFixedBudget)});
				readonlyFields.push({field: 'BudgetDifference', readonly: true});

				// Check read only from Controlling unit status
				if (curUnit.Version !== 0){
					var controllingunitstatusLookupData = $injector.get('basicsLookupdataLookupDescriptorService').getData('controllingunitstatus');
					var customizedStatusItem = _.find(controllingunitstatusLookupData, { Id: curUnit.ControllingunitstatusFk });
					if (customizedStatusItem && customizedStatusItem.ReadOnly === true){
						var controllingUnitFieldsReadOnly = [];

						_.forOwn(curUnit, function(value, key) {
							var field = {field: key , readonly: true};
							controllingUnitFieldsReadOnly.push(field);
						});

						readonlyFields = controllingUnitFieldsReadOnly;
					}
				}

				platformRuntimeDataService.readonly(curUnit, readonlyFields);
			};

			service.processItemBudget = function processItemBudget(curUnit, isFixedBudget) {
				platformRuntimeDataService.readonly(curUnit, [{field: 'Budget', readonly: !isFixedBudget}]);
			};

			service.processPlanningElement = function processPlanningElement(curUnit, isPlanningElement) {
				platformRuntimeDataService.readonly(curUnit, [{field: 'IsFixedBudget', readonly: !isPlanningElement}]);
				platformRuntimeDataService.readonly(curUnit, [{field: 'Budget', readonly: !(isPlanningElement && curUnit.IsFixedBudget)}]);
			};

			service.readOnly = function readOnly(items, isReadOnly){
				var fields = [],
					item = _.isArray(items) ? items[0]:null;

				_.forOwn(item, function(value, key) {
					var field = {field: key , readonly: isReadOnly};
					fields.push(field);
				});

				angular.forEach(items, function(resItem){
					if(resItem && resItem.Id){
						platformRuntimeDataService.readonly(resItem, fields);
					}
				});
			};

			return service;
		}]);
})();
