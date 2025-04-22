/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	angular.module('sales.bid').directive('salesBidBidDialog', ['_', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsCommonUtilities', 'platformContextService',
		function (_, BasicsLookupdataLookupDirectiveDefinition, basicsCommonUtilities, platformContextService) {

			var defaults = {
				lookupType: 'SalesBid',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '71d48fecd1dd4e0180512d145fb30a08',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription' }
					// TODO:
					// { id: 'BidStatusFk', field: 'BidStatusFk', name: 'BidStatus', width: 180, name$tr$: 'sales.bid.entityBidStatusFk' }
					// projectno
					// projectname
					// rubric cat
				],
				title: { name: 'sales.bid.dialogTitleAssignBid' }
			};

			// restrict requests to current company
			defaults.buildSearchString = function (searchValue) {
				var searchFields = _.map(defaults.columns, 'field');
				var searchFilter = basicsCommonUtilities.buildSearchFilter(searchFields, searchValue);

				var companyId = platformContextService.getContext().clientId;
				return 'CompanyFk=' + companyId + (_.isEmpty(searchValue) ? '' : ' AND ' + searchFilter);
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);

})();
