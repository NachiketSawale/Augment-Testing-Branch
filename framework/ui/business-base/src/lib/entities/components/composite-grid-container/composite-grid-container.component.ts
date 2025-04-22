/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, inject, Injector, Type} from '@angular/core';
import {GridContainerBaseComponent} from '../grid-container-base/grid-container-base.component';
import {UiBusinessBaseEntityContainerMenulistHelperService} from '../../services/entity-container-menulist-helper.service';
import {CompositeGridConfigurationToken, ICompositeGridConfiguration} from '../../model/composite-grid-configuration.interface';
import {Orientation} from '@libs/platform/common';
import {IGridContainerLink} from '../../model/grid-container-link.interface';

/**
 * The container component for extension standard entity-based grid containers
 */
@Component({
  templateUrl: './composite-grid-container.component.html',
  styleUrl: './composite-grid-container.component.css'
})
export class CompositeGridContainerComponent<T extends object> extends GridContainerBaseComponent<T, IGridContainerLink<T>> {
  private readonly injector = inject(Injector);
  private readonly compositeGridConfig = inject<ICompositeGridConfiguration>(CompositeGridConfigurationToken);
  public topLeftComponent?: Type<unknown>;
  public bottomRightComponent?: Type<unknown>;
  public flexDirection: Orientation = Orientation.Vertical;
  public maxTopLeftLength: string = 'auto';
  public maxBottomRightLength: string = 'auto';
  /**
   *  injector for custom component
   */
  public subInjector!: Injector;

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

    this.initCustomBehavior();

    this.initCustomComponent();
  }

  /**
   * init header and footer component
   */
  private initCustomComponent() {
    if (this.compositeGridConfig.direction) {
      this.flexDirection = this.compositeGridConfig.direction;
    }
    const providers = this.compositeGridConfig.providers;
    this.subInjector = Injector.create({
      parent: this.injector,
      providers: providers ? providers : []
    });

    const topLeftComponent = this.compositeGridConfig.topLeftContainerType;
    if (topLeftComponent) {
      this.topLeftComponent = topLeftComponent;
      if (this.compositeGridConfig.maxTopLeftLength) {
        this.maxTopLeftLength = this.compositeGridConfig.maxTopLeftLength.toString() + 'px';
      }
    }
    const bottomRightComponent = this.compositeGridConfig.bottomRightContainerType;
    if (bottomRightComponent) {
      this.bottomRightComponent = bottomRightComponent;
      if (this.compositeGridConfig.maxBottomRightLength) {
        this.maxBottomRightLength = this.compositeGridConfig.maxBottomRightLength.toString() + 'px';
      }
    }
  }
}

