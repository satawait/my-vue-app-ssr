import request from '@/utils/request'
import { IUser, IRes } from '@/types'

export const registerUser = (user: IUser) => {
  const formsData = new FormData()
  formsData.append('username', user.username)
  formsData.append('password', user.password)
  if (user.file) {
    formsData.append('file', user.file)
  }
  return request.upload<IRes>('users/api/upload', formsData)
}
export const updateUser = (user: IUser) => {
  return request.put<IRes>('users/api', user)
}
export const deleteUser = (user: IUser) => {
  return request.delete<IRes>('users/api', user)
}
export const getUser = (user: IUser) => {
  return request.get<IRes>(`users/api`, user)
}
