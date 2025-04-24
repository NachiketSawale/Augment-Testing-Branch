/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceFlatLeaf, ServiceRole, IDataServiceChildRoleOptions, IEntitySelection } from '@libs/platform/data-access';
import { ICashProjectionDetailEntity } from '../models/entities/cash-projection-detail-entity.interface';
import { CashFlowProjectionComplete } from '../models/entities/cash-flow-projection-complete.class';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { BasicsSharedCashFlowReadonlyProcessor } from '../processors/basics-shared-cash-flow-readonly-processor.class';

export class BasicsSharedCashFlowDataService<T extends ICashProjectionDetailEntity, PT extends object> extends DataServiceFlatLeaf<T, PT, CashFlowProjectionComplete<T>> {
	public constructor(
		public parentService: IEntitySelection<PT>,
		protected getCashProjectionId: (obj?: PT) => number | null,
		private isParentFnOverride: (parent: PT, entity: T) => boolean,
	) {
		super({
			apiUrl: 'basics/common/cashdetail',
			readInfo: {
				endPoint: 'list',
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, CashFlowProjectionComplete<T>>>{
				role: ServiceRole.Leaf,
				itemName: 'CashFlow',
				parent: parentService,
			},
		});
		this.processor.addProcessor(new BasicsSharedCashFlowReadonlyProcessor(this));
	}

	private _prevPeriod: ICompanyPeriodEntity | null = null;

	public override provideLoadPayload() {
		return {
			cashProjectionId: this.getCashProjectionId(this.getSelectedParent()),
		};
	}

	public override canDelete() {
		const selected = this.getSelectedEntity();
		if (!selected) {
			return false;
		}
		const result = selected.ActPeriodCost > 0 || selected.ActPeriodCash > 0;
		return !result;
	}

	protected override onLoadSucceeded(loaded: CashFlowProjectionComplete<T>): T[] {
		this._prevPeriod = loaded.prevPeriod ?? null;
		return loaded.dtos ?? [];
	}

	public get prevPeriod() {
		return this._prevPeriod;
	}

	public override isParentFn(parent: PT, entity: T) {
		return this.isParentFnOverride(parent, entity);
	}
}
