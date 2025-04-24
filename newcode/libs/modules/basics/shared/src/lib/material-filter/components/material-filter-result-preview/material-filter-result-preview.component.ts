/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IMaterialSearchEntity } from '../../../material-search';

/**
 * Material filter result preview component
 */
@Component({
	selector: 'basics-shared-material-filter-result-preview',
	templateUrl: './material-filter-result-preview.component.html',
	styleUrl: './material-filter-result-preview.component.scss',
})
export class BasicsSharedMaterialFilterResultPreviewComponent implements OnInit, OnDestroy {

	/**
	 * Preview material item
	 */
	@Input()
	public previewItem: IMaterialSearchEntity | null = null;

	/**
	 * initialization
	 */
	public ngOnInit(): void {
	}

	/**
	 * Destroy
	 */
	public ngOnDestroy(): void {
	}
}