import { Component, inject, Injector, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Circular1 } from '../../model/circular1.class';
import {
	ItemType,
	UiCommonInputDialogService,
} from '@libs/ui/common';

@Component({
	selector: 'example-topic-one-a-container',
	templateUrl: './a-container.component.html',
	styleUrls: ['./a-container.component.scss'],
})
export class AContainerComponent extends ContainerBaseComponent implements OnInit {

	public constructor() {
		super();

		this.uiAddOns.toolbar.addItems({
			caption: { text: 'wizards' },
			hideItem: false,
			iconClass: 'tlb-icons ico-delete',
			id: 't201',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 300,
			type: ItemType.Item,
		});
	}

	public readonly injector = inject(Injector);

	public ngOnInit(): void {
		new Circular1(this.injector).test();
	}

	private readonly inputDialogSvc = inject(UiCommonInputDialogService);

	public testDialogs() {
		this.inputDialogSvc.showInputDialog({
			buttons: [{
				id: 'bla',
				fn: (mouseEv, dlgEv) => alert(dlgEv)
			}]
		});
	}
}
