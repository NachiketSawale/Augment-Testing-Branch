/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { CompareBoqTreeBuilder } from '../compare-boq-tree-builder.class';
import { ProcurementPricecomparisonComparePrintBoqDataService } from '../../../../services/print/data/compare-print-boq-data.service';
import { ICompositeBoqEntity } from '../composite-boq-entity.interface';
import { IComparePrintBoqAnalysis, IComparePrintBoqAnalysisCriteria, IComparePrintBoqProfile } from '../../print/compare-print-boq-profile.interface';
import { CompareRowTypes } from '../../../constants/compare-row-types';
import { IComparePrintBaseTotal } from '../../print/compare-print-base-total.interface';

export class ComparePrintBoqTreeBuilder extends CompareBoqTreeBuilder {
	public constructor(
		private printBoqDataSvc: ProcurementPricecomparisonComparePrintBoqDataService
	) {
		super(printBoqDataSvc);
	}

	private filterByCriteria(dataRows: ICompositeBoqEntity[], criteria: IComparePrintBoqAnalysisCriteria, baseType: IComparePrintBaseTotal) {
		if (criteria) {
			switch (criteria.selectedValue.toString()) {
				case '2': {
					const totalPercent = Number.parseFloat(criteria.totalPercent.toString()) / 100;
					return _.filter(dataRows, (row) => {
						return this.getRoundData(row['totalPercent'] as number) < totalPercent;
					});
				}
				case '3': {
					const singlePercent = Number.parseFloat(criteria.singlePercent.toString()) / 100;
					return _.filter(dataRows, (row) => {
						return this.getRoundData(row['singlePercent'] as number) > singlePercent;
					});
				}
				case '4': {
					const amount = Number.parseFloat(criteria.amount.toString());
					return _.filter(dataRows, (row) => {
						if (baseType.isBidder) {
							let field = row.leadingFields ? row.leadingFields[baseType.key] as number : 0;
							if (!_.isNumber(field)) {
								field = 0;
							}
							return this.getRoundData(field) > amount;
						} else {
							return this.getRoundData(row[baseType.key] as number) > amount;
						}

					});
				}
				default:
					return dataRows;
			}
		}
		return dataRows;
	}

	private getRoundData(num: number) {
		return Math.round(num * 10000) / 10000;
	}

	private getCriteriaData(flatTree: ICompositeBoqEntity[], analysis: IComparePrintBoqAnalysis) {
		if (analysis.criteria.selectedValue.toString() === '1') {
			return flatTree;
		}
		let newDataRows: ICompositeBoqEntity[] = [];
		const baseType = analysis.filterBasis.selectedItem as IComparePrintBaseTotal;
		const total = _.find(flatTree, (item) => {
			return item.LineTypeFk === CompareRowTypes.grandTotal;
		});
		if (total) {
			let totalValue = 0;
			if (!baseType.isBidder) {
				totalValue = total[baseType.key] as number;
			} else {
				totalValue = total.totals ? total.totals[baseType.key] as number : 0;
			}

			_.forEach(flatTree, (item) => {
				if (this.utilService.isBoqPositionRow(item.LineTypeFk)) {
					if (baseType.isBidder) {
						let field = item.leadingFields ? item.leadingFields[baseType.key] as number : 0;
						if (!_.isNumber(field)) {
							field = 0;
						}
						const finalPrice = field || 0;
						item['singlePercent'] = totalValue === 0 ? 0 : finalPrice / totalValue;
					} else {
						item['singlePercent'] = totalValue === 0 ? 0 : (item[baseType.key] as number) / totalValue;
					}
					newDataRows.push(item);
				}
			});
			newDataRows = _.orderBy(newDataRows, ['singlePercent', 'Reference'], ['desc', 'asc']);
		}
		let tempData = 0;
		_.forEach(newDataRows, (item) => {
			tempData += item['singlePercent'] as number;
			item['totalPercent'] = tempData;
		});
		newDataRows = this.filterByCriteria(newDataRows, analysis.criteria, analysis.filterBasis.selectedItem as IComparePrintBaseTotal);
		if (total) {
			newDataRows.unshift(total);
		}
		return newDataRows;
	}

	protected override buildCustomTree(tree: ICompositeBoqEntity[]): ICompositeBoqEntity[] {
		tree = super.buildCustomTree(tree);

		// Criteria Data
		const rfq = this.printBoqDataSvc.settings.rfq as IComparePrintBoqProfile;
		return this.getCriteriaData(this.utilService.flatTree(tree), rfq.analysis);
	}
}