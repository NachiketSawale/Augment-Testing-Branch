import { Component, inject, InjectionToken, StaticProvider } from '@angular/core';
import { ControlContextInjectionToken, IControlContext, ILookupReadonlyDataService, LookupEvent, UiCommonLookupReadonlyDataService } from '@libs/ui/common';
import { IEntityContext, PropertyType } from '@libs/platform/common';

export const COST_TOTAL_OPTIONS_TOKEN = new InjectionToken<UiCommonLookupReadonlyDataService<object, object> & { placeHolder?: string }>('cost_total_lookup_options');

function getCostTotalLookupOptionsToken<TItem extends object, TEntity extends object = object>(): InjectionToken<UiCommonLookupReadonlyDataService<TItem, TEntity> & { placeHolder?: string }> {
	return COST_TOTAL_OPTIONS_TOKEN;
}

/**
 *
 * @param options
 */
export function createCostTotalLookupProvider<TItem extends object, TEntity extends object>(options: ILookupReadonlyDataService<TItem, TEntity> & { placeHolder?: string }): StaticProvider[] {
	return [
		{
			provide: getCostTotalLookupOptionsToken(),
			useValue: options,
		},
	];
}

@Component({
	selector: 'basics-shared-total-cost-composite',
	templateUrl: './basics-shared-total-cost-composite.component.html',
	styleUrls: ['./basics-shared-total-cost-composite.component.css'],
})
export class BasicsSharedTotalCostCompositeComponent<TItem extends object, TEntity extends object> {
	private lookupOptions = inject(getCostTotalLookupOptionsToken<TItem, TEntity>());
	private controlContext = inject(ControlContextInjectionToken) as IControlContext<PropertyType, TEntity>;

	public get dataService(): ILookupReadonlyDataService<TItem, TEntity> {
		return this.lookupOptions;
	}

	public get context(): IEntityContext<TEntity> {
		return this.controlContext.entityContext;
	}

	public get lookupValue() {
		return this.controlContext.value as number;
	}

	public selectedItemChanged(event: LookupEvent<TItem, TEntity>) {
		this.controlContext.value = (event.selectedItem as Record<string, number>)[this.lookupOptions.config.descriptionMember ?? this.lookupOptions.config.displayMember];
	}

	public get value(): string | number {
		if (this.lookupOptions.placeHolder) {
			return this.lookupOptions.placeHolder;
		}
		return this.controlContext.value as number;
	}

	public set value(value: number) {
		this.controlContext.value = value;
	}

	public get readOnly() {
		return !!this.lookupOptions.placeHolder;
	}
}
