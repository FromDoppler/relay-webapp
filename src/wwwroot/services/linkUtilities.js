(function () {
  'use strict';

  angular
    .module('dopplerRelay')
    .service('linkUtilities', linkUtilities);

  function linkUtilities() {

    var standardRelations = {
      first: 'first',
      last: 'last',
      next: 'next',
      parent: 'parent',
      previous: 'previous',
      related: 'related',
      self: 'self'
    };

    var linkUtilitiesService = {
      standardRelations: standardRelations,
      relStringHasRel: relStringHasRel,
      linkHasRel: linkHasRel,
      findLinkByRel: findLinkByRel,
      filterLinksByRel: filterLinksByRel,
      findFirstLink: function (linkList) { return findLinkByRel(linkList, standardRelations.first); },
      findLastLink: function (linkList) { return findLinkByRel(linkList, standardRelations.last); },
      findNextLink: function (linkList) { return findLinkByRel(linkList, standardRelations.next); },
      findParentLink: function (linkList) { return findLinkByRel(linkList, standardRelations.parent); },
      findPreviousLink: function (linkList) { return findLinkByRel(linkList, standardRelations.previous); },
      findRelatedLink: function (linkList) { return findLinkByRel(linkList, standardRelations.related); },
      findSelfLink: function (linkList) { return findLinkByRel(linkList, standardRelations.self); },
    };

    return linkUtilitiesService;

    function escapeRegExp(string) {
      return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
    }

    function relStringHasRel(relString, rel) {
      return relString && rel && (new RegExp("^(.*\\s)?" + escapeRegExp(rel) + "(\\s.*)?$", "m")).test(relString);
    }

    function linkHasRel(link, rel) {
      return link && relStringHasRel(link.rel, rel);
    }

    function findLinkByRel(linkList, rel) {
      return linkList && linkList.find(function (link) {
        return linkHasRel(link, rel);
      });
    }

    function filterLinksByRel(linkList, rel) {
      return linkList && linkList.filter(function (link) {
        return linkHasRel(link, rel);
      });
    }

  }
})();
