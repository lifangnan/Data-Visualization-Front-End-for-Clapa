import request from '@/utils/request'

export function getExpeIndex(lst_date) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params: lst_date
  })
}

export function getImgsUrlByIndex(Experiment_index) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params: Experiment_index
  })
}
