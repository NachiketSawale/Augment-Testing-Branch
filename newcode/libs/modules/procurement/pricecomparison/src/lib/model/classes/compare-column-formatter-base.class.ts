/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { ProcurementPricecomparisonUtilService } from '../../services/util.service';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { CompareGridColumn, FormattedValue, GridFormatter } from '../entities/compare-grid-column.interface';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';
import { CompareFields } from '../constants/compare-fields';
import { CompareRowTypes } from '../constants/compare-row-types';
import { Constants } from '../constants/constants';
import { FieldType } from '@libs/ui/common';

export abstract class CompareColumnFormatterBase<T extends ICompositeBaseEntity<T>> {
	protected readonly utilSvc = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly uomSvc = ServiceLocator.injector.get(BasicsSharedUomLookupService);

	protected statisticsIgnoreFields = [
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

	public statisticsFormatter(): GridFormatter<T> {
		return (row: number, cell: number, formattedValue: unknown, column: CompareGridColumn<T>, dataContext: T): FormattedValue => {
			const compareField = this.getCompareField(dataContext);
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

	protected abstract getCompareField(row: T): string;

	protected createUomFormatter(): GridFormatter<T> {
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

	public booleanFormatter(): GridFormatter<T> {
		return (row: number, cell: number, formattedValue: unknown, column: CompareGridColumn<T>, dataContext: T): FormattedValue => {
			if (!(this.utilSvc.isBoqRow(dataContext.LineTypeFk) || this.utilSvc.isPrcItemRow(dataContext.LineTypeFk))) {
				return '';
			}
			return formattedValue;
		};
	}

	public uom(): GridFormatter<T> {
		return this.createUomFormatter();
	}

	public isContracted(): GridFormatter<T> {
		return this.booleanFormatter();
	}

	public minValueIncludeTarget(): GridFormatter<T> {
		return this.statisticsFormatter();
	}

	public maxValueIncludeTarget(): GridFormatter<T> {
		return this.statisticsFormatter();
	}

	public averageValueIncludeTarget(): GridFormatter<T> {
		return this.statisticsFormatter();
	}

	public minValueExcludeTarget(): GridFormatter<T> {
		return this.statisticsFormatter();
	}

	public maxValueExcludeTarget(): GridFormatter<T> {
		return this.statisticsFormatter();
	}

	public averageValueExcludeTarget(): GridFormatter<T> {
		return this.statisticsFormatter();
	}
}