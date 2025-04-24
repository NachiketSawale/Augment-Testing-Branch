(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLeadQuantityConfigurationService
	 * @function
	 *
	 * @description
	 * This is the config service for all estimate lead quantity calculation views.
	 */
	angular.module(moduleName).factory('estimateMainLeadQuantityAggregatorConfigService', ['$injector', '$translate', '$http', 'estimateMainLeadQuantityAggregatorDataService',

		function ($injector, $translate, $http, leadQuantityAggregatorDataService) {

			function extendEstAggregatorSchema(domainSchema){
				if(!domainSchema) {
					return;
				}
				let estAggregatorProps = {
					AggrQuantityTotal : {domain: 'quantity'},
					AggrHoursUnit : {domain: 'quantity'},
					AggrHoursTotal : {domain: 'quantity'},
					AggrCostUnit : {domain: 'money'},
					AggrCostTotal : {domain: 'money'}
				};
				angular.extend(domainSchema, estAggregatorProps);

				return domainSchema;
			}

			function extendEstAggregatorLayout(layout){
				if(!layout || !layout.groups){
					return;
				}

				let estAggrAttributes = [
					'aggrquantitytotal',
					'aggrhoursunit',
					'aggrhourstotal',
					'aggrcostunit',
					'aggrcosttotal'];

				let basicGroup = _.find(layout.groups, {gid:'basicData'});
				if(basicGroup && _.isArray(basicGroup.attributes)){
					basicGroup.attributes = basicGroup.attributes.concat(estAggrAttributes);
					_.forEach(estAggrAttributes, function (item) {
						layout.overloads[item] = {'readonly': true};
					});
				}
			}

			function extendEstAggregatorLayoutAndSchema(layout, schema){
				extendEstAggregatorLayout(layout);
				extendEstAggregatorSchema(schema);
			}

			function addAggrLeadQuantityTool(scope, dataServiceName) {
				let dataService = $injector.get(dataServiceName);
				if(!dataServiceName){return;}
				let calculatorTool = [{
					id: 'estimate-main-lead-quantity-aggregator',
					caption: 'estimate.main.aggrLeadQuantity',
					type: 'item',
					iconClass: 'control-icons ico-recalculate',
					disabled:   function() {
						return !_.some(dataService.getList());
					},
					fn: function () {
						leadQuantityAggregatorDataService.aggregateLeadQuantity(dataServiceName);
					}
				}];

				scope.addTools(calculatorTool);
			}

			return {
				extendEstAggregatorLayoutAndSchema : extendEstAggregatorLayoutAndSchema,
				addAggrLeadQuantityTool : addAggrLeadQuantityTool
			};
		}
	]);
})(angular);

