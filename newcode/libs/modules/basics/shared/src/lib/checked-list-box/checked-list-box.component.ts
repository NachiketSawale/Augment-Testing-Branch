import { Component, inject, InjectionToken, StaticProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatformCommonModule } from '@libs/platform/common';
import { ControlContextInjectionToken, ILookupContext, ILookupOptions } from '@libs/ui/common';

// TODO: need to refactor.

const CHECKED_LIST_BOX_LOOKUP_OPTIONS_TOKEN = new InjectionToken('checked_list_box_lookup_options');

export function getCheckedListBoxLookupOptionsToken<TItem extends object, TEntity extends object>(): InjectionToken<ILookupOptions<TItem, TEntity>> {
	return CHECKED_LIST_BOX_LOOKUP_OPTIONS_TOKEN;
}

/**
 *
 * @param options
 */
export function createCheckedListBoxLookupProvider<TItem extends object, TEntity extends object>(options: ILookupOptions<TItem, TEntity>): StaticProvider[] {
	return [{
		provide: getCheckedListBoxLookupOptionsToken<TItem, TEntity>(),
		useValue: options
	}];
}

@Component({
	selector: 'basics-shared-checked-list-box',
	standalone: true,
	imports: [CommonModule, FormsModule, PlatformCommonModule],
	templateUrl: './checked-list-box.component.html',
	styleUrl: './checked-list-box.component.scss'
})
export class BasicsSharedCheckedListBoxComponent<TItem extends Record<string, string>, TEntity extends object> {

	private controlContext = inject(ControlContextInjectionToken);

	private lookupOptions = inject(getCheckedListBoxLookupOptionsToken<TItem, TEntity>());

	public get items(): Array<Record<string, string>> {
		const items = this.controlContext.value as unknown as TItem[];
		if (this.lookupOptions?.clientSideFilter?.execute) {
			return items.filter(item =>
				this.lookupOptions?.clientSideFilter?.execute(
					item, this.controlContext.entityContext as ILookupContext<TItem, TEntity>)
			);
		}
		return items;
	}

	public get id() {
		return this.lookupOptions?.idProperty ?? 'id';
	}

	public get value() {
		return this.lookupOptions?.valueMember ?? 'selected';
	}


	public get display() {
		return this.lookupOptions?.displayMember ?? 'label';
	}

}
