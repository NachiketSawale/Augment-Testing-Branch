/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { inject } from '@angular/core';
import { BasicsSharedGeneralTypeLookupService } from '@libs/basics/shared';
import { ProcurementCommonGeneralsDataService } from '../services/procurement-common-generals-data.service';
import { IPrcGeneralsEntity } from '../model/entities/prc-generals-entity.interface';
import { firstValueFrom } from 'rxjs';
import { ProcurementValueType as ValueType } from '../model/enums/procurement-value-type.enum';
import { isNil } from 'lodash';

/**
 * Procurement common Generals validation service
 */
export abstract class ProcurementCommonGeneralsValidationService<T extends IPrcGeneralsEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementBaseValidationService<T> {

	private readonly generalTypeLookupService = inject(BasicsSharedGeneralTypeLookupService);

	protected constructor(protected dataService: ProcurementCommonGeneralsDataService<T, PT, PU>) {
		super();

		this.dataService.entityCreated$.subscribe(e => this.onCreateEntity(e));
	}

	private onCreateEntity(entity: T) {
		this.executeFieldValidation({ entity, field: 'PrcGeneralstypeFk', value: entity.PrcGeneralstypeFk });
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			PrcGeneralstypeFk: this.validatePrcGeneralsTypeFk,
			ControllingUnitFk: this.validateControllingUnitFk,
			//todo -- validateEntity
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	protected async validateControllingUnitFk(info: ValidationInfo<T>) {
		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcGeneralsTypeFk(info: ValidationInfo<T>) {
		const result = this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'cloud.common.entityType');
		if (!result.valid) {
			return result;
		}

		const headerContext = this.dataService.getHeaderContext();
		const generalsType = await firstValueFrom(this.generalTypeLookupService.getItemByKey({ id: info.value as number }));
		if (generalsType) {
			info.entity.IsCost = generalsType.IsCost;
			info.entity.ValueType = generalsType.IsPercent ? ValueType.Percent : ValueType.Amount;
			if (!generalsType.IsCost) {
				info.entity.ControllingUnitFk = null;
				info.entity.TaxCodeFk = null;
			}
		}
		if (headerContext && headerContext.projectFk) {
			const response = await this.http.get<number>('procurement/common/prcgenerals/prjgeneralvalue', {
				params: {
					GeneralsTypeFk: info.value as number,
					ProjectFk: headerContext.projectFk,
				},
			});

			//In AngularJs code will check response > 0, it is incorrect. The value can be negative.
			if (!isNil(response) && response !== 0) {
				info.entity.Value = response;
				this.dataService.setModified(info.entity);
			}
		}

		this.dataService.updateReadOnlyFields(info.entity);
		return result;
	}
}
