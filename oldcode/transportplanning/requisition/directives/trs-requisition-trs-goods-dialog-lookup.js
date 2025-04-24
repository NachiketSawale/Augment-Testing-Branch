/**
 * Created by lav on 02/24/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('trsRequisitionTrsGoodsDialogLookupConfig', DialogLookupConfig);
	DialogLookupConfig.$inject = ['basicsLookupdataConfigGenerator', 'productionplanningDrawingDialogLookupDataService',
		'transportplanningRequisitionTrsGoodsUIStandardServiceFactory'];

	function DialogLookupConfig(basicsLookupdataConfigGenerator, dialogLookupDataService,
								trsGoodsUIStandardServiceFactory) {
		var service = {};

		service.formSettings = {
			fid: 'transportplanning.requisition.trsgoodsdialoglookup.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [{
				gid: 'selectionfilter',
				isOpen: true,
				visible: true,
				sortOrder: 1
			}],
			rows: [{
				gid: 'selectionfilter',
				rid: 'project',
				label: 'Project',
				label$tr$: 'cloud.common.entityProject',
				type: 'directive',
				directive: 'basics-lookup-data-project-project-dialog',
				options: {
					showClearButton: true
				},
				model: 'projectId',
				sortOrder: 1
			}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.transportgoodstype', '',
				{
					gid: 'selectionfilter',
					rid: 'trsgoodtypeid',
					label: 'Trs Goods Type',
					label$tr$: 'transportplanning.requisition.trsGoods.goodsType',
					model: 'trsGoodTypeId',
					sortOrder: 2
				}, false, {required: false, showIcon: true}
			)
			]
		};

		service.gridSettings = _.cloneDeep(trsGoodsUIStandardServiceFactory.createNewService().getStandardConfigForListView());
		service.gridSettings.inputSearchMembers = ['Description'];
		_.forEach(service.gridSettings.columns, function (column) {
			column.editor = null;
			column.navigator = null;
		});

		service.createLookupOptions = function (serverKey) {
			var lookupOptions = {
				lookupType: 'TrsGoods',
				valueMember: 'Id',
				displayMember: 'DisplayTxt',
				title: 'transportplanning.requisition.assignTrsGoods',
				filterOptions: {
					serverSide: true,
					serverKey: serverKey,
					fn: function () {
						var filter = dialogLookupDataService.getFilterParams();
						return filter;
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: '9c4f5b5fa8dd4614850297daef6ccccc'
			};
			return lookupOptions;
		};

		return service;
	}

	angular.module(moduleName).directive('trsRequisitionTrsGoodsDialogLookup', Lookup);
	Lookup.$inject = ['LookupFilterDialogDefinition', 'trsRequisitionTrsGoodsDialogLookupConfig'];

	function Lookup(LookupFilterDialogDefinition, dialogLookupConfig) {
		var lookupOptions = dialogLookupConfig.createLookupOptions();
		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningDrawingDialogLookupDataService', dialogLookupConfig.formSettings, dialogLookupConfig.gridSettings);
	}

})(angular);
