/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { BasicsMaterialRecordDataService } from '../../material/basics-material-record-data.service';
import { IMaterialEntity } from '@libs/basics/interfaces';
import {firstValueFrom} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export abstract class RecalculateMaterialPriceFromVariantWizardService {

	private readonly dataService = inject(BasicsMaterialRecordDataService);
	private readonly http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);

	public async onStartWizard() {
		const materials = this.dataService.getSelection();
		await this.dataService.update(materials[0]);
		const response = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/material/recalculateByVariant?Id=${materials[0].Id}`));
		const entity = response as IMaterialEntity;
		if (entity) {
			const entities = this.dataService.getSelection();
			const currentMaterial = entities[0];
			currentMaterial.ListPrice = entity.ListPrice;
			this.dataService.recalculateCost(currentMaterial, entity.ListPrice, 'ListPrice');
		}
	}
}