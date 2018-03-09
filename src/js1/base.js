Function.prototype.after = function(fn){
  var self = this;
  return function(){
    var ret = self.apply(this,arguments);
    if(ret ==='nextSuccessor'){
      return fn.apply(this,arguments);
    }
    return ret;
  }
}


// var order500yuan = function(orderType,pay,stock){
//   // if(orderType===1&&pay===true){
//   //   console.log('500success,100youhui');
//   // }else{
//   //   return 'nextSuccessor';
//   // }
//   return 'nextSuccessor';
// }

// var order200yuan = function(orderType,pay,stock){
//   // if(orderType===2&&pay===true){
//   //   console.log('200success,50youhui');
//   // }else{
//   //   return 'nextSuccessor';
//   // }
//   console.log('order200yuan');
//   //return 'nextSuccessor';
// }

// var orderNormal = function(orderType,pay,stock){
//   // if(stock>0){
//   //   console.log('normalpay,youhui');
//   // }else{
//   //   console.log('kucun buzu');
//   // }
//   console.log('kucun buzu');
// }

// var order = order500yuan.after(order200yuan).after(orderNormal);
// order(1,true,500);
// order(2,true,500);
// order(1,false,500);

// var handle = (function(){
//   debugger;
//   return 'nextSuccessor';
// })
// .after(function(){
//   debugger;
//   //return 'nextSuccessor';
// })
// .after(function(){
//   debugger;
// });

// handle();