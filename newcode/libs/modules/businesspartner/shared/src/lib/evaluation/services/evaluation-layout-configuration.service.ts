import {BusinesspartnerSharedEvaluationDefaultLayout} from '../model/layout-configuration/evaluation-default-layout.model';
import {clone, forEach, remove} from 'lodash';

export class BusinesspartnerSharedEvaluationLayoutConfigurationService {
	//remove column by column id
	public static getLayout() {
		return clone(BusinesspartnerSharedEvaluationDefaultLayout);
	}

	public static removeColumns(excludeColumns?: () => string[]) {
		const layout = this.getLayout();
		if (excludeColumns) {
			forEach(excludeColumns(), column => {
				remove(layout, {id: column});
			});
		}
		return layout;
	}
}
