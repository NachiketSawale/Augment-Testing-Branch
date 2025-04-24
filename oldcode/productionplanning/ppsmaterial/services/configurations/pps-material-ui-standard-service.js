(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.ppsmaterial';
	/**
	 * @ngdoc service
	 * @name productionplanningPpsMaterialUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of PPS Material entities
	 */
	angular.module(moduleName).factory('productionplanningPpsMaterialUIStandardService', UIStandardService);

	UIStandardService.$inject = ['_', '$translate',
		'basicsLookupdataConfigGenerator',
		'platformObjectHelper',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'platformSchemaService',
		'productionplanningPpsMaterialTranslationService',
		'basicsMaterialRecordLayout',
		'productionplanningPpsMaterialEntityPropertychangedExtension'];

	function UIStandardService(_, $translate,
							   basicsLookupdataConfigGenerator,
							   platformObjectHelper,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   platformSchemaService,
							   translationServ,
							   layout,
							   ppsMaterialExtension) {

		var BaseService = platformUIStandardConfigService;

		var newLayout = _.cloneDeep(layout);

		newLayout.change = function(entity, field) {
			ppsMaterialExtension.onPpsMaterialPropertyChanged(entity, field);
		};

		var index = _.findIndex(newLayout.groups, {'gid': 'entityHistory'});
		newLayout.groups.splice(index, 0, {'gid': 'ppsProperties', 'attributes': []});
		newLayout.groups.splice(index + 1, 0, {'gid': 'pUCreationGroup', 'attributes': []});
		newLayout.groups.splice(index + 2, 0, {'gid': 'ppsUserdefinedTexts', 'attributes': []});

		let summarizedMode =  [
			{Id: 0, Description: $translate.instant('productionplanning.ppsmaterial.summarized.noSummarized')},
			{Id: 1, Description: $translate.instant('productionplanning.ppsmaterial.summarized.merge')},
			{Id: 2, Description: $translate.instant('productionplanning.ppsmaterial.summarized.group')},
			{Id: 3, Description: $translate.instant('productionplanning.ppsmaterial.summarized.mix')}
		];

		let summarizedGroup =  [
			{Id: 0, Description: $translate.instant('productionplanning.ppsmaterial.summarized.noGroups')},
			{Id: 1, Description: $translate.instant('productionplanning.ppsmaterial.summarized.location1')},
			{Id: 2, Description: $translate.instant('productionplanning.ppsmaterial.summarized.location2')},
			{Id: 3, Description: $translate.instant('productionplanning.ppsmaterial.summarized.location3')}
		];

		var groupfkConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.PPSProductionMaterialGroup');
		var ppsMaterialSitegroupFkConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsmaterialsitegroup');

		var ppsProperties = {
			grid: [
				_.merge(groupfkConfig.grid, {
					'afterId': 'userdefinednumber5',
					'id': 'ppsMaterialProdMatGroupFk',
					'field': 'PpsMaterial.ProdMatGroupFk',
					'name': '*Production Material Group',
					'name$tr$': 'productionplanning.ppsmaterial.mat2ProdMatGroup.entityProdMatGroup',
					'sortable': true,
					'required': true
				}),
				{
					'afterId': 'ppsMaterialProdMatGroupFk',
					'id': 'ppsMaterialIsBundled',
					'field': 'PpsMaterial.IsBundled',
					'name': 'Is Bundled',
					'name$tr$': 'productionplanning.ppsmaterial.record.isbundled',
					'sortable': true,
					'editor': 'boolean',
					'formatter': 'boolean'
				},
				{
					'afterId': 'ppsMaterialIsBundled',
					'id': 'ppsMaterialBasClobsPqtyContent',
					'field': 'PpsMaterial.BasClobsPqtyContent',
					'name': '*Planning Quantity Rule',
					'name$tr$': 'productionplanning.ppsmaterial.record.basClobsPqtyContent',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				},
				{
					'afterId': 'ppsMaterialBasClobsPqtyContent',
					'id': 'ppsMaterialBasUomPlanFk',
					'field': 'PpsMaterial.BasUomPlanFk',
					'name': '*Planing UoM',
					'name$tr$': 'productionplanning.ppsmaterial.record.basUomPlanFk',
					'sortable': true,
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-lookupdata-uom-lookup',
					},
					'formatter': 'lookup',
					'formatterOptions': {
						'displayMember': 'Unit',
						'lookupType': 'uom'
					}
				},
				{
					'afterId': 'ppsMaterialBasUomPlanFk',
					'id': 'ppsMaterialBasClobsBqtyContent',
					'field': 'PpsMaterial.BasClobsBqtyContent',
					'name': '*Billing Quantity Rule',
					'name$tr$': 'productionplanning.ppsmaterial.record.basClobsBqtyContent',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				},
				{
					'afterId': 'ppsMaterialBasClobsBqtyContent',
					'id': 'ppsMaterialBasUomBillFk',
					'field': 'PpsMaterial.BasUomBillFk',
					'name': '*Billing UoM',
					'name$tr$': 'productionplanning.ppsmaterial.record.basUomBillFk',
					'sortable': true,
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-lookupdata-uom-lookup',
					},
					'formatter': 'lookup',
					'formatterOptions': {
						'displayMember': 'Unit',
						'lookupType': 'uom'
					}
				},
				_.merge(ppsMaterialSitegroupFkConfig.grid, {
					'afterId': 'ppsMaterialBasClobsBqtyContent',
					'id': 'ppsMaterialMatSiteGrpFk',
					'field': 'PpsMaterial.MatSiteGrpFk',
					'name': '*Material Site Group',
					'name$tr$': 'productionplanning.ppsmaterial.record.matSiteGrpFk',
					'sortable': true
				}),
				{
					afterId: 'ppsMaterialMatSiteGrpFk',
					id: 'ppsMaterialIsReadonly',
					field: 'PpsMaterial.IsReadonly',
					name: '*Readonly as Component',
					name$tr$: 'productionplanning.ppsmaterial.record.isReadonly',
					sortable: true,
					editor: 'boolean',
					formatter: 'boolean'
				},
			],
			detail: [
				_.merge(groupfkConfig.detail, {
					'rid': 'ppsMaterialProdMatGroupFk',
					'gid': 'ppsProperties',
					'model': 'PpsMaterial.ProdMatGroupFk',
					'label': $translate.instant('productionplanning.ppsmaterial.mat2ProdMatGroup.entityProdMatGroup'),
					'label$tr$': 'productionplanning.ppsmaterial.mat2ProdMatGroup.entityProdMatGroup',
					'required': true
				}),
				{
					'afterId': 'ppsMaterialProdMatGroupFk',
					'rid': 'ppsMaterialIsBundled',
					'gid': 'ppsProperties',
					'model': 'PpsMaterial.IsBundled',
					'label': $translate.instant('productionplanning.ppsmaterial.record.isbundled'),
					'label$tr$': 'productionplanning.ppsmaterial.record.isbundled',
					'type': 'boolean',
				},
				{
					'afterId': 'ppsMaterialIsBundled',
					'gid': 'ppsProperties',
					'rid': 'ppsMaterialBasClobsPqtyContent',
					'model': 'PpsMaterial.BasClobsPqtyContent',
					'label': $translate.instant('productionplanning.ppsmaterial.record.basClobsPqtyContent'),
					'label$tr$': 'productionplanning.ppsmaterial.record.basClobsPqtyContent',
					'type': 'comment',
				},
				{
					'afterId': 'ppsMaterialBasClobsPqtyContent',
					'gid': 'ppsProperties',
					'rid': 'ppsMaterialBasUomPlanFk',
					'model': 'PpsMaterial.BasUomPlanFk',
					'label': $translate.instant('productionplanning.ppsmaterial.record.basUomPlanFk'),
					'label$tr$': 'productionplanning.ppsmaterial.record.basUomPlanFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-uom-lookup',
				},
				{
					'afterId': 'ppsMaterialBasUomPlanFk',
					'gid': 'ppsProperties',
					'rid': 'ppsMaterialBasClobsBqtyContent',
					'model': 'PpsMaterial.BasClobsBqtyContent',
					'label': $translate.instant('productionplanning.ppsmaterial.record.basClobsBqtyContent'),
					'label$tr$': 'productionplanning.ppsmaterial.record.basClobsBqtyContent',
					'type': 'comment',
				},
				{
					'afterId': 'ppsMaterialBasClobsBqtyContent',
					'gid': 'ppsProperties',
					'rid': 'ppsMaterialBasUomBillFk',
					'model': 'PpsMaterial.BasUomBillFk',
					'label': $translate.instant('productionplanning.ppsmaterial.record.basUomBillFk'),
					'label$tr$': 'productionplanning.ppsmaterial.record.basUomBillFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-uom-lookup',
				},
				_.merge(ppsMaterialSitegroupFkConfig.detail, {
					'rid': 'ppsMaterialMatSiteGrpFk',
					'gid': 'ppsProperties',
					'model': 'PpsMaterial.MatSiteGrpFk',
					'label': $translate.instant('productionplanning.ppsmaterial.record.matSiteGrpFk'),
					'label$tr$': 'productionplanning.ppsmaterial.record.matSiteGrpFk'
				}),
				{
					afterId: 'ppsMaterialMatSiteGrpFk',
					gid: 'ppsProperties',
					rid: 'PpsMaterialIsReadonly',
					model: 'PpsMaterial.IsReadonly',
					label: '*Readonly as Component',
					label$tr$: 'productionplanning.ppsmaterial.record.isReadonly',
					type: 'boolean',
				}]
		};

		var matSiteGroupGrid = _.find(ppsProperties.grid, {id:'ppsMaterialMatSiteGrpFk'});
		matSiteGroupGrid.editorOptions.lookupOptions.showClearButton = true;

		var matSiteGroupDetail = _.find(ppsProperties.detail, {rid:'ppsMaterialMatSiteGrpFk'});
		matSiteGroupDetail.options.showClearButton = true;

		var pUCreationGroup = {
			grid: [
				{
					'id': 'ppsMaterialQuantityFormula',
					'field': 'PpsMaterial.QuantityFormula',
					'name': '*Quantity Formula',
					'name$tr$': 'productionplanning.ppsmaterial.record.quantityFormula',
					'formatter': 'comment',
					'editor': 'comment',
					'sortable': true
				},
				{
					'afterId': 'ppsMaterialQuantityFormula',
					'id': 'ppsMaterialMatGroupOvrFk',
					'field': 'PpsMaterial.MatGroupOvrFk',
					'name': '*Over Material Group',
					'name$tr$': 'productionplanning.ppsmaterial.record.matGroupOvrFk',
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-material-material-group-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					'formatter': 'lookup',
					'formatterOptions': {
						'displayMember': 'Code',
						'lookupType': 'MaterialGroup'
					},
					'sortable': true
				},
				{
					'afterId': 'ppsMaterialMatGroupOvrFk',
					'id': 'ppsMaterialIsOverrideMaterial',
					'field': 'PpsMaterial.IsOverrideMaterial',
					'name': '*Override Material',
					'name$tr$': 'productionplanning.ppsmaterial.record.isOverrideMaterial',
					'sortable': true,
					'editor': 'boolean',
					'formatter': 'boolean'
				},
				{
					'afterId': 'ppsMaterialIsOverrideMaterial',
					'id': 'ppsMaterialMaterialOvrFk',
					'field': 'PpsMaterial.MaterialOvrFk',
					'name': '*New Material',
					'name$tr$': 'productionplanning.ppsmaterial.record.materialOvrFk',
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-material-common-material-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					'formatter': 'lookup',
					'formatterOptions': {
						'displayMember': 'Code',
						'lookupType': 'MaterialRecord'
					},
					'sortable': true
				},
				{
					'afterId': 'ppsMaterialMaterialOvrFk',
					'id': 'ppsMaterialBasUomOvrFk',
					'field': 'PpsMaterial.BasUomOvrFk',
					'name': '*New UoM',
					'name$tr$': 'productionplanning.ppsmaterial.record.basUomOvrFk',
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-lookupdata-uom-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					'formatter': 'lookup',
					'formatterOptions': {
						'displayMember': 'Unit',
						'lookupType': 'uom'
					}
				},
				{
					'afterId': 'ppsMaterialBasUomOvrFk',
					'id': 'isserialproduction',
					'field': 'PpsMaterial.IsSerialProduction',
					'name': '*Serial Production',
					'name$tr$': 'productionplanning.ppsmaterial.record.isserialproduction',
					'sortable': true,
					'editor': 'boolean',
					'formatter': 'boolean'
				},
				{
					afterId: 'isserialproduction',
					id: 'summarizedMode',
					field: 'PpsMaterial.SummarizeMode',
					name: '*Summarize Mode',
					name$tr$: 'productionplanning.ppsmaterial.summarized.summarizedMode',
					formatter: 'select',
					formatterOptions: {
						items: summarizedMode,
						valueMember: 'Id',
						displayMember: 'Description'
					},
					editor: 'select',
					editorOptions: {
						items: summarizedMode,
						displayMember: 'Description',
						valueMember: 'Id'
					}
				},
				{
					afterId: 'summarizedMode',
					id: 'summarizedGroup',
					field: 'PpsMaterial.SummarizeGroup',
					name: '*Summarize Group',
					name$tr$: 'productionplanning.ppsmaterial.summarized.summarizedGroup',
					editor: 'select',
					editorOptions: {
						items: summarizedGroup,
						displayMember: 'Description',
						valueMember: 'Id'
					},
					formatter: 'select',
					formatterOptions: {
						items: summarizedGroup,
						valueMember: 'Id',
						displayMember: 'Description'
					}
				},
				{
					afterId: 'summarizedGroup',
					id: 'ppsMaterialIsForSettlement',
					field: 'PpsMaterial.IsForSettlement',
					name: '*For Settlement',
					name$tr$: 'productionplanning.ppsmaterial.record.IsForSettlement',
					sortable: true,
					editor: 'boolean',
					formatter: 'boolean'
				}
			],
			detail: [
				{
					'gid': 'pUCreationGroup',
					'rid': 'ppsMaterialQuantityFormula',
					'model': 'PpsMaterial.QuantityFormula',
					'label': $translate.instant('productionplanning.ppsmaterial.record.quantityFormula'),
					'label$tr$': 'productionplanning.ppsmaterial.record.quantityFormula',
					'type': 'comment',
				},
				{
					'afterId': 'ppsMaterialQuantityFormula',
					'gid': 'pUCreationGroup',
					'rid': 'ppsMaterialMatGroupOvrFk',
					'model': 'PpsMaterial.MatGroupOvrFk',
					'label': $translate.instant('productionplanning.ppsmaterial.record.matGroupOvrFk'),
					'label$tr$': 'productionplanning.ppsmaterial.record.matGroupOvrFk',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupDirective': 'basics-material-material-group-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					'type': 'directive',
				},
				{
					'afterId': 'ppsMaterialMatGroupOvrFk',
					'gid': 'pUCreationGroup',
					'rid': 'ppsMaterialIsOverrideMaterial',
					'model': 'PpsMaterial.IsOverrideMaterial',
					'label': $translate.instant('productionplanning.ppsmaterial.record.isOverrideMaterial'),
					'label$tr$': 'productionplanning.ppsmaterial.record.IsOverrideMaterial',
					'type': 'boolean',
				},
				{
					'afterId': 'ppsMaterialIsOverrideMaterial',
					'gid': 'pUCreationGroup',
					'rid': 'ppsMaterialMaterialOvrFk',
					'model': 'PpsMaterial.MaterialOvrFk',
					'label': $translate.instant('productionplanning.ppsmaterial.record.materialOvrFk'),
					'label$tr$': 'productionplanning.ppsmaterial.record.materialOvrFk',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupDirective': 'basics-material-common-material-lookup',
						lookupOptions: {
							showClearButton: true
						}
					},
					'type': 'directive',
				},
				{
					'afterId': 'ppsMaterialMaterialOvrFk',
					'gid': 'pUCreationGroup',
					'rid': 'ppsMaterialBasUomOvrFk',
					'model': 'PpsMaterial.BasUomOvrFk',
					'label': $translate.instant('productionplanning.ppsmaterial.record.basUomOvrFk'),
					'label$tr$': 'productionplanning.ppsmaterial.record.basUomOvrFk',
					'type': 'directive',
					'directive': 'basics-lookupdata-uom-lookup',
					'options': {
						showClearButton: true
					},
				},
				{
					'afterId': 'ppsMaterialBasUomOvrFk',
					'gid': 'pUCreationGroup',
					'rid': 'isserialproduction',
					'model': 'PpsMaterial.IsSerialProduction',
					'label': $translate.instant('productionplanning.ppsmaterial.record.isserialproduction'),
					'label$tr$': 'productionplanning.ppsmaterial.record.isserialproduction',
					'type': 'boolean'
				},
				{
					afterId: 'ppsMaterialBasUomOvrFk',
					gid: 'pUCreationGroup',
					rid: 'summarizedMode',
					model: 'PpsMaterial.SummarizeMode',
					label: '*Summarized Mode',
					label$tr$: 'productionplanning.ppsmaterial.summarized.summarizedMode',
					type: 'select',
					options: {
						displayMember: 'Description',
						valueMember: 'Id',
						items: summarizedMode
					},
					visible: true,
					readonly: false,
				},
				{
					afterId: 'summarizedMode',
					gid: 'pUCreationGroup',
					rid: 'summarizedGroup',
					model: 'PpsMaterial.SummarizeGroup',
					label: '*Summarized Group',
					label$tr$: 'productionplanning.ppsmaterial.summarized.summarizedGroup',
					type: 'select',
					options: {
						displayMember: 'Description',
						valueMember: 'Id',
						items: summarizedGroup
					},
					visible: true,
					readonly: false,
					change: (entity) => {}
				},
				{
					afterId: 'summarizedGroup',
					gid: 'pUCreationGroup',
					rid: 'ppsMaterialIsForSettlement',
					model: 'PpsMaterial.IsForSettlement',
					label: '*For Settlement',
					label$tr$: 'productionplanning.ppsmaterial.record.IsForSettlement',
					type: 'boolean',
				}
			]
		};

		var ppsUserdefinedTexts = {
			grid: [
				{
					'id': 'ppsMaterialUserdefinedForProddesc1',
					'field': 'PpsMaterial.UserdefinedForProddesc1',
					'name': '*Text for Template 1',
					'name$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc1',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc1',
					'id': 'ppsMaterialUserdefinedForProddesc2',
					'field': 'PpsMaterial.UserdefinedForProddesc2',
					'name': '*Text for Template 2',
					'name$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc2',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc2',
					'id': 'ppsMaterialUserdefinedForProddesc3',
					'field': 'PpsMaterial.UserdefinedForProddesc3',
					'name': '*Text for Template 3',
					'name$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc3',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc3',
					'id': 'ppsMaterialUserdefinedForProddesc4',
					'field': 'PpsMaterial.UserdefinedForProddesc4',
					'name': '*Text for Template 4',
					'name$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc4',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc4',
					'id': 'ppsMaterialUserdefinedForProddesc5',
					'field': 'PpsMaterial.UserdefinedForProddesc5',
					'name': '*Text for Template 5',
					'name$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc5',
					'sortable': true,
					'editor': 'comment',
					'formatter': 'comment'
				}
			],
			detail: [
				{
					'gid': 'ppsUserdefinedTexts',
					'rid': 'ppsMaterialUserdefinedForProddesc1',
					'model': 'PpsMaterial.UserdefinedForProddesc1',
					'label': $translate.instant('productionplanning.ppsmaterial.record.userdefinedForProddesc1'),
					'label$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc1',
					'type': 'description',
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc1',
					'gid': 'ppsUserdefinedTexts',
					'rid': 'ppsMaterialUserdefinedForProddesc2',
					'model': 'PpsMaterial.UserdefinedForProddesc2',
					'label': $translate.instant('productionplanning.ppsmaterial.record.userdefinedForProddesc2'),
					'label$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc2',
					'type': 'description',
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc2',
					'gid': 'ppsUserdefinedTexts',
					'rid': 'ppsMaterialUserdefinedForProddesc3',
					'model': 'PpsMaterial.UserdefinedForProddesc3',
					'label': $translate.instant('productionplanning.ppsmaterial.record.userdefinedForProddesc3'),
					'label$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc3',
					'type': 'description',
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc3',
					'gid': 'ppsUserdefinedTexts',
					'rid': 'ppsMaterialUserdefinedForProddesc4',
					'model': 'PpsMaterial.UserdefinedForProddesc4',
					'label': $translate.instant('productionplanning.ppsmaterial.record.userdefinedForProddesc4'),
					'label$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc4',
					'type': 'description',
				},
				{
					'afterId': 'ppsMaterialUserdefinedForProddesc4',
					'gid': 'ppsUserdefinedTexts',
					'rid': 'ppsMaterialUserdefinedForProddesc5',
					'model': 'PpsMaterial.UserdefinedForProddesc5',
					'label': $translate.instant('productionplanning.ppsmaterial.record.userdefinedForProddesc5'),
					'label$tr$': 'productionplanning.ppsmaterial.record.userdefinedForProddesc5',
					'type': 'description',
				}
			]
		};

		newLayout.addition.grid = platformObjectHelper.extendGrouping(_.concat([], newLayout.addition.grid, ppsProperties.grid, pUCreationGroup.grid, ppsUserdefinedTexts.grid));
		newLayout.addition.detail = _.concat([], newLayout.addition.detail, ppsProperties.detail, pUCreationGroup.detail, ppsUserdefinedTexts.detail);

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'MaterialNewDto',
			moduleSubModule: 'ProductionPlanning.PpsMaterial'
		});
		var schemaProperties;
		if (dtoSchema) {
			schemaProperties = dtoSchema.properties;
		}

		function PpsMaterialUIStandardService(newLayout, scheme, translateService) {
			BaseService.call(this, newLayout, scheme, translateService);
		}

		PpsMaterialUIStandardService.prototype = Object.create(BaseService.prototype);
		PpsMaterialUIStandardService.prototype.constructor = PpsMaterialUIStandardService;

		var service = new BaseService(newLayout, schemaProperties, translationServ);

		platformUIStandardExtentService.extend(service, newLayout.addition, schemaProperties);

		service.getProjectMainLayout = function () {
			return newLayout;
		};

		return service;
	}
})();
