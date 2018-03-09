
// const fs = require('fs-extra');
// const cp = require('child_process');
// const path = require('path');
// const shelljs = require('shelljs');

// // console.log(__dirname,__filename);
// //console.log( path.basename(__filename) );
// // console.log( path.parse(__filename) );

// var dir = path.parse(__filename).dir;
// dir = dir.split(/\\/).pop();
// const baseu = 'd:/mu.xy.com/mufed';
// const baseu2 = 'd:/mu.xy.com/static/mufed';

// const u = baseu+'/'+dir+'/';
// const u2 = baseu2+'/'+dir+'/';

// // console.log(u,u2);

// // console.log('dist', u+'dist');

// try{
//   if(fs.existsSync(u) )fs.removeSync(u);

//   if(fs.existsSync(u2)) fs.removeSync(u2);
  
//   fs.copySync('dist', u2+'dist');
//   fs.copySync('./index.html', u+'index.html');

// }catch(err){
//   console.error('fs:',err);

//   process.exit(0);


// }
  


// Promise.all([
//   // svn delete scripts/*.js
//   new Promise(r=>{    
//     shelljs.exec(`cd ${baseu} && svn add ${dir} --force`,error=>{
//       console.log('add index:',error);
//       r();
//     })
    
//   })
//   // shelljs.exec(`cd ${baseu2} &&  svn delete ${dir}/dist/scripts/*.js && svn add ${dir} --force`,error=>{
// //      console.log('add static:',error);
// //      r();
// //    })
//   ,new Promise(r=>{
//     shelljs.exec(`cd ${baseu2} && svn add ${dir} --force`,error=>{
//       console.log('add static:',error);
//       r();
//     })
    
//   })

// ])
// .then(res=>{
//   console.log('svn add done..')

//   return new Promise(r=>{
//     setTimeout(()=>{

//       shelljs.exec(`cd ${baseu} && svn cleanup . && svn commit ${dir} -m "sync-code  qwq"`,error=>{
//         console.log('commit:',error);

//       });
//       shelljs.exec(`cd ${baseu2} && svn cleanup . && svn commit ${dir} -m "sync-code  qwq"`,(error)=>{
//         console.log('commit:',error);
//         r();
//       });


//     },566);
    
//   })
// })
// .then(res=>{
//   console.log('svn commit done..')
// })



const fs = require('fs-extra');
const cp = require('child_process');
const path = require('path');
const shelljs = require('shelljs');

// console.log(__dirname,__filename);
//console.log( path.basename(__filename) );
// console.log( path.parse(__filename) );

var dir = path.parse(__filename).dir;
dir = dir.split(/\\/).pop();
const baseu = 'd:/SV/mufed';
const baseu2 = 'd:/SV/static/mufed';

const u = baseu+'/'+dir+'/';
const u2 = baseu2+'/'+dir+'/';

// console.log(u,u2);

// console.log('dist', u+'dist');

try{
  if(fs.existsSync(u) )fs.removeSync(u);

  if(fs.existsSync(u2)) fs.removeSync(u2);
  
  fs.copySync('dist', u2+'dist');
  fs.copySync('./index.html', u+'index.html');

}catch(err){
  console.error('fs:',err);

  process.exit(0);


}
  


Promise.all([
  // svn delete scripts/*.js
  new Promise(r=>{    
    // shelljs.exec(`cd ${baseu} && svn add ${dir} --force`,error=>{
    //   console.log('add index:',error);
    //   r();
    // })
    
  })
  // shelljs.exec(`cd ${baseu2} &&  svn delete ${dir}/dist/scripts/*.js && svn add ${dir} --force`,error=>{
//      console.log('add static:',error);
//      r();
//    })
  ,new Promise(r=>{
    // shelljs.exec(`cd ${baseu2} && svn add ${dir} --force`,error=>{
    //   console.log('add static:',error);
    //   r();
    // })
    
  })

])
.then(res=>{
  console.log('svn add done..')

  return new Promise(r=>{
    setTimeout(()=>{

      // shelljs.exec(`cd ${baseu} && svn cleanup . && svn commit ${dir} -m "sync-code  qwq"`,error=>{
      //   console.log('commit:',error);

      // });
      // shelljs.exec(`cd ${baseu2} && svn cleanup . && svn commit ${dir} -m "sync-code  qwq"`,(error)=>{
      //   console.log('commit:',error);
      //   r();
      // });

      // shelljs.exec(`cd ${baseu} && svn cleanup . && svn commit ${dir} -m "sync-code  qwq"`,error=>{
      //   console.log('commit:',error);

      // });
      // shelljs.exec(`cd ${baseu2} && svn cleanup . && svn commit ${dir} -m "sync-code  qwq"`,(error)=>{
      //   console.log('commit:',error);
      //   r();
      // });


    },566);
    
  })
})
.then(res=>{
  console.log('svn commit done..')
})









