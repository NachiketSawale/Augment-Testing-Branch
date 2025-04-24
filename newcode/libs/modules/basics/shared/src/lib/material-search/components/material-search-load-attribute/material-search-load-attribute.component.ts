/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {
  IMaterialAttributeLoadEntity,
  IMaterialAttributeNodeLoadEntity,
  IMaterialAttributeValueLoadEntity
} from '../../model/interfaces/material-search-attribute-load.interface';
import * as _ from 'lodash';

/**
 * material search attribute loading component
 */
@Component({
  selector: 'basics-shared-material-search-load-attribute',
  templateUrl: './material-search-load-attribute.component.html',
  styleUrls: ['./material-search-load-attribute.component.scss']
})
export class BasicsSharedMaterialSearchLoadAttributeComponent implements OnChanges{
  /**
   * attributes from material search http
   */
  @Input()
  public attributes!: IMaterialAttributeLoadEntity[];

  /**
   * attribute load finish
   */
  @Input()
  public finish: boolean = false;

  /**
   * filter attribute event for parent component
   */
  @Output()
  public filterAttribute = new EventEmitter<IMaterialAttributeLoadEntity[]>();

  /**
   * load more attribute function
   */
  @Output()
  public loadMore = new EventEmitter<IMaterialAttributeNodeLoadEntity>();

  /**
   * material attribute nodes
   */
  public nodes: IMaterialAttributeNodeLoadEntity[] = [];

  /**
   * current material attributes
   * @private
   */
  private currentAttributes: IMaterialAttributeLoadEntity[] = [];

  /**
   * onchange
   * @param changes
   */
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['attributes']) {
      this.nodes = this.buildTree();
    }
  }

  /**
   * build material attribute tree
   * @private
   */
  private buildTree(): IMaterialAttributeNodeLoadEntity[] {
    let nodes:IMaterialAttributeNodeLoadEntity[] = [];
    this.currentAttributes = _.unionWith(this.currentAttributes, this.attributes, _.isEqual);
    const attrubteGroups = _.groupBy(this.currentAttributes, item =>
        item.Property.toLowerCase()
    );
    const currentFinishedProperties = this.currentFinishedNodeProperties();
    for (const property in attrubteGroups) {
      const values = _.sortBy(_.uniqBy(attrubteGroups[property], 'Value'), 'Value').map(p => p.Value);
      nodes.push({
        property: property,
        values: this.buildNodeValue(values, property),
        finish: _.includes(currentFinishedProperties, property)
      });
    }
    nodes = _.sortBy(nodes, 'property');
    return nodes;
  }

  /**
   * build attribute node values
   * @private
   */
  private buildNodeValue(values:string[], property:string):IMaterialAttributeValueLoadEntity[] {
    const result:IMaterialAttributeValueLoadEntity[] = [];
    const checkedValue = this.currentCheckedValues(property);
    values.forEach(v => {
      result.push({
        value: v,
        checked: _.includes(checkedValue, v)
      });
    });
    return result;
  }

  /**
   * load more attribute function
   * @param property
   */
  public loadMoreFn(property?: string) {
    const node = property ? this.nodes.find(n => n.property === property) : undefined;
    this.loadMore.emit(node);
  }

  /**
   * filter change
   */
  public onFilterChanged() {
    const filterResult:IMaterialAttributeLoadEntity[] = [];
    this.nodes.forEach(n => {
      n.values.forEach(v => {
        if (v.checked) {
          filterResult.push({
            Property: n.property,
            Value: v.value
          });
        }
      });
    });
    this.filterAttribute.emit(filterResult);
  }

  /**
   * get current Checked Values
   * @param property
   * @private
   */
  private currentCheckedValues(property:string): string[] {
    const currentNode = this.nodes.find(n => {
      return n.property.toLowerCase() === property.toLowerCase();
    });

    return currentNode ? currentNode.values.filter(i => i.checked).map(e => e.value) : [];
  }

  /**
   * get current Finished Node Property names
   * @private
   */
  private currentFinishedNodeProperties(): string[] {
    return this.nodes.filter(n => {
      return n.finish;
    }).map(e => e.property);
  }

}
