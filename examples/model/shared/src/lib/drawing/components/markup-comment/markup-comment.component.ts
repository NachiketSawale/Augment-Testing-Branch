/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { ModelSharedMarkupReadonlyService } from '../../services/drawing-markup-readonly.service';
import { DrawingMarkupEntity } from '../../model/drawing-markup-entity';

@Component({
	selector: 'model-shared-markup-comment',
	templateUrl: './markup-comment.component.html',
	styleUrls: ['./markup-comment.component.scss']
})
export class ModelSharedMarkupCommentComponent {
	protected readonly markupService = inject(ModelSharedMarkupReadonlyService);

	protected deleteAllMarker() {
		this.markupService.currentMarkups.forEach(markup => {
			this.markupService.deleteMarkup(markup);
		});
	}

	protected closeView() {
		// TODO Close this dialog when statusBar ok
		console.log('closeView');
	}

	protected select(entity: DrawingMarkupEntity) {
		this.markupService.selectMarkup(entity.MarkerId);
	}

	protected deleteMarkup(entity: DrawingMarkupEntity) {
		this.markupService.deleteMarkup(entity);
	}
}