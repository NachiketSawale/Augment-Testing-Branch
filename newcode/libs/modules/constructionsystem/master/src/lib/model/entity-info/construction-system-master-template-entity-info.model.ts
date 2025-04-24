import { EntityInfo } from '@libs/ui/business-base';
import { ConstructionSystemMasterTemplateDataService } from '../../services/construction-system-master-template-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ConstructionSystemMasterTemplateValidationService } from '../../services/validations/construction-system-master-template-validation.service';
import { ICosTemplateEntity } from '@libs/constructionsystem/shared';

export const CONSTRUCTION_SYSTEM_MASTER_TEMPLATE_ENTITY_INFO = EntityInfo.create<ICosTemplateEntity>({
	grid: {
		title: { key: 'constructionsystem.master.templateGridContainerTitle' },
		containerUuid: '1318e19a7da04d8ba01a0fbcde2c77bd',
	},
	form: {
		title: { key: 'constructionsystem.master.templateFormContainerTitle' },
		containerUuid: '79e66f0c359a4d109c20b82ee3cc507a',
	},
	permissionUuid: '1318e19a7da04d8ba01a0fbcde2c77bd',
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosTemplateDto' },
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMasterTemplateDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMasterTemplateValidationService),
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['DescriptionInfo', 'IsDefault', 'Sorting'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				IsDefault: { key: 'entityIsDefault' },
				Sorting: { key: 'entitySorting' },
			}),
		},
	},
});