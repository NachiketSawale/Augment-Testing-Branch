/*
 * Copyright(c) RIB Software GmbH
 */

import { afterNextRender, Component, ElementRef, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getCustomDialogDataToken, StandardDialogButtonId } from '@libs/ui/common';
import { IUserFormData } from '../../model/interfaces/user-form-data.interface';
import { IUserFormDialogOptions, IUserFormEditorDialog } from '../../model/interfaces/user-form-dialog-options.interface';
import { USER_FORM_DIALOG_OPTIONS_TOKEN } from '../../services/user-form.service';

@Component({
	selector: 'basics-shared-user-form-dialog-body',
	templateUrl: './user-form-dialog-body.component.html',
	styleUrls: ['./user-form-dialog-body.component.scss'],
})
export class BasicsSharedUserFormDialogBodyComponent {
	private sanitizer = inject(DomSanitizer);
	private readonly dlgWrapper = inject(getCustomDialogDataToken<IUserFormData[], BasicsSharedUserFormDialogBodyComponent>());
	public dialogInfo!: IUserFormEditorDialog;
	public dialogOptions: IUserFormDialogOptions = inject(USER_FORM_DIALOG_OPTIONS_TOKEN);
	public safeUrl!: SafeResourceUrl;
	public saving: boolean = false;

	public constructor(
		private elementRef: ElementRef
	) {
		this.initialize();
	}

	private initialize() {
		this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dialogOptions.url);
		this.dialogInfo = (function createDialogInfoFn(owner: BasicsSharedUserFormDialogBodyComponent): IUserFormEditorDialog {
			return {
				get value(): IUserFormData[] | undefined {
					return owner.dlgWrapper.value;
				},
				set value(v: IUserFormData[]) {
					owner.dlgWrapper.value = v;
				},
				get saving(): boolean | undefined {
					return owner.saving;
				},
				set saving(value: boolean) {
					owner.saving = value;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);

		afterNextRender(() => {
			const iframe = this.elementRef.nativeElement.querySelector('iframe') as HTMLIFrameElement;
			if (iframe) {
				iframe.addEventListener('load', () => {
					if (this.dialogOptions.onLoaded) {
						if (iframe && iframe.contentWindow) {
							this.dialogOptions.onLoaded(iframe.contentWindow);
						} else {
							throw new Error('Loaded failed!');
						}
					}
				});
			}
		});
	}
}
