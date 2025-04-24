/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlatformSchemaService } from '@libs/platform/data-access';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { IMaterialSearchEntity } from '../model/interfaces/material-search-entity.interface';
import {
	StandardDialogButtonId,
	UiCommonFormDialogService
} from '@libs/ui/common';
import { BasicsSharedMaterialCreateSimilarMaterialLayoutService } from './material-create-similar-material-layout.service';
import {
	IMaterialEntity,
	IMaterialPriceConditionEntity
} from '@libs/basics/interfaces';
import { EntityDynamicCreateDialogService } from '@libs/ui/business-base';
import { BasicsMaterialCreateMaterialValidationService } from './material-create-similar-material-validation.service';

/**
 * Material similar service.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialCreateSimilarMaterialService {
	private http = inject(HttpClient);
	private materialComplete?: MaterialSimilarHttpResponse;
	private similarLayoutService = inject(BasicsSharedMaterialCreateSimilarMaterialLayoutService);
	private configurationService = inject(PlatformConfigurationService);
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly schemaService = inject(PlatformSchemaService<IMaterialEntity>);
	private readonly createDialogService = inject(EntityDynamicCreateDialogService<IMaterialEntity>);
	private materialPriceConditions: IMaterialPriceConditionEntity[] = [];

	/**
	 * Get material price conditions
	 */
	public getMaterialPriceConditions(): IMaterialPriceConditionEntity[] {
		return this.materialPriceConditions;
	}

	/**
	 * Set material price conditions
	 * @param priceConditions
	 */
	public setMaterialPriceConditions(priceConditions: IMaterialPriceConditionEntity[]) {
		this.materialPriceConditions = priceConditions;
	}

	/**
	 * Create similar http request
	 * @param materialId
	 * @private
	 */
	private createSimilar(materialId: number): Observable<IMaterialEntity> {
		return this.http.get(this.configurationService.webApiBaseUrl + 'basics/material/createMaterial?id=' + materialId).pipe(map((res) => {
			this.materialComplete = res as MaterialSimilarHttpResponse;
			const dataItem = this.materialComplete.Material;
			this.setMaterialPriceConditions(this.materialComplete.MaterialPriceConditionToSave);
			//TODO it throw error when date value is null
			dataItem.UserDefinedDate1 = !dataItem.UserDefinedDate1 ? undefined : dataItem.UserDefinedDate1;
			dataItem.UserDefinedDate2 = !dataItem.UserDefinedDate2 ? undefined : dataItem.UserDefinedDate2;
			dataItem.UserDefinedDate3 = !dataItem.UserDefinedDate3 ? undefined : dataItem.UserDefinedDate3;
			dataItem.UserDefinedDate4 = !dataItem.UserDefinedDate4 ? undefined : dataItem.UserDefinedDate4;
			dataItem.UserDefinedDate5 = !dataItem.UserDefinedDate5 ? undefined : dataItem.UserDefinedDate5;
			return dataItem;
		}));
	}

	/**
	 * Open similar form dialog
	 * @param similarEntity
	 * @private
	 */
	private async openSimilarFormDialog(similarEntity: IMaterialEntity): Promise<IMaterialEntity | null> {
		const formConfig = await this.getFormConfig();
		const dialogResult = await this.formDialogService.showDialog<IMaterialEntity>({
			headerText: 'basics.material.record.createSimilarNewMaterialItem',
			width: '700px',
			height: '600px',
			showOkButton: true,
			formConfiguration: formConfig,
			entity: similarEntity
		});

		return (dialogResult?.closingButtonId === StandardDialogButtonId.Ok && dialogResult?.value) ?
			dialogResult.value :
			null;
	}

	private async getFormConfig() {
		const layout = await this.similarLayoutService.generateLayout();
		const validationService = ServiceLocator.injector.get(BasicsMaterialCreateMaterialValidationService);
		const schema = await this.schemaService.getSchema({moduleSubModule: 'Basics.Material', typeName: 'MaterialDto'});

		const formConfig = await this.createDialogService.generateFormConfig(
			{
				ClassConfigurations: [{
					EntityName: 'IMaterialEntity',
					ColumnsForCreateDialog: this.similarLayoutService.attributes.map(propertyName => {
						return {
							PropertyName: propertyName,
							ShowInWizard: 'true',
						};
					}),
					IsMandatoryActive: true,
					IsReadonlyActive: false,
				}]
			},
			schema,
			validationService,
			layout,
		);
		formConfig.showGrouping = false;

		return formConfig;
	}

	/**
	 * Save new similar
	 * @param similarComplete
	 * @private
	 */
	private saveSimilar(similarComplete: MaterialSimilarHttpResponse): Observable<IMaterialSearchEntity> {
		return this.http.post(this.configurationService.webApiBaseUrl + 'basics/material/saveSimilarMaterial', similarComplete).pipe(map((res) => {
			return res as IMaterialSearchEntity;
		}));
	}

	/**
	 * Create and save similar function
	 * @param entity
	 */
	public async create(entity: IMaterialSearchEntity): Promise<IMaterialSearchEntity | null> {
		const similarEntity = await firstValueFrom(this.createSimilar(entity.Id));
		const result = await this.openSimilarFormDialog(similarEntity);

		if (result && this.materialComplete) {
			this.materialComplete.Material = result;
			return await firstValueFrom(this.saveSimilar(this.materialComplete));
		}

		return null;
	}
}

/**
 * Material similar http response
 */
interface MaterialSimilarHttpResponse {
	Material: IMaterialEntity,
	MaterialPriceConditionToSave: IMaterialPriceConditionEntity[]
}