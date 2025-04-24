/**
 * Created by jie on 2024.09.05
 */
(function (angular) {
	'use strict';

	const moduleName = 'documents.centralquery';
	angular.module(moduleName).factory('documentsCentralQueryContextConfigFieldsValue', documentsCentralQueryContextConfigFieldsValue);
	documentsCentralQueryContextConfigFieldsValue.$inject = ['_', '$translate'];

	function documentsCentralQueryContextConfigFieldsValue(_, $translate) {
		const defaultValues = [

			{
				model: 'BilHeaderFk',
				fieldName: $translate.instant('documents.project.entityBilHeaderFk'),
				isSelect: false
			},
			{
				model: 'Barcode',
				fieldName: $translate.instant('documents.project.entityBarcode'),
				isSelect: false
			},
			{
				model: 'BpdBusinessPartnerFk',
				fieldName: $translate.instant('documents.project.entityBpdBusinessPartner'),
				isSelect: false
			},
			{
				model: 'BpdSubsidiaryFk',
				fieldName: $translate.instant('documents.centralquery.entitySubsidiary'),
				isSelect: false
			},
			{
				model: 'BidHeaderFk',
				fieldName: $translate.instant('documents.project.entityBidHeaderFk'),
				isSelect: false
			},
			{
				model: 'BpdCertificateFk',
				fieldName: $translate.instant('documents.project.entityBpdCertificate'),
				isSelect: false
			},
			{
				model: 'MdcControllingUnitFk',
				fieldName: $translate.instant('documents.project.entityMDCControllingUnit'),
				isSelect: false
			},
			{
				model: 'BpdContactFk',
				fieldName: $translate.instant('procurement.contract.ConHeaderContact'),
				isSelect: false
			},
			{
				model: 'ConHeaderFk',
				fieldName: $translate.instant('documents.project.entityContractCode'),
				isSelect: false
			},
			{
				model: 'Description',
				fieldName: $translate.instant('cloud.common.entityDescription'),
				isSelect: false
			},
			{
				model: 'CommentText',
				fieldName: $translate.instant('documents.project.entityCommentText'),
				isSelect: false
			},
			{
				model: 'PrjDocumentCategoryFk',
				fieldName: $translate.instant('documents.project.entityPrjDocumentCategory'),
				isSelect: false
			},
			{
				model: 'LgmDispatchHeaderFk',
				fieldName: $translate.instant('documents.project.entityLgmDispatchHeader'),
				isSelect: false
			},
			{
				model: 'EstHeaderFk',
				fieldName: $translate.instant('documents.project.entityEstHeader'),
				isSelect: false
			},
			{
				model: 'ExpirationDate',
				fieldName: $translate.instant('documents.project.entityExpirationDate'),
				isSelect: false
			},
			{
				model: 'InvHeaderFk',
				fieldName: $translate.instant('documents.project.entityInvHeader'),
				isSelect: false
			},
			{
				model: 'LgmJobFk',
				fieldName: $translate.instant('documents.project.entityLgmJob'),
				isSelect: false
			},
			{
				model: 'PrjLocationFk',
				fieldName: $translate.instant('documents.project.entityLocation'),
				isSelect: false
			},
			{
				model: 'ModelFk',
				fieldName: $translate.instant('documents.project.entityModel'),
				isSelect: false
			},
			{
				model: 'MdcMaterialCatalogFk',
				fieldName: $translate.instant('documents.project.entityMaterialCatalog'),
				isSelect: false
			},
			{
				model: 'PrjChangeFk',
				fieldName: $translate.instant('documents.project.entityPrjChange'),
				isSelect: false
			},
			{
				model: 'PrjDocumentTypeFk',
				fieldName: $translate.instant('documents.project.entityPrjDocumentType'),
				isSelect: false
			},
			{
				model: 'PrcPackageFk',
				fieldName: $translate.instant('documents.project.entityPackage'),
				isSelect: false
			},
			{
				model: 'PesHeaderFk',
				fieldName: $translate.instant('documents.centralquery.entityPES'),
				isSelect: false
			},
			{
				model: 'PrjProjectFk',
				fieldName: $translate.instant('documents.centralquery.entityProject'),
				isSelect: false
			},
			{
				model: 'QtnHeaderFk',
				fieldName: $translate.instant('documents.project.entityQtnHeader'),
				isSelect: false
			},
			{
				model: 'QtoHeaderFk',
				fieldName: $translate.instant('documents.project.entityQtoHeader'),
				isSelect: false
			},
			{
				model: 'RfqHeaderFk',
				fieldName: $translate.instant('documents.centralquery.entityRfqHeader'),
				isSelect: false
			},
			{
				model: 'ReqHeaderFk',
				fieldName: $translate.instant('documents.centralquery.entityReqHeader'),
				isSelect: false
			},
			{
				model: 'RubricCategoryFk',
				fieldName: $translate.instant('documents.project.entityRubricCategory'),
				isSelect: false
			},
			{
				model: 'ProjectInfoRequestFk',
				fieldName: $translate.instant('documents.project.entityInfoRequest'),
				isSelect: false
			},
			{
				model: 'OrdHeaderFk',
				fieldName: $translate.instant('documents.project.entityOrdHeaderFk'),
				isSelect: false
			},
			{
				model: 'PrcStructureFk',
				fieldName: $translate.instant('documents.centralquery.entityStructure'),
				isSelect: false
			},
			{
				model: 'LgmSettlementFk',
				fieldName: $translate.instant('documents.project.entityLgmSettlement'),
				isSelect: false
			},
			{
				model: 'PsdScheduleFk',
				fieldName: $translate.instant('documents.project.entityPsdSchedule'),
				isSelect: false
			},
			{
				model: 'PsdActivityFk',
				fieldName: $translate.instant('documents.project.entityPsdActivity'),
				isSelect: false
			},
			{
				model: 'UserDefined1',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '1'}),
				isSelect: false
			},
			{
				model: 'UserDefined2',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '2'}),
				isSelect: false
			},
			{
				model: 'UserDefined3',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '3'}),
				isSelect: false
			},
			{
				model: 'UserDefined4',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '4'}),
				isSelect: false
			},
			{
				model: 'UserDefined5',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '5'}),
				isSelect: false
			},
			{
				model: 'Url',
				fieldName: $translate.instant('documents.project.entityUrl'),
				isSelect: false
			},
			{
				model: 'WipHeaderFk',
				fieldName: $translate.instant('documents.project.entityWipHeaderFk'),
				isSelect: false
			}
		];

		return {
			'getWithDynamicFields': getWithDynamicFields
		};

		function getWithDynamicFields() {
			return _.map(defaultValues, function (value, key) {
				value.sId = key + 1;
				return value;
			});
		}
	}
})(angular);