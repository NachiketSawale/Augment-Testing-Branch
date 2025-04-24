/**
 * Created by jes on 2/17/2017.
 */
/* global globals */
(function (angular, globals) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterWicBoqItemLookup', constructionSystemMasterWicBoqItemLookup);

	constructionSystemMasterWicBoqItemLookup.$inject = [
		'_',
		'$http',
		'$templateCache',
		'boqMainImageProcessor',
		'BasicsLookupdataParentChildGridLookupDialogDefinition',
		'constructionSystemMasterBoqItemLookupDataProvider'
	];

	function constructionSystemMasterWicBoqItemLookup(
		_,
		$http,
		$templateCache,
		boqMainImageProcessor,
		BasicsLookupdataParentChildGridLookupDialogDefinition,
		dataProvider
	) {
		var options = {
			lookupType: 'BoqItemFk',
			valueMember: 'Id',
			displayMember: 'Reference',
			dialogOptions: {
				headerText: 'constructionsystem.master.boqLookup'
			},
			popupOptions: {
				width: 420,
				height: 300,
				template: $templateCache.get('grid-popup-lookup.html'),
				footerTemplate: $templateCache.get('lookup-popup-footer.html'),
				controller: 'basicsLookupdataGridPopupController',
				showLastSize: true
			},
			treeOptions: { // popup tree
				parentProp: 'BoqItemFk',
				childProp: 'BoqItems',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			selectableCallback: function (selectedItem) { // this is for the popup grid
				return selectedItem.BoqLineTypeFk === 0;
			},
			buildSearchString: function (searchString) { // workaround to force to do server side search
				return searchString;
			},
			dataProvider: dataProvider,
			disableDataCaching: true,
			parent: {
				key: 'BoqHeaderFk',
				uuid: 'D00F9424446B45A5A1C932FAF83BABD4',
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/',
					endRead: 'getboqheaderlookup',
					usePostForRead: true,
					getRequestParam: function() {
						return { BoqType: 1 };// only care about wicBoq here
					}
				},
				columns: [
					{
						id: 'boqnumber',
						field: 'BoqNumber',
						name: 'Boq Number',
						name$tr$: 'boq.main.boqHeaderSel',
						readonly: true,
						width: 100
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						readonly: true,
						width: 300
					}
				]
			},
			child: {
				uuid: '6B6AE18FFA93453796C6FFA60718CB13',
				parentFk: 'BoqHeaderFk',
				showAllSearchResult: true,
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/',
					endRead: 'tree',
					getRequestParam: function (parentItem) {
						// the hard code request parameter reference from boqMainServiceFactory (function setSelectedHeaderFk, line 3641)
						return '?headerId=' + parentItem.BoqHeaderFk + '&startId=' + 0 + '&depth=' + 99 + '&recalc=' + 1;
					}
				},
				httpSearch: {
					getSearchList: function (searchValue, service) {
						var headerIds = _.map(service.parentService.getList(), function (item) {
							return item.BoqHeaderFk;
						});
						var param = {
							BoqHeaderIds: headerIds,
							FilterValue: searchValue
						};
						return $http.post(globals.webApiBaseUrl + 'boq/main/getboqitemsearchlist', param)
							.then(function (res) {
								return _.isArray(res.data) ? res.data : [];
							});
					}
				},
				canApply: function (selectedItem) {
					return selectedItem.BoqLineTypeFk === 0;
				},
				presenter: {
					tree: {
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems'
					}
				},
				dataProcessor: [boqMainImageProcessor],
				columns: [
					{
						id: 'reference',
						field: 'Reference',
						name: 'Reference No.',
						name$tr$: 'boq.main.Reference',
						readonly: true,
						width: 120
					},
					{
						id: 'description',
						field: 'BriefInfo.Translated',
						name: 'Brief',
						name$tr$: 'cloud.common.entityBrief',
						formatter: 'description',
						readonly: true,
						width: 120
					},
					{
						id: 'wicnumber',
						field: 'WicNumber',
						name: 'WIC No.',
						name$tr$: 'boq.main.WicNumber',
						readonly: true,
						width: 100
					}
				]
			}

		};

		return new BasicsLookupdataParentChildGridLookupDialogDefinition(options);
	}

})(angular, globals);