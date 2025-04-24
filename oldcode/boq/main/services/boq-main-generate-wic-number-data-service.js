/**
 * Created by xia on 4/16/2018.
 */
(function () {
	/* global globals */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainGenerateWicNumberDataService', ['$injector', '$translate', 'platformTranslateService', 'platformModalService', 'boqMainService', 'estimateProjectRateBookConfigDataService',
		function ($injector, $translate, platformTranslateService, platformModalService, boqMainService, estimateProjectRateBookConfigDataService) {

			var service = {};

			var self = service;

			service.dataItem = {
				WicGroupId: null,
				WicBoqItemId: null,
				WicBoqHeaderId: null,
				FromBoqItemId: null,
				ToBoqItemId: null,
				BoqHeaderId: null,
				ComparisonProperty: 1,
				IdenticalOutlineSpecification: false,
				SameUnitOfMeasure: false,
				IgnoreIndex: false,
				CompareNumberUpTo: 9,
				ReplaceOption: true,
				GeneratePreLineItems: false,
				BoqLineTypeFk: null,
				Userdefined1: null,
				Userdefined2: null,
				Userdefined3: null,
				Userdefined4: null,
				Userdefined5: null,

				OutSpecification: null,
				BasUomFk: null,
				Reference2: null,
				PrcStructureFk: null,

				WorkContent: null,
				PrjCharacterFk: null,
				TextConfigurationFk: null,

				TextComplementsFk: null,
				BasBlobsSpecificationFk: null,
				IsOverWrite: true,
				Rule: null,
				Parameter: null,
				DivisionTypeAssignment: null,
				CopyDocument: false,
				CopyPricecondition: false
			};

			function boqItemFilter(entity) {
				// using master data filter for the wic group lookup
				var filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
				var boqMainBoqTypes = $injector.get('boqMainBoqTypes');
				return {
					boqType: boqMainBoqTypes.wic,
					boqGroupId: entity.WicGroupId,
					projectId: 0,
					prcStructureId: 0,
					boqFilterWicGroupIds: filterIds
				};
			}

			service.formConfiguration = {
				fid: 'boq.main.generateWicNumber',
				version: '0.2.4',
				showGrouping: true,
				change: 'change',
				groups: [
					{
						gid: 'source',
						'header$tr$': 'boq.main.source',
						'isOpen': true,
						attributes: ['WicGroupId', 'WicBoqItemId']
					},
					{
						gid: 'target',
						'header$tr$': 'boq.main.target',
						'isOpen': true,
						attributes: ['FromBoqItemId', 'ToBoqItemId']
					},
					{
						gid: 'comparisonOn',
						'header$tr$': 'boq.main.comparisonOn',
						'isOpen': true,
						attributes: ['ComparisonProperty', 'IdenticalOutlineSpecification', 'SameUnitOfMeasure', 'IgnoreIndex', 'CompareNumberUpTo', 'BoqLineTypeFk']
					},
					{
						gid: 'generate',
						'header$tr$': 'boq.main.generate',
						'isOpen': true,
						attributes: ['ReplaceOption', 'GeneratePreLineItems']
					},
					{
						gid: 'basicData',
						'header$tr$': 'boq.main.BasicData',
						'isOpen': true,
						attributes: ['OutSpecification', 'BasUomFk', 'Reference2', 'PrcStructureFk', 'CopyDocument', 'CopyPricecondition']
					},
					{
						gid: 'characteristicNContent',
						'header$tr$': 'boq.main.CharacteristicNContent',
						'isOpen': true,
						attributes: ['WorkContent', 'PrjCharacterFk', 'TextConfigurationFk']
					},
					{
						gid: 'userDefinedTexts',
						'header$tr$': 'boq.main.userDefinedTexts',
						'isOpen': true,
						attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5']
					},
					{
						gid: 'specificationTexts',
						'header$tr$': 'boq.main.SpecificationTexts',
						'isOpen': true,
						attributes: ['TextComplementsFk', 'BasBlobsSpecificationFk']
					},
					{
						gid: 'copyRuleParameter',
						'header$tr$': 'boq.main.CopyRuleParameter',
						'isOpen': true,
						attributes: ['Rule', 'Parameter', 'DivisionTypeAssignment']
					}
				],
				rows: [
					{
						gid: 'source',
						rid: 'WicGroupId',
						label$tr$: 'boq.main.WicGroup',
						type: 'directive',
						model: 'WicGroupId',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'estimate-main-est-wic-group-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged', handler: function selectedWicGroupChanged(/* e, args */) {

									}
								}],
								showClearButton: false,
								filterKey: 'generate-wic-number-wic-group-master-data-filter'
							}
						},
						sortOrder: 1
					},
					{
						gid: 'source',
						rid: 'WicBoqItemId',
						label$tr$: 'boq.main.wicBoq',
						type: 'directive',
						model: 'WicBoqItemId',
						required: true,
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-by-custom-data-service',
							descriptionMember: 'Description',
							lookupOptions: {
								dataServiceName: 'boqHeaderLookupDataService',
								valueMember: 'Id',
								displayMember: 'BoqNumber',
								filter: function (entity) {
									return boqItemFilter(entity);
								},
								disableDataCaching: true,
								filterOnSearchIsFixed: true,
								isClientSearch: true,
								columns: [
									{
										id: 'BoqNumber',
										field: 'BoqNumber',
										name: 'BoqNumber',
										formatter: 'code',
										name$tr$: 'boq.main.boqNumber'
									},
									{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								],
								popupOptions: {
									width: 350
								},
								events: [{
									name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(e, args) {
										if (args.selectedItem) {
											args.entity.WicBoqHeaderId = args.selectedItem.BoqHeaderFk;
										}
									}
								}],
								lookupModuleQualifier: 'boqHeaderLookupDataService',
								lookupType: 'boqHeaderLookupDataService',
								showClearButton: false
							}
						},
						sortOrder: 2
					},
					{
						gid: 'target',
						rid: 'FromBoqItemId',
						label$tr$: 'boq.main.fromRN',
						type: 'directive',
						model: 'FromBoqItemId',
						directive: 'basics-lookup-data-by-custom-data-service',
						'options': {
							'dataServiceName': 'boqMainProjectBoqItemLookupDataService',
							'valueMember': 'Id',
							'displayMember': 'Reference',
							'disableDataCaching': false,
							'filter': function (entity) {
								var filterObj = {
									projectId: boqMainService.getSelectedProjectId(),
									boqHeaderId: entity.BoqHeaderId
								};
								return filterObj;
							},
							'isClientSearch': true,
							'lookupModuleQualifier': 'boqMainProjectBoqItemLookupDataService',
							'columns': [
								{
									'id': 'Brief',
									'field': 'BriefInfo.Description',
									'name': 'Brief',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityBrief'
								},
								{
									'id': 'Reference',
									'field': 'Reference',
									'name': 'Reference',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityReference'
								},
								{
									'id': 'BasUomFk',
									'field': 'BasUomFk',
									'name': 'Uom',
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'uom',
										displayMember: 'Unit'
									},
									'name$tr$': 'cloud.common.entityUoM'
								}
							],
							'treeOptions': {
								'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
							},
							'events': [{
								name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(/* e, args */) {

								}
							}],
							'lookupType': 'boqMainProjectBoqItemLookupDataService',
							'showClearButton': true
						},
						sortOrder: 3
					},
					{
						gid: 'target',
						rid: 'ToBoqItemId',
						label$tr$: 'boq.main.toRN',
						type: 'directive',
						model: 'ToBoqItemId',
						directive: 'basics-lookup-data-by-custom-data-service',
						'options': {
							'dataServiceName': 'boqMainProjectBoqItemLookupDataService',
							'valueMember': 'Id',
							'displayMember': 'Reference',
							'filter': function (entity) {
								var filterObj = {
									projectId: boqMainService.getSelectedProjectId(),
									boqHeaderId: entity.BoqHeaderId
								};
								return filterObj;
							},
							'events': [{
								name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(/* e, args */) {

								}
							}],
							'lookupType': 'boqMainProjectBoqItemLookupDataService',
							'disableDataCaching': false,
							'showClearButton': true,
							'isClientSearch': true,
							'lookupModuleQualifier': 'boqMainProjectBoqItemLookupDataService',
							'columns': [
								{
									'id': 'Brief',
									'field': 'BriefInfo.Description',
									'name': 'Brief',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityBrief'
								},
								{
									'id': 'Reference',
									'field': 'Reference',
									'name': 'Reference',
									'formatter': 'description',
									'name$tr$': 'cloud.common.entityReference'
								},
								{
									'id': 'BasUomFk',
									'field': 'BasUomFk',
									'name': 'Uom',
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'uom',
										displayMember: 'Unit'
									},
									'name$tr$': 'cloud.common.entityUoM'
								}
							],
							'treeOptions': {
								'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
							}
						},
						sortOrder: 4
					},
					{
						gid: 'comparisonOn',
						rid: 'ComparisonProperty',
						label: $translate.instant('boq.main.comparisonType'),
						label$tr$: 'boq.main.comparisonType',
						type: 'directive',
						model: 'ComparisonProperty',
						directive: 'boq-Main-Compare-On-Lookup',
						'options': {
							displayMember: 'description',
							valueMember: 'Id',
							items: [
								{Id: 1, description: $translate.instant('boq.main.Reference')},
								{Id: 2, description: $translate.instant('boq.main.Reference2')},
								{Id: 3, description: $translate.instant('boq.main.Stlno')}
							]
						},
						sortOrder: 5
					},
					{
						gid: 'comparisonOn',
						rid: 'BoqLineTypeFk',
						label$tr$: 'boq.main.boqLineTypeFk',
						type: 'directive',
						model: 'BoqLineTypeFk',
						directive: 'basics-lookup-data-by-custom-data-service',
						'options': {
							dataServiceName: 'boqMainStructureDetailLookupDataService',
							valueMember: 'BoqLineTypeFk',
							displayMember: 'DescriptionInfo.Description',
							filter: function (entity) {
								return entity.BoqHeaderId;
							},
							events: [{
								name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(/* e, args */) {

								}
							}],
							lookupModuleQualifier: 'boqMainStructureDetailLookupDataService',
							lookupType: 'boqMainStructureDetailLookupDataService',
							showClearButton: true,
							disableDataCaching: true,
							filterOnSearchIsFixed: true,
							isClientSearch: true,
							columns: [
								{
									id: 'BoqLineTypeFk',
									name: 'BoqLineTypeFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BoqLineType',
										displayMember: 'Description'
									},
									field: 'BoqLineTypeFk',
									name$tr$: 'boq.main.BoqLineTypeFk',
									width: 100
								},
								{
									id: 'Description',
									field: 'DescriptionInfo.Description',
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}
							],
							popupOptions: {
								width: 350
							}
						},
						sortOrder: 6
					},
					{
						gid: 'comparisonOn',
						rid: 'IgnoreIndex',
						label$tr$: 'boq.main.ignoreIndex',
						type: 'boolean',
						model: 'IgnoreIndex',
						sortOrder: 7
					},
					{
						gid: 'comparisonOn',
						rid: 'CompareNumberUpTo',
						label$tr$: 'boq.main.compareNumberUpTo',
						type: 'integer',
						model: 'CompareNumberUpTo',
						sortOrder: 8
					},
					{
						gid: 'comparisonOn',
						rid: 'IdenticalOutlineSpecification',
						label$tr$: 'boq.main.identicalOutlineSpecification',
						type: 'boolean',
						model: 'IdenticalOutlineSpecification',
						sortOrder: 9
					},
					{
						gid: 'comparisonOn',
						rid: 'SameUnitOfMeasure',
						label$tr$: 'boq.main.sameUnitOfMeasure',
						type: 'boolean',
						model: 'SameUnitOfMeasure',
						sortOrder: 10
					},
					{
						gid: 'generate',
						rid: 'ReplaceOption',
						label$tr$: 'boq.main.replace',
						type: 'boolean',
						model: 'ReplaceOption',
						sortOrder: 11
					},
					{
						gid: 'generate',
						rid: 'GeneratePreLineItems',
						label$tr$: 'boq.main.GeneratePredefineLineItems',
						type: 'boolean',
						model: 'GeneratePreLineItems',
						sortOrder: 11
					},
					{
						gid: 'basicData',
						rid: 'OutSpecification',
						label$tr$: 'boq.main.OutSpecification',
						type: 'boolean',
						model: 'OutSpecification',
						sortOrder: 12
					},
					{
						gid: 'basicData',
						rid: 'BasUomFk',
						label$tr$: 'boq.main.BasUomFk',
						type: 'boolean',
						model: 'BasUomFk',
						sortOrder: 13
					},
					{
						gid: 'basicData',
						rid: 'Reference2',
						label$tr$: 'boq.main.Reference2',
						type: 'boolean',
						model: 'Reference2',
						sortOrder: 14
					},
					{
						gid: 'basicData',
						rid: 'PrcStructureFk',
						label$tr$: 'boq.main.PrcStructureFk',
						type: 'boolean',
						model: 'PrcStructureFk',
						sortOrder: 15
					},
					{
						gid: 'characteristicNContent',
						rid: 'WorkContent',
						label$tr$: 'boq.main.WorkContent',
						type: 'boolean',
						model: 'WorkContent',
						sortOrder: 16
					},
					{
						gid: 'characteristicNContent',
						rid: 'PrjCharacterFk',
						label$tr$: 'boq.main.PrjCharacter',
						type: 'boolean',
						model: 'PrjCharacterFk',
						sortOrder: 17
					},
					{
						gid: 'characteristicNContent',
						rid: 'TextConfigurationFk',
						label$tr$: 'boq.main.TextConfiguration',
						type: 'boolean',
						model: 'TextConfigurationFk',
						sortOrder: 18
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined1',
						label$tr$: 'boq.main.Userdefined1',
						type: 'boolean',
						model: 'Userdefined1',
						sortOrder: 19
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined2',
						label$tr$: 'boq.main.Userdefined2',
						type: 'boolean',
						model: 'Userdefined2',
						sortOrder: 20
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined3',
						label$tr$: 'boq.main.Userdefined3',
						type: 'boolean',
						model: 'Userdefined3',
						sortOrder: 21
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined4',
						label$tr$: 'boq.main.Userdefined4',
						type: 'boolean',
						model: 'Userdefined4',
						sortOrder: 22
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined5',
						label$tr$: 'boq.main.Userdefined5',
						type: 'boolean',
						model: 'Userdefined5',
						sortOrder: 23
					},
					{
						gid: 'specificationTexts',
						rid: 'BasBlobsSpecificationFk',
						label$tr$: 'boq.main.BasBlobsSpecificationFk',
						type: 'boolean',
						model: 'BasBlobsSpecificationFk',
						sortOrder: 26
					},
					{
						gid: 'specificationTexts',
						rid: 'TextComplementsFk',
						label$tr$: 'boq.main.TextComplements',
						type: 'boolean',
						model: 'TextComplementsFk',
						sortOrder: 27
					},
					{
						gid: 'copyRuleParameter',
						rid: 'Rule',
						label$tr$: 'boq.main.Rule',
						type: 'boolean',
						model: 'Rule',
						sortOrder: 20
					},
					{
						gid: 'copyRuleParameter',
						rid: 'Parameter',
						label$tr$: 'boq.main.Parameter',
						type: 'boolean',
						model: 'Parameter',
						sortOrder: 20
					},
					{
						gid: 'copyRuleParameter',
						rid: 'DivisionTypeAssignment',
						label$tr$: 'boq.main.DivisionTypeAssignment',
						type: 'boolean',
						model: 'DivisionTypeAssignment',
						sortOrder: 20
					},
					{
						gid: 'basicData',
						rid: 'CopyPricecondition',
						label$tr$: 'boq.main.CopyPricecondition',
						type: 'boolean',
						model: 'CopyPricecondition',
						sortOrder: 31
					},
					{
						gid: 'basicData',
						rid: 'CopyDocument',
						label$tr$: 'boq.main.CopyDocument',
						type: 'boolean',
						model: 'CopyDocument',
						sortOrder: 32
					}]
			};

			self.showCreateDialog = function showCreateDialog() {

				platformModalService.showDialog({
					// scope: (dialogConfig.scope) ? dialogConfig.scope.$new(true) : null,
					templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-generate-wic-number-template.html',
					backdrop: false,
					width: 600,
					height: 800,
					resizeable: true

				}).then(function (result) {
					if (result.ok) {
						boqMainService.generateWicNumber(result.data);
					}
				}
				);
			};

			service.showDialog = function showDialog(/* value */) {
				platformTranslateService.translateFormConfig(self.formConfiguration);
				self.showCreateDialog();
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('boq.main.generateWicNumber');
			};

			Object.defineProperties(service, {
				'dialogTitle': {
					get: function () {
						return '';
					}, enumerable: true
				}
			}
			);

			service.getDataItem = function getDataItem() {
				return service.dataItem;
			};

			service.getFormConfiguration = function getFormConfiguration() {
				return service.formConfiguration;
			};

			return service;
		}]);

})(angular);
