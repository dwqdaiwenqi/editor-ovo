// {
//   var Class = {};

//   Class.create = function(prop,st_prop){
    
//     var F = function(){       
//       if(typeof this.init ==='function'&&this.init)
//         this.init.apply(this,arguments);
//     };
    
//     prop = prop || {};
    
//     st_prop && Object.keys(st_prop).forEach(function(s){
//       F[s] = st_prop[s];  
//     });
    
//     F.extend = Class.create;
    
//     //不是Class extend 要从上个F继承了
//     if(this != Class){
//       F.prototype = Object.create(this.prototype);
//       F.prototype.constructor = F;
//       F.prototype.__super__ = this.prototype;

//       Object.keys(prop).forEach(function(s){
//         //需要扩展的和继承过后的存在重复！
//         if(F.prototype[s] && typeof F.prototype[s]=='function'){
              
//           F.prototype[s] = function(){
//             var args = arguments,
//               that = this;      
//             this._super = function(){
//               return that.__super__[s].apply(this,args);
              
//             };
//             return prop[s].apply(this,arguments);
//           };

//         }else{
//           F.prototype[s] = prop[s];
//         };
        
//       });
      

//       Object.keys(this).filter(function(s){
//         return !(/extend|create/).test(s);
//       }).forEach(function(s){
//         F[s] = this.__super__.constructor[s];
//       },F.prototype);
      
//       st_prop && Object.keys(st_prop).forEach(function(s){
//         F[s] = st_prop[s];  
//       });

    

//       return F;
//     };

//     Object.keys(prop).forEach(function(s){
//       F.prototype[s] =prop[s];
//     });
//     F.prototype.constructor = F;

//     return F;
    
//   }; 

// }

// let C1 = Class.create({
//   init(){}
// });
// let C2 = C1.extend({
//   init(){}
// });

// new C2();





Function.prototype.after = function(fn){
  var that = this;
  return function(){
    var fnn = that.apply(that , arguments);
     if( fnn != void 0)
        return fn.apply(this , arguments);
     return fnn;
  }
}


export var Class = Class;

export var Event = Class.create({
  init : function(){
    this.evs = {};
  },
  on : function(s,fn,once){
    s = s.trim();
    if(once && once.trim() == 'once'){
      this.evs[s] = [fn];
      
      return this;
    };
    
    if(!this.evs[s]){
      this.evs[s] = [fn];
      return this;
    };
    this.evs[s].push(fn);
    return this;
  },
  trigger : function(s){
    var that = this,
      args = arguments,
      ar = this.evs[s = s.trim()];
    
    //tirgger('aaa' , a,b,c)
    ar && ar.forEach(function(fn){
      fn.apply(that , [].slice.call(args,1));
    });
    
    return this;
  },
  off : function(s){
    delete this.evs[s.trim()];
    return this;
  }
});