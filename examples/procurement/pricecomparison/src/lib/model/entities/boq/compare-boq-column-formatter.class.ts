/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import { CompareGridColumn, FormattedValue, GridFormatter } from '../compare-grid-column.interface';
import { ICompositeBoqEntity } from './composite-boq-entity.interface';
import { CompareColumnFormatterBase } from '../../classes/compare-column-formatter-base.class';
import { CompareFields } from '../../constants/compare-fields';
import { CompareRowTypes } from '../../constants/compare-row-types';
import { Constants } from '../../constants/constants';

export class CompareBoqColumnFormatter extends CompareColumnFormatterBase {
	private statisticsIgnoreFields = [
		CompareFields.rank,
		CompareFields.commentContractor,
		CompareFields.commentClient,
		CompareFields.prcItemEvaluationFk,
		CompareFields.bidderComments,
		CompareFields.quoteUserDefined1,
		CompareFields.quoteUserDefined2,
		CompareFields.quoteUserDefined3,
		CompareFields.quoteUserDefined4,
		CompareFields.quoteUserDefined5,
		CompareFields.userDefined1,
		CompareFields.userDefined2,
		CompareFields.userDefined3,
		CompareFields.userDefined4,
		CompareFields.userDefined5,
		CompareFields.alternativeBid,
		CompareFields.uomFk,
		CompareFields.included,
		CompareFields.notSubmitted,
		CompareFields.externalCode,
		CompareFields.isLumpsum,
		CompareFields.exQtnIsEvaluated,
		CompareFields.prjChangeFk,
		CompareFields.prjChangeStatusFk,
		CompareFields.prcPriceConditionFk
	];

	private boqRowBooleanFormatter(): GridFormatter<ICompositeBoqEntity> {
		return (row: number, cell: number, formattedValue: unknown, column: CompareGridColumn<ICompositeBoqEntity>, dataContext: ICompositeBoqEntity): FormattedValue => {
			if (!this.utilSvc.isBoqRow(dataContext.LineTypeFk)) {
				return '';
			}
			return formattedValue;
		};
	}

	private statisticsFormatter(): GridFormatter<ICompositeBoqEntity> {
		return (row: number, cell: number, formattedValue: unknown, column: CompareGridColumn<ICompositeBoqEntity>, dataContext: ICompositeBoqEntity): FormattedValue => {
			const compareField = this.utilSvc.getBoqCompareField(dataContext);
			if (dataContext.LineTypeFk === CompareRowTypes.compareField && compareField === CompareFields.percentage) {
				if ((column.field === Constants.maxValueIncludeTarget || column.field === Constants.minValueIncludeTarget || column.field === Constants.averageValueIncludeTarget)) {
					return '';
				}
				return this.utilSvc.formatValue(FieldType.Percent, row, cell, dataContext[column.field as string], column, dataContext) + ' %';
			}
			let value: unknown;
			if (dataContext.LineTypeFk === CompareRowTypes.compareField && this.statisticsIgnoreFields.includes(compareField)) {
				value = '';
			} else {
				value = this.utilSvc.formatValue(FieldType.Money, row, cell, dataContext[column.field as string], column, dataContext);
			}
			return value;
		};
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
		return this.boqRowBooleanFormatter();
	}

	public isNotApplicable(): GridFormatter<ICompositeBoqEntity> {
		return this.boqRowBooleanFormatter();
	}

	public isFreeQuantity(): GridFormatter<ICompositeBoqEntity> {
		return this.boqRowBooleanFormatter();
	}

	public isLeadDescription(): GridFormatter<ICompositeBoqEntity> {
		return this.boqRowBooleanFormatter();
	}

	public isNoLeadQuantity(): GridFormatter<ICompositeBoqEntity> {
		return this.boqRowBooleanFormatter();
	}

	public isContracted(): GridFormatter<ICompositeBoqEntity> {
		return this.boqRowBooleanFormatter();
	}

	public uom(): GridFormatter<ICompositeBoqEntity> {
		return super.createUomFormatter<ICompositeBoqEntity>();
	}

	public minValueIncludeTarget(): GridFormatter<ICompositeBoqEntity> {
		return this.statisticsFormatter();
	}

	public maxValueIncludeTarget(): GridFormatter<ICompositeBoqEntity> {
		return this.statisticsFormatter();
	}

	public averageValueIncludeTarget(): GridFormatter<ICompositeBoqEntity> {
		return this.statisticsFormatter();
	}

	public minValueExcludeTarget(): GridFormatter<ICompositeBoqEntity> {
		return this.statisticsFormatter();
	}

	public maxValueExcludeTarget(): GridFormatter<ICompositeBoqEntity> {
		return this.statisticsFormatter();
	}

	public averageValueExcludeTarget(): GridFormatter<ICompositeBoqEntity> {
		return this.statisticsFormatter();
	}
}