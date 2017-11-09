import Vue from 'vue'
import Router from 'vue-router'
import fp from '@/components/fp'
import sp from '@/components/sp'
import fop from '@/components/fop'
import tp from '@/components/tp'
import sub from '@/components/sub'

Vue.use(Router)

 let router = new Router({
  routes: [
    {
      path: '/',
      name: 'fp',
      component: fp
    },
    {
      path: '/sp',
      name: 'sp',
      component: sp
    },
    {
      path: '/fop',
      name: 'fop',
      component: fop
    },
    {
      path: '/sub',
      name: 'sub',
      component: sub
    },
    {
      path: '/tp',
      name: 'tp',
      component: tp
    }
  ]
})
router.beforeEach(function(to,from,next){
   if (from.name===null){
   }
  next();
})
router.beforeResolve(function(to,from,next){
  next();
})
router.afterEach(function(to,from,next){
  
  if (from.name===null){
    router.push({path:'/'})
    return
  }
  let toIndex,fromIndex;
  router.options.routes.forEach(function(val,index){
    if (to.name == val.name){
      toIndex=index;
    }
    if (from.name==val.name){
      fromIndex = index;
    }
  })
  if (toIndex<fromIndex){
    router.push({path:'/'});
  }
})
export default router

