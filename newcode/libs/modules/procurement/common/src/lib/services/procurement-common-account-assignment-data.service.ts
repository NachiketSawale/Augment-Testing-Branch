/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IReadonlyParentService } from '@libs/procurement/shared';
import { IPrcModuleValidatorService } from '../model/interfaces';
import { ProcurementCommonDataServiceFlatLeaf } from './procurement-common-data-service-flat-leaf.service';
import { IPrcCommonAccountAssignmentEntity } from '../model/entities/procurement-common-account-assignment-entity.interface';
import { sortBy, sumBy } from 'lodash';
import { ProcurementCommonAccountAssignmentReadonlyProcessor } from './processors/procurement-common-account-assignment-readonly-processor.service';
import { round } from 'mathjs';
import { IPrcCommonAccountAssignmentTotal } from '../model/interfaces/prc-common-account-assignment-total.interface';


/**
 * The basic data service for procurement account assignment for contract and invoice modules
 */
export abstract class ProcurementCommonAccountAssignmentDataService<T extends IPrcCommonAccountAssignmentEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementCommonDataServiceFlatLeaf<T, PT, PU> {
	public readOnlyProcessor?: ProcurementCommonAccountAssignmentReadonlyProcessor<T, PT, PU>;
	protected accountAssignmentTotal?: IPrcCommonAccountAssignmentTotal<T>;

	protected constructor(
		public override parentService: IPrcModuleValidatorService<PT, PU> & IReadonlyParentService<PT, PU>,
		protected config: { apiUrl: string; itemName: string; getMainEntityFk: (entity: T) => number; }) {
		const dataConfig: { apiUrl: string; itemName: string; endPoint?: string } = {
			apiUrl: config.apiUrl,
			itemName: config.itemName,
		};
		super(parentService, dataConfig);
		this.listChanged$.subscribe(() => {
			this.onListChangedChanged();
		});
		this.readOnlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.readOnlyProcessor]);
	}

	public get TotalInfo() {
		return this.accountAssignmentTotal;
	}

	public updateBreakDown() {
		if (this.accountAssignmentTotal) {
			this.accountAssignmentTotal.conTotalPercent = sumBy(this.getList(), (i) => i.BreakdownPercent);
			this.accountAssignmentTotal.conTotalAmount = sumBy(this.getList(), (i) => i.BreakdownAmount);
			this.accountAssignmentTotal.conTotalAmountOc = sumBy(this.getList(), (i) => i.BreakdownAmountOc);
		}
	}

	public updateBreakDownPercent(entity: T, value: number) {
		if (this.accountAssignmentTotal) {
			entity.BreakdownAmount = round((this.accountAssignmentTotal.conTotalNet / 100) * value, 2);
			entity.BreakdownPercent = value;
			entity.BreakdownAmountOc = round((this.accountAssignmentTotal.conTotalNetOc / 100) * value, 2);
		}
	}

	protected override provideLoadPayload(): object {
		const selEntity = this.parentService.getSelectedEntity();
		if (selEntity) {
			return {
				contractId: selEntity.Id,
			};
		}

		throw new Error('The main entity should be selected!');
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		this.accountAssignmentTotal = loaded as IPrcCommonAccountAssignmentTotal<T>;
		const getMainEntityFk = this.config.getMainEntityFk;

		const loadedList = this.accountAssignmentTotal
			? this.accountAssignmentTotal.dtos.map((entity) => {
				return {
					...entity,
					ParentFk: getMainEntityFk(entity),
				};
			})
			: [];

		//To tester: in angularJs every time change the item number the sorting will be changed.
		//But it won't be a good solution. It will cause the row jumping after the modification. Now only load the data it will sort.
		sortBy(loadedList, (i) => i.ItemNO);

		return loadedList;
	}

	protected createReadonlyProcessor() {
		return new ProcurementCommonAccountAssignmentReadonlyProcessor<T, PT, PU>(this);
	}

	protected override provideCreatePayload(): object {
		const items = sortBy(this.getList(), (i) => i.ItemNO);

		return {
			ItemNo: items.reduce((max, dto) => Math.max(max, dto.ItemNO), 0) + 1,
			CurrentDtos: items,
		};
	}

	protected override onCreateSucceeded(created: object): T {
		const entity = created as T;
		this.updateBreakDownPercent(entity, entity.BreakdownPercent);
		return super.onCreateSucceeded(created);
	}

	private onListChangedChanged() {
		this.updateBreakDown();
	}
}
