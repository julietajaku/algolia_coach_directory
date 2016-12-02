'use strict';
/* global instantsearch */

var search = instantsearch({
  appId: 'YORNOA2EPS',
  apiKey: '6f2b9a275341d6961c799a2981b9d663',
  indexName: 'coach_packages'
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#q',
    placeholder: 'Search by name or interest'
  })
);

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats'
  })
);

search.on('render', function() {
  console.log(this);
  $('.coach-picture img').addClass('transparent');
  $('.coach-picture img').one('load', function() {
      $(this).removeClass('transparent');
  }).each(function() {
      /*if(this.complete)*/ $(this).load();
  });
});

var hitTemplate =
  '<article class="hit">' +
    '<div class="coach-picture" style="background-image:url({{coach_image_path}});"></div>' +
    '<div class="coach-desc">' +
      '<div class="coach-fullname"><a href="{{URL}}" target="_blank">{{_highlightResult.firstname.value}} {{_highlightResult.lastname.value}}</a></div>' +
      '<div class="coach-title">{{_highlightResult.coach_title.value}}</div>' +
      '<div class="coach-location">{{city}}, {{state}}</div>' +
    '</div>' +

      /*'<div class="content-descrption">{{#stars}}<span class="ais-star-rating--star{{^.}}__empty{{/.}}"></span>{{/stars}}</div>' +*/
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
    hitsPerPage: 15,
    highlightPreTag: "<em>",
    highlightPostTag: "</em>",    
    templates: {
      empty: noResultsTemplate,
      item:  hitTemplate
    },
    transformData: function(hit) {
      hit.stars = [];
      for (var i = 1; i <= 5; ++i) {
        hit.stars.push(i <= hit.rating);
      }
      return hit;
    },
    cssClasses: {
      root: 'row',
      item: 'col-xs-6 col-sm-4'
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

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#type',
    attributeName: 'session_type',
    limit: 20,
    cssClasses: {
      root: 'checkbox',
      list: 'list-group', 
      item: 'list-group-item' 
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#method',
    attributeName: 'methods',
    limit: 20,
    cssClasses: {
      root: 'checkbox',
      list: 'list-group', 
      item: 'list-group-item' 
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#gender',
    attributeName: 'gender',
    limit: 20,
    cssClasses: {
      root: 'checkbox',
      list: 'list-group', 
      item: 'list-group-item' 
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#specialties',
    attributeName: 'specialties',
    limit: 20,
    cssClasses: {
      root: 'checkbox',
      list: 'list-group', 
      item: 'list-group-item' 
    }
  })
);

search.addWidget(
  instantsearch.widgets.hierarchicalMenu({
    container: '#location',
    attributes: ['state', 'statecity'],
    sortBy: ['name:asc'],
    limit: 50,
    templates: {
      item: menuTemplate
    }
  })
);

search.addWidget(
  instantsearch.widgets.priceRanges({
    container: '#price',
    attributeName: 'price',
    cssClasses: {
      list: 'nav nav-list',
      count: 'badge pull-right',
      active: 'active'
    }
  })
);

search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#numberofsessions',
    attributeName: 'numberofsessions',
  })
);

search.addWidget(
  instantsearch.widgets.sortBySelector({
    container: '#sort-by-selector',
    indices: [
      {name: 'coach_packages', label: 'Default'},
      {name: 'coach_packages_price_asc', label: 'Price High to Low'},
      {name: 'coach_packages_price_desc', label: 'Price Low to High'}
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
