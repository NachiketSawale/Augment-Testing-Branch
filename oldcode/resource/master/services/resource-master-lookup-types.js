/**
 * Created by anl on 3/29/2017.
 */

/**
 * The constant contains lookup types which can be used in lookup directive.
 */

(function(angular){
	'use strict';
	var moduleName = 'resource.master';
	angular.module(moduleName).value('resourceMasterLookupTypes', {
		'resourcemastergroup': 'resource/master/group/tree'
	});
})(angular);


