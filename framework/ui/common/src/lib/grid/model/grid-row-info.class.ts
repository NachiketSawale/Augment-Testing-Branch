/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContext } from '@libs/platform/common';
import { IField } from '../../model/fields';
import { GridControlContext } from '../components/grid/grid.component';
import { IGridApi } from './grid-api.interface';
import { IFieldValidationResult, IReadOnlyEntityRuntimeDataRegistry } from '@libs/platform/data-access';
import { DomainControlInfoService } from '../../domain-controls';

export class RowEntityContext<T extends object> implements IEntityContext<T> {

	public constructor(private readonly owner: IGridApi<T>, private readonly row: T) {
	}

	public get entity(): T | undefined {
		return this.row;
	}

	public readonly totalCount: number = 1;

	public get indexInSet(): number | undefined {
		return this.owner.entity ? 0 : undefined;
	}
}

/**
 * Provides information about a row in a form.
 */
export class GridRowInfo<T extends object> {

	private readonly columnContexts = new Map<string, GridControlContext<T>>();
	private readonly domainControlInfoSvc = new DomainControlInfoService();

	public constructor(
		private readonly owner: IGridApi<T>,
		public readonly columns: IField<T>[],
		public entity: T,
		private readonly entityRuntimeDataRegister?: IReadOnlyEntityRuntimeDataRegistry<T>
	) {
		const entityContext = new RowEntityContext(owner, entity);
		columns.forEach(column => {
			const columnContext = new GridControlContext(owner, column, entity, entityContext, entityRuntimeDataRegister);

			const columnData = column as unknown as {
				[key: string]: unknown
			};

			for (const additionalField of this.domainControlInfoSvc.getAdditionalConfigFields(column.type)) {
				if (Object.prototype.hasOwnProperty.call(columnData, additionalField)) {
					columnContext[additionalField] = columnData[additionalField];
				}
			}

			this.columnContexts.set(column.id, columnContext);
		});
	}

	public get controlContexts(): Map<string, GridControlContext<T>> {
		return this.columnContexts;
	}

	/**
	 * Indicates whether there is at least one validation error for the row.
	 */
	public get hasValidationErrors(): boolean {
		return this.entityRuntimeDataRegister ? this.entityRuntimeDataRegister.hasValidationErrors() : false;
	}

	/**
	 * Returns the current validation error message, if any.
	 */
	public get validationMessage(): string | undefined {
		let msg = '';
		if (this.entityRuntimeDataRegister) {
			const validationResults: IFieldValidationResult<T>[] = this.entityRuntimeDataRegister.getValidationErrors(this.entity);
			for (const res of validationResults) {
				!res.result.valid ? msg += res.result.error : msg += '';
			}
		}
		return msg;
	}
}