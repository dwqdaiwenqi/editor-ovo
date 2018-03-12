
{
  var Class = {};

  Class.create = function(prop,st_prop){
    
    var F = function(){       
      if(typeof this.init ==='function'&&this.init){
        this.init.apply(this,arguments);
      }
 
    };
    
    prop = prop || {};
    
    st_prop && Object.keys(st_prop).forEach(function(s){
      F[s] = st_prop[s];  
    });
    
    F.extend = Class.create;
    
    //不是Class extend 要从上个F继承了
    if(this != Class){
      F.prototype = Object.create(this.prototype);
      F.prototype.__super__ = this.prototype;
      F.prototype.constructor = F;

      var parent_prop = this.prototype;
      Object.keys(prop).forEach(function(s){
        //需要扩展的和继承过后的存在重复！
        if(parent_prop[s] && typeof parent_prop[s]=='function'){
              
          F.prototype[s] = function(){
            this._super = parent_prop[s];
            return prop[s].apply(this,arguments);
            
          };

        }else{
          F.prototype[s] = prop[s];
        };	
      });

      Object.keys(this).filter(function(s){
        return !(/extend|create/).test(s);
      }).forEach(function(s){
        F[s] = this.__super__.constructor[s];
      },F.prototype);
      
      st_prop && Object.keys(st_prop).forEach(function(s){
        F[s] = st_prop[s];  
      });


      return F;
    };

    Object.keys(prop).forEach(function(s){
      F.prototype[s] =prop[s];
    });
    F.prototype.constructor = F;

    return F;
    
  }; 

}


//debugger;

Function.prototype.after = function(fn){
  var that = this;
  return function(){
    var fnn = that.apply(that , arguments);
     if( fnn != void 0)
        return fn.apply(this , arguments);
     return fnn;
  }
}

{
	const u = navigator.userAgent;
	var Brower = {
		version:{
			mobile: (/AppleWebKit.*Mobile.*/i).test(u),
	    //是否为移动终端
	    ios: (/\(i[^;]+;( U;)? CPU.+Mac OS X/i).test(u),
	    //ios终端
	    android: (/Android/i).test(u) || (/Linux/i).test(u),
	    //android终端或者uc浏览器
	    windowsphone: (/Windows Phone/i).test(u),
	    //Windows Phone
	    iPhone: (/iPhone/i).test(u),
	    //是否为iPhone或者QQHD浏览器
	    iPad: (/iPad/i).test(u),
	    //是否iPad
	    webApp: !(/Safari/i).test(u),
	    //是否web应该程序，没有头部与底部
	    MicroMessenger: (/MicroMessenger/i).test(u),
	    //是否为微信
	    weibo: (/Weibo/i).test(u),
	    //是否为微博
	    uc: (/ucweb|UCBrowser/i).test(u),
	    //是否为UC
	    qq: (/MQQBrowser/i).test(u),
	    //是否为QQ浏览器
	    baidu: (/Baidu/i).test(u),//是否为百度浏览器

	    weixin:/MicroMessenger/i.test(u)
		}
		,language:(navigator.browserLanguage || navigator.language).toLowerCase()
	}
}

{
  var Cache = {};
  let importAll = function(r){
    //r.keys().forEach(key => cache[key] = r(key));
    r.keys().forEach((key)=>{
      //console.log(key);
      Cache[key] = r(key);
    });
  }
  //importAll(require.context('./common/img/popo_2adefed/', true, /\.png$/));
  importAll(require.context('./common/img/smile/', true, /\.png$/));
}

export var Cache = Cache;

export var Brower = Brower;

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