import request from '@/utils/request'
import { IUser, IRes } from '@/types'

export const login = (user: IUser) => {
  return request.post<IRes>('login/api', user)
}
