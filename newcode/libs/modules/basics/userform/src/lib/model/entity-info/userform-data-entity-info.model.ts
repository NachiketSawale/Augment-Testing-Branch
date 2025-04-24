import { BasicUserformDataHeaderGridBehavior } from '../../behaviors/userform-data-list-behavior.service';
import { BasicsUserformDataDataService } from '../../services/userform-data-data.service';
import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IFormDataEntity } from '../entities/form-data-entity.interface';

const moduleName: string = 'basics.userform';

export const USER_FROM_DATA_ENTITY_INFO: EntityInfo = EntityInfo.create<IFormDataEntity>({
	grid: {
		title: { text: 'Form data', key: moduleName + '.defaultContainerTitle' },
		behavior: (ctx) => ctx.injector.get(BasicUserformDataHeaderGridBehavior),
	},
	dataService: (ctx) => ctx.injector.get(BasicsUserformDataDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.UserForm', typeName: 'FormDataDto' },
	permissionUuid: '891fc10a6ef011e4b116123b93f75cba',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Id', 'FormFk', 'RubricFk', 'IsReadonly', 'FormDataStatusFk']
			}
		],
		overloads: {
			Id: { readonly: true }
		},
		labels: {
			...prefixAllTranslationKeys('basics.userform' + '.', {
				Id: { key: 'entityId' },
				FormFk: { key: 'entityFormFk' },
				RubricFk: { key: 'entityRubricFk' },
				IsReadonly: { key: 'entityIsReadonly' },
				FormDataStatusFk: { key: 'entityFormDataStatusFk' }
			})
		}
	} as ILayoutConfiguration<IFormDataEntity>,
});