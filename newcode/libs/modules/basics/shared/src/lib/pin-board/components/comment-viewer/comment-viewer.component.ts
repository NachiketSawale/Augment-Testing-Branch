/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Injector, OnInit } from '@angular/core';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { BasicsSharedCommentDataServiceFactory } from '../../services/basics-shared-comment-data-service-factory.service';
import { CompleteIdentification, EntityBase, IEntityIdentification, PlatformTranslateService, Translatable } from '@libs/platform/common';
import { IPinBoardEditorOptions, ISubmitComment } from '../../model/interfaces/response-entity.interface';
import { IPinBoardContainerCreationOptions, PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN } from '../../model/interfaces/pin-board-container-creation-option.interface';
import { differenceBy } from 'lodash';
import { PageEvent } from '@angular/material/paginator';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { COMMENT_IMG_STR_TOKEN, CommentImagePreviewComponent } from '../comment-image-preview/comment-image-preview.component';

@Component({
	selector: 'basics-shared-comment-viewer',
	templateUrl: './comment-viewer.component.html',
	styleUrls: ['./comment-viewer.component.scss'],
})
export class BasicsSharedCommentViewerComponent<T extends IEntityIdentification & EntityBase, PT extends IEntityIdentification, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>> extends EntityContainerBaseComponent<PT> implements OnInit {
	private injector: Injector = inject(Injector);

	private readonly option = inject<IPinBoardContainerCreationOptions<T, PT>>(PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN);

	public translate = inject(PlatformTranslateService);

	private dataServiceFactory = inject(BasicsSharedCommentDataServiceFactory<T, PT, PU>);

	public dataService = this.dataServiceFactory.createService(this.injector, this.option);

	public commentItems: T[] = [];

	public totalItems: number = 0;

	public pageNum = 0;

	public pageSize = this.option.pageSize ?? 10;

	public detailInfo: Translatable = '';

	private modalDialogService = inject(UiCommonDialogService);

	private get lastPageIndex(): number {
		return this.totalItems > 0 ? Math.ceil(this.totalItems / this.pageSize) - 1 : 0;
	}

	public get editorOptions(): IPinBoardEditorOptions {
		return {commentType: this.option.commentType, lookupService: this.dataService.statusLookupService};
	}

	public constructor() {
		super();
	}

	public ngOnInit(): void {
		this.dataService.refreshLoginClerk();
		this.entitySelection.selectionChanged$.subscribe(() => {
			this.clear();
		});
		this.dataService.listChanged$.subscribe(async () => {
			this.setData();
		});
	}

	public preview(event: MouseEvent) {
		// todo: image preview cannot resize image.
		const imageElement = event.target as HTMLElement;
		const imgStr: string = imageElement.getAttribute('src') ?? '';
		if (imageElement.tagName.toLowerCase() === 'img') {
			const imgModalOptions: ICustomDialogOptions<never, CommentImagePreviewComponent> = {
				width: '800px',
				height: '600px',
				resizeable: true,
				buttons: [{ id: StandardDialogButtonId.Ok, caption: { key: 'ui.common.dialog.okBtn' } }],
				headerText: { key: 'basics.common.button.preview' },
				id: 'imagePreview',
				bodyProviders: [{ provide: COMMENT_IMG_STR_TOKEN, useValue: imgStr }],
				bodyComponent: CommentImagePreviewComponent,
			};
			this.modalDialogService.show(imgModalOptions);
		}
	}

	public async addComment(value: ISubmitComment) {
		await this.dataService.createComment(value.comment, null, value.iconFk);
	}

	public async deleteComment(commentItem: T) {
		await this.dataService.deleteComment(commentItem);

		this.setData();
	}

	private clear() {
		this.commentItems = [];
		this.detailInfo = '';
		this.pageNum = 0;
		this.totalItems = 0;
	}

	/** Toggle between 'view all' and 'show latest' */
	public async toggle() {
		this.detailInfo = await this.dataService.toggle(this.detailInfo.toString());
		this.commentItems = this.dataService.getComments();

		this.setData();
	}

	public setData($event?: PageEvent) {
		this.totalItems = this.dataService.count();

		if ($event?.pageIndex !== undefined) {
			this.pageNum = $event?.pageIndex;
		} else if (this.option.showLastComments) {
			this.pageNum = this.lastPageIndex;
		}

		const context = this.renderContext();
		this.commentItems = this.handlePage(this.dataService.getComments().sort(this.dataService.sortByDate), context);

		this.detailInfo = this.dataService.buildDetail(undefined, this.pageNum, this.lastPageIndex);
	}

	private handlePage(comments: T[], context: { index: number; start: number; end: number }) {
		const newCommentItems: T[] = [];

		for (let i = 0; i < (comments.length ?? 0); i++) {
			const comment = comments.at(i) as T;
			if (this.dataService.getIsVisible(comment)) {
				++context.index;
				if (context.index > context.end) {
					continue;
				}

				const commentChildren = this.dataService.getChildren(comment);
				if (context.index > context.start) {
					newCommentItems.push(comment);
					const lastComment = newCommentItems[newCommentItems.length - 1];
					if (commentChildren.length > 0) {
						const newChildren = this.handlePage(commentChildren, context);
						const lastCommentChildren = this.dataService.getChildren(lastComment);
						const diffComments = differenceBy(newChildren, lastCommentChildren, 'Id');
						// TODO-allen: There is a bug here. The number of Children may exceed the pageSize.
						lastCommentChildren.push(...diffComments);
						lastCommentChildren.sort(this.dataService.sortByDate);
						this.dataService.setChildren(lastComment, lastCommentChildren);
					}
				} else {
					if (commentChildren.length > 0) {
						newCommentItems.push(...this.handlePage(commentChildren, context));
					}
				}
			}
		}
		return newCommentItems;
	}

	private renderContext() {
		if (this.pageNum > this.lastPageIndex) {
			this.pageNum = this.lastPageIndex;
		}

		const start = this.pageSize * this.pageNum - 1;
		const end = start + this.pageSize;

		return { index: -1, start: start, end: end };
	}

	public disable() {
		return !(this.dataService.loginClerk.Clerk && this.dataService.loginClerk.Clerk.Id);
	}
}
