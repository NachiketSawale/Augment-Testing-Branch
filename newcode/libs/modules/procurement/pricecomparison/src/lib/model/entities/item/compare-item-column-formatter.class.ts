/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import { CompareGridColumn, FormattedValue, GridFormatter } from '../compare-grid-column.interface';
import { CompareColumnFormatterBase } from '../../classes/compare-column-formatter-base.class';
import { ICompositeItemEntity } from './composite-item-entity.interface';

export class CompareItemColumnFormatter extends CompareColumnFormatterBase<ICompositeItemEntity> {

	public override getCompareField(row: ICompositeItemEntity){
		return this.utilSvc.getPrcCompareField(row);
	}

	public quantity(): GridFormatter<ICompositeItemEntity> {
		return (row: number, cell: number, value: unknown, column: CompareGridColumn<ICompositeItemEntity>, dataContext: ICompositeItemEntity): FormattedValue => {
			if (this.utilSvc.isPrcItemRow(dataContext.LineTypeFk)) {
				value = this.utilSvc.formatValue(FieldType.Quantity, row, cell, value, column, dataContext);
			} else {
				value = '';
			}

			if ((this.utilSvc.isPrcItemRow(dataContext.LineTypeFk) && dataContext['IsQuoteNewItem'])) {
				value = '';
			}
			return value;
		};
	}

	public price(): GridFormatter<ICompositeItemEntity> {
		return super.statisticsFormatter();
	}
}