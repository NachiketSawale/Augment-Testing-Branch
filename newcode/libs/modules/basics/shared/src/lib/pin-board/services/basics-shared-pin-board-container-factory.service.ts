/*
 * Copyright(c) RIB Software GmbH
 */

import { PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN, IPinBoardContainerCreationOptions } from '../model/interfaces/pin-board-container-creation-option.interface';
import { ContainerDefinition } from '@libs/ui/container-system';
import { BasicsSharedCommentViewerComponent } from '../components/comment-viewer/comment-viewer.component';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { EntityBase, IEntityIdentification } from '@libs/platform/common';
import { CommentType } from '../model/enum/comment-type.enums';

export class PinBoardContainerFactory {
	public static create<T extends IEntityIdentification & EntityBase, PT extends IEntityIdentification>(options: IPinBoardContainerCreationOptions<T, PT>) {
		options.commentType ??= CommentType.Standard;
		return new ContainerDefinition({
			uuid: options.uuid,
			permission: options.permission ?? options.uuid,
			title: options.title ?? { key: 'basics.common.commentContainerTitle' },
			containerType: BasicsSharedCommentViewerComponent<T, PT>,
			providers: [
				{ provide: new EntityContainerInjectionTokens<PT>().dataServiceToken, useExisting: options.parentServiceToken },
				{ provide: PIN_BOARD_CONTAINER_CREATION_OPTION_TOKEN, useValue: options },
			],
		});
	}
}
