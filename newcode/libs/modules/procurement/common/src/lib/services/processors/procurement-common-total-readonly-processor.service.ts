/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonTotalDataService } from '../procurement-common-total-data.service';
import { ProcurementTotalKind } from '../../model/enums';
import { inject } from '@angular/core';
import { PrcSharedTotalTypeLookupService } from '@libs/procurement/shared';
import { AsyncReadonlyFunctions, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { isNil } from 'lodash';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Procurement total entity processor
 */
export class ProcurementCommonTotalReadonlyProcessorService<T extends IPrcCommonTotalEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityAsyncReadonlyProcessorBase<T> {
	private readonly prcTotalTypeLookupService = inject(PrcSharedTotalTypeLookupService);

	/**
	 * Construct with data service
	 * @param dataService
	 * @param isPackage
	 */
	public constructor(
		protected dataService: ProcurementCommonTotalDataService<T, PT, PU>,
		protected isPackage?: boolean,
	) {
		super(dataService);
	}

	public override process(toProcess: T) {

		this.processItemTotalKindFk(toProcess);
		super.process(toProcess);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {};
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<T> {
		return {
			ValueNet: {
				shared: ['ValueNetOc'],
				readonly: (e) => this.readonlyByIsEditableNet(e),
			},
			ValueTax: {
				shared: ['ValueTaxOc'],
				readonly: (e) => this.readonlyByIsEditableTax(e),
			},
			Gross: {
				shared: ['GrossOc'],
				readonly: (e) => this.readonlyByIsEditableGross(e),
			},
		};
	}

	protected override async readonlyEntityAsync(item: T) {
		return (
			(item.TotalKindFk === ProcurementTotalKind.FromPackage && !this.isPackage) ||
			item.TotalKindFk  === ProcurementTotalKind.NetTotal ||
			item.TotalKindFk  === ProcurementTotalKind.CostPlanningNet ||
			item.TotalKindFk  === ProcurementTotalKind.BudgetNet ||
			item.TotalKindFk  === ProcurementTotalKind.Formula
		);
	}

	private processItemTotalKindFk(item: T) {
		const totalType = this.prcTotalTypeLookupService.cache.getItem({ id: item.TotalTypeFk });
		if (isNil(item.TotalKindFk) && !isNil(totalType?.PrcTotalKindFk)) {
			item.TotalKindFk = totalType?.PrcTotalKindFk;
		}
	}

	private async getTotalType(item: T) {
		return await firstValueFrom(this.prcTotalTypeLookupService.getItemByKey({ id: item.TotalTypeFk }));
	}

	private async readonlyByIsEditableNet(info: ReadonlyInfo<T>) {
		const totalType = await this.getTotalType(info.item);
		return !totalType?.IsEditableNet;
	}

	private async readonlyByIsEditableTax(info: ReadonlyInfo<T>) {
		const totalType = await this.getTotalType(info.item);
		return !totalType?.IsEditableTax;
	}

	private async readonlyByIsEditableGross(info: ReadonlyInfo<T>) {
		const totalType = await this.getTotalType(info.item);
		return !totalType?.IsEditableGross;
	}
}
