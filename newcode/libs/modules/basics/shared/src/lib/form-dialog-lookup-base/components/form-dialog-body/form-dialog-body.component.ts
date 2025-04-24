/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, inject, Injector, StaticProvider } from '@angular/core';
import { getCustomDialogDataToken, IFormConfig, StandardDialogButtonId } from '@libs/ui/common';
import { ICustomFormDialogOptions } from './../../';
import { ICustomFormEditorDialog } from './../../';
import { getCustomDialogOptionToken } from './../../';
import { EntityRuntimeData } from '@libs/platform/data-access';

@Component({
	selector: 'basics-shared-form-dialog-body',
	templateUrl: './form-dialog-body.component.html',
	styleUrls: ['./form-dialog-body.component.scss'],
})
export class BasicsSharedFormDialogBodyComponent<TItem extends object> implements AfterViewInit {
	private elementRef = inject(ElementRef);
	private parentInjector = inject(Injector);
	public dialogOptions: ICustomFormDialogOptions<TItem> = inject(getCustomDialogOptionToken<TItem, ICustomFormEditorDialog<TItem>, ICustomFormDialogOptions<TItem>>());
	private readonly dialogWrapper = inject(getCustomDialogDataToken<TItem, BasicsSharedFormDialogBodyComponent<TItem>>());
	public readonly dialogInfo: ICustomFormEditorDialog<TItem>;
	public injector = this.getInjector();

	/**
	 * Adjust the custom component size to fill the section.
	 * @private
	 */
	private handleCustomComponentSize() {
		const customComponents = this.elementRef.nativeElement.querySelectorAll('.form-dialog-body-section-container');
		customComponents.forEach((elem: HTMLElement) => {
			for (let i = 0; i < elem.children.length; i++) {
				elem.children[i].classList.add('fullheight');
			}
		});
	}

	/**
	 * Create a new injector with specified providers.
	 */
	private getInjector(): Injector {
		const sections = [
			this.dialogOptions.sectionTop,
			this.dialogOptions.sectionLeft,
			this.dialogOptions.sectionRight,
			this.dialogOptions.sectionBottom
		];

		const providers = sections.reduce((result: StaticProvider[], section) => {
			if (section && section.providers) {
				result.push(...section.providers);
			}
			return result;
		}, []);

		return Injector.create({
			providers: providers,
			parent: this.parentInjector
		});
	}

	/**
	 * Default constructor.
	 */
	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: BasicsSharedFormDialogBodyComponent<TItem>): ICustomFormEditorDialog<TItem> {
			return {
				get value(): TItem | undefined {
					return owner.dialogWrapper.value;
				},
				set value(v: TItem) {
					owner.dialogWrapper.value = v;
				},
				get options(): ICustomFormDialogOptions<TItem> {
					return owner.dialogOptions;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dialogWrapper.close(closingButtonId);
				}
			};
		})(this);
	}

	/**
	 * The life cycle hook to handle event where the dom is ready.
	 */
	public ngAfterViewInit() {
		this.handleCustomComponentSize();
	}

	/**
	 * The form configuration object applied in the form.
	 */
	public get formConfig(): IFormConfig<TItem> | undefined {
		return this.dialogOptions.formConfiguration;
	}

	/**
	 * Gets the object being edited.
	 */
	public get entity(): TItem | undefined {
		return this.dialogOptions.value;
	}

	/**
	 * Provide then entity runtime data that contains readonly fields and validation results etc.
	 */
	public get entityRuntimeData(): EntityRuntimeData<TItem> | undefined {
		return this.dialogOptions.entityRuntimeData;
	}
}
