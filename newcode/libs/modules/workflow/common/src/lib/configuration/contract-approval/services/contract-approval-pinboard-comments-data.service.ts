/*
 * Copyright(c) RIB Software GmbH
 */

import { Inject, Injectable } from '@angular/core';
import { BasicsSharedCommentDataServiceBase, ICommentDataEntity, ICommentEntityDescriptor, ICommentRequestInfo, ICommentResponse, IPinBoardContainerCreationOptions, PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN } from '@libs/basics/shared';
import { IEntityBase, IEntityIdentification, PropertyPathAccessor, ReadOnlyPropertyPathAccessor } from '@libs/platform/common';
import { IPrcConHeaderEntity } from '@libs/procurement/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ContractApprovalPinboardCommentsDataService<T extends IEntityIdentification & IEntityBase = ICommentDataEntity, PT extends IEntityIdentification & IEntityBase = IPrcConHeaderEntity> extends BasicsSharedCommentDataServiceBase<T, PT> {
    
    public constructor(@Inject(PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN) options: IPinBoardContainerCreationOptions<T, PT>) {        
        super(options);        
        this.load({
            id: this.getMainItem()?.Id ?? 0
        });           
    }

    public override get completeItemName(): string {
        return 'Comments';
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