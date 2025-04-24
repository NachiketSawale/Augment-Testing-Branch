/*
 * Copyright(c) RIB Software GmbH
 */

/*export for shared module */
export * from './lib/resource-shared.module';

/*These lookup services will move to individual submodule : https://teams.microsoft.com/l/message/19:meeting_YWRlZTRkMjItMGMyYi00MmIxLWJiNmMtOWYzZjkwZDIyYzFi@thread.v2/1720790053020?context=%7B%22contextType%22%3A%22chat%22%7D*/

/*export for lookup service catalog */
export  * from './lib/lookup-services/catalog/index';

/*export for lookup service certificate */
export  * from './lib/lookup-services/certificate/index';

/*export for lookup service equipmentgroup */
export  * from './lib/lookup-services/equipmentgroup/index';

/*export for lookup service skill */
export * from './lib/lookup-services/skill/index';

/*export for lookup service type */
export * from './lib/lookup-services/type/index';

/*export for lookup service wot */
export * from './lib/lookup-services/wot/index';

export * from './lib/lookup-services/index';


