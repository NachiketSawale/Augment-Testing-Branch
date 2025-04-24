/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	inject,
	Inject,
	Injector,
	Optional,
	StaticProvider,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IDialogData } from '../../model/interfaces/dialog-data-interface';
import { DialogDetailsType } from '../../..';
import { getCustomDialogDataToken } from '../../model/interfaces/custom-dialog.interface';

/**
 * This component renders the body of dialog and implements the body basic functionality.
 */
@Component({
	selector: 'ui-common-modal-body',
	templateUrl: './modal-body.component.html',
	styleUrls: ['./modal-body.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class ModalBodyComponent<TValue, TBody, TDetailsBody = void> implements AfterViewInit {

	private readonly injector = inject(Injector);

	public constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData<TValue, TBody, TDetailsBody>) {
		this.bodyInjector = this.provideInjector(this.data.dialog.bodyProviders);
		this.detailsInjector = this.provideInjector(this.data.dialog.details.bodyProviders);
	}

	private provideInjector(providers?: StaticProvider[]): Injector {
		const allProviders: StaticProvider[] = [{
			provide: getCustomDialogDataToken<TValue, TBody, TDetailsBody>(),
			useValue: this.data.dialog.dialogWrapper
		}];

		if (Array.isArray(providers)) {
			allProviders.push(...providers);
		}

		return Injector.create({
			providers: allProviders,
			parent: this.injector
		});
	}

	public readonly bodyInjector: Injector;

	public readonly detailsInjector: Injector;

	protected readonly DialogDetailsType = DialogDetailsType;

	@ViewChild('body', {read: ViewContainerRef})
	public bodyParent?: ViewContainerRef;

	private _detailsParent?: ViewContainerRef;

	@ViewChild('detailsBody', {read: ViewContainerRef})
	public set detailsParent(container: ViewContainerRef | undefined) {
		if (container === this._detailsParent) {
			return;
		}

		this._detailsParent = container;
		if (container) {
			container.clear();
			if (this.data.dialog.details.body) {
				this.data.dialog.details.detailsBody = container.createComponent<TDetailsBody>(this.data.dialog.details.body, {
					injector: this.detailsInjector
				}).instance;
			}
		} else {
			this.data.dialog.details.detailsBody = undefined;
		}

		this.changeDetectionRef.detectChanges();
	}

	private readonly changeDetectionRef = inject(ChangeDetectorRef);

	public ngAfterViewInit() {
		if (!this.bodyParent) {
			throw new Error('Dialog body has not been initialized.');
		}

		this.data.dialog.dialogBody = this.bodyParent.createComponent<TBody>(this.data.dialog.body, {
			injector: this.bodyInjector
		}).instance;

		this.changeDetectionRef.detectChanges();
	}
}
