/**
 * Created by baf on 01.04.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	myModule.service('logisticSettlementBillingSchemaReadOnlyProcessor', LogisticSettlementBillingSchemaReadOnlyProcessor);

	LogisticSettlementBillingSchemaReadOnlyProcessor.$inject = ['_', 'platformRuntimeDataService', 'basicsBillingSchemaBillingLineType'];

	function LogisticSettlementBillingSchemaReadOnlyProcessor(_, platformRuntimeDataService, basicsBillingSchemaBillingLineType) {
		var staticReadOnlyProperties = (function provideStandardReadOnlyDesc() {
			var properties = ['BillingSchemaFk', 'SettlementFk','Sorting','BillingLineTypeFk','GeneralsTypeFk',
				'Result','ResultOc','IsEditable','Group1','Group2','IsPrinted','AccountNo','OffsetAccountNo','IsTurnover',
				'TaxCodeFk','FinalTotal','HasControllingUnit','UserDefined01','UserDefined02','UserDefined03','IsBold',
				'IsItalic','IsUnderline','BillingSchemaDetailFk','BillingSchemaAaFk','BillingSchemaTaxFk','CredFactor',
				'DebFactor','CredLineTypeFk','DebLineTypeFk','CodeRetention','PaymentTermFk','Formula','IsPrintedZero'];
			var res = [];
			_.forEach(properties, function(property) {
				res.push({
					field: property,
					readonly: true
				});
			});
			return res;
		})();

		var valueWriteableTypes = [basicsBillingSchemaBillingLineType.generals,
			basicsBillingSchemaBillingLineType.discountOrUpliftAmount,
			basicsBillingSchemaBillingLineType.vatCalculated,
			basicsBillingSchemaBillingLineType.earlyPaymentDiscount];

		function itemIsNotOfWritableType(item) {
			return !_.find(valueWriteableTypes, function(type) {
				return type === item.BillingLineTypeFk;
			});
		}

		this.processItem = function processItem(item) {
			var dynamicReadOnlyProperties = [{
				field: 'Description',
				readonly: !item.IsEditable
			},{
				field: 'Description2',
				readonly: !item.IsEditable
			},{
				field: 'ControllingUnitFk',
				readonly: !item.HasControllingUnit
			},{
				field: 'Value',
				readonly: itemIsNotOfWritableType(item)
			}];

			platformRuntimeDataService.readonly(item, _.concat(staticReadOnlyProperties, dynamicReadOnlyProperties));
		};
	}

})(angular);