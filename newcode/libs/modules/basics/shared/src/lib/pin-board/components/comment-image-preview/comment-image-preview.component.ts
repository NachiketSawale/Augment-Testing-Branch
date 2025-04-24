/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken } from '@angular/core';
import { UiCommonModule } from '@libs/ui/common';

export const COMMENT_IMG_STR_TOKEN = new InjectionToken<string>('COMMENT_IMG_STR_TOKEN');

@Component({
	selector: 'basics-shared-comment-image-preview',
	templateUrl: './comment-image-preview.component.html',
	styleUrls: ['./comment-image-preview.component.scss'],
	standalone: true,
	imports: [UiCommonModule],
})
export class CommentImagePreviewComponent {
	public imageStr: string = '';

	public constructor() {
		this.imageStr = inject(COMMENT_IMG_STR_TOKEN);
	}
}
