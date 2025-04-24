/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Injector, Type } from '@angular/core';
import { Orientation } from '@libs/platform/common';
import { GridContainerBaseComponent, IGridContainerLink, ISplitGridSplitter, UiBusinessBaseEntityContainerMenulistHelperService } from '@libs/ui/business-base';
import { ISelectionStatementContainerConfig, SelectionStatementContainerConfigToken } from '../../../containers/selection-statement/interfaces/selection-statement-container-config.interface';

/**
 * The container component for extension standard entity-based grid containers
 */
@Component({
	selector: 'estimate-main-selection-statement-container',
	templateUrl: './selection-statement-container.component.html',
	styleUrl: './selection-statement-container.component.scss',
})
export class SelectionStatementContainerComponent<T extends object> extends GridContainerBaseComponent<T, IGridContainerLink<T>> {
	private readonly injector = inject(Injector);
	/**
	 *  injector for custom component
	 */
	public subInjector!: Injector;
	private readonly treeConfiguration = inject(this.injectionTokens.treeConfigurationToken, { optional: true });
	private readonly selectionStatementContainerConfig = inject<ISelectionStatementContainerConfig>(SelectionStatementContainerConfigToken);

	protected splitter: ISplitGridSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [70, 30],
	};
	public rightComponent?: Type<unknown>;

	protected loading = false;

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();

		this.containerLink = this.createGridContainerLink();

		this.generateGridColumns();

		const menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);
		this.uiAddOns.toolbar.addItems(menulistHelperSvc.createListMenuItems(this.containerLink));

		this.attachToEntityServices();

		// TODO - How to reuse the tree grid configuration and behaviors in future.
		if (this.treeConfiguration) {
			this.config.treeConfiguration = {
				parent: (entity) => this.retrieveEntityParent(entity),
				children: (entity) => this.retrieveEntityChildren(entity),
				...this.treeConfiguration,
			};
		}

		this.initCustomBehavior();

		this.initCustomComponent();
	}

	/**
	 * init header and footer component
	 */
	private initCustomComponent() {
		const providers = this.selectionStatementContainerConfig.providers;
		this.subInjector = Injector.create({
			parent: this.injector,
			providers: providers ? providers : [],
		});
		this.rightComponent = this.selectionStatementContainerConfig.rightContainerType;
	}
}
