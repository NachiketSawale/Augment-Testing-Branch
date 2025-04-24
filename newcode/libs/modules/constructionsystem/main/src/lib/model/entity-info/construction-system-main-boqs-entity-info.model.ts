import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsSharedFilterStructureEntityInfoFactory } from '@libs/constructionsystem/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export class CosMainBoqsLayoutService {
	public static generateConfig(): ILayoutConfiguration<IBoqItemEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						text: 'Boqs',
						key: 'estimate.main.boqContainer',
					},
					attributes: ['Reference', 'BriefInfo', 'Quantity', 'BasUomFk'], // todo : 'Param'
				},
			],
			labels: {
				...prefixAllTranslationKeys('estimate.main.', {
					Quantity: { key: 'Quantity' },
					Structure: { key: 'Structure' },

					Description: { key: 'DescriptionInfo' },
					Rule: { key: 'Rule' },
					Parameter: { key: 'Parameter' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Reference: { key: 'entityReference' },
					BriefInfo: { key: 'entityBriefInfo' },
					Quantity: { key: 'entityQuantity' },
					BasUomFk: { key: 'entityUoM' },
				}),
			},
			overloads: {
				BasUomFk: {
					...BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
					...{
						additionalFields: [
							{
								displayMember: 'DescriptionInfo.Translated',
								singleRow: true,
								label: { key: 'constructionsystem.master.entityUomText'},
								column: true
							}
						]
					}
				},
			},
			transientFields: [
				{
					id: 'Parameters',
					model: 'Parameters',
					type: FieldType.Composite,
					label: { key: 'constructioinsystem.main.createCosInstanceDefaultInputDialog.parameters'}
				},
				{
					id: 'filter',
					model: 'Filter',
					type: FieldType.Radio,
				}
			]
		};
	}
}

export const COS_MAIN_BOQS_ENTITY_INFO = new BasicsSharedFilterStructureEntityInfoFactory<IBoqItemEntity>().create({
	permissionUuid: 'fee8266cdd9a41d2b700f21bff24b065', //todo no permission uuid in old version
	gridContainerUuid: 'fee8266cdd9a41d2b700f21bff24b065',
	gridTitle: 'estimate.main.boqContainer',
	filterStructureDataServiceCreateContext: {
		qualifier: 'construction.system.main.boqs',
		dataServiceOption: {
			apiUrl: 'boq/project',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getboqsearchlist',
				usePost: false,
			},
			entityActions: { createSupported: false, deleteSupported: false},
			roleInfo: <IDataServiceRoleOptions<IBoqItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstBoq',
			},
		},
	},
	dtoSchemaId: {
		moduleSubModule: 'Boq.Main',
		typeName: 'BoqItemDto',
	},
	customizeLayoutConfiguration: () => {
		return CosMainBoqsLayoutService.generateConfig();
	},
});