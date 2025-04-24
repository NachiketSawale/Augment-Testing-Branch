// quantity-transfer-form-lookup.js

/**
 * Created by chi on 5/31/2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.common';

	globals.lookups.quantityTransferFrom = function quantityTransferFrom($injector) {
		var basicsCommonQuantityTransferFormConstant = $injector.get('basicsCommonQuantityTransferFormConstant');
		var translate = $injector.get('$translate');
		var q = $injector.get('$q');
		var _ = $injector.get('_');

		var options = [
			{Id: 1, sortIndx: 1, value: basicsCommonQuantityTransferFormConstant.lineItemAQ, description: translate.instant('basics.common.quantityTransferForm.lineItemAQ')},
			{Id: 2, sortIndx: 2, value: basicsCommonQuantityTransferFormConstant.lineItemWQ, description: translate.instant('basics.common.quantityTransferForm.lineItemWQ')},
			{Id: 3, sortIndx: 3, value: basicsCommonQuantityTransferFormConstant.lineItemQuantityTotal, description: translate.instant('basics.common.quantityTransferForm.lineItemQuantityTotal')},
			{Id: 4, sortIndx: 4, value: basicsCommonQuantityTransferFormConstant.boqWQAQ, description: translate.instant('basics.common.quantityTransferForm.boQWQAQ')}
		];

		return {
			lookupOptions: {
				lookupType: 'quantityTransferFrom',
				valueMember: 'value',
				displayMember: 'description',
				uuid: '53C1C0F5CAE549DA9AF4B7DCB2115D22'
			},
			dataProvider: {
				getList: getList,
				getItemByKey: getItemByKey
			}
		};

		// ///////////////////////////////
		function getList() {
			return q.when(options.sort(function (a, b) {
				return a.sortIndx - b.sortIndx;
			}));
		}

		function getItemByKey(key, lookupOptions) {
			return q.when(_.find(options, function (opt) {
				return opt[lookupOptions.valueMember] === key;
			}));
		}
	};

	angular.module(moduleName).directive('basicsCommonQuantityTransferFormLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'globals',
		function ($injector, LookupDirectiveDefinition, globals) {
			var defaults = globals.lookups.quantityTransferFrom($injector);

			return new LookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular);
