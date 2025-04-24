/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceInitOptionExtension
	 * @function
	 * @description
	 * platformDataServiceInitOptionExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceInitOptionExtension', PlatformDataServiceInitOptionExtension);

	// PlatformDataServiceSelectionExtension.$inject = ['dependencies'];//No dependency yet

	function PlatformDataServiceInitOptionExtension() {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceRowReadonlyExtension
		 * @description adds selection behaviour to data services
		 * @param options {object} contains entire service and its data to be created
		 * @returns state
		 */
		// var self = this;

		this.completeOptions = function completeOptions(options) {
			var opt = {};
			if (options.flatRootItem) {
				opt = completeFlatRootItemOptions(options.flatRootItem);
			} else if (options.hierarchicalRootItem) {
				opt = completeHierarchicalRootItemOptions(options.hierarchicalRootItem);
			} else if (options.flatNodeItem) {
				opt = completeFlatNodeItemOptions(options.flatNodeItem);
			} else if (options.hierarchicalNodeItem) {
				opt = completeHierarchicalNodeItemOptions(options.hierarchicalNodeItem);
			} else if (options.flatLeafItem) {
				opt = completeFlatLeafItemOptions(options.flatLeafItem);
			} else if (options.hierarchicalLeafItem) {
				opt = completeHierarchicalLeafItemOptions(options.hierarchicalLeafItem);
			} else {
				opt = assertOptionsAreMeaningful(options);
			}

			return opt;
		};

		/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
		function completeFlatRootItemOptions(options) {
			completeCRUDOptionsForHTTP(options, 'list');

			if (!!options.entityRole && !!options.entityRole.root) {
				if (!options.entityRole.root.codeField) {
					options.entityRole.root.codeField = 'Code';
				}
				if (!options.entityRole.root.descField) {
					options.entityRole.root.descField = 'Description';
				}
			}

			if (!options.modification) {
				options.modification = {simple: {}};
			}

			if (!options.presenter) {
				options.presenter = {list: {}};
			} else if (!options.presenter.list) {
				options.presenter.list = {};
			}

			if (!options.entitySelection) {
				options.entitySelection = {};
			}

			if (!options.actions) {
				options.actions = {delete: {}, create: 'flat'};
			}

			return options;
		}

		/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
		function completeHierarchicalRootItemOptions(options) {
			completeCRUDOptionsForHTTP(options, 'tree');

			if (!!options.entityRole && !!options.entityRole.root) {
				if (!options.entityRole.root.codeField) {
					options.entityRole.root.codeField = 'Code';
				}
				if (!options.entityRole.root.descField) {
					options.entityRole.root.descField = 'Description';
				}
			}

			if (!options.modification) {
				options.modification = {simple: {}};
			}

			if (!options.presenter) {
				options.presenter = {tree: {}};
			} else if (!options.presenter.tree) {
				options.presenter.tree = {};
			}

			if (!options.entitySelection) {
				options.entitySelection = {};
			}

			if (!options.actions) {
				options.actions = {delete: {}, create: 'hierarchical'};
			}

			return options;
		}

		function completeCRUDOptionsForHTTP(options, readCMD) {
			if (options.httpCRUD) {
				if (!options.httpCRUD.endRead) {
					options.httpCRUD.endRead = readCMD;
				}
			} else {
				if (options.httpCreate && !options.httpCreate.endCreate) {
					options.httpCreate.endCreate = 'create';
				}
				if (options.httpRead && !options.httpRead.endRead) {
					options.httpRead.endRead = readCMD;
				}
				if (options.httpUpdate && !options.httpUpdate.endUpdate) {
					options.httpUpdate.endUpdate = 'update';
				}
				if (options.httpDelete && !options.httpDelete.endDelete) {
					options.httpDelete.endDelete = 'delete';
				}
			}

			return options;
		}

		/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
		function completeFlatLeafItemOptions(options) {
			completeCRUDOptionsForHTTP(options, 'list');

			if (!options.modification) {
				options.modification = {multi: {}};
			}

			if (!options.presenter) {
				options.presenter = {list: {}};
			} else if (!options.presenter.list) {
				options.presenter.list = {};
			}

			if (!options.entitySelection) {
				options.entitySelection = {supportsMultiSelection: true};
			} else if (!options.entitySelection.hasOwnProperty('supportsMultiSelection')) {
				options.entitySelection.supportsMultiSelection = true;
			}

			if (!options.actions) {
				options.actions = {delete: {}, create: 'flat'};
			}

			return options;
		}

		/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
		function completeHierarchicalLeafItemOptions(options) {
			completeCRUDOptionsForHTTP(options, 'tree');

			if (!options.modification) {
				options.modification = {multi: {}};
			}

			if (!options.presenter) {
				options.presenter = {tree: {}};
			} else if (!options.presenter.tree) {
				options.presenter.tree = {};
			}

			if (!options.entitySelection) {
				options.entitySelection = {supportsMultiSelection: true};
			} else if (!options.entitySelection.hasOwnProperty('supportsMultiSelection')) {
				options.entitySelection.supportsMultiSelection = true;
			}

			if (!options.actions) {
				options.actions = {delete: {}, create: 'hierarchical'};
			}

			return options;
		}

		function completeFlatNodeItemOptions(options) {
			return completeFlatLeafItemOptions(options);
		}

		function completeHierarchicalNodeItemOptions(options) {
			return completeHierarchicalLeafItemOptions(options);
		}

		function assertOptionsAreMeaningful(options) {
			if (options.entityRole) {
				if (!options.modification) {
					options.modification = {simple: {}};
				}
			}

			return options;
		}
	}
})();