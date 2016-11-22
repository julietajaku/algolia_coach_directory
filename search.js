'use strict';
/* global instantsearch */

var search = instantsearch({
  appId: 'YORNOA2EPS',
  apiKey: '6f2b9a275341d6961c799a2981b9d663',
  indexName: 'coaching_content'
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#q',
    placeholder: 'What are you curious about?'
  })
);

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats'
  })
);

search.on('render', function() {
  $('.coach-picture img').addClass('transparent');
  $('.coach-picture img').one('load', function() {
      $(this).removeClass('transparent');
  }).each(function() {
      /*if(this.complete)*/ $(this).load();
  });
});

var hitTemplate =
  '<article class="hit">' +
      /*'<div class="content-picture-wrapper">' +
        '<div class="content-picture"><img src="{{image_path}}" /></div>' +
      '</div>' +*/
      '<div class="content-desc-wrapper">' +
        '<div class="content-title"><a href={{{URL}}}>{{{_highlightResult.Title.value}}}</a></div>' +
        '<div class="content-description">{{{_highlightResult.Extended description.value}}}</div>' +
        '<div class="content-date">{{Date updated}}</div>' +
        /*'<div class="content-descrption">{{#stars}}<span class="ais-star-rating--star{{^.}}__empty{{/.}}"></span>{{/stars}}</div>' +*/
      '</div>' +
  '</article>';

var noResultsTemplate =
  '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

var menuTemplate =
  '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{name}}</span class="facet-name"></a>';

var facetTemplateCheckbox =
  '<a href="javascript:void(0);" class="facet-item">' +
    '<input type="checkbox" class="{{cssClasses.checkbox}}" value="{{name}}" {{#isRefined}}checked{{/isRefined}} />{{name}}' +
    '<span class="facet-count">({{count}})</span>' +
  '</a>';

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 16,
    templates: {
      empty: noResultsTemplate,
      item: hitTemplate
    },
    transformData: function(hit) {
      hit.stars = [];
      for (var i = 1; i <= 5; ++i) {
        hit.stars.push(i <= hit.rating);
      }
      return hit;
    }
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    cssClasses: {
      active: 'active'
    },
    labels: {
      previous: '<i class="fa fa-angle-left fa-2x"></i> Previous page',
      next: 'Next page <i class="fa fa-angle-right fa-2x"></i>'
    },
    showFirstLast: false
  })
);

/*
search.addWidget(
  instantsearch.widgets.hierarchicalMenu({
    container: '#categories',
    attributes: ['category', 'sub_category', 'sub_sub_category'],
    sortBy: ['name:asc'],
    templates: {
      item: menuTemplate
    }
  })
);
*/

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#audience',
    attributeName: 'Audience',
    operator: 'or',
    limit: 10,
    templates: {
      item: facetTemplateCheckbox,
      header: '<div class="facet-title">Audience</div class="facet-title">'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#languages',
    attributeName: 'Languages',
    operator: 'or',
    limit: 10,
    templates: {
      item: facetTemplateCheckbox,
      header: '<div class="facet-title">Languages</div class="facet-title">'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#media-type',
    attributeName: 'Media type',
    operator: 'or',
    limit: 10,
    templates: {
      item: facetTemplateCheckbox,
      header: '<div class="facet-title">Media type</div class="facet-title">'
    }
  })
);

/*
search.addWidget(
  instantsearch.widgets.priceRanges({
    container: '#prices',
    attributeName: 'price',
    cssClasses: {
      list: 'nav nav-list',
      count: 'badge pull-right',
      active: 'active'
    },
    templates: {
      header: '<div class="facet-title">Prices</div class="facet-title">'
    }
  })
);
*/


search.addWidget(
  instantsearch.widgets.sortBySelector({
    container: '#sort-by-selector',
    indices: [
      {name: 'coaching_content', label: 'Relevance'},
      {name: 'coaching_content_date', label: 'Date updated'}
    ],
    label:'sort by'
  })
);


search.addWidget(
  instantsearch.widgets.clearAll({
    container: '#clear-all',
    templates: {
      link: '<i class="fa fa-eraser"></i> Clear all filters'
    },
    cssClasses: {
      root: 'btn btn-block btn-default'
    },
    autoHideContainer: true
  })
);

search.start();
