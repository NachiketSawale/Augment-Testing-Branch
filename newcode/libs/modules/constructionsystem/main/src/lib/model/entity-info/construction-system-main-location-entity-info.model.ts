import { IProjectLocationEntity } from '@libs/project/interfaces';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { BasicsSharedFilterStructureEntityInfoFactory } from '@libs/constructionsystem/common';

export class CosMainProjectLocationLayoutService {
	public static generateConfig(): ILayoutConfiguration<IProjectLocationEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						text: 'Locations',
						key: 'estimate.main.locationContainer',
					},
					attributes: ['Code', 'DescriptionInfo', 'Quantity'], // TODO : Parameter
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
					Code: { key: 'entityCode' },
				}),
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

export const CONSTRUCTION_SYSTEM_MAIN_LOCATION_ENTITY_INFO = new BasicsSharedFilterStructureEntityInfoFactory<IProjectLocationEntity>().create({
	permissionUuid: '1DD77E2E10B54F2392870A53FCB44982',
	gridContainerUuid: '913B56330DAD4388BBAB12C54A5095BE',
	gridTitle: 'estimate.main.locationContainer',
	filterStructureDataServiceCreateContext: {
		qualifier: 'construction.system.main.location',
		dataServiceOption: {
			apiUrl: 'project/location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},
			entityActions: { createSupported: false, deleteSupported: false},
			roleInfo: <IDataServiceRoleOptions<IProjectLocationEntity>>{
				role: ServiceRole.Root,
				itemName: 'EstPrjLocation',
			},
		}
	},
	dtoSchemaId: {
		moduleSubModule: 'Project.Location',
		typeName: 'LocationDto',
	},
	customizeLayoutConfiguration: () => {
		return CosMainProjectLocationLayoutService.generateConfig();
	}
});