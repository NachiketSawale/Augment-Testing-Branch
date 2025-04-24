/*
 * Copyright(c) RIB Software GmbH
 */
import { IMaterialFilterOutput } from '../../model';
import { PlatformTranslateService } from '@libs/platform/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';

/**
 * Material filter result preview component
 */
@Component({
	selector: 'basics-shared-material-filter-result-toolbar',
	templateUrl: './material-filter-result-toolbar.component.html',
	styleUrl: './material-filter-result-toolbar.component.scss',
})
export class BasicsSharedMaterialFilterResultToolbarComponent implements OnInit, OnDestroy {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly materialText = this.translateService.instant('basics.material.record.material').text;

	/**
	 * Filter output
	 */
	@Input()
	public output?: IMaterialFilterOutput;

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

	/**
	 * Get title
	 */
	public getGridTitle() {
		if (!this.output?.MaterialsFound) {
			return this.materialText;
		}

		const countStr = this.output?.HasMoreMaterials ?
			this.output.MaterialsFound.toString() + '+' :
			this.output.MaterialsFound.toString();
		return `${this.materialText} (${countStr})`;
	}
}