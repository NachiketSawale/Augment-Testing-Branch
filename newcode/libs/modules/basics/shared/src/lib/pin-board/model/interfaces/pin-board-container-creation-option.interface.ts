/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySelection } from '@libs/platform/data-access';
import { IEntityBase, IEntityIdentification, INavigationBarControls, Translatable } from '@libs/platform/common';
import { InjectionToken, ProviderToken } from '@angular/core';
import { CommentType } from '../enum/comment-type.enums';
import { ICustomizedPinBoardOptions } from './customized-pin-board-option.interface';
import { BasicsSharedCommentDataServiceBase } from '../../services/basics-shared-comment-data-base.service';

export const PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN = new InjectionToken<IPinBoardContainerCreationOptions<IEntityIdentification & IEntityBase, IEntityIdentification & IEntityBase>>('COMMENT_OPTION_TOKEN');

/**
 * Creation options for creating a pin board container.
 */
export interface IPinBoardContainerCreationOptions<T extends IEntityIdentification & IEntityBase, PT extends IEntityIdentification & IEntityBase> {
	/**
	 * The unique ID of the pin board container.
	 */
	readonly uuid: string;

	/**
	 * The permission UUID of the container. If none is specified, the UUID will be used.
	 */
	readonly permission?: string;

	/**
	 * The human-readable title of the pin board container. Default 'basics.common.commentContainerTitle'.
	 */
	readonly title?: Translatable;

	/**
	 * Comment type. Default `CommentType.Standard`.
	 *
	 * If `commentType` is `CommentType.Customized`, please consider providing the `dataService` parameter as well.
	 */
	commentType?: CommentType;

	/**
	 * Qualifier
	 *
	 * The 'commentQualifier' is used as a parameter in the payload when calling pin board APIs.
	 *
	 * The parameter `commentQualifier` and the name of `parentDataService` are the keys
	 * used to store and query the instances of the comment data service.
	 */
	readonly commentQualifier: string;

	/**
	 * The injection token for the data service of the parent container.
	 */
	readonly parentServiceToken: ProviderToken<IEntitySelection<PT>>;

	/**
	 * Data service for the pin board container.
	 * It inherits from `BasicsSharedCommentDataServiceBase` and is responsible for handling comment data related to the Pin Board.
	 *
	 * This parameter is required if the `commentType` is set to `CommentType.Customized`.
	 *
	 * The parameter can accept either of the following forms:
	 * 1. A Class: A class that extends BasicsSharedCommentDataServiceBase. By providing the class itself, an instance of this service will be dynamically created when the Pin Board container is instantiated.
	 * 2. An Instance: A pre-instantiated instance of subclasses of `BasicsSharedCommentDataServiceBase`. This allows for pre-configured service instances to be used.
	 *
	 * Example Usage:
	 *
	 * ```typescript
	 * class NewCommentDataService extends BasicsSharedCommentDataServiceBase { ... }
	 *
	 * // provide the class as the parameter.
	 * const options: IPinBoardContainerCreationOptions = {
	 *   dataService: NewCommentDataService,
	 * }
	 *
	 * // provide the instance as the parameter.
	 * const options: IPinBoardContainerCreationOptions = {
	 *   dataService: new NewCommentDataService(), // inject(NewCommentDataService)
	 * }
	 * ```
	 */
	readonly dataService?: (new (options: IPinBoardContainerCreationOptions<T, PT>) => BasicsSharedCommentDataServiceBase<T, PT>) | BasicsSharedCommentDataServiceBase<T, PT>;

	/**
	 * The injection token for the data service of root container.
	 *
	 * If defined, when saving the comment entity, if the parent entity has not been saved,
	 * the parent entity will be saved first by `calling rootService.save()` method.
	 *
	 * Replaces the 'saveParentBefore' parameter on the AngularJS side.
	 */
	rootServiceToken?: ProviderToken<INavigationBarControls>;

	/**
	 * The number of comments displayed in one page is `pageSize`. Default 10.
	 */
	pageSize?: number;

	/**
	 * Whether to display the last page when the comment items are refreshed.
	 */
	readonly showLastComments?: boolean;

	/**
	 * If true, the pin board container will always be in read-only status,
	 * meaning it will only display comment items and will not allow adding or deleting comment items.
	 *
	 * If false, the pin board container will always be in editable status.
	 *
	 * If undefined, the status of the pin board container depends on the `parentService.isEntityReadOnly()` method.
	 */
	readonly isPinBoardReadonly?: boolean;

	/**
	 * The additional parameters for the non-standard pin boards.
	 */
	readonly customizedOptions?: ICustomizedPinBoardOptions;
}
