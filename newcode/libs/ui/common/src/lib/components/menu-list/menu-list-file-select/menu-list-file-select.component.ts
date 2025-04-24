/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, Injector, Input, TemplateRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { MenuListItemBaseComponent } from '../../../model/menu-list/menu-list-base/menu-list-item-base.component';
import { IFileSelectControlContext } from '../../../domain-controls/model/file-select-control-context.interface';
import { FileSelectComponent } from '../../../domain-controls/components/file-select/file-select.component';
import { ControlContextInjectionToken } from '../../../domain-controls/model/control-context.interface';
import { ConcreteMenuItem } from '../../../model/menu-list/interface';
import { IFileSelectMenuItem } from '../../../model/menu-list/interface/file-select-menu-item.interface';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

/**
 * Fileupload menu item for toolbar.
 */
@Component({
	selector: 'ui-common-menu-list-file-select',
	templateUrl: './menu-list-file-select.component.html',
	styleUrls: ['./menu-list-file-select.component.scss'],
})
export class MenuListFileSelectComponent<TContext> extends MenuListItemBaseComponent<TContext> implements AfterViewInit {
	/**
	 * Menu Item details for file select component.
	 */
	@Input()
	public menuItem!: ConcreteMenuItem<TContext>;

	/**
	 * Container reference of the view of this component.
	 */
	public readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

	/**
	 * Template reference of the file select element.
	 */
	@ViewChild('toolbarItem')
	public toolbarItem!: TemplateRef<Element>;

	/**
	 * Initializes file select component once the menu view has been rendered.
	 */
	public ngAfterViewInit(): void {
		this.prepareFileSelectComponent();
	}

	private prepareFileSelectComponent() {
		this.viewContainerRef.clear();
		this.viewContainerRef.createComponent(FileSelectComponent, { injector: this.prepareInjector() });
	}

	private prepareInjector(): Injector {
		const onSelectionChanged = () => {
			this.typedMenuItem.value = controlContext.value;
			this.executeItemAction(this.typedMenuItem);
		};
		const controlContext: IFileSelectControlContext = {
			options: {
				...this.typedMenuItem.options,
				onSelectionChanged: onSelectionChanged
			},
			customTemplate: this.toolbarItem,
			fieldId:	'toolbar-file-select',
			entityContext: { totalCount: 0 },
			readonly: false,
			validationResults: []
		};
		return Injector.create({ providers: [{ provide: ControlContextInjectionToken, useValue: controlContext }] });
	}

	private get typedMenuItem(): IFileSelectMenuItem<TContext> {
		if (this.menuItem.type !== ItemType.FileSelect) {
			throw new Error('Not the required menu type item');
		}

		return this.menuItem;
	}
}