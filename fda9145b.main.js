const NUTRITIONIX_API={NUTRITIONIX_X_APP_ID:"84d67ad4",NUTRITIONIX_X_APP_KEY:"3e892392c1929c39d4afdd9a44e14d60",getResults:function(e){"use strict";if(!e)return Promise.resolve([]);const t="https://trackapi.nutritionix.com/v2/search/instant?&branded=false&self=false&query="+e;return fetch(t,{headers:{"x-app-id":this.NUTRITIONIX_X_APP_ID,"x-app-key":this.NUTRITIONIX_X_APP_KEY}}).then(function(e){if(!e.ok){let t=e.status+": "+e.statusText;throw new Error(t)}return e.json()}).then(function(e){var t=[];for(let n of e.common)n.photo.thumb&&t.push({name:n.food_name,img:n.photo.thumb});return t})},getNutrients:function(e){"use strict";if(!e)throw new Error("No query argument was found in getResults");return fetch("https://trackapi.nutritionix.com/v2/natural/nutrients",{method:"POST",headers:{"x-app-id":this.NUTRITIONIX_X_APP_ID,"x-app-key":this.NUTRITIONIX_X_APP_KEY,"x-remote-user-id":"0","Content-Type":"application/json"},body:JSON.stringify({query:e})}).then(function(e){if(!e.ok){let t=e.status+": "+e.statusText;throw new Error(t)}return e.json()}).then(function(e){return{timestamp:Date.now(),name:e.foods[0].food_name,calories:e.foods[0].nf_calories,proteins:e.foods[0].nf_protein,carbohydrates:e.foods[0].nf_total_carbohydrate,fats:e.foods[0].nf_total_fat,img:e.foods[0].photo.thumb}})}};var router,HealthTracker={Models:{},Collections:{},Views:{},Routers:{},init:function(){"use strict";var e=new HealthTracker.Collections.Foods;e.fetch(),new HealthTracker.Views.SearchView({collection:e}),new HealthTracker.Views.Index({collection:e}),router=new HealthTracker.Routers.Router,Backbone.history.start()}};$(document).ready(function(){"use strict";HealthTracker.init()}),this.JST=this.JST||{},this.JST["app/scripts/templates/food-view.ejs"]=function(obj){obj||(obj={});var __t,__p="",__e=_.escape;with(obj)__p+='<article class="col-xs-6 col-sm-4 col-md-3 col-lg-2">\n  <figure class="thumbnail thumbnail--no-border card">\n    <button type="button" class="close" aria-label="Close">\n      <span aria-hidden="true">&times;</span>\n    </button>\n    <img src="'+(null==(__t=img)?"":__t)+'" alt="'+(null==(__t=name)?"":__t)+'">\n    <figcaption class="caption">\n      <p class="nutrients">\n        <span class="calories" title="Calories">'+(null==(__t=calories)?"":__t)+'</span>\n        <span class="protein" title="Proteins">'+(null==(__t=proteins)?"":__t)+'</span>\n        <span class="carbs" title="Carbs">'+(null==(__t=carbohydrates)?"":__t)+'</span>\n        <span class="fat" title="Fats">'+(null==(__t=fats)?"":__t)+'</span>\n      </p>\n      <p class="date text-right">\n        '+(null==(__t=date)?"":__t)+"\n      </p>\n    </figcaption>\n  </figure>\n</article>\n\n";return __p},this.JST["app/scripts/templates/index.ejs"]=function(obj){obj||(obj={});var __t,__p="",__e=_.escape;with(obj)__p+='<nav class="navbar navbar-default">\n  <div class="container">\n    <header>\n      <a href="https://github.com/KostasDimakis/Health-Tracker" class="navbar-brand">\n        Health Tracker\n      </a>\n    </header>\n    <ul class="nav navbar-nav navbar-right">\n      <li id="add"><a><span class="glyphicon glyphicon-plus"></span></a></li>\n    </ul>\n  </div>\n</nav>\n\n<main class="container">\n  <div id="foods" class="row"></div>\n</main>\n\n';return __p},this.JST["app/scripts/templates/result-view.ejs"]=function(obj){obj||(obj={});var __t,__p="",__e=_.escape;with(obj)__p+='<article class="media result">\n  <div class="media-left media-middle">\n    <img class="media-object media--thumbnail" src="'+(null==(__t=img)?"":__t)+'" alt="'+(null==(__t=name)?"":__t)+'">\n  </div>\n  <div class="media-body">\n    <h4>'+(null==(__t=name)?"":__t)+'</h4>\n  </div>\n  <div class="media-right media-middle add">\n    <span class="glyphicon glyphicon-plus"></span>\n  </div>\n</article>\n\n\n';return __p},this.JST["app/scripts/templates/search-view.ejs"]=function(obj){obj||(obj={});var __t,__p="",__e=_.escape;with(obj)__p+='<nav class="navbar navbar-default">\n  <div class="container">\n    <header class="search-view__header">\n      <a id="back"><span class="glyphicon glyphicon-arrow-left"></span></a>\n      <input id="input" type="text" class="form-control" placeholder="Search">\n    </header>\n  </div>\n</nav>\n\n<main id="results" class="container"></main>\n\n';return __p},HealthTracker.Routers=HealthTracker.Routers||{},function(){"use strict";HealthTracker.Routers.Router=Backbone.Router.extend({routes:{"":"index",search:"search","*notFound":"notFound"},index:function(){Backbone.trigger("app:index")},search:function(){Backbone.trigger("app:search")},notFound:function(){window.location="../../404.html"}})}(),HealthTracker.Models=HealthTracker.Models||{},function(){"use strict";HealthTracker.Models.Food=Backbone.Model.extend({initialize:function(){},defaults:{name:"",timestamp:Date.now(),img:"https://www.nutritionix.com/images/apple-touch-icon-152x152.png",fats:0,proteins:0,carbohydrates:0,calories:0,date:""},validate:function(e,t){},parse:function(e,t){return e.date=new Date(e.timestamp).toLocaleString(),e}})}(),HealthTracker.Collections=HealthTracker.Collections||{},function(){"use strict";HealthTracker.Collections.Foods=Backbone.Collection.extend({model:HealthTracker.Models.Food,localStorage:new Backbone.LocalStorage("foods-backbone"),comparator:function(e){return-e.get("timestamp")}})}(),HealthTracker.Views=HealthTracker.Views||{},function(){"use strict";HealthTracker.Views.FoodView=Backbone.View.extend({template:JST["app/scripts/templates/food-view.ejs"],tagName:"div",id:"",className:"",events:{"click .close":"clear"},initialize:function(){this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"destroy",this.remove)},render:function(){this.$el.html(this.template(this.model.toJSON()))},clear:function(){this.$el.fadeTo("slow",0,()=>{this.model.destroy()})}})}(),HealthTracker.Views=HealthTracker.Views||{},function(){"use strict";HealthTracker.Views.ResultView=Backbone.View.extend({template:JST["app/scripts/templates/result-view.ejs"],tagName:"div",id:"",className:"",events:{"click .add":"store"},initialize:function(){this.listenTo(this.model,"change",this.render)},render:function(){this.$el.html(this.template(this.model.toJSON()))},store:function(){NUTRITIONIX_API.getNutrients(this.model.get("name")).then(e=>{this.model=new HealthTracker.Models.Food(e),this.collection.add(this.model),this.model.save()}).catch(function(e){console.error("There has been a problem with your fetch operation: "+e)}),this._navigateToIndexView()},_navigateToIndexView:function(){router.navigate("",{trigger:!0})}})}(),HealthTracker.Views=HealthTracker.Views||{},function(){"use strict";HealthTracker.Views.Index=Backbone.View.extend({el:"#app",template:JST["app/scripts/templates/index.ejs"],tagName:"div",id:"",className:"",events:{"click #add":"navigateToSearchView"},initialize:function(){this.listenTo(this.collection,"change",this.render),this.listenTo(Backbone,"app:index",this.render)},render:function(){this.$el.html(this.template());var e=$("#foods");this._renderCollection(e)},navigateToSearchView:function(e){e.preventDefault(),router.navigate("search",{trigger:!0})},_renderCollection:function(e){this.collection.forEach(t=>{let n=new HealthTracker.Views.FoodView({model:t});n.render(),e.append(n.el)})}})}(),HealthTracker.Views=HealthTracker.Views||{},function(){"use strict";HealthTracker.Views.SearchView=Backbone.View.extend({el:"#app",template:JST["app/scripts/templates/search-view.ejs"],tagName:"div",id:"",className:"",events:{"click #back":"navigateToIndexView","input #input":"onChange"},initialize:function(){this.listenTo(Backbone,"app:search",this.render)},render:function(){this.$el.html(this.template())},navigateToIndexView:function(e){e.preventDefault(),router.navigate("",{trigger:!0})},onChange:function(){var e=$("#input").val(),t=$("#results");NUTRITIONIX_API.getResults(e).then(e=>{this._renderResults(t,e)}).catch(function(e){console.error("There has been a problem with your fetch operation: "+e)})},_renderResults:function(e,t){e.html(""),t.forEach(t=>{let n=new HealthTracker.Models.Food(t),a=new HealthTracker.Views.ResultView({model:n,collection:this.collection});a.render(),e.append(a.$el)})}})}();