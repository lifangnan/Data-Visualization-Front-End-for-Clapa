import request from '@/utils/request'

export function get48HoursData(pvName) {
  return request({
    url: '/getdata48Hours',
    method: 'get',
    params: { 'pvName': pvName }
  })
}

export function getOneCurrentData(pvName) {
  return request({
    url: '/getOneCurrentData',
    method: 'get',
    params: { 'pvName': pvName }
  })
}

export function getFilenamesAndUrls(cameraName, startTime, endTime) {
  return request({
    url: '/getFilenamesAndUrls',
    method: 'get',
    params: { 'cameraName': cameraName, 'startTime': startTime, 'endTime': endTime }
  })
}

export function getArchiverData(pvName, startTime, endTime) {
  return request({
    url: '/getArchiverData',
    method: 'get',
    params: { 'pvName': pvName, 'startTime': startTime, 'endTime': endTime }
  })
}

export function getArchiverDataCSV(pvName_list, startTime, endTime) {
  return request({
    url: '/getArchiverDataCSV',
    method: 'get',
    params: { 'pvName_list': pvName_list, 'startTime': startTime, 'endTime': endTime }
  })
}

export function getExpeIndex(lst_date) {
  return request({
    url: '/table/list',
    method: 'get',
    params: lst_date
  })
}

export function getImgsUrlByIndex(Experiment_index) {
  return request({
    url: '/table/list',
    method: 'get',
    params: Experiment_index
  })
}
