import { InternalAxiosRequestConfig } from 'axios';

export default function sn(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    const c = JSON.parse(localStorage.getItem('config') || '{}');
    config.headers.SN = c.sn;
  }

  return config;
}
