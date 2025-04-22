/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc value
	 * @name salesCommonValues
	 * @description provides some common default sidebar options
	 */
	angular.module(salesCommonModule).value('sidebarDefaultOptions', {
		enhancedSearchEnabled: true,
		pattern: '',
		pageSize: 100,
		useCurrentClient: true,
		includeNonActiveItems: false,
		showOptions: true,
		showProjectContext: false,
		withExecutionHints: false
	});

	/**
	 * @ngdoc value
	 * @name salesCommonBillTypeLookupOptions
	 * @description provides config for bill type lookup
	 */
	angular.module(salesCommonModule).value('salesCommonBillTypeLookupOptions', {
		lookupModuleQualifier: 'basics.customize.billtype',
		displayMember: 'Description',
		valueMember: 'Id',
		filter: {
			customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
			customBoolProperty: 'ISPROGRESS'
			// TODO: add ISDEFAULT
		}
	});

	/**
	 * @ngdoc value
	 * @name salesCommonRubric
	 * @description provides constants for sales rubrics (BAS_RUBRIC)
	 */
	angular.module(salesCommonModule).constant('salesCommonRubric', Object.freeze({
		Bid: 4,
		Contract: 5,
		Wip: 17,
		Billing: 7
	}));
})();
