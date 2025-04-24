/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Input,
	inject,
	Output,
	Component,
	EventEmitter
} from '@angular/core';
import * as math from 'mathjs';
import { isNil } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { IEntityContext } from '@libs/platform/common';
import { BasicsSharedCalculateOverGrossService } from '@libs/basics/shared';
import { ProcurementCommonCalculationService } from '../../services/helper/procurement-common-calculation.service';
import { PrcCommonPaymentScheduleTotalSourceLookupService } from '../../lookups/payment-schedule-total-source-lookup.service';
import { IPrcCommonPaymentScheduleTotalSourceEntity } from '../../model/entities/prc-payment-schedule-total-source-entity.interface';
import { IPrcCommonPaymentScheduleTotalSourceContextEntity } from '../../model/entities/prc-payment-schedule-total-source-entity.interface';

/**
 * Procurement common payment schedule total source composite component
 */
@Component({
	selector: 'procurement-common-payment-schedule-total-source',
	templateUrl: './payment-schedule-total-source.component.html',
	styleUrl: './payment-schedule-total-source.component.scss'
})
export class ProcurementCommonPaymentScheduleTotalSourceComponent {
	private readonly calculationService = inject(ProcurementCommonCalculationService);
	public readonly totalSourceLookupService = inject(PrcCommonPaymentScheduleTotalSourceLookupService);
	public readonly isOverGross = inject(BasicsSharedCalculateOverGrossService).isOverGross;
	public context: IEntityContext<IPrcCommonPaymentScheduleTotalSourceContextEntity> = { totalCount: 0 };
	public sourceId: number | null = null;
	public sourceNetOc: number = 0;
	public sourceGrossOc: number = 0;

	/**
	 * Is readonly
	 */
	@Input()
	public readonly: boolean = true;

	/**
	 * Total source lookup context entity
	 */
	@Input()
	public set contextEntity(newContext: IPrcCommonPaymentScheduleTotalSourceContextEntity) {
		this.onContextEntityChange(newContext);
	}

	/**
	 * Source change emitter
	 */
	@Output()
	public sourceChanged = new EventEmitter<IPrcCommonPaymentScheduleTotalSourceContextEntity>();

	private get contextVatPercent(): number {
		return this.context.entity?.VatPercent ?? 0;
	}

	private get contextSourceNetOc(): number {
		return this.context.entity?.SourceNetOc ?? 0;
	}

	private get contextSourceGrossOc(): number {
		return this.context.entity?.SourceGrossOc ?? 0;
	}

	private async onContextEntityChange(newContextEntity: IPrcCommonPaymentScheduleTotalSourceContextEntity) {
		this.totalSourceLookupService.clearCache();
		if (newContextEntity.ParentId) {
			this.sourceId = this.totalSourceLookupService.totalSourceIdOfMainNChangeOrder;
			this.updateContext({
				ParentConfigurationFk: newContextEntity.ParentConfigurationFk,
				ParentId: newContextEntity.ParentId,
				VatPercent: newContextEntity.VatPercent,
				SourceNetOc: this.sourceNetOc,
				SourceGrossOc: this.sourceGrossOc,
				Url: newContextEntity.Url
			});
			await this.updateSourceValueBySourceId(this.sourceId);
			await this.loadTotalSourceList();
		}
	}

	private updateContext(contextEntity: IPrcCommonPaymentScheduleTotalSourceContextEntity) {
		this.context = {
			entity: contextEntity,
			totalCount: 0
		};
	}

	private async updateSourceValueBySourceId(id: number) {
		const source = await firstValueFrom(this.totalSourceLookupService.getItemByKey({id: id}));
		this.updateSourceValueBySource(source);
	}

	private async loadTotalSourceList() {
		await firstValueFrom(this.totalSourceLookupService.getList(this.context));
	}

	/**
	 *  On total source lookup value changed
	 * @param sourceId
	 */
	public validateSourceId(sourceId: number) {
		const source = this.totalSourceLookupService.getListSync().find(s => s.Id === sourceId);
		if (source) {
			this.updateSourceValueBySource(source);
			this.onTotalSourceValueChange();
		}
	}

	/**
	 * On Total source netOc changed
	 */
	public validateTotalSourceNetOc = this.validateTotalSourceValue('TotalNetOc');

	/**
	 * On Total source grossOc changed
	 */
	public validateTotalSourceGrossOc = this.validateTotalSourceValue('TotalGrossOc');

	private validateTotalSourceValue(field: 'TotalNetOc' | 'TotalGrossOc') {
		return () => {
			const isNetValue = field === 'TotalNetOc';
			const value = (isNetValue ? this.sourceNetOc : this.sourceGrossOc) ?? 0;
			const oldValue = (isNetValue ? this.contextSourceNetOc : this.contextSourceGrossOc) ?? 0;
			if (value === oldValue) {
				return;
			}

			const sources = this.totalSourceLookupService.getListSync();
			const source = isNetValue ?
				sources.find(s => s.ValueNetOc === value) :
				sources.find(s => s.GrossOc === value);
			if (source) {
				this.sourceId = source.Id;
				this.updateSourceValueBySource(source);
			} else {
				this.sourceId = null;
				this.sourceNetOc = isNetValue ? math.bignumber(value).toNumber() : this.calculationService.getPreTaxValueByAfterTaxValue(value, this.contextVatPercent);
				this.sourceGrossOc = !isNetValue ? math.bignumber(value).toNumber() : this.calculationService.getAfterTaxValueByPreTaxValue(value, this.contextVatPercent);
			}
			this.onTotalSourceValueChange();
		};
	}

	private updateSourceValueBySource(source: IPrcCommonPaymentScheduleTotalSourceEntity) {
		this.sourceNetOc = source.ValueNetOc;
		this.sourceGrossOc = !isNil(source.GrossOc) ? source.GrossOc : math.round(math.bignumber(source.ValueNetOc).add(source.ValueTaxOc), 2).toNumber();
	}

	private onTotalSourceValueChange() {
		if (this.context.entity) {
			this.context.entity.SourceNetOc = this.sourceNetOc;
			this.context.entity.SourceGrossOc = this.sourceGrossOc;
		}
		this.sourceChanged.emit(this.context.entity);
	}
}