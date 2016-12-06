'use strict';
/* global instantsearch */

var getTemplateByID = function(ID){
  return document.getElementById(ID).innerHTML.toString();
}

var search = instantsearch({
  appId: 'YORNOA2EPS',
  apiKey: '6f2b9a275341d6961c799a2981b9d663',
  indexName: 'coach_packages',
  searchParameters: {
    getRankingInfo: true,
    // aroundLatLngViaIP: true
  }
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
  // console.log(data);
});

var hitTemplate =
  '<article class="hit">' +
    '<div class="coach-picture" style="background-image:url({{imagepath}});"></div>' +
    '<div class="coach-desc">' +
      '<div class="coach-fullname"><a href="{{URL}}" target="_blank">{{{_highlightResult.firstname.value}}} {{{_highlightResult.lastname.value}}}</a></div>' +
      '<div class="coach-title">{{{_highlightResult.title.value}}}</div>' +
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
      item: getTemplateByID('template-hit-coach')
      // item:  function(data){
      //   console.log(data);
      //   return 'hit';
      // }
    },
    transformData: function(hit) {
      console.log(hit);
      if(hit._highlightResult.bio.matchedWords.length > 0){
        var letterPadding = 50,
            stringValue = hit._highlightResult.bio.value,
            startIndex, endIndex, startString, endString;

        startIndex = Math.max( stringValue.indexOf('<em>') - letterPadding, 0 );
        endIndex = Math.min( stringValue.lastIndexOf('</em>') + letterPadding, stringValue.length );

        startString =  ( startIndex > 0 ) ? '... ' : '';
        endString = ( endString !== stringValue.length ) ? ' ...' : '';

        console.log(startIndex + ' ' + endIndex);
        hit.bio_short = startString + stringValue.substring(startIndex, endIndex) + endString;
      }else{
        hit.bio_short = hit.bio.substr(0, 165) + '...';
      }
      
      if(hit.reviews){
        hit.review_percentage = 'style=width:' + (hit.reviews.average / 5) * 100 + '%;';
      }
      
      if(hit.packages){
        hit.package_count = hit.packages.length;
        var startPrice = 0;
        
        for(var i = 0, l = hit.packages.length; i < l; i++){
          console.log(startPrice);
          startPrice = Math.max(startPrice, hit.packages[i].price);
        }

        hit.package_starting_price = startPrice;
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

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#type',
    attributeName: 'packages.session_type',
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
    attributeName: 'packages.methods',
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
  instantsearch.widgets.starRating({
    container: '#averagerating',
    attributeName: 'reviews.average',
    max: 5,
    labels: {
      andUp: '& Up'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#specialties',
    attributeName: 'packages.specialties',
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
    attributes: ['state', 'citystate'],
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
    attributeName: 'packages.price',
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
    attributeName: 'packages.numberofsessions',
  })
);

search.addWidget(
  instantsearch.widgets.sortBySelector({
    container: '#sort-by-selector',
    indices: [
      {name: 'coach_packages', label: 'Default'},
      {name: 'coach_packages_price_asc', label: 'Price High to Low'},
      {name: 'coach_packages_price_desc', label: 'Price Low to High'},
      {name: 'coach_packages_ratings_desc', label: 'Ratings High to Low'},
      {name: 'coach_packages_ratings_asc', label: 'Ratings Low to High'}
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

search.addWidget(
  instantsearch.widgets.currentRefinedValues({
    container: '#current-filters',
    clearAll: 'after',
    templates: {
      item: function(data){
        console.log(data);
        var s = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> ' +
        data.name + ' <span class="ais-current-refined-values--count"> (' + data.count + ')</span>'
        return s;
      }
    },
    attributes: [
      { name: 'chris' }
    ],
    cssClasses: {
      link: 'label label-default'
    }
  })
);

search.start();
