/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import { CompareGridColumn, FormattedValue, GridFormatter } from '../compare-grid-column.interface';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';
import { CompareColumnFormatterBase } from '../../classes/compare-column-formatter-base.class';

export class CompareBoqColumnFormatter extends CompareColumnFormatterBase<ICompositeBoqEntity> {
	public override getCompareField(row: ICompositeBoqEntity){
		return this.utilSvc.getBoqCompareField(row);
	}

	public quantity(): GridFormatter<ICompositeBoqEntity> {
		return (row: number, cell: number, value: unknown, column: CompareGridColumn<ICompositeBoqEntity>, dataContext: ICompositeBoqEntity): FormattedValue => {
			if (this.utilSvc.isBoqPositionRow(dataContext.LineTypeFk)/* && !dataContext.IsFreeQuantity */) { // only show value of column 'Quantity' when property 'IsFreeQuantity' is false.
				value = this.utilSvc.formatValue(FieldType.Quantity, row, cell, value, column, dataContext);
			} else {
				value = '';
			}

			if ((this.utilSvc.isBoqPositionRow(dataContext.LineTypeFk) || this.utilSvc.isBoqLevelRow(dataContext.LineTypeFk)) && dataContext['IsQuoteNewItem']) {
				value = ''; // for quote new items (Level + Position)
			}
			return value;
		};
	}

	public isDisable(): GridFormatter<ICompositeBoqEntity> {
		return this.booleanFormatter();
	}

	public isNotApplicable(): GridFormatter<ICompositeBoqEntity> {
		return this.booleanFormatter();
	}

	public isFreeQuantity(): GridFormatter<ICompositeBoqEntity> {
		return super.booleanFormatter();
	}

	public isLeadDescription(): GridFormatter<ICompositeBoqEntity> {
		return super.booleanFormatter();
	}

	public isNoLeadQuantity(): GridFormatter<ICompositeBoqEntity> {
		return super.booleanFormatter();
	}
}