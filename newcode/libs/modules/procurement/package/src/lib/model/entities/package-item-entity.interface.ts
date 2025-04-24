import { IPrcItemEntity } from '@libs/procurement/common';

export interface IPackageItemEntity extends IPrcItemEntity {
	// ItemScopeReplacementDialogComponent need these fields
	IsChecked: boolean;
	BudgetPercent: number;
	Weight: number;
}
