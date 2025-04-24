/*
 * Copyright(c) RIB Software GmbH
 */

import { Inject, Injectable } from '@angular/core';
import { BasicsSharedCommentDataServiceBase, ICommentEntityDescriptor, ICommentRequestInfo, ICommentResponse, IPinBoardContainerCreationOptions, PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN } from '@libs/basics/shared';
import { IEntityBase, IEntityIdentification, PropertyPathAccessor, ReadOnlyPropertyPathAccessor } from '@libs/platform/common';
import { get } from 'lodash';

// remark: ProductionplanningSharedJobCommentDataService is mainly copied from BasicsSharedCommentDataService
/**
 * The comment data service for standard type pin board container.
 */
@Injectable({
	providedIn: 'root',
})
export class ProductionplanningSharedJobCommentDataService<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification> extends BasicsSharedCommentDataServiceBase<T, PT> {
	public constructor(@Inject(PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN) options: IPinBoardContainerCreationOptions<T, PT>) {
		super(options);
	}

	public get entityDescriptor(): ICommentEntityDescriptor<T> {
		return {
			clerkIdAccessor: new ReadOnlyPropertyPathAccessor('ClerkFk'),
			insertedAtAccessor: new ReadOnlyPropertyPathAccessor('InsertedAt'),
			commentAccessor: new ReadOnlyPropertyPathAccessor('Specification'),
			statusIdAccessor: undefined,
			mainItemIdAccessor: new ReadOnlyPropertyPathAccessor('JobFk'), // 'Id'?
			idAccessor: new ReadOnlyPropertyPathAccessor('Id'),
			parentIdAccessor: new ReadOnlyPropertyPathAccessor('JobCommentFk'),
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
		const createURL = 'logistic/job/comments/createComment';
		try {
			if (mainItem) {
				data = this.processCommentRequestInfo(mainItem, data);
			}
			return await this.http.post<T>(createURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async lastHttp(mainItem: PT, data: ICommentRequestInfo): Promise<ICommentResponse<T> | null> {
		const lastURL = 'logistic/job/comments/last';
		try {
			data = this.processCommentRequestInfo(mainItem, data);
			return await this.http.post<ICommentResponse<T>>(lastURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async remainHttp(data: ICommentRequestInfo): Promise<ICommentResponse<T> | null> {
		const remainURL = 'logistic/job/comments/remain';
		try {
			return await this.http.post<ICommentResponse<T>>(remainURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async deleteHttp(itemToDelete: T, data: ICommentRequestInfo): Promise<void> {
		const deleteURL = 'logistic/job/comments/deletecomment';
		try {
			await this.http.post(deleteURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
	}

	private processCommentRequestInfo(mainItem: PT, data: ICommentRequestInfo) {
		data.ParentItemId = this.getJobId(mainItem) as number;
		return data;
	}

	private getJobId(mainItem: PT) {
		return get(mainItem, 'JobFk') ?? get(mainItem, 'LgmJobFk') ?? get(mainItem, 'JobId') ?? -1;
	}

}
