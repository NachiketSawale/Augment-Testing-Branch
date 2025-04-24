/*
 * Copyright(c) RIB Software GmbH
 */

import { afterRender, Component, DestroyRef, ElementRef, inject, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { BasicsSharedUserFormConnector, BasicsSharedUserFormService, IUserFormDisplayOptions, UserFormDisplayMode } from '@libs/basics/shared';

@Component({
	selector: 'example-topic-one-user-form-demo',
	templateUrl: './user-form-demo.component.html',
	styleUrls: ['./user-form-demo.component.scss'],
})
export class UserFormDemoComponent extends ContainerBaseComponent implements OnInit {
	private destroyRef = inject(DestroyRef);
	private userFormService = inject(BasicsSharedUserFormService);

	public constructor(
		private elementRef: ElementRef
	) {
		super();
		afterRender(() => {
			// console.warn(Math.random());
		});
	}

	public loading: boolean = false;

	public tabs: {
		id: string,
		title: string;
		activated?: boolean
	}[] = [{
		id: 'basics-settings',
		title: 'User Form Settings',
		activated: true
	}, {
		id: 'open-in-preview',
		title: 'Open in Preview'
	}, {
		id: 'open-in-dialog',
		title: 'Open in Dialog'
	}, {
		id: 'open-in-window',
		title: 'Open in Window'
	}, {
		id: 'open-in-iframe',
		title: 'Open in Iframe'
	}, {
		id: 'open-in-container',
		title: 'Open in Container'
	}];

	public options: IUserFormDisplayOptions = {
		formId: 0,
		editable: true,
		isReadonly: false,
		modal: true,
		displayMode: UserFormDisplayMode.Dialog
	};

	public ngOnInit(): void {
		const cache = this.getSettings();
		if (cache) {
			this.options = {
				...cache
			};
		}
	}

	public activeTab(i: number) {
		this.tabs.forEach((tab, idx) => {
			tab.activated = i === idx;
		});
		const tab = this.tabs[i];
		switch (tab.id) {
			case 'open-in-dialog':
				this.options.displayMode = UserFormDisplayMode.Dialog;
				break;
			case 'open-in-window':
				this.options.displayMode = UserFormDisplayMode.Window;
				break;
			case 'open-in-iframe':
				this.options.displayMode = UserFormDisplayMode.IFrame;
				this.options.iframe = this.elementRef.nativeElement.querySelector('iframe') as HTMLIFrameElement;
				break;
			case 'open-in-container':
				this.options.displayMode = UserFormDisplayMode.Container;
				this.options.container = this.elementRef.nativeElement.querySelector('div.user-form-container') as HTMLDivElement;
				break;
		}
	}

	public saveSettings() {
		localStorage.setItem('ag-mg-uf-dm', JSON.stringify(this.options));
	}

	public getSettings() {
		const cache = localStorage.getItem('ag-mg-uf-dm');
		if (cache) {
			return JSON.parse(cache) as IUserFormDisplayOptions;
		}
		return null;
	}

	public showUserForm() {
		this.loading = true;
		this.userFormService.show(this.options).then((connector: BasicsSharedUserFormConnector) => {
			connector.registerFormSaved(data => {
				console.info('registerFormSaved', data);
			});

			connector.registerFormClosed(() => {
				console.info('registerFormClosed');
			});

			connector.registerFormChanged(data => {
				console.info('registerFormChanged', data);
			});

			this.destroyRef.onDestroy(() => {
				connector.destroy();
			});

			this.loading = false;
		}, (reason) => {
			throw new Error(reason);
		});
	}

	public previewUserForm() {
		this.loading = true;
		this.userFormService.preview(this.options.formId).then(() => {
			this.loading = false;
		});
	}

}
