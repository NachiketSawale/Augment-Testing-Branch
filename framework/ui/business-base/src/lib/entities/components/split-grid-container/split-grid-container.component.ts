/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Injector, ViewChild } from '@angular/core';
import { GridComponent, IGridConfiguration, IResizeOptions } from '@libs/ui/common';
import { KeyboardCode, Orientation } from '@libs/platform/common';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';

import { GridContainerBaseComponent } from '../grid-container-base/grid-container-base.component';
import {
  UiBusinessBaseEntityContainerMenulistHelperService
} from '../../services/entity-container-menulist-helper.service';
import {
  SplitGridConfigurationToken,
  ISplitGridConfiguration
} from '../../model/split-grid-configuration.interface';
import { ISplitGridContainerLink, ISplitGridSplitter } from '../../model/split-grid-container-link.interface';

/**
 * The generic split grid container with parent grid area and splitter in one container
 */
@Component({
  templateUrl: './split-grid-container.component.html',
  styleUrl: './split-grid-container.component.css'
})
export class SplitGridContainerComponent<T extends object, TP extends object> extends GridContainerBaseComponent<T, ISplitGridContainerLink<T, TP>> {

  private readonly injector = inject(Injector);
  private readonly splitConfig = inject<ISplitGridConfiguration<T, TP>>(SplitGridConfigurationToken);
  private readonly treeConfiguration = inject(this.injectionTokens.treeConfigurationToken, { optional: true });

  protected searchService = this.splitConfig.searchServiceToken ? this.injector.get(this.splitConfig.searchServiceToken) : undefined;

  /**
   * Override due to there are 2 grid components here
   * @protected
   */
  @ViewChild('gridHost')
  protected gridHostComponent: GridComponent<T> | undefined;

  /**
   * The parent grid host
   * @protected
   */
  @ViewChild('parentGridHost')
  protected parentGridHost: GridComponent<TP> | undefined;

  /**
   * Splitter configuration
   * @protected
   */
  protected splitter: ISplitGridSplitter = {
    direction: Orientation.Horizontal,
    areaSizes: [40, 60]
  };

  /**
   * Splitter resize options
   */
  protected resizeOptions: IResizeOptions = {
    handler: {
      execute: () => {
        this.gridHost?.resizeGrid();
        this.parentGridHost?.resizeGrid();
      }
    }
  };

  /**
   * Parent grid configuration
   * @protected
   */
  protected parentGridConfig: IGridConfiguration<TP> = {
    uuid: this.splitConfig.parent.uuid,
    columns: this.splitConfig.parent.columns,
    treeConfiguration: this.splitConfig.parent.treeConfiguration
  };

  /**
   * Handle parent grid entity selection
   * @protected
   */
  protected get parentSelection(): IEntitySelection<TP> {
    return <IEntitySelection<TP>>this.resolveParentDataService();
  }

  /**
   * Handle parent grid list
   * @protected
   */
  protected get parentList(): IEntityList<TP> {
    return <IEntityList<TP>>this.resolveParentDataService();
  }

  /**
   * It is allowed to provide parent data service provider token or instance itself.
   * @private
   */
  private resolveParentDataService() {
    if (this.splitConfig.parent.dataService) {
      return this.splitConfig.parent.dataService;
    }

    if (this.splitConfig.parent.dataServiceToken) {
      return this.injector.get(this.splitConfig.parent.dataServiceToken);
    }

    throw new Error('Parent data service is undefined!');
  }

  private readonly onContainerSizeChanged = () => {
    this.parentGridHost?.resizeGrid();
  };

  /**
   * Initializes a new instance.
   */
  public constructor() {
    super();

    this.containerLink = this.createGridContainerLink();
    this.generateGridColumns();
    const menulistHelperSvc = inject(UiBusinessBaseEntityContainerMenulistHelperService);
    this.uiAddOns.toolbar.addItems(menulistHelperSvc.createListMenuItems(this.containerLink));
    this.uiAddOns.resizeMessenger.register(this.onContainerSizeChanged);
    this.registerFinalizer(() => this.uiAddOns.resizeMessenger.unregister(this.onContainerSizeChanged));

    this.attachToParentEntityServices();
    this.attachToEntityServices();

    // TODO - How to reuse the tree grid configuration and behaviors in future.
    if (this.treeConfiguration) {
      this.config.treeConfiguration = {
        parent: entity => this.retrieveEntityParent(entity),
        children: entity => this.retrieveEntityChildren(entity),
        ...this.treeConfiguration
      };
    }

    this.initCustomBehavior();
  }

  /**
   * Override to return ISplitGridContainerLink<T, TP>
   * @protected
   */
  protected override createGridContainerLink(): ISplitGridContainerLink<T, TP> {
    // It is impossible to access the outer object without a reference.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return {
      ...super.createGridContainerLink(),
      get splitter() {
        return that.splitter;
      },
      set splitter(value) {
        this.splitter = value;
      },
      parentGrid: {
        get uuid(): string {
          return that.splitConfig.parent.uuid;
        },
        get config(): IGridConfiguration<TP> {
          return that.parentGridConfig;
        },
        set config(value: IGridConfiguration<TP>) {
          that.parentGridConfig = value;
        },
        get data(): TP[] | undefined {
          return that.parentGridConfig.items;
        },
        set data(value: TP[]) {
          that.parentGridConfig = {
            ...that.parentGridConfig,
            items: value
          };
        },
        get entitySelection(): IEntitySelection<TP> {
          return that.parentSelection;
        },
        get entityList(): IEntityList<TP> | undefined {
          return that.parentList;
        }
      }
    };
  }

  /**
   * Attaches the container to the parent entity services
   */
  protected attachToParentEntityServices() {
    if (this.parentList) {
      this.parentGridConfig = {
        ...this.parentGridConfig,
        items: this.parentList.getList()
      };
      const listSubscription = this.parentList.listChanged$.subscribe(items => {
        this.parentGridConfig = {
          ...this.parentGridConfig,
          items: items
        };
      });
      this.registerFinalizer(() => listSubscription.unsubscribe());
    }

    if (this.parentSelection) {
      const selectionSubscription = this.parentSelection.selectionChanged$.subscribe(entities => {
        if (this.parentGridHost !== undefined) {
          this.parentGridHost.selection = entities;
        }
      });
      this.registerFinalizer(() => selectionSubscription.unsubscribe());
    }
  }

  /**
   * Used to pass the selected parent entity from the grid to the dataservice
   * @param selectedRows
   */
  public onParentChanged(selectedRows: TP[]) {
    this.parentSelection.select(selectedRows);
  }

  /**
   * Handle search input key down, trigger search action when Enter key is down.
   * @param event 
   */
  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.searchService) {
      throw new Error('searchService is undefined');
    }

    if (event.key === KeyboardCode.ENTER) {
      this.searchService.search();
    }
  }
}