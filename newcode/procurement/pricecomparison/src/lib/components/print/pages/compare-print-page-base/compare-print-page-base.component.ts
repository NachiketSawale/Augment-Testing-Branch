/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';
import { ICompositeBaseEntity } from '../../../../model/entities/composite-base-entity.interface';
import { IComparePrintBase } from '../../../../model/entities/print/compare-print-base.interface';
import { COMPARE_PRINT_DATA_TOKEN } from '../../compare-print-dialog-body/compare-print-dialog-body.component';

@Component({
	template: ''
})
export class ProcurementPricecomparisonComparePrintPageBaseComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> {
	protected readonly injector = inject(Injector);
	protected readonly settings = inject<PT>(COMPARE_PRINT_DATA_TOKEN);
	protected readonly translateSvc = inject(PlatformTranslateService);
	public readonly fieldType = FieldType;
}
