(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
     * @ngdoc service
     * @name estimateMainBidCreationProcessService
     * @function
     * @description
     * estimateMainBidCreationProcessService is the data service to process Complete Estimate Bid Creation Urp configuration .
     */
	angular.module(moduleName).factory('estimateMainBidCreationProcessService', ['platformRuntimeDataService', '$injector',
		function (platformRuntimeDataService, $injector) {

			function processItem(item, rows, items) {
				item.EstUppEditType = item.EstUppEditType || $injector.get('estimateMainUpp2CostcodeDetailDataService').getIsCurrentBoqUppConfiged();
				let fields = [],
					isEditUpp = item.EstUppEditType;
				item.estUppConfigTypeFk = item.EstUppEditType ? null : item.estUppConfigTypeFk;

				/* jshint -W074 */ // this function's cyclomatic complexity is too high.
				angular.forEach(rows, function (row) {
					let readOnly = true;
					switch (row.rid.trim()) {
						case'estUppType':
							readOnly = isEditUpp;
							break;
						case 'estUppEditType':
							readOnly = isEditUpp || $injector.get('estimateMainUpp2CostcodeDetailDataService').getIsCurrentBoqUppConfiged();
							break;
						case'estUppConfigDesc':
						case 'estUppDetail':
							readOnly = !isEditUpp;
							break;
					}

					if(row.rid === 'estUppDetail') {
						// make the whole grid readonly
						setGridReadOnly(items, readOnly);
					}

					fields.push({field: row.model, readonly: readOnly, disabled: readOnly});
				});

				platformRuntimeDataService.readonly(item, fields);
			}

			function setGridReadOnly(items, isReadOnly){
				let fields = [],
					item = _.isArray(items) ? items[0] : null;

				_.forOwn(item, function (value, key) {
					let field = {field: key, readonly: isReadOnly};
					fields.push(field);
				});

				angular.forEach(items, function (item) {
					if (item && item.Id) {
						platformRuntimeDataService.readonly(item, fields);
					}
				});
			}

			// set all items readonly or editable
			function setReadOnly(item, key, isReadOnly) {
				let fields = [];

				let field = {field: key, readonly: isReadOnly};
				fields.push(field);

				platformRuntimeDataService.readonly(item, fields);
			}

			return {
				processItem: processItem,
				// setGridReadOnly: setGridReadOnly,
				setReadOnly: setReadOnly
			};
		}]);
})();
