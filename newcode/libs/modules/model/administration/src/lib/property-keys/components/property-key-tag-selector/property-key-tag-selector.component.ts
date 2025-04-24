/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Component,
	DoCheck,
	inject
} from '@angular/core';
import {
	Observable,
	Subject
} from 'rxjs';
import { PlatformTranslateService } from '@libs/platform/common';
import { ControlContextInjectionToken } from '@libs/ui/common';
import { ModelAdministrationPropertyKeyTagSelectorDialogService } from '../../services/property-key-tag-selector-dialog.service';
import { ModelAdministrationPropertyKeyTagDataService } from '../../services/property-key-tag-data.service';

@Component({
	selector: 'model-administration-property-key-tag-selector',
	templateUrl: './property-key-tag-selector.component.html',
	styleUrls: ['./property-key-tag-selector.component.scss'],
})
export class PropertyKeyTagSelectorComponent implements DoCheck {

	private readonly translateSvc = inject(PlatformTranslateService);

	private readonly tagDataSvc = inject(ModelAdministrationPropertyKeyTagDataService);

	private readonly _displayText = new Subject<string>();

	private lastTagIds: number[] = [];

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		this._displayText.next('');
	}

	/**
	 * Returns the human-readable display text for all selected tags.
	 */
	public get displayText(): Observable<string> {
		return this._displayText;
	}

	private readonly context = inject(ControlContextInjectionToken);

	/**
	 * Reacts to changes to the selected tags.
	 */
	public ngDoCheck() {
		const newTagIds = this.currentTagIds;
		if (this.areTagIdsDifferent(newTagIds, this.lastTagIds)) {
			if (newTagIds.length > 0) {
				this._displayText.next(this.translateSvc.instant({key: 'model.administration.propertyKeys.tagsLoading'}).text);

				this.tagDataSvc.getDisplayTextForTagIds(this.currentTagIds).then(displayText => this._displayText.next(displayText));
			} else {
				this._displayText.next('');
			}
			this.lastTagIds = newTagIds;
		}
	}

	private areTagIdsDifferent(tagIds1: number[], tagIds2: number[]) {
		const set1 = new Set<number>(tagIds1);
		const set2 = new Set<number>(tagIds2);

		return set1.size !== set2.size || Array.from(set1.values()).some(tagId => !set2.has(tagId));
	}

	private get currentTagIds(): number[] {
		const rawVal = this.context.value;
		return Array.isArray(rawVal) ? (<number[]>rawVal.filter(v => typeof v === 'number')) : [];
	}

	/**
	 * Indicates whether the control is shown in read-only mode.
	 */
	public get readOnly(): boolean {
		return this.context.readonly;
	}

	private readonly tagSelectorDialogSvc = inject(ModelAdministrationPropertyKeyTagSelectorDialogService);

	/**
	 * Launches the tag selector.
	 */
	public async selectTags() {
		const newTagIds = await this.tagSelectorDialogSvc.showDialog({
			selectedTags: this.currentTagIds
		});
		if (newTagIds) {
			this.context.value = newTagIds;
		}
	}
}
