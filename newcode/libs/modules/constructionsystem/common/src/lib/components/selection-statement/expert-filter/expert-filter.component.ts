/*
 * Copyright(c) RIB Software GmbH
 */
import { ServiceLocator } from '@libs/platform/common';
import { Component, Input, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { SelectionStatementFilterScope } from '../../../model/selection-statement-filter-scope';
import { ConstructionSystemSelectionStatementHelperService } from '../../../service/helper/construction-system-selection-statement-helper.service';
import { SelectionStatementSearchType } from '../../../model/enums/selection-statement-search-type.enum';
import { CosTreePartMode } from '../../../model/enums/cos-tree-part-mode.enum';

@Component({
	selector: 'constructionsystem-common-expert-filter',
	templateUrl: './expert-filter.component.html',
	styleUrls: ['./expert-filter.component.scss'],
})
export class ExpertFilterComponent extends ContainerBaseComponent implements OnInit {
	private readonly constructionSystemSelectionStatementHelperService = ServiceLocator.injector.get(ConstructionSystemSelectionStatementHelperService);

	@Input()
	public scope!: SelectionStatementFilterScope;

	public ngOnInit(): void {
		this.scope.searchType = SelectionStatementSearchType.Expert;
		this.constructionSystemSelectionStatementHelperService.refreshToolBar(this.uiAddOns.toolbar);
		this.scope.onParentSelectionChanged();
		this.scope.mainDataService.selectionChanged$.subscribe(() => {
			this.scope.onParentSelectionChanged();
		});
	}

	protected readonly CosTreePartMode = CosTreePartMode;
}
