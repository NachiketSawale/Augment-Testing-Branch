/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { MaterialSearchScope } from '../../model/material-search-scope';
import { PopupService } from '@libs/ui/common';
import { BasicsSharedMaterialStructureListComponent } from '../material-structure-list/material-structure-list.component';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IMaterialDefinitionsEntity } from '../../model/interfaces/material-definitions-entity.interface';

/**
 * Header of material search view, handle user input, sort and so on.
 */
@Component({
	selector: 'basics-shared-material-search-header',
	templateUrl: './material-search-header.component.html',
	styleUrls: ['./material-search-header.component.scss'],
})
export class BasicsSharedMaterialSearchHeaderComponent {
	/**
	 * Search scope
	 */
	@Input()
	public scope!: MaterialSearchScope;

	private readonly httpService = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);

	private readonly popupService = inject(PopupService);
	@ViewChild('btn_Structure') public btnMaterialStructure!: ElementRef;

	public showMaterialStructures() {
		this.popupService.toggle(this.btnMaterialStructure, BasicsSharedMaterialStructureListComponent, {
			showHeader: false,
			showFooter: true,
			hasDefaultWidth: true,
			resizable: true,
			width: 320,
			height: 430,
			providers: [{ provide: MaterialSearchScope, useValue: this.scope }],
		});
	}

	public ngOnInit() {
		this.httpService
			.get<{ FilterDef?: string | undefined }>('basics/material/getmaterialdefinitions', {
				params: { filterName: 'searchOptions' },
			})
			.then((res) => {
				const filterDef = (res.FilterDef ? JSON.parse(res.FilterDef) : []) as IMaterialDefinitionsEntity[];
				if (filterDef.length > 0) {
					this.scope.MaterialDefinition = filterDef[0];
					if (this.scope.MaterialDefinition.config.category.entity.Code) {
						this.scope.lookupTitle = this.scope.MaterialDefinition.config.category.entity.Code + ' ' + this.scope.MaterialDefinition.config.category.entity.DescriptionInfo?.Translated;
					} else {
						this.scope.lookupTitle = this.translate.instant('basics.common.entityPrcStructureFk').text;
					}
				}
			});
	}
}
