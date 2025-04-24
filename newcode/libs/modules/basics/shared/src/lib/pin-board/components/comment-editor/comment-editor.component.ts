/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FieldType, IAdditionalSelectOptions, IControlContext, ICustomDialogOptions, ILookupViewResult, PopupService, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BasicsSharedEmotionPopupComponent } from '../emotion-popup/emotion-popup.component';
import { KeyboardCode } from '@libs/platform/common';
import { COMMENT_IMG_STR_TOKEN, CommentImagePreviewComponent } from '../comment-image-preview/comment-image-preview.component';
import { CommentType } from '../../index';
import { IPinBoardEditorOptions } from '../../model/interfaces/response-entity.interface';

@Component({
	selector: 'basics-shared-comment-editor',
	templateUrl: './comment-editor.component.html',
	styleUrls: ['./comment-editor.component.scss'],
})
export class BasicsSharedCommentEditorComponent implements OnInit {
	/**
	 * Container element reference
	 */
	@ViewChild('owner')
	public owner!: ElementRef;

	@Input()
	public maxLength: number = 256;

	@Input()
	public readonly: boolean = false;

	@Input()
	public options: IPinBoardEditorOptions | undefined;

	@Output()
	public submitComment = new EventEmitter();

	public statusRadioOptions: IAdditionalSelectOptions | undefined;

	public statusControlContext: IControlContext = {
		fieldId: this.generateUUID(),
		readonly: false,
		validationResults: [],
		entityContext: { totalCount: 0 },
		value: 1,
	};

	protected readonly FieldType = FieldType;

	public popupService = inject(PopupService);

	/**
	 * Variable to set can selected image type
	 */
	public acceptType = 'image/bmp,image/emf,image/gif,image/jpg,image/png,image/jpeg';

	/**
	 * Variable to set editor into it
	 */
	public textarea!: HTMLElement | null;

	private modalDialogService = inject(UiCommonDialogService);

	protected readonly CommentType = CommentType;

	public ngOnInit(): void {
		this.textarea = document.getElementById('comment-textarea') as HTMLElement;
		this.initStatusRadioOptions();
	}

	private initStatusRadioOptions() {
		if (this.options && this.options?.commentType === CommentType.Customized) {
			if (this.options.lookupService) {
				this.options.lookupService.generateIcons().then((r) => {
					this.statusRadioOptions = { itemsSource: { items: r } };
					this.statusControlContext.value = this.options?.lookupService?.getDefaultIconId(this.options?.parentStatusId);
				});
			}
		}
	}

	/*** TODO: should use platformCreateUuid  */
	private generateUUID(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	private removeNgContentAttributes(html: string): string {
		const regex = /(_ngcontent-ng-[^" ]*="[^"]*")/g;
		const regexTrimSpaces = />\s+</g;
		html = html.replace(regex, '');
		return html.replace(regexTrimSpaces, ' ');
	}

	public onKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case KeyboardCode.ENTER: {
				if (event.ctrlKey || event.shiftKey) {
					// editorHelperService.addWordWrap(this.textarea?[0]);
				} else {
					if (!this.invalid()) {
						// comment is valid.
						if (this.textarea?.innerHTML) {
							const comment = this.removeNgContentAttributes(this.textarea?.innerHTML);
							this.submitComment.emit({
								comment: comment,
								iconFk: this.statusRadioOptions ? this.statusControlContext.value : null,
							});
						}

						if (this.textarea) {
							this.textarea.textContent = '';
						}
					}
				}
				event.preventDefault();
			}
		}
	}

	public onClick(event: MouseEvent) {
		// todo: image preview cannot resize image.
		const imageElement = event.target as HTMLElement;
		const imgStr: string = imageElement.getAttribute('src') ?? '';

		if (imageElement.tagName.toLowerCase() === 'img') {
			const imgModalOptions: ICustomDialogOptions<never, CommentImagePreviewComponent> = {
				width: '800px',
				height: '600px',
				resizeable: false,
				buttons: [{ id: StandardDialogButtonId.Ok, caption: { key: 'ui.common.dialog.okBtn' } }],
				headerText: { key: 'basics.common.button.preview' },
				id: 'imagePreview',
				bodyProviders: [
					{
						provide: COMMENT_IMG_STR_TOKEN,
						useValue: imgStr,
					},
				],
				bodyComponent: CommentImagePreviewComponent,
			};
			this.modalDialogService.show(imgModalOptions);
		}
	}

	public onMouseDown(event: MouseEvent) {
		// prevent lost focus when click tool button.
		event.preventDefault();
	}

	public format(cmd: string, ...args: string[]): void {
		const arg1 = args[0];
		document.execCommand(cmd, false, arg1);
	}

	private createLink(input?: string | null): void {
		if (input) {
			this.format('createlink', input);
		}
	}

	public insertLink(): void {
		this.textarea?.focus();
		const input = prompt('basics.common.enterLinkUrl');
		this.createLink(input);
	}

	public uploadFile(): void {
		const ele = document.getElementById('editorImageUpload') as HTMLInputElement;
		if (!ele) {
			console.log('fileupload control not found');
		} else {
			const file = ele.files?.item(0);
			if (!file) {
				console.log('no file specified for upload');
			} else {
				const reader = new FileReader();
				reader.onload = (res) => {
					const content = res.target?.result;
					this.format('insertHTML', `<img class="comment-image" alt="" src="${content}" style="width: 16px; height: 30px"/>`);
				};
				reader.readAsDataURL(file as Blob);
			}
		}
	}

	public insertImage(): void {
		this.textarea?.focus();
		document.getElementById('editorImageUpload')?.click();
	}

	/// todo: If inserting emoji, there is a typography problem with the input text.
	/// todo: The emoji container pops up in the wrong position, and the container is too large.
	public insertEmotion() {
		const popup = this.popupService.toggle(this.owner, BasicsSharedEmotionPopupComponent, {
			showHeader: false,
			showFooter: true,
			hasDefaultWidth: true,
			resizable: true,
			width: 100,
			relatedElement: this.owner,
		});

		if (popup) {
			popup.closed.subscribe((e) => {
				const result = e as ILookupViewResult<string>;

				if (result?.result) {
					this.textarea?.focus(); // focus text area to make it work.
					this.format('insertHTML', result.result);
				}
			});
		}
	}

	public invalid() {
		// TODO invalid
		return false;
	}

	public isEditable() {
		return !this.readonly;
	}

	public isDisabled() {
		return this.readonly;
	}
}
