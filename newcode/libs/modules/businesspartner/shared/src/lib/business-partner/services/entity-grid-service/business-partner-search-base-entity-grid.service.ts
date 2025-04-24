/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { LazyInjectionToken, PlatformLazyInjectorService } from '@libs/platform/common';
import { ColumnDef, FieldType } from '@libs/ui/common';
import { ILookupLayoutGenerator } from '@libs/basics/interfaces';


/**
 * GridEntityType: The entity corresponding to the grid display data
 * FormEntityType: lazyInject is used to retrieve the entity data in the form table
 * SelectedEntityType: Records the entity selected by the wizard
 */
export abstract class BusinessPartnerSearchBaseEntityGridService<GridEntityType extends object, FormEntityType extends object, SelectedEntityType extends object> {


	protected selectedEntities: SelectedEntityType[] = [];
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public get selectedEntityList(): SelectedEntityType[] {
		return this.selectedEntities;
	}

	public set selectedEntityList(entities: SelectedEntityType[]) {
		this.selectedEntities = entities;
	}

	public pushEntity(entity: SelectedEntityType): void {
		const index = this.selectedEntities.findIndex(item => this.areEntitiesEqual(item, entity));
		if (index === -1) {
			this.selectedEntities.push(entity);
		}
	}

	public createSelectionColumn(model: string, type: FieldType.Radio | FieldType.Boolean): ColumnDef<GridEntityType>[] {
		return [
			{
				id: 'isCheck',
				model: model,
				label: {
					key: 'cloud.common.entitySelected'
				},
				type: type,
				sortable: true,
				visible: true,
				width: 100,
				itemsSource: {
					items: [
						{
							id: 0,
							displayName: {key: 'data.selected'},
						}
					],
				},
				change: changeInfo => {
					const isSelected = changeInfo.newValue;
					const entity = changeInfo.entity;
					const index = this.selectedEntities.findIndex(item => this.canEntityBeCompared(item, entity));
					if (isSelected && index === -1) {
						this.updateSelectedEntities(entity);
					}
					if (!isSelected && index > -1) {
						this.selectedEntities.splice(index, 1);
					}
				}
			}
		];

	}

	protected areEntitiesEqual(entityA: SelectedEntityType, entityB: SelectedEntityType): boolean {
		return false;
	}

	protected canEntityBeCompared(entityA: SelectedEntityType, entityB: GridEntityType): boolean {
		return false;
	}

	protected async generateBaseGridConfig(): Promise<ColumnDef<GridEntityType>[]> {
		const layout = await this.lazyInjector.inject<ILookupLayoutGenerator<FormEntityType>>(this.getLayoutGeneratorToken()).then(c => c.generateLookupColumns());
		// TODO: Check whether this typecast is really safe  
		return layout.map(item => item as unknown as ColumnDef<GridEntityType>);
	}

	protected abstract getLayoutGeneratorToken(): LazyInjectionToken<ILookupLayoutGenerator<object>>;

	protected updateSelectedEntities(entity: GridEntityType): void {
	}
}