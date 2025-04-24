/*
 * Copyright(c) RIB Software GmbH
 */

import { isString } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { BasicsSharedEntityFilterBase } from '../entity-filter-base/entity-filter-base';
import { IEntityIdentification } from '@libs/platform/common';

@Component({
	selector: 'basics-shared-entity-filter-boolean',
	templateUrl: './entity-filter-boolean.component.html',
	styleUrl: './entity-filter-boolean.component.scss',
})
export class BasicsSharedEntityFilterBooleanComponent<TEntity extends IEntityIdentification> extends BasicsSharedEntityFilterBase<boolean, TEntity> implements OnInit {
	public ngOnInit() {
		this.initialize();
		this.definition.Operator = this.EntityFilterOperator.Equals;
	}

	protected override apply() {
		if (isString(this.definition.Factors![0])) {
			this.definition.Factors![0] = Number(this.definition.Factors![0]);
		}
		super.apply();
	}
}
