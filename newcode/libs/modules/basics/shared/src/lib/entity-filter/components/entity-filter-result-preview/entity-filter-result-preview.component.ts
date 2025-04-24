/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { IFormConfig } from '@libs/ui/common';
import { isNil } from 'lodash';
import { IEntityFilterResultPreviewConfig } from '../../model';

/**
 * Entity Filter Result preview Component
 * Previews each item in a form.
 */
@Component({
	selector: 'basics-shared-entity-filter-result-preview',
	templateUrl: './entity-filter-result-preview.component.html',
	styleUrl: './entity-filter-result-preview.component.scss'
})
export class BasicsSharedEntityFilterResultPreviewComponent<TEntity extends IEntityIdentification> implements OnInit, OnChanges {
	private readonly injector = inject(Injector);

	/**
	 * Preview header component injector
	 */
	public headerInjector!: Injector;

	/**
	 * Preview option
	 */
	@Input()
	public previewOption!: IEntityFilterResultPreviewConfig<TEntity>;

	/**
	 * Preview item
	 */
	@Input()
	public previewItem?: TEntity;

	/**
	 * Preview form config
	 */
	public formConfig: IFormConfig<TEntity> = {
		rows: []
	};

	/**
	 * Initialization
	 */
	public ngOnInit() {
		if (this.hasHeaderComponent) {
			this.headerInjector = this.getHeaderInjector();
		}

		this.formConfig.rows = this.previewOption.formRows;
	}

	/**
	 * Call it whenever one or more data-bound input properties change.
	 * @param changes
	 */
	public async ngOnChanges(changes: SimpleChanges) {
		if (changes['previewItem']) {
			if (this.hasHeaderComponent) {
				this.headerInjector = this.getHeaderInjector();
			}

			if (this.previewOption.onPreviewItemChanged) {
				await this.previewOption.onPreviewItemChanged(this.previewItem);
			}
		}
	}

	/**
	 * Whether it has header component
	 */
	public get hasHeaderComponent() {
		return !isNil(this.previewOption.headerComponent);
	}

	private getHeaderInjector() {
		return Injector.create({
			parent: this.injector,
			providers: [{provide: this.previewOption.headerComponentToken, useValue: {previewItem: this.previewItem, previewCustomConfig: this.previewOption.previewCustomConfig}}]
		});
	}
}