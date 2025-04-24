/*
 * Copyright(c) RIB Software GmbH
 */

import { Inject, Injectable } from '@angular/core';
import { BasicsSharedCommentDataServiceBase, ICommentEntityDescriptor, ICommentRequestInfo, ICommentResponse, IPinBoardContainerCreationOptions, PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN } from '@libs/basics/shared';
import { IEntityBase, IEntityIdentification, PropertyPathAccessor, ReadOnlyPropertyPathAccessor } from '@libs/platform/common';

export interface IPpsLogPinBoardContainerCreationOptions<T extends IEntityIdentification & IEntityBase, PT extends IEntityIdentification & IEntityBase>
	extends IPinBoardContainerCreationOptions<T, PT> {
	readonly endRead: string; // e.g. 'logsForPpsItem?itemId=', 'logsForEngTask?mainItemId=', 'logsForProdSet?mainItemId=' , 'logsForMntReq?mainItemId='
}

/**
 * The comment data service for standard type pin board container.
 */
@Injectable({
	providedIn: 'root',
})
export class ProductionplanningSharedLogCommentDataService<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification> extends BasicsSharedCommentDataServiceBase<T, PT> {
	
	private readonly endRead: string;

	public constructor(@Inject(PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN) options: IPinBoardContainerCreationOptions<T, PT>
		) {
		super(options);
		this.endRead = (options as IPpsLogPinBoardContainerCreationOptions<T, PT>).endRead;
	}

	public get entityDescriptor(): ICommentEntityDescriptor<T> {
		return {
			clerkIdAccessor: new ReadOnlyPropertyPathAccessor('ClerkFk'),
			insertedAtAccessor: new ReadOnlyPropertyPathAccessor('Date'),
			commentAccessor: new ReadOnlyPropertyPathAccessor('Remark'),
			statusIdAccessor: undefined,
			mainItemIdAccessor: new ReadOnlyPropertyPathAccessor('RecordId'),
			idAccessor: new ReadOnlyPropertyPathAccessor('Id'),
			parentIdAccessor: new ReadOnlyPropertyPathAccessor('ParentId'),
			childrenAccessor: new PropertyPathAccessor('Children'),
			childCountAccessor: new PropertyPathAccessor('ChildCount'),
			isNewAccessor: new ReadOnlyPropertyPathAccessor('IsNew'),
			canDeleteAccessor: new ReadOnlyPropertyPathAccessor('CanDelete'),
			canCascadeDeleteAccessor: new ReadOnlyPropertyPathAccessor('CanCascadeDelete'),
		};
	}

	public get completeItemName(): string {
		return 'Logs';
	}

	protected override async createHttp(mainItem: PT | null, data: ICommentRequestInfo): Promise<T | null> {
		const createURL = 'productionplanning/common/log/createcomment';
		try {
			return await this.http.post<T>(createURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async lastHttp(mainItem: PT, data: ICommentRequestInfo): Promise<ICommentResponse<T> | null> {
		try {
			// lastURL e.g. 'productionplanning/common/logreport/last/logsForEngTask?mainItemId=1'
			//              'productionplanning/common/logreport/last/logsForPpsItem?itemId=1'
			const itemId = mainItem.Id;
			const lastURL = `productionplanning/common/logreport/last/${this.endRead}${itemId}`;
			return await this.http.get<ICommentResponse<T>>(lastURL);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async remainHttp(data: ICommentRequestInfo): Promise<ICommentResponse<T> | null> {
		try {
			// remainURL e.g. 'productionplanning/common/logreport/remain/logsForEngTask?mainItemId=1&parentLogId=2'
			//                'productionplanning/common/logreport/remain/logsForPpsItem?itemId=1&parentLogId=2'
			const itemId = data.ParentItemId;
			const parentLogId = data.ParentCommentId;
			let remainURL = `productionplanning/common/logreport/remain/${this.endRead}${itemId}`;
			if (parentLogId) {
				remainURL = remainURL + `&parentLogId=${parentLogId}`;
			}
			return await this.http.get<ICommentResponse<T>>(remainURL);
		} catch (error) {
			console.error('Http Error:', error);
		}
		return null;
	}

	protected override async deleteHttp(itemToDelete: T, data: ICommentRequestInfo): Promise<void> {
		const deleteURL = 'productionplanning/common/log/deletecomment';
		try {
			await this.http.post(deleteURL, data);
		} catch (error) {
			console.error('Http Error:', error);
		}
	}

}
