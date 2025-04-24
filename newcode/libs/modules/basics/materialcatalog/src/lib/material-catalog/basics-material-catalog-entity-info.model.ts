/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IMaterialCatalogEntity, BasicsSharedPlainTextContainerComponent, PLAIN_TEXT_ACCESSOR, IPlainTextAccessor } from '@libs/basics/shared';
import { BasicsMaterialCatalogBehavior } from './basics-material-catalog-behavior.service';
import { BasicsMaterialCatalogDataService } from './basics-material-catalog-data.service';
import { BasicsMaterialCatalogLayoutService } from './basics-material-catalog-layout.service';
import { BasicsMaterialCatalogValidationService } from './basics-material-catalog-validation.service';

export const BASICS_MATERIAL_CATALOG_ENTITY_INFO = EntityInfo.create<IMaterialCatalogEntity>({
	grid: {
		title: { text: 'Material Catalogs', key: 'basics.materialcatalog.HeadTitle.grid' },
		behavior: (ctx) => ctx.injector.get(BasicsMaterialCatalogBehavior),
	},
	form: {
		containerUuid: 'e2f671c7f8a44e37809dc4d76b1b1617',
		title: { text: 'Material Catalog Detail', key: 'basics.materialcatalog.HeadTitle.form' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialCatalogDataService),
	validationService: (context) => context.injector.get(BasicsMaterialCatalogValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialCatalogDto' },
	permissionUuid: 'df77f013b424438aa053518cbacafb01',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialCatalogLayoutService).generateLayout();
	},
	additionalEntityContainers: [
		{
			uuid: '2cb780b98fc546d788271f25e003bf1a',
			permission: '2cb780b98fc546d788271f25e003bf1a',
			title: 'basics.materialcatalog.termsAndConditions',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IMaterialCatalogEntity>>{
						getText(entity: IMaterialCatalogEntity): string | undefined | null {
							return entity.TermsConditions;
						},
						setText(entity: IMaterialCatalogEntity, value?: string) {
							entity.TermsConditions = value;
						},
					},
				},
			],
		},
	],
});
