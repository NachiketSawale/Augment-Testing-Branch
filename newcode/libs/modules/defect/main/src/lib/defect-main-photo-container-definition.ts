/*
 * Copyright(c) RIB Software GmbH
 */

import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedPhotoEntityViewerComponent, PHOTO_ENTITY_VIEWER_OPTION_TOKEN } from '@libs/basics/shared';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { runInInjectionContext } from '@angular/core';
import { DefectMainPhotoDataService } from './services/defect-main-photo-data.service';
import { IDfmPhotoEntity } from './model/entities/dfm-photo-entity.interface';

export class DefectMainPhotoContainerDefinition {
	private readonly definition = {
		uuid: 'c81d6b2b37d44ea1a328a9ca245b6a1c',
		id: 'defect.main.photo',
		title: {
			text: 'Defect Photo',
			key: 'defect.main.photoContainerTitle',
		},
		containerType: BasicsSharedPhotoEntityViewerComponent,
		permission: '01a52cc968494eacace7669fb996bc72',
		providers: [
			{
				provide: new EntityContainerInjectionTokens<IDfmPhotoEntity>().dataServiceToken,
				useExisting: DefectMainPhotoDataService,
			},
			{
				provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
				useValue: {
					isSingle: false,
					hasCommentTextField: true,
				},
			},
		],
	};

	public getDefinition() {
		return this.definition;
	}
}

export const DEFECT_MAIN_PHOTO_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () => new DefectMainPhotoContainerDefinition().getDefinition());
