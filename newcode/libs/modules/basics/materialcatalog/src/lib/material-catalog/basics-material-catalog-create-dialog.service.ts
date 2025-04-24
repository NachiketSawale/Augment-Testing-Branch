/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsMaterialCatalogLayoutService } from './basics-material-catalog-layout.service';
import { BasicsMaterialCatalogValidationService } from './basics-material-catalog-validation.service';
import { IMaterialCatalogEntity } from '@libs/basics/shared';
import { EntityDynamicCreateDialogService } from '@libs/ui/business-base';
import { PlatformSchemaService } from '@libs/platform/data-access';
import { StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';

/**
 * Service for showing the create dialog for the material catalog entity
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogCreateDialogService {
	private readonly schemaService = inject(PlatformSchemaService<IMaterialCatalogEntity>);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly createDialogService = inject(EntityDynamicCreateDialogService<IMaterialCatalogEntity>);

	public async showCreateDialog(entity: Partial<IMaterialCatalogEntity>): Promise<IMaterialCatalogEntity | undefined> {
		const layoutService = ServiceLocator.injector.get(BasicsMaterialCatalogLayoutService);
		const validationService = ServiceLocator.injector.get(BasicsMaterialCatalogValidationService);
		const schema = await this.schemaService.getSchema({ moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialCatalogDto' });
		const layout = await layoutService.generateLayout();

		const formConfig = await this.createDialogService.generateFormConfig(
			{
				ClassConfigurations: [
					{
						EntityName: 'IMaterialCatalogEntity',
						ColumnsForCreateDialog: [
							{
								PropertyName: 'Code',
								ShowInWizard: 'true',
							},
							{
								PropertyName: 'MaterialCatalogTypeFk',
								ShowInWizard: 'true',
							},
							{
								PropertyName: 'BusinessPartnerFk',
								ShowInWizard: 'true',
							},
							{
								PropertyName: 'SubsidiaryFk',
								ShowInWizard: 'true',
							},
							{
								PropertyName: 'SupplierFk',
								ShowInWizard: 'true',
							},
						],
						IsMandatoryActive: true,
						IsReadonlyActive: false,
					},
				],
			},
			schema,
			validationService,
			layout,
		);

		formConfig.showGrouping = false;

		const dialogResult = await this.formDialogService.showDialog({
			formConfiguration: formConfig,
			headerText: {
				key: 'basics.materialcatalog.createDialogTitle',
			},
			entity: entity as IMaterialCatalogEntity,
		});

		if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
			return dialogResult.value;
		}

		return;
	}
}
