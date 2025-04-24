// boq-main-update-data-from-wic-data-service.js
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqMainUpdateDataFromWicDataService', ['$injector', '$q', '$http', '$translate', 'platformTranslateService', 'platformModalService', 'boqMainService',
		function ($injector, $q, $http, $translate, platformTranslateService, platformModalService, boqMainService) {
			var service = {};

			var self = service;

			service.dataItem = {
				/* WicGroupId: null,
				 WicBoqItemId: null,
				 WicBoqHeaderId: null, */
				FromBoqItemId: null,
				ToBoqItemId: null,
				BoqHeaderId: null,
				Userdefined1: null,
				Userdefined2: null,
				Userdefined3: null,
				Userdefined4: null,
				Userdefined5: null,

				GeneratePreLineItems: null,
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

			service.formConfiguration = {
				fid: 'boq.main.generateWicNumber',
				version: '0.2.4',
				showGrouping: true,
				change: 'change',
				groups: [
					{
						gid: 'target',
						'header$tr$': 'boq.main.target',
						'isOpen': true,
						attributes: ['FromBoqItemId', 'ToBoqItemId']
					},
					{
						gid: 'basicData',
						'header$tr$': 'boq.main.CopyBasicData',
						'isOpen': true,
						attributes: ['OutSpecification', 'BasUomFk', 'Reference2', 'PrcStructureFk', 'GeneratePreLineItems', 'CopyDocument', 'CopyPricecondition']
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
								name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged() {

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
								name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged() {
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
						gid: 'basicData',
						rid: 'OutSpecification',
						label$tr$: 'boq.main.OutSpecification',
						type: 'boolean',
						model: 'OutSpecification',
						sortOrder: 5
					},
					{
						gid: 'basicData',
						rid: 'BasUomFk',
						label$tr$: 'boq.main.BasUomFk',
						type: 'boolean',
						model: 'BasUomFk',
						sortOrder: 6
					},
					{
						gid: 'basicData',
						rid: 'Reference2',
						label$tr$: 'boq.main.Reference2',
						type: 'boolean',
						model: 'Reference2',
						sortOrder: 7
					},
					{
						gid: 'basicData',
						rid: 'PrcStructureFk',
						label$tr$: 'boq.main.PrcStructureFk',
						type: 'boolean',
						model: 'PrcStructureFk',
						sortOrder: 8
					},
					{
						gid: 'basicData',
						rid: 'GeneratePreLineItems',
						label$tr$: 'boq.main.GeneratePredefineLineItems',
						type: 'boolean',
						model: 'GeneratePreLineItems',
						sortOrder: 9
					},
					{
						gid: 'characteristicNContent',
						rid: 'WorkContent',
						label$tr$: 'boq.main.WorkContent',
						type: 'boolean',
						model: 'WorkContent',
						sortOrder: 10
					},
					{
						gid: 'characteristicNContent',
						rid: 'PrjCharacterFk',
						label$tr$: 'boq.main.PrjCharacter',
						type: 'boolean',
						model: 'PrjCharacterFk',
						sortOrder: 11
					},
					{
						gid: 'characteristicNContent',
						rid: 'TextConfigurationFk',
						label$tr$: 'boq.main.TextConfiguration',
						type: 'boolean',
						model: 'TextConfigurationFk',
						sortOrder: 12
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined1',
						label$tr$: 'boq.main.Userdefined1',
						type: 'boolean',
						model: 'Userdefined1',
						sortOrder: 13
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined2',
						label$tr$: 'boq.main.Userdefined2',
						type: 'boolean',
						model: 'Userdefined2',
						sortOrder: 14
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined3',
						label$tr$: 'boq.main.Userdefined3',
						type: 'boolean',
						model: 'Userdefined3',
						sortOrder: 15
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined4',
						label$tr$: 'boq.main.Userdefined4',
						type: 'boolean',
						model: 'Userdefined4',
						sortOrder: 16
					},
					{
						gid: 'userDefinedTexts',
						rid: 'Userdefined5',
						label$tr$: 'boq.main.Userdefined5',
						type: 'boolean',
						model: 'Userdefined5',
						sortOrder: 17
					},
					{
						gid: 'specificationTexts',
						rid: 'BasBlobsSpecificationFk',
						label$tr$: 'boq.main.BasBlobsSpecificationFk',
						type: 'boolean',
						model: 'BasBlobsSpecificationFk',
						sortOrder: 20
					},
					{
						gid: 'specificationTexts',
						rid: 'TextComplementsFk',
						label$tr$: 'boq.main.TextComplements',
						type: 'boolean',
						model: 'TextComplementsFk',
						sortOrder: 21
					},
					{
						gid: 'copyRuleParameter',
						rid: 'Rule',
						label$tr$: 'boq.main.Rule',
						type: 'boolean',
						model: 'Rule',
						sortOrder: 22
					},
					{
						gid: 'copyRuleParameter',
						rid: 'Parameter',
						label$tr$: 'boq.main.Parameter',
						type: 'boolean',
						model: 'Parameter',
						sortOrder: 23
					},
					{
						gid: 'copyRuleParameter',
						rid: 'DivisionTypeAssignment',
						label$tr$: 'boq.main.DivisionTypeAssignment',
						type: 'boolean',
						model: 'DivisionTypeAssignment',
						sortOrder: 24
					},
					{
						gid: 'basicData',
						rid: 'CopyPricecondition',
						label$tr$: 'boq.main.CopyPricecondition',
						type: 'boolean',
						model: 'CopyPricecondition',
						sortOrder: 25
					},
					{
						gid: 'basicData',
						rid: 'CopyDocument',
						label$tr$: 'boq.main.CopyDocument',
						type: 'boolean',
						model: 'CopyDocument',
						sortOrder: 26
					}]
			};

			self.showCreateDialog = function showCreateDialog() {

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-update-data-from-wic-template.html',
					backdrop: false,
					width: 600,
					height: 800,
					resizeable: true

				}).then(function (result) {
					if (result.ok) {
						boqMainService.updateDataFromWic(result.data);
					}
				}
				);
			};

			service.showDialog = function showDialog() {
				platformTranslateService.translateFormConfig(self.formConfiguration);
				self.showCreateDialog();
			};

			service.getDialogTitle = function getDialogTitle() {
				return $translate.instant('boq.main.updateDatafromWIC');
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

			service.ValidatiePrjBoqItemAssigedWic = function ValidatiePrjBoqItemAssigedWic(data) {
				return $http.post(globals.webApiBaseUrl + 'boq/main/ValidatiePrjBoqItemAssigedWic', data);
			};

			return service;
		}
	]);
})(angular);
