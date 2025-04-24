/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { CollectionHelper, CompleteIdentification, IEntityBase, IEntityIdentification, IIdentificationData, INavigationBarControls, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { DataServiceHierarchicalLeaf, IDataServiceChildRoleOptions, IEntityRuntimeDataRegistry, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { ICommentEntityDescriptor, ICommentRequestInfo } from '../index';
import { ICommentResponse } from '../model/interfaces/response-entity.interface';
import { BlobsEntity } from '../../interfaces/entities';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import { IPinBoardContainerCreationOptions } from '../model/interfaces/pin-board-container-creation-option.interface';
import { differenceBy, forEach, get, set, toInteger } from 'lodash';
import { BasicsSharedStatusLookupService } from './basics-shared-status-lookup.service';
import { CommentType } from '../model/enum/comment-type.enums';
import { BasicsSharedCommentDataReadonlyProcessor } from './processors/basics-shared-comment-data-readonly-processor.service';

/**
 * The base class of comment data service.
 *
 * If the type of pin board container is `CommentType.Customized`,
 * a new comment data service needs to be created and inherit from this base class.
 *
 * @typeParam T - entity type handled by the comment data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export abstract class BasicsSharedCommentDataServiceBase<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>> extends DataServiceHierarchicalLeaf<T, PT, PU> {
	protected readonly http = inject(PlatformHttpService);

	public translate: PlatformTranslateService = inject(PlatformTranslateService);

	public option: IPinBoardContainerCreationOptions<T, PT>;

	public data: ICommentResponse<T> = { RootCount: 0, Clerks: [], Blobs: [] };

	public loginClerk: { Blob?: BlobsEntity; Clerk?: IBasicsClerkEntity } = {};

	public isLoading = false;

	public statusLookupService: BasicsSharedStatusLookupService<object> | undefined;

	private _parentDataService?: IEntitySelection<PT>;

	private _rootService?: INavigationBarControls | null;

	public constructor(options: IPinBoardContainerCreationOptions<T, PT>) {
		super({
			apiUrl: '',
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{ role: ServiceRole.Leaf, itemName: 'Comment', parent: inject(options.parentServiceToken) },
		});

		this.option = options;
		this.onInit(this.option);
		this.processor.addProcessor([new BasicsSharedCommentDataReadonlyProcessor(this)]);
	}

	public onInit(options: IPinBoardContainerCreationOptions<T, PT>) {
		this.option = options;
		if (this.option.commentType === CommentType.Customized) {
			const statusLookupQualifier = this.statusLookupQualifier ?? this.option.customizedOptions?.statusLookupQualifier;
			if (statusLookupQualifier) {
				this.statusLookupService = new BasicsSharedStatusLookupService(statusLookupQualifier);
			}
		}
	}

	protected getRootCount() {
		if (this.data.RootCount === null) {
			this.data.RootCount = 0;
		}
		return this.data.RootCount;
	}

	protected updateRootCount(value: number) {
		if (this.data.RootCount === null) {
			this.data.RootCount = 0;
		}
		return (this.data.RootCount += value);
	}

	public getComments() {
		return this.getList();
	}

	public getMainItem() {
		return this.parentDataService.getSelectedEntity();
	}

	public get parentDataService(): IEntitySelection<PT> {
		if (!this._parentDataService) {
			if (this.typedParent) {
				this._parentDataService = this.typedParent;
			} else {
				this._parentDataService = ServiceLocator.injector.get(this.option.parentServiceToken);
			}
		}
		return this._parentDataService;
	}

	public get rootService(): INavigationBarControls | null {
		if (this._rootService === undefined) {
			this._rootService = this.option.rootServiceToken ? ServiceLocator.injector.get(this.option.rootServiceToken) : null;
		}
		return this._rootService;
	}

	public get clerks() {
		if (!Array.isArray(this.data.Clerks)) {
			this.data.Clerks = [];
		}

		return this.data.Clerks;
	}

	protected set clerks(value: IBasicsClerkEntity[]) {
		this.data.Clerks = value;
	}

	public get blobs() {
		if (!Array.isArray(this.data.Blobs)) {
			this.data.Blobs = [];
		}
		return this.data.Blobs;
	}

	protected set blobs(value: BlobsEntity[]) {
		this.data.Blobs = value;
	}

	protected get saveEntityName() {
		return (this.option.customizedOptions?.itemName ?? 'CommentData') + 'ToSave';
	}

	/** Comment field name of response data from last URL or remain URL. Default 'Comments' */
	public abstract get completeItemName(): string;

	/** Some accessors for the comment fields. */
	public abstract get entityDescriptor(): ICommentEntityDescriptor<T>;

	/**
	 * Used as the parameter for comment status lookup.
	 * It only takes effect when 'commentType' is 'CommentType.Customized'.
	 * If defined, please define the 'entityDescriptor.statusAccessor' parameter as well.
	 */
	public get statusLookupQualifier(): string | undefined {
		return undefined;
	}

	/** Returns the parent entity id. */
	public getMainItemId(mainItem?: PT | null): number | undefined {
		return mainItem?.Id;
	}

	/** Loads comments data. */
	protected abstract lastHttp(mainItem: PT, request: ICommentRequestInfo): Promise<ICommentResponse<T> | null>;

	/** Loads all comments data. */
	protected abstract remainHttp(request: ICommentRequestInfo): Promise<ICommentResponse<T> | null>;

	/** Creates a comment entity. */
	protected abstract createHttp(mainItem: PT | null, request: ICommentRequestInfo): Promise<T | null>;

	/*** Send delete request to delete a comment in iTwo */
	protected abstract deleteHttp(itemToDelete: T, request: ICommentRequestInfo): Promise<void>;

	public getChildren(parent: T): Array<T> {
		const children = this.entityDescriptor.childrenAccessor.getValue(parent);
		if (Array.isArray(children)) {
			return children;
		} else {
			this.setChildren(parent, []);
			return this.entityDescriptor.childrenAccessor.getValue(parent) as Array<T>;
		}
	}

	public setChildren(parent: T, childEntities: Array<T>) {
		if (parent) {
			this.entityDescriptor.childrenAccessor.setValue(parent, childEntities || []);
		}
	}

	public addChildren(parent: T, childEntity: T) {
		if (parent) {
			const children = this.entityDescriptor.childrenAccessor.getValue(parent) as T[];
			children.push(childEntity);
			this.entityDescriptor.childrenAccessor.setValue(parent, children);
		}
	}

	public getChildCount(parent: T) {
		return this.entityDescriptor.childCountAccessor?.getValue(parent) ?? 0;
	}

	public setChildCount(parent: T, count: number) {
		if (parent && this.entityDescriptor.childCountAccessor) {
			this.entityDescriptor.childCountAccessor.setValue(parent, count);
		}
	}

	public getIsNew(comment: T) {
		return this.entityDescriptor.isNewAccessor.getValue(comment) ?? false;
	}

	public getIsVisible(comment: T) {
		return !!get(comment, 'isVisible');
	}

	public setIsVisible(comment: T, value: boolean) {
		set(comment, 'isVisible', value);
	}

	public getCommentId(comment: T) {
		return this.entityDescriptor.idAccessor.getValue(comment) as number;
	}

	protected clear() {
		this.data = { RootCount: 0, Clerks: [], Blobs: [] }; // clear data.
	}

	public override async load(identificationData: IIdentificationData) {
		this.clear();
		const mainItem = this.getMainItem();
		if (mainItem && mainItem?.Id === identificationData.pKey1) {
			if (this.getMainItemId(mainItem) !== undefined) {
				this.isLoading = true;
				const data: ICommentRequestInfo = {
					Qualifier: this.option.commentQualifier,
					ParentItemId: this.getMainItemId(mainItem),
				};

				const response = await this.lastHttp(mainItem, data);
				this.isLoading = false;
				if (response) {
					this.data = response;
					const commentEntities = (response[this.completeItemName] ?? []) as T[];
					this.markAsVisible(commentEntities);
					this.setList(commentEntities); // Trigger listChanged$ subscription.
				}
			}
		}

		this.processor.process(this.getComments());
		return this.getComments();
	}

	public async createComment(comment: string, parent: T | null, iconFk: number | null) {
		const mainItem = this.getMainItem();
		const mainItemId = this.getMainItemId(mainItem);

		if (mainItem && typeof mainItemId !== 'undefined' && comment) {
			this.isLoading = true;
			const data: ICommentRequestInfo = {
				Qualifier: this.option.commentQualifier,
				ParentItemId: mainItemId,
				Comment: comment,
				ParentCommentId: parent ? this.getCommentId(parent) : undefined,
				IsParentItemNew: mainItem.Version === 0,
				StatusIconFk: typeof iconFk == 'number' && iconFk == toInteger(iconFk) ? iconFk : 0,
			};

			if (this.rootService && mainItem.Version === 0) {
				await this.rootService.save(); // update main entity before saving comment entity.
			}

			const newItem = await this.createHttp(mainItem, data);
			if (newItem) {
				this.setIsVisible(newItem, true);
				if (this.getIsNew(newItem)) {
					this.setModified(newItem);
				}
				if (parent) {
					this.addChildren(parent, newItem);
					this.setChildCount(parent, this.getChildCount(parent) + 1);
				} else {
					this.append(newItem); // Trigger listChanged$ subscription.
					this.updateRootCount(1);
				}
				this.processor.process(newItem);
				this.isLoading = false;

				return newItem;
			}
		}
		return null;
	}

	public async deleteComment(itemToDelete: T, parent?: T) {
		this.isLoading = true;

		if (this.getIsNew(itemToDelete)) {
			this.removeModified(itemToDelete); // delete item from modifiedItems.
		} else {
			const mainItem = this.getMainItem();
			if (mainItem) {
				const data: ICommentRequestInfo = {
					Qualifier: this.option.commentQualifier,
					ParentItemId: this.getMainItemId(mainItem),
					CommentDataIdToDelete: itemToDelete.Id,
					CommentIdToDelete: this.getCommentId(itemToDelete),
				};
				await this.deleteHttp(itemToDelete, data); // delete item from database.
			}
		}

		const parentID = this.entityDescriptor.parentIdAccessor.getValue(itemToDelete);
		if (parentID && !parent) {
			const flattenComments = CollectionHelper.Flatten(this.getComments(), (parent: T) => {
				return this.getChildren(parent);
			});
			parent = flattenComments.filter((element) => {
				return this.getCommentId(element) === parentID;
			})[0];
		}

		const items = parent ? this.getChildren(parent) : this.getComments();
		const originalNum = items.length;
		CollectionHelper.RemoveFromWithComparer(itemToDelete, items, (item) => { // delete item from local cache.
			return item.Id === itemToDelete.Id ? 0 : -1;
		});

		if (items.length + 1 === originalNum) {
			if (parent) {
				this.setChildCount(parent, this.getChildCount(parent) - 1);
			} else {
				this.updateRootCount(-1);
			}
		}

		this.isLoading = false;
	}

	public sortByDate = (a: T, b: T) => {
		const accessor = this.entityDescriptor.insertedAtAccessor;
		let dateStrA, dateStrB;
		if (accessor) {
			dateStrA = accessor.getValue(a);
			dateStrB = accessor.getValue(b);
		}

		const dateA = dateStrA ? new Date(dateStrA) : new Date();
		const dateB = dateStrB ? new Date(dateStrB) : new Date();
		return dateA.getTime() - dateB.getTime();
	};

	public async viewDetail(parent?: T): Promise<T[]> {
		const dataSource = parent ? this.getChildren(parent) : this.getComments();
		const oldItems = dataSource.filter((item) => {
			return !this.getIsNew(item);
		});

		const length = parent ? this.getChildCount(parent) : this.getRootCount();
		if (dataSource.length === length) {
			forEach(oldItems, (item) => {
				this.setIsVisible(item, true);
			});
			return dataSource;
		}

		const parentItemId = this.getMainItemId(this.getMainItem());
		if (parentItemId === undefined) {
			return [];
		}

		const data: ICommentRequestInfo = {
			Qualifier: this.option.commentQualifier,
			ParentItemId: parentItemId,
			ParentCommentId: parent ? this.getCommentId(parent) : null,
		};

		this.isLoading = true;
		const response = await this.remainHttp(data);
		this.isLoading = false;
		if (response) {
			const commentEntities = (response[this.completeItemName] ?? []) as T[];
			this.markAsVisible(commentEntities);

			const clerkList = response.Clerks;
			const blobList = response.Blobs;
			const diffComments = differenceBy(commentEntities, dataSource, 'Id');
			const diffClerks = differenceBy(clerkList, this.clerks, 'Id');
			const diffBlobs = differenceBy(blobList, this.blobs, 'Id');
			dataSource.push(...diffComments);
			dataSource.sort(this.sortByDate);
			this.clerks = this.clerks.concat(diffClerks);
			this.blobs = this.blobs.concat(diffBlobs);

			this.processor.process(dataSource);
			return commentEntities;
		}

		return [];
	}

	public viewPartialLast(parent?: T): T[] {
		const defaultRootViewCount = 5;
		const defaultNodeViewCount = 3;

		const dataSource = parent ? this.getChildren(parent) : this.getComments();

		if (dataSource) {
			dataSource.sort(this.sortByDate);
			const lastViewCount = !parent ? defaultRootViewCount : defaultNodeViewCount;
			const length = dataSource.length;
			let index = 0;
			forEach(dataSource, (item) => {
				this.setIsVisible(item, length - index++ <= lastViewCount);
			});
		}

		return dataSource;
	}

	public detailInfo(parent?: T) {
		const result = { visible: false, count: 0 };
		let showItems = [];
		if (parent) {
			const children = this.getChildren(parent);

			showItems = children.filter((item) => {
				return this.getIsVisible(item);
			});
			if (showItems.length < this.getChildCount(parent)) {
				result.visible = true;
				result.count = this.getChildCount(parent);
			}
		} else {
			const roots = this.getComments();
			const rootLength = this.getRootCount();
			showItems = roots.filter((item) => {
				return this.getIsVisible(item);
			});
			if (showItems.length < rootLength) {
				result.visible = true;
				result.count = rootLength;
			}
		}
		return result;
	}

	public handleChildren(children: T[], action: (child: T) => void) {
		if (Array.isArray(children) && children.length > 0) {
			children.forEach((child) => {
				if (typeof action === 'function') {
					action(child);
				}
				this.handleChildren(this.getChildren(child), action);
			});
		}
	}

	protected markAsVisible(comments: T[]) {
		if (!Array.isArray(comments) || comments.length === 0) {
			return;
		}
		comments.forEach((item) => {
			this.setIsVisible(item, true);
			this.handleChildren(this.getChildren(item), (child) => {
				this.setIsVisible(child, true);
			});
		});
	}

	public async toggle(detailInfo: string, parentComment?: T) {
		if (detailInfo.startsWith('View')) {
			await this.viewDetail(parentComment);
		} else {
			this.viewPartialLast(parentComment);
		}

		return this.buildDetail(parentComment);
	}

	public async refreshLoginClerk() {
		const response = await this.http.get('basics/common/comment/loginclerkinfo');
		this.loginClerk = response as { Blob?: BlobsEntity; Clerk?: IBasicsClerkEntity };
	}

	public buildDetail(parent?: T, pageNum?: number, lastPageIndex?: number) {
		const detail = this.detailInfo(parent);

		if (pageNum !== undefined && lastPageIndex !== undefined && pageNum < lastPageIndex) {
			return '';
		}

		if (detail.visible) {
			return this.translate.instant('basics.common.pinboardLog.viewAll', { count: detail.count }).text;
		} else if ((parent && this.getChildCount(parent) > 3) || (!parent && this.getComments().length > 5)) {
			return 'basics.common.pinboardLog.showLatest';
		} else {
			return '';
		}
	}

	/* jshint -W083 */ // just follow Array api.
	public count(data?: T[]) {
		if (!data) {
			data = this.getComments();
		}

		let length = 0;
		const queue: T[] = [];

		if (Array.isArray(data)) {
			data.forEach((item) => {
				if (this.getIsVisible(item)) {
					queue.push(item);
				}
			});

			while (queue.length > 0) {
				const firstItem = queue.shift() as T;
				const children = this.getChildren(firstItem);

				length++;

				if (Array.isArray(children)) {
					children.forEach((child) => {
						if (this.getIsVisible(child)) {
							queue.push(child);
						}
					});
				}
			}
		}

		return length;
	}

	public isReadOnly() {
		let readonly = false;
		const selected = this.getMainItem();
		const parentService = this.parentDataService as unknown as IEntityRuntimeDataRegistry<PT>;
		const isPinBoardReadonly = this.option.isPinBoardReadonly;
		if (isPinBoardReadonly !== undefined) {
			readonly = isPinBoardReadonly;
		} else if (selected) {
			readonly = parentService.isEntityReadOnly(selected);
		}
		return readonly;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]) {
		if (modified.length > 0) {
			const mainItemId = this.entityDescriptor.mainItemIdAccessor.getValue(modified[0]);
			set(parentUpdate, 'MainItemId', mainItemId);
			set(parentUpdate, this.saveEntityName, modified);
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PU) {
		const commentToSave = get(complete, this.saveEntityName) as T[];
		if (Array.isArray(commentToSave)) {
			return commentToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: PT, entity: T): boolean {
		const mainItemId = this.entityDescriptor.mainItemIdAccessor.getValue(entity);
		return parentKey.Id === mainItemId;
	}
}
