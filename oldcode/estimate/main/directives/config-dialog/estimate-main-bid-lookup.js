(function () {

	'use strict';


	angular.module('estimate.main').directive('estimateMainBidLookup', ['$q', '_', 'estimateMainBidLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator', '$translate',
		function ($q, _, estimateMainBidLookupService, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator, $translate) {
			var tpyeOvl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.bidstatus', null, {
				showIcon: true
			}).grid;
			let defaults = {
				version: 2,
				lookupType: 'estimateMainChangeOrderLookup',
				valueMember: 'Id',
				// displayMember: 'Code',
				uuid: '5624CDA8658F44FFBD226CC894A3E4D5',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 140, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'},
					{id: 'bidstatusfk', field: 'BidStatusFk', name: 'Bid Status', name$tr$: 'sales.bid.entityBidStatusFk', width: 140, toolTip: 'Bid Status', formatter: tpyeOvl.formatter, formatterOptions: tpyeOvl.formatterOptions, readonly: true},
					{id: 'desc', field: 'DescriptionInfo.Description', name: 'Description', width: 240, toolTip: 'Description', formatter: 'description', name$tr$: 'cloud.common.entityDescription'}
				],
				popupOptions: {
					footerTemplate: '<div class="lookup-alert alert-info" style="width: 100%;">\n' +
						'                <span class="ng-binding">' + $translate.instant('estimate.main.createMaterialPackageWizard.note') + '</span>: <span class="ng-binding">' + $translate.instant('estimate.main.bidLookupNote') + '</span>\n' +
						'            </div>',
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'estimateMainChangeOrderLookup',

					getList: function getList(/* settings, scope */) {
						return estimateMainBidLookupService.getList();
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value/* , options, scope */) {
						return estimateMainBidLookupService.getItemByKey(value);
					},

					getSearchList: function getSearchList(/* searchString, displayMember, scope, searchListSettings */) {
						return estimateMainBidLookupService.getSearchList();
					}
				}
			});
		}
	]);

})();
