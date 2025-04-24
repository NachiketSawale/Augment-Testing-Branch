(function (angular) {
		'use strict';

		var modulename = 'platform';
		var serviceName = 'platformDomUtilsService';

		serviceFunction.$inject = ['_'];

		function serviceFunction(_) {

			return {
				/**
				 * @ngdoc function
				 * @name setAttributesToElement
				 * @function
				 * @methodOf platformDomUtilsService
				 * @description Sets a list of attributes on the specified element. If the attribute already exists, the value is updated;
				 * @param { object } node The node that is to receive the attributes.
				 * @param { NamedNodeMap } attributes A collection of all attribute nodes registered to the specified element. It is a NamedNodeMap, not an Array. To be more specific, attributes is a key/value pair of strings that represents any information regarding that attribute. This collection can be retrieved via node.attributes.
				 */
				setAttributesToElement: setAttributesToElement,
				/**
				 * @ngdoc function
				 * @name cloneNode
				 * @function
				 * @methodOf platformDomUtilsService
				 * @description Returns a duplicate of the node.
				 * @param { object } node The node to be cloned.
				 * @param { string } maxLevelDepth The maximum depth of children levels to be cloned. A value of 2 means that not only the top node, but also its children will be cloned, but not the children their children.
				 * @param { string } curLevel The current level depth. This function is used for recursion and mustn't be set.
				 * @return { string } returns a clone of the node.
				 */
				cloneNode: cloneNode,
				/**
				 * @ngdoc function
				 * @name isNode
				 * @function
				 * @methodOf platformDomUtilsService
				 * @description Determines whether the specified object is a regular document node.
				 * @param { object } node The object to be checked.
				 * @return { boolean } returns true if the object is a document node, otherwise false.
				 */
				isNode: isNode
			};

			function setAttributesToElement(element, attributes) {
				if (!isNode(element)) {
					return;
				}

				_.forEach(attributes, function (attribute) {
					element.setAttribute(attribute.name, attribute.value);
				});
			}

			function isNode(o) {
				return typeof Node === 'object' ? o instanceof Node : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
			}

			function cloneNode(node, maxLevelDepth, curLevel) {
				if (!isNode(node)) {
					return undefined;
				}

				var newElem = node.cloneNode(false);
				var level = curLevel || 1;

				if (_.isUndefined(maxLevelDepth) || (level < maxLevelDepth)) {
					_.forEach(node.children, function (child) {
						newElem.appendChild(cloneNode(child, maxLevelDepth, level + 1));
					});
				}

				return newElem;
			}
		}

		/**
		 * @ngdoc service
		 * @name platformDomUtilsService
		 * @function
		 * @requires _
		 * @description The platformDomUtilsService provides common functions for dom manipulations
		 */
		angular.module(modulename).factory(serviceName, serviceFunction);
	}
)(angular);
