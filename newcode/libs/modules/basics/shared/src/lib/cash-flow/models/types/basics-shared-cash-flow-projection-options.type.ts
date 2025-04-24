import { BasicsSharedCashFlowProjection } from './basics-shared-cash-flow-projection.type';
import { UiCommonLookupReadonlyDataService } from '@libs/ui/common';

export type BasicsSharedCashFlowProjectionOptions<TItem extends object, TEntity extends object> = {
	defaultValue?: Omit<BasicsSharedCashFlowProjection, 'OnlyLinearAdjustment'>;
	totalsLookupService: UiCommonLookupReadonlyDataService<TItem,TEntity>;
	CashProjectionFk?: number;
	ScurveFk?: number | null;
	TotalCost?: number | null;
	StartWork?: Date | string | null;
	EndWork?: Date | string | null;
	OnlyLinearAdjustment?: boolean;
};
