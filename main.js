/* jshint unused:false */
/**
 * Object that handles the nutrituonix api
 * @type {{NUTRITIONIX_X_APP_ID: string, NUTRITIONIX_X_APP_KEY: string, getResults: getResults, getNutrients: getNutrients}}
 *
 * Example usage of the exported functions
 * NUTRITIONIX_API.getResults('pancakes').then(function(data) {
     *    console.log(data);
     * }).catch(function(error) {
     *   console.error('There has been a problem with your fetch operation: ' + error);
     * });
 *
 *  NUTRITIONIX_API.getNutrients('banana').then(function(data) {
     *   console.log(data);
     * }).catch(function(error) {
     *   console.error('There has been a problem with your fetch operation: ' + error);
     * });
 */
const NUTRITIONIX_API = {
  NUTRITIONIX_X_APP_ID: '84d67ad4',
  NUTRITIONIX_X_APP_KEY: '3e892392c1929c39d4afdd9a44e14d60',

  /**
   * Get a parsed list of matching foods from the instant endpoint (good for autocompletion)
   * IMPORTANT: Caller must implement a catch clause
   * @param {string} query
   * @return {Promise.<TResult>} An array of objects with name, img properties.
   */
  getResults: function(query) {
    'use strict';
    // if argument is empty string
    // return an empty array
    if (!query) {
      return Promise.resolve([]);
    }
    // build the request
    const request = 'https://trackapi.nutritionix.com/v2/search/instant?&branded=false&self=false&query=' + query;
    // add custom headers make the request
    return fetch(request, {
      headers: {
        'x-app-id': this.NUTRITIONIX_X_APP_ID,
        'x-app-key': this.NUTRITIONIX_X_APP_KEY
      }
    }).then(function(response) {
      if (!response.ok) {
        let msg = response.status + ': ' + response.statusText;
        throw new Error(msg);
      }
      return response.json();
    }).then(function(data) {
      var foods = [];
      for (let result of data.common) {
        if (result.photo.thumb) {
          foods.push({
            /* jshint camelcase: false */
            name: result.food_name,
            img: result.photo.thumb
          });
        }
      }
      return foods;
    });
  },

  /**
   * Get a single food matching the given query
   * IMPORTANT: Caller must implement a catch clause
   * @param {string} query
   * @return {Promise.<TResult>} An object with properties: name, calories, protein, carbohydrates, fat, img.
   */
  getNutrients: function(query) {
    'use strict';
    // check the argument
    if (!query) {
      throw new Error('No query argument was found in getResults');
    }
    // build the request
    const request = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    // add custom headers make the request
    return fetch(request, {
      method: 'POST',
      headers: {
        'x-app-id': this.NUTRITIONIX_X_APP_ID,
        'x-app-key': this.NUTRITIONIX_X_APP_KEY,
        'x-remote-user-id': '0',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'query': query
      })
    }).then(function(response) {
      if (!response.ok) {
        let msg = response.status + ': ' + response.statusText;
        throw new Error(msg);
      }
      return response.json();
    }).then(function(data) {
      var food = {
        /* jshint camelcase: false */
        timestamp: Date.now(),
        name: data.foods[0].food_name,
        calories: data.foods[0].nf_calories,
        proteins: data.foods[0].nf_protein,
        carbohydrates: data.foods[0].nf_total_carbohydrate,
        fats: data.foods[0].nf_total_fat,
        img: data.foods[0].photo.thumb
      };
      return food;
    });
  }
};

// router is used in router.js
var router;

var HealthTracker = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function () {
    'use strict';
    // create a collection and fetch
    // any foods from localStorage
    var foods = new HealthTracker.Collections.Foods();
    foods.fetch();
    // kick start the app views
    new HealthTracker.Views.SearchView({ collection: foods });
    new HealthTracker.Views.Index({ collection: foods });
    // start router
    router = new HealthTracker.Routers.Router();
    Backbone.history.start();
  }
};

$(document).ready(function () {
  'use strict';
  HealthTracker.init();
});
