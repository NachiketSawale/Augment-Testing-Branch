/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IChartData } from '../model/entities/chart/chart-data.interface';
import { IChartDataEntity } from '../model/entities/chart/chart-data-entity.interface';
import { IChartDataEvaluationComparingValue } from '../model/entities/chart/chart-data-evaluation.interface';
import { isArray } from 'lodash';
import { ICompositeItemEntity } from '../model/entities/item/composite-item-entity.interface';
import { ICompositeBoqEntity } from '../model/entities/boq/composite-boq-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PriceComparisonChartDataService {

	private data: IChartData = {
		entities: [],
	  quotes: [],
		context: {
			type: 'item',
			selected: null
		}
	};

	public getData() {
		return this.data;
	}

	public buildEntities(type: string, items: IChartDataEvaluationComparingValue[], selectedItem: ICompositeItemEntity | ICompositeBoqEntity) {
		this.data.entities = [];
		this.data.quotes = [];
		if (this.data.context) {
			this.data.context.type = type;
			this.data.context.selected = selectedItem;
		}

		if (isArray(items) && items.length) {
			this.data.entities = items.map(item => {
				// business partner entity
				const bpEntity = this.generateEntity(0, item.columnTitle, 0, 'BP');
				bpEntity.Items = item.comparingValues.map(cItem => {
					// quote item entity
					const quoteEntity = this.generateEntity(0, cItem.title, cItem.value, 'QUOTE');
					if (!this.data.quotes.some(quote=>quote.Name === quoteEntity.Name)) {
						this.data.quotes.push({
							Id: quoteEntity.Id,
							Name: quoteEntity.Name,
							IsSelected: true
						});
					}
					return quoteEntity;
				});
				return bpEntity;
			});
		}
	}

	private nextId: number = 0;

	private generateEntity(pid: number, name: string, value: number | string, type: string): IChartDataEntity {
		return {
			Id: ++this.nextId,
			ParentId: pid,
			Name: name,
			Value: value,
			Type: type,
			Items: [],
			IsSelected: true
		};
	}

	public resetData(){
		this.data = {
			entities: [],
			quotes: [],
			context: {
				type: 'item',
				selected: null
			}
		};
	}
}
