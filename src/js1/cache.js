var cache = {};
var importAll = function(r){
  //r.keys().forEach(key => cache[key] = r(key));
  r.keys().forEach((key)=>{
    //console.log(key);
    cache[key] = r(key);
  });
}
//importAll(require.context('./common/img/popo_2adefed/', true, /\.png$/));
importAll(require.context('./common/img/smile/', true, /\.png$/));

// console.log(cache);
// console.log(cache['./icon2.png']);
// var img = document.createElement('img');
// img.src = cache['./icon2.png'];
// document.body.appendChild(img);
export default cache;
