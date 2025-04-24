/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { get, set } from 'lodash';
import { Injectable, Type } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { DataServiceFlatLeaf, IChildRoleBase, IDataServiceOptions, IDataServiceRoleOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { ScriptErrorType } from '../model/enums/script-error-type.enum';
import { IConstructionSystemCommonScriptErrorEntity } from '../model/entities/construction-system-common-script-error-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonOutputDataService<T extends IConstructionSystemCommonScriptErrorEntity = IConstructionSystemCommonScriptErrorEntity> extends DataServiceFlatLeaf<T, IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
	protected readonly parentService!: IEntitySelection<IEntityIdentification>;
	public readonly outPutResultChanged = new Subject<T[] | null>();
	public lastSelectedParentId: number = -1;
	public dataItems: T[] = [];
	public isShowError = false;
	public isShowWarning = false;
	public isShowInfo = false;
	public isFilterByInstance = true;
	public isFilterByCalculation = false;

	public constructor(parentServiceToken: Type<IEntitySelection<IEntityIdentification>>) {
		const parent = ServiceLocator.injector.get(parentServiceToken);
		const registerChildService = get(parent, 'registerChildService');
		if (!registerChildService) {
			set(parent, 'registerChildService', (childService: IChildRoleBase<object, object>) => {
				// no-op: intentionally empty function. If the parent service is DataServiceFlatLeaf, assign it an empty registerChildService method.
			});
		}

		const options: IDataServiceOptions<T> = {
			apiUrl: '',
			entityActions: { deleteSupported: false, createSupported: false },
			roleInfo: <IDataServiceRoleOptions<T>>{
				role: ServiceRole.Leaf,
				itemName: '',
				parent: parent,
			},
		};
		super(options);
		this.parentService = parent;

		const onScriptResultUpdated = this.getOnScriptResultUpdatedSubject();
		onScriptResultUpdated.subscribe((value: T[] | null) => {
			this.outPutResultChanged.next(value);
		});
	}

	public override async load(identificationData: IIdentificationData): Promise<T[]> {
		this.dataItems = await this.loadData();
		const items = this.getFilterData(this.dataItems);
		this.setList(items);
		return items ?? [];
	}

	/// Override this method to load data.
	protected async loadData(): Promise<T[]> {
		throw new Error('The loadData method must be override to load data.');
	}

	/// Override this method to customize the data filtering.
	protected filter(data: T[]) {
		return data;
	}

	/// Override this method to return the OnScriptResultUpdated subject.
	protected getOnScriptResultUpdatedSubject(): Subject<T[] | null> {
		throw new Error('The getOnScriptResultUpdatedSubject method must be override to return the OnScriptResultUpdated subject of parentService.');
	}

	private getFilterData(data: T[]) {
		data = this.filter(data || []);

		if (Array.isArray(data)) {
			data.forEach((item, index) => {
				item.Id = index + 1;
				item.Order = item.Id;
			});

			if (this.isShowError || this.isShowWarning || this.isShowInfo) {
				data = data.filter((item) => {
					return (
						(this.isShowError && item.ErrorType === ScriptErrorType.Error) ||
						(this.isShowWarning && item.ErrorType === ScriptErrorType.Warning) ||
						(this.isShowInfo && item.ErrorType === ScriptErrorType.Info) ||
						item.ErrorType === ScriptErrorType.All
					);
				});
			}
		}

		return data;
	}

	/// Reset the lastSelectedParentId.
	public resetLastSelectedParentId() {
		this.lastSelectedParentId = -1;
	}
}
