/*
 * Copyright(c) RIB Software GmbH
 */

import { Inject, Injectable } from '@angular/core';
import { IEntityBase, IEntityIdentification, PropertyPathAccessor, ReadOnlyPropertyPathAccessor } from '@libs/platform/common';
import { BasicsSharedCommentDataServiceBase } from './basics-shared-comment-data-base.service';
import { ICommentEntityDescriptor } from '../model/interfaces/comment-column-option.interface';
import { IPinBoardContainerCreationOptions, PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN } from '../model/interfaces/pin-board-container-creation-option.interface';
import { ICommentResponse } from '../model/interfaces/response-entity.interface';
import { ICommentRequestInfo } from '../model/interfaces/comment-request-info.interface';

/**
 * The comment data service for standard type pin board container.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCommentDataService<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification> extends BasicsSharedCommentDataServiceBase<T, PT> {
	public constructor(@Inject(PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN) options: IPinBoardContainerCreationOptions<T, PT>) {
		super(options);
	}

	public get entityDescriptor(): ICommentEntityDescriptor<T> {
		return {
			clerkIdAccessor: new ReadOnlyPropertyPathAccessor('Comment.ClerkFk'),
			insertedAtAccessor: new ReadOnlyPropertyPathAccessor('Comment.InsertedAt'),
			commentAccessor: new ReadOnlyPropertyPathAccessor('Comment.Comment'),
			statusIdAccessor: undefined,
			mainItemIdAccessor: new ReadOnlyPropertyPathAccessor('MainItemFk'),
			idAccessor: new ReadOnlyPropertyPathAccessor('Comment.Id'),
			parentIdAccessor: new ReadOnlyPropertyPathAccessor('Comment.CommentFk'),
			childrenAccessor: new PropertyPathAccessor('Children'),
			childCountAccessor: new PropertyPathAccessor('ChildCount'),
			isNewAccessor: new ReadOnlyPropertyPathAccessor('IsNew'),
			canDeleteAccessor: new ReadOnlyPropertyPathAccessor('CanDelete'),
			canCascadeDeleteAccessor: new ReadOnlyPropertyPathAccessor('CanCascadeDelete'),
		};
	}

	public get completeItemName(): string {
		return 'Comments';
	}

	protected override async createHttp(mainItem: PT | null, data: ICommentRequestInfo): Promise<T | null> {
		const createURL = 'basics/common/comment/createcomment';
		try {
			return await this.http.post<T>(createURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async lastHttp(mainItem: PT, data: ICommentRequestInfo): Promise<ICommentResponse<T> | null> {
		const lastURL = 'basics/common/comment/last';
		try {
			return await this.http.post<ICommentResponse<T>>(lastURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async remainHttp(data: ICommentRequestInfo): Promise<ICommentResponse<T> | null> {
		const remainURL = 'basics/common/comment/remain';
		try {
			return await this.http.post<ICommentResponse<T>>(remainURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async deleteHttp(itemToDelete: T, data: ICommentRequestInfo): Promise<void> {
		const deleteURL = 'basics/common/comment/deletecomment';
		try {
			await this.http.post(deleteURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
	}
}
