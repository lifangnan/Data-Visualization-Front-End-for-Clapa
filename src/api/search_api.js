import request from '@/utils/request'


export function getMongoSearch(col, query,offset) {
  console.log('col')
  return request({
    url: '/search/collection',
    method: 'post',
    data: { 
      //'col': col, 
      'query': query ,
      offset
    }
  })
}


export function getMongoCollection() {
  return request({
    url: '/search/collection/list',
    method: 'get',
  })
}

export function getMongoFields(col) {
  console.log('col')
  return request({
    url: '/search/collection/info',
    method: 'post',
    data: { 
      //'col': col 
    }
  })
}
