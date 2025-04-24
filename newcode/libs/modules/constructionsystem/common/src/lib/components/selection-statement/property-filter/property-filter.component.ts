/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken, Injector, Input, OnInit, Type } from '@angular/core';
import { SelectionStatementFilterScope } from '../../../model/selection-statement-filter-scope';
import { IPropertyFilterEntity } from '../../../model/entities/selection-statement/property-filter-entity.interface';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { PropertyFilterGridComponent } from '../property-filter-grid/property-filter-grid.component';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { ConstructionSystemCommonSelectionStatementPropertyFilterLayout } from '../../../service/layouts/construction-system-common-selection-statement-property-filter-layout.service';
import { ConstructionSystemCommonPropertyFilterGridDataService } from '../../../service/selection-statement/construction-system-common-property-filter-grid-data.service';
import { ConstructionSystemCommonPropertyFilterValidationService } from '../../../service/validations/construction-system-common-property-filter-validation.service';
import { SelectionStatementSearchType } from '../../../model/enums/selection-statement-search-type.enum';
import { PlatformTranslateService } from '@libs/platform/common';
import { CosTreePartMode } from '../../../model/enums/cos-tree-part-mode.enum';

@Component({
	selector: 'constructionsystem-common-property-filter',
	templateUrl: './property-filter.component.html',
	styleUrls: ['./property-filter.component.scss'],
})
export class PropertyFilterComponent extends ContainerBaseComponent implements OnInit {
	private readonly translationService = inject(PlatformTranslateService);
	private readonly gridService = inject(ConstructionSystemCommonPropertyFilterGridDataService);
	private injector = inject(Injector);
	public subInjector!: Injector;
	public propertyFilterGridComponent: Type<unknown> | null = null;
	@Input()
	public scope!: SelectionStatementFilterScope;
	public matchOptions = {
		items: [
			{
				id: 1,
				uiDisplayName: this.translationService.instant('cloud.common.FilterUi_MatchAll').text,
			},
			{
				id: 2,
				uiDisplayName: this.translationService.instant('cloud.common.FilterUi_MatchAny').text,
			},
		],
		valueMember: 'id',
		displayMember: 'uiDisplayName',
	};

	private initCustomComponent() {
		this.subInjector = Injector.create({
			parent: this.injector,
			providers: [
				{
					provide: new EntityContainerInjectionTokens<IPropertyFilterEntity>().layoutConfigurationToken,
					useFactory: () => new ConstructionSystemCommonSelectionStatementPropertyFilterLayout<IPropertyFilterEntity>().generateLayout(),
				},
				{
					provide: new EntityContainerInjectionTokens<IPropertyFilterEntity>().dataServiceToken,
					useExisting: ConstructionSystemCommonPropertyFilterGridDataService,
				},
				{
					provide: new EntityContainerInjectionTokens<IPropertyFilterEntity>().validationServiceToken,
					useExisting: ConstructionSystemCommonPropertyFilterValidationService,
				},
				{
					provide: SELECTION_STATEMENT_SCOPE,
					useValue: this.scope,
				},
			],
		});
		this.propertyFilterGridComponent = PropertyFilterGridComponent;
	}

	public onValueChange() {
		this.scope.onSave2SelectionStatement();
	}
	public ngOnInit(): void {
		this.scope.searchType = SelectionStatementSearchType.Property;
		this.initCustomComponent();
		this.scope.onParentSelectionChanged();
		this.scope.mainDataService.selectionChanged$.subscribe(() => {
			this.scope.onParentSelectionChanged();
		});
		this.gridService.onPropertyFilterChanged.subscribe((items) => {
			this.scope.onSave2SelectionStatement();
		});
	}

	protected readonly CosTreePartMode = CosTreePartMode;
}
/**
 * injection token of selection statement scope
 */
export const SELECTION_STATEMENT_SCOPE = new InjectionToken<SelectionStatementFilterScope>('selection_statement_scope');
