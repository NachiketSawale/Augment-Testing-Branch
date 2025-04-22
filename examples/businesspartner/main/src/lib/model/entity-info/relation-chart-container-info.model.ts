import {ContainerDefinition} from '@libs/ui/container-system';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {
	RelationChartContainerComponent
} from '../../components/relation-chart-container/relation-chart-container.component';

export const BP_MAIN_RELATION_CHART_CONTAINER_INFO = new ContainerDefinition({
	uuid: '11dd248f6db045029ba634baa501faad',
	id: 'businesspartner.main.relationChart',
	title: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.bpRelationChart',
	containerType: RelationChartContainerComponent,
	permission: '12394ae7fb944ba1b1006bd13864149a',
});