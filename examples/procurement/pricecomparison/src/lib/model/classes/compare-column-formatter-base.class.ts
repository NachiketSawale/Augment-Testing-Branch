/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { ProcurementPricecomparisonUtilService } from '../../services/util.service';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { CompareGridColumn, FormattedValue, GridFormatter } from '../entities/compare-grid-column.interface';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';

export class CompareColumnFormatterBase {
	protected readonly utilSvc = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly uomSvc = ServiceLocator.injector.get(BasicsSharedUomLookupService);

	protected createUomFormatter<T extends ICompositeBaseEntity<T>>(): GridFormatter<T> {
		return (row: number, cell: number, formattedValue: unknown, column: CompareGridColumn<T>, dataContext: T): FormattedValue => {
			const originalValue = dataContext[column.field as string];

			if (this.utilSvc.isNullOrUndefined(originalValue)) {
				return '';
			}

			if (!this.utilSvc.isBoqPositionRow(dataContext.LineTypeFk)) {
				return '';
			}

			const result = this.uomSvc.syncService?.getListSync().find(e => e.Id === originalValue);
			return result && result.UnitInfo ? result.UnitInfo.Translated : '';
		};
	}
}