/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { GridContainerBaseComponent } from '../grid-container-base/grid-container-base.component';

import { ITreeContainerLink } from '../../model/tree-container-link.interface';

import { UiBusinessBaseEntityContainerMenulistHelperService } from '../../services/entity-container-menulist-helper.service';

import { IEntityCreateChild } from '@libs/platform/data-access';
import { IParentMenuItem } from '@libs/ui/common';



/**
 * The container component for standard entity-based tree grid containers.
 */
@Component({
	selector: 'ui-business-base-tree-container',
	templateUrl: '../grid-container-base/grid-container-base.component.html'
})
export class TreeContainerComponent<T extends object> extends GridContainerBaseComponent<T, ITreeContainerLink<T>> implements AfterViewInit, OnDestroy {

	private readonly treeConfiguration = inject(this.injectionTokens.treeConfigurationToken);

	private readonly menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);


	/**
	 * Used to stored subscriptions.
	 */
	private subscription: Subscription[] = [];

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();

		// It is impossible to access the outer object without a reference.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const cnt = this;

		const cntLink = this.createGridContainerLink() as ITreeContainerLink<T>;
		cntLink.expand = (node: T) => {
			cnt.gridHost?.expand(node);
		};
		cntLink.collapse = (node: T) => {
			cnt.gridHost?.collapse(node);
		};
		cntLink.expandAll = (level?: number) => {
			cnt.gridHost?.expandAll(level);
		};
		cntLink.collapseAll = () => {
			cnt.gridHost?.collapseAll();
		};

		Object.assign(cntLink, {
			get entityCreateChild(): IEntityCreateChild<T> | undefined {
				return cnt.entityCreateChild;
			},
		});

		this.containerLink = cntLink;

		this.generateGridColumns();

		this.uiAddOns.toolbar.addItems(this.menulistHelperSvc.createTreeMenuItems(this.containerLink, this.loadEntitySchema(), this.entityValidationService, this.layout));

		this.attachToEntityServices();
		this.config.treeConfiguration = {
			parent: entity => this.retrieveEntityParent(entity),
			children: entity => this.retrieveEntityChildren(entity),
			...this.treeConfiguration
		};

		this.initCustomBehavior();

	}


	public override ngAfterViewInit() {
		super.ngAfterViewInit();
		this.getMaxTreeLevel();
		this.setActiveLevel();
	}

	/**
	 * Used to get maxLevel on treeLevelChanged event and update
	 * dropdown based on maxLevel.
	 */
	public getMaxTreeLevel() {
		let maxLevel: number = 0;
		maxLevel = this.gridHost?.getMaxTreeLevel() as number;
		if (maxLevel !== 0 && this.containerLink) {
			this.menulistHelperSvc.addToolbarItemsForTreeLevelGrid(this.containerLink, maxLevel);
		}

		const maxTreeSubscription = this.gridHost?.treeLevelChanged.subscribe((level) => {
			if (this.containerLink) {
				this.menulistHelperSvc.addToolbarItemsForTreeLevelGrid(this.containerLink, level);
			}

		}) as Subscription;
		this.subscription.push(maxTreeSubscription);
	}

	/**
	 * Used to expand collpase in grid for active level when select
	 * items in grid.
	 */
	public setActiveLevel() {
		const activeLevelSubscription = this.gridHost?.itemsChanged.subscribe((data) => {
			if (this.containerLink) {
				const toolbarData = this.menulistHelperSvc.getUpdatedToolbar(this.containerLink);
				if (toolbarData) {
					const activeLevel = (toolbarData as IParentMenuItem).list.activeValue;
					this.menulistHelperSvc.treeLevelContainer.setSelectedTreeLevel(activeLevel as string, this.containerLink, toolbarData);
				}
			}

		});
		this.subscription.push(activeLevelSubscription as Subscription);
	}


	public override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.subscription.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
