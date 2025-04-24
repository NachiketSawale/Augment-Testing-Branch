/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { InitializationContext, ServiceLocator } from '@libs/platform/common';
import { EntityDynamicCreateDialogService } from '@libs/ui/business-base';
import { PlatformSchemaService } from '@libs/platform/data-access';
import { createLookup, FieldType, FormRow, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IPrrHeaderEntity } from '../model/entities/prr-header-entity.interface';
import { ControllingRevenueRecognitionLayoutService } from './revenue-recognition-layout.service';
import { ControllingRevenueRecognitionValidationService } from './revenue-recognition-validation.service';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { ICreatePrrHeaderParam } from '../model/entities/create-prr-header-param.interface';
import { ICreatePrrHeaderParamGenerated } from '../model/entities/create-prr-header-param-generated.interface';

/**
 * Service for showing the create dialog for the prr header entity
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionCreateDialogService {
	private readonly schemaService = inject(PlatformSchemaService<IPrrHeaderEntity>);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly createDialogService = inject(EntityDynamicCreateDialogService<IPrrHeaderEntity>);

	public async showCreateDialog(entity: Partial<IPrrHeaderEntity>): Promise<ICreatePrrHeaderParam | undefined> {
		const layoutService = ServiceLocator.injector.get(ControllingRevenueRecognitionLayoutService);
		const validationService = ServiceLocator.injector.get(ControllingRevenueRecognitionValidationService);
		const schema = await this.schemaService.getSchema({moduleSubModule: 'Controlling.RevRecognition', typeName: 'PrrHeaderDto'});
		const context = new InitializationContext(ServiceLocator.injector);
		const layout = await layoutService.generateLayout(context);
		const formConfig = await this.createDialogService.generateFormConfig(
			{
				ClassConfigurations: [
					{
						EntityName: 'IPrrHeaderEntity',
						ColumnsForCreateDialog: [
							{
								PropertyName: 'CompanyYearFk',
								ShowInWizard: 'true',
							},
							{
								PropertyName: 'CompanyPeriodFk',
								ShowInWizard: 'true',
							}
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
		const rows = formConfig.rows;
		const withStart: FormRow<IPrrHeaderEntity>[] = [{
			id: 'Company',
			label: {key: 'cloud.common.entityCompany', text: 'Company'},
			model: 'CompanyFk',
			readonly: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsCompanyLookupService,
				displayMember: 'Code',
			}),
			visible: true,
		}];
		const withEnd: FormRow<IPrrHeaderEntity>[] = [{
			id: 'PrjProjectFk',
			label: {key: 'controlling.revrecognition.entityProjectFk', text: 'Project'},
			model: 'PrjProjectFk',
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProjectSharedLookupService,
				showDescription: true,
				descriptionMember: 'ProjectNo',
				showClearButton: true,
			}),
			visible: true,
		}];
		formConfig.rows = [...withStart, ...rows, ...withEnd];

		const dialogResult = await this.formDialogService.showDialog({
			formConfiguration: formConfig,
			headerText: {
				key: 'controlling.revrecognition.createDialogTitle',
				text: 'Create Revenue recognition'
			},
			entity: entity as IPrrHeaderEntity,
		});

		if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
			const prrHeader: IPrrHeaderEntity = dialogResult.value!;
			const createParam: ICreatePrrHeaderParamGenerated = {
				companyYearFk: prrHeader.CompanyYearFk,
				companyPeriodFk: prrHeader.CompanyPeriodFk,
				projectIds: prrHeader.PrjProjectFk ? [prrHeader.PrjProjectFk] : [],
				createFromWiard: false,
				createByAddtion: false
			};
			return {
				...createParam,
				...prrHeader
			};
		}
		return;
	}
}