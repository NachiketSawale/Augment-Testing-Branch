/*
 * Copyright(c) RIB Software GmbH
 */
import { Observable, ReplaySubject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { ICharacteristicBulkEditorParams } from '../model/interfaces/characteristic-bulk-editor-params.interface';
import { BasicsCharacteristicType, ICharacteristicDataEntity, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicTypeHelperService } from '../../services/basics-shared-characteristic-type-helper.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCharacteristicBulkEditorDialogDataService {
	protected readonly http = inject(PlatformHttpService);
	protected readonly helperService = inject(BasicsSharedCharacteristicTypeHelperService);

	protected readonly getFilteredObjectsUrl: string = 'basics/characteristic/data/getfilteredentitiescount';
	protected readonly setCharacteristicsUrl: string = 'basics/characteristic/data/setcharacteristics';

	protected entityList: ICharacteristicDataEntity[] = [];
	protected entitySelection: ICharacteristicDataEntity[] = [];
	protected entityList$ = new ReplaySubject<ICharacteristicDataEntity[]>(1);
	protected index: number = 0;

	public createItem(): void {
		const newItem = this.createEmptyItem();
		this.entityList.push(newItem);
		this.publishListChanged();
	}

	public deleteSelection(): void {
		if (this.entitySelection.length === 0) {
			return;
		}
		this.entitySelection.forEach((removeItem) => {
			const index = this.entityList.findIndex((e) => e.Id == removeItem.Id);
			if (index > -1) {
				this.entityList.splice(index, 1);
			}
		});
		this.publishListChanged();
	}

	public createItems(characteristics: ICharacteristicEntity[]): void {
		if (characteristics.length == 0) {
			return;
		}
		characteristics.forEach((srcItem) => {
			const newDataItem = this.createEmptyItem();
			this.helperService.merge2CharacteristicData(srcItem, newDataItem);
			this.entityList.push(newDataItem);
		});
		this.publishListChanged();
	}

	public selectItems(toSelect: ICharacteristicDataEntity[]): void {
		this.entitySelection = toSelect;
	}

	public resetItems() {
		this.entitySelection = [];
		this.entityList = [];
		this.index = 0;
		this.publishListChanged();
	}

	private createEmptyItem() {
		const newItem: ICharacteristicDataEntity = {
			Id: ++this.index,
			Description: '',
			CharacteristicFk: 0,
			CharacteristicGroupFk: 0,
			CharacteristicSectionFk: 0,
			CharacteristicTypeFk: BasicsCharacteristicType.NoValue,
			IsReadonly: false,
			ObjectFk: 0,
			ValueText: '',
			Version: 0,
			CharacteristicEntity: null,
		};
		return newItem;
	}

	private publishListChanged() {
		this.entityList$.next(this.entityList);
	}

	public get listChanged$(): Observable<ICharacteristicDataEntity[]> {
		return this.entityList$;
	}

	public getValidEntities(): ICharacteristicDataEntity[] {
		return this.entityList.filter((item) => item.CharacteristicFk > 0);
	}

	public getFilteredEntities$(params: ICharacteristicBulkEditorParams): Observable<ICharacteristicBulkEditorParams> {
		return this.http.post$<ICharacteristicBulkEditorParams>(this.getFilteredObjectsUrl, params);
	}

	public setCharacteristics(params: ICharacteristicBulkEditorParams) {
		params.values = this.getValidEntities();
		return this.http.post<ICharacteristicBulkEditorParams>(this.setCharacteristicsUrl, params);
	}
}
