import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';

export enum OperationType {
	Common = 1,
	StringOperation = 2,
	NumberOperation = 44,
}
export class CosCommonPropertyOperation extends LookupSimpleEntity {
	public constructor(
		public OpType: OperationType = OperationType.Common,
		id: number,
		dec: Translatable = '',
	) {
		super(id, dec);
	}
}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonPropertyFilterOperationLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<CosCommonPropertyOperation, TEntity> {
	public constructor() {
		const translateService = inject(PlatformTranslateService);
		const items: CosCommonPropertyOperation[] = [
			new CosCommonPropertyOperation(OperationType.Common, 1, translateService.instant('constructionsystem.common.operation.isEqual').text),
			new CosCommonPropertyOperation(OperationType.Common, 2, translateService.instant('constructionsystem.common.operation.notEqual').text),
			new CosCommonPropertyOperation(OperationType.Common, 3, translateService.instant('constructionsystem.common.operation.isGreater').text),
			new CosCommonPropertyOperation(OperationType.NumberOperation, 4, translateService.instant('constructionsystem.common.operation.isGreaterEqual').text),
			new CosCommonPropertyOperation(OperationType.NumberOperation, 5, translateService.instant('constructionsystem.common.operation.isLess').text),
			new CosCommonPropertyOperation(OperationType.NumberOperation, 6, translateService.instant('constructionsystem.common.operation.isLessEqual').text),
			new CosCommonPropertyOperation(OperationType.StringOperation, 7, translateService.instant('constructionsystem.common.operation.contains').text),
			new CosCommonPropertyOperation(OperationType.StringOperation, 8, translateService.instant('constructionsystem.common.operation.startWith').text),
			new CosCommonPropertyOperation(OperationType.StringOperation, 9, translateService.instant('constructionsystem.common.operation.endWith').text),
			new CosCommonPropertyOperation(OperationType.StringOperation, 10, translateService.instant('constructionsystem.common.operation.notContains').text),
		];
		super(items, { uuid: '', displayMember: 'description', valueMember: 'id' });
	}
}
