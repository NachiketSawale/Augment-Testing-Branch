/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnInit } from '@angular/core';
import { SelectionStatementFilterScope } from '../../../model/selection-statement-filter-scope';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemSelectionStatementHelperService } from '../../../service/helper/construction-system-selection-statement-helper.service';
import { SelectionStatementSearchType } from '../../../model/enums/selection-statement-search-type.enum';

@Component({
	selector: 'constructionsystem-common-enhanced-filter',
	templateUrl: './enhanced-filter.component.html',
	styleUrls: ['./enhanced-filter.component.scss'],
})
export class EnhancedFilterComponent extends ContainerBaseComponent implements OnInit {
	private readonly constructionSystemSelectionStatementHelperService = ServiceLocator.injector.get(ConstructionSystemSelectionStatementHelperService);

	@Input()
	public scope!: SelectionStatementFilterScope;

	public ngOnInit() {
		this.scope.searchType = SelectionStatementSearchType.Enhanced;
		this.constructionSystemSelectionStatementHelperService.refreshToolBar(this.uiAddOns.toolbar);
		this.scope.onParentSelectionChanged();
		this.scope.mainDataService.selectionChanged$.subscribe(() => {
			this.scope.onParentSelectionChanged();
		});
	}
}
