/*
 * Copyright(c) RIB Software GmbH
 */

import { isString } from 'lodash';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IEntityBase, IEntityIdentification, PlatformTranslateService, Translatable } from '@libs/platform/common';
import { BasicsSharedCommentDataServiceBase, ICommentEntityDescriptor } from '../../index';
import { IPinBoardEditorOptions, ISubmitComment } from '../../model/interfaces/response-entity.interface';
import { BlobsEntity } from '../../../interfaces/entities';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';

@Component({
	selector: 'basics-shared-comment-item',
	templateUrl: './comment-item.component.html',
	styleUrls: ['./comment-item.component.scss'],
})
export class BasicsSharedCommentItemComponent<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification> implements OnInit {
	public translate: PlatformTranslateService = inject(PlatformTranslateService);

	@Input()
	public comment!: T;

	@Input()
	public parent: T | undefined;

	@Input()
	public dataService!: BasicsSharedCommentDataServiceBase<T, PT>;

	@Output()
	public delete = new EventEmitter();

	@Output()
	public toggleAction = new EventEmitter();

	protected clerkPhotoSrc: string = '';

	protected clerkName = '';

	protected insertedDate = '';

	protected bodyContent = '';

	protected iconContent = '';

	protected footerContent = ''; // This parameter is not used at present and is only used to retain the original logic.

	protected isOpenEditor = false;

	protected detailInfo: Translatable = '';

	private get entityDescriptor(): ICommentEntityDescriptor<T> {
		return this.dataService.entityDescriptor;
	}

	public get editorOptions(): IPinBoardEditorOptions {
		const accessor = this.entityDescriptor.statusIdAccessor;
		return { commentType: this.dataService.option.commentType, lookupService: this.dataService.statusLookupService, parentStatusId: accessor?.getValue(this.comment)};
	}

	public get isReadOnly(): boolean {
		return this.dataService.isEntityReadOnly(this.comment);
	}

	public ngOnInit(): void {
		this.dataService.getChildren(this.comment).sort(this.dataService.sortByDate);
		this.setClerkBlob();
		this.setClerkDescription();
		this.setDate();
		this.setBodyContent();
		this.setStatus();

		this.detailInfo = this.dataService.buildDetail(this.comment);
	}

	private toImage(blob: string | string[] | undefined): string {
		if (isString(blob) && blob.length > 0 && blob.indexOf('data:') === -1) {
			return 'data:image/jpg;base64,' + blob;
		}
		return '';
	}

	private getClerkDesc(clerkId: number) {
		const clerks = this.dataService.clerks;
		let clerk: IBasicsClerkEntity | undefined;
		let desc: string = '';
		if (this.dataService.loginClerk.Clerk?.Id === clerkId) {
			clerk = this.dataService.loginClerk.Clerk;
		} else {
			for (let i = 0; i < clerks.length; i++) {
				if (clerks[i].Id === clerkId) {
					clerk = clerks[i];
					break;
				}
			}
		}
		if (clerk !== undefined) {
			desc = clerk.Description ?? desc;
			if (desc === undefined || desc === null || desc === '') {
				desc = clerk.Code ?? '';
			}
		}
		return desc;
	}

	private getClerkBlob(clerkId: number) {
		const clerks = this.dataService.clerks;
		const blobs = this.dataService.blobs;
		let clerk: IBasicsClerkEntity | undefined;
		let blob: BlobsEntity | undefined;
		if (this.dataService.loginClerk.Clerk?.Id === clerkId) {
			blob = this.dataService.loginClerk.Blob;
		} else {
			for (let i = 0; i < clerks.length; i++) {
				if (clerks[i].Id === clerkId) {
					clerk = clerks[i];
					break;
				}
			}
			if (clerk && clerk.BlobsPhotoFk) {
				for (let j = 0; j < blobs.length; j++) {
					if (blobs[j].Id === clerk.BlobsPhotoFk) {
						blob = blobs[j];
						break;
					}
				}
			}
		}
		return blob?.Content ? this.toImage(blob.Content) : '';
	}

	private setClerkBlob() {
		const value = this.entityDescriptor.clerkIdAccessor?.getValue(this.comment) ;
		if (value) {
			this.clerkPhotoSrc = this.getClerkBlob(value);
		}
	}

	private setClerkDescription() {
		const value = this.entityDescriptor.clerkIdAccessor?.getValue(this.comment);
		if (value) {
			this.clerkName = this.getClerkDesc(value);
		}
	}

	private setDate() {
		const value = this.entityDescriptor.insertedAtAccessor?.getValue(this.comment);
		if (value) {
			const date = new Date(value.toString());
			this.insertedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
		}
	}

	private setBodyContent() {
		const value = this.entityDescriptor.commentAccessor?.getValue(this.comment);
		if (value) {
			this.bodyContent = value;
		}
	}

	private setStatus() {
		const value = this.entityDescriptor.statusIdAccessor?.getValue(this.comment);
		if (value) {
			const icon = this.dataService.statusLookupService?.getIconById(value);
			this.iconContent = icon?.iconCSS ?? '';
			this.iconContent = `<i class="${this.iconContent}" style="margin-right: 3px;"></i>`;
		}
	}

	protected clickCommentButton() {
		this.isOpenEditor = !this.isOpenEditor;
	}

	protected clickDeleteButton() {
		this.delete.emit(this.comment);
	}

	protected async addComment(value: ISubmitComment) {
		this.isOpenEditor = false;
		const response = await this.dataService.createComment(value.comment, this.comment, value.iconFk);
		if (response) {
			this.detailInfo = this.dataService.buildDetail(this.comment);
			this.toggleAction.emit();
		}
	}

	protected deleteComment(commentItem: T) {
		this.dataService.deleteComment(commentItem, this.comment).then(() => {
			this.detailInfo = this.dataService.buildDetail(this.comment);
			this.toggleAction.emit();
		});
	}

	/** Toggle between 'view all' and 'show latest' */
	public async toggle() {
		this.detailInfo = await this.dataService.toggle(this.detailInfo.toString(), this.comment);
		this.toggleAction.emit();
	}

	public handlePageEvent() {
		this.toggleAction.emit();
	}

	protected isCommentButtonDisabled() {
		return this.isReadOnly;
	}

	protected isDeleteButtonDisabled() {
		const children = this.dataService.getChildren(this.comment);
		const canDelete = this.entityDescriptor.canDeleteAccessor?.getValue(this.comment);
		const canCascadeDelete = this.entityDescriptor.canCascadeDeleteAccessor?.getValue(this.comment);
		return !canDelete || (!canCascadeDelete && children && children.length > 0) || this.isReadOnly;
	}
}
